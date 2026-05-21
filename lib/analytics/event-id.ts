// UUIDv4 generator for Meta event_id.
//
// Single source of truth — both browser AND server import from this file to
// avoid drift. Native crypto.randomUUID() is available on Node 22 + all modern
// browsers (Safari 15.4+, Chrome 92+, Firefox 95+). No npm dep needed.
//
// NOTE: this module is intentionally universal (no server-restricted import) —
// safe to call from client components. The browser generates the event_id,
// then forwards it to the Server Action so both Pixel + CAPI fires share the
// same id (Pitfall 2).

export function generateEventId(): string {
  // typeof check covers SSR + older runtimes; throws on hard failure.
  if (typeof crypto === "undefined" || typeof crypto.randomUUID !== "function") {
    throw new Error("crypto.randomUUID is not available in this runtime");
  }
  return crypto.randomUUID();
}
