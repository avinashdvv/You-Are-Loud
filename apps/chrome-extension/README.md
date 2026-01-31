# Your Are Loud - Chrome Extension

Browser extension for voice monitoring during video calls.

## Overview

A Chrome extension (Manifest V3) that monitors your microphone during browser-based video calls (Zoom, Google Meet, Microsoft Teams, etc.) and alerts you when your voice gets too loud.

## Technology Stack

- **Manifest**: V3 (latest Chrome extension standard)
- **Language**: TypeScript
- **Build Tool**: Webpack or Vite
- **UI Framework**: React (for popup/options page)
- **Audio API**: Web Audio API (getUserMedia + AudioContext)
- **Storage**: chrome.storage.local
- **Notifications**: chrome.notifications

## Features

- 🎙️ Real-time voice monitoring during video calls
- 🔔 Browser notifications when speaking too loud
- 🎨 Visual volume indicator in extension popup
- ⚙️ Adjustable threshold settings
- 📊 Warning statistics
- 🌐 Works with all browser-based video call platforms

## Project Structure

```
apps/chrome-extension/
├── package.json
├── tsconfig.json
├── webpack.config.js          # or vite.config.ts
├── manifest.json              # Extension manifest (V3)
├── src/
│   ├── background/
│   │   └── service-worker.ts  # Background service worker
│   ├── content/
│   │   └── content-script.ts  # Content script (injected into pages)
│   ├── popup/
│   │   ├── Popup.tsx          # Extension popup UI
│   │   ├── Popup.html         # Popup HTML
│   │   └── index.tsx          # Popup entry point
│   ├── options/
│   │   ├── Options.tsx        # Options page UI
│   │   ├── Options.html       # Options HTML
│   │   └── index.tsx          # Options entry point
│   ├── services/
│   │   ├── AudioMonitor.ts    # Audio monitoring service
│   │   └── StorageService.ts  # Chrome storage wrapper
│   ├── utils/
│   │   └── constants.ts       # Constants
│   └── types/
│       └── index.ts           # TypeScript types
├── public/
│   ├── icons/
│   │   ├── icon-16.png
│   │   ├── icon-48.png
│   │   └── icon-128.png
│   └── _locales/              # Internationalization (optional)
├── dist/                      # Build output
└── README.md                  # This file
```

## Getting Started

### 1. Initialize Project

```bash
cd apps/chrome-extension
npm init -y
```

### 2. Install Dependencies

```bash
# Core dependencies
npm install react react-dom

# TypeScript
npm install --save-dev typescript @types/react @types/react-dom @types/chrome

# Build tools
npm install --save-dev webpack webpack-cli ts-loader html-webpack-plugin copy-webpack-plugin

# Shared packages
npm install @your-are-loud/core @your-are-loud/audio-processing @your-are-loud/notifications
```

### 3. Create manifest.json

```json
{
  "manifest_version": 3,
  "name": "Your Are Loud",
  "version": "1.0.0",
  "description": "Voice monitoring for video calls - alerts you when speaking too loud",
  "permissions": [
    "storage",
    "notifications",
    "activeTab"
  ],
  "host_permissions": [
    "https://*/*"
  ],
  "background": {
    "service_worker": "background.js",
    "type": "module"
  },
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon-16.png",
      "48": "icons/icon-48.png",
      "128": "icons/icon-128.png"
    }
  },
  "options_page": "options.html",
  "icons": {
    "16": "icons/icon-16.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png"
  },
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```

### 4. Build Configuration

**webpack.config.js**:

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    background: './src/background/service-worker.ts',
    popup: './src/popup/index.tsx',
    options: './src/options/index.tsx',
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
      template: './src/popup/Popup.html',
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new HtmlWebpackPlugin({
      template: './src/options/Options.html',
      filename: 'options.html',
      chunks: ['options'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'manifest.json', to: 'manifest.json' },
        { from: 'public/icons', to: 'icons' },
      ],
    }),
  ],
};
```

## Core Implementation

### AudioMonitor.ts (Service)

```typescript
import { calculateRMS, normalizeVolume } from '@your-are-loud/audio-processing';
import { ThresholdDetector, DEFAULT_VOLUME_THRESHOLD } from '@your-are-loud/core';

