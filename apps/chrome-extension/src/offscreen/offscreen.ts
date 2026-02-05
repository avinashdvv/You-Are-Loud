// Offscreen document for persistent audio monitoring
import { calculateRMS, normalizeVolume } from '@your-are-loud/audio-processing';
import { ThresholdDetector, DEFAULT_VOLUME_THRESHOLD } from '@your-are-loud/core';

const AUDIO_MONITORING_INTERVAL = 100; // 60 * 1000
class OffscreenAudioMonitor {
  private audioContext: AudioContext | null = null;
  private analyserNode: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private stream: MediaStream | null = null;
  private isMonitoring = false;
  private animationFrame: number | null = null;
  private thresholdDetector: ThresholdDetector;
  private overThresholdStartTime: number | null = null;
  private loudDurationThreshold = AUDIO_MONITORING_INTERVAL; // 1 minute in milliseconds
  private hasNotifiedForCurrentPeriod = false;

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

    // Reset tracking variables
    this.overThresholdStartTime = null;
    this.hasNotifiedForCurrentPeriod = false;
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
      const now = Date.now();

      if (isOverThreshold) {
        // User is currently too loud
        if (this.overThresholdStartTime === null) {
          // Just started being too loud, record the start time
          this.overThresholdStartTime = now;
          this.hasNotifiedForCurrentPeriod = false;
          console.log('User started being too loud');
        } else {
          // Check if user has been loud for 1 minute
          const loudDuration = now - this.overThresholdStartTime;
          
          if (loudDuration >= this.loudDurationThreshold && !this.hasNotifiedForCurrentPeriod) {
            // User has been loud for 1 minute continuously
            console.log('User has been too loud for 1 minute, sending notification');
            this.showNotification();
            this.hasNotifiedForCurrentPeriod = true;
          }
        }
      } else {
        // Volume is below threshold
        if (this.overThresholdStartTime !== null) {
          // User stopped being loud, reset timer
          const loudDuration = now - this.overThresholdStartTime;
          console.log(`User stopped being loud after ${Math.round(loudDuration / 1000)} seconds`);
          this.overThresholdStartTime = null;
          this.hasNotifiedForCurrentPeriod = false;
        }
      }

      // Continue processing
      this.animationFrame = requestAnimationFrame(analyze);
    };

    analyze();
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
