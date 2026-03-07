export const StorageKey = {
  THRESHOLD: 'threshold',
  WARNING_COUNT: 'warningCount',
  IS_MONITORING: 'isMonitoring',
} as const;

export type StorageKey = (typeof StorageKey)[keyof typeof StorageKey];
