# Architecture Overview

## System Architecture

Your Are Loud is a cross-platform voice monitoring application built as a monorepo with shared business logic and platform-specific implementations.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Platform Applications                    │
├─────────────┬─────────────┬─────────────┬──────────────────┤
│   macOS     │   Windows   │ iOS/Android │  Chrome Extension│
│  (Swift)    │   (C#)      │(React Native)│  (TypeScript)   │
│             │             │             │                  │
│  Native UI  │  Native UI  │   RN UI     │   Web UI        │
│  AVFoundation│   NAudio    │  RN Audio   │   Web Audio API │
└──────┬──────┴──────┬──────┴──────┬──────┴─────────┬────────┘
       │             │             │                │
       │    (Native implementations)  (Direct usage)│
       │                            │                │
       └────────────────────────────┴────────────────┘
                                    │
                         ┌──────────┴──────────┐
                         │  Shared Packages    │
                         │  (TypeScript)       │
                         ├─────────────────────┤
                         │  @your-are-loud/    │
                         │  - core             │
                         │  - audio-processing │
                         │  - notifications    │
                         └─────────────────────┘
```

## Component Breakdown

### 1. Platform Applications (apps/)

#### macOS App
- **Technology**: Swift, SwiftUI, AVFoundation
- **Architecture**: MVVM with ObservableObject
- **Audio Processing**: Native Swift implementation
- **Integration**: Algorithms match TypeScript packages
- **UI**: MenuBarExtra (menu bar app)

#### Windows App
- **Technology**: C#, .NET MAUI, NAudio
- **Architecture**: MVVM with CommunityToolkit
- **Audio Processing**: NAudio for capture, C# implementation
- **Integration**: Algorithms match TypeScript packages
- **UI**: Native Windows window

#### iOS/Android Apps
- **Technology**: React Native, TypeScript
- **Architecture**: React Hooks + Context API
- **Audio Processing**: Direct use of shared TypeScript packages
- **Integration**: 100% shared code between iOS/Android
- **UI**: React Native components

#### Chrome Extension
- **Technology**: TypeScript, React, Manifest V3
- **Architecture**: Service Worker + Popup + Options
- **Audio Processing**: Direct use of shared TypeScript packages
- **Integration**: Web Audio API
- **UI**: React components in popup

### 2. Shared Packages (packages/)

#### @your-are-loud/core
**Purpose**: Core business logic, types, and constants

**Exports**:
- Constants (thresholds, cooldowns, messages)
- TypeScript types and interfaces
- ThresholdDetector class
- Business logic contracts

**Usage**:
```typescript
import { DEFAULT_VOLUME_THRESHOLD, ThresholdDetector } from '@your-are-loud/core';
```

#### @your-are-loud/audio-processing
**Purpose**: Audio processing algorithms

**Exports**:
- RMS calculation (`calculateRMS()`)
- Volume normalization (`normalizeVolume()`)
- Audio buffer processing (`AudioBufferProcessor`)
- Decibel conversions

**Usage**:
```typescript
import { calculateRMS, normalizeVolume } from '@your-are-loud/audio-processing';
```

**Algorithm Flow**:
1. Capture audio samples (Float32Array)
2. Calculate RMS: `sqrt(sum(samples^2) / count)`
3. Convert to dB: `20 * log10(rms)`
4. Normalize: `(dB + 50) / 50` (clamped 0.0-1.0)

#### @your-are-loud/notifications
**Purpose**: Notification management and cooldown logic

**Exports**:
- CooldownManager (timing logic)
- NotificationManager (high-level API)
- Warning history tracking

**Usage**:
```typescript
import { NotificationManager } from '@your-are-loud/notifications';
```

## Data Flow

### Audio Processing Pipeline

```
Microphone Input
       ↓
[Platform-Specific Audio Capture]
  • macOS: AVAudioEngine
  • Windows: NAudio WaveInEvent
  • iOS/Android: react-native-audio-record
  • Chrome: Web Audio API (getUserMedia)
       ↓
[Audio Buffer - Float32Array]
       ↓
[RMS Calculation] ← calculateRMS() from shared package
       ↓
[Volume Normalization] ← normalizeVolume() from shared package
       ↓
[Threshold Detection] ← ThresholdDetector from shared package
       ↓
[Cooldown Check] ← CooldownManager from shared package
       ↓
[Notification Trigger]
  • macOS: UNNotification + NSSound.beep()
  • Windows: ToastNotification + SystemSounds.Beep
  • iOS/Android: Push notifications
  • Chrome: chrome.notifications API
```

### State Management

Each platform manages state independently but follows the same model:

```typescript
interface AudioState {
  currentVolume: number;      // 0.0 - 1.0
  isMonitoring: boolean;
  volumeThreshold: number;    // 0.3 - 1.0
  warningCount: number;
  lastWarningTime: Date | null;
}
```

**State Updates**:
1. User starts monitoring → `isMonitoring = true`
2. Audio buffer processed → `currentVolume` updated (60+ times/sec)
3. Threshold exceeded → `warningCount++`, `lastWarningTime = now`
4. User stops monitoring → `isMonitoring = false`, `currentVolume = 0`

## Algorithm Consistency

All platforms use the same core algorithm:

### RMS Calculation
```
Input: Float32Array samples
Process:
  1. Square each sample
  2. Sum all squared samples
  3. Divide by sample count (mean)
  4. Take square root
Output: RMS value
```

### Volume Normalization
```
Input: RMS value
Process:
  1. Convert to dB: 20 * log10(rms)
  2. Add reference dB: dB + 50
  3. Divide by reference: (dB + 50) / 50
  4. Clamp to [0.0, 1.0]
Output: Normalized volume (0.0 - 1.0)
```

### Threshold Detection
```
Input: Normalized volume, threshold
Process:
  1. Compare: volume > threshold
  2. Check cooldown: now - lastWarning >= 3000ms
  3. If both true: trigger warning
Output: Warning event (or none)
```

## Platform Integration Strategies

### Strategy 1: Native Implementation (macOS, Windows)
- Reimplement algorithms in native language (Swift, C#)
- Match TypeScript implementation behavior
- Pros: Maximum performance, no bridge overhead
- Cons: Code duplication, manual sync required

### Strategy 2: Direct Usage (React Native, Chrome Extension)
- Directly import and use TypeScript packages
- Pros: Zero duplication, automatic sync
- Cons: Requires JavaScript runtime

### Strategy 3: Bridge Layer (Future)
- Use JavaScript bridge (WKWebView, etc.) for native platforms
- Load TypeScript packages in native apps
- Pros: Single source of truth
- Cons: Additional complexity, performance overhead

**Current Approach**: Strategy 1 for native apps, Strategy 2 for JS-based apps

## Security & Privacy

### Data Handling
- **Audio Data**: Processed in real-time, never stored
- **Volume Metrics**: Only normalized values (no raw audio)
- **User Settings**: Stored locally only
- **Network**: No network requests (100% local processing)

### Permissions
- **Microphone**: Required for all platforms
- **Notifications**: Required for warnings
- **Storage**: Local settings only (no cloud sync)

## Performance Considerations

### Audio Processing
- **Sample Rate**: 44.1 kHz (standard)
- **Buffer Size**: 1024 samples (~23ms at 44.1kHz)
- **Processing Frequency**: ~60 Hz (every buffer)
- **CPU Usage**: < 5% on modern devices

### Memory Usage
- **Audio Buffers**: ~4KB per buffer (Float32Array)
- **State**: Minimal (< 1KB)
- **History**: Limited to 100 warnings max

### Optimization Strategies
1. **Efficient RMS**: Single-pass calculation
2. **Cooldown**: Prevent excessive notifications
3. **Throttling**: Process audio at reasonable intervals
4. **Memory Management**: Reuse buffers, limit history

## Testing Strategy

### Unit Tests
- Shared packages: Jest tests
- Test RMS calculation accuracy
- Test normalization edge cases
- Test threshold detection logic
- Test cooldown timing

### Integration Tests
- Audio pipeline end-to-end
- Mock audio input
- Verify notification triggers
- Test state transitions

### Manual Testing
- Real microphone input
- Various volume levels
- Edge cases (very quiet, very loud)
- Long-running sessions
- Multiple start/stop cycles

## Deployment Architecture

### Development
```
Developer Machine
├── macOS: Xcode build
├── Windows: Visual Studio build
├── Mobile: Metro bundler (RN)
└── Chrome: Webpack dev server
```

### Production
```
Distribution Channels
├── macOS: Direct download or Mac App Store
├── Windows: MSIX package or Microsoft Store
├── iOS: TestFlight → App Store
├── Android: APK or Google Play Store
└── Chrome: Chrome Web Store (.zip upload)
```

## Scalability

### Current Scale
- Single-user applications
- Local processing only
- No backend required

### Future Scale (Optional)
- Cloud settings sync
- Usage analytics
- Team/organization features
- Multi-device support

## Monitoring & Debugging

### Logging Strategy
- Development: Verbose console logs
- Production: Error-level logs only
- No PII (Personally Identifiable Information)
- Audio data never logged

### Debug Tools
- macOS: Xcode debugger, Instruments
- Windows: Visual Studio debugger
- React Native: React Native Debugger
- Chrome: Chrome DevTools

## Versioning Strategy

### Semantic Versioning (SemVer)
- **Major (X.0.0)**: Breaking changes
- **Minor (0.X.0)**: New features (backward compatible)
- **Patch (0.0.X)**: Bug fixes

### Package Versioning
- Shared packages: Independent versioning
- Platform apps: Independent versioning
- Monorepo version: Tracks overall project

### Release Coordination
1. Update shared packages
2. Test with all platform apps
3. Update platform apps if needed
4. Tag release in git
5. Deploy to distribution channels

## Maintenance

### Code Synchronization
- Shared packages: Single source of truth
- Native implementations: Manual sync required
- Regular audits to ensure parity

### Dependency Updates
- Monthly: Check for security updates
- Quarterly: Update minor versions
- Annually: Update major versions

### Platform Updates
- macOS: Monitor Xcode/Swift releases
- Windows: Monitor .NET releases
- React Native: Monitor RN releases
- Chrome: Monitor Manifest V3 changes

## Future Architecture Considerations

### Potential Enhancements
1. **WebAssembly**: Compile shared logic to WASM for native apps
2. **Rust Core**: Rewrite audio processing in Rust for all platforms
3. **Cloud Backend**: Optional sync and analytics
4. **Plugin System**: Extensible notification handlers
5. **ML Integration**: Adaptive threshold learning

### Technology Evolution
- Monitor WebAssembly adoption
- Consider Flutter for mobile (single codebase)
- Evaluate Tauri for desktop (alternative to native)
- Watch for Web Audio API improvements

---

**This architecture enables**:
- ✅ Platform-specific optimization
- ✅ Code reuse where beneficial
- ✅ Independent platform evolution
- ✅ Consistent user experience
- ✅ Easy maintenance and updates
