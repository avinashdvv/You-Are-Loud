# Your Are Loud - Android App (React Native)

Mobile voice monitoring application for Android devices.

## Overview

This is the Android implementation of Your Are Loud, built using React Native. It shares its codebase with the iOS app (see `apps/ios/README.md`), with platform-specific configurations for Android.

## Technology Stack

- **Framework**: React Native 0.73+
- **Language**: TypeScript
- **Audio**: `react-native-audio-record`
- **Notifications**: `@notifee/react-native` or `react-native-push-notification`
- **Permissions**: `react-native-permissions`
- **Build**: Gradle

## Prerequisites

- Android Studio
- Android SDK (API 21+, Android 5.0+)
- Node.js 18+
- JDK 17
- Android device or emulator

## Quick Start

### 1. Update AndroidManifest.xml

Add permissions to `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest>
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
</manifest>
```

### 2. Install Dependencies

```bash
cd apps/android  # or apps/ios (they share package.json)
npm install
```

### 3. Run on Android

```bash
npx react-native run-android

# Or specific device
npx react-native run-android --deviceId=<device-id>
```

## Project Structure

The Android-specific files are in `android/` directory:

```
apps/android/
├── android/
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml
│   │   │   ├── java/com/yourareloud/
│   │   │   │   └── MainActivity.java
│   │   │   └── res/
│   │   └── build.gradle
│   ├── build.gradle
│   ├── gradle.properties
│   └── settings.gradle
└── (shared code with iOS in src/)
```

## Shared Codebase

The Android app shares 90%+ of its code with iOS:
- See `apps/ios/README.md` for full code examples
- All TypeScript code is shared
- All React components are shared
- Business logic uses shared packages

## Android-Specific Configurations

### build.gradle (Module-level)

```gradle
android {
    compileSdkVersion 34
    
    defaultConfig {
        applicationId "com.yourareloud"
        minSdkVersion 21
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
    }
}

dependencies {
    implementation 'com.facebook.react:react-native:+'
    // Add other dependencies as needed
}
```

### Permissions Handling

```typescript
import { PermissionsAndroid } from 'react-native';

async function requestMicrophonePermission() {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    {
      title: 'Microphone Permission',
      message: 'This app needs access to your microphone to monitor voice volume.',
      buttonPositive: 'OK',
    }
  );
  
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}
```

## Building for Production

### Generate Release APK

```bash
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

### Generate Release AAB (for Play Store)

```bash
cd android
./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

### Signing Configuration

Add to `android/app/build.gradle`:

```gradle
android {
    signingConfigs {
        release {
            storeFile file('your-release-key.keystore')
            storePassword 'your-password'
            keyAlias 'your-key-alias'
            keyPassword 'your-password'
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

## Testing

### On Emulator

```bash
npx react-native run-android --variant=debug
```

### On Physical Device

1. Enable USB debugging on your device
2. Connect via USB
3. Run: `adb devices` to verify connection
4. Run: `npx react-native run-android`

### Unit Tests

```bash
npm test
```

## Troubleshooting

### Gradle Build Fails

```bash
cd android
./gradlew clean
cd ..
```

### Metro Bundler Issues

```bash
npm start -- --reset-cache
```

### Audio Permission Denied

Check that `RECORD_AUDIO` permission is granted in device settings.

## Integration with iOS

See `apps/ios/README.md` for:
- Shared code structure
- TypeScript services and hooks
- React components
- Shared package integration

## Contributing

Follow React Native and Android best practices. Keep code shared with iOS whenever possible.

## License

MIT License - See root LICENSE file
