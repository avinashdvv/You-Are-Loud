/**
 * Core constants shared across all platforms
 */

export const DEFAULT_VOLUME_THRESHOLD = 0.7; // 0.0 - 1.0
export const MIN_VOLUME_THRESHOLD = 0.3;
export const MAX_VOLUME_THRESHOLD = 1.0;
export const WARNING_COOLDOWN_MS = 3000; // 3 seconds between warnings
export const AUDIO_BUFFER_SIZE = 1024;

// Volume level colors (for UI consistency)
export const VOLUME_COLORS = {
  LOW: 'green',
  MEDIUM: 'yellow',
  HIGH: 'red',
} as const;

// Notification messages
export const WARNING_MESSAGES = {
  TITLE: '🔊 You\'re Too Loud!',
  BODY: 'Please lower your voice during the call',
} as const;

// Audio processing constants
export const AUDIO_SAMPLE_RATE = 44100;
export const RMS_REFERENCE_DB = 50; // Reference dB for normalization
