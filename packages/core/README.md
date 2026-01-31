# @your-are-loud/core

Core business logic, types, and constants for Your Are Loud application.

## Installation

```bash
# Using npm
npm install @your-are-loud/core

# Using pnpm
pnpm add @your-are-loud/core

# Using yarn
yarn add @your-are-loud/core
```

## Usage

### Constants

```typescript
import {
  DEFAULT_VOLUME_THRESHOLD,
  MIN_VOLUME_THRESHOLD,
  MAX_VOLUME_THRESHOLD,
  WARNING_COOLDOWN_MS,
  VOLUME_COLORS,
  WARNING_MESSAGES,
} from '@your-are-loud/core';

console.log(DEFAULT_VOLUME_THRESHOLD); // 0.7
console.log(WARNING_COOLDOWN_MS); // 3000
console.log(WARNING_MESSAGES.TITLE); // "🔊 You're Too Loud!"
```

### Types

```typescript
import type {
  AudioState,
  AudioConfig,
  VolumeInfo,
  NotificationConfig,
} from '@your-are-loud/core';

const state: AudioState = {
  currentVolume: 0.5,
  isMonitoring: true,
  volumeThreshold: 0.7,
  warningCount: 2,
  lastWarningTime: new Date(),
};
```

### Threshold Detector

```typescript
import { ThresholdDetector } from '@your-are-loud/core';

const detector = new ThresholdDetector(0.7);

// Check if volume exceeds threshold
if (detector.exceedsThreshold(0.8)) {
  console.log('Too loud!');
}

// Get volume level (low, medium, high)
const level = detector.getVolumeLevel(0.8); // 'high'

// Create volume info
const volumeInfo = detector.createVolumeInfo(0.8, -10);
console.log(volumeInfo.exceedsThreshold); // true
console.log(volumeInfo.level); // 'high'

// Change threshold
detector.setThreshold(0.6);
```

## API Reference

### Constants

| Constant | Type | Value | Description |
|----------|------|-------|-------------|
| `DEFAULT_VOLUME_THRESHOLD` | number | 0.7 | Default volume threshold (0.0-1.0) |
| `MIN_VOLUME_THRESHOLD` | number | 0.3 | Minimum allowed threshold |
| `MAX_VOLUME_THRESHOLD` | number | 1.0 | Maximum allowed threshold |
| `WARNING_COOLDOWN_MS` | number | 3000 | Milliseconds between warnings |
| `AUDIO_BUFFER_SIZE` | number | 1024 | Audio buffer size in samples |
| `AUDIO_SAMPLE_RATE` | number | 44100 | Audio sample rate in Hz |
| `RMS_REFERENCE_DB` | number | 50 | Reference dB for normalization |

### Types

#### AudioState
```typescript
interface AudioState {
  currentVolume: number;      // Normalized volume (0.0-1.0)
  isMonitoring: boolean;      // Is monitoring active
  volumeThreshold: number;    // Warning threshold (0.3-1.0)
  warningCount: number;       // Total warnings triggered
  lastWarningTime: Date | null; // Last warning timestamp
}
```

#### VolumeInfo
```typescript
interface VolumeInfo {
  normalized: number;         // Normalized volume (0.0-1.0)
  decibels: number;          // Volume in dB
  level: VolumeLevel;        // 'low' | 'medium' | 'high'
  exceedsThreshold: boolean; // True if over threshold
}
```

### ThresholdDetector

#### Constructor
```typescript
new ThresholdDetector(threshold?: number)
```

#### Methods

##### setThreshold(value: number): void
Set the volume threshold.
- Throws error if value is outside valid range (0.3-1.0)

##### getThreshold(): number
Get the current threshold.

##### exceedsThreshold(normalizedVolume: number): boolean
Check if volume exceeds the threshold.

##### getVolumeLevel(normalizedVolume: number): VolumeLevel
Determine volume level based on threshold:
- `'high'`: Above threshold
- `'medium'`: Between 80% and 100% of threshold
- `'low'`: Below 80% of threshold

##### createVolumeInfo(normalizedVolume: number, decibels: number): VolumeInfo
Create a complete volume info object.

##### static isValidThreshold(value: number): boolean
Validate a threshold value (must be 0.3-1.0).

## Examples

### Basic Usage

```typescript
import { ThresholdDetector, DEFAULT_VOLUME_THRESHOLD } from '@your-are-loud/core';

// Create detector with default threshold
const detector = new ThresholdDetector();

// Or with custom threshold
const customDetector = new ThresholdDetector(0.6);

// Check volume
const currentVolume = 0.75;
if (detector.exceedsThreshold(currentVolume)) {
  console.log('Warning: You are speaking too loudly!');
}
```

### With Audio Processing

```typescript
import { ThresholdDetector } from '@your-are-loud/core';
import { calculateRMS, normalizeVolume } from '@your-are-loud/audio-processing';

const detector = new ThresholdDetector(0.7);

function processAudioBuffer(buffer: Float32Array) {
  // Calculate RMS
  const rms = calculateRMS(buffer);
  
  // Normalize to 0.0-1.0
  const volume = normalizeVolume(rms);
  
  // Check threshold
  if (detector.exceedsThreshold(volume)) {
    console.log('Too loud!');
  }
  
  // Get volume info
  const info = detector.createVolumeInfo(volume, rmsToDecibels(rms));
  console.log(`Level: ${info.level}, Exceeds: ${info.exceedsThreshold}`);
}
```

### With State Management

```typescript
import type { AudioState } from '@your-are-loud/core';
import { useState } from 'react';

function useAudioMonitoring() {
  const [state, setState] = useState<AudioState>({
    currentVolume: 0,
    isMonitoring: false,
    volumeThreshold: 0.7,
    warningCount: 0,
    lastWarningTime: null,
  });
  
  const updateVolume = (volume: number) => {
    setState(prev => ({ ...prev, currentVolume: volume }));
  };
  
  return { state, updateVolume };
}
```

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm run build

# Test
pnpm run test

# Lint
pnpm run lint
```

## License

MIT
