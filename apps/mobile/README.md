# Your Are Loud - Mobile App

Cross-platform React Native application for iOS and Android that monitors your voice volume and provides real-time feedback.

## Features

- Real-time voice volume monitoring
- Adjustable volume threshold
- Visual volume meter
- Push notifications when speaking too loudly
- Warning counter with statistics

## Prerequisites

- Node.js >= 18
- React Native development environment set up
- For iOS: Xcode and CocoaPods
- For Android: Android Studio and Android SDK

## Installation

```bash
# Install dependencies
npm install

# For iOS only
cd ios && pod install && cd ..
```

## Running the App

### Android

```bash
npm run android
```

### iOS

```bash
npm run ios
```

## Development

```bash
# Start Metro bundler
npm start

# Run linter
npm run lint

# Run tests
npm test
```

## Project Structure

```
apps/mobile/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts for state management
│   ├── hooks/          # Custom React hooks
│   ├── screens/        # Screen components
│   └── services/       # Platform services
├── android/            # Android native code
├── ios/                # iOS native code (to be initialized)
├── App.tsx             # Root component
└── index.js            # App entry point
```

## Shared Packages

This app uses shared packages from the monorepo:

- `@your-are-loud/core` - Core logic and threshold detection
- `@your-are-loud/audio-processing` - Audio processing utilities
- `@your-are-loud/notifications` - Notification management

## Permissions

### Android

- `RECORD_AUDIO` - Required for voice monitoring
- `POST_NOTIFICATIONS` - Required for push notifications (Android 13+)

### iOS

- `NSMicrophoneUsageDescription` - Required for voice monitoring
- Notification permissions requested at runtime

## Building for Production

### Android

```bash
cd android
./gradlew assembleRelease
```

### iOS

Use Xcode to archive and distribute the app.

## License

See root LICENSE file.
