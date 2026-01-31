# Your Are Loud - iOS App (React Native)

Mobile voice monitoring application for iOS devices.

## Overview

This is the iOS implementation of Your Are Loud, built using React Native. It shares most of its codebase with the Android app while using native iOS APIs for platform-specific features.

## Technology Stack

- **Framework**: React Native 0.73+
- **Language**: TypeScript
- **Audio**: `react-native-audio-record` or `expo-av`
- **Notifications**: `@react-native-community/push-notification-ios`
- **Permissions**: `react-native-permissions`
- **State Management**: React Context + Hooks or Zustand
- **UI**: React Native built-in components + custom components

## Prerequisites

- macOS (for iOS development)
- Xcode 15.0+
- Node.js 18+
- React Native CLI or Expo
- CocoaPods (for iOS dependencies)
- iOS device or simulator (iOS 13+)

## Project Structure

```
apps/ios/
├── package.json
├── tsconfig.json
├── metro.config.js
├── babel.config.js
├── App.tsx                      # Root component
├── src/
│   ├── components/
│   │   ├── VolumeMeter.tsx      # Volume visualization
│   │   ├── ThresholdSlider.tsx  # Threshold adjustment
│   │   └── MonitoringButton.tsx # Start/Stop button
│   ├── hooks/
│   │   ├── useAudioMonitoring.ts # Audio monitoring hook
│   │   └── usePermissions.ts    # Permission handling
│   ├── services/
│   │   ├── AudioService.ts      # Audio capture & processing
│   │   └── NotificationService.ts # Notifications
│   ├── contexts/
│   │   └── AudioContext.tsx     # Global audio state
│   ├── utils/
│   │   └── constants.ts         # App constants
│   └── types/
│       └── index.ts             # TypeScript types
├── ios/                         # Native iOS project
│   ├── YourAreLoud/
│   │   ├── Info.plist           # iOS app configuration
│   │   └── AppDelegate.mm       # iOS app delegate
│   ├── Podfile                  # CocoaPods dependencies
│   └── YourAreLoud.xcworkspace  # Xcode workspace
├── android/                     # Android project (see android README)
└── README.md                    # This file
```

## Getting Started

### 1. Initialize React Native Project

```bash
cd apps/ios

# Using React Native CLI
npx react-native@latest init YourAreLoud --template react-native-template-typescript

# OR using Expo
npx create-expo-app YourAreLoud --template
```

### 2. Install Dependencies

```bash
npm install

# Install shared packages from monorepo
npm install @your-are-loud/core @your-are-loud/audio-processing @your-are-loud/notifications

# Install React Native libraries
npm install react-native-audio-record
npm install @react-native-community/push-notification-ios
npm install react-native-permissions
npm install @react-native-async-storage/async-storage
```

### 3. Install iOS Pods

```bash
cd ios
pod install
cd ..
```

### 4. Update Info.plist

Add permissions to `ios/YourAreLoud/Info.plist`:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>We need access to your microphone to monitor your voice volume.</string>
<key>UIBackgroundModes</key>
<array>
    <string>audio</string>
</array>
```

### 5. Run the App

```bash
# iOS
npx react-native run-ios
# or
npm run ios

# Specific device
npx react-native run-ios --device "Your iPhone"
```

## Core Implementation

### App.tsx (Root Component)

```typescript
import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { AudioProvider } from './src/contexts/AudioContext';
import MainScreen from './src/screens/MainScreen';

