# Product Requirements Document: Chrome Extension
## "You're Loud" - Voice Volume Monitor for Video Calls

**Version:** 1.0  
**Last Updated:** January 31, 2026  
**Project Type:** Open Source (Sponsor-Supported)  
**Status:** Available for Use  

---

## 📋 Executive Summary

### What is This?
A Chrome browser extension that monitors your voice during video calls and alerts you when you're speaking too loudly. Think of it as a personal volume coach that lives in your browser.

### The Problem We're Solving
Working from home has become permanent for many people. But without the natural feedback of an office environment, many remote workers don't realize they're:
- Speaking too loudly and disturbing household members
- Causing audio distortion for meeting participants
- Creating unpleasant listening experiences for colleagues
- Lacking awareness of their voice levels during calls

**Real-world scenario:** You're on a Zoom call. You get excited discussing a project. Your voice rises. Your partner in the next room hears everything. Your meeting participants experience audio clipping. You don't notice until someone (awkwardly) mentions it.

### The Solution
A simple, privacy-first Chrome extension that:
1. Monitors your microphone in real-time
2. Shows you a visual volume meter
3. Flashes your screen red when you exceed your chosen threshold
4. Sends a browser notification to bring awareness
5. Tracks how many times you've been loud (for self-improvement)

### Why This Matters
- **For Remote Workers:** Better audio etiquette and household peace
- **For Meeting Participants:** More pleasant listening experience
- **For You:** Build self-awareness of speaking volume
- **Privacy-First:** All processing happens locally - nothing is recorded or sent anywhere

---

## 🎯 Target Users

### Primary Users
1. **Remote Workers** (35-55 years old)
   - Full-time work-from-home employees
   - Frequent video calls (5+ hours/week)
   - Share living space with family/roommates
   - Conscious about being considerate neighbors

2. **Meeting-Heavy Professionals**
   - Managers and team leads
   - Sales professionals
   - Customer support teams
   - Anyone who talks a lot in meetings

3. **Home Office Dwellers**
   - People with home offices in shared spaces
   - Parents working while kids are home
   - Roommates who need to be quiet
   - Apartment dwellers with thin walls

### Secondary Users
1. **Content Creators**
   - Podcasters monitoring recording levels
   - Streamers maintaining consistent audio
   - YouTubers doing voiceovers

2. **Voice Training**
   - People working on volume control
   - Anyone with naturally loud speaking voice
   - Individuals who get excited and speak louder

---

## 💡 User Stories

### As a Remote Worker...
> "I want to know when I'm speaking too loudly during video calls, so I don't disturb my partner who's also working from home."

**Acceptance Criteria:**
- Extension monitors my voice in real-time during calls
- I get immediate feedback when I exceed my comfort threshold
- I can adjust the sensitivity based on my home environment
- I can see patterns in when I tend to speak louder

### As a Meeting Participant...
> "I want to maintain professional audio quality so my colleagues have a pleasant listening experience."

**Acceptance Criteria:**
- I'm alerted before my voice causes audio distortion
- The alert is noticeable but not disruptive to my flow
- I can quickly adjust my volume and continue speaking
- The tool helps me build long-term awareness

### As a Privacy-Conscious User...
> "I want volume monitoring that doesn't record or store my voice data."

**Acceptance Criteria:**
- All audio processing happens locally in my browser
- No data is sent to any server
- No audio is saved to my computer
- I can verify this through open source code

### As a Parent Working from Home...
> "I want to be aware when my voice might wake up my napping baby in the next room."

**Acceptance Criteria:**
- Visual feedback (red screen) I can see at a glance
- Customizable threshold for my specific volume needs
- Works across all video calling platforms (Zoom, Meet, Teams)
- Minimal setup required - just install and go

---

## 🎨 User Experience

### Installation Flow
1. User finds extension in Chrome Web Store
2. Clicks "Add to Chrome" (one click)
3. Grants microphone permission (required once)
4. Extension icon appears in toolbar
5. Ready to use immediately

**Time to first value:** Under 30 seconds

### First-Time Use
1. User clicks extension icon
2. Sees simple popup with:
   - Large volume meter (currently silent)
   - Threshold slider (default 70%)
   - Big "Start Monitoring" button
   - Simple explanation text
3. Clicks "Start Monitoring"
4. Microphone access prompt appears (if not already granted)
5. Volume meter starts responding to voice
6. User can test by speaking at different volumes
7. User adjusts threshold to their preference

**Key Design Principle:** Zero learning curve. Should be immediately obvious what it does and how to use it.

