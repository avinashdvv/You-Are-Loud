# Mobile App (iOS & Android) - Technical Specification

## Overview

Unified React Native application for both iOS and Android platforms. Single shared codebase eliminates code duplication and ensures consistent behavior across both mobile platforms.

## Architecture

### Directory Structure

```
apps/mobile/
├── src/                    # Shared React Native code
│   ├── components/         # UI components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── screens/           # Screen components
│   └── services/          # Platform services
├── android/               # Android native code ONLY
│   └── app/
│       └── src/main/
│           ├── java/      # Java/Kotlin code
│           └── res/       # Android resources
├── ios/                   # iOS native code ONLY (to be initialized)
│   └── YourAreLoud/       # Swift/Objective-C code
├── App.tsx               # Root component
├── index.js              # Entry point
└── package.json          # Dependencies
```

### Why Unified?

**Before (Problematic):**
- `apps/android/` - Complete React Native app
- `apps/ios/` - Complete React Native app with duplicated code
- ❌ Code duplication
- ❌ Double maintenance
- ❌ Risk of inconsistencies

**After (Optimal):**
- `apps/mobile/` - Single React Native app
- ✅ Shared codebase (write once)
- ✅ Platform-specific native code separated
- ✅ Follows React Native best practices
- ✅ Easy maintenance

## Technology Stack

### Core Framework
- **React Native 0.73.2** - Cross-platform mobile framework
- **React 18.2.0** - UI library
- **TypeScript 5.3.3** - Type safety

### Audio Processing
- **react-native-audio-record** - Audio recording
- **@your-are-loud/audio-processing** - RMS calculation and normalization
- **@your-are-loud/core** - Threshold detection

### Notifications
- **react-native-push-notification** (Android)
- **@react-native-community/push-notification-ios** (iOS)
- **@your-are-loud/notifications** - Notification management

### Permissions
- **react-native-permissions** - Unified permissions API

### UI Components
- **@react-native-community/slider** - Threshold slider

### State Management
- **React Context API** - Global state management
- Custom hooks for business logic

## Shared Code Structure

### 1. Contexts

**AudioContext.tsx** - Global audio state management

```typescript
interface AudioState {
  currentVolume: number;      // 0.0 - 1.0
  isMonitoring: boolean;
  volumeThreshold: number;    // 0.3 - 1.0
  warningCount: number;
}
```

### 2. Components

**VolumeMeter.tsx** - Visual volume display
- Color-coded meter (green → yellow → red)
- Percentage display
- Real-time updates

**ThresholdSlider.tsx** - Adjustable threshold
- Range: 0.3 - 1.0
- Step: 0.01
- Real-time preview

### 3. Hooks

**useAudioMonitoring.ts** - Audio monitoring logic
- Permission requests
- Audio recording lifecycle
- Threshold detection
- Warning notifications

### 4. Services

**AudioService.ts** - Platform audio interface
- Start/stop monitoring
- Audio data capture
- Base64 to Float32Array conversion
- RMS calculation integration

### 5. Screens

**MainScreen.tsx** - Main application screen
- Volume meter display
- Threshold controls
- Start/stop button
- Warning counter

## Platform-Specific Code

### Android Native (android/)

**Gradle Configuration**
- `build.gradle` - Project configuration
- `app/build.gradle` - App configuration
- Permissions: RECORD_AUDIO, POST_NOTIFICATIONS

**Native Modules**
- MainActivity.kt - Entry point
- MainApplication.kt - Application class
- AndroidManifest.xml - Permissions and config

### iOS Native (ios/)

**CocoaPods Configuration**
- Podfile - Native dependencies
- Permissions: NSMicrophoneUsageDescription

**Native Modules** (to be initialized)
- AppDelegate - Entry point
- Info.plist - Permissions and config

## Data Flow

```
User Speaks
    ↓
Microphone Capture (react-native-audio-record)
    ↓
Base64 Audio Data
    ↓
Convert to Float32Array (AudioService)
    ↓
Calculate RMS (@your-are-loud/audio-processing)
    ↓
Normalize Volume (0.0-1.0)
    ↓
Check Threshold (ThresholdDetector)
    ↓
Show Notification (if exceeded)
```

## State Management

### AudioContext Provider

Wraps entire app, provides global state:
- Current volume level
- Monitoring status
- Volume threshold setting
- Warning count

### Custom Hook Pattern

`useAudioMonitoring` encapsulates all audio logic:
- Permission handling
- Recording lifecycle
- Threshold checking
- Notification triggering

## Permissions

### Android (AndroidManifest.xml)

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

### iOS (Info.plist)

```xml
<key>NSMicrophoneUsageDescription</key>
<string>We need access to your microphone to monitor your voice volume</string>
```

## Audio Processing

