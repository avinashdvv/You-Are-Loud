# Your Are Loud - Mobile App

> **📖 For complete documentation, see [Mobile Technical Specification](../../docs/tech-spec/mobile.md)**

Cross-platform React Native application for iOS and Android that monitors your voice volume and provides real-time feedback.

## Quick Start

```bash
# Install dependencies
npm install

# For iOS: Install CocoaPods
cd ios && pod install && cd ..

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## Prerequisites

- Node.js >= 18
- React Native development environment
- **iOS**: Xcode 14+, CocoaPods
- **Android**: Android Studio, Android SDK

## Project Structure

```
apps/mobile/
├── src/          # Shared React Native code (both platforms)
├── android/      # Android native code
├── ios/          # iOS native code
└── package.json
```

## Key Features

- ✅ **Unified codebase** - Single source code for iOS & Android
- ✅ Real-time voice monitoring
- ✅ Adjustable volume threshold
- ✅ Push notifications when too loud
- ✅ Warning counter and statistics

## Development

```bash
# Start Metro bundler
npm start

# Run linter
npm run lint

# Run tests
npm test
```

## Documentation

For comprehensive documentation including:
- Architecture details
- Why we unified iOS/Android
- Technical specifications
- API documentation
- Build & deployment
- Troubleshooting

**👉 See [Mobile Technical Specification](../../docs/tech-spec/mobile.md)**

## Shared Packages

Uses monorepo shared packages:
- `@your-are-loud/core` - Core logic
- `@your-are-loud/audio-processing` - Audio algorithms
- `@your-are-loud/notifications` - Notification management

## License

MIT - See root LICENSE file
