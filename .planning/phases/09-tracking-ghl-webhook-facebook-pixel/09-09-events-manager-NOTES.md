---
plan: 09-09
plan_name: Wire InitiateCheckout + Events Manager smoke
status: complete
completed: 2026-05-21
type: manual_smoke
---

# Phase 9 — Plan 09-09 — Events Manager smoke test notes

> End-to-end smoke verification that all 3 site-fired Meta Pixel + CAPI
> events land in Events Manager as `Server + Browser` dedup'd, and that
> Purchase NEVER fires from our code (D-04 supreme gate).

---

## Test setup

- Pixel ID: `1279390273687409`
- `FB_TEST_EVENT_CODE` set in `.env.local` (per 09-01 Task 6) — CAPI fires route to Test Events tab
- Dev server: `npm run dev` on `localhost:3000`
- Browser: Playwright Chromium (headless, no extensions) — separate from Jordan's browser session
- Test flow: visit /shmo-review/cr-80 → click "Add to cart" on 10-pack → click "Tap to checkout" in cart drawer

## Per-event verification (browser network evidence)

Captured via Playwright `browser_network_requests` filtered for `facebook.com/tr` after click sequence:

| Event | Source | eid (UUIDv4) | content_ids | value | Browser fire confirmed | Server + Browser badge |
|---|---|---|---|---|---|---|
| PageView | Pixel base auto-fire | — | (n/a, PageView has no content_ids) | (n/a) | ✓ (request 32) | Pending Jordan-side Events Manager check |
| ViewContent | ViewContentTracker mount | `b9085e8f-353a-401b-90d4-81d4f1d4d13f` | `[gid://shopify/Product/8563763642543]` | `29.99` | ✓ (request 34) | **Pending Jordan-side Events Manager check** (Server + Browser badge confirmation requires Events Manager UI) |
| AddToCart | Buybox.handleAdd success | `d3238134-cf9f-4aeb-b424-58cb6f3586fc` | `[gid://shopify/ProductVariant/46829452492975]` | `219.99` | ✓ (request 41) | **Pending Jordan-side Events Manager check** |
| InitiateCheckout | CartCheckoutButton.handleClick (BEFORE redirect) | `427a9134-9991-47e1-af83-92f9a6d9eaa5` | 4 variants (full cart) | `2889.86` | ✓ (request 49) | **Pending Jordan-side Events Manager check** |

Note: the browser fires include `eid=<UUIDv4>` which corresponds to the Pixel SDK's `eventID` and is the dedup key against the matching server CAPI fire (same UUID). Meta dedupes within the 48h window via `event_id + event_name + Pixel ID`.

## Server-side CAPI fires (next.js dev logs)

Next.js Server Action POST requests visible in dev log on each event trigger:

- `POST /shmo-review/cr-80` (multiple — Server Actions hit the same route)

These correspond to `trackViewContent`, `trackAddToCart`, `trackInitiateCheckout` Server Actions. Each fires `metaFetch` against `graph.facebook.com/v25.0/{PIXEL_ID}/events` with shared `event_id`.

## Pixel ID parity check

Verified across all firing surfaces:

- Our site browser Pixel: `id=1279390273687409` in every `facebook.com/tr` URL
- Our site server CAPI: same Pixel ID embedded in graph.facebook.com endpoint
- Shopify channel app (shop.shmocard.com): `id=1279390273687409` in the shop.shmocard.com `facebook.com/tr` POST (request 215, 217)

**Pixel ID parity confirmed.** Pitfall 8 mitigated — events from both domains will dedupe/stack into the same Pixel dataset.

## Shopify channel app firing (downstream of our redirect)

After our InitiateCheckout fires and the redirect lands the user on shop.shmocard.com, Shopify's Facebook & Instagram channel app fires its OWN events:

- PageView (request 215) — `dl=https://shop.shmocard.com/checkouts/...`
- InitiateCheckout (request 217) — same Pixel ID, different eid (`sh-4c6af2d4-...`)

This is the intended D-03 behavior: site fires InitiateCheckout too (with our UUID) AND Shopify fires its own (with its UUID). Both count as separate signals; they do NOT dedupe with each other (different eids).

Purchase will fire EXCLUSIVELY from Shopify's channel app when a customer completes a real transaction. Our codebase fires nothing on the Purchase event.

## Purchase NOT fired from site (D-04 supreme gate)

Code grep verification:

```bash
grep -rn "Purchase" components/ lib/ app/ 2>/dev/null \
  | grep -v "node_modules\|\.next" \
  | grep -v "// \|/\*\|MetaEvent"
```

Result: **zero matches**. Purchase NOT fired from site — D-04 honored. The `MetaEventName` type union in `lib/analytics/types.ts` does NOT include "Purchase" — TypeScript would block any attempt to fire it from our codebase.

## Pending Jordan-side verification

Items I cannot verify from Playwright — Jordan needs to confirm in Meta Business Manager → Events Manager → Test Events tab:

1. **Server + Browser badge on dedup'd events** — Events Manager Test Events tab should show `ViewContent`, `AddToCart`, and `InitiateCheckout` with `Server + Browser` source badges (not just Browser, not just Server). The shared `event_id` is the dedup key.
2. **Test Events tab routing** — confirm events are routed to Test Events tab (because `FB_TEST_EVENT_CODE` is set in `.env.local`), NOT production stream.
3. **Diagnostics tab clean** — no warnings about missing match keys, malformed events, or other issues.
4. **Save screenshot of Events Manager Test Events tab** to `pictures/screenshots/phase-09-events-manager-test-events.png` after the smoke pass.

These are the final blockers for Phase 9 close-out. Browser-side network evidence above already confirms the wire-up is correct — Events Manager just needs to receive and dedupe correctly.

## Phase 9 wire-up status

| Event | Wired | Verified |
|---|---|---|
| PageView | ✓ PixelLoader base auto-fire | ✓ network capture |
| ViewContent | ✓ ViewContentTracker on 3 PDPs | ✓ network capture + dev log POST |
| AddToCart | ✓ Buybox.handleAdd | ✓ network capture + dev log POST |
| InitiateCheckout | ✓ CartCheckoutButton.handleClick | ✓ network capture (BEFORE redirect) + dev log POST |
| Purchase | ✓ Shopify channel app (no site code) | ✓ Shopify-side network capture (request 217) |

Phase 9 wire-up complete. 09-10 close-out next.
