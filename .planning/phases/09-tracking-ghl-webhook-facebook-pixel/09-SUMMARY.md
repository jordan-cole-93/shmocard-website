---
phase: 09-tracking-ghl-webhook-facebook-pixel
phase_number: 9
phase_name: Tracking — GHL webhook + Facebook Pixel
status: complete
completed: "2026-05-22"
---

# Phase 9 — Tracking — GHL webhook + Facebook Pixel — SUMMARY

## What shipped

1. **Admin gate completed** (09-01). Pixel `1279390273687409` created in Meta Business Manager and connected to Shopify's Facebook & Instagram sales channel app. Customer events data sharing set to "Maximum" (NOT the Jan 2026 default "Optimized" which suppresses CAPI). Pixel ID parity confirmed across both domains (Pitfall 8 supreme gate). CAPI access token + Test Event Code generated and pasted into `.env.local`. GHL inbound webhook configured directly in Shopify Admin → Settings → Notifications → Webhooks → `Order creation` → JSON → Jordan's GHL URL (D-05: zero site code).

2. **Backend env var contract documented** (09-02). `context/general/backend.md` now has a "Phase 9 Meta Pixel + Conversions API env vars (contract)" subsection documenting the 3 new vars (`NEXT_PUBLIC_FB_PIXEL_ID`, `FB_CAPI_ACCESS_TOKEN`, `FB_TEST_EVENT_CODE`) with Pitfall 5 (production safety) and Pitfall 8 (Pixel ID parity) rules. `.env.local.example` deliberately not shipped per existing project convention — backend.md IS the contract.

3. **Server-side analytics module** (09-03). 4 new files under `lib/analytics/`:
   - `types.ts` — `MetaEventName`, `MetaEventPayload`, `MetaUserData`, `MetaCustomData`, `MetaCAPIResponse`. `MetaEventName` union excludes `Purchase` — TypeScript blocks any attempt to fire Purchase from our code (D-04 supreme gate enforced at type level).
   - `hash.ts` — server-only SHA-256 via `node:crypto`. No new npm deps.
   - `event-id.ts` — isomorphic `generateEventId()` wrapping `crypto.randomUUID()`.
   - `meta-capi.ts` — server-only `metaFetch` helper, POSTs to Graph API v25.0 with `FB_CAPI_ACCESS_TOKEN`. Mirror of `lib/shopify/index.ts` `shopifyFetch` pattern.

4. **Client-side fbq wrapper + ambient types** (09-04). `lib/analytics/fbq.ts` (`trackPixelEvent`) typed wrapper around `window.fbq` with SSR guard + silent no-op when script not loaded. `app/global.d.ts` ambient `Window.fbq` declaration with `FbqFn` interface (init/track/trackCustom/consent overloads).

5. **PixelLoader component + root layout mount** (09-05). `components/analytics/PixelLoader.tsx` uses `next/script` with `strategy="afterInteractive"`. Reads `NEXT_PUBLIC_FB_PIXEL_ID`; returns null if unset (graceful degradation). Inline canonical Meta init snippet — auto-fires the initial PageView (no separate `useEffect` PageView call — Pitfall 1).

6. **CAPI Server Actions** (09-06). `components/analytics/actions.ts` with `trackViewContent`, `trackAddToCart`, `trackInitiateCheckout` Server Actions. Each takes typed payload + shared `eventId` + optional `fbp`/`fbc` cookies from client. Reads `client_ip_address` + `client_user_agent` from `headers()`. Generic error catch — never echoes Meta error to client (Phase 8 `applyDiscountCode` precedent). `test_event_code` conditional only when `FB_TEST_EVENT_CODE` env truthy.

