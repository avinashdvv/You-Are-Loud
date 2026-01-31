# Your Are Loud - Monorepo Structure

## 📁 Folder Organization

```
your-are-loud/
├── apps/                           # Platform-specific applications
│   ├── macos/                      # macOS native app (Swift/SwiftUI)
│   ├── windows/                    # Windows native app (C#/.NET MAUI or C++/WinUI3)
│   ├── mobile/                     # iOS & Android app (React Native - shared codebase)
│   │   ├── src/                    # Shared React Native TypeScript code
│   │   ├── android/                # Android-specific native code (Java/Kotlin)
│   │   └── ios/                    # iOS-specific native code (Swift/Objective-C)
│   └── chrome-extension/           # Chrome extension (TypeScript/Manifest V3)
│
├── packages/                       # Shared code packages
│   ├── core/                       # Core business logic (TypeScript)
│   │   ├── src/
│   │   │   ├── constants.ts        # Shared constants
│   │   │   ├── types.ts            # Shared TypeScript types
│   │   │   ├── AudioProcessor.ts   # Audio processing interface/contract
│   │   │   └── ThresholdDetector.ts # Volume threshold logic
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── audio-processing/           # Audio processing algorithms (TypeScript)
│   │   ├── src/
│   │   │   ├── rmsCalculator.ts    # RMS calculation
│   │   │   ├── volumeNormalizer.ts # Volume normalization
│   │   │   └── bufferProcessor.ts  # Audio buffer processing
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── notifications/              # Notification logic (TypeScript)
│       ├── src/
│       │   ├── NotificationManager.ts
│       │   └── CooldownManager.ts  # Warning cooldown logic
│       ├── package.json
│       └── tsconfig.json
│
├── docs/                           # Documentation
│   ├── architecture.md             # Architecture overview
│   ├── platform-guides/            # Platform-specific guides
│   │   ├── macos.md
│   │   ├── windows.md
│   │   ├── mobile.md
│   │   └── chrome-extension.md
│   └── contributing.md
│
├── scripts/                        # Build and utility scripts
│   ├── setup.sh                    # Initial setup script
│   ├── build-all.sh                # Build all platforms
│   └── clean.sh                    # Clean all build artifacts
│
├── .gitignore                      # Root gitignore
├── package.json                    # Root package.json (workspace)
├── pnpm-workspace.yaml             # PNPM workspace configuration
├── README.md                       # Main README
└── LICENSE                         # License file
```

## 🎯 Design Principles

### 1. **Platform Independence**
- Each app in `apps/` can be built and deployed independently
- No cross-dependencies between platform apps
- Shared logic lives in `packages/`

### 2. **Native First**
- macOS: Swift/SwiftUI (existing)
- Windows: C#/.NET MAUI or C++/WinUI3 (no Electron)
- iOS/Android: React Native (single shared codebase in `apps/mobile/`)
- Chrome Extension: TypeScript/Manifest V3

### 3. **Shared Logic Extraction**
Only business logic and algorithms are shared:
- **Audio Processing**: RMS calculation, volume normalization
- **Threshold Detection**: When to trigger warnings
- **Notification Logic**: Cooldown management, message formatting
- **Constants**: Default thresholds, cooldown times, etc.

Platform-specific code remains in respective apps:
- UI/UX components
- Native API integrations (microphone, notifications)
- Platform permissions handling

### 4. **Build Isolation**
Each platform has its own:
- Build system (Xcode, MSBuild, Gradle, npm)
- Dependencies
- CI/CD pipeline
- Release process

## 📦 Package Management

### TypeScript/JavaScript Ecosystem (pnpm)
- Shared packages: TypeScript
- React Native apps: npm/pnpm
- Chrome extension: npm/pnpm

### Native Platforms
- macOS: Swift Package Manager (SPM) / CocoaPods
- Windows: NuGet / vcpkg

### Workspace Configuration
Using **pnpm workspaces** for JavaScript/TypeScript packages:
- Faster installs
- Efficient disk space usage
- Better monorepo support than npm/yarn

## 🔄 Dependency Flow

```
┌─────────────────────────────────────────────────────┐
│                  Platform Apps                      │
│  ┌──────┐ ┌─────────┐ ┌──────────────┐ ┌─────────┐│
│  │macOS │ │ Windows │ │ iOS/Android  │ │ Chrome  ││
│  └──┬───┘ └────┬────┘ └──────┬───────┘ └────┬────┘│
│     │          │              │              │     │
│     └──────────┴──────────────┴──────────────┘     │
│                       │                            │
│                  (consume)                         │
│                       ↓                            │
│              ┌─────────────────┐                   │
│              │  Shared Packages │                  │
│              │  • core          │                  │
│              │  • audio-proc.   │                  │
│              │  • notifications │                  │
│              └─────────────────┘                   │
└─────────────────────────────────────────────────────┘
```

## 🚀 Getting Started

### Prerequisites
- **macOS**: Xcode 14+, Swift 5.7+
- **Windows**: Visual Studio 2022, .NET 7+
- **React Native**: Node.js 18+, React Native CLI
- **Chrome Extension**: Node.js 18+, TypeScript 5+

### Initial Setup
```bash
# Clone the repository
git clone <repo-url>
cd your-are-loud

# Install JavaScript dependencies
pnpm install

# Build shared packages
pnpm run build

# Platform-specific setup
cd apps/macos && open your-are-loud.xcodeproj
cd apps/windows && dotnet restore
cd apps/mobile && npm install  # Single React Native app for both iOS & Android
cd apps/chrome-extension && pnpm install
```

