# 🔊 Your Are Loud - Monorepo

A cross-platform voice monitoring application that alerts you when you're speaking too loudly during video calls.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Overview

**Your Are Loud** monitors your microphone in real-time and sends you notifications when your voice exceeds a customizable volume threshold. Perfect for:
- 📞 Video calls (Zoom, Teams, Meet, etc.)
- 🎙️ Podcasting and streaming
- 🏠 Working from home (noisy environment awareness)
- 🗣️ Voice training and awareness

## 🚀 Supported Platforms

This monorepo contains implementations for **all major platforms**:

| Platform | Technology | Status | Location |
|----------|-----------|--------|----------|
| 🍎 **macOS** | Swift, SwiftUI | ✅ Complete | `apps/macos/` |
| 🪟 **Windows** | C#, .NET MAUI | 📝 Skeleton | `apps/windows/` |
| 📱 **iOS & Android** | React Native | 📝 Skeleton | `apps/mobile/` |
| 🌐 **Chrome Extension** | TypeScript, Manifest V3 | 📝 Skeleton | `apps/chrome-extension/` |

## 📁 Repository Structure

```
your-are-loud/
├── apps/                      # Platform-specific applications
│   ├── macos/                 # macOS native app (Swift)
│   ├── windows/               # Windows native app (C#/.NET MAUI)
│   ├── mobile/                # iOS & Android app (React Native)
│   │   ├── src/               # Shared React Native code
│   │   ├── android/           # Android native code
│   │   └── ios/               # iOS native code
│   └── chrome-extension/      # Chrome extension (TypeScript)
│
├── packages/                  # Shared TypeScript packages
│   ├── core/                  # Core business logic & types
│   ├── audio-processing/      # Audio processing algorithms
│   └── notifications/         # Notification management
│
├── docs/                      # Documentation
│   ├── README.md              # Documentation index
│   ├── quick-start.md         # Quick start guide
│   ├── architecture.md        # System architecture
│   ├── monorepo-structure.md  # Detailed structure guide
│   ├── contributing.md        # Contribution guidelines
│   ├── MARKETING_GUIDELINES.md # Marketing strategy & brand guidelines
│   ├── product-spec/          # Product requirements (non-technical)
│   └── tech-spec/             # Platform technical specs
│
├── scripts/                   # Build & utility scripts
│   ├── setup.sh              # Initial setup
│   ├── build-all.sh          # Build all platforms
│   └── clean.sh              # Clean build artifacts
│
├── package.json              # Root package (workspace)
├── pnpm-workspace.yaml       # PNPM workspace config
└── README.md                 # This file
```

## 🎯 Key Features

### Common Features Across All Platforms

- ✅ **Real-time Audio Monitoring** - Continuous microphone monitoring
- ✅ **Visual Volume Meter** - Color-coded display (Green → Yellow → Red)
- ✅ **Adjustable Threshold** - Customize sensitivity (0.3 - 1.0)
- ✅ **Smart Notifications** - Alerts when too loud (with cooldown)
- ✅ **Warning Counter** - Track how many times you've been loud
- ✅ **Privacy-First** - All processing happens locally, no data sent anywhere

### Platform-Specific Features

| Feature | macOS | Windows | iOS | Android | Chrome |
|---------|-------|---------|-----|---------|--------|
| Menu Bar Integration | ✅ | ❌ | ❌ | ❌ | ✅ |
| System Tray | ❌ | 🔜 | ❌ | ❌ | ❌ |
| Background Monitoring | ✅ | 🔜 | 🔜 | 🔜 | ✅ |
| Native Notifications | ✅ | 🔜 | 🔜 | 🔜 | ✅ |
| System Beep | ✅ | 🔜 | 🔜 | 🔜 | ❌ |

## 🏗️ Architecture

### Shared Business Logic

The monorepo uses **shared TypeScript packages** for core business logic:

```typescript
@your-are-loud/core              // Constants, types, threshold detection
@your-are-loud/audio-processing  // RMS calculation, normalization
@your-are-loud/notifications     // Cooldown management, warnings
```

### Platform Integration

