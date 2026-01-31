# Product Requirements Document: Windows App
## "You're Loud" - Voice Volume Monitor for Windows PC

**Version:** 1.0  
**Last Updated:** January 31, 2026  
**Project Type:** Open Source (Sponsor-Supported)  
**Status:** Development Phase  
**Platform:** Windows 10+ (x64 and ARM64)  

---

## 📋 Executive Summary

### What is This?
A native Windows desktop application that monitors your voice in real-time and alerts you when you're speaking too loudly during video calls. Lives in your system tray, works across all applications.

### Why Windows Needs This
Windows is the dominant enterprise OS. Many remote workers use:
- Windows laptops for work
- Native Teams desktop app (not browser)
- Desktop Zoom, Webex, Slack calls
- Multiple monitors (harder to notice browser extensions)
- System tray utilities (familiar pattern)

### The Windows User Problem
Windows professionals conducting video calls face:
- Teams desktop app not covered by browser extensions
- Corporate policies preventing browser extension installation
- Multiple monitors (visual cues in browser tab get missed)
- Need system-wide solution, not browser-specific
- Want Windows-native experience

### The Solution
A lightweight system tray application that:
1. Lives in Windows system tray (near clock)
2. Monitors microphone across all applications
3. Shows real-time volume in tray menu
4. Sends Windows 10/11 toast notifications
5. Plays system alert sound
6. Works with Teams, Zoom, Slack desktop apps
7. Feels like a native Windows utility

---

## 🎯 Target Users

### Primary: Enterprise Windows Users
**Profile:**
- Corporate laptop running Windows 10/11
- Uses Microsoft Teams desktop app daily
- 5-10+ hours of video calls per week
- Dual monitor setup (or more)
- Familiar with system tray utilities
- May have limited ability to install browser extensions

**Demographics:**
- Age: 30-55
- Occupation: Corporate employees, managers, consultants
- Tech-comfortable but not developers
- Values productivity tools

**Environment:**
- Windows 10 Pro / Windows 11 Pro
- Domain-joined or Azure AD
- IT policies in place
- Office 365 ecosystem

### Secondary: Windows Power Users
**Profile:**
- Builds custom PCs
- Uses Windows exclusively (gaming PC doubles as work PC)
- Appreciates lightweight utilities
- Customizes taskbar and tray
- Runs many system tray apps

### Tertiary: Windows Switchers
**Profile:**
- Previously used Mac, now on Windows for work
- Misses macOS menu bar apps
- Looking for Windows equivalents
- Appreciates native Windows tools

---

## 💡 User Stories

### As a Microsoft Teams User...
> "I use Teams desktop app all day. I need volume monitoring that works outside the browser."

**Acceptance Criteria:**
- App monitors system microphone, works with Teams desktop
- Doesn't interfere with Teams' audio processing
- Accessible from system tray during calls
- Native Windows notifications

### As an Enterprise Employee...
> "I can't install browser extensions due to corporate policy, but I can run portable apps."

**Acceptance Criteria:**
- Works without admin privileges (if possible)
- Portable mode available (run from USB)
- No browser dependencies
- Respects corporate firewall (no network calls)

### As a Dual Monitor User...
> "My video call is on monitor 1, but I'm working on monitor 2. I miss visual cues in browser tabs."

**Acceptance Criteria:**
- System tray icon visible on all monitors
- Toast notifications appear on active monitor
- Audio alert catches attention across screens
- Doesn't require looking at specific window

### As a Windows 11 User...
> "I want this to feel like it belongs on Windows 11, with modern design and integration."

**Acceptance Criteria:**
- Windows 11 visual design language
- Rounded corners and modern styling
- Supports light and dark themes
- WinUI 3 components (if applicable)

### As Someone with Multiple Video Apps...
> "I use Teams for work, Zoom for clients, and Discord for side projects. I need one solution."

**Acceptance Criteria:**
- Works with Teams, Zoom, Webex, Slack, Discord
- Single threshold setting or per-app settings
- Monitors whichever app is active
- No switching needed

---

