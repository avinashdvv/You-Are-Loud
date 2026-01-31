# Product Requirements Document: Mobile App (iOS & Android)
## "You're Loud" - Voice Monitor in Your Pocket

**Version:** 1.0  
**Last Updated:** January 31, 2026  
**Project Type:** Open Source (Sponsor-Supported)  
**Status:** Development Phase  
**Platforms:** iOS 14+ and Android 8+  

---

## 📋 Executive Summary

### What is This?
A native mobile app for iPhone and Android that monitors your voice during calls and alerts you when you're speaking too loudly. Built with React Native for consistent experience across both platforms.

### Why Mobile Matters
The desktop apps (Chrome, macOS, Windows) are great, but modern professionals also need:
- **Phone call monitoring:** Not just video calls on computer
- **On-the-go awareness:** When calling from coffee shops, trains, public spaces
- **Portable solution:** Your volume coach in your pocket
- **Meeting room calls:** When you step away from your desk

### The Mobile Use Case Problem
Mobile professionals face unique challenges:
- Taking calls in public spaces (unaware how loud they are)
- Conference calls from phone in meeting rooms
- Walking and talking (volume varies with environment)
- No visual feedback like on desktop
- Phone held to ear (can't see screen easily)

### The Solution
A mobile app that:
1. Monitors microphone during phone/video calls
2. Vibrates when you're too loud (instant tactile feedback)
3. Shows persistent notification with volume level
4. Works with phone calls, WhatsApp, Zoom mobile, etc.
5. Minimizes battery drain
6. Respects mobile OS conventions

---

## 🎯 Target Users

### Primary: Mobile-First Professionals
**Profile:**
- Takes 5+ calls per day from phone
- Often in public spaces (cafes, co-working, transit)
- Uses phone for quick video calls
- Values phone battery life
- Switches between iPhone and Android (company + personal)

**Demographics:**
- Age: 25-45
- Occupation: Sales, consulting, remote work, freelancing
- Tech-comfortable but not developers
- Always has phone, not always has laptop

### Secondary: Considerate Phone Users
**Profile:**
- Conscious of speaking loudly in public
- Takes phone calls in shared living spaces
- Often on trains/buses with other passengers
- Wants to be a good neighbor

**Pain point:** "Am I speaking too loudly on this train?"

### Tertiary: Hybrid Workers
**Profile:**
- 3 days office, 2 days remote
- Takes overflow calls on mobile
- Walks and talks
- Needs volume monitoring on the go

---

## 💡 User Stories

### As a Sales Professional on the Go...
> "I take client calls from coffee shops. I need to know if I'm disturbing other customers without constantly worrying about it."

**Acceptance Criteria:**
- App vibrates when I exceed threshold
- Works alongside phone call app
- Doesn't drain battery during long call days
- Can quickly adjust sensitivity on the fly

### As a Parent Taking Calls at Home...
> "I step out of my home office to take calls from my phone. I want to know if I'm waking the baby."

**Acceptance Criteria:**
- Notification shows volume level in real-time
- Vibration is subtle (doesn't disturb baby)
- Easy to toggle on/off between calls
- Works with WhatsApp voice calls

### As a Commuter...
> "I take work calls on my commute. I want to be considerate of other passengers on the train."

**Acceptance Criteria:**
- Background monitoring while screen is off
- Low battery usage (commute is 45 min each way)
- Works with Bluetooth headset
- Vibration noticeable even with phone in pocket

### As Someone Who Uses Both iPhone and Android...
> "I have a work iPhone and personal Android. I want the same experience on both."

**Acceptance Criteria:**
- Identical interface on iOS and Android
- Settings sync if I use both (future feature)
- Same threshold levels work consistently
- Familiar experience switching between devices

---

## 🎨 User Experience

### Installation Flow

**App Store (iOS) / Play Store (Android)**
1. Search "You're Loud" or "voice volume monitor"
2. Tap Install (free download)
3. App icon appears on home screen
4. First launch requests permissions
5. Quick tutorial (3 screens, skippable)
6. Ready to use

**Time to first value:** Under 2 minutes

### First Launch Tutorial (Optional)

**Screen 1: Welcome**
- "Welcome to You're Loud"
- "Get alerted when your voice is too loud"
- Illustration: Person on phone with volume meter

**Screen 2: Permissions**
- "We need two permissions:"
- 🎤 Microphone - to monitor your volume
- 🔔 Notifications - to alert you
- "We never record or store audio"

**Screen 3: How It Works**
- "Start monitoring before calls"
- "Phone vibrates when you're loud"
- "Adjust threshold to your preference"
- [Get Started button]

### Main Screen Layout

```
┌─────────────────────────┐
│     You're Loud         │
│                         │
│   ┌───────────────┐     │
│   │               │     │
│   │   ████████    │     │ Volume Meter
│   │   ████████    │     │ (Large, visual)
│   │   ████░░░░    │     │
│   │   ░░░░░░░░    │     │
│   │      68%      │     │
│   └───────────────┘     │
│                         │
│ [●●●●●●●●●○○] 70%      │ Threshold Slider
│                         │
│  ┌─────────────────┐   │
│  │ Start Monitoring │   │ Big Button
│  └─────────────────┘   │
│                         │
│ Warnings Today: 3       │
│                         │
│ ⚙️ Settings              │
└─────────────────────────┘
```

### During Active Monitoring

**Screen On:**
- Full UI visible with real-time meter
- Threshold line shows on meter
- Color changes as volume increases
- Button changes to "Stop Monitoring"

**Screen Off (Locked):**
- Persistent notification shows status:
  - "🔊 Monitoring (Volume: 45%)"
- Notification updates every second
- Tap to open app

**When Threshold Exceeded:**
1. **Vibration pattern:** Bzz-bzz (distinctive)
2. **Notification updated:** "⚠️ You're too loud! (85%)"
3. **Cooldown:** Won't vibrate again for 3 seconds

---

## ⚙️ Core Features

### 1. Real-Time Volume Monitoring
**What it does:** Continuously analyzes microphone input.

**User benefit:** Always aware of current volume level.

**Mobile-specific:**
- Works with phone speaker or Bluetooth headset
- Optimized for battery efficiency
- Low latency (<100ms)

### 2. Vibration Alerts
**What it does:** Phone vibrates when threshold exceeded.

**User benefit:**
- Tactile feedback you can't miss
- Works even when phone is in pocket
- Doesn't require looking at screen
- Silent - doesn't disturb others

**Patterns:**
- Threshold exceeded: Short buzz (200ms)
- Can be disabled in settings

### 3. Persistent Notification
**What it does:** Shows real-time volume in notification shade.

**User benefit:**
- Glanceable status without opening app
- Works when screen is locked
- Quick access to stop monitoring
- System-native appearance

**iOS:** Notification with Live Activity (iOS 16+)  
**Android:** Persistent foreground service notification

### 4. Background Monitoring
**What it does:** Continues monitoring when app is in background.

**User benefit:**
- Lock phone during calls
- Switch to other apps
- Don't need to keep app open
- Normal phone usage continues

**Implementation:**
- iOS: Background audio permission
- Android: Foreground service (required for background mic)

### 5. Adjustable Threshold
**What it does:** Slider to set sensitivity (30-100%).

**User benefit:**
- Quick presets: Quiet / Normal / Loud
- Fine-tune with slider
- Save multiple profiles (future)

**Mobile-optimized:**
- Large touch target for slider
- Haptic feedback on adjustment
- Instant preview

### 6. Battery Optimization
**What it does:** Efficient audio processing to minimize battery drain.

**User benefit:**
- Use throughout workday without charging
- Doesn't heat up phone
- Smart resource management

**Benchmarks (target):**
- Battery drain: <5% per hour of monitoring
- CPU usage: <3%
- Works efficiently on older phones

### 7. Quick Start Widget (Future)
**What it does:** Home screen widget to start monitoring with one tap.

**User benefit:**
- Don't even need to open app
- One tap to start before call
- See status at a glance

**Platforms:**
- iOS: Widget Kit
- Android: Home screen widget

---

## 📱 Platform-Specific Features

### iOS Specific

**1. Live Activities (iOS 16+)**
- Real-time volume meter on lock screen
- Dynamic Island integration (iPhone 14 Pro+)
- Always visible during monitoring

**2. Shortcuts Integration**
- "Start Volume Monitoring" shortcut
- Automations: "When I join Zoom call, start monitoring"
- Siri: "Hey Siri, monitor my volume"

**3. Apple Watch Companion (Future)**
- Quick start/stop from watch
- Haptic feedback on wrist
- Volume level complication

**4. Focus Mode Integration**
- Respect Do Not Disturb
- Custom notification settings per Focus

### Android Specific

**1. Quick Settings Tile**
- Toggle monitoring from quick settings panel
- Swipe down, tap tile, start monitoring

**2. Persistent Notification Controls**
- Adjust threshold directly from notification
- Stop monitoring button in notification
- Volume level in notification text

**3. Battery Optimization Exemption**
- Request to disable battery optimization
- Ensure monitoring isn't killed in background

**4. Material You Theming**
- Follows system color scheme
- Dynamic colors (Android 12+)

---

## 🔋 Battery & Performance

### Battery Life Targets

**1-hour monitoring session:**
- Battery drain: <5%
- Phone temp: No noticeable increase
- Background: Doesn't prevent sleep

**8-hour workday:**
- Battery drain: <30%
- Comparable to podcast listening
- Can use phone normally

### Performance Optimization

**Audio Processing:**
- Sample rate: 16kHz (voice optimized, not 44.1kHz)
- Buffer size: Optimized for mobile
- RMS calculation: Single-pass algorithm
- Update frequency: 10 Hz (not 60 Hz like desktop)

**Network:** None (zero battery drain from networking)

**Screen:** Doesn't require screen on (unlike some apps)

---

## 🔒 Privacy & Mobile Security

### Permissions Required

**iOS:**
```xml
NSMicrophoneUsageDescription: 
"Monitor your voice volume to alert you when speaking too loudly"

NSUserNotificationsUsageDescription:
"Send alerts when your voice exceeds the threshold"
```

**Android:**
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

### Privacy Guarantees

**What we DON'T do:**
- ❌ Record audio
- ❌ Store audio files
- ❌ Send data to servers
- ❌ Access contacts or calls
- ❌ Track location
- ❌ Use analytics SDKs

**What we DO:**
- ✅ Process audio in real-time only
- ✅ Discard audio immediately after calculating volume
- ✅ Store only threshold preference locally
- ✅ Operate 100% offline

### App Store Privacy Labels

**iOS App Store:**
- Data Not Collected: ✓
- Data Used to Track You: None
- Data Linked to You: None

**Android Play Store:**
- No data shared with third parties
- No data collected
- Data not encrypted (because there is no data)

---

## 🚫 What This Is NOT

Mobile-specific clarifications:

❌ **Not a call recorder** - We don't record anything  
❌ **Not a call blocker** - Doesn't interfere with calls  
❌ **Not a voice changer** - Doesn't modify your voice  
❌ **Not a diagnostic tool** - Not for medical hearing tests  
❌ **Not a spy app** - Can't monitor other people  
❌ **Not background-running forever** - Only while monitoring  
❌ **Not available on tablets** - Phones only (for now)  

---

## 🗺️ Roadmap

### Version 1.0 - Core (Current Development)
- [ ] Real-time volume monitoring
- [ ] Vibration alerts
- [ ] Persistent notification
- [ ] Adjustable threshold
- [ ] Background monitoring
- [ ] Warning counter
- [ ] iOS and Android parity

### Version 1.1 - Mobile Polish
- [ ] Quick Settings tile (Android)
- [ ] Live Activities (iOS 16+)
- [ ] Threshold presets (Quiet/Normal/Loud)
- [ ] Haptic patterns customization
- [ ] Dark mode optimization

### Version 1.2 - Integration
- [ ] Shortcuts support (iOS)
- [ ] Home screen widgets
- [ ] Calendar integration (auto-start during meetings)
- [ ] Apple Watch companion

### Version 1.3 - Advanced
- [ ] Multiple threshold profiles
- [ ] Usage statistics and insights
- [ ] Bluetooth headset optimization
- [ ] Landscape mode support

### Community Driven
File feature requests on GitHub! Mobile users know what mobile users need.

---

## 💰 Sustainability Model

### Mobile Development Reality

**Why mobile is challenging for a solo dev:**
- Two platforms to maintain (iOS + Android)
- Annual Apple Developer membership: $99/year
- Google Play Console: $25 one-time
- Different testing requirements
- App store review processes
- Platform updates (new iOS/Android versions)
- Device fragmentation testing

### React Native Advantage
- **Single codebase** for both platforms (huge time saver)
- Shared business logic from TypeScript packages
- ~95% code reuse between iOS and Android
- Faster feature development
- Consistent UX

### What Sponsorship Enables
1. **Developer accounts:** $99/year Apple + $25 Google
2. **Testing devices:** Physical iOS and Android devices
3. **Development time:** Nights and weekends
4. **App store fees:** Submission and updates
5. **Long-term maintenance:** OS compatibility

### Sponsor Benefits (Mobile-Specific)
- **$5/month:** Name in app About screen
- **$15/month:** Priority bug fixes for your platform
- **$50/month:** Vote on next mobile feature
- **$100/month:** Beta testing access + direct feedback line

---

## 📊 Competitive Analysis

### Existing Mobile Solutions

**1. Built-in phone features**
- No volume alerts
- No threshold customization
- Must keep call screen visible

**2. Professional audio apps**
- AudioTools ($14.99) - Overkill, complex
- Decibel X (Free with ads) - Ads everywhere, privacy concerns
- Sound Meter apps - Not designed for calls

**3. Video app indicators**
- Zoom mobile has indicator
- Easy to ignore
- Doesn't work with phone calls

### Our Advantages
✅ **Free and open source**  
✅ **Call-focused** (not general sound meter)  
✅ **Privacy-first** (no ads, no tracking)  
✅ **Vibration alerts** (unique to calls)  
✅ **Works with any call app**  
✅ **Battery optimized**  

---

## 🚀 Launch Strategy

### Phase 1: TestFlight (iOS) & Internal Testing (Android)
1. **Private beta:** 50 testers
2. **Gather feedback:** Fix critical bugs
3. **Battery testing:** Ensure efficiency
4. **Duration:** 4-6 weeks

### Phase 2: App Store Launch
**iOS:**
1. Submit to App Review
2. Prepare App Store page with screenshots
3. Write clear privacy policy
4. Launch quietly first (soft launch)

**Android:**
1. Submit to Play Console
2. Internal testing track first
3. Staged rollout (10% → 50% → 100%)
4. Monitor crash reports

### Phase 3: Community Announcement
1. GitHub announcement
2. Reddit posts (r/productivity, r/Android, r/iOSProgramming)
3. Product Hunt (mobile app category)
4. Twitter/Mastodon announcement

### Phase 4: Growth
1. App Store Optimization (ASO)
   - Keywords: "volume monitor", "call loudness", "voice alert"
   - Screenshots showing key features
   - Short demo video

2. Word of mouth
   - Encourage users to rate/review
   - Share on social media

---

## 🤝 Community & Contribution

### How to Help (Mobile-Specific)

**As a User:**
- Beta test on your device
- Report device-specific bugs
- Rate on App Store / Play Store
- Share with mobile-using friends

**As a Developer:**
- React Native experience helpful
- iOS native modules (Swift)
- Android native modules (Kotlin)
- UI/UX improvements

**As a Designer:**
- App icon design
- Screenshots for stores
- Promotional graphics
- Tutorial illustrations

**As a Sponsor:**
- Cover developer account costs
- Enable device testing
- Support development time

---

## 📝 User Testimonials (Anticipated)

> "Finally works on my phone! I take most calls from mobile and this is a lifesaver." - Sales Rep

> "The vibration feedback is genius. I don't have to look at my phone to know I'm loud." - Consultant

> "Love that it works on both my work iPhone and personal Android." - Hybrid Worker

> "Battery drain is minimal. I can monitor all day without worry." - Mobile Power User

> "No ads, no tracking, just does what it says. Refreshing." - Privacy Advocate

---

## 🎓 Educational Value

### Learning from This Project

Mobile development topics covered:
- React Native cross-platform development
- Native module integration (iOS Swift, Android Kotlin)
- Background audio processing
- Battery optimization techniques
- Persistent notifications
- Vibration patterns
- App store submission process

### For Students
Great example of:
- Single codebase, multiple platforms
- Mobile UX best practices
- Privacy-first mobile development
- Open source mobile apps

---

## ⚡ Quick Reference

### For Users
- **Download:** App Store (iOS) / Play Store (Android)
- **Requirements:** iOS 14+ / Android 8+
- **Cost:** Free forever
- **Privacy:** Zero data collection
- **Battery:** <5% per hour

### For Beta Testers
- **iOS:** TestFlight link (request via GitHub)
- **Android:** Play Store internal testing
- **Feedback:** GitHub Issues
- **Updates:** Weekly during beta

### For Sponsors
- **Why:** Support mobile privacy tools
- **How:** GitHub Sponsors
- **Impact:** Enable multi-platform development
- **Benefits:** Recognition + influence

### For Contributors
- **Stack:** React Native + TypeScript
- **Native:** Swift (iOS) + Kotlin (Android)
- **Setup:** See mobile/README.md
- **License:** MIT

---

## 🎯 Core Value Proposition

**For Mobile Users:**  
"Your voice volume coach in your pocket - works with any call app, respects your privacy and battery."

**For Sponsors:**  
"Support the only open source, privacy-first voice monitor for mobile that works on both iOS and Android."

**For the Developer:**  
"Demonstrate React Native expertise while solving a real mobile-first problem with cross-platform architecture."

---

**This PRD represents a mobile-first approach to voice volume awareness, built for the realities of phone-based communication in 2026. Success measured in helpful alerts delivered and battery efficiency maintained.**

---

*Last updated: January 31, 2026*  
*Coming Soon: App Store & Play Store*  
*Want to beta test? Request access on GitHub*  
*Want to sponsor? Visit GitHub Sponsors page*
