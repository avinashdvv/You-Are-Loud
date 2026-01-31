# @your-are-loud/notifications

Notification management and cooldown logic for Your Are Loud application.

## Installation

```bash
npm install @your-are-loud/notifications @your-are-loud/core
```

## Usage

### Cooldown Manager

```typescript
import { CooldownManager } from '@your-are-loud/notifications';

const cooldown = new CooldownManager(3000); // 3 seconds

// Check if notification can be shown
if (cooldown.canShowNotification()) {
  console.log('Showing notification...');
  cooldown.recordNotificationShown();
}

// Get time until next notification
const remaining = cooldown.getTimeUntilNextNotification();
console.log(`Wait ${remaining}ms before next notification`);
```

### Notification Manager

```typescript
import { NotificationManager } from '@your-are-loud/notifications';

const manager = new NotificationManager(3000);

// Check if should show warning
const volume = 0.85;
const threshold = 0.7;

if (manager.shouldShowNotification(volume, threshold)) {
  const config = manager.getDefaultNotificationConfig();
  // Show notification with config.title and config.body
}

// Get warning statistics
console.log(`Total warnings: ${manager.getWarningCount()}`);

// Get recent warnings (last 60 seconds)
const recent = manager.getRecentWarnings(60000);
console.log(`Recent warnings: ${recent.length}`);
```

## API Reference

### CooldownManager

Manages timing between notifications to prevent spam.

#### Constructor
```typescript
new CooldownManager(cooldownMs?: number)
```

**Parameters:**
- `cooldownMs`: Cooldown period in milliseconds (default: 3000)

#### Methods

##### canShowNotification(cooldownMs?: number): boolean
Check if enough time has passed to show another notification.

```typescript
const cooldown = new CooldownManager(3000);

if (cooldown.canShowNotification()) {
  // Show notification
}

// Override cooldown for this check
if (cooldown.canShowNotification(5000)) {
  // Uses 5 second cooldown instead
}
```

##### recordNotificationShown(): void
Record that a notification was shown.

```typescript
cooldown.recordNotificationShown();
// Updates last notification time to now
```

##### getLastNotificationTime(): Date | null
Get the timestamp of the last notification.

```typescript
const lastTime = cooldown.getLastNotificationTime();
if (lastTime) {
  console.log(`Last notification at ${lastTime.toISOString()}`);
}
```

##### getTimeUntilNextNotification(): number
Get time remaining until next notification can be shown (in milliseconds).

```typescript
const remaining = cooldown.getTimeUntilNextNotification();
console.log(`Wait ${remaining}ms`); // 0 if ready now
```

##### resetCooldown(): void
Reset the cooldown (allows immediate notification).

```typescript
cooldown.resetCooldown();
// Next call to canShowNotification() will return true
```

##### setCooldown(cooldownMs: number): void
Set a new cooldown period.

```typescript
cooldown.setCooldown(5000); // Change to 5 seconds
```

##### getCooldown(): number
Get the current cooldown period.

```typescript
const period = cooldown.getCooldown();
console.log(`Cooldown: ${period}ms`);
```

### NotificationManager

High-level notification management with history tracking.

#### Constructor
```typescript
new NotificationManager(cooldownMs?: number)
```

**Parameters:**
- `cooldownMs`: Cooldown period in milliseconds (default: 3000)

#### Methods

##### shouldShowNotification(volume: number, threshold: number): boolean
Determine if notification should be shown based on volume and cooldown.

```typescript
const manager = new NotificationManager();

const volume = 0.85;
const threshold = 0.7;

if (manager.shouldShowNotification(volume, threshold)) {
  // Show notification
  // Warning is automatically recorded
}
```

**Returns:** `true` if notification should be shown, `false` if still in cooldown

**Side effects:** Records warning event if returning `true`

##### getDefaultNotificationConfig(): NotificationConfig
Get the default notification configuration.

```typescript
const config = manager.getDefaultNotificationConfig();
console.log(config.title); // "🔊 You're Too Loud!"
console.log(config.body);  // "Please lower your voice during the call"
console.log(config.sound); // true
```

##### getCustomNotificationConfig(title: string, body: string, sound?: boolean): NotificationConfig
Create a custom notification configuration.

```typescript
const config = manager.getCustomNotificationConfig(
  'Custom Title',
  'Custom message',
  false // no sound
);
```

##### getWarningHistory(): WarningEvent[]
Get complete warning history.

```typescript
const history = manager.getWarningHistory();
history.forEach(event => {
  console.log(`Warning at ${event.timestamp}: ${event.volume} > ${event.threshold}`);
});
```

**WarningEvent type:**
```typescript
interface WarningEvent {
  timestamp: Date;
  volume: number;
  threshold: number;
}
```

##### getRecentWarnings(timeWindowMs: number): WarningEvent[]
Get warnings within a specific time window.