## 🎨 User Experience

### Installation Flow

**Option 1: Installer (Most Users)**
1. Download .msi installer from GitHub
2. Run installer (may require User Account Control approval)
3. Choose install location
4. Create desktop shortcut (optional)
5. Launch automatically (optional)
6. App appears in system tray

**Time to first value:** Under 2 minutes

**Option 2: Portable (Enterprise Users)**
1. Download .zip file
2. Extract to any folder
3. Run executable
4. No installation required
5. Can run from USB drive

**Option 3: Microsoft Store (Future)**
- One-click install
- Automatic updates
- Sandboxed environment

### First Launch Experience
1. App starts and appears in system tray
2. Microphone permission prompt (Windows 10+)
3. User grants permission in Windows Settings
4. Tray icon shows green indicator (ready)
5. Click tray icon to open menu
6. Simple menu shows:
   - Volume meter (currently 0%)
   - "Start Monitoring" button
   - Settings option

**Key principle:** Familiar to Windows users. Behaves like OneDrive, Dropbox, or other tray apps.

### Daily Use Pattern

**Morning:**
1. PC boots up
2. App launches automatically (if configured)
3. Tray icon appears - user knows it's available
4. No interaction needed unless user wants to check

**During Calls:**
1. User joins Teams/Zoom call
2. Right-clicks tray icon
3. Clicks "Start Monitoring"
4. Menu closes - monitoring happens in background
5. Tray icon changes color (blue = monitoring)
6. If voice gets too loud:
   - Windows toast notification appears
   - System beep plays
   - User adjusts volume
7. After call: Right-click → "Stop Monitoring"

**Alternative flow:**
- Set "Auto-start when Windows starts"
- Monitoring always on, set and forget

---

## ⚙️ Core Features

### 1. System Tray Integration
**What it does:** Lives in Windows system tray alongside other utilities.

**User benefit:**
- Always accessible (click or right-click tray icon)
- Doesn't clutter desktop or taskbar
- Follows Windows conventions
- Minimal screen real estate

**Tray Icon States:**
- 🟢 Green: Ready (not monitoring)
- 🔵 Blue: Monitoring active
- 🔴 Red: Currently loud (threshold exceeded)
- ⚪ Gray: Permission needed or error

### 2. System-Wide Monitoring
**What it does:** Monitors Windows audio input regardless of which app is using microphone.

**User benefit:**
- Works with Teams desktop app
- Works with Zoom, Webex, Slack, Discord
- Works with legacy apps (Skype, etc.)
- One solution for all communication apps

**How it works:** Uses NAudio library to tap into Windows audio input device before applications receive it.

### 3. Windows Toast Notifications
**What it does:** Native Windows 10/11 notifications when threshold exceeded.

**User benefit:**
- Familiar notification style
- Appears on all monitors
- Shows in Action Center for review
- Respects Focus Assist mode

**Notification content:**
- Title: "🔊 Voice Volume Alert"
- Body: "You're speaking too loudly!"
- Action: "Adjust Threshold"
- App attribution: "You're Loud"

### 4. System Sound Alert
**What it does:** Plays Windows system beep when too loud.

**User benefit:**
- Immediate audio feedback
- Works even if notifications are dismissed
- Can be toggled off if annoying

**Sound:** Uses System.Media.SystemSounds.Beep or custom .wav

### 5. Threshold Customization
**What it does:** Slider in settings to adjust sensitivity.

**User benefit:**
- Set based on your environment
- Quick presets: Quiet (50%) / Normal (70%) / Loud (85%)
- Fine-tune with slider
- Test in real-time

**Settings window:**
```
┌─────────────────────────────────┐
│   You're Loud - Settings        │
├─────────────────────────────────┤
│                                 │
│ Volume Threshold:               │
│ [────────●─────] 70%           │
│                                 │
│ Quick Presets:                  │
│ [Quiet] [Normal] [Loud]        │
│                                 │
│ Alerts:                         │
│ ☑ Show notifications            │
│ ☑ Play sound alert              │
│                                 │
│ Startup:                        │
│ ☑ Launch when Windows starts    │
│ ☑ Start minimized to tray       │
│                                 │
│ Warning Cooldown: 3 seconds     │
│                                 │
│ Warnings Today: 5               │
│ [Reset Counter]                 │
│                                 │
│        [Save]    [Cancel]       │
└─────────────────────────────────┘
```

