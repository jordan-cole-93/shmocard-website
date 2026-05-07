// lib/waitlist.ts — Server Action for waitlist captures (Shmo Biz / Link / Reputation).
//
// REQ-08 — capture interest emails for the three coming-soon sub-brands.
//
// Flow:
//   1. Honeypot check ('company_website' hidden field). Bots fill, humans don't.
//      If filled → return { ok: true } and DO NOT forward to GHL.
//   2. Email regex validation (server-side; never trust the client).
//   3. Product allowlist validation ('biz' | 'link' | 'reputation').
//      'review' is intentionally NOT allowed — Shmo Review routes to /shmo-review.
//   4. POST to GHL_WAITLIST_WEBHOOK_URL when configured.
//      When unset (D-04 deferred) → log structured event server-side, return
//      { ok: true } so the UI shows graceful success. The env-var status NEVER
//      leaks to the client (T-03-10-04).
//
// Threat mitigations (per plan threat_model):
//   T-03-10-01: honeypot guard
//   T-03-10-02: email regex
//   T-03-10-03: ALLOWED_PRODUCTS allowlist
//   T-03-10-04: webhook-unconfigured logged server-side only (UI sees ok:true)
//   T-03-10-06: server generates submitted_at, never accepts from client
//
// Design system: this file has no UI surface — pure server logic.

"use server";

const ALLOWED_PRODUCTS = new Set(["biz", "link", "reputation"] as const);

// RFC 5322-compatible-enough email regex. Single field, no need for zod dep.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type WaitlistResult =
  | { ok: true }
  | { ok: false; error: "invalid-email" | "invalid-product" | "webhook-failed" | "webhook-unreachable" };

export async function submitWaitlist(formData: FormData): Promise<WaitlistResult> {
  // 1. Honeypot — bots fill 'company_website', humans never see the field.
  //    Return ok without any further processing or webhook forward.
  const honeypot = formData.get("company_website");
  if (honeypot && String(honeypot).trim().length > 0) {
    return { ok: true };
  }

  // 2. Email validation.
  const email = String(formData.get("email") ?? "").trim();
  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, error: "invalid-email" };
  }

  // 3. Product allowlist.
  const product = String(formData.get("product") ?? "").trim();
  if (!ALLOWED_PRODUCTS.has(product as "biz" | "link" | "reputation")) {
    return { ok: false, error: "invalid-product" };
  }

  // 4. GHL webhook forward — gracefully degrade if URL unset (D-04 deferred).
  const url = process.env.GHL_WAITLIST_WEBHOOK_URL;
  if (!url) {
    // Log server-side only — never expose env-var status in the client response.
    console.warn(
      `[waitlist] GHL_WAITLIST_WEBHOOK_URL not configured — captured locally only ` +
        `(product=${product})`,
    );
    return { ok: true };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        product,
        // Server-generated. Client cannot supply (T-03-10-06).
        submitted_at: new Date().toISOString(),
      }),
      // No-store: this is a one-shot mutation, never cache.
      cache: "no-store",
    });
    if (!res.ok) {
      console.warn(`[waitlist] webhook returned non-ok status=${res.status}`);
      return { ok: false, error: "webhook-failed" };
    }
    return { ok: true };
  } catch (err) {
    console.warn(`[waitlist] webhook unreachable: ${(err as Error).message}`);
    return { ok: false, error: "webhook-unreachable" };
  }
}