7. **ViewContent dual-fire on 3 PDPs** (09-07). `components/analytics/ViewContentTracker.tsx` client child component, returns null, fires both browser `fbq` + server CAPI on mount with shared UUIDv4 event_id. Reads `fbp`/`fbc` from `document.cookie`. Idempotent via `useRef` guard. Mounted in all 3 PDPs (`/shmo-review/cr-80`, `/l-sign`, `/square-card`) inside `<main>` conditional on Shopify product presence. **Race-condition fix:** poll for `window.fbq` with 5s budget — `next/script` `afterInteractive` can leave `window.fbq` undefined briefly after hydration; original plan code with `firedRef = true` BEFORE the fbq call would silently no-op forever. Fixed to set `firedRef` only after fbq attempt succeeds OR budget elapses.

8. **AddToCart dual-fire in Buybox.handleAdd** (09-08). After `addLineToCart` success, generates one UUIDv4 event_id and fires both browser fbq + server CAPI with the variant ID + value + currency. Fire-and-forget — never blocks ATC UX (Pitfall 10). Same race-fix pattern as ViewContentTracker.

9. **Category-page Buybox wired to live CR-80 product** (one-off fix between 09-08 and 09-09). Phase 8 only wired the 3 PDPs; the `/shmo-review` category page Buybox was still using `DEFAULT_BUYBOX_PACKS` with no variantId, so ATC there hit a soft error. Wired to CR-80 (best-seller default) via `getProductByHandle` so visitors who decide on the category page can buy without navigating to a PDP.

10. **InitiateCheckout dual-fire in CartCheckoutButton** (09-09). Browser fbq + server CAPI fire BEFORE `setIsNavigating` and `assertCheckoutUrl` redirect (Pitfall 10: server action dispatches before the tab commits to navigating, server-side request completes independent of tab tear-down). Payload built from full cart state (content_ids, contents, value summed across all lines). Adapted from plan code per plan-checker warning: cart store uses `line.merchandiseId` not `line.variantId`, and `line.price` is a string requiring `Number()` cast.

## Live verification

End-to-end smoke via Playwright network capture:
- PageView fires on every page load (Pixel base auto-fire)
- ViewContent fires on each PDP mount with `eid` UUIDv4 + content_ids + value
- AddToCart fires on Buybox ATC success with variant GID + cart-line shape + value
- InitiateCheckout fires on cart checkout button click BEFORE redirect with full-cart content_ids + value
- Shopify channel app then fires its own PageView + InitiateCheckout from `shop.shmocard.com` checkout with SAME Pixel ID `1279390273687409` (D-03 dual-signal architecture confirmed)
- Zero `Purchase` references in code (D-04 supreme gate honored)
- All grep / acceptance criteria pass per plan
- `npx tsc --noEmit` clean
- `npm run build` clean

Jordan-side verification with Pixel Helper Chrome extension: ✓ confirmed events fire on all surfaces (ad blocker was the initial blocker — disabled to verify).

## Atomic plans status

| Plan | Status | Commit | Notes |
|---|---|---|---|
| 09-01 — Admin gate | ✅ | `ff8d131` | Pixel + token + channel app + data sharing + GHL webhook all configured by Jordan |
| 09-02 — Backend docs | ✅ | `d09e887` | Env var contract added to backend.md (Pitfall 5 + 8 documented) |
| 09-03 — Analytics scaffolding | ✅ | `c71ee5e` | 4 new files under `lib/analytics/`; server-only guards |
| 09-04 — Client fbq wrapper | ✅ | `703806d` | `lib/analytics/fbq.ts` + `app/global.d.ts` |
| 09-05 — PixelLoader + layout mount | ✅ | `8667491` | `components/analytics/PixelLoader.tsx` + `<PixelLoader />` in layout |
| 09-06 — CAPI Server Actions | ✅ | `ef0fad7` | `components/analytics/actions.ts` (3 actions) |
| 09-07 — ViewContent dual-fire | ✅ | `6ff1890` | `ViewContentTracker.tsx` + 3 PDP mounts; race-fix shipped |
| 09-08 — AddToCart dual-fire | ✅ | `b90cadf` | `Buybox.handleAdd` extended |
| _Category-page fix_ | ✅ | `232f72d` | `app/shmo-review/page.tsx` wired to CR-80 Shopify product |
| 09-09 — InitiateCheckout + smoke | ✅ | `8a83ec7` | `CartCheckoutButton.handleClick` extended; smoke notes |
| 09-10 — Phase close-out | ✅ | _this commit_ | Final docs sweep |

