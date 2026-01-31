/**
 * Notification Manager
 * High-level notification management with cooldown
 */

import type { NotificationConfig, WarningEvent } from '@your-are-loud/core';
import { WARNING_MESSAGES } from '@your-are-loud/core';
import { CooldownManager } from './CooldownManager';

export class NotificationManager {
  private cooldownManager: CooldownManager;
  private warningHistory: WarningEvent[] = [];
  private maxHistorySize: number = 100;

  constructor(cooldownMs?: number) {
    this.cooldownManager = new CooldownManager(cooldownMs);
  }

  /**
   * Attempt to show a notification
   * Returns true if notification was shown, false if still in cooldown
   */
  shouldShowNotification(volume: number, threshold: number): boolean {
    if (!this.cooldownManager.canShowNotification()) {
      return false;
    }

    // Record the warning event
    const event: WarningEvent = {
      timestamp: new Date(),
      volume,
      threshold,
    };

    this.addWarningToHistory(event);
    this.cooldownManager.recordNotificationShown();

    return true;
  }

  /**
   * Get default notification configuration
   */
  getDefaultNotificationConfig(): NotificationConfig {
    return {
      title: WARNING_MESSAGES.TITLE,
      body: WARNING_MESSAGES.BODY,
      sound: true,
    };
  }

  /**
   * Get custom notification configuration
   */
  getCustomNotificationConfig(
    title: string,
    body: string,
    sound: boolean = true
  ): NotificationConfig {
    return {
      title,
      body,
      sound,
    };
  }

  /**
   * Add a warning event to history
   */
  private addWarningToHistory(event: WarningEvent): void {
    this.warningHistory.push(event);

    // Limit history size
    if (this.warningHistory.length > this.maxHistorySize) {
      this.warningHistory.shift();
    }
  }

  /**
   * Get warning history
   */
  getWarningHistory(): WarningEvent[] {
    return [...this.warningHistory];
  }

  /**
   * Get recent warnings (within last N milliseconds)
   */
  getRecentWarnings(timeWindowMs: number): WarningEvent[] {
    const now = new Date();
    const cutoffTime = now.getTime() - timeWindowMs;

    return this.warningHistory.filter((event) => event.timestamp.getTime() >= cutoffTime);
  }

  /**
   * Get total warning count
   */
  getWarningCount(): number {
    return this.warningHistory.length;
  }

  /**
   * Clear warning history
   */
  clearHistory(): void {
    this.warningHistory = [];
  }

  /**
   * Reset cooldown
   */
  resetCooldown(): void {
    this.cooldownManager.resetCooldown();
  }

  /**
   * Get time until next notification can be shown
   */
  getTimeUntilNextNotification(): number {
    return this.cooldownManager.getTimeUntilNextNotification();
  }

  /**
   * Get cooldown manager for direct access
   */
  getCooldownManager(): CooldownManager {
    return this.cooldownManager;
  }
}
