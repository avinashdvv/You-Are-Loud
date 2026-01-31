/**
 * Threshold detection logic for volume monitoring
 */

import { DEFAULT_VOLUME_THRESHOLD, MIN_VOLUME_THRESHOLD, MAX_VOLUME_THRESHOLD } from './constants';
import type { VolumeLevel, VolumeInfo } from './types';

export class ThresholdDetector {
  private threshold: number;

  constructor(threshold: number = DEFAULT_VOLUME_THRESHOLD) {
    this.setThreshold(threshold);
  }

  /**
   * Set the volume threshold
   * @param value Threshold value (0.0 - 1.0)
   */
  setThreshold(value: number): void {
    if (value < MIN_VOLUME_THRESHOLD || value > MAX_VOLUME_THRESHOLD) {
      throw new Error(
        `Threshold must be between ${MIN_VOLUME_THRESHOLD} and ${MAX_VOLUME_THRESHOLD}`
      );
    }
    this.threshold = value;
  }

  /**
   * Get the current threshold
   */
  getThreshold(): number {
    return this.threshold;
  }

  /**
   * Check if volume exceeds the threshold
   */
  exceedsThreshold(normalizedVolume: number): boolean {
    return normalizedVolume > this.threshold;
  }

  /**
   * Determine the volume level based on threshold
   */
  getVolumeLevel(normalizedVolume: number): VolumeLevel {
    if (normalizedVolume > this.threshold) {
      return 'high';
    } else if (normalizedVolume > this.threshold * 0.8) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  /**
   * Create volume info object with threshold context
   */
  createVolumeInfo(normalizedVolume: number, decibels: number): VolumeInfo {
    return {
      normalized: normalizedVolume,
      decibels,
      level: this.getVolumeLevel(normalizedVolume),
      exceedsThreshold: this.exceedsThreshold(normalizedVolume),
    };
  }

  /**
   * Validate a threshold value
   */
  static isValidThreshold(value: number): boolean {
    return value >= MIN_VOLUME_THRESHOLD && value <= MAX_VOLUME_THRESHOLD;
  }
}