## 🔨 Build Commands

### All Platforms
```bash
pnpm run build:all        # Build all packages and apps
pnpm run test:all         # Run all tests
pnpm run clean:all        # Clean all build artifacts
```

### Individual Platforms
```bash
# macOS
cd apps/macos && xcodebuild

# Windows
cd apps/windows && dotnet build

# iOS & Android (unified mobile app)
cd apps/mobile && npm run ios     # For iOS
cd apps/mobile && npm run android # For Android

# Chrome Extension
cd apps/chrome-extension && pnpm build
```

## 📱 Platform-Specific Notes

### macOS (Existing App)
- **Location**: `apps/macos/`
- **Tech Stack**: Swift, SwiftUI, AVFoundation
- **Build**: Xcode project
- **Migration**: Existing code moved here with minimal changes
- **Shared Logic Integration**: Optional TypeScript→Swift bridge (future enhancement)

### Windows (New)
- **Location**: `apps/windows/`
- **Tech Stack Options**:
  1. **.NET MAUI** (C#) - Recommended for cross-platform Windows/Linux
  2. **WinUI 3** (C++) - Native Windows-only
- **Audio API**: NAudio or Windows.Media.Audio
- **Notifications**: Windows Notifications API

### iOS/Android (New - React Native)
- **Location**: `apps/mobile/` (unified app with shared code)
- **Shared Code**: All JavaScript/TypeScript/React code in `src/`
- **Native Folders**: `android/` and `ios/` for platform-specific native code only
- **Audio Library**: `react-native-audio-record`
- **Notifications**: `react-native-push-notification` (Android) + `@react-native-community/push-notification-ios` (iOS)
- **Permissions**: `react-native-permissions`
- **Benefits**: No code duplication, single codebase for both platforms

### Chrome Extension (New)
- **Location**: `apps/chrome-extension/`
- **Manifest**: V3 (latest standard)
- **Audio Access**: Chrome APIs (`chrome.tabCapture` / `getUserMedia`)
- **UI**: Popup + Options page
- **Notifications**: Chrome Notifications API

## 🔐 Shared Package Integration

### For TypeScript/JavaScript Platforms
Direct import from workspace:
```typescript
import { AudioProcessor } from '@your-are-loud/audio-processing';
import { ThresholdDetector } from '@your-are-loud/core';
```

### For Native Platforms (macOS/Windows)
Two options:
1. **Manual Port**: Reimplement algorithms in native language (current approach)
2. **Bridge Layer**: Use WebView/JavaScript bridge (future enhancement)

## 🎨 UI/UX Consistency

While each platform uses native UI components, maintain consistency in:
- Color scheme (Green → Yellow → Red volume indicator)
- Threshold range (0.3 - 1.0)
- Warning messages
- Cooldown period (3 seconds)
- Default threshold (0.7)

## 📊 State Management

Each platform manages its own state but follows the same model:
```typescript
interface AppState {
  currentVolume: number;      // 0.0 - 1.0
  isMonitoring: boolean;
  volumeThreshold: number;    // 0.3 - 1.0
  warningCount: number;
  lastWarningTime: Date | null;
}
```

## 🔮 Future Enhancements

### Phase 1: Core Platforms (Current)
- ✅ macOS (existing)
- 🔄 Monorepo structure
- 📝 Documentation

### Phase 2: Windows Desktop
- Windows native app development
- Audio processing integration
- Notification system

### Phase 3: Mobile (React Native)
- iOS app
- Android app
- Mobile-optimized UI

### Phase 4: Browser Extension
- Chrome extension
- Edge support (Chromium-based)
- Firefox extension (optional)

### Phase 5: Advanced Features
- Cloud sync of settings
- Analytics dashboard
- Team/organization features
- Integration with video conferencing platforms

## 🧪 Testing Strategy

### Shared Packages
```bash
cd packages/core && pnpm test
cd packages/audio-processing && pnpm test
```

### Platform Apps
Each platform uses its native testing framework:
- macOS: XCTest
- Windows: xUnit / MSTest
- React Native: Jest + React Native Testing Library
- Chrome Extension: Jest + Puppeteer

## 📝 Contributing Guidelines

### Adding a New Platform
1. Create directory in `apps/[platform-name]`
2. Set up platform-specific build system
3. Implement core features using shared packages where possible
4. Add platform guide to `docs/platform-guides/[platform].md`
5. Update root `README.md` and `MONOREPO_STRUCTURE.md`

### Adding Shared Logic
1. Evaluate if logic is truly platform-agnostic
2. Create or update package in `packages/`
3. Write tests
4. Update documentation
5. Consider versioning impact

## 🔄 Version Management

### Semantic Versioning
- Shared packages follow SemVer
- Breaking changes require major version bump
- Platform apps version independently

### Release Strategy
- Shared packages: Published to npm/GitHub Packages
- Platform apps: Independent release cycles
- Changelog maintained per package/app

## 🛠 Maintenance

### Dependency Updates
```bash
# Update all JavaScript dependencies
pnpm update --recursive

# Update platform-specific dependencies
cd apps/macos && pod update
cd apps/windows && dotnet outdated
```

### Code Quality
- ESLint + Prettier for TypeScript/JavaScript
- SwiftLint for Swift
- Roslyn analyzers for C#
- Automated formatting on commit (Husky + lint-staged)

---

**This monorepo structure allows each platform to evolve independently while sharing core business logic, ensuring maintainability and scalability.**
