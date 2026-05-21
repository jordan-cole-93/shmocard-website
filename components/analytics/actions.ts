"use server";

import { headers } from "next/headers";

import { metaFetch } from "@/lib/analytics/meta-capi";
import type { MetaCustomData, MetaEventName } from "@/lib/analytics/types";

// Meta CAPI Server Actions — one per Phase 9 event.
//
// Security posture:
// - import "server-only" is enforced via metaFetch's import.
// - client_ip_address + client_user_agent come from request headers
//   (next/headers) — NEVER from client-supplied args. The headers may
//   still be spoofed at the network edge, but that's true of any IP/UA
//   tracking; documented in 09-PLAN.md threat model.
// - eventSourceUrl validated against http(s):// prefix + 2048 char cap.
// - All Meta API errors caught and rethrown as generic — never echo
//   Meta's error body to the browser (Phase 8 applyDiscountCode precedent).
// - fbp / fbc forwarded as plain strings from the client (cookies are
//   non-httpOnly; client reads via document.cookie and passes them along).

const MAX_EVENT_SOURCE_URL = 2048;
const FBP_FBC_PATTERN = /^fb\.\d+\.\d+\..+$/; // fbp/fbc format: fb.<subdomain-idx>.<timestamp>.<token>

type TrackInput = {
  params: MetaCustomData;
  eventId: string;
  eventSourceUrl: string;
  fbp?: string;
  fbc?: string;
};

function validateEventSourceUrl(url: string): string {
  if (typeof url !== "string") throw new Error("invalid eventSourceUrl");
  if (url.length === 0 || url.length > MAX_EVENT_SOURCE_URL) {
    throw new Error("invalid eventSourceUrl");
  }
  if (!/^https?:\/\//.test(url)) throw new Error("invalid eventSourceUrl");
  return url;
}

function validateFbpFbc(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "string") return undefined;
  if (!FBP_FBC_PATTERN.test(value)) return undefined;
  return value;
}

async function buildUserData(input: {
  fbp?: string;
  fbc?: string;
}): Promise<{
  client_ip_address?: string;
  client_user_agent?: string;
  fbp?: string;
  fbc?: string;
}> {
  const h = await headers();
  return {
    client_ip_address:
      h.get("x-forwarded-for")?.split(",")[0].trim() ||
      h.get("x-real-ip") ||
      undefined,
    client_user_agent: h.get("user-agent") || undefined,
    fbp: validateFbpFbc(input.fbp),
    fbc: validateFbpFbc(input.fbc),
  };
}

async function fireMetaEvent(
  eventName: MetaEventName,
  input: TrackInput,
): Promise<void> {
  try {
    const sourceUrl = validateEventSourceUrl(input.eventSourceUrl);
    await metaFetch({
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: input.eventId,
      event_source_url: sourceUrl,
      action_source: "website",
      user_data: await buildUserData({ fbp: input.fbp, fbc: input.fbc }),
      custom_data: input.params,
    });
  } catch (e) {
    // Generic error — never echo Meta error or validation detail.
    // Server-side log only.
    // eslint-disable-next-line no-console
    console.error(`[analytics] ${eventName} fire failed`, e);
    // DO NOT rethrow — fire-and-forget posture (Pitfall 10).
  }
}

export async function trackViewContent(input: TrackInput): Promise<void> {
  await fireMetaEvent("ViewContent", input);
}

export async function trackAddToCart(input: TrackInput): Promise<void> {
  await fireMetaEvent("AddToCart", input);
}

export async function trackInitiateCheckout(input: TrackInput): Promise<void> {
  await fireMetaEvent("InitiateCheckout", input);
}
