/**
 * Global Chrome extension API declaration.
 * Ensures the `chrome` global is typed so "Cannot find name 'chrome'" is resolved.
 * For full Chrome API typings, @types/chrome is in devDependencies.
 */
declare global {
  interface ChromeRuntimeSendMessage {
    (message: unknown): Promise<Record<string, unknown> | undefined>;
    (message: unknown, responseCallback: (response: Record<string, unknown> | undefined) => void): void;
  }

  const chrome: {
    runtime: {
      sendMessage: ChromeRuntimeSendMessage;
      onMessage: {
        addListener: (callback: (message: unknown) => void) => void;
        removeListener: (callback: (message: unknown) => void) => void;
      };
    };
    storage: {
      local: {
        get: (
          keys: string[] | null,
          callback: (result: Record<string, unknown>) => void
        ) => void;
        set: (items: Record<string, unknown>, callback?: () => void) => void;
      };
      onChanged: {
        addListener: (callback: (changes: Record<string, { newValue: unknown }>) => void) => void;
        removeListener: (callback: (changes: Record<string, { newValue: unknown }>) => void) => void;
      };
    };
  };
}

export {};
