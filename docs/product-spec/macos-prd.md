# Product Requirements Document: macOS App
## "You're Loud" - Native Voice Volume Monitor for Mac

**Version:** 1.0  
**Last Updated:** January 31, 2026  
**Project Type:** Open Source (Sponsor-Supported)  
**Status:** Functional & Available  

---

## 📋 Executive Summary

### What is This?
A native macOS menu bar app that monitors your voice in real-time and alerts you when you're speaking too loudly. It lives in your menu bar, works system-wide across all applications, and provides instant feedback.

### Why a Native Mac App?
While the Chrome extension works great for browser-based calls, many Mac users need:
- **System-wide monitoring:** Works with native Zoom, Slack, Discord, FaceTime, etc.
- **Menu bar integration:** Always accessible without opening browser
- **Native performance:** Lower battery usage, optimized for Apple Silicon
- **macOS design language:** Feels like it belongs on Mac

### The macOS User Problem
Mac users conducting video calls through native apps (not browser) experience:
- No awareness when speaking too loudly
- Zoom/Teams desktop apps aren't monitored by browser extensions
- Existing audio tools are too complex or expensive
- Need something that "just works" on Mac

### The Solution
A lightweight menu bar app that:
1. Lives in your menu bar (near WiFi/Battery icons)
2. Monitors microphone across all applications
3. Shows real-time volume in a dropdown menu
4. Sends native macOS notifications when too loud
5. Plays system alert sound for immediate feedback
6. Respects macOS privacy and design principles

---

## 🎯 Target Users

### Primary: Mac Power Users
**Profile:**
- Uses macOS exclusively (MacBook Pro/Air, iMac)
- Conducts 10+ video calls per week
- Uses native apps (Zoom desktop, Slack calls, Teams app)
- Values native Mac experience
- Appreciates menu bar utilities
- Likely has other menu bar apps (Bartender, Alfred, etc.)

**Demographics:**
- Age: 28-50
- Occupation: Professional/Creative
- Tech-savvy but not necessarily developers
- Values quality tools that respect macOS conventions

### Secondary: macOS First-Timers
**Profile:**
- Recently switched from Windows
- Learning macOS ecosystem
- Appreciates apps that feel "Mac-like"
- Exploring productivity tools

### Tertiary: Remote Team Leaders
**Profile:**
- Manages remote teams on Mac
- In meetings 4+ hours daily
- Needs to maintain professional presence
- Willing to sponsor tools that help team

---

## 💡 User Stories

### As a macOS User with Native Zoom...
> "I use Zoom desktop app, not the browser version. I need volume monitoring that works with my setup."

**Acceptance Criteria:**
- App monitors system microphone, regardless of which app is using it
- Works alongside Zoom, Teams, Slack, Discord, FaceTime
- Doesn't interfere with app's own audio processing
- Accessible from menu bar at all times

### As a Menu Bar App Enthusiast...
> "I love keeping my tools in the menu bar. It should look and behave like a native Mac app."

