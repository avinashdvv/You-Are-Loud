// Offscreen document for persistent audio monitoring
import { calculateRMS, normalizeVolume } from '@your-are-loud/audio-processing';
import { ThresholdDetector, DEFAULT_VOLUME_THRESHOLD } from '@your-are-loud/core';

class OffscreenAudioMonitor {
  private audioContext: AudioContext | null = null;
  private analyserNode: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private stream: MediaStream | null = null;
  private isMonitoring = false;
  private animationFrame: number | null = null;
  private thresholdDetector: ThresholdDetector;
  private lastWarningTime: number = 0;
  private warningCooldown = 3000; // 3 seconds
  private wasOverThreshold = false;

  constructor() {
    this.thresholdDetector = new ThresholdDetector(DEFAULT_VOLUME_THRESHOLD);
    console.log('OffscreenAudioMonitor initialized');
  }

  async startMonitoring(): Promise<void> {
    try {
      console.log('Starting audio monitoring in offscreen document...');
      
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Create audio context
      this.audioContext = new AudioContext();
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 2048;

      // Connect microphone to analyser
      this.microphone = this.audioContext.createMediaStreamSource(this.stream);
      this.microphone.connect(this.analyserNode);

      this.isMonitoring = true;
      this.processAudio();
      
      console.log('Audio monitoring started successfully');
    } catch (error) {
      console.error('Failed to start audio monitoring:', error);
      throw error;
    }
  }

  stopMonitoring(): void {
    console.log('Stopping audio monitoring...');
    this.isMonitoring = false;

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    if (this.microphone) {
      this.microphone.disconnect();
      this.microphone = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    // Clear tab color overlay when stopping
    this.sendTabColorChange(false);
    this.wasOverThreshold = false;
  }

  private processAudio(): void {
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

      // Send volume update to background
      this.sendVolumeUpdate(normalizedVolume);

      // Check threshold
      const isOverThreshold = this.thresholdDetector.exceedsThreshold(normalizedVolume);

      if (isOverThreshold) {
        if (!this.wasOverThreshold) {
          // Just crossed threshold, show red immediately
          this.sendTabColorChange(true);
        }
        this.checkAndShowWarning();
        this.wasOverThreshold = true;
      } else if (this.wasOverThreshold) {
        // Volume dropped below threshold, hide red
        this.sendTabColorChange(false);
        this.wasOverThreshold = false;
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
    // Send message to background script to show notification
    chrome.runtime.sendMessage({ 
      type: 'WARNING_TRIGGERED'
    });
  }

  private sendVolumeUpdate(volume: number): void {
    // Send volume update to background script
    chrome.runtime.sendMessage({
      type: 'VOLUME_UPDATE',
      volume: volume
    }).catch(() => {
      // Ignore errors if background script is not ready
    });
  }

  private sendTabColorChange(showRed: boolean): void {
    // Send message to background to change tab color
    chrome.runtime.sendMessage({
      type: showRed ? 'SHOW_TAB_RED' : 'HIDE_TAB_RED'
    }).catch(() => {
      // Ignore errors if background script is not ready
    });
  }

  setThreshold(threshold: number): void {
    this.thresholdDetector.setThreshold(threshold);
  }

  getStatus(): boolean {
    return this.isMonitoring;
  }
}

// Create global instance
const monitor = new OffscreenAudioMonitor();

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Offscreen received message:', request.type);
  
  if (request.type === 'START_MONITORING') {
    console.log('Starting monitoring in offscreen...');
    monitor.startMonitoring()
      .then(() => {
        console.log('Monitoring started successfully in offscreen');
        sendResponse({ success: true, status: 'monitoring' });
      })
      .catch((error) => {
        console.error('Failed to start monitoring in offscreen:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Will respond asynchronously
  } else if (request.type === 'STOP_MONITORING') {
    console.log('Stopping monitoring in offscreen...');
    monitor.stopMonitoring();
    sendResponse({ success: true, status: 'stopped' });
  } else if (request.type === 'SET_THRESHOLD') {
    console.log('Setting threshold in offscreen:', request.threshold);
    monitor.setThreshold(request.threshold);
    sendResponse({ success: true });
  } else if (request.type === 'GET_STATUS') {
    const status = monitor.getStatus();
    console.log('Status requested:', status);
    sendResponse({ success: true, isMonitoring: status });
  }
  
  return true;
});

console.log('Offscreen document ready and listening for messages');