## Locked decisions honored

- **D-01 split-domain Pixel** ✓ — Site fires ViewContent/AddToCart/InitiateCheckout; Shopify channel app fires Purchase + checkout-side InitiateCheckout
- **D-02 dual-fire with shared event_id** ✓ — Browser Pixel + server CAPI both fire for the 3 site events with shared UUIDv4
- **D-03 site fires InitiateCheckout too** ✓ — Both our InitiateCheckout (eid 427a9134-...) and Shopify's (eid sh-4c6af2d4-...) confirmed in network capture
- **D-04 Purchase NEVER from our code** ✓ — Zero grep matches, MetaEventName type union excludes Purchase
- **D-05 GHL via Shopify Admin direct** ✓ — Zero site code; configured in Shopify Admin Webhooks
- **D-06 no /api/ghl-* route** ✓ — Zero files modified under `app/api/ghl-*`
- **D-07 standard 4 events only** ✓ — No custom events
- **D-08 UUIDv4 event_id** ✓ — `crypto.randomUUID()` via `lib/analytics/event-id.ts`
- **D-09 FB_TEST_EVENT_CODE dev only** ✓ — Set in `.env.local`, NOT in any Vercel env (no Vercel deploy yet anyway)
- **D-10 Events Manager verification** ✓ — Jordan confirmed via Pixel Helper (ad blocker had been blocking initially)
- **D-11 3 new env vars documented in backend.md FIRST** ✓ — Plan 09-02 preceded any code reference

## What didn't ship (deferred)

- **Cookie consent banner / GDPR compliance** — Phase 9 fires Pixel unconditionally. If France/EU traffic becomes meaningful, add consent gate in a future phase.
- **Custom events beyond standard 4** (AddPaymentInfo, Lead, CompleteRegistration) — out of scope per D-07.
- **fbp/fbc cookie passthrough to Shopify cart attributes** — RESEARCH.md OQ #1. Channel app's behavior here is undocumented; defer to post-launch re-evaluation with real Match Quality scores.
- **TikTok Pixel, Google Ads conversion tag, LinkedIn Insight Tag** — Meta-only this phase.
- **Site-side webhook proxy for GHL** — rejected in D-05.

## Build verification

- `npx tsc --noEmit` — clean ✓
- `npm run build` — clean, all routes statically generated ✓
- Dev server smoke (with FB_TEST_EVENT_CODE set): all routes return 200; PageView + ViewContent + AddToCart + InitiateCheckout firing as designed; no console errors

## Exit criteria

All Phase 9 exit criteria met:

- [x] PageView fires from Pixel base on every page load
- [x] ViewContent fires on PDP mount (3 PDPs)
- [x] AddToCart fires on Buybox.handleAdd success
- [x] InitiateCheckout fires on CartCheckoutButton click BEFORE Shopify redirect
- [x] All 3 site events dual-fire (browser Pixel + server CAPI) with shared UUIDv4 event_id
- [x] Shopify channel app fires Purchase + checkout-side events (independent of our code)
- [x] Pixel ID parity across both domains (1279390273687409 everywhere)
- [x] Zero Purchase fires from our code (D-04 supreme gate)
- [x] FB_CAPI_ACCESS_TOKEN server-only (import "server-only" enforced)
- [x] Generic errors only — Meta CAPI failures never echo to client
- [x] FB_TEST_EVENT_CODE in `.env.local` ONLY (not in any production env)
- [x] No new npm deps
- [x] tsc clean + build clean

Phase 9 closed. Phase 10 (launch readiness — Vercel env + DNS cutover) ready when Jordan signs off on full design + Phase 9 in production.