```typescript
// Get warnings in last 60 seconds
const recent = manager.getRecentWarnings(60000);
console.log(`${recent.length} warnings in last minute`);

// Get warnings in last hour
const hourly = manager.getRecentWarnings(3600000);
```

##### getWarningCount(): number
Get total number of warnings.

```typescript
const count = manager.getWarningCount();
console.log(`Total warnings: ${count}`);
```

##### clearHistory(): void
Clear all warning history.

```typescript
manager.clearHistory();
// Warning count reset to 0
```

##### resetCooldown(): void
Reset cooldown (allows immediate notification).

```typescript
manager.resetCooldown();
```

##### getTimeUntilNextNotification(): number
Get time until next notification can be shown.

```typescript
const ms = manager.getTimeUntilNextNotification();
console.log(`Next notification in ${ms}ms`);
```

##### getCooldownManager(): CooldownManager
Get the underlying cooldown manager instance.

```typescript
const cooldown = manager.getCooldownManager();
cooldown.setCooldown(5000); // Modify cooldown directly
```

## Examples

### Basic Usage

```typescript
import { NotificationManager } from '@your-are-loud/notifications';

const manager = new NotificationManager();

function processVolume(volume: number, threshold: number) {
  if (manager.shouldShowNotification(volume, threshold)) {
    const config = manager.getDefaultNotificationConfig();
    showSystemNotification(config.title, config.body);
  }
}
```

### With Audio Monitoring

```typescript
import { NotificationManager } from '@your-are-loud/notifications';
import { ThresholdDetector } from '@your-are-loud/core';
import { calculateRMS, normalizeVolume } from '@your-are-loud/audio-processing';

const manager = new NotificationManager(3000);
const detector = new ThresholdDetector(0.7);

function processAudioBuffer(buffer: Float32Array) {
  const rms = calculateRMS(buffer);
  const volume = normalizeVolume(rms);
  const threshold = detector.getThreshold();
  
  if (manager.shouldShowNotification(volume, threshold)) {
    console.log('Warning triggered!');
    // Show notification via platform API
  }
}
```

### Custom Notifications

```typescript
const manager = new NotificationManager();

// Custom message
const config = manager.getCustomNotificationConfig(
  '⚠️ Volume Alert',
  'Your voice level is high',
  true
);

// Use config with platform notification API
showNotification(config);
```

### Warning Statistics

```typescript
const manager = new NotificationManager();

// After some warnings...
console.log(`Total: ${manager.getWarningCount()}`);

// Recent activity
const lastMinute = manager.getRecentWarnings(60000);
console.log(`Last minute: ${lastMinute.length} warnings`);

const lastHour = manager.getRecentWarnings(3600000);
console.log(`Last hour: ${lastHour.length} warnings`);

// Get full history
const history = manager.getWarningHistory();
const firstWarning = history[0];
const lastWarning = history[history.length - 1];

console.log(`First warning: ${firstWarning.timestamp}`);
console.log(`Latest warning: ${lastWarning.timestamp}`);
```

### React Integration

```typescript
import { NotificationManager } from '@your-are-loud/notifications';
import { useState, useEffect } from 'react';

function AudioMonitor() {
  const [manager] = useState(() => new NotificationManager());
  const [warningCount, setWarningCount] = useState(0);
  const [timeUntilNext, setTimeUntilNext] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setWarningCount(manager.getWarningCount());
      setTimeUntilNext(manager.getTimeUntilNextNotification());
    }, 100);
    
    return () => clearInterval(interval);
  }, [manager]);
  
  const handleVolumeCheck = (volume: number, threshold: number) => {
    if (manager.shouldShowNotification(volume, threshold)) {
      // Show notification
      setWarningCount(manager.getWarningCount());
    }
  };
  
  return (
    <div>
      <div>Total Warnings: {warningCount}</div>
      <div>Next notification in: {timeUntilNext}ms</div>
    </div>
  );
}
```

### Cooldown Customization

```typescript
const manager = new NotificationManager(3000);

// Increase cooldown during important meeting
manager.getCooldownManager().setCooldown(10000); // 10 seconds

// Reset to normal after meeting
manager.getCooldownManager().setCooldown(3000); // 3 seconds

// Disable cooldown temporarily
manager.getCooldownManager().setCooldown(0); // Immediate warnings
```

## Design Patterns

### Separation of Concerns

- **CooldownManager**: Pure timing logic
- **NotificationManager**: Business logic + history

### Why Two Classes?

1. **CooldownManager**: Reusable timing utility
2. **NotificationManager**: Application-specific logic

Use **CooldownManager** directly for simple timing needs.

Use **NotificationManager** for complete notification management with history.

## Performance

- **Memory**: History limited to 100 events (configurable)
- **Timing**: O(1) operations for all methods
- **History**: O(n) for getRecentWarnings(), O(1) for getWarningCount()

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