### Recording Configuration

```typescript
{
  sampleRate: 44100,      // Standard audio quality
  channels: 1,            // Mono recording
  bitsPerSample: 16,      // CD quality
  audioSource: 6,         // VOICE_RECOGNITION (Android)
  wavFile: 'audio.wav'
}
```

### Polling Interval

- 100ms updates (10 times per second)
- Balances responsiveness and performance

### Volume Calculation

1. Capture audio buffer (100ms chunk)
2. Convert Base64 → Float32Array
3. Calculate RMS: `sqrt(sum(samples²) / count)`
4. Normalize: `(20*log10(rms) + 50) / 50`
5. Clamp to 0.0-1.0 range

## Notification System

### Warning Cooldown

- Minimum 3 seconds between warnings
- Prevents notification spam
- Tracked per session

### Notification Content

```typescript
{
  title: "🔊 Voice Volume Warning",
  message: "You're speaking too loudly!",
  playSound: true,
  vibrate: true
}
```

## Build & Deployment

### Development

```bash
# Install dependencies
cd apps/mobile
npm install

# iOS
npm run ios
# or for specific device
npm run ios -- --device "iPhone 15"

# Android
npm run android
# or for specific emulator
npm run android -- --deviceId emulator-5554
```

### Production Builds

**iOS:**
```bash
cd ios
pod install
# Use Xcode to archive and distribute
```

**Android:**
```bash
cd android
./gradlew assembleRelease
# APK: android/app/build/outputs/apk/release/app-release.apk
```

## Testing Strategy

### Unit Tests
- Component rendering
- Hook logic
- State management
- Audio processing functions

### Integration Tests
- Audio service integration
- Permission flows
- Notification triggering

### Manual Testing
- Microphone capture quality
- Threshold accuracy
- Notification timing
- Battery usage

## Performance Optimization

### Audio Processing
- Efficient Float32Array conversion
- Minimal memory allocation
- 100ms polling interval (optimized)

### React Native
- Memoized components
- useCallback for event handlers
- Context provider optimization

### Battery Considerations
- Stop monitoring when app backgrounded
- Efficient audio buffer processing
- No unnecessary re-renders

## Security & Privacy

- ✅ No audio storage
- ✅ Local processing only
- ✅ No network requests
- ✅ Microphone permissions required
- ✅ Transparent data usage

## Known Limitations

### Current
- iOS native code needs initialization
- No background monitoring (iOS restrictions)
- Android 13+ requires runtime notification permission

### Future Enhancements
- Background monitoring (where permitted)
- Bluetooth headset support
- Custom notification sounds
- Volume history graphs
- Export warning statistics

## Dependencies

### Runtime Dependencies
```json
{
  "@your-are-loud/core": "workspace:*",
  "@your-are-loud/audio-processing": "workspace:*",
  "@your-are-loud/notifications": "workspace:*",
  "react": "18.2.0",
  "react-native": "0.73.2",
  "react-native-audio-record": "^0.2.2",
  "react-native-push-notification": "^8.1.1",
  "@react-native-community/push-notification-ios": "^1.11.0",
  "react-native-permissions": "^4.1.0",
  "@react-native-async-storage/async-storage": "^1.21.0",
  "@react-native-community/slider": "^4.5.0"
}
```

### Dev Dependencies
```json
{
  "@react-native/babel-preset": "^0.73.19",
  "@react-native/eslint-config": "^0.73.2",
  "@react-native/metro-config": "^0.73.3",
  "@react-native/typescript-config": "^0.73.1",
  "@types/react": "^18.2.48",
  "@types/react-native": "^0.73.0",
  "typescript": "^5.3.3"
}
```

## Troubleshooting

### Metro Bundler Issues
```bash
npm start -- --reset-cache
```

### Android Build Issues
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### iOS Build Issues
```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

### Permission Not Working
- Check device settings
- Restart app after granting permission
- Test on physical device (not simulator)

## Migration Benefits

### Before (Separate Apps)
- 2 separate directories
- Duplicated code in src/
- 2 package.json files to maintain
- 2 times the testing effort

### After (Unified App)
- 1 directory: `apps/mobile/`
- Shared code in src/
- 1 package.json
- Test once, works on both platforms

### Code Reduction
- **Eliminated**: ~95% code duplication
- **Shared**: All React/TypeScript code
- **Platform-specific**: Only native code

## References

- [React Native Documentation](https://reactnative.dev/)
- [React Native Audio Record](https://github.com/goodatlas/react-native-audio-record)
- [React Native Permissions](https://github.com/zoontek/react-native-permissions)
- [Your Are Loud Core Package](../../packages/core/README.md)
- [Your Are Loud Audio Processing](../../packages/audio-processing/README.md)

---

**Last Updated**: January 2026
