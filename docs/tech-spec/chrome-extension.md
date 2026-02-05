# Chrome Extension Technical Specification

**Project:** Your Are Loud - Voice Monitoring Chrome Extension  
**Version:** 1.0.0  
**Last Updated:** 2026-02-05  
**Manifest Version:** 3  
**Minimum Chrome Version:** 109+

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Component Specifications](#component-specifications)
4. [Message Protocol](#message-protocol)
5. [Data Structures](#data-structures)
6. [API Documentation](#api-documentation)
7. [Audio Processing Pipeline](#audio-processing-pipeline)
8. [Storage Schema](#storage-schema)
9. [Security & Privacy](#security--privacy)
10. [Development Guide](#development-guide)
11. [Testing Strategy](#testing-strategy)
12. [Deployment](#deployment)
13. [Troubleshooting](#troubleshooting)

---

## Overview

### Purpose
A Chrome extension that monitors microphone input during video calls and provides real-time visual and notification-based feedback when the user's voice exceeds a configurable threshold for 1 minute continuously.

### Key Features
- **Persistent Background Monitoring** - Continues even when popup is closed
- **Real-time Volume Graph** - Interactive chart showing 10-minute history (Recharts)
- **Smart Notification System** - Alerts after 1 minute of continuous loud speaking
- **Browser Notifications** - Native Chrome notifications with interaction requirement
- **Configurable Threshold** - User-adjustable sensitivity slider with visual reference line
- **Usage Statistics** - Warning count tracking
- **State Persistence** - Remembers settings across sessions

### Technology Stack
- **Language:** TypeScript
- **UI Framework:** React 18
- **Charting Library:** Recharts 3.7.0
- **Build Tool:** Webpack 5
- **Audio API:** Web Audio API (getUserMedia, AudioContext)
- **Extension APIs:** Chrome Extension Manifest V3
- **Shared Packages:** 
  - `@your-are-loud/core` - Threshold detection logic
  - `@your-are-loud/audio-processing` - RMS calculation, normalization

---

## Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CHROME BROWSER                            │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                     POPUP UI (React + Recharts)              │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │ │
│  │  │ Volume Graph │  │   Controls   │  │ Settings Panel  │  │ │
│  │  │ (10m history)│  │  Start/Stop  │  │ Threshold Slider│  │ │
│  │  │  Recharts    │  │              │  │                 │  │ │
│  │  └──────────────┘  └──────────────┘  └─────────────────┘  │ │
│  │           ↕ chrome.runtime.sendMessage()                   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              ↕                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │         BACKGROUND SERVICE WORKER (Orchestrator)           │ │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐ │ │
│  │  │  Lifecycle  │  │   Message    │  │  Tab & Content   │ │ │
│  │  │  Manager    │  │   Router     │  │  Script Manager  │ │ │
│  │  └─────────────┘  └──────────────┘  └──────────────────┘ │ │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐ │ │
│  │  │Notification │  │   Storage    │  │  State Manager   │ │ │
│  │  │  Handler     │  │   Manager    │  │                  │ │ │
│  │  │ (1min timer) │  │              │  │                  │ │ │
│  │  └─────────────┘  └──────────────┘  └──────────────────┘ │ │
│  │           ↕ chrome.offscreen.createDocument()              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              ↕                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │         OFFSCREEN DOCUMENT (Audio Processor)               │ │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐ │ │
│  │  │   Micro-    │→ │    Audio     │→ │    Threshold     │ │ │
│  │  │   phone     │  │   Context    │  │    Detector      │ │ │
│  │  │   Access    │  │  + Analyser  │  │                  │ │ │
│  │  └─────────────┘  └──────────────┘  └──────────────────┘ │ │
│  │         ↓                ↓                     ↓            │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │     Audio Processing Loop (requestAnimationFrame)    │  │ │
│  │  │  • Get time domain data                              │  │ │
│  │  │  • Calculate RMS                                     │  │ │
│  │  │  • Normalize volume (0.0 - 1.0)                      │  │ │
│  │  │  • Track continuous loudness duration                │  │ │
│  │  │  • Trigger notification after 1 minute              │  │ │
│  │  │  • Send volume updates to background                 │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              CHROME STORAGE (Persistent Data)              │ │
│  │  { threshold, warningCount, isMonitoring }                 │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities Matrix

| Component | Responsibility | Lifecycle | Access |
|-----------|---------------|-----------|---------|
| **Popup** | User interface, volume graph (Recharts), settings display | Ephemeral (closes) | User interaction |
| **Background Service Worker** | Orchestration, message routing, notifications | Persistent | Always running |
| **Offscreen Document** | Audio processing, microphone access, loudness timer | Persistent | Hidden page |

---

## Component Specifications

### 1. Popup Component (`src/popup/Popup.tsx`)

#### Purpose
Provides the user interface for controlling and monitoring voice levels.

#### Technology
- React 18.2.0
- TypeScript 5.3.3
- Recharts 3.7.0 (charting library)
- CSS Modules

#### State Management
```typescript
interface PopupState {
  currentVolume: number;      // 0.0 - 1.0
  isMonitoring: boolean;      // Monitoring active status
  threshold: number;          // 0.3 - 1.0
  warningCount: number;       // Total warnings triggered
  volumeHistory: VolumeDataPoint[];  // Array of {volume, timestamp}
}

interface VolumeDataPoint {
  volume: number;      // 0.0 - 1.0
  timestamp: number;   // Date.now()
}
```

#### Key Functions

**`startMonitoring()`**
```typescript
async function startMonitoring(): Promise<void>
```
- Sends `START_MONITORING` message to background
- Updates UI state on success
- Shows error alert on failure
- Handles microphone permission denial

**`stopMonitoring()`**
```typescript
async function stopMonitoring(): Promise<void>
```
- Sends `STOP_MONITORING` message to background
- Resets volume display to 0
- Updates UI state

**`handleThresholdChange()`**
```typescript
function handleThresholdChange(e: ChangeEvent<HTMLInputElement>): void
```
- Sends `SET_THRESHOLD` message with new value
- Updates local state immediately
- Persists to chrome.storage via background

#### Message Listeners
- `VOLUME_BROADCAST` - Updates real-time volume display
- `chrome.storage.onChanged` - Updates warning count

#### Lifecycle Hooks

**On Mount:**
1. Load saved settings from `chrome.storage.local`
2. Query background for current monitoring status
3. Register message listeners
4. Subscribe to storage changes

**On Unmount:**
1. Cleanup message listeners
2. Does NOT stop monitoring (continues in background)

#### UI Components

**Volume Graph (Recharts)**
```tsx
<ResponsiveContainer width="100%" height={200}>
  <AreaChart data={chartData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="timeLabel" />
    <YAxis domain={[0, 100]} label={{ value: 'Volume %', angle: -90 }} />
    <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Volume']} />
    <ReferenceLine 
      y={threshold * 100} 
      stroke="#FF5722" 
      strokeDasharray="5 5"
      label={`Threshold: ${(threshold * 100).toFixed(0)}%`}
    />
    <Area
      type="monotone"
      dataKey="volume"
      stroke="#2196F3"
      fill="url(#volumeGradient)"
      activeDot={{ r: 6, fill: volumeColor }}
    />
  </AreaChart>
</ResponsiveContainer>
```
- Shows 10-minute history of volume data
- Blue gradient fill under volume line
- Red dashed reference line for threshold
- Interactive tooltips on hover
- Color-coded active dot (green/yellow/red based on threshold)
- Responsive container adapts to popup size

**Threshold Slider**
```tsx
<input
  type="range"
  min="0.3"
  max="1.0"
  step="0.01"
  value={threshold}
  onChange={handleThresholdChange}
/>
```

**Monitor Button**
```tsx
<button
  className={`monitor-button ${isMonitoring ? 'stop' : 'start'}`}
  onClick={isMonitoring ? stopMonitoring : startMonitoring}
>
  {isMonitoring ? '⏹ Stop Monitoring' : '▶️ Start Monitoring'}
</button>
```

---

### 2. Background Service Worker (`src/background/service-worker.ts`)

#### Purpose
Central orchestrator for all extension operations. Manages component lifecycle, routes messages, and coordinates between popup, offscreen document, and content scripts.

#### Global State
```typescript
let currentVolume: number = 0;
let isMonitoring: boolean = false;
```

#### Key Functions

**`setupOffscreenDocument()`**
```typescript
async function setupOffscreenDocument(): Promise<void>
```
- Checks if Offscreen API is available (Chrome 109+)
- Closes existing offscreen document if present
- Creates new offscreen document with USER_MEDIA reason
- Error handling for unsupported Chrome versions

**`handleStartMonitoring()`**
```typescript
async function handleStartMonitoring(): Promise<{ success: boolean; error?: string }>
```
1. Call `setupOffscreenDocument()`
2. Wait 100ms for initialization
3. Send `START_MONITORING` to offscreen
4. Update global state: `isMonitoring = true`
5. Persist state to `chrome.storage.local`
6. Return success/error response

**`handleStopMonitoring()`**
```typescript
async function handleStopMonitoring(): Promise<{ success: boolean }>
```
1. Send `STOP_MONITORING` to offscreen
2. Update global state: `isMonitoring = false`, `currentVolume = 0`
3. Persist state to storage
4. Return success response

**`handleSetThreshold()`**
```typescript
async function handleSetThreshold(threshold: number): Promise<{ success: boolean }>
```
1. Validate threshold range (0.3 - 1.0)
2. Save to `chrome.storage.local`
3. If monitoring active, forward to offscreen document
4. Return success response

**`showWarningNotification()`**
```typescript
function showWarningNotification(): void
```
1. Create Chrome notification with message: "You have been speaking too loud for 1 minute. Please lower your voice."
2. Set `requireInteraction: true` so notification stays until dismissed
3. Increment warning count in storage
4. Cooldown period (60 seconds) is handled in offscreen document

**`broadcastVolumeUpdate(volume: number)`**
```typescript
function broadcastVolumeUpdate(volume: number): void
```
- Sends `VOLUME_BROADCAST` message to popup (if open)
- Fails silently if popup is closed

#### Message Handlers

```typescript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch(request.type) {
    case 'START_MONITORING':
      handleStartMonitoring().then(sendResponse);
      return true;
    
    case 'STOP_MONITORING':
      handleStopMonitoring().then(sendResponse);
      return true;
    
    case 'GET_STATUS':
      sendResponse({ isMonitoring, currentVolume });
      return true;
    
    case 'SET_THRESHOLD':
      handleSetThreshold(request.threshold).then(sendResponse);
      return true;
    
    case 'VOLUME_UPDATE':
      currentVolume = request.volume;
      broadcastVolumeUpdate(request.volume);
      sendResponse({ success: true });
      break;
    
    case 'WARNING_TRIGGERED':
      showWarningNotification();
      sendResponse({ success: true });
      break;
  }
  return true;
});
```

#### Startup Behavior

```typescript
chrome.storage.local.get(['isMonitoring', 'threshold'], async (result) => {
  if (result.isMonitoring) {
    if (result.threshold) {
      await handleSetThreshold(result.threshold);
    }
    await handleStartMonitoring();
  }
});
```
- Restores previous monitoring state on extension restart
- Ensures seamless user experience

#### Installation Handler

```typescript
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    threshold: 0.7,
    warningCount: 0,
    isMonitoring: false,
  });
});
```
- Sets default values on first install

---

### 3. Offscreen Document (`src/offscreen/offscreen.ts`)

#### Purpose
Hidden persistent page that handles microphone access and audio processing. Required because service workers cannot use `getUserMedia()`.

#### Class Structure

```typescript
class OffscreenAudioMonitor {
  // Audio API objects
  private audioContext: AudioContext | null = null;
  private analyserNode: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private stream: MediaStream | null = null;
  
  // Processing state
  private isMonitoring: boolean = false;
  private animationFrame: number | null = null;
  
  // Detection logic
  private thresholdDetector: ThresholdDetector;
  private overThresholdStartTime: number | null = null;
  private loudDurationThreshold: number = 60000; // 1 minute in milliseconds
  private hasNotifiedForCurrentPeriod: boolean = false;
  
  constructor() {
    this.thresholdDetector = new ThresholdDetector(DEFAULT_VOLUME_THRESHOLD);
  }
}
```

#### Key Methods

**`startMonitoring()`**
```typescript
async startMonitoring(): Promise<void>
```
**Flow:**
1. Request microphone access via `navigator.mediaDevices.getUserMedia({ audio: true })`
2. Create `AudioContext`
3. Create `AnalyserNode` with `fftSize = 2048`
4. Connect microphone stream to analyser
5. Set `isMonitoring = true`
6. Start `processAudio()` loop

**Error Cases:**
- Permission denied → Throws error with message
- No microphone available → Browser handles
- AudioContext creation fails → Throws error

**`stopMonitoring()`**
```typescript
stopMonitoring(): void
```
**Flow:**
1. Set `isMonitoring = false` (stops loop)
2. Cancel any pending animation frame
3. Disconnect microphone from analyser
4. Stop all tracks on MediaStream
5. Close AudioContext
6. Reset tracking variables: `overThresholdStartTime = null`, `hasNotifiedForCurrentPeriod = false`

**`processAudio()`**
```typescript
private processAudio(): void
```
**The Core Audio Processing Loop:**

```typescript
const bufferLength = this.analyserNode.frequencyBinCount; // 1024 samples
const dataArray = new Float32Array(bufferLength);

const analyze = () => {
  if (!this.isMonitoring || !this.analyserNode) return;
  
  // Step 1: Get raw audio data
  this.analyserNode.getFloatTimeDomainData(dataArray);
  
  // Step 2: Calculate RMS (Root Mean Square)
  const rms = calculateRMS(dataArray);
  
  // Step 3: Normalize to 0.0 - 1.0 range
  const normalizedVolume = normalizeVolume(rms);
  
  // Step 4: Send volume update to background
  this.sendVolumeUpdate(normalizedVolume);
  
  // Step 5: Check threshold and track continuous loudness
  const isOverThreshold = this.thresholdDetector.exceedsThreshold(normalizedVolume);
  const now = Date.now();
  
  if (isOverThreshold) {
    // User is currently too loud
    if (this.overThresholdStartTime === null) {
      // Just started being too loud, record the start time
      this.overThresholdStartTime = now;
      this.hasNotifiedForCurrentPeriod = false;
    } else {
      // Check if user has been loud for 1 minute
      const loudDuration = now - this.overThresholdStartTime;
      
      if (loudDuration >= this.loudDurationThreshold && !this.hasNotifiedForCurrentPeriod) {
        // User has been loud for 1 minute continuously
        this.showNotification();
        this.hasNotifiedForCurrentPeriod = true;
      }
    }
  } else {
    // Volume is below threshold
    if (this.overThresholdStartTime !== null) {
      // User stopped being loud, reset timer
      this.overThresholdStartTime = null;
      this.hasNotifiedForCurrentPeriod = false;
    }
  }
  
  // Step 6: Continue loop
  this.animationFrame = requestAnimationFrame(analyze);
};

analyze(); // Start the loop
```

**Loop Frequency:** ~60 FPS (requestAnimationFrame rate)

**Continuous Loudness Tracking:**
- Tracks when user first exceeds threshold (`overThresholdStartTime`)
- Monitors duration of continuous loudness
- Triggers notification only after 1 minute (60000ms) of continuous loudness
- Resets timer immediately if volume drops below threshold
- Prevents duplicate notifications with `hasNotifiedForCurrentPeriod` flag

**`setThreshold()`**
```typescript
setThreshold(threshold: number): void
```
- Updates threshold detector with new value
- Takes effect immediately in next processing loop iteration

#### Message Handlers

```typescript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch(request.type) {
    case 'START_MONITORING':
      monitor.startMonitoring()
        .then(() => sendResponse({ success: true, status: 'monitoring' }))
        .catch((error) => sendResponse({ success: false, error: error.message }));
      return true;
    
    case 'STOP_MONITORING':
      monitor.stopMonitoring();
      sendResponse({ success: true, status: 'stopped' });
      break;
    
    case 'SET_THRESHOLD':
      monitor.setThreshold(request.threshold);
      sendResponse({ success: true });
      break;
    
    case 'GET_STATUS':
      sendResponse({ success: true, isMonitoring: monitor.getStatus() });
      break;
  }
  return true;
});
```

#### Outgoing Messages

**Volume Updates** (continuous):
```typescript
chrome.runtime.sendMessage({
  type: 'VOLUME_UPDATE',
  volume: normalizedVolume // 0.0 - 1.0
});
```

**Warning Triggered** (on threshold exceed with cooldown):
```typescript
chrome.runtime.sendMessage({
  type: 'WARNING_TRIGGERED'
});
```

**Tab Color Changes** (on threshold cross):
```typescript
chrome.runtime.sendMessage({
  type: 'SHOW_TAB_RED' // or 'HIDE_TAB_RED'
});
```

---

### 4. Content Script (`src/content/content-script.ts`) - DEPRECATED

**Note:** This component is no longer actively used. The red overlay functionality has been replaced with browser notifications. The content script is kept minimal for potential future features.

#### Purpose (Historical)
Previously injected into web pages to provide visual feedback (red overlay) when user was speaking too loud. This functionality has been removed in favor of browser notifications that trigger after 1 minute of continuous loud speaking.

#### Global State
```typescript
let overlayElement: HTMLDivElement | null = null;
let timeoutId: NodeJS.Timeout | null = null;
```

#### Key Functions

**`createOverlay()`**
```typescript
function createOverlay(): HTMLDivElement
```
**Creates overlay element if doesn't exist:**
```typescript
overlayElement = document.createElement('div');
overlayElement.id = 'your-are-loud-overlay';
overlayElement.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(244, 67, 54, 0.3); /* Red, 30% opacity */
  z-index: 999999;
  pointer-events: none; /* Doesn't block clicks */
  transition: opacity 0.3s ease;
  opacity: 0;
`;
document.body.appendChild(overlayElement);
```

**Key CSS Properties:**
- `position: fixed` - Always covers viewport
- `z-index: 999999` - Above almost everything
- `pointer-events: none` - Doesn't interfere with page interaction
- `transition: opacity` - Smooth fade in/out

**`showRedOverlay()`**
```typescript
function showRedOverlay(): void
```
1. Get/create overlay element
2. Set opacity to 1 (visible)
3. Clear any existing timeout
4. Set new timeout to auto-hide after 3 seconds

**`hideOverlay()`**
```typescript
function hideOverlay(): void
```
- Set overlay opacity to 0 (invisible)
- Element remains in DOM for reuse

#### Message Handler

```typescript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SHOW_RED_OVERLAY') {
    showRedOverlay();
    sendResponse({ success: true });
  } else if (request.type === 'HIDE_OVERLAY') {
    hideOverlay();
    sendResponse({ success: true });
  }
  return true;
});
```

#### Injection Strategy

Content script is injected dynamically by background service worker:

```typescript
// In background service worker
await chrome.scripting.executeScript({
  target: { tabId: tab.id },
  files: ['content.js']
});
```

**Injection Timing:**
- On first `SHOW_TAB_RED` message for a tab
- Uses try-catch to handle already-injected case
- Injected per-tab (not global)

**Injection Requirements:**
- Tab must have URL (not chrome:// pages)
- Host permissions must match (http://* or https://*)
- Tab must be fully loaded

---

## Message Protocol

### Message Types Reference

| Message Type | Direction | Payload | Response | Purpose |
|-------------|-----------|---------|----------|---------|
| `START_MONITORING` | Popup → Background → Offscreen | None | `{ success, isMonitoring?, error? }` | Start audio monitoring |
| `STOP_MONITORING` | Popup → Background → Offscreen | None | `{ success, isMonitoring }` | Stop audio monitoring |
| `GET_STATUS` | Popup → Background | None | `{ isMonitoring, currentVolume }` | Query current state |
| `SET_THRESHOLD` | Popup → Background → Offscreen | `{ threshold: number }` | `{ success }` | Update threshold value |
| `VOLUME_UPDATE` | Offscreen → Background | `{ volume: number }` | `{ success }` | Report current volume |
| `VOLUME_BROADCAST` | Background → Popup | `{ volume: number }` | None | Forward volume to UI |
| `WARNING_TRIGGERED` | Offscreen → Background | None | `{ success }` | Threshold exceeded |

### Message Flow Diagrams

#### Starting Monitoring

```
User clicks "Start Monitoring"
  ↓
Popup sends START_MONITORING
  ↓
Background receives message
  ↓
Background calls setupOffscreenDocument()
  ↓
Background sends START_MONITORING to Offscreen
  ↓
Offscreen requests microphone permission
  ↓
User grants permission
  ↓
Offscreen starts audio processing
  ↓
Offscreen responds { success: true }
  ↓
Background updates state & storage
  ↓
Background responds to Popup
  ↓
Popup updates UI
```

#### Continuous Loudness Detection (1 Minute)

```
Offscreen detects volume > threshold
  ↓
Offscreen records overThresholdStartTime
  ↓
[Loop continues - volume stays above threshold]
  ↓
After 60 seconds of continuous loudness
  ↓
Offscreen sends WARNING_TRIGGERED
  ↓
Background receives message
  ↓
Background shows notification
  ↓
Notification: "You have been speaking too loud for 1 minute..."
  ↓
[If volume drops below threshold]
  ↓
Offscreen resets overThresholdStartTime
  ↓
Timer resets for next cycle
  ↓
Background increments warning count
  ↓
Storage change triggers Popup update (if open)
```

#### Volume Update (Continuous)

```
Every animation frame (~60 FPS):
  ↓
Offscreen calculates volume
  ↓
Offscreen sends VOLUME_UPDATE
  ↓
Background updates currentVolume
  ↓
Background broadcasts to Popup (if open)
  ↓
Popup updates volume meter
```

---

## Data Structures

### Chrome Storage Schema

```typescript
interface StorageSchema {
  // User configurable threshold (0.3 - 1.0)
  threshold: number;
  
  // Total warnings triggered this session
  warningCount: number;
  
  // Current monitoring state
  isMonitoring: boolean;
}
```

**Default Values:**
```typescript
{
  threshold: 0.7,
  warningCount: 0,
  isMonitoring: false
}
```

**Storage API:**
```typescript
// Read
chrome.storage.local.get(['threshold', 'warningCount'], (result) => {
  console.log(result.threshold); // 0.7
});

// Write
chrome.storage.local.set({ threshold: 0.8 });

// Listen for changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.warningCount) {
    console.log('New count:', changes.warningCount.newValue);
  }
});
```

### Runtime State (Background Service Worker)

```typescript
interface RuntimeState {
  currentVolume: number;  // Latest volume reading (0.0 - 1.0)
  isMonitoring: boolean;  // Monitoring active status
}
```

**Not persisted to storage** - Volatile state for runtime communication.

### Message Payloads

```typescript
// START_MONITORING
type StartMonitoringMessage = {
  type: 'START_MONITORING';
};

type StartMonitoringResponse = {
  success: boolean;
  isMonitoring?: boolean;
  error?: string;
};

// STOP_MONITORING
type StopMonitoringMessage = {
  type: 'STOP_MONITORING';
};

type StopMonitoringResponse = {
  success: boolean;
  isMonitoring: boolean;
};

// GET_STATUS
type GetStatusMessage = {
  type: 'GET_STATUS';
};

type GetStatusResponse = {
  isMonitoring: boolean;
  currentVolume: number;
};

// SET_THRESHOLD
type SetThresholdMessage = {
  type: 'SET_THRESHOLD';
  threshold: number;
};

type SetThresholdResponse = {
  success: boolean;
};

// VOLUME_UPDATE
type VolumeUpdateMessage = {
  type: 'VOLUME_UPDATE';
  volume: number;
};

// VOLUME_BROADCAST
type VolumeBroadcastMessage = {
  type: 'VOLUME_BROADCAST';
  volume: number;
};

// WARNING_TRIGGERED
type WarningTriggeredMessage = {
  type: 'WARNING_TRIGGERED';
};

// SHOW_TAB_RED / HIDE_TAB_RED
type TabColorMessage = {
  type: 'SHOW_TAB_RED' | 'HIDE_TAB_RED';
};

// SHOW_RED_OVERLAY / HIDE_OVERLAY
type OverlayMessage = {
  type: 'SHOW_RED_OVERLAY' | 'HIDE_OVERLAY';
};
```

---

## API Documentation

### Popup API

#### `startMonitoring()`
Initiates audio monitoring.

**Signature:**
```typescript
async function startMonitoring(): Promise<void>
```

**Behavior:**
1. Sends message to background service worker
2. Updates UI state on success
3. Shows error alert on failure

**Error Handling:**
- Microphone permission denied
- Chrome version too old (< 109)
- Offscreen document creation failed

#### `stopMonitoring()`
Stops audio monitoring.

**Signature:**
```typescript
async function stopMonitoring(): Promise<void>
```

**Behavior:**
1. Sends message to background service worker
2. Resets UI to stopped state
3. Clears volume display

#### `handleThresholdChange()`
Updates threshold value.

**Signature:**
```typescript
function handleThresholdChange(e: React.ChangeEvent<HTMLInputElement>): void
```

**Parameters:**
- `e` - Input change event with new threshold value

**Behavior:**
1. Parses float from input
2. Updates local state
3. Sends message to background
4. Background persists to storage and forwards to offscreen

---

### Background Service Worker API

#### `setupOffscreenDocument()`
Creates or validates offscreen document.

**Signature:**
```typescript
async function setupOffscreenDocument(): Promise<void>
```

**Throws:**
- Error if Offscreen API not available
- Error if document creation fails

**Behavior:**
1. Checks for `chrome.offscreen` API
2. Closes existing document if present
3. Creates new document with `USER_MEDIA` reason

#### `handleStartMonitoring()`
Orchestrates starting audio monitoring.

**Signature:**
```typescript
async function handleStartMonitoring(): Promise<{
  success: boolean;
  isMonitoring?: boolean;
  error?: string;
}>
```

**Returns:**
- Success response with monitoring state
- Error response with message

**Flow:**
1. Setup offscreen document
2. Wait for initialization
3. Send start command
4. Update state
5. Persist to storage

#### `handleStopMonitoring()`
Orchestrates stopping audio monitoring.

**Signature:**
```typescript
async function handleStopMonitoring(): Promise<{
  success: boolean;
  isMonitoring: boolean;
}>
```

**Returns:**
- Success response with stopped state

**Flow:**
1. Send stop command to offscreen
2. Update state
3. Persist to storage

#### `changeTabColor(showRed: boolean)`
Shows or hides red overlay on active tab.

**Signature:**
```typescript
async function changeTabColor(showRed: boolean): Promise<void>
```

**Parameters:**
- `showRed` - True to show, false to hide

**Behavior:**
1. Query active tab
2. Inject content script if needed
3. Send overlay message to tab

**Error Handling:**
- Fails silently if tab injection not allowed
- Logs errors for debugging

---

### Offscreen Document API

#### `OffscreenAudioMonitor.startMonitoring()`
Starts microphone capture and processing.

**Signature:**
```typescript
async startMonitoring(): Promise<void>
```

**Throws:**
- Error if microphone permission denied
- Error if AudioContext creation fails

**Side Effects:**
- Requests microphone permission
- Creates AudioContext and AnalyserNode
- Starts processing loop

#### `OffscreenAudioMonitor.stopMonitoring()`
Stops monitoring and cleans up resources.

**Signature:**
```typescript
stopMonitoring(): void
```

**Side Effects:**
- Cancels animation frame
- Disconnects audio nodes
- Stops MediaStream tracks
- Closes AudioContext
- Sends HIDE_TAB_RED message

#### `OffscreenAudioMonitor.setThreshold(threshold: number)`
Updates detection threshold.

**Signature:**
```typescript
setThreshold(threshold: number): void
```

**Parameters:**
- `threshold` - New threshold value (0.0 - 1.0)

**Behavior:**
- Updates ThresholdDetector instance
- Takes effect in next processing loop

#### `OffscreenAudioMonitor.getStatus()`
Returns current monitoring status.

**Signature:**
```typescript
getStatus(): boolean
```

**Returns:**
- `true` if monitoring active
- `false` if stopped

---

## Audio Processing Pipeline

### Overview

```
Microphone → MediaStream → AudioContext → AnalyserNode → Float32Array
                                                              ↓
                                                      Calculate RMS
                                                              ↓
                                                      Normalize (0-1)
                                                              ↓
                                                   Compare with Threshold
                                                              ↓
                                              ┌───────────────┴───────────────┐
                                              ↓                               ↓
                                        Above Threshold                Below Threshold
                                              ↓                               ↓
                                    Show Red + Notification          Hide Red (if was above)
```

### Step-by-Step Processing

#### 1. Microphone Capture

```typescript
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
```

**Configuration:**
- Default microphone device
- Audio only (no video)
- Browser handles device selection

**Permissions:**
- Requires user consent
- Persists per-origin (offscreen document URL)

#### 2. Audio Context Setup

```typescript
this.audioContext = new AudioContext();
this.analyserNode = this.audioContext.createAnalyser();
this.analyserNode.fftSize = 2048;
```

**AnalyserNode Configuration:**
- `fftSize: 2048` → 1024 frequency bins
- Sample rate: Default (usually 48kHz or 44.1kHz)
- Smoothing: Default (0.8)

#### 3. Node Connection

```typescript
this.microphone = this.audioContext.createMediaStreamSource(stream);
this.microphone.connect(this.analyserNode);
```

**Signal Flow:**
```
MediaStream → MediaStreamAudioSourceNode → AnalyserNode
```

**Note:** Not connected to destination (no audio playback)

#### 4. Time Domain Data Extraction

```typescript
const bufferLength = this.analyserNode.frequencyBinCount; // 1024
const dataArray = new Float32Array(bufferLength);
this.analyserNode.getFloatTimeDomainData(dataArray);
```

**Data Format:**
- Float32Array of audio samples
- Values range: -1.0 to +1.0
- Represents waveform amplitude

#### 5. RMS Calculation

Uses `@your-are-loud/audio-processing` package:

```typescript
import { calculateRMS } from '@your-are-loud/audio-processing';

const rms = calculateRMS(dataArray);
```

**Algorithm:**
```typescript
function calculateRMS(buffer: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) {
    sum += buffer[i] * buffer[i];
  }
  return Math.sqrt(sum / buffer.length);
}
```

**Output:** RMS value (typically 0.0 - 0.5 for normal speech)

#### 6. Normalization

Uses `@your-are-loud/audio-processing` package:

```typescript
import { normalizeVolume } from '@your-are-loud/audio-processing';

const normalizedVolume = normalizeVolume(rms);
```

**Algorithm:**
```typescript
function normalizeVolume(rms: number): number {
  // Apply logarithmic scaling for perceptual loudness
  const dbValue = 20 * Math.log10(rms + 0.0001); // Avoid log(0)
  
  // Map dB range (-60 to 0) to (0 to 1)
  const normalized = (dbValue + 60) / 60;
  
  // Clamp to valid range
  return Math.max(0, Math.min(1, normalized));
}
```

**Output:** Normalized volume 0.0 - 1.0

#### 7. Threshold Detection

Uses `@your-are-loud/core` package:

```typescript
import { ThresholdDetector } from '@your-are-loud/core';

const isOverThreshold = this.thresholdDetector.exceedsThreshold(normalizedVolume);
```

**ThresholdDetector Logic:**
```typescript
class ThresholdDetector {
  private threshold: number;
  
  constructor(threshold: number = 0.7) {
    this.threshold = threshold;
  }
  
  exceedsThreshold(volume: number): boolean {
    return volume > this.threshold;
  }
  
  setThreshold(threshold: number): void {
    this.threshold = threshold;
  }
}
```

#### 8. Action Triggering

**On Threshold Exceeded:**
```typescript
if (isOverThreshold) {
  if (!this.wasOverThreshold) {
    // Edge detection: just crossed threshold
    this.sendTabColorChange(true); // Show red immediately
  }
  this.checkAndShowWarning(); // With cooldown
  this.wasOverThreshold = true;
}
```

**On Threshold Drop:**
```typescript
else if (this.wasOverThreshold) {
  // Edge detection: just dropped below
  this.sendTabColorChange(false); // Hide red
  this.wasOverThreshold = false;
}
```

**Edge Detection Benefits:**
- Only send messages on state change
- Reduces message overhead
- Cleaner visual transitions

### Performance Characteristics

**Processing Frequency:**
- ~60 Hz (requestAnimationFrame rate)
- ~16.7ms per iteration

**CPU Usage:**
- Minimal (<1% on modern systems)
- Web Audio API uses efficient native code

**Memory Usage:**
- ~1KB for audio buffers
- Constant memory footprint

**Latency:**
- End-to-end: ~50-100ms
- Microphone → Display feedback

---

## Storage Schema

### chrome.storage.local

**Key-Value Store:**

| Key | Type | Default | Description | Writable By |
|-----|------|---------|-------------|-------------|
| `threshold` | number | 0.7 | Volume threshold (0.3-1.0) | Popup, Background |
| `warningCount` | number | 0 | Total warnings triggered | Background |
| `isMonitoring` | boolean | false | Monitoring active state | Background |

### Storage Operations

**Read:**
```typescript
chrome.storage.local.get(['threshold', 'warningCount'], (result) => {
  console.log('Threshold:', result.threshold);
  console.log('Warnings:', result.warningCount);
});
```

**Write:**
```typescript
chrome.storage.local.set({
  threshold: 0.8,
  warningCount: 5
});
```

**Listen for Changes:**
```typescript
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.warningCount) {
    console.log('Old:', changes.warningCount.oldValue);
    console.log('New:', changes.warningCount.newValue);
  }
});
```

### Data Persistence

**Lifetime:**
- Persists across browser restarts
- Persists across extension reloads
- Cleared on extension uninstall

**Quota:**
- 10MB total limit (plenty for our use case)
- Current usage: <1KB

**Sync Behavior:**
- Using `chrome.storage.local` (not synced)
- Could migrate to `chrome.storage.sync` for cross-device settings

---

## Security & Privacy

### Microphone Access

**Permission Model:**
- Requires user consent via browser prompt
- Permission persists per-origin
- Can be revoked in Chrome settings

**Data Handling:**
- Audio data processed locally only
- No network transmission
- No storage of audio data
- Real-time processing only

**Privacy Guarantees:**
```
✅ No audio recording
✅ No audio storage
✅ No network requests
✅ No analytics tracking
✅ No user identification
✅ No data collection
```

### Content Security Policy

**Manifest V3 Default:**
```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```

**Restrictions:**
- No inline scripts
- No eval() or Function()
- No external script loading
- Webpack bundles everything

### Permissions Justification

| Permission | Reason | Scope |
|------------|--------|-------|
| `storage` | Save user settings | Local only |
| `notifications` | Warning alerts | Browser notifications |
| `activeTab` | Get current tab info | Current tab only |
| `scripting` | Inject content script | Active tab only |
| `tabs` | Query active tab | Minimal info |
| `offscreen` | Persistent audio processing | Hidden document |
| Host: `http://*/*`, `https://*/*` | Inject overlay on any page | All websites |

### Content Script Isolation

**Injected Content Script:**
- Runs in isolated world
- Cannot access page JavaScript
- Cannot be accessed by page JavaScript
- Only modifies DOM (overlay element)

**No Data Leakage:**
- Page cannot detect extension presence
- Page cannot access extension APIs
- One-way communication via messages

---

## Development Guide

### Prerequisites

- **Node.js:** 18+ (LTS recommended)
- **pnpm:** 8+ (workspace manager)
- **Chrome:** 109+ (for Offscreen API)
- **TypeScript:** 5.3+

### Setup

```bash
# From repo root
cd apps/chrome-extension

# Install dependencies (via pnpm workspace)
pnpm install

# Build for production
pnpm run build

# Build for development (watch mode)
pnpm run dev

# Clean build artifacts
pnpm run clean
```

### Project Structure

```
apps/chrome-extension/
├── src/
│   ├── background/
│   │   └── service-worker.ts      # Background orchestrator
│   ├── content/
│   │   └── content-script.ts      # Injected overlay script
│   ├── offscreen/
│   │   ├── offscreen.html         # Offscreen document HTML
│   │   └── offscreen.ts           # Audio processing logic
│   ├── popup/
│   │   ├── index.tsx              # React entry point
│   │   ├── Popup.tsx              # Main popup component
│   │   ├── Popup.css              # Popup styles
│   │   └── popup.html             # Popup HTML template
│   └── services/
│       └── AudioMonitor.ts        # (Legacy, now in offscreen)
├── public/
│   └── icons/
│       ├── icon-16.png
│       ├── icon-48.png
│       └── icon-128.png
├── dist/                          # Build output (gitignored)
├── manifest.json                  # Extension manifest
├── package.json
├── tsconfig.json
├── webpack.config.js              # Build configuration
└── README.md
```

### Build Configuration (webpack.config.js)

```javascript
module.exports = {
  entry: {
    background: './src/background/service-worker.ts',
    popup: './src/popup/index.tsx',
    content: './src/content/content-script.ts',
    offscreen: './src/offscreen/offscreen.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/popup/popup.html',
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new HtmlWebpackPlugin({
      template: './src/offscreen/offscreen.html',
      filename: 'offscreen.html',
      chunks: ['offscreen'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'manifest.json', to: 'manifest.json' },
        { from: 'public/icons', to: 'icons', noErrorOnMissing: true },
      ],
    }),
  ],
};
```

### Loading Extension in Chrome

**Step 1:** Navigate to `chrome://extensions/`

**Step 2:** Enable "Developer mode" (toggle in top-right)

**Step 3:** Click "Load unpacked"

**Step 4:** Select `apps/chrome-extension/dist` folder

**Step 5:** Extension appears in toolbar

**Reloading After Changes:**
- Build code: `pnpm run build`
- Click reload icon on `chrome://extensions/`

### Development Workflow

**Terminal 1 - Watch Mode:**
```bash
cd apps/chrome-extension
pnpm run dev  # Watches for changes and rebuilds
```

**Terminal 2 - Test in Browser:**
1. Make code changes
2. Wait for rebuild (automatic)
3. Reload extension on `chrome://extensions/`
4. Test functionality

### Debugging

**Service Worker Console:**
1. Go to `chrome://extensions/`
2. Find extension
3. Click "service worker" link
4. Opens DevTools console

**Popup Console:**
1. Open extension popup
2. Right-click anywhere in popup
3. Select "Inspect"
4. Opens DevTools console

**Offscreen Document Console:**
1. Go to `chrome://extensions/`
2. Find extension
3. Click "Inspect views: offscreen document"
4. Opens DevTools console

**Content Script Console:**
1. Open page where content script injected
2. Open DevTools (F12)
3. Filter console by "content-script.ts"

### Common Issues

**Issue:** Offscreen API not available

**Solution:** Upgrade Chrome to 109+

---

**Issue:** Microphone permission denied

**Solution:**
1. Chrome Settings → Privacy → Microphone
2. Ensure extension has permission

---

**Issue:** Extension not loading

**Solution:**
1. Check for errors on `chrome://extensions/`
2. Verify manifest.json is valid
3. Run `pnpm run build` again

---

**Issue:** Content script not injecting

**Solution:**
1. Check host_permissions in manifest
2. Verify tab URL is http:// or https://
3. Check service worker console for errors

---

## Testing Strategy

### Manual Testing Checklist

**Basic Functionality:**
- [ ] Install extension successfully
- [ ] Open popup displays correctly
- [ ] Click "Start Monitoring" requests microphone permission
- [ ] Grant permission shows volume meter moving
- [ ] Volume meter responds to voice
- [ ] Speak loudly triggers red overlay
- [ ] Browser notification appears when threshold exceeded
- [ ] Warning count increments
- [ ] Adjust threshold slider updates detection
- [ ] Click "Stop Monitoring" stops processing
- [ ] Microphone indicator disappears

**Background Monitoring:**
- [ ] Start monitoring and close popup
- [ ] Speak loudly - red overlay still appears
- [ ] Reopen popup - shows monitoring active
- [ ] Volume meter updates in reopened popup
- [ ] Stop monitoring from popup stops processing

**State Persistence:**
- [ ] Set custom threshold
- [ ] Close and reopen popup - threshold remembered
- [ ] Reload extension - warning count persists
- [ ] Start monitoring and reload extension - restores monitoring

**Edge Cases:**
- [ ] Multiple rapid threshold crossings
- [ ] Notification cooldown prevents spam (3 second minimum)
- [ ] Works on different websites (Google Meet, Zoom, etc.)
- [ ] Works on chrome-extension:// pages (should not inject content)
- [ ] Switch tabs while monitoring - overlay follows active tab
- [ ] Open multiple windows - monitors all

### Browser Compatibility

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | 109+ | ✅ Supported | Requires Offscreen API |
| Chrome | <109 | ❌ Not supported | Missing Offscreen API |
| Edge (Chromium) | 109+ | ✅ Supported | Same as Chrome |
| Firefox | Any | ❌ Not supported | Manifest V3 differences |
| Safari | Any | ❌ Not supported | Different extension model |

### Performance Testing

**Metrics to Monitor:**
- CPU usage during monitoring (<5% expected)
- Memory usage (constant, no leaks)
- Message latency (<50ms expected)
- UI responsiveness (no frame drops)

**Tools:**
- Chrome Task Manager (`Shift+Esc`)
- DevTools Performance profiler
- Console timing measurements

---

## Deployment

### Pre-Publishing Checklist

- [ ] Update version in `manifest.json`
- [ ] Update version in `package.json`
- [ ] Test on clean Chrome profile
- [ ] Verify all features work
- [ ] Check for console errors
- [ ] Review permissions are minimal
- [ ] Create/update screenshots for store
- [ ] Write clear changelog

### Build for Production

```bash
cd apps/chrome-extension
pnpm run build
```

**Output:** `dist/` folder with optimized code

### Create Distribution Package

```bash
cd dist
zip -r your-are-loud-extension-v1.0.0.zip *
```

**Package Contents:**
- `manifest.json`
- `background.js`
- `popup.js`, `popup.html`
- `offscreen.js`, `offscreen.html`
- `content.js`
- `icons/` folder

### Chrome Web Store Publishing

**Step 1:** Developer Account
- Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
- Pay one-time $5 registration fee

**Step 2:** Upload Package
- Click "New Item"
- Upload ZIP file
- Fill required fields:
  - Name: "Your Are Loud"
  - Description: Voice monitoring for video calls
  - Category: Productivity
  - Language: English

**Step 3:** Store Listing
- Upload screenshots (1280x800 or 640x400)
- Upload promotional images (if desired)
- Write detailed description
- Add privacy policy URL (if collecting data)

**Step 4:** Submit for Review
- Review can take 1-3 days
- Address any feedback from reviewers
- Once approved, extension is published

### Version Management

**Semantic Versioning:**
- **Major (1.x.x):** Breaking changes
- **Minor (x.1.x):** New features
- **Patch (x.x.1):** Bug fixes

**Update Process:**
1. Increment version in `manifest.json`
2. Build and test
3. Create ZIP package
4. Upload to Chrome Web Store
5. Tag release in git: `git tag v1.0.1`

---

## Troubleshooting

### User-Facing Issues

#### Extension not working

**Symptoms:** Clicking "Start Monitoring" does nothing

**Diagnosis:**
1. Open service worker console
2. Look for error messages
3. Check Chrome version

**Solutions:**
- Upgrade Chrome to 109+
- Grant microphone permission
- Reload extension
- Check for conflicting extensions

---

#### No red overlay appearing

**Symptoms:** Volume meter works but overlay doesn't show

**Diagnosis:**
1. Check content script console
2. Verify host_permissions
3. Check tab URL

**Solutions:**
- Ensure page is http:// or https://
- Content scripts can't inject on chrome:// pages
- Check for CSP restrictions on page

---

#### Notification spam

**Symptoms:** Too many notifications

**Diagnosis:**
- Check cooldown period (should be 3 seconds)
- Check threshold setting (might be too low)

**Solutions:**
- Adjust threshold slider higher
- Verify cooldown logic in offscreen.ts
- Check `lastWarningTime` updates correctly

---

### Developer Issues

#### Webpack build errors

**Symptoms:** `pnpm run build` fails

**Common Causes:**
- Missing dependencies
- TypeScript errors
- Webpack config issues

**Solutions:**
```bash
# Clean and reinstall
rm -rf node_modules dist
pnpm install
pnpm run build

# Check TypeScript errors
npx tsc --noEmit
```

---

#### Offscreen document not creating

**Symptoms:** Error: "Offscreen API not available"

**Diagnosis:**
```typescript
console.log('chrome.offscreen available:', !!chrome.offscreen);
```

**Solutions:**
- Verify Chrome version 109+
- Check manifest includes `"offscreen"` permission
- Verify offscreen.html and offscreen.js in dist/

---

#### Messages not received

**Symptoms:** Components not communicating

**Diagnosis:**
- Add logging to message handlers
- Check message type spelling
- Verify `return true` in async handlers

**Example Debug Code:**
```typescript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request.type, request);
  // ... handler logic
  console.log('Sending response:', response);
  sendResponse(response);
  return true; // CRITICAL for async
});
```

---

## Appendix

### Shared Package Documentation

#### @your-are-loud/core

**Exports:**
```typescript
export const DEFAULT_VOLUME_THRESHOLD = 0.7;

export class ThresholdDetector {
  constructor(threshold: number);
  exceedsThreshold(volume: number): boolean;
  setThreshold(threshold: number): void;
  getThreshold(): number;
}

export const VOLUME_COLORS = {
  LOW: '#4CAF50',    // Green
  MEDIUM: '#FFC107', // Yellow
  HIGH: '#F44336'    // Red
};
```

#### @your-are-loud/audio-processing

**Exports:**
```typescript
export function calculateRMS(buffer: Float32Array): number;
export function normalizeVolume(rms: number): number;
export class AudioBufferProcessor {
  process(buffer: Float32Array): number;
}
```

### Chrome APIs Used

#### chrome.runtime

- `chrome.runtime.sendMessage()` - Send messages between components
- `chrome.runtime.onMessage` - Listen for messages
- `chrome.runtime.getContexts()` - Query extension contexts

#### chrome.storage

- `chrome.storage.local.get()` - Read from storage
- `chrome.storage.local.set()` - Write to storage
- `chrome.storage.onChanged` - Listen for storage changes

#### chrome.offscreen

- `chrome.offscreen.createDocument()` - Create hidden document
- `chrome.offscreen.closeDocument()` - Close offscreen document

#### chrome.tabs

- `chrome.tabs.query()` - Find tabs
- `chrome.tabs.sendMessage()` - Send message to tab

#### chrome.scripting

- `chrome.scripting.executeScript()` - Inject content script

#### chrome.notifications

- `chrome.notifications.create()` - Show notification
- `chrome.notifications.onClicked` - Handle notification clicks

### Web APIs Used

#### Web Audio API

- `navigator.mediaDevices.getUserMedia()` - Access microphone
- `AudioContext` - Audio processing context
- `AnalyserNode` - Frequency/time analysis
- `MediaStreamAudioSourceNode` - Connect MediaStream to audio graph

#### DOM APIs

- `document.createElement()` - Create overlay element
- `document.body.appendChild()` - Inject overlay
- `element.style.cssText` - Set inline styles

#### Timing APIs

- `requestAnimationFrame()` - Audio processing loop
- `setTimeout()` - Overlay auto-hide
- `Date.now()` - Cooldown timing

---

## Glossary

| Term | Definition |
|------|------------|
| **Offscreen Document** | Hidden HTML page in Chrome extension that can use Web APIs unavailable to service workers |
| **Service Worker** | Background script that runs independently of web pages |
| **Content Script** | JavaScript injected into web pages |
| **RMS** | Root Mean Square - measure of audio amplitude |
| **Analyser Node** | Web Audio API node for frequency/time analysis |
| **Threshold Detector** | Component that compares volume to configurable limit |
| **Manifest V3** | Latest Chrome extension platform version |
| **getUserMedia** | Browser API for accessing camera/microphone |

---

## Change Log

### Version 1.0.0 (2026-02-05)
- Initial release
- Background audio monitoring
- Visual overlay feedback
- Browser notifications
- Configurable threshold
- Warning count tracking
- State persistence

---

## Future Enhancements

### Planned Features
- [ ] Visual volume history graph
- [ ] Per-site threshold settings
- [ ] Export statistics to CSV
- [ ] Dark mode UI
- [ ] Keyboard shortcuts
- [ ] Multiple language support
- [ ] Audio calibration wizard

### Technical Improvements
- [ ] Automated testing suite
- [ ] Performance profiling
- [ ] Memory leak detection
- [ ] Error reporting system
- [ ] Analytics (privacy-preserving)

---

**Document Version:** 1.0  
**Author:** Development Team  
**Last Updated:** 2026-02-05  

*This document should be updated whenever architectural changes are made to the Chrome extension.*
