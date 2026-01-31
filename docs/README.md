# Documentation Index

Welcome to the **Your Are Loud** project documentation.

## 📚 Documentation Structure

```
docs/
├── README.md                      # This file - documentation index
├── DOCUMENTATION_STRUCTURE.md     # Documentation organization guide
├── quick-start.md                 # Quick start guide for new users
├── architecture.md                # Overall system architecture
├── monorepo-structure.md          # Monorepo organization and design
├── contributing.md                # Contribution guidelines
├── implementation-summary.md      # Implementation details and status
├── refactoring-summary.md         # Mobile app refactoring details
│
├── marketing/                     # Marketing strategy & execution (for growth/sponsors)
│   ├── README.md                  # Marketing documentation index
│   ├── overview.md                # Marketing suite overview (start here)
│   ├── quick-reference.md         # One-page cheat sheet (print this!)
│   ├── quick-start.md             # 5-minute marketing primer
│   ├── execution-plan.md          # 90-day step-by-step plan (zero-cost)
│   ├── guidelines.md              # Complete strategy & brand guidelines
│   └── templates/                 # Ready-to-use content templates
│
├── product-spec/                  # Product Requirements Documents (non-technical)
│   ├── README.md                  # PRD overview and comparison
│   ├── chrome-extension-prd.md    # Chrome extension product spec
│   ├── macos-prd.md               # macOS app product spec
│   ├── mobile-prd.md              # Mobile apps product spec
│   └── windows-prd.md             # Windows app product spec
│
└── tech-spec/                     # Platform-specific technical specs (for developers)
    ├── chrome-extension.md        # Chrome extension specification
    ├── mobile.md                  # iOS & Android (React Native)
    ├── macos.md                   # macOS native app
    └── windows.md                 # Windows native app
```

## 🚀 Getting Started

### New to the Project?

**Non-Technical (Users, Sponsors, Curious):**
1. **Start here:** [Product Requirements Documents (PRDs)](./prd/README.md)
2. **Pick your platform:** Read the PRD for Chrome, macOS, Mobile, or Windows
3. **Try it:** [Quick Start Guide](./quick-start.md)

