/**
 * Global declarations: Chrome extension API + JSX.
 * - chrome: ensures "Cannot find name 'chrome'" is resolved.
 * - JSX: ensures "no interface 'JSX.IntrinsicElements' exists" when @types/react isn't resolved.
 * For full typings, @types/chrome and @types/react are in devDependencies.
 */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: Record<string, unknown>;
    }
  }

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