### 6. Real-Time Volume Display
**What it does:** Tray menu shows live volume meter.

**User benefit:**
- Quick check of current volume
- Visual confirmation monitoring is working
- No need to open full window

**Tray Menu (when clicked):**
```
┌─────────────────────────────┐
│  You're Loud               │
├─────────────────────────────┤
│ Current Volume:             │
│ ▓▓▓▓▓▓▓▓▓░░░░░░ 62%        │
│                             │
│ Status: Monitoring Active   │
│ Warnings: 3                 │
│                             │
│ [Stop Monitoring]           │
│ Settings...                 │
│ About...                    │
│ Exit                        │
└─────────────────────────────┘
```

### 7. Lightweight & Efficient
**What it does:** Minimal resource usage, optimized for Windows.

**User benefit:**
- Doesn't slow down PC
- Low CPU usage (<2%)
- Small memory footprint (<50MB)
- Doesn't affect other apps

**Benchmarks (target):**
- CPU: < 2% on modern PCs
- RAM: < 50MB
- Disk: < 10MB installed
- Boot time impact: <1 second

### 8. Windows 11 Modern Design
**What it does:** Follows Windows 11 design language.

**User benefit:**
- Looks modern on Windows 11
- Rounded corners
- Fluent Design System
- Feels native to OS

**Also works on Windows 10** with appropriate styling.

---

## 🪟 Windows-Specific Features

### Windows 11 Enhancements
- **Snap Layouts:** Settings window supports snap
- **Rounded Corners:** Modern UI styling
- **Mica Material:** Translucent background (if applicable)
- **Dark Mode:** Follows system theme automatically

### Windows 10 Compatibility
- **Flat Design:** Adapts to Windows 10 style
- **Classic Tray:** Standard tray icon behavior
- **Toast Notifications:** Windows 10 notification style

### Power User Features
- **Portable Mode:** Run without installation
- **Command Line:** Start/stop via command line
- **Registry Integration:** Proper Windows uninstall
- **Multiple Audio Devices:** Choose which microphone to monitor

### Enterprise Considerations
- **No Admin Required:** Runs in user space (if possible)
- **Group Policy Friendly:** Can be deployed centrally
- **Silent Install:** For IT deployment
- **No Telemetry:** Respects corporate privacy policies

---

## 🎨 Design Principles

### Windows-Native Feel
- Follows Windows design guidelines
- Uses system fonts (Segoe UI)
- Respects system theme (light/dark)
- Standard Windows controls

### Familiar Patterns
- Behaves like OneDrive, Dropbox, etc.
- Right-click menu for common actions
- Double-click for main window
- Tray icon tooltips

### Accessibility
- High contrast mode support
- Screen reader compatible
- Keyboard shortcuts
- Follows Windows accessibility guidelines

### Professional
- Clean, business-appropriate design
- No flashy animations
- Subtle, non-distracting
- Efficient workflow

---

## 🚫 What This Is NOT

Windows-specific clarifications:

❌ **Not a game overlay** - No in-game display  
❌ **Not a system service** - User-level application  
❌ **Not a driver** - No kernel-mode code  
❌ **Not antivirus/firewall** - Doesn't access network or files  
❌ **Not Teams/Zoom replacement** - Works alongside them  
❌ **Not a voice changer** - Doesn't modify audio  
❌ **Not always-on recorder** - Only monitors when you activate it  

---

## 🗺️ Roadmap

### Version 1.0 - Foundation
- [ ] System tray integration
- [ ] Real-time volume monitoring
- [ ] Windows toast notifications
- [ ] System beep alerts
- [ ] Adjustable threshold
- [ ] Settings window
- [ ] Warning counter
- [ ] Auto-start option