### Daily Use Pattern
1. User joins a video call (Zoom, Meet, Teams, etc.)
2. Opens extension popup
3. Clicks "Start Monitoring" (or it auto-starts if enabled)
4. Popup can be closed - monitoring continues in background
5. User proceeds with their call normally
6. If voice gets too loud:
   - Screen flashes red overlay for 3 seconds
   - Browser notification appears
   - User adjusts their volume
7. After call, user clicks "Stop Monitoring"

**Frequency of interaction:** 
- Opening extension: 1-2 times per call
- Adjusting threshold: Once every few days
- Receiving alerts: 0-3 times per call (goal is to reduce over time)

### Visual Feedback System

**Volume Meter Colors:**
- 🟢 **Green (0-80% of threshold):** "You're good"
- 🟡 **Yellow (80-100% of threshold):** "Getting close"
- 🔴 **Red (Over threshold):** "Too loud!"

**Red Screen Overlay:**
- Full-screen semi-transparent red flash
- Appears on your current tab
- Automatically fades after 3 seconds
- Non-intrusive (doesn't block clicks)
- Visible in peripheral vision during calls

**Browser Notification:**
- Title: "🔊 You're Speaking Too Loudly"
- Body: Brief reminder message
- Appears once every 3 seconds maximum (prevents spam)

---

## ⚙️ Core Features

### 1. Real-Time Volume Monitoring
**What it does:** Continuously analyzes your microphone input and displays current volume level.

**User benefit:** Immediate awareness of how loud you are at any given moment.

**Technical note for users:** Uses your existing microphone - no special hardware needed.

### 2. Customizable Threshold
**What it does:** Adjustable sensitivity slider (30% - 100% of maximum volume).

**User benefit:** You set what "too loud" means for your environment. Different thresholds for:
- Quiet home office: Lower threshold (50-60%)
- Noisy environment: Higher threshold (70-80%)
- Late night calls: Very low threshold (40-50%)

**Recommendation for new users:** Start at 70% and adjust based on feedback.

### 3. Background Monitoring
**What it does:** Continues monitoring even when popup is closed.

**User benefit:** Set it once at the start of your call, then forget about it. Only interrupted if you're too loud.

**Why this matters:** Doesn't require keeping extension popup open, which would be annoying.

### 4. Visual Warning System
**What it does:** Red screen flash when threshold exceeded.

**User benefit:** 
- Impossible to miss, even in peripheral vision
- Works alongside video calls without disruption
- Visual cue that works even if notifications are silenced

### 5. Browser Notifications
**What it does:** Standard Chrome notification when too loud.

**User benefit:**
- Works even if you're in a different tab
- Shows in notification center for review later
- Pairs with visual feedback for double reinforcement

### 6. Warning Counter
**What it does:** Tracks how many times you've been alerted.

**User benefit:** 
- Measure your progress over time
- Identify patterns (more alerts in afternoon vs. morning?)
- Gamification element - challenge yourself to reduce count

### 7. Privacy-First Design
**What it does:** All audio processing happens in your browser. Zero network requests.

**User benefit:** Peace of mind that your conversations are never recorded, stored, or transmitted.

**Verification:** Open source code can be audited by anyone.

---

## 🚫 What This Is NOT

To set clear expectations, this extension does NOT:

❌ **Record your audio** - Only analyzes volume levels in real-time  
❌ **Store your voice data** - Nothing is saved  
❌ **Send data to servers** - 100% local processing  
❌ **Transcribe your speech** - Only measures volume  
❌ **Automatically adjust your microphone** - You maintain control  
❌ **Replace professional audio tools** - This is awareness, not production audio  
❌ **Work with all video call platforms** - Works with browser-based calls (Zoom Web, Google Meet, Teams web). Native apps use separate microphone access.

---

## 🎯 Success Metrics

### User Success Indicators
1. **Warning reduction:** Users see fewer alerts over time (building awareness)
2. **Daily active usage:** Users start monitoring at beginning of most calls
3. **Threshold adjustments:** Users fine-tune to their specific environment
4. **Word-of-mouth:** Users recommend to colleagues

### Project Success (Open Source)
1. **GitHub Stars:** Measure community interest
2. **Sponsorships:** Sustainability of development
3. **Issues/Contributions:** Active community participation
4. **Chrome Web Store Rating:** User satisfaction

### Sponsor Value Metrics
1. **Users helped:** Number of active installations
2. **Privacy respect:** Zero data collection incidents
3. **Code quality:** Maintainable, well-documented codebase
4. **Update frequency:** Regular improvements and fixes

---

## 🗺️ Roadmap

### Version 1.0 (Current) ✅
- Real-time volume monitoring
- Visual volume meter
- Red screen overlay warnings
- Browser notifications
- Customizable threshold
- Warning counter
- Background monitoring
- State persistence

### Future Enhancements (Community-Driven)

**Version 1.1 - Usability**
- [ ] Quick threshold presets (Quiet/Normal/Loud)
- [ ] Keyboard shortcuts (start/stop monitoring)
- [ ] Dark mode UI
- [ ] Multi-language support

**Version 1.2 - Analytics**
- [ ] Volume history graph (see patterns over time)
- [ ] Export statistics to CSV
- [ ] Weekly summary reports
- [ ] Per-site threshold settings (different for Zoom vs. Meet)

**Version 1.3 - Advanced Features**
- [ ] Calibration wizard (optimal threshold recommendation)
- [ ] Voice activity detection (ignore background noise)
- [ ] Customizable alert sounds
- [ ] Integration with physical LED indicators (via WebUSB)

**Community Requested**
- Feedback from users will shape priorities
- Vote on feature requests via GitHub issues
- Sponsor priorities may influence roadmap

---

## 💰 Sustainability Model

### Open Source Philosophy
- **Free forever:** Core functionality will always be free
- **No ads:** Clean, focused user experience
- **No data selling:** Your privacy is not for sale
- **No premium tiers:** Everyone gets the same features

### Sponsorship Approach
This is a **passion project** by a single developer with a full-time job. Sponsorships help:

1. **Maintain the project:**
   - Bug fixes and security updates
   - Chrome API compatibility updates
   - Testing across different setups

2. **Add requested features:**
   - Community-voted enhancements
   - Platform-specific improvements
   - Documentation and guides

3. **Support the developer:**
   - Time away from other commitments
   - Hardware for testing (different devices)
   - Motivation to keep improving

### What Sponsors Get
- **Recognition:** Listed in README and extension credits
- **Influence:** Priority consideration for feature requests
- **Good Karma:** Supporting tools that respect user privacy
- **Transparency:** Regular updates on development progress

**Sponsor tiers:** (GitHub Sponsors)
- ☕ Coffee tier ($5/month): Thank you in README
- 🍕 Pizza tier ($15/month): Above + feature vote weight
- 🚀 Supporter tier ($50/month): Above + monthly dev updates

---

## 🔒 Privacy & Security

### Our Privacy Commitment

**What we collect:** Nothing. Literally zero data.

**What happens to your voice:**
1. Microphone captures audio
2. Browser processes volume level
3. Volume value displayed in UI
4. Audio is discarded immediately
5. No recording, storage, or transmission

**Verifiable claims:**
- Open source code on GitHub
- No network requests in code
- Chrome Web Store privacy declaration
- Community audit welcome

### Security Considerations

**Permissions required:**
- Microphone: To analyze your voice volume
- Notifications: To alert you when loud
- Storage: To save your threshold preference
- Active Tab: To show red overlay
- All URLs: To work on any video call site

**Why we need these:**
Each permission has a specific purpose, documented in code. No permission is used for anything beyond stated functionality.

---

## 🤝 Community & Contribution

### Target Contributors

**Who can help:**
- **Developers:** Bug fixes, features, testing
- **Designers:** UI/UX improvements
- **Users:** Bug reports, feature ideas, spread the word
- **Sponsors:** Financial support for development time

### Contribution Areas

**Code contributions:**
- TypeScript/React developers (frontend)
- Web Audio API knowledge (audio processing)
- Chrome Extension API expertise
- Testing and QA

**Non-code contributions:**
- Documentation improvements
- Translation to other languages
- Tutorial videos and guides
- Social media advocacy

### Getting Involved
1. **Try the extension:** Install and use it
2. **Report issues:** Found a bug? Open a GitHub issue
3. **Request features:** What would make this better for you?
4. **Sponsor development:** GitHub Sponsors link in README
5. **Spread the word:** Tell colleagues who might benefit

---

## 📊 Competitive Landscape

### Similar Solutions

**Hardware solutions:**
- Dedicated volume meter devices ($50-200)
- Studio audio equipment (overkill for calls)

**Software solutions:**
- DAW software (too complex)
- System volume monitors (no threshold alerts)
- Video call built-in indicators (easy to ignore)

### Our Advantage

1. **Simplicity:** Install and go, zero configuration needed
2. **Privacy:** No company accessing your audio
3. **Cost:** Free and open source
4. **Customization:** Adjust to your needs
5. **Browser-native:** Works across all web-based call platforms
6. **Open Source:** Community-driven improvements

### What Makes This Sponsorship-Worthy

- **Genuine need:** Solves real problem for remote workers
- **Privacy respect:** In an age of surveillance capitalism
- **Open source:** Code anyone can verify and improve
- **Sustainable approach:** Not seeking VC funding or acquisition
- **Solo developer:** Direct impact of sponsorships is visible
- **Quality focus:** Well-architected, maintainable code

---

## 🎓 Educational Value

### Learning Opportunities

This project demonstrates:
- Chrome Extension development (Manifest V3)
- Web Audio API usage
- React for extension UIs
- TypeScript best practices
- Privacy-first architecture
- Monorepo structure
- Open source community building

### For Students/Learners
This codebase serves as a real-world example of:
- Modern browser extension development
- Audio processing in JavaScript
- State management in React
- Chrome API integration
- Open source project structure

---

## 📝 User Testimonials (Anticipated)

### Expected User Feedback

> "Finally! I kept getting complaints from my wife that I was too loud during meetings. This simple tool has saved my marriage." - Remote Worker Dad

> "Love that it doesn't record anything. Just tells me when I'm loud. Perfect for privacy-conscious folks." - Security Professional

> "I've reduced my 'too loud' moments from 10+ per call to 1-2. It really helps build awareness." - Sales Manager

> "Simple, effective, and respects my privacy. This is how software should be built." - Tech Enthusiast

> "Worth sponsoring. The developer is solving a real problem without trying to monetize my data." - Open Source Advocate

---

## 🚀 Launch Strategy

### Phase 1: Soft Launch
1. **Friends & Family Testing** (2 weeks)
   - Private beta with trusted users
   - Gather initial feedback
   - Fix critical bugs

2. **Early Adopters** (1 month)
   - Post to Reddit (r/productivity, r/WorkFromHome)
   - Tweet about the project
   - Product Hunt launch
   - Hacker News submission

### Phase 2: Growth
1. **Chrome Web Store Listing**
   - Professional screenshots
   - Clear description
   - Privacy policy page
   - Tutorial video

2. **Content Marketing**
   - Blog post: "Why I Built This"
   - Tutorial: "How to Use"
   - Behind-the-scenes: Technical deep dive

3. **Community Building**
   - GitHub README with clear value proposition
   - Sponsor page on GitHub
   - Discord or discussion forum

### Phase 3: Sustainability
1. **Regular Updates** (Monthly)
   - Bug fixes
   - Small improvements
   - Update notes shared with community

2. **Sponsor Outreach**
   - Identify companies that benefit (remote-first companies)
   - Reach out to corporate sponsors
   - Offer bulk deployment support

---

## ⚡ Quick Reference

### For Users
- **Install:** Chrome Web Store (search "You're Loud")
- **Setup time:** Under 30 seconds
- **Cost:** Free forever
- **Privacy:** Zero data collection
- **Support:** GitHub issues

### For Sponsors
- **Why sponsor:** Support privacy-respecting tools
- **How to sponsor:** GitHub Sponsors link
- **What you get:** Recognition + influence on roadmap
- **Tax:** Varies by country (consult advisor)

### For Contributors
- **Repo:** github.com/[your-username]/your-are-loud
- **Stack:** TypeScript, React, Chrome Extension APIs
- **License:** MIT (permissive)
- **Guidelines:** See CONTRIBUTING.md

---

## 📞 Contact & Support

### For Users
- **Bug reports:** GitHub Issues
- **Feature requests:** GitHub Discussions
- **Questions:** GitHub Discussions Q&A

### For Sponsors
- **Sponsorship info:** GitHub Sponsors page
- **Direct contact:** [Your email for sponsor inquiries]
- **Monthly updates:** Sent to sponsors automatically

### For Press/Media
- **Press kit:** Available on GitHub
- **Screenshots:** In /docs/press folder
- **Contact:** [Your email]

---

## 🎯 Core Value Proposition

**For Users:**  
"Build awareness of your speaking volume during video calls - without anyone recording or storing your voice."

**For Sponsors:**  
"Support a privacy-first tool that helps thousands of remote workers be better communicators - while respecting their data."

**For the Developer (You):**  
"Build something genuinely useful while demonstrating expertise in modern web technologies and open source community management."

---

**This PRD represents a vision for a sustainable open source project that solves a real problem while respecting user privacy. Success is measured not in revenue, but in users helped and community built.**

---

*Last updated: January 31, 2026*  
*Questions? Open a GitHub Discussion.*  
*Want to sponsor? Check our GitHub Sponsors page.*
