# iOS Native Code

## Setup Required

The iOS native code needs to be initialized using React Native CLI.

### Initialize iOS Project

```bash
cd apps/mobile
npx react-native init-ios
```

Or manually create the iOS project using Xcode.

### Required Native Modules

The following native modules need to be configured:
- `react-native-audio-record` - for audio recording
- `@react-native-community/push-notification-ios` - for notifications
- `react-native-permissions` - for microphone permissions

### Permissions (Info.plist)

Add the following to your Info.plist:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>We need access to your microphone to monitor your voice volume</string>
```

## CocoaPods

After setting up the iOS project, install CocoaPods dependencies:

```bash
cd ios
pod install
cd ..
```

Then you can run the app:

```bash
npm run ios
```