**Technical (Developers):**
1. **Start here:** [Quick Start Guide](./quick-start.md)
2. **Understand the structure:** [Monorepo Structure](./monorepo-structure.md)
3. **Learn the architecture:** [Architecture Overview](./architecture.md)
4. **Pick a platform:** See [Platform Guides](#platform-guides) below

### Want to Contribute?

**Code Contributions:**
1. Read: [Contributing Guide](./contributing.md)
2. Review: [Architecture Overview](./architecture.md)
3. Choose a platform and read its tech spec
4. Follow the contribution workflow

**Non-Code Contributions:**
1. Read: [PRDs](./prd/README.md) to understand the vision
2. Check: [Contributing Guide](./contributing.md) for ways to help
3. Share feedback, write tutorials, spread the word

## 📖 Core Documentation

### For Everyone (Non-Technical)

| Document | Description | Audience |
|----------|-------------|----------|
| [Product Requirements (PRD Overview)](./product-spec/README.md) | What each app does and why | Users, sponsors, anyone curious |
| [Chrome Extension PRD](./product-spec/chrome-extension-prd.md) | Browser extension product spec | Chrome users, potential sponsors |
| [macOS App PRD](./product-spec/macos-prd.md) | Mac app product spec | Mac users, potential sponsors |
| [Mobile App PRD](./product-spec/mobile-prd.md) | iOS & Android product spec | Mobile users, potential sponsors |
| [Windows App PRD](./product-spec/windows-prd.md) | Windows app product spec | Windows users, potential sponsors |

### Marketing Strategy (For Growth & Promotion)

| Document | Description | Audience |
|----------|-------------|----------|
| [Marketing Overview](./marketing/README.md) | Marketing documentation index (start here) | Everyone |
| [Marketing Suite Overview](./marketing/overview.md) | How all marketing docs fit together | First-time readers |
| [Quick Reference](./marketing/quick-reference.md) | One-page cheat sheet (print this!) | Daily use |
| [Quick Start](./marketing/quick-start.md) | 5-minute marketing primer | Getting started |
| [Execution Plan](./marketing/execution-plan.md) | 90-day step-by-step plan (zero-cost) | Solo founders, executors |
| [Guidelines](./marketing/guidelines.md) | Complete strategy & brand guidelines | Marketers, contributors |

### For Developers (Technical)

| Document | Description | When to Read |
|----------|-------------|--------------|
| [Documentation Structure](./DOCUMENTATION_STRUCTURE.md) | How docs are organized | Understanding documentation |
| [Quick Start](./quick-start.md) | 5-minute setup guide | First time setup |
| [Architecture](./architecture.md) | System design and patterns | Understanding the system |
| [Monorepo Structure](./monorepo-structure.md) | Folder organization and design principles | Navigating the codebase |
| [Contributing](./contributing.md) | How to contribute code | Before making changes |
| [Implementation Summary](./implementation-summary.md) | Current implementation status | Understanding what's built |
| [Refactoring Summary](./refactoring-summary.md) | Mobile app consolidation details | Understanding recent changes |

## 🎯 Platform Guides

### Mobile (iOS & Android)

**📱 [Mobile App Technical Spec](./tech-spec/mobile.md)**

- **Status:** ✅ Unified React Native app
- **Technology:** React Native 0.73.2, TypeScript
- **Architecture:** Single codebase for both platforms
- **Key Features:** Shared code, platform-specific native modules

**What you'll learn:**
- Unified mobile app structure
- Why we consolidated Android/iOS apps
- Shared code architecture
- Platform-specific native code
- Audio processing on mobile
- Development and deployment

### Chrome Extension

**🌐 [Chrome Extension Technical Spec](./tech-spec/chrome-extension.md)**

- **Status:** 📝 Skeleton with comprehensive spec
- **Technology:** TypeScript, Manifest V3
- **Architecture:** Service Worker, Offscreen Document, Content Script

**What you'll learn:**
- Chrome extension architecture
- Message protocol and communication
- Audio processing in browser
- Manifest V3 implementation
- Development and testing

### macOS

**🍎 [macOS Technical Spec](./tech-spec/macos.md)**

- **Status:** ✅ Complete and functional
- **Technology:** Swift, SwiftUI, AVFoundation
- **Architecture:** Native macOS app with menu bar integration

**What you'll learn:**
- SwiftUI app structure
- AVAudioEngine integration
- Menu bar app design
- macOS-specific features
- Build and distribution

### Windows

**🪟 [Windows Technical Spec](./tech-spec/windows.md)**

- **Status:** 📝 Skeleton with implementation guide
- **Technology:** C#, .NET MAUI
- **Architecture:** MVVM pattern

**What you'll learn:**
- .NET MAUI setup
- Windows audio APIs
- MVVM architecture
- System tray integration
- Build and deployment

## 🔍 Finding Information

### By Audience

**🙋 Potential User**
- Start: [PRD Overview](./product-spec/README.md)
- Pick: Your platform's PRD (Chrome, macOS, Mobile, or Windows)
- Focus: What problem it solves, features, privacy

**💰 Potential Sponsor**
- Start: [PRD Overview](./product-spec/README.md)
- Read: [Marketing Guidelines](./marketing/guidelines.md) → "Sponsorship Marketing"
- See: What your sponsorship enables
- Focus: Project values, sustainability, impact

**📝 Blogger/Media**
- Start: [PRD Overview](./product-spec/README.md)
- Read: [Marketing Guidelines](./marketing/guidelines.md) → "PR & Media Relations"
- Pick: Platform PRDs for accurate info
- Focus: Unique value proposition, privacy-first approach, open source model

**📣 Marketing/Growth Contributor**
- Start: [Marketing Overview](./marketing/README.md) - Start here!
- Read: [Execution Plan](./marketing/execution-plan.md) - Week-by-week action plan
- Print: [Quick Reference](./marketing/quick-reference.md) - Daily guide
- Study: [Guidelines](./marketing/guidelines.md) - Overall strategy
- Understand: [PRD Overview](./product-spec/README.md) for product knowledge

### By Developer Role

**👨‍💻 Frontend Developer (Mobile)**
- Start: [Mobile Tech Spec](./tech-spec/mobile.md)
- Focus: React Native, TypeScript, UI components

**👨‍💻 Frontend Developer (Web)**
- Start: [Chrome Extension Tech Spec](./tech-spec/chrome-extension.md)
- Focus: Web APIs, Chrome APIs, TypeScript

**👨‍💻 Native Developer (iOS/Android)**
- Start: [Mobile Tech Spec](./tech-spec/mobile.md) → "Platform-Specific Code"
- Focus: Swift/Kotlin, native modules, permissions

**👨‍💻 Native Developer (macOS)**
- Start: [macOS Tech Spec](./tech-spec/macos.md)
- Focus: SwiftUI, AVFoundation, menu bar

**👨‍💻 Native Developer (Windows)**
- Start: [Windows Tech Spec](./tech-spec/windows.md)
- Focus: C#, .NET MAUI, MVVM

**🎨 Audio Engineer**
- Read: Any platform tech spec → "Audio Processing" section
- Also: `packages/audio-processing/README.md`
- Focus: RMS calculation, normalization, threshold detection

**🧪 QA/Tester**
- Read: Any platform tech spec → "Testing Strategy" section
- Focus: Test cases, manual testing, automation

**🚀 DevOps/Release Manager**
- Read: Any platform tech spec → "Build & Deployment" section
- Also: [Contributing Guide](./contributing.md) → "Release Process"
- Focus: CI/CD, builds, distribution

**📝 Technical Writer**
- Read: This file and [Contributing Guide](./contributing.md)
- Focus: Documentation standards, maintenance

### By Task

| Task | Where to Look |
|------|---------------|
| **Setting up development environment** | [Quick Start](./quick-start.md) |
| **Understanding project structure** | [Monorepo Structure](./monorepo-structure.md) |
| **Adding a new feature** | Platform tech spec + [Contributing](./contributing.md) |
| **Fixing a bug** | Platform tech spec → "Troubleshooting" |
| **Understanding audio processing** | Platform tech spec → "Audio Processing" |
| **Building for production** | Platform tech spec → "Build & Deployment" |
| **Testing changes** | Platform tech spec → "Testing Strategy" |
| **Understanding recent changes** | [Refactoring Summary](./refactoring-summary.md) |
| **Contributing code** | [Contributing Guide](./contributing.md) |
| **Marketing the project** | [Marketing Overview](./marketing/README.md) (start here) |
| **Day-by-day marketing tasks** | [Execution Plan](./marketing/execution-plan.md) → Week-by-week plan |
| **Writing marketing content** | [Guidelines](./marketing/guidelines.md) → "Content Strategy" |
| **Launching on new platform** | [Execution Plan](./marketing/execution-plan.md) → Week 2-4 |
| **Seeking sponsorships** | [Execution Plan](./marketing/execution-plan.md) → Week 11 |
| **PR and media outreach** | [Guidelines](./marketing/guidelines.md) → "PR & Media Relations" |
| **Zero-cost growth tactics** | [Execution Plan](./marketing/execution-plan.md) |
| **Daily marketing routine** | [Quick Reference](./marketing/quick-reference.md) (print this!) |

## 🎓 Learning Paths

### Path 1: Quick Contributor

**Goal:** Make your first contribution quickly

1. [Quick Start](./quick-start.md) - 5 minutes
2. [Contributing Guide](./contributing.md) - 10 minutes
3. Pick an issue and start coding!

### Path 2: Platform Developer

**Goal:** Become proficient in one platform

1. [Quick Start](./quick-start.md) - 5 minutes
2. [Architecture](./architecture.md) - 15 minutes
3. [Monorepo Structure](./monorepo-structure.md) - 10 minutes
4. Your platform's tech spec - 30 minutes
5. Start building!

### Path 3: Full Stack Understanding

**Goal:** Understand the entire system

1. [Quick Start](./quick-start.md) - 5 minutes
2. [Architecture](./architecture.md) - 15 minutes
3. [Monorepo Structure](./monorepo-structure.md) - 10 minutes
4. [Implementation Summary](./implementation-summary.md) - 15 minutes
5. All platform tech specs - 1-2 hours
6. [Contributing Guide](./contributing.md) - 10 minutes

### Path 4: Maintainer/Reviewer

**Goal:** Review PRs and maintain code quality

1. All core documentation - 1 hour
2. All platform tech specs - 2 hours
3. [Contributing Guide](./contributing.md) - deep dive
4. Review recent PRs and issues

## 📝 Documentation Standards

### When to Update Documentation

**CRITICAL:** Documentation must be updated whenever you:

- ✅ Add/remove/modify features
- ✅ Change architecture or design patterns
- ✅ Update APIs or interfaces
- ✅ Modify build processes
- ✅ Fix significant bugs
- ✅ Refactor major components

### How to Update

1. Edit the relevant `.md` file in `docs/`
2. Update "Last Updated" date (if present)
3. Keep documentation in sync with code
4. Commit documentation with code changes

**Example commit:**
```bash
git add docs/tech-spec/mobile.md src/
git commit -m "feat(mobile): add settings screen

- Implement settings UI
- Add persistence with AsyncStorage
- Update documentation

Docs: tech-spec/mobile.md section 'Features'"
```

### Documentation Quality

Good documentation should be:

- ✅ **Clear** - Easy to understand
- ✅ **Concise** - No unnecessary words
- ✅ **Current** - Always up to date
- ✅ **Complete** - Covers all aspects
- ✅ **Consistent** - Follows same style
- ✅ **Correct** - Technically accurate

## 🛠️ Documentation Tools

### Viewing Markdown

- **VS Code:** Built-in preview (`Cmd+Shift+V` or `Ctrl+Shift+V`)
- **Cursor:** Built-in preview
- **GitHub:** Rendered automatically
- **Any text editor:** Readable as plain text

### Markdown Formatting

We use standard Markdown:

- ATX-style headers (`#` not underlines)
- Fenced code blocks with language tags
- Tables for structured data
- Bullet lists for items
- Numbered lists for sequences

### Diagrams

Text-based diagrams using ASCII art:
- Easy to maintain in version control
- No external tools needed
- Render correctly everywhere

## 🔄 Documentation Maintenance

### Regular Reviews

Documentation should be reviewed:

- **Weekly:** During active development
- **Before releases:** Ensure completeness
- **After major changes:** Update architecture
- **Quarterly:** General cleanup

### Version Control

- Documentation lives in `docs/` folder
- Versioned with code (same git repo)
- Historical versions via git history
- Breaking changes noted in changelogs

## 📬 Feedback & Issues

Found an error? Have a suggestion?

1. Open an issue on GitHub
2. Tag with `documentation` label
3. Specify document and section
4. Suggest improvement

## 📊 Documentation Status

### Product Requirements Documents (Non-Technical)

| Document | Status | Last Major Update |
|----------|--------|-------------------|
| PRD Overview | ✅ Complete | Jan 2026 |
| Chrome Extension PRD | ✅ Complete | Jan 2026 |
| macOS App PRD | ✅ Complete | Jan 2026 |
| Mobile App PRD | ✅ Complete | Jan 2026 |
| Windows App PRD | ✅ Complete | Jan 2026 |

### Marketing Documentation

| Document | Status | Last Major Update |
|----------|--------|-------------------|
| Marketing Overview | ✅ Complete | Jan 2026 |
| Marketing Suite Overview | ✅ Complete | Jan 2026 |
| Quick Reference | ✅ Complete | Jan 2026 |
| Quick Start | ✅ Complete | Jan 2026 |
| Execution Plan | ✅ Complete | Jan 2026 |
| Guidelines | ✅ Complete | Jan 2026 |

### Technical Documentation (For Developers)

| Document | Status | Last Major Update |
|----------|--------|-------------------|
| Quick Start | ✅ Complete | Jan 2026 |
| Architecture | ✅ Complete | Jan 2026 |
| Monorepo Structure | ✅ Complete | Jan 2026 |
| Contributing | ✅ Complete | Jan 2026 |
| Implementation Summary | ✅ Complete | Jan 2026 |
| Refactoring Summary | ✅ Complete | Jan 2026 |
| Mobile Tech Spec | ✅ Complete | Jan 2026 |
| Chrome Extension Tech Spec | ✅ Complete | Jan 2026 |
| macOS Tech Spec | 🚧 Partial | Jan 2026 |
| Windows Tech Spec | 🚧 Partial | Jan 2026 |

## 🎯 Quick Links

### Most Used Documents

**Non-Technical:**
- 📋 [PRD Overview](./product-spec/README.md) - Start here if you're not a developer
- 💰 [Sponsorship Info](./product-spec/README.md#open-source--sponsorship-model) - How to support the project
- 🔒 [Privacy](./product-spec/README.md) - Our privacy-first commitment

**Marketing:**
- 🚀 [Marketing Overview](./marketing/README.md) - Start here for all marketing docs
- 📋 [Quick Reference](./marketing/quick-reference.md) - One-page cheat sheet (print!)
- ⚡ [Quick Start](./marketing/quick-start.md) - 5-minute marketing primer
- 📅 [Execution Plan](./marketing/execution-plan.md) - 90-day action plan (zero-cost)
- 📣 [Guidelines](./marketing/guidelines.md) - Complete strategy & brand
- 📋 [Marketing Quick Reference](./marketing/quick-reference.md) - One-page cheat sheet

**Technical:**
- 🚀 [Quick Start](./quick-start.md) - Get started in 5 minutes
- 📱 [Mobile Tech Spec](./tech-spec/mobile.md) - iOS & Android development
- 🌐 [Chrome Extension](./tech-spec/chrome-extension.md) - Browser extension
- 🤝 [Contributing](./contributing.md) - How to contribute

### Reference Documents

- 📐 [Architecture](./architecture.md) - System design
- 📁 [Monorepo Structure](./monorepo-structure.md) - Code organization
- 📊 [Implementation Summary](./implementation-summary.md) - Current status
- 🔄 [Refactoring Summary](./refactoring-summary.md) - Recent changes

## 📄 License

Documentation is MIT licensed, same as the project code.

---

**Remember:** Good documentation makes the project accessible to everyone. Keep it updated! 📚✨

**Questions?** Open an issue or check the [Contributing Guide](./contributing.md) for help.
