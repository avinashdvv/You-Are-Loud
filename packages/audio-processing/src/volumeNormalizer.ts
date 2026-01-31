/**
 * Volume Normalizer
 * Converts RMS values to normalized volume (0.0 - 1.0)
 */

import { rmsToDecibels } from './rmsCalculator';
import { RMS_REFERENCE_DB } from '@your-are-loud/core';

/**
 * Normalize volume to 0.0 - 1.0 range
 * 
 * This matches the Swift implementation:
 * - Converts RMS to decibels
 * - Adds reference dB (default 50) to shift range
 * - Divides by reference dB to normalize
 * - Clamps to 0.0 - 1.0
 * 
 * @param rms RMS value from audio samples
 * @param referenceDb Reference dB for normalization (default: 50)
 * @returns Normalized volume (0.0 - 1.0)
 */
export function normalizeVolume(rms: number, referenceDb: number = RMS_REFERENCE_DB): number {
  // Convert RMS to decibels
  const avgPower = rmsToDecibels(rms);

  // Handle silence or invalid values
  if (!isFinite(avgPower)) {
    return 0;
  }

  // Normalize using reference dB
  // Formula: (avgPower + referenceDb) / referenceDb
  const normalized = (avgPower + referenceDb) / referenceDb;

  // Clamp to 0.0 - 1.0 range
  return Math.max(0, Math.min(1, normalized));
}

/**
 * Normalize volume with custom range
 * 
 * @param rms RMS value
 * @param minDb Minimum dB (maps to 0.0)
 * @param maxDb Maximum dB (maps to 1.0)
 * @returns Normalized volume (0.0 - 1.0)
 */
export function normalizeVolumeWithRange(
  rms: number,
  minDb: number = -50,
  maxDb: number = 0
): number {
  const db = rmsToDecibels(rms);

  if (!isFinite(db)) {
    return 0;
  }

  // Linear interpolation between minDb and maxDb
  const normalized = (db - minDb) / (maxDb - minDb);

  // Clamp to 0.0 - 1.0
  return Math.max(0, Math.min(1, normalized));
}

/**
 * Apply smoothing to volume values to reduce jitter
 * Uses exponential moving average
 * 
 * @param currentVolume Current volume reading
 * @param previousVolume Previous volume reading
 * @param smoothingFactor Smoothing factor (0.0 - 1.0, higher = more smoothing)
 * @returns Smoothed volume
 */
export function smoothVolume(
  currentVolume: number,
  previousVolume: number,
  smoothingFactor: number = 0.3
): number {
  if (smoothingFactor < 0 || smoothingFactor > 1) {
    throw new Error('Smoothing factor must be between 0 and 1');
  }

  return smoothingFactor * previousVolume + (1 - smoothingFactor) * currentVolume;
}