### Version 1.1 - Polish
- [ ] Windows 11 modern design
- [ ] Dark mode optimization
- [ ] Keyboard shortcuts
- [ ] Multiple microphone selection
- [ ] Per-app threshold settings

### Version 1.2 - Power User
- [ ] Command line interface
- [ ] Portable mode improvements
- [ ] Volume history graph
- [ ] Export statistics
- [ ] Hotkey customization

### Version 1.3 - Enterprise
- [ ] Silent installer for IT
- [ ] Group Policy templates
- [ ] Logging for troubleshooting
- [ ] Centralized deployment guide

### Version 2.0 - Advanced
- [ ] Microsoft Store release
- [ ] Windows ARM64 native build
- [ ] Integration with Windows Hello (future)
- [ ] Teams plugin (if possible)

---

## 💰 Sustainability Model

### Windows Development Challenges

**Why Windows app development needs support:**
- **Development tools:** Visual Studio license ($45/month or Community Edition)
- **Code signing certificate:** $100-300/year (required for trusted installs)
- **Testing:** Multiple Windows versions (10, 11)
- **Testing:** Different hardware configurations
- **Distribution:** Hosting installers
- **Support:** Windows-specific issues

### What Sponsorship Enables
1. **Code signing certificate:** Users don't get "Unknown Publisher" warnings
2. **Testing VMs:** Test on Windows 10, 11, Server
3. **Development time:** Nights and weekends
4. **Microsoft Store submission:** $19 one-time (if we go that route)
5. **Long-term maintenance:** Windows updates compatibility

### Sponsor Benefits (Windows-Specific)
- **$5/month:** Name in About dialog
- **$15/month:** Priority Windows-specific bug fixes
- **$50/month:** Vote on next Windows feature
- **$100/month:** Beta access + direct feedback line

### Why Not Paid Software?
- **Open source transparency:** Users can verify privacy claims
- **Community contributions:** Better than solo development
- **Alignment with mission:** Privacy-first, not profit-first
- **Sustainable via sponsors:** Better than one-time purchase model

---

## 🔒 Privacy & Security

### Data Collection
**What we collect:** Nothing.

**What happens on your PC:**
1. App accesses microphone (with permission)
2. NAudio processes audio locally
3. Volume level calculated
4. Threshold comparison
5. Audio discarded immediately

**No storage, no network, no logging.**

### Windows Permissions
**Required:**
- Microphone access (via Windows Privacy Settings)

**Optional:**
- Notifications (can be disabled by user)
- Startup (user-configurable)

**Not required:**
- Admin privileges (user-level app)
- Network access (no internet needed)
- File system (except own settings)

### Code Signing
**Why it matters:**
- Windows SmartScreen won't warn about "Unknown Publisher"
- Users trust signed applications
- Prevents tampering

**Sponsorship goal:** $200-300/year for certificate

### Antivirus False Positives
**Potential issue:** Unsigned apps may trigger antivirus

**Solution:**
- Code signing reduces this
- Open source = users can verify
- Instructions for adding exception
- Build from source option

---

## 📊 Competitive Analysis

### Existing Windows Solutions

**1. Professional audio software**
- Adobe Audition (expensive, overkill)
- Audacity (not designed for real-time monitoring)
- Voicemeeter (complex audio routing)

**2. Built-in Windows features**
- Sound settings show input level
- Must keep Settings open
- No threshold alerts

