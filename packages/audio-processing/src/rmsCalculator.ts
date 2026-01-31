/**
 * RMS (Root Mean Square) Calculator
 * Calculates the RMS value of audio samples for volume measurement
 */

/**
 * Calculate RMS (Root Mean Square) of audio samples
 * This is the core algorithm for measuring audio volume
 * 
 * Formula: RMS = sqrt(sum(samples^2) / count)
 * 
 * @param samples Float32Array of audio samples
 * @returns RMS value
 */
export function calculateRMS(samples: Float32Array): number {
  if (samples.length === 0) {
    return 0;
  }

  let sumOfSquares = 0;
  
  for (let i = 0; i < samples.length; i++) {
    sumOfSquares += samples[i] * samples[i];
  }

  const meanSquare = sumOfSquares / samples.length;
  const rms = Math.sqrt(meanSquare);

  return rms;
}

/**
 * Calculate RMS with optimized stride-based sampling
 * Useful for large buffers where you want to skip samples
 * 
 * @param samples Float32Array of audio samples
 * @param stride Number of samples to skip (default: 1, no skipping)
 * @returns RMS value
 */
export function calculateRMSWithStride(samples: Float32Array, stride: number = 1): number {
  if (samples.length === 0 || stride <= 0) {
    return 0;
  }

  let sumOfSquares = 0;
  let count = 0;

  for (let i = 0; i < samples.length; i += stride) {
    sumOfSquares += samples[i] * samples[i];
    count++;
  }

  if (count === 0) {
    return 0;
  }

  const meanSquare = sumOfSquares / count;
  const rms = Math.sqrt(meanSquare);

  return rms;
}

/**
 * Convert RMS to decibels
 * 
 * Formula: dB = 20 * log10(rms)
 * 
 * @param rms RMS value
 * @returns Decibel value
 */
export function rmsToDecibels(rms: number): number {
  if (rms <= 0) {
    return -Infinity; // Silence
  }

  return 20 * Math.log10(rms);
}

/**
 * Convert decibels to RMS
 * 
 * Formula: rms = 10^(dB/20)
 * 
 * @param decibels Decibel value
 * @returns RMS value
 */
export function decibelsToRMS(decibels: number): number {
  if (!isFinite(decibels)) {
    return 0;
  }

  return Math.pow(10, decibels / 20);
}