- **JavaScript/TypeScript Platforms** (React Native, Chrome): Direct usage of shared packages
- **Native Platforms** (macOS, Windows): Reimplemented algorithms in native languages (Swift, C#)

All platforms use **identical algorithms** to ensure consistent behavior:

1. **Audio Capture** → Platform-specific (AVAudioEngine, NAudio, Web Audio API)
2. **RMS Calculation** → `sqrt(sum(samples²) / count)`
3. **Normalization** → `(20*log10(rms) + 50) / 50` (clamped to 0.0-1.0)
4. **Threshold Check** → Compare against user threshold
5. **Cooldown** → 3-second minimum between warnings

See [Architecture Overview](docs/architecture.md) for detailed architecture documentation.

## 🚀 Quick Start

**📖 See [Quick Start Guide](docs/quick-start.md) for detailed setup instructions.**

### TL;DR

```bash
# Clone and setup
git clone <repo-url>
cd your-are-loud
./scripts/setup.sh

# Build shared packages
pnpm install
pnpm run build

# Run a platform (example: mobile)
cd apps/mobile
npm install
npm run android  # or npm run ios
```

### Prerequisites

- Node.js 18+ and pnpm 8+ (all platforms)
- Platform-specific tools (see [Quick Start Guide](docs/quick-start.md))

### Platform-Specific Setup

See platform documentation for detailed setup:

- **macOS**: [macOS Tech Spec](docs/tech-spec/macos.md)
- **Windows**: [Windows Tech Spec](docs/tech-spec/windows.md)
- **Mobile**: [Mobile Tech Spec](docs/tech-spec/mobile.md)
- **Chrome**: [Chrome Extension Tech Spec](docs/tech-spec/chrome-extension.md)

## 📚 Documentation

**📖 [Complete Documentation Index](docs/README.md)**

### For Non-Technical Readers (Product Specs & Marketing)

**New here? Start with the Product Requirements Documents (PRDs):**

| Platform | Product Spec | What You'll Learn |
|----------|--------------|-------------------|
| 🌐 **Chrome Extension** | [PRD](docs/product-spec/chrome-extension-prd.md) | What it does, who it's for, why sponsor |
| 🍎 **macOS App** | [PRD](docs/product-spec/macos-prd.md) | Native Mac experience, menu bar integration |
| 📱 **Mobile Apps** | [PRD](docs/product-spec/mobile-prd.md) | iOS & Android, on-the-go monitoring |
| 🪟 **Windows App** | [PRD](docs/product-spec/windows-prd.md) | Enterprise-friendly, system tray integration |

**→ [PRD Overview](docs/product-spec/README.md)** - Compare all platforms, understand the project vision

**Want to help market or sponsor?**

| Document | What You'll Learn |
|----------|-------------------|
| 📣 **[Marketing Guidelines](docs/MARKETING_GUIDELINES.md)** | Complete marketing strategy, brand guidelines, and sponsorship info |
| ⚡ **[Marketing Quick Start](docs/MARKETING_QUICK_START.md)** | Essential marketing info in 5 minutes |

### For Developers (Technical Specs)

| Document | Description |
|----------|-------------|
| [Quick Start Guide](docs/quick-start.md) | Get started in 5 minutes |
| [Architecture Overview](docs/architecture.md) | System architecture and design decisions |
| [Monorepo Structure](docs/monorepo-structure.md) | Complete monorepo organization |
| [Contributing Guide](docs/contributing.md) | How to contribute to the project |

### Platform Technical Documentation

| Platform | Technical Spec | For Developers |
|----------|----------------|----------------|
| **Mobile (iOS & Android)** | [Tech Spec](docs/tech-spec/mobile.md) | React Native, native modules |
| **Chrome Extension** | [Tech Spec](docs/tech-spec/chrome-extension.md) | Manifest V3, Web Audio API |
| **macOS** | [Tech Spec](docs/tech-spec/macos.md) | Swift, SwiftUI, AVFoundation |
| **Windows** | [Tech Spec](docs/tech-spec/windows.md) | C#, .NET, NAudio |

## 🔧 Development

### Working with Shared Packages

The shared packages are in TypeScript and used by React Native and Chrome extension:

```bash
# Build all shared packages
pnpm run build

# Run tests
pnpm run test

# Lint code
pnpm run lint

# Format code
pnpm run format
```

### Adding a New Shared Package

1. Create directory: `packages/new-package/`
2. Add `package.json` with `name: "@your-are-loud/new-package"`
3. Implement in TypeScript
4. Add to workspace in `pnpm-workspace.yaml`
5. Build: `cd packages/new-package && pnpm build`

### Platform-Specific Development

Each platform has its own build system and workflow:

- **macOS**: Use Xcode (Cmd+R to run)
- **Windows**: Use Visual Studio or `dotnet build`
- **React Native**: Use `npx react-native run-ios/android`
- **Chrome**: Use `npm run build` then load unpacked

## 🧪 Testing

### Shared Packages
```bash
# Run all tests
pnpm run test:all

# Test specific package
cd packages/core && pnpm test
```

### Platform Apps
Each platform has its own testing approach:
- **macOS**: XCTest (Xcode → Product → Test)
- **Windows**: xUnit/MSTest
- **React Native**: Jest + React Native Testing Library
- **Chrome**: Jest + Puppeteer

## 📦 Building for Distribution

### Build All Platforms
```bash
./scripts/build-all.sh
```

### Platform-Specific Builds

**macOS:**
```bash
# In Xcode: Product → Archive → Distribute
```

**Windows:**
```bash
cd apps/windows
dotnet publish -c Release -r win-x64 --self-contained
```

**React Native:**
```bash
cd apps/mobile
# For iOS
npm run ios -- --configuration Release
# For Android
cd android && ./gradlew assembleRelease
```

**Chrome Extension:**
```bash
cd apps/chrome-extension
npm run build
# Create .zip from dist/ folder
```

## 🤝 Contributing

### Adding a New Platform

1. Create directory: `apps/new-platform/`
2. Follow the structure of existing platforms
3. Use shared packages where possible
4. Add README.md with setup instructions
5. Update this README and MONOREPO_STRUCTURE.md

### Code Standards

- **TypeScript**: ESLint + Prettier (auto-formatted)
- **Swift**: Follow Swift style guide
- **C#**: Follow C# conventions
- **Git**: Conventional commits

### Pull Request Process

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and test thoroughly
3. Update documentation if needed
4. Run linters: `pnpm run lint`
5. Submit PR with clear description

## 🔒 Privacy & Security

- ✅ **No Data Collection** - Zero analytics or tracking
- ✅ **Local Processing** - All audio processed on-device
- ✅ **No Audio Storage** - Audio never saved or transmitted
- ✅ **Open Source** - Fully auditable code
- ✅ **No Network Requests** - 100% offline operation

## 📊 Project Status

### ✅ Completed
- [x] Monorepo structure
- [x] Shared TypeScript packages (core, audio-processing, notifications)
- [x] macOS app (fully functional)
- [x] Comprehensive documentation

### 🔜 In Progress
- [ ] Windows app implementation
- [ ] React Native mobile apps
- [ ] Chrome extension implementation

### 🎯 Roadmap
- [ ] CI/CD pipelines for all platforms
- [ ] Automated tests
- [ ] Distribution to app stores
- [ ] Settings sync across devices (optional)
- [ ] Advanced features (ML-based threshold, analytics)

## 🐛 Troubleshooting

### Build Issues
```bash
# Clean everything and start fresh
./scripts/clean.sh
./scripts/setup.sh
```

### Microphone Not Working
- Check system permissions for microphone access
- macOS: System Settings → Privacy & Security → Microphone
- Windows: Settings → Privacy → Microphone

### Package Installation Fails
```bash
# Clear pnpm cache
pnpm store prune
# Reinstall
pnpm install
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the need for better audio awareness during remote work
- Built with modern cross-platform technologies
- Monorepo architecture inspired by industry best practices

## 📧 Contact & Support

- 📖 **Documentation**: [Complete Documentation Index](docs/README.md)
- 🚀 **Quick Start**: [Quick Start Guide](docs/quick-start.md)
- 🤝 **Contributing**: [Contributing Guide](docs/contributing.md)
- 🐛 **Issues**: Open a GitHub issue
- 💬 **Discussions**: GitHub Discussions

---

**Made with ❤️ for peaceful video calls and better audio awareness**

## 🚀 Quick Commands

```bash
# Setup
./scripts/setup.sh

# Build everything
./scripts/build-all.sh

# Clean everything
./scripts/clean.sh

# Build shared packages only
pnpm run build

# Run tests
pnpm run test:all

# Lint and format
pnpm run lint
pnpm run format
```

---

⭐ **Star this repo if you find it useful!**
