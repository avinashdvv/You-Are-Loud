/**
 * Shared TypeScript types for Your Are Loud
 */

export interface AudioState {
  currentVolume: number; // 0.0 - 1.0 normalized
  isMonitoring: boolean;
  volumeThreshold: number; // 0.3 - 1.0
  warningCount: number;
  lastWarningTime: Date | null;
}

export interface AudioConfig {
  bufferSize?: number;
  sampleRate?: number;
  threshold?: number;
}

export interface AudioBuffer {
  data: Float32Array;
  sampleRate: number;
  channelCount: number;
  frameLength: number;
}

export interface NotificationConfig {
  title: string;
  body: string;
  sound?: boolean;
  cooldownMs?: number;
}

export interface WarningEvent {
  timestamp: Date;
  volume: number;
  threshold: number;
}

export type VolumeLevel = 'low' | 'medium' | 'high';

export interface VolumeInfo {
  normalized: number; // 0.0 - 1.0
  decibels: number; // dB value
  level: VolumeLevel;
  exceedsThreshold: boolean;
}

export interface AudioProcessorInterface {
  processBuffer(buffer: AudioBuffer): VolumeInfo;
  calculateRMS(samples: Float32Array): number;
  normalizeVolume(rms: number): number;
}

export interface NotificationManagerInterface {
  canShowNotification(cooldownMs: number): boolean;
  recordNotificationShown(): void;
  getLastNotificationTime(): Date | null;
  resetCooldown(): void;
}