export class AudioMonitor {
  private audioContext: AudioContext | null = null;
  private analyserNode: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private isMonitoring = false;
  private animationFrame: number | null = null;
  private thresholdDetector: ThresholdDetector;
  private lastWarningTime: number = 0;
  private warningCooldown = 3000; // 3 seconds

  constructor(threshold: number = DEFAULT_VOLUME_THRESHOLD) {
    this.thresholdDetector = new ThresholdDetector(threshold);
  }

  async startMonitoring(onVolumeChange: (volume: number) => void): Promise<void> {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Create audio context
      this.audioContext = new AudioContext();
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 2048;
      
      // Connect microphone to analyser
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.microphone.connect(this.analyserNode);

      this.isMonitoring = true;
      this.processAudio(onVolumeChange);
    } catch (error) {
      console.error('Failed to start audio monitoring:', error);
      throw error;
    }
  }

  stopMonitoring(): void {
    this.isMonitoring = false;
    
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    if (this.microphone) {
      this.microphone.disconnect();
      this.microphone = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  private processAudio(callback: (volume: number) => void): void {
    if (!this.isMonitoring || !this.analyserNode) return;

    const bufferLength = this.analyserNode.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);

    const analyze = () => {
      if (!this.isMonitoring || !this.analyserNode) return;

      // Get time domain data (waveform)
      this.analyserNode.getFloatTimeDomainData(dataArray);

      // Calculate RMS using shared package
      const rms = calculateRMS(dataArray);

      // Normalize using shared package
      const normalizedVolume = normalizeVolume(rms);

      callback(normalizedVolume);

      // Check threshold
      if (this.thresholdDetector.exceedsThreshold(normalizedVolume)) {
        this.checkAndShowWarning();
      }

      // Continue processing
      this.animationFrame = requestAnimationFrame(analyze);
    };

    analyze();
  }

  private checkAndShowWarning(): void {
    const now = Date.now();
    
    if (now - this.lastWarningTime < this.warningCooldown) {
      return;
    }

    this.lastWarningTime = now;
    this.showNotification();
  }

  private showNotification(): void {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon-128.png',
      title: '🔊 You\'re Too Loud!',
      message: 'Please lower your voice during the call',
      priority: 2,
    });
  }

  setThreshold(threshold: number): void {
    this.thresholdDetector.setThreshold(threshold);
  }
}
```

### Popup.tsx (Extension Popup)

```typescript
import React, { useState, useEffect } from 'react';
import { AudioMonitor } from '../services/AudioMonitor';
import './Popup.css';

export default function Popup() {
  const [currentVolume, setCurrentVolume] = useState(0);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [threshold, setThreshold] = useState(0.7);
  const [warningCount, setWarningCount] = useState(0);
  const [audioMonitor] = useState(() => new AudioMonitor(threshold));

  const startMonitoring = async () => {
    try {
      await audioMonitor.startMonitoring((volume) => {
        setCurrentVolume(volume);
      });
      setIsMonitoring(true);
    } catch (error) {
      console.error('Failed to start monitoring:', error);
      alert('Microphone access denied. Please grant permission.');
    }
  };

  const stopMonitoring = () => {
    audioMonitor.stopMonitoring();
    setIsMonitoring(false);
    setCurrentVolume(0);
  };

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newThreshold = parseFloat(e.target.value);
    setThreshold(newThreshold);
    audioMonitor.setThreshold(newThreshold);
  };

  useEffect(() => {
    // Load saved settings
    chrome.storage.local.get(['threshold', 'warningCount'], (result) => {
      if (result.threshold) setThreshold(result.threshold);
      if (result.warningCount) setWarningCount(result.warningCount);
    });

    return () => {
      if (isMonitoring) {
        stopMonitoring();
      }
    };
  }, []);

  const volumeColor = currentVolume > threshold ? 'red' : 
                      currentVolume > threshold * 0.8 ? 'yellow' : 'green';

  return (
    <div className="popup-container">
      <h1>🎙️ Voice Monitor</h1>
      
      <div className="volume-meter">
        <div className="volume-label">Current Volume</div>
        <div className="volume-bar-container">
          <div 
            className="volume-bar"
            style={{
              width: `${currentVolume * 100}%`,
              backgroundColor: volumeColor,
            }}
          />
        </div>
      </div>

      <div className="threshold-control">
        <label>
          Threshold: {threshold.toFixed(2)}
        </label>
        <input
          type="range"
          min="0.3"
          max="1.0"
          step="0.01"
          value={threshold}
          onChange={handleThresholdChange}
        />
      </div>

      <div className="warning-count">
        Warnings: <span className="count">{warningCount}</span>
      </div>

      <button
        className={`monitor-button ${isMonitoring ? 'stop' : 'start'}`}
        onClick={isMonitoring ? stopMonitoring : startMonitoring}
      >
        {isMonitoring ? '⏹ Stop Monitoring' : '▶️ Start Monitoring'}
      </button>
    </div>
  );
}
```

### service-worker.ts (Background Script)

```typescript
// Background service worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('Your Are Loud extension installed');
  
  // Set default values
  chrome.storage.local.set({
    threshold: 0.7,
    warningCount: 0,
  });
});