function App(): JSX.Element {
  return (
    <AudioProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <MainScreen />
      </SafeAreaView>
    </AudioProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default App;
```

### AudioService.ts

```typescript
import AudioRecord from 'react-native-audio-record';
import { calculateRMS, normalizeVolume } from '@your-are-loud/audio-processing';
import { DEFAULT_VOLUME_THRESHOLD } from '@your-are-loud/core';

export class AudioService {
  private isRecording = false;
  private audioRecord: typeof AudioRecord;

  constructor() {
    const options = {
      sampleRate: 44100,
      channels: 1,
      bitsPerSample: 16,
      audioSource: 6, // VOICE_RECOGNITION
      wavFile: 'audio.wav',
    };

    AudioRecord.init(options);
  }

  async startMonitoring(onVolumeChange: (volume: number) => void) {
    this.isRecording = true;
    AudioRecord.start();

    // Poll audio data
    this.pollAudio(onVolumeChange);
  }

  stopMonitoring() {
    this.isRecording = false;
    AudioRecord.stop();
  }

  private async pollAudio(callback: (volume: number) => void) {
    while (this.isRecording) {
      try {
        const audioData = await AudioRecord.getAudioData();
        
        // Convert base64 to Float32Array
        const buffer = this.base64ToFloat32Array(audioData);
        
        // Use shared package for RMS calculation
        const rms = calculateRMS(buffer);
        
        // Use shared package for normalization
        const normalizedVolume = normalizeVolume(rms);
        
        callback(normalizedVolume);
        
        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error('Audio polling error:', error);
      }
    }
  }

  private base64ToFloat32Array(base64: string): Float32Array {
    // Implementation to convert base64 audio data to Float32Array
    // This is a simplified version
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    
    // Convert to 16-bit samples then to float
    const samples = new Float32Array(bytes.length / 2);
    for (let i = 0; i < samples.length; i++) {
      const int16 = (bytes[i * 2 + 1] << 8) | bytes[i * 2];
      samples[i] = int16 / 32768.0;
    }
    
    return samples;
  }
}
```

### useAudioMonitoring.ts (Hook)

```typescript
import { useState, useEffect, useCallback } from 'react';
import { AudioService } from '../services/AudioService';
import { NotificationService } from '../services/NotificationService';
import { ThresholdDetector } from '@your-are-loud/core';

export function useAudioMonitoring() {
  const [currentVolume, setCurrentVolume] = useState(0);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [volumeThreshold, setVolumeThreshold] = useState(0.7);
  const [warningCount, setWarningCount] = useState(0);

  const audioService = new AudioService();
  const notificationService = new NotificationService();
  const thresholdDetector = new ThresholdDetector(volumeThreshold);

  const startMonitoring = useCallback(async () => {
    try {
      await audioService.startMonitoring((volume) => {
        setCurrentVolume(volume);
        
        if (thresholdDetector.exceedsThreshold(volume)) {
          setWarningCount(prev => prev + 1);
          notificationService.showWarning();
        }
      });
      
      setIsMonitoring(true);
    } catch (error) {
      console.error('Failed to start monitoring:', error);
    }
  }, []);

  const stopMonitoring = useCallback(() => {
    audioService.stopMonitoring();
    setIsMonitoring(false);
    setCurrentVolume(0);
  }, []);

  useEffect(() => {
    return () => {
      if (isMonitoring) {
        stopMonitoring();
      }
    };
  }, [isMonitoring]);

  return {
    currentVolume,
    isMonitoring,
    volumeThreshold,
    warningCount,
    startMonitoring,
    stopMonitoring,
    setVolumeThreshold,
  };
}
```

### MainScreen.tsx

```typescript
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAudioMonitoring } from '../hooks/useAudioMonitoring';
import VolumeMeter from '../components/VolumeMeter';
import ThresholdSlider from '../components/ThresholdSlider';

export default function MainScreen() {
  const {
    currentVolume,
    isMonitoring,
    volumeThreshold,
    warningCount,
    startMonitoring,
    stopMonitoring,
    setVolumeThreshold,
  } = useAudioMonitoring();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎙️ Voice Monitor</Text>
      
      <VolumeMeter 
        volume={currentVolume} 
        threshold={volumeThreshold} 
      />
      
      <ThresholdSlider 
        value={volumeThreshold}
        onChange={setVolumeThreshold}
      />
      
      <Text style={styles.warningCount}>
        Warnings: {warningCount}
      </Text>
      
      <Button
        title={isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
        onPress={isMonitoring ? stopMonitoring : startMonitoring}
        color={isMonitoring ? '#FF0000' : '#00AA00'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  warningCount: {
    fontSize: 18,
    color: '#FF0000',
    marginVertical: 20,
  },
});
```

## Shared Package Integration

This app directly uses the TypeScript shared packages:

```typescript
import { 
  DEFAULT_VOLUME_THRESHOLD,
  ThresholdDetector 
} from '@your-are-loud/core';

import { 
  calculateRMS,
  normalizeVolume 
} from '@your-are-loud/audio-processing';

import { 
  NotificationManager 
} from '@your-are-loud/notifications';
```

## Permissions

### Microphone Permission

Handled with `react-native-permissions`:

```typescript
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

async function requestMicrophonePermission() {
  const result = await request(PERMISSIONS.IOS.MICROPHONE);
  
  if (result === RESULTS.GRANTED) {
    console.log('Microphone permission granted');
  } else {
    console.log('Microphone permission denied');
  }
}
```

### Notification Permission

```typescript
import PushNotificationIOS from '@react-native-community/push-notification-ios';

PushNotificationIOS.requestPermissions();
```

## Building for Distribution

### Development Build

```bash
npx react-native run-ios --configuration Debug
```

### Production Build

```bash
npx react-native run-ios --configuration Release
```

### TestFlight / App Store

1. Open `ios/YourAreLoud.xcworkspace` in Xcode
2. Select Generic iOS Device or Any iOS Device
3. Product → Archive
4. Distribute to App Store Connect
5. Upload to TestFlight

## Testing

### Manual Testing on Simulator

```bash
npx react-native run-ios --simulator="iPhone 15 Pro"
```

### Physical Device

```bash
npx react-native run-ios --device
```

### Unit Tests

```bash
npm test
```

### E2E Tests (Detox)

```bash
npm install --save-dev detox
detox test --configuration ios.sim.debug
```

## Troubleshooting

### Pod Install Fails

```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Build Errors

```bash
# Clean build
cd ios
xcodebuild clean
cd ..

# Clean cache
npm start -- --reset-cache
```

### Audio Not Working on Simulator

Note: Microphone input may not work on iOS Simulator. Test on a physical device.

## Integration with Android

The iOS and Android apps share ~90% of their code. See `apps/android/README.md` for Android-specific setup.

**Shared Code**:
- All TypeScript business logic
- React components
- Hooks and contexts
- Services (with platform-specific implementations)

**Platform-Specific**:
- Native modules (iOS/Android)
- Permissions (iOS Info.plist vs Android AndroidManifest.xml)
- Build configurations

## Roadmap

- [ ] Background audio monitoring
- [ ] Siri Shortcuts integration
- [ ] Apple Watch companion app
- [ ] Widget for home screen
- [ ] Dark mode support
- [ ] Haptic feedback

## Contributing

When working on the iOS app:
1. Test on both simulator and physical device
2. Keep shared code in sync with Android
3. Use TypeScript strict mode
4. Follow React Native best practices
5. Test on iOS 13+ devices

## License

MIT License - See root LICENSE file
