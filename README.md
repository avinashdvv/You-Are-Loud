# 🔊 Your Are Loud - Voice Monitor App

A macOS menu bar app that monitors your microphone during video calls and warns you when your voice gets too loud.

## Features

✅ **Real-time Voice Monitoring** - Continuously monitors your microphone input
✅ **Visual Volume Meter** - Color-coded display (Green → Yellow → Red)
✅ **Adjustable Threshold** - Customize sensitivity to your needs (0.3 - 1.0)
✅ **System Notifications** - Alerts you when speaking too loudly
✅ **Warning Counter** - Tracks how many times you've been too loud
✅ **Menu Bar Integration** - Runs discreetly in your menu bar
✅ **Privacy-Focused** - All processing happens locally on your Mac

## How to Use

### Opening the Project

1. **Navigate to the project directory:**
   ```bash
   cd /Users/vdevarakonda/Desktop/Learning/your-are-loud
   ```

2. **Open in Xcode:**
   ```bash
   open your-are-loud.xcodeproj
   ```
   
   Or double-click `your-are-loud.xcodeproj` in Finder.

### Building and Running

1. In Xcode, select your Mac as the build target (top toolbar)
2. Press **⌘R** (Cmd+R) to build and run
3. Grant microphone permission when prompted
4. Grant notification permission when prompted
5. The app icon will appear in your menu bar (look for 🌊 waveform icon)

### Using the App

1. **Click the menu bar icon** to open the control panel
2. **Click "Start Monitoring"** to begin voice monitoring
3. **Speak normally** - the volume meter will show your voice level
4. **Adjust the threshold slider** if needed:
   - Lower value = more sensitive (warns earlier)
   - Higher value = less sensitive (warns only when very loud)
5. When you speak too loudly:
   - 🔊 System beep sound
   - 📱 Notification: "You're Too Loud!"
   - Warning counter increments
6. **Click "Stop Monitoring"** when you're done

## System Requirements

- macOS 13.0 (Ventura) or later
- Xcode 14.0 or later
- Microphone access permission
- Notification permission

## Technical Details

### Technologies Used

- **SwiftUI** - Modern declarative UI framework
- **AVFoundation** - Audio capture and processing
- **AVAudioEngine** - Real-time audio monitoring
- **UserNotifications** - System notifications

### How It Works

1. **Audio Capture**: Uses `AVAudioEngine` to capture microphone input
2. **Signal Processing**: Calculates RMS (Root Mean Square) and converts to normalized volume (0.0 - 1.0)
3. **Threshold Detection**: Compares current volume against user-defined threshold
4. **Warning System**: Shows notifications with 3-second cooldown between warnings
5. **Visual Feedback**: Real-time color-coded volume meter

### Privacy & Security

- ✅ All audio processing happens **locally** on your device
- ✅ No audio data is stored or transmitted
- ✅ No internet connection required
- ✅ Audio is analyzed in real-time and immediately discarded

## Customization

You can customize the app by modifying these values in `AudioMonitor.swift`:

```swift
@Published var volumeThreshold: Float = 0.7  // Default warning threshold
private let warningCooldown: TimeInterval = 3.0  // Seconds between warnings
```

In `AudioMonitor.swift`, you can also customize the notification:

```swift
content.title = "🔊 You're Too Loud!"
content.body = "Please lower your voice during the call"
```

## Troubleshooting

### App doesn't appear in menu bar
- Make sure you've granted microphone permissions in System Settings
- Try restarting the app

### No notifications appearing
- Check System Settings → Notifications → your-are-loud
- Ensure notifications are enabled

### Microphone not working
- System Settings → Privacy & Security → Microphone
- Enable access for "your-are-loud"

### Volume meter not moving
- Test your microphone in another app to ensure it's working
- Check your input device in System Settings → Sound → Input

## Building for Distribution

To create a standalone app:

1. In Xcode: Product → Archive
2. Distribute App → Copy App
3. Share the .app file

**Note**: For distribution outside the App Store, users may need to:
- Right-click the app → Open (first time only)
- Grant microphone and notification permissions

## Contributing

Feel free to modify and improve this app for your needs!

## License

Free to use and modify.

---

**Made with ❤️ to help maintain a peaceful voice during video calls**
# You-Are-Loud
