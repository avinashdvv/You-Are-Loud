# Product Requirements Documents (PRDs)
## Non-Technical Product Specifications

This folder contains **Product Requirements Documents** for each platform in the "You're Loud" project. These PRDs are written for **non-technical stakeholders** including potential users, sponsors, contributors, and anyone interested in understanding what each app does and why it matters.

---

## 📚 Available PRDs

### [Chrome Extension PRD](./chrome-extension-prd.md)
**Platform:** Chrome Browser (Web Extension)  
**Target Users:** Remote workers using browser-based video calls  
**Key Features:** Real-time volume monitoring in browser, red screen overlay, works with Zoom/Meet/Teams web  

**Read this if you:**
- Use Chrome for video calls
- Want browser-based solution
- Are considering sponsoring the Chrome extension

---

### [macOS App PRD](./macos-prd.md)
**Platform:** macOS (Native Swift App)  
**Target Users:** Mac users with native Zoom/Teams apps  
**Key Features:** Menu bar integration, system-wide monitoring, native notifications  

**Read this if you:**
- Use a Mac for work
- Prefer native macOS apps
- Want system-wide monitoring beyond browser

---

### [Mobile App PRD](./mobile-prd.md)
**Platform:** iOS & Android (React Native)  
**Target Users:** Mobile professionals taking calls on phones  
**Key Features:** Vibration alerts, persistent notifications, battery optimized  

**Read this if you:**
- Take many calls from your phone
- Work on the go
- Want volume monitoring in your pocket

---

### [Windows App PRD](./windows-prd.md)
**Platform:** Windows 10/11 (Native .NET)  
**Target Users:** Enterprise Windows users, Teams desktop users  
**Key Features:** System tray integration, toast notifications, enterprise-friendly  

**Read this if you:**
- Use Windows for work
- Use Teams/Zoom desktop apps
- Work in corporate environment

---

## 🎯 Purpose of These PRDs

### What These Documents Are
- **User-focused:** Written for non-engineers
- **Problem-solving:** Explain what problem each app solves
- **Value proposition:** Why someone should use or sponsor
- **Open source context:** How sponsorship enables development

### What These Documents Are NOT
- **Not technical specs:** See `/docs/tech-spec/` for technical details
- **Not implementation plans:** See code and architecture docs for that
- **Not marketing copy:** Honest, realistic descriptions

---

## 👥 Who Should Read These?

### Potential Users
- Understand what each app does
- Decide which platform fits your needs
- Learn about privacy and features

### Potential Sponsors
- Understand project goals and values
- See what your sponsorship enables
- Learn about open source sustainability model

### Contributors
- Understand user needs and pain points
- See the big picture vision
- Identify areas where you can help

### Media/Bloggers
- Get accurate information about the project
- Understand the unique value proposition
- Find compelling angles for coverage

---

## 🎨 PRD Structure

Each PRD follows a consistent structure:

1. **Executive Summary** - Quick overview
2. **Target Users** - Who this is for
3. **User Stories** - Real-world scenarios
4. **User Experience** - How people interact
5. **Core Features** - What it does
6. **What This Is NOT** - Clear limitations
7. **Roadmap** - Future plans
8. **Sustainability Model** - Open source + sponsorship approach
9. **Privacy & Security** - How we protect users
10. **Competitive Analysis** - How we compare
11. **Community & Contribution** - How to help

---

## 💰 Open Source + Sponsorship Model

### Why This Matters

This project is:
- **Free forever** - No paywalls, no premium tiers
- **Privacy-first** - Zero data collection
- **Open source** - Fully auditable code
- **Solo developer** - Maintained by one person with a full-time job

### Sustainability Challenge

As a solo dev maintaining 4 platform-specific apps:
- Chrome extension requires yearly attention for API changes
- macOS app requires $99/year Apple Developer membership
- Mobile apps require iOS + Android testing and maintenance
- Windows app requires code signing certificates

**Sponsorships enable:**
- Developer account fees
- Code signing certificates
- Testing devices/VMs
- Development time (nights and weekends)
- Long-term maintenance and updates

### Sponsor Benefits

**All tiers get:**
- Recognition in README and app credits
- Satisfaction of supporting privacy-respecting tools
- Knowledge that users are being helped

**Higher tiers get:**
- Priority consideration for feature requests
- Monthly development updates
- Direct communication channel
- Beta testing access

**[→ Sponsor on GitHub](https://github.com/sponsors/[your-username])**

---

## 🔍 Technical Specifications

Looking for technical documentation? See:

- **Architecture:** [`/docs/architecture.md`](../architecture.md)
- **Chrome Extension Tech Spec:** [`/docs/tech-spec/chrome-extension.md`](../tech-spec/chrome-extension.md)
- **macOS Tech Spec:** [`/docs/tech-spec/macos.md`](../tech-spec/macos.md)
- **Mobile Tech Spec:** [`/docs/tech-spec/mobile.md`](../tech-spec/mobile.md)
- **Windows Tech Spec:** [`/docs/tech-spec/windows.md`](../tech-spec/windows.md)

---

## 📊 Comparison Matrix

| Feature | Chrome Ext. | macOS | Mobile | Windows |
|---------|-------------|-------|--------|---------|
| **Works with browser calls** | ✅ | ❌ | ❌ | ❌ |
| **Works with desktop apps** | ❌ | ✅ | ❌ | ✅ |
| **Works with phone calls** | ❌ | ❌ | ✅ | ❌ |
| **Visual screen overlay** | ✅ | ❌ | ❌ | ❌ |
| **Vibration alerts** | ❌ | ❌ | ✅ | ❌ |
| **System tray/menu bar** | ❌ | ✅ | ❌ | ✅ |
| **Battery optimized** | N/A | ✅ | ✅ | N/A |
| **Cross-platform** | Any OS | macOS only | iOS + Android | Windows only |
| **Development status** | ✅ Complete | ✅ Complete | 🚧 In Progress | 🚧 In Progress |

---

## 🤝 Contributing to PRDs

These documents should evolve based on:
- User feedback
- Feature additions
- Market changes
- Community input

**How to improve these PRDs:**

1. **Found inaccuracies?** Open a GitHub issue
2. **Have user insights?** Share in GitHub Discussions
3. **Want to add sections?** Submit a pull request
4. **Have questions?** Ask in Discussions Q&A

**Guidelines:**
- Keep language accessible (non-technical)
- Focus on user benefits, not implementation
- Be honest about limitations
- Update last modified date
- Maintain consistent structure across all PRDs

---

## 📞 Questions?

- **General questions:** [GitHub Discussions](../../discussions)
- **Bug reports:** [GitHub Issues](../../issues)
- **Sponsorship inquiries:** GitHub Sponsors or [your-email]
- **Press/media:** [your-email]

---

## 🎯 Core Mission

**Build privacy-respecting tools that help people communicate better during video calls - supported by a community that values ethical software development.**

Every platform serves this mission in a different context:
- **Chrome:** For browser-based remote workers
- **macOS:** For Mac users with native apps
- **Mobile:** For professionals on the go
- **Windows:** For enterprise environments

---

*These PRDs represent our commitment to transparency, user-focused development, and sustainable open source practices.*

**Last updated:** January 31, 2026  
**Project:** You're Loud (Voice Volume Monitor)  
**Repository:** [GitHub Link]  
**License:** MIT
