# Quick Start Guide

This guide helps you get started with the Your Are Loud monorepo.

## 🎯 What is This?

A **monorepo** containing voice monitoring applications for:
- 🍎 macOS (Swift) - ✅ **Working**
- 🪟 Windows (C#/.NET MAUI) - 📝 Skeleton
- 📱 iOS/Android (React Native) - 📝 Skeleton
- 🌐 Chrome Extension (TypeScript) - 📝 Skeleton

Plus **shared TypeScript packages** for business logic reuse.

## ⚡ Quick Setup (5 minutes)

### 1. Prerequisites
```bash
# Check Node.js (need 18+)
node -v

# Install pnpm if needed
npm install -g pnpm
```

### 2. Setup
```bash
# Clone and setup
cd /Users/vdevarakonda/Desktop/Learning/your-are-loud
./scripts/setup.sh
```

### 3. Try the macOS App (if on macOS)
```bash
cd apps/macos
open your-are-loud.xcodeproj
# Press Cmd+R in Xcode
```

## 📁 What's Where?

```
your-are-loud/
├── apps/                    ← Platform apps
│   ├── macos/              ← ✅ Working macOS app
│   ├── windows/            ← Windows app guide
│   ├── ios/                ← iOS app guide
│   ├── android/            ← Android app guide
│   └── chrome-extension/   ← Chrome ext guide
│
├── packages/               ← Shared TypeScript code
│   ├── core/               ← Constants, types
│   ├── audio-processing/   ← Audio algorithms
│   └── notifications/      ← Notification logic
│
├── docs/                   ← Documentation
└── scripts/                ← Build scripts
```

## 🚀 Next Steps

### Option 1: Use Existing macOS App
```bash
cd apps/macos
open your-are-loud.xcodeproj
# Build and run (Cmd+R)
```

### Option 2: Build Windows App
1. Read: `apps/windows/README.md`
2. Install Visual Studio 2022 + .NET 8
3. Create .NET MAUI project
4. Implement using provided code examples

### Option 3: Build Mobile Apps
1. Read: `apps/ios/README.md`
2. Install React Native dependencies
3. Initialize RN project
4. Implement using provided code examples

### Option 4: Build Chrome Extension
1. Read: `apps/chrome-extension/README.md`
2. Install dependencies
3. Set up webpack/build system
4. Implement using provided code examples

## 📚 Key Documents

| Read This First | For This Purpose |
|----------------|------------------|
| `README.md` | Overview & features |
| `MONOREPO_STRUCTURE.md` | Complete structure guide |
| `docs/architecture.md` | System design |
| `apps/[platform]/README.md` | Platform setup |

## 🛠️ Common Commands

```bash
# Setup everything
./scripts/setup.sh

# Build shared packages
pnpm run build

# Run tests
pnpm run test:all

# Clean everything
./scripts/clean.sh

# Build all platforms
./scripts/build-all.sh
```

## 💡 How It Works

1. **Microphone** captures your voice
2. **RMS calculation** measures volume
3. **Normalization** converts to 0.0-1.0 scale
4. **Threshold check** compares against your setting
5. **Notification** shown if too loud (with cooldown)

## 🎨 Shared Packages Usage

All TypeScript/JavaScript platforms can use shared packages:

```typescript
// Import shared logic
import { ThresholdDetector } from '@your-are-loud/core';
import { calculateRMS, normalizeVolume } from '@your-are-loud/audio-processing';
import { NotificationManager } from '@your-are-loud/notifications';

// Use in your app
const detector = new ThresholdDetector(0.7);
const volume = normalizeVolume(calculateRMS(audioSamples));

if (detector.exceedsThreshold(volume)) {
  console.log('Too loud!');
}
```

Native platforms (macOS/Windows) reimplement the same algorithms.

## 🔧 Development Workflow

### Working on Shared Packages
```bash
cd packages/core  # or audio-processing, notifications
# Make changes
pnpm run build
pnpm run test
```

### Working on Platform Apps
```bash
cd apps/[platform]
# Follow platform-specific README
```

## 🆘 Troubleshooting

### "pnpm not found"
```bash
npm install -g pnpm
```

### "Build failed"
```bash
./scripts/clean.sh
./scripts/setup.sh
```

### "Microphone not working"
- Check system permissions
- macOS: System Settings → Privacy → Microphone
- Windows: Settings → Privacy → Microphone

### "Package not found"
```bash
cd packages/[package-name]
pnpm run build
```

## 📊 Project Status

✅ **Ready to Use:**
- macOS app (fully functional)
- Shared TypeScript packages
- Complete documentation

📝 **Ready to Build:**
- Windows app (comprehensive guide)
- iOS/Android apps (comprehensive guide)
- Chrome extension (comprehensive guide)

## 🎯 Goals Achieved

✅ **Monorepo Structure**
- Clean, scalable organization
- Platform-specific isolation
- Shared code reuse

✅ **Preserved macOS App**
- Fully functional
- Moved to `apps/macos/`
- No behavioral changes

✅ **Platform Skeletons**
- Complete setup guides
- Code examples
- Architecture documented

✅ **Shared Packages**
- TypeScript implementation
- Well-documented APIs
- Ready to use

✅ **Documentation**
- Architecture guide
- Platform guides
- Contributing guide
- API documentation

## 🚀 Building Your Platform

Follow this checklist:

- [ ] Read `apps/[your-platform]/README.md`
- [ ] Install platform prerequisites
- [ ] Initialize project structure
- [ ] Install shared packages: `npm install @your-are-loud/*`
- [ ] Implement audio capture (platform-specific)
- [ ] Use shared packages for processing
- [ ] Implement notifications (platform-specific)
- [ ] Test thoroughly
- [ ] Update documentation

## 📞 Need Help?

1. Check platform-specific README
2. Read `docs/architecture.md`
3. Read `docs/contributing.md`
4. Check existing code examples

## 🎉 Success Criteria

You're ready when:
- ✅ Setup script runs without errors
- ✅ Shared packages build successfully
- ✅ macOS app runs (if on macOS)
- ✅ You understand the folder structure
- ✅ You've read the relevant docs

## 🔗 Quick Links

- **Main README**: [README.md](README.md)
- **Structure Guide**: [MONOREPO_STRUCTURE.md](MONOREPO_STRUCTURE.md)
- **Architecture**: [docs/architecture.md](docs/architecture.md)
- **Contributing**: [docs/contributing.md](docs/contributing.md)

---

**Questions?** Read the docs or check the code examples in READMEs!

**Ready to build?** Start with your platform's README in `apps/[platform]/`
