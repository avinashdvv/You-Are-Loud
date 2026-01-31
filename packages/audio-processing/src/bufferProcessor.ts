/**
 * Audio Buffer Processor
 * Main processing pipeline for audio buffers
 */

import type { AudioBuffer, VolumeInfo, AudioProcessorInterface } from '@your-are-loud/core';
import { calculateRMS, rmsToDecibels } from './rmsCalculator';
import { normalizeVolume } from './volumeNormalizer';

export class AudioBufferProcessor implements AudioProcessorInterface {
  private previousVolume: number = 0;
  private smoothingEnabled: boolean = false;
  private smoothingFactor: number = 0.3;

  constructor(options?: { smoothing?: boolean; smoothingFactor?: number }) {
    if (options?.smoothing !== undefined) {
      this.smoothingEnabled = options.smoothing;
    }
    if (options?.smoothingFactor !== undefined) {
      this.smoothingFactor = options.smoothingFactor;
    }
  }

  /**
   * Process an audio buffer and return volume information
   */
  processBuffer(buffer: AudioBuffer): VolumeInfo {
    // Calculate RMS from samples
    const rms = this.calculateRMS(buffer.data);

    // Convert to decibels
    const decibels = rmsToDecibels(rms);

    // Normalize to 0.0 - 1.0
    let normalized = this.normalizeVolume(rms);

    // Apply smoothing if enabled
    if (this.smoothingEnabled) {
      normalized =
        this.smoothingFactor * this.previousVolume + (1 - this.smoothingFactor) * normalized;
      this.previousVolume = normalized;
    }

    // Determine volume level (will be set by ThresholdDetector in practice)
    const level = this.getVolumeLevel(normalized);

    return {
      normalized,
      decibels: isFinite(decibels) ? decibels : -Infinity,
      level,
      exceedsThreshold: false, // This should be set by ThresholdDetector
    };
  }

  /**
   * Calculate RMS from audio samples
   */
  calculateRMS(samples: Float32Array): number {
    return calculateRMS(samples);
  }

  /**
   * Normalize volume to 0.0 - 1.0
   */
  normalizeVolume(rms: number): number {
    return normalizeVolume(rms);
  }

  /**
   * Get volume level (basic classification)
   * Note: In practice, this should use ThresholdDetector
   */
  private getVolumeLevel(normalized: number): 'low' | 'medium' | 'high' {
    if (normalized > 0.7) {
      return 'high';
    } else if (normalized > 0.5) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  /**
   * Enable or disable volume smoothing
   */
  setSmoothing(enabled: boolean, factor?: number): void {
    this.smoothingEnabled = enabled;
    if (factor !== undefined) {
      this.smoothingFactor = Math.max(0, Math.min(1, factor));
    }
  }

  /**
   * Reset processor state
   */
  reset(): void {
    this.previousVolume = 0;
  }
}