**Acceptance Criteria:**
- Menu bar icon that matches system appearance
- Dropdown follows macOS design guidelines
- Supports light and dark mode automatically
- Uses SF Symbols (Apple's icon system)
- Respects menu bar spacing and positioning

### As a Mac User Concerned with Battery Life...
> "I need this to work all day without draining my MacBook battery."

**Acceptance Criteria:**
- Minimal CPU usage (<2%)
- Efficient audio processing (native AVFoundation)
- Doesn't prevent Mac from sleeping
- Works on Apple Silicon (M1/M2/M3) efficiently

### As a Privacy-Conscious Mac User...
> "I want to be sure this app isn't recording me or sending data anywhere."

**Acceptance Criteria:**
- Requests microphone permission properly (macOS privacy popup)
- Clearly listed in System Settings → Privacy → Microphone
- Open source code I can audit
- No network connections whatsoever
- Fully offline operation

### As a Podcast Editor on Mac...
> "I want to use this while recording to maintain consistent volume levels."

**Acceptance Criteria:**
- Works alongside recording software
- Low latency feedback
- Precise volume readings
- Doesn't interfere with recording

---

## 🎨 User Experience

### Installation Flow

**Option 1: Direct Download**
1. Download .dmg from GitHub releases
2. Open .dmg file
3. Drag app to Applications folder
4. Double-click to launch
5. Menu bar icon appears
6. macOS requests microphone permission
7. User grants permission
8. Ready to use

**Time to first value:** Under 1 minute

**Option 2: Homebrew (Future)**
```bash
brew install --cask your-are-loud
```

### First Launch Experience
1. App opens with menu bar icon
2. User clicks icon
3. Dropdown menu appears with:
   - "Microphone permission needed" (if not granted)
   - "Click here to open System Settings"
4. User grants permission in System Settings
5. App automatically detects permission granted
6. UI updates to show volume meter
7. User can immediately start monitoring

**Key principle:** Respect macOS conventions. Don't fight the system.

### Daily Use Pattern

**Morning:**
1. Mac starts up, app launches automatically (if enabled)
2. Icon appears in menu bar - user knows it's running
3. Icon is subtle (just icon, no text clutter)

**During Calls:**
1. User starts video call (any app)
2. Clicks menu bar icon to verify monitoring
3. Volume meter shows real-time levels
4. User adjusts threshold if needed
5. Closes dropdown - monitoring continues
6. If voice gets too loud:
   - Native macOS notification appears
   - System beep plays (optional)
   - User adjusts volume

**End of Day:**
1. App continues running (uses minimal resources)
2. User can quit from menu if desired
3. Settings persist for tomorrow

**Interaction frequency:**
- Check status: 1-2 times per call
- Adjust settings: Once per week
- Notice it's there: Every time looking at menu bar

---

## ⚙️ Core Features

### 1. Menu Bar Integration
**What it does:** Lives in menu bar alongside system controls.

**User benefit:**
- Always accessible (one click away)
- Doesn't clutter Dock
- Follows macOS design patterns
- Feels like a native Apple tool

**Design details:**
- Icon: 🔊 or custom SF Symbol
- Monochrome (adapts to light/dark mode)
- Single click opens dropdown
- Right-click for quick actions

### 2. System-Wide Monitoring
**What it does:** Monitors microphone regardless of which app is using it.

**User benefit:**
- Works with Zoom desktop app
- Works with Teams, Slack, Discord
- Works with FaceTime
- Works with any app that uses microphone

**How it works:** Uses AVFoundation to tap into system audio input before apps receive it.

### 3. Real-Time Volume Display
**What it does:** Dropdown menu shows live volume meter.

**User benefit:**
- See exactly how loud you are
- Visual feedback in real-time
- Color-coded (green/yellow/red)

**Design:**
```
┌─────────────────────────────┐
│ 🔊 You're Loud             │
├─────────────────────────────┤
│ Current Volume:             │
│ ▓▓▓▓▓▓▓▓░░░░░░░░ 56%      │
│                             │
│ Threshold: [─────●──] 70%  │
│                             │
│ Warnings Today: 3           │
│                             │
│ ☑ Monitoring Active         │
│ ☑ Notifications On          │
│ ☐ Launch at Startup         │
│                             │
│ Quit                        │
└─────────────────────────────┘
```

### 4. Native macOS Notifications
**What it does:** Uses macOS notification center when threshold exceeded.

**User benefit:**
- Familiar notification style
- Respects Do Not Disturb mode
- Shows in Notification Center for review
- Sounds and badges follow system settings

**Notification content:**
- Title: "🔊 Voice Volume Alert"
- Body: "You're speaking too loudly!"
- Sound: System default (customizable)

### 5. System Alert Sound
**What it does:** Plays macOS beep sound when too loud.

**User benefit:**
- Immediate audio feedback
- Works even if notifications are hidden
- Can be toggled off if annoying

**Sound:** Uses NSSound.beep() - the classic Mac alert

### 6. Adjustable Threshold
**What it does:** Slider to set your volume limit.

**User benefit:**
- Customize for your environment
- Different sensitivity for home vs. office
- Real-time preview as you adjust

**Range:** 30% - 100% (0.01 increments for precision)

### 7. Launch at Startup
**What it does:** Automatically starts when you log in.

**User benefit:**
- Set it and forget it
- Always protected, never have to remember to launch

**Implementation:** Standard macOS login item

### 8. Low Resource Usage
**What it does:** Efficient native code, optimized for Mac.

**User benefit:**
- Doesn't drain battery
- Doesn't slow down Mac
- Works efficiently on Apple Silicon

**Benchmarks:**
- CPU: < 2%
- RAM: < 30MB
- Battery impact: Negligible

---

## 🎨 Design Principles

### Native macOS Feel
- Uses SF Symbols (Apple's design system)
- Follows Human Interface Guidelines
- Supports light and dark mode
- Uses system fonts (SF Pro)
- Respects accessibility settings

### Minimal and Unobtrusive
- Small menu bar footprint
- Clean, simple dropdown
- No unnecessary features
- Doesn't demand attention (unless you're loud)

### Discoverable
- Clear labels
- Helpful tooltips on hover
- Good first-launch experience
- Easy to understand at a glance

### Respectful
- Requests permissions politely
- Explains why permissions are needed
- Easy to quit or disable
- Follows macOS privacy standards

---

## 🚫 What This Is NOT

Setting expectations clearly:

❌ **Not a recording app** - No audio is saved  
❌ **Not an audio effects processor** - Doesn't change your voice  
❌ **Not a replacement for audio interfaces** - Not for professional studio use  
❌ **Not a bandwidth monitor** - Only watches volume  
❌ **Not an automatic volume adjuster** - You stay in control  
❌ **Not iOS/iPadOS compatible** - macOS only (for now)  

---

## 🗺️ Roadmap

### Version 1.0 (Current) ✅
- Menu bar app
- Real-time volume monitoring
- Native notifications
- System beep alerts
- Adjustable threshold
- Warning counter
- Launch at startup option
- Light/dark mode support

### Version 1.1 - Polish
- [ ] Customizable notification sound
- [ ] Keyboard shortcut to toggle monitoring
- [ ] Quick threshold presets in menu
- [ ] Volume history graph
- [ ] Export statistics

### Version 1.2 - Advanced
- [ ] Per-app threshold settings
- [ ] Scheduling (auto-enable during work hours)
- [ ] Touch Bar support (if Mac has Touch Bar)
- [ ] Shortcuts app integration (macOS 12+)

### Version 1.3 - Integration
- [ ] Sync settings via iCloud
- [ ] iOS companion app (if sponsored)
- [ ] Apple Watch glance

### Community Requested
Open to suggestions! File GitHub issues with ideas.

---

## 🍎 macOS-Specific Considerations

### System Requirements
- **Minimum:** macOS 11 (Big Sur)
- **Recommended:** macOS 13 (Ventura) or later
- **Architecture:** Universal binary (Intel + Apple Silicon)

### Compatibility
**Works on:**
- MacBook Pro (all models)
- MacBook Air (all models)
- iMac (all models)
- Mac Mini (all models)
- Mac Pro (all models)
- Mac Studio

**Optimized for:**
- Apple Silicon (M1/M2/M3) - native performance
- Retina displays - high resolution UI
- Dark mode - automatic adaptation

### Permissions
**Required:**
- Microphone Access (NSMicrophoneUsageDescription)

**Optional:**
- Notifications (can be disabled by user)
- Accessibility (future feature for advanced control)

### Privacy
- Listed in System Settings → Privacy & Security → Microphone
- User can revoke permission anytime
- App respects permission changes immediately

---

## 💰 Sustainability Model

### Why This Needs Sponsorship

**Reality check:** As a solo developer with a full-time job, maintaining a macOS app requires:
- **Xcode updates:** Every year, new macOS version compatibility
- **Testing:** Multiple macOS versions and Mac models
- **Code signing:** $99/year Apple Developer Program membership
- **Notarization:** Distribute outside Mac App Store safely
- **Support:** Respond to issues and questions

### What Sponsorship Enables
1. **Apple Developer Program:** $99/year for code signing
2. **Testing hardware:** Access to different Mac models
3. **Development time:** Hours taken from evenings/weekends
4. **Feature development:** Time to build requested features
5. **Long-term maintenance:** Years of macOS compatibility

### Sponsor Benefits
- **$5/month:** Name in app credits
- **$15/month:** Above + priority bug fixes
- **$50/month:** Above + feature voting rights
- **$100/month:** Above + monthly dev update calls

### Alternative to Mac App Store
**Why not sell on Mac App Store?**
- Store takes 30% cut
- Subscription pressures (need ongoing revenue)
- Less control over distribution
- Open source conflicts with paid model

**Open source + sponsorship** aligns better with the privacy-first, community-driven vision.

---

## 🔒 Privacy & Security

### Data Collection
**What we collect:** Absolutely nothing.

**What happens on your Mac:**
1. App accesses microphone (with permission)
2. AVFoundation processes audio locally
3. Volume level calculated
4. Threshold comparison performed
5. Audio discarded immediately

**No storage, no transmission, no logging.**

### Security
- **Code signing:** Signed with Apple Developer ID
- **Notarization:** Apple-verified for malware
- **Sandboxing:** (Future) Run in restricted environment
- **Open source:** Anyone can audit code

### Verifiable Claims
- Check source code on GitHub
- No network code in entire project
- No file writing operations (except preferences)
- All processing in memory only

---

## 📊 Competitive Analysis

### Existing Solutions

**1. Third-party macOS audio tools**
- Sound Source ($39) - Professional, expensive, complex
- Audio Hijack ($64) - Overkill for volume monitoring
- Loopback ($99+) - For audio routing, not monitoring

**2. Built-in Mac features**
- Input level meter in System Settings - Must keep Settings open
- No threshold alerts
- Not accessible during calls

**3. Video app features**
- Zoom/Teams have volume indicators
- Easy to ignore
- Not persistent across apps

### Our Advantages
✅ **Free and open source**  
✅ **Privacy-respecting**  
✅ **Purpose-built for volume awareness**  
✅ **Lightweight and always available**  
✅ **Native Mac experience**  
✅ **System-wide (works with all apps)**  

---

## 🎓 Educational Value

### Learning from This Project

This codebase demonstrates:
- **Swift/SwiftUI:** Modern Apple development
- **AVFoundation:** Audio processing on macOS
- **Menu bar apps:** NSStatusItem implementation
- **User Notifications:** Native macOS notifications
- **Permissions:** Proper privacy request handling
- **Open source:** Community-driven development

### For Students
Great example of:
- Native macOS app architecture
- Audio processing concepts
- Apple Human Interface Guidelines
- Donation-supported software model

---

## 🚀 Distribution Strategy

### Phase 1: Direct Distribution
1. **GitHub Releases**
   - .dmg file for download
   - Code signing certificate
   - Notarization for Gatekeeper

2. **Community Sharing**
   - Post to r/macapps
   - Share on Hacker News
   - Twitter/Mastodon announcement

### Phase 2: Discovery
1. **Mac productivity blogs**
   - Reach out to macOS app review sites
   - Share with Mac Power Users podcast
   - Product Hunt launch

2. **Developer community**
   - Show off in Swift/iOS dev communities
   - Example project for learners

### Phase 3: Growth
1. **Homebrew Cask** (if sponsored)
   - Submit to homebrew-cask
   - Easy installation via terminal

2. **Setapp consideration** (if appropriate)
   - Subscription model for users
   - Predictable revenue for development

---

## 🤝 Community & Contribution

### How to Help

**As a User:**
- Try the app and report bugs
- Share with Mac-using colleagues
- Star the GitHub repo
- Write a blog post/review

**As a Developer:**
- Fix bugs (Swift knowledge helpful)
- Add features (SwiftUI experience)
- Improve documentation
- Create tutorial videos

**As a Sponsor:**
- Monthly GitHub Sponsors support
- One-time donation via GitHub
- Corporate sponsorship for teams

### Code Contributions Welcome
**Areas needing help:**
- UI/UX improvements
- Additional features
- Performance optimization
- Testing on different Macs
- Localization to other languages

---

## 📝 User Testimonials (Anticipated)

> "This is exactly what I needed. Works perfectly with Zoom desktop on my MacBook Pro." - Software Developer

> "Finally, a menu bar app that respects my privacy AND actually solves a problem." - Privacy Advocate

> "So Mac-like. Looks like it was made by Apple. Love it." - Designer

> "Worth sponsoring. We use it across our entire remote team." - Startup CTO

> "Lighter and more focused than professional audio tools. Perfect for my needs." - Podcast Host

---

## ⚡ Quick Reference

### For Users
- **Download:** GitHub Releases page
- **Requirements:** macOS 11+
- **Cost:** Free (sponsorship appreciated)
- **Privacy:** Zero data collection
- **Support:** GitHub Issues

### For Sponsors
- **Why:** Support native Mac tools
- **How:** GitHub Sponsors
- **Benefit:** Credits + influence
- **Impact:** Visible and direct

### For Contributors
- **Language:** Swift
- **Framework:** SwiftUI
- **IDE:** Xcode 14+
- **License:** MIT

---

## 🎯 Core Value Proposition

**For Mac Users:**  
"A native menu bar app that helps you be aware of your speaking volume - built specifically for macOS, respecting privacy and design principles."

**For Sponsors:**  
"Support a truly native Mac tool that helps remote workers communicate better - while demonstrating how open source can thrive on Apple platforms."

**For the Developer:**  
"Showcase Swift/SwiftUI skills while building something genuinely useful for the Mac community."

---

**This PRD outlines a vision for a high-quality, privacy-respecting native macOS tool that serves the Apple ecosystem well. Success measured in happy Mac users and a sustainable sponsorship base.**

---

*Last updated: January 31, 2026*  
*macOS users: Download from GitHub Releases*  
*Want to sponsor? Visit GitHub Sponsors page*
