import "server-only";

import type { MetaEventPayload } from "./types";

// Meta Conversions API helper — mirrors lib/shopify/index.ts shopifyFetch pattern.
//
// Endpoint: graph.facebook.com/v25.0/{PIXEL_ID}/events?access_token={TOKEN}
// (Graph API v25.0 introduced 2026-02-18 — confirmed against Meta changelog.)
//
// Security posture (mirrors lib/shopify/index.ts):
// - import "server-only" — build error if any client module imports this file.
// - Token NEVER logged. Errors return generic "send failed" — never echo token,
//   status body, or rejected payload to caller (Pitfall + Phase 8 applyDiscountCode
//   precedent).
// - test_event_code added to payload ONLY when FB_TEST_EVENT_CODE is non-empty.
//   Production builds with the env var unset never include the field (Pitfall 5).

const CAPI_API_VERSION = "v25.0";

function getPixelId(): string {
  const id = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  if (!id) throw new Error("NEXT_PUBLIC_FB_PIXEL_ID is not set");
  return id;
}

function getAccessToken(): string {
  const tok = process.env.FB_CAPI_ACCESS_TOKEN;
  if (!tok) throw new Error("FB_CAPI_ACCESS_TOKEN is not set");
  return tok;
}

export async function metaFetch(event: MetaEventPayload): Promise<void> {
  const pixelId = getPixelId();
  const token = getAccessToken();
  const endpoint = `https://graph.facebook.com/${CAPI_API_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(token)}`;

  const body: { data: MetaEventPayload[]; test_event_code?: string } = {
    data: [event],
  };
  const testCode = process.env.FB_TEST_EVENT_CODE;
  if (testCode) body.test_event_code = testCode;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    // Generic error — never echo token, URL, or body to caller.
    // eslint-disable-next-line no-console
    console.error(`[meta-capi] ${res.status} ${res.statusText}`);
    throw new Error("meta-capi: send failed");
  }
}
