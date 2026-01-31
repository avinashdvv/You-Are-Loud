# @your-are-loud/audio-processing

Audio processing algorithms for Your Are Loud - RMS calculation, volume normalization, and buffer processing.

## Installation

```bash
npm install @your-are-loud/audio-processing @your-are-loud/core
```

## Usage

### RMS Calculation

```typescript
import { calculateRMS, rmsToDecibels } from '@your-are-loud/audio-processing';

// From audio samples
const samples = new Float32Array([0.1, 0.2, -0.1, 0.15]);
const rms = calculateRMS(samples);
console.log(rms); // 0.145

// Convert to decibels
const db = rmsToDecibels(rms);
console.log(db); // -16.77 dB
```

### Volume Normalization

```typescript
import { normalizeVolume } from '@your-are-loud/audio-processing';

const rms = 0.05;
const normalized = normalizeVolume(rms); // 0.0 - 1.0
console.log(normalized); // 0.54
```

### Audio Buffer Processing

```typescript
import { AudioBufferProcessor } from '@your-are-loud/audio-processing';
import type { AudioBuffer } from '@your-are-loud/core';

const processor = new AudioBufferProcessor({
  smoothing: true,
  smoothingFactor: 0.3,
});

const buffer: AudioBuffer = {
  data: new Float32Array([/* samples */]),
  sampleRate: 44100,
  channelCount: 1,
  frameLength: 1024,
};

const volumeInfo = processor.processBuffer(buffer);
console.log(volumeInfo.normalized); // 0.0 - 1.0
console.log(volumeInfo.decibels);   // dB value
console.log(volumeInfo.level);      // 'low' | 'medium' | 'high'
```

## API Reference

### RMS Calculation

#### calculateRMS(samples: Float32Array): number
Calculate Root Mean Square of audio samples.

**Formula:** `sqrt(sum(samples²) / count)`

```typescript
const samples = new Float32Array([0.1, 0.2, 0.3]);
const rms = calculateRMS(samples); // 0.214
```

#### calculateRMSWithStride(samples: Float32Array, stride?: number): number
Calculate RMS with stride (skip samples for performance).

```typescript
const samples = new Float32Array([/* large array */]);
const rms = calculateRMSWithStride(samples, 2); // Every 2nd sample
```

#### rmsToDecibels(rms: number): number
Convert RMS value to decibels.

**Formula:** `20 * log10(rms)`

```typescript
const rms = 0.5;
const db = rmsToDecibels(rms); // -6.02 dB
```

#### decibelsToRMS(decibels: number): number
Convert decibels to RMS value.

**Formula:** `10^(dB/20)`

```typescript
const db = -6;
const rms = decibelsToRMS(db); // 0.501
```

### Volume Normalization

#### normalizeVolume(rms: number, referenceDb?: number): number
Normalize RMS to 0.0-1.0 range.

**Default reference:** 50 dB

**Formula:** `(20*log10(rms) + ref) / ref` (clamped to 0-1)

```typescript
const rms = 0.05;
const normalized = normalizeVolume(rms); // 0.54
const customNormalized = normalizeVolume(rms, 40); // Custom reference
```

#### normalizeVolumeWithRange(rms: number, minDb?: number, maxDb?: number): number
Normalize with custom dB range.

```typescript
const rms = 0.1;
const normalized = normalizeVolumeWithRange(rms, -50, 0);
```

#### smoothVolume(current: number, previous: number, factor?: number): number
Apply exponential smoothing to reduce jitter.

```typescript
const current = 0.8;
const previous = 0.6;
const smoothed = smoothVolume(current, previous, 0.3); // 0.74
```

### Audio Buffer Processor

#### Class: AudioBufferProcessor

```typescript
constructor(options?: {
  smoothing?: boolean;
  smoothingFactor?: number;
})
```

**Options:**
- `smoothing`: Enable volume smoothing (default: false)
- `smoothingFactor`: Smoothing factor 0.0-1.0 (default: 0.3)

#### Methods

##### processBuffer(buffer: AudioBuffer): VolumeInfo
Process audio buffer and return volume information.

```typescript
const processor = new AudioBufferProcessor();
const info = processor.processBuffer(buffer);
// Returns: { normalized, decibels, level, exceedsThreshold }
```

