// Ambient declaration for Meta Pixel's window.fbq.
//
// Source: derived from the canonical Meta Pixel snippet at
//   https://developers.facebook.com/docs/meta-pixel/get-started
// No @types/facebook-pixel package exists — every project hand-rolls this.
//
// The union covers the 4 forms used in Phase 9: init, track, trackCustom, consent.

type FbqEventID = { eventID?: string };
type FbqParams = Record<string, unknown>;

interface FbqFn {
  (cmd: "init", pixelId: string, options?: FbqParams): void;
  (cmd: "track", eventName: string, params?: FbqParams, opts?: FbqEventID): void;
  (cmd: "trackCustom", eventName: string, params?: FbqParams, opts?: FbqEventID): void;
  (cmd: "consent", action: "grant" | "revoke"): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  loaded: boolean;
  version: string;
  push: (...args: unknown[]) => void;
}

declare global {
  interface Window {
    fbq?: FbqFn;
    _fbq?: FbqFn;
  }
}

export {};
