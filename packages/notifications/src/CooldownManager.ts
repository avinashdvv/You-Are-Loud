/**
 * Cooldown Manager
 * Manages timing between notifications to prevent spam
 */

import { WARNING_COOLDOWN_MS } from '@your-are-loud/core';
import type { NotificationManagerInterface } from '@your-are-loud/core';

export class CooldownManager implements NotificationManagerInterface {
  private lastNotificationTime: Date | null = null;
  private cooldownMs: number;

  constructor(cooldownMs: number = WARNING_COOLDOWN_MS) {
    this.cooldownMs = cooldownMs;
  }

  /**
   * Check if enough time has passed to show another notification
   * @param cooldownMs Optional override for cooldown period
   * @returns true if notification can be shown, false otherwise
   */
  canShowNotification(cooldownMs?: number): boolean {
    const effectiveCooldown = cooldownMs ?? this.cooldownMs;

    if (this.lastNotificationTime === null) {
      return true;
    }

    const now = new Date();
    const timeSinceLastNotification = now.getTime() - this.lastNotificationTime.getTime();

    return timeSinceLastNotification >= effectiveCooldown;
  }

  /**
   * Record that a notification was shown
   */
  recordNotificationShown(): void {
    this.lastNotificationTime = new Date();
  }

  /**
   * Get the timestamp of the last notification
   */
  getLastNotificationTime(): Date | null {
    return this.lastNotificationTime;
  }

  /**
   * Get time remaining until next notification can be shown (in milliseconds)
   * @returns Time remaining in ms, or 0 if notification can be shown now
   */
  getTimeUntilNextNotification(): number {
    if (this.lastNotificationTime === null) {
      return 0;
    }

    const now = new Date();
    const elapsed = now.getTime() - this.lastNotificationTime.getTime();
    const remaining = this.cooldownMs - elapsed;

    return Math.max(0, remaining);
  }

  /**
   * Reset the cooldown (allows immediate notification)
   */
  resetCooldown(): void {
    this.lastNotificationTime = null;
  }

  /**
   * Set a new cooldown period
   */
  setCooldown(cooldownMs: number): void {
    if (cooldownMs < 0) {
      throw new Error('Cooldown must be non-negative');
    }
    this.cooldownMs = cooldownMs;
  }

  /**
   * Get the current cooldown period
   */
  getCooldown(): number {
    return this.cooldownMs;
  }
}