##### calculateRMS(samples: Float32Array): number
Calculate RMS (implements interface).

##### normalizeVolume(rms: number): number
Normalize volume (implements interface).

##### setSmoothing(enabled: boolean, factor?: number): void
Enable/disable smoothing.

```typescript
processor.setSmoothing(true, 0.5);
```

##### reset(): void
Reset processor state (clears smoothing history).

```typescript
processor.reset();
```

## Examples

### Complete Audio Processing Pipeline

```typescript
import { AudioBufferProcessor } from '@your-are-loud/audio-processing';
import { ThresholdDetector } from '@your-are-loud/core';

const processor = new AudioBufferProcessor({ smoothing: true });
const detector = new ThresholdDetector(0.7);

function processAudio(audioData: Float32Array) {
  // Create buffer
  const buffer = {
    data: audioData,
    sampleRate: 44100,
    channelCount: 1,
    frameLength: audioData.length,
  };
  
  // Process
  const volumeInfo = processor.processBuffer(buffer);
  
  // Check threshold
  const volumeLevel = detector.createVolumeInfo(
    volumeInfo.normalized,
    volumeInfo.decibels
  );
  
  if (volumeLevel.exceedsThreshold) {
    console.log('Warning: Too loud!');
  }
  
  return volumeInfo;
}
```

### Web Audio API Integration

```typescript
import { calculateRMS, normalizeVolume } from '@your-are-loud/audio-processing';

// Setup Web Audio
const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 2048;

const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
const source = audioContext.createMediaStreamSource(stream);
source.connect(analyser);

// Process audio
function analyze() {
  const dataArray = new Float32Array(analyser.frequencyBinCount);
  analyser.getFloatTimeDomainData(dataArray);
  
  const rms = calculateRMS(dataArray);
  const volume = normalizeVolume(rms);
  
  console.log(`Volume: ${(volume * 100).toFixed(0)}%`);
  
  requestAnimationFrame(analyze);
}

analyze();
```

### React Native Integration

```typescript
import AudioRecord from 'react-native-audio-record';
import { calculateRMS, normalizeVolume } from '@your-are-loud/audio-processing';

const options = {
  sampleRate: 44100,
  channels: 1,
  bitsPerSample: 16,
};

AudioRecord.init(options);
AudioRecord.start();

// Poll audio data
setInterval(async () => {
  const audioData = await AudioRecord.getAudioData();
  const buffer = base64ToFloat32Array(audioData);
  
  const rms = calculateRMS(buffer);
  const volume = normalizeVolume(rms);
  
  console.log(`Volume: ${volume}`);
}, 100);
```

### Performance Optimization

```typescript
import { calculateRMSWithStride } from '@your-are-loud/audio-processing';

// For large buffers, use stride to skip samples
const largeBuffer = new Float32Array(44100); // 1 second at 44.1kHz

// Process every 4th sample (4x faster)
const rms = calculateRMSWithStride(largeBuffer, 4);

// Still provides accurate volume measurement
const volume = normalizeVolume(rms);
```

## Algorithm Details

### RMS Calculation

RMS (Root Mean Square) measures the magnitude of audio signal:

1. Square each sample: `sample²`
2. Calculate mean: `sum(squares) / count`
3. Take square root: `sqrt(mean)`

**Why RMS?** It provides a better representation of perceived loudness than simple averaging.

### Volume Normalization

Converts RMS to a 0.0-1.0 scale:

1. Convert to decibels: `dB = 20 * log10(rms)`
2. Add reference: `adjusted = dB + 50` (default reference)
3. Normalize: `normalized = adjusted / 50`
4. Clamp: `max(0, min(1, normalized))`

**Reference dB:** The value used to map typical voice levels to 0.0-1.0 range. Default 50 works well for typical microphone input.

### Smoothing

Exponential moving average to reduce jitter:

```
smoothed = factor * previous + (1 - factor) * current
```

- Higher factor = more smoothing (slower response)
- Lower factor = less smoothing (faster response)
- Recommended: 0.3 for good balance

## Performance

- **RMS Calculation**: O(n) time, O(1) space
- **Normalization**: O(1) time and space
- **Smoothing**: O(1) time and space

Typical performance (1024 samples):
- calculateRMS: ~0.01ms
- normalizeVolume: ~0.001ms
- Total pipeline: < 0.02ms

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