// Listen for notification clicks
chrome.notifications.onClicked.addListener((notificationId) => {
  console.log('Notification clicked:', notificationId);
  chrome.notifications.clear(notificationId);
});

// Handle messages from popup/content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'WARNING_TRIGGERED') {
    // Increment warning count
    chrome.storage.local.get(['warningCount'], (result) => {
      const newCount = (result.warningCount || 0) + 1;
      chrome.storage.local.set({ warningCount: newCount });
    });
  }
  
  sendResponse({ success: true });
});
```

## Integration with Shared Packages

The Chrome extension directly uses TypeScript shared packages:

```typescript
import { 
  DEFAULT_VOLUME_THRESHOLD,
  ThresholdDetector,
  VOLUME_COLORS 
} from '@your-are-loud/core';

import { 
  calculateRMS,
  normalizeVolume,
  AudioBufferProcessor 
} from '@your-are-loud/audio-processing';

import { 
  NotificationManager,
  CooldownManager 
} from '@your-are-loud/notifications';
```

## Building and Testing

### Development Build

```bash
npm run build
```

### Watch Mode (for development)

```bash
npm run watch
```

### Load Extension in Chrome

1. Open Chrome
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `dist/` folder

### Testing

1. Load the extension
2. Click the extension icon
3. Click "Start Monitoring"
4. Grant microphone permission
5. Speak at varying volumes
6. Verify notifications appear when threshold exceeded

## Permissions Explanation

- **storage**: Save user settings and warning count
- **notifications**: Show warning notifications
- **activeTab**: Access current tab for context (optional)

## Publishing to Chrome Web Store

### 1. Prepare for Production

```bash
npm run build
```

### 2. Create ZIP Package

```bash
cd dist
zip -r your-are-loud-extension.zip *
```

### 3. Upload to Chrome Web Store

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Pay one-time $5 registration fee
3. Click "New Item"
4. Upload ZIP file
5. Fill in store listing details
6. Submit for review

## Features Roadmap

- [ ] System tray notification option
- [ ] Visual indicator on video call pages
- [ ] Per-site threshold settings
- [ ] Statistics dashboard
- [ ] Export warning history
- [ ] Dark mode
- [ ] Multiple language support

## Browser Compatibility

- ✅ Chrome 88+
- ✅ Edge 88+ (Chromium-based)
- ⚠️ Firefox (requires Manifest V2 version)
- ❌ Safari (requires different architecture)

## Troubleshooting

### Microphone Permission Denied

- Check Chrome Settings → Privacy and Security → Site Settings → Microphone
- Ensure extension has permission

### Extension Not Working on Some Sites

- Some sites may block microphone access
- Check the site's Content Security Policy

### Build Errors

```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

## Development Tips

1. Use Chrome DevTools to debug popup/options pages
2. Use `chrome://inspect/#service-workers` to debug service worker
3. Enable "Preserve log" in Console for service worker debugging
4. Test on different video call platforms (Zoom, Meet, Teams)

## Contributing

When working on the Chrome extension:
1. Follow Manifest V3 best practices
2. Keep shared package integration up to date
3. Test on multiple video call platforms
4. Ensure privacy-friendly (no data collection)
5. Follow Chrome Web Store policies

## Privacy Policy

This extension:
- ✅ Processes audio locally (no data sent to servers)
- ✅ Does not store or transmit audio data
- ✅ Only stores user preferences locally
- ✅ No analytics or tracking

## License

MIT License - See root LICENSE file
