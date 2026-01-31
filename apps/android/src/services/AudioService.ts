import AudioRecord from 'react-native-audio-record';
import { calculateRMS, normalizeVolume } from '@your-are-loud/audio-processing';

const options = {
  sampleRate: 44100,
  channels: 1,
  bitsPerSample: 16,
  audioSource: 6, // VOICE_RECOGNITION
  wavFile: 'audio.wav',
};

export class AudioService {
  private isRecording = false;
  private pollInterval: NodeJS.Timeout | null = null;

  constructor() {
    AudioRecord.init(options);
  }

  async startMonitoring(onVolumeChange: (volume: number) => void): Promise<void> {
    this.isRecording = true;
    AudioRecord.start();

    this.pollInterval = setInterval(async () => {
      if (!this.isRecording) return;

      try {
        const audioData = await AudioRecord.getAudioData();
        const buffer = this.base64ToFloat32Array(audioData);
        const rms = calculateRMS(buffer);
        const normalizedVolume = normalizeVolume(rms);
        onVolumeChange(normalizedVolume);
      } catch (error) {
        console.error('Audio polling error:', error);
      }
    }, 100);
  }

  stopMonitoring(): void {
    this.isRecording = false;
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    AudioRecord.stop();
  }

  private base64ToFloat32Array(base64: string): Float32Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const samples = new Float32Array(bytes.length / 2);
    for (let i = 0; i < samples.length; i++) {
      const int16 = (bytes[i * 2 + 1] << 8) | bytes[i * 2];
      samples[i] = int16 / 32768.0;
    }

    return samples;
  }
}
