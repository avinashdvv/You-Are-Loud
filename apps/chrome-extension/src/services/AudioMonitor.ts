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

    // Clear tab color overlay when stopping
    this.sendTabColorChange(false);
  }

  private processAudio(callback: (volume: number) => void): void {
    if (!this.isMonitoring || !this.analyserNode) return;

    const bufferLength = this.analyserNode.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    let wasOverThreshold = false;

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
      const isOverThreshold = this.thresholdDetector.exceedsThreshold(normalizedVolume);
      
      if (isOverThreshold) {
        if (!wasOverThreshold) {
          // Just crossed threshold, show red immediately
          this.sendTabColorChange(true);
        }
        this.checkAndShowWarning();
        wasOverThreshold = true;
      } else if (wasOverThreshold) {
        // Volume dropped below threshold, hide red
        this.sendTabColorChange(false);
        wasOverThreshold = false;
      }

      // Continue processing
      this.animationFrame = requestAnimationFrame(analyze);
    };

    analyze();
  }

  private sendTabColorChange(showRed: boolean): void {
    // Send message to background to change tab color
    chrome.runtime.sendMessage({ 
      type: showRed ? 'SHOW_TAB_RED' : 'HIDE_TAB_RED'
    }).catch(() => {
      // Ignore errors if background script is not ready
    });
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
      title: "🔊 You're Too Loud!",
      message: 'Please lower your voice during the call',
      priority: 2,
    });

    // Send message to background script
    chrome.runtime.sendMessage({ type: 'WARNING_TRIGGERED' });
  }

  setThreshold(threshold: number): void {
    this.thresholdDetector.setThreshold(threshold);
  }
}
