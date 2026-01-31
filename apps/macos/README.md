# Your Are Loud - macOS App

> **📖 For complete documentation, see [macOS Technical Specification](../../docs/tech-spec/macos.md)**

Native macOS application with menu bar integration that monitors your voice volume during calls.

## Quick Start

```bash
# Open in Xcode
open your-are-loud.xcodeproj

# Or build from command line
xcodebuild -project your-are-loud.xcodeproj \
           -scheme your-are-loud \
           -configuration Debug \
           build
```

## Prerequisites

- macOS 12.0+ (Monterey or later)
- Xcode 14+
- Swift 5.7+

## Project Structure

```
apps/macos/
├── your-are-loud.xcodeproj/
├── your_are_loudApp.swift    # App entry point
├── ContentView.swift          # Main UI
├── AudioMonitor.swift         # Audio monitoring
├── Assets.xcassets/           # App icons & assets
└── Info.plist                 # App configuration
```

## Key Features

- ✅ **Native macOS app** - Swift + SwiftUI
- ✅ Menu bar integration
- ✅ Real-time voice monitoring with AVFoundation
- ✅ Visual volume meter
- ✅ System notifications
- ✅ Background monitoring

## Development

```bash
# Run in Xcode
# Press Cmd+R to build and run

# Run tests
# Press Cmd+U in Xcode
```

## Technology Stack

- **Swift 5.7+** - Programming language
- **SwiftUI** - UI framework
- **AVFoundation** - Audio processing
- **UserNotifications** - System notifications

## Permissions

The app requires microphone access:
- Automatically requests permission on first launch
- Configure in System Settings → Privacy & Security → Microphone

## Documentation

For comprehensive documentation including:
- Architecture details
- AVFoundation audio pipeline
- Menu bar implementation
- Build configuration
- Code signing & distribution

**👉 See [macOS Technical Specification](../../docs/tech-spec/macos.md)**

## Status

✅ **Complete and functional** - This is the reference implementation

## License

MIT - See root LICENSE file
