# Your Are Loud - macOS App

This is the native macOS application built with Swift and SwiftUI.

## Overview

The macOS app is a menu bar application that monitors your microphone and alerts you when your voice gets too loud during video calls.

## Technology Stack

- **Language**: Swift 5.7+
- **Framework**: SwiftUI
- **Audio Processing**: AVFoundation, AVAudioEngine
- **Notifications**: UserNotifications framework
- **UI**: Menu Bar Extra (macOS 13+)

## Prerequisites

- macOS 13.0 (Ventura) or later
- Xcode 14.0 or later
- Swift 5.7+

## Building and Running

### Using Xcode

1. Open the project:
   ```bash
   cd apps/macos
   open your-are-loud.xcodeproj
   ```

2. Select your Mac as the build target

3. Press **⌘R** (Cmd+R) to build and run

### Using Command Line

```bash
cd apps/macos
xcodebuild -project your-are-loud.xcodeproj -scheme your-are-loud -configuration Debug
```

## Project Structure

```
apps/macos/
├── your-are-loud.xcodeproj/   # Xcode project file
├── AudioMonitor.swift          # Core audio monitoring logic
├── ContentView.swift           # SwiftUI main view
├── your_are_loudApp.swift      # App entry point (MenuBarExtra)
├── Info.plist                  # App configuration
├── Assets.xcassets/            # App icons and assets
└── README.md                   # This file
```

## Key Files

### AudioMonitor.swift
Contains the core audio monitoring logic:
- Captures microphone input using AVAudioEngine
- Calculates RMS (Root Mean Square) for volume measurement
- Normalizes volume to 0.0 - 1.0 range
- Manages threshold detection and warning cooldown
- Triggers system notifications and beeps

### ContentView.swift
SwiftUI-based user interface:
- Volume meter with color coding (green/yellow/red)
- Threshold adjustment slider
- Warning counter
- Start/Stop monitoring controls

### your_are_loudApp.swift
App lifecycle and menu bar integration:
- Configures MenuBarExtra for menu bar presence
- Initializes AudioMonitor as StateObject
- Passes monitor to ContentView via EnvironmentObject

## Audio Processing Algorithm

The app uses the following algorithm (compatible with shared TypeScript packages):

1. **Capture Audio**: AVAudioEngine captures microphone input
2. **Calculate RMS**: `sqrt(sum(samples^2) / count)`
3. **Convert to dB**: `20 * log10(rms)`
4. **Normalize**: `(dB + 50) / 50` (clamped to 0.0 - 1.0)
5. **Threshold Check**: Compare against user threshold (default 0.7)
6. **Warning**: If exceeded, show notification (with 3-second cooldown)

## Permissions

The app requires two permissions:

1. **Microphone Access**: For monitoring audio input
   - Location: System Settings → Privacy & Security → Microphone

2. **Notifications**: For warning alerts
   - Location: System Settings → Notifications → your-are-loud

## Configuration

### Constants (in AudioMonitor.swift)

```swift
@Published var volumeThreshold: Float = 0.7  // Default threshold (0.3 - 1.0)
private let warningCooldown: TimeInterval = 3.0  // Seconds between warnings
```

### Customization

To customize warning messages, edit `AudioMonitor.swift`:

```swift
content.title = "🔊 You're Too Loud!"
content.body = "Please lower your voice during the call"
```

## Integration with Monorepo

This macOS app is part of a larger monorepo that includes:
- Windows desktop app (apps/windows)
- iOS/Android mobile apps (apps/ios, apps/android)
- Chrome extension (apps/chrome-extension)
- Shared TypeScript packages (packages/)

### Shared Logic

While the macOS app is fully native Swift, the audio processing algorithms match those in the shared TypeScript packages (`@your-are-loud/audio-processing`). This ensures consistent behavior across all platforms.

**Equivalent Logic Mapping:**
- Swift `AudioMonitor` ↔ TypeScript `AudioBufferProcessor`
- Swift RMS calculation ↔ TypeScript `calculateRMS()`
- Swift normalization ↔ TypeScript `normalizeVolume()`
- Swift threshold check ↔ TypeScript `ThresholdDetector`

### Future Enhancement: Native/TypeScript Bridge

In the future, we may add a JavaScript bridge to directly use the TypeScript packages from Swift (via WKWebView or similar). For now, the algorithms are reimplemented in Swift.

## Testing

### Manual Testing

1. Run the app
2. Grant microphone and notification permissions
3. Click the menu bar icon and start monitoring
4. Speak at varying volumes
5. Verify volume meter responds
6. Speak loudly to trigger warnings
7. Confirm notifications appear

### Unit Testing (Future)

To add unit tests:
1. In Xcode: File → New → Target → Unit Testing Bundle
2. Test AudioMonitor logic separately from UI
3. Mock AVAudioEngine for testing

## Distribution

### Development Build
1. In Xcode: Product → Archive
2. Distribute App → Copy App
3. The .app file can be shared directly

### App Store Distribution
1. Configure signing in Xcode
2. Product → Archive
3. Distribute App → App Store Connect
4. Follow Apple's submission process

### Notarization (for distribution outside App Store)
```bash
# After archiving
xcrun notarytool submit your-are-loud.app.zip --apple-id your@email.com --wait
```

## Troubleshooting

### Build Errors
- Ensure you're using Xcode 14+ with macOS 13+ SDK
- Clean build folder: Shift+Cmd+K or Product → Clean Build Folder
- Reset package cache if using SPM: File → Packages → Reset Package Caches

### Runtime Issues
- **No menu bar icon**: Check that the app is running (look in Activity Monitor)
- **No audio input**: Check microphone permissions
- **No notifications**: Check notification permissions
- **Xcode project not found**: Make sure you're in `apps/macos/` directory

### Microphone Not Working
1. System Settings → Privacy & Security → Microphone
2. Enable access for "your-are-loud"
3. Restart the app

## Changelog

### Version 1.0.0
- Initial release
- Real-time audio monitoring
- Adjustable threshold
- System notifications
- Menu bar integration

### Version 1.0.1 (Monorepo Migration)
- Migrated to monorepo structure
- Updated documentation
- No functional changes

## Contributing

When making changes to the macOS app:

1. Keep the audio algorithms in sync with TypeScript packages
2. Update this README if adding new features
3. Test on macOS 13+ (minimum supported version)
4. Follow Swift coding conventions
5. Run SwiftLint if configured

## License

MIT License - See root LICENSE file

---

**macOS-specific questions?** See main monorepo documentation at `/docs/`