**3. Teams/Zoom built-in**
- Basic volume indicators
- Easy to ignore
- App-specific (doesn't help others)

### Our Advantages
✅ **Free and open source**  
✅ **System-wide** (all apps)  
✅ **Privacy-respecting**  
✅ **Windows-native** experience  
✅ **Lightweight** (<10MB)  
✅ **Purpose-built** for volume awareness  

---

## 🚀 Launch Strategy

### Phase 1: Development
1. **Core functionality:** Get it working
2. **Alpha testing:** Solo dev testing
3. **Code signing:** Secure certificate

### Phase 2: Beta Testing
1. **Private beta:** 20-30 Windows users
2. **Test on different Windows versions:**
   - Windows 10 (21H2, 22H2)
   - Windows 11 (21H2, 22H2, 23H2)
3. **Gather feedback**
4. **Fix bugs**
5. **Duration:** 4-6 weeks

### Phase 3: Public Launch
1. **GitHub Release:**
   - Signed .msi installer
   - Portable .zip
   - Installation instructions
   - Changelog

2. **Community announcement:**
   - Reddit (r/Windows10, r/Windows11, r/productivity)
   - Hacker News
   - Twitter/Mastodon
   - LinkedIn (professional audience)

### Phase 4: Growth
1. **Word of mouth:** Windows users help Windows users
2. **Corporate outreach:** Offer to enterprise IT departments
3. **Tech blogs:** Reach out to Windows-focused publications
4. **Microsoft Store:** (Future) If appropriate

---

## 🤝 Community & Contribution

### How to Help (Windows-Specific)

**As a User:**
- Beta test on your Windows PC
- Report bugs with Windows version details
- Share with Windows-using colleagues
- Rate/review if on Microsoft Store

**As a Developer:**
- C# / .NET experience helpful
- WPF or WinUI knowledge
- NAudio experience (audio processing)
- Testing on different Windows versions

**As an IT Professional:**
- Test in enterprise environment
- Provide feedback on deployment
- Help create Group Policy templates
- Suggest enterprise features

**As a Sponsor:**
- Enable code signing certificate
- Support testing infrastructure
- Fund development time

---

## 📝 User Testimonials (Anticipated)

> "Finally works with Teams desktop! Browser extensions didn't help me." - Enterprise Employee

> "Lightweight and doesn't slow down my PC. Perfect." - Windows Power User

> "Love that it's in the system tray. Feels like a native Windows utility." - IT Manager

> "No admin required, I could install it on my work laptop without calling IT." - Remote Worker

> "Open source and privacy-respecting. Exactly what Windows needs more of." - Privacy Advocate

---

## 🎓 Educational Value

### Learning from This Project

Windows development topics covered:
- C# and .NET development
- WPF or WinUI application design
- NAudio library usage
- System tray application patterns
- Windows notification system
- Audio processing on Windows
- Code signing and distribution

### For Students
Great example of:
- Windows desktop application architecture
- MVVM pattern in WPF
- Windows API integration
- Accessible, privacy-first software

---

## ⚡ Quick Reference

### For Users
- **Download:** GitHub Releases
- **Requirements:** Windows 10 (1809+) or Windows 11
- **Cost:** Free forever
- **Privacy:** Zero data collection
- **Support:** GitHub Issues

### For Beta Testers
- **Access:** Request via GitHub Discussions
- **Feedback:** GitHub Issues (tag with "beta")
- **Updates:** Weekly during beta period
- **Requirements:** Willingness to test on your PC

### For Sponsors
- **Why:** Support Windows privacy tools
- **How:** GitHub Sponsors
- **Impact:** Enable professional distribution (code signing)
- **Benefits:** Recognition + influence

### For Contributors
- **Language:** C#
- **Framework:** .NET 6+ / WPF or WinUI
- **Audio:** NAudio library
- **IDE:** Visual Studio 2022+
- **License:** MIT

---

## 🎯 Core Value Proposition

**For Windows Users:**  
"A native Windows tray app that helps you be aware of your speaking volume - works system-wide with Teams, Zoom, and all your call apps."

**For Sponsors:**  
"Support the only open source, privacy-first voice monitor designed specifically for Windows users and enterprise environments."

**For the Developer:**  
"Demonstrate C#/.NET expertise while solving a Windows-specific problem that browser extensions can't address."

---

**This PRD represents a Windows-native solution to voice volume awareness, respecting Windows design patterns and enterprise requirements. Success measured in corporate deployments and satisfied Windows users.**

---

*Last updated: January 31, 2026*  
*Coming Soon: GitHub Releases*  
*Want to beta test? Request access on GitHub*  
*Want to sponsor? Visit GitHub Sponsors page*
