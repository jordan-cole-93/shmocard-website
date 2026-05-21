"use client";

import type { MetaCustomData, MetaEventName } from "./types";

// Typed client-side wrapper around window.fbq.
//
// - Silent no-op when window.fbq is undefined (script not yet loaded or
//   blocked by an ad-blocker). Analytics MUST NOT break UX.
// - Caller passes one eventId (string); wrapper writes the Pixel-shape
//   { eventID: eventId } (Pitfall 2 — Pixel uses camelCase, CAPI uses
//   snake_case; centralizing the shape conversion prevents drift).

export function trackPixelEvent(
  name: MetaEventName,
  params: MetaCustomData,
  eventId: string,
): void {
  if (typeof window === "undefined") return;
  if (!window.fbq) return; // script not loaded yet — silent no-op
  try {
    window.fbq("track", name, params, { eventID: eventId });
  } catch {
    // Never throw from a tracker — analytics must not break UX.
  }
}
