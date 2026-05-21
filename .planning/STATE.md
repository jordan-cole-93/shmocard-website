---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: launch
status: planning
last_updated: "2026-05-22T01:20:00+02:00"
last_activity: "2026-05-22 — Phase 9 complete. Meta Pixel + CAPI dual-fire wired for ViewContent + AddToCart + InitiateCheckout across 3 PDPs + cart drawer. PageView auto-fires from Pixel base. Purchase owned by Shopify channel app on shop.shmocard.com (D-04). GHL order webhook configured Admin-side per D-05. Shared UUIDv4 event_id pairs browser Pixel and server CAPI for dedup. Pixel ID 1279390273687409 parity across both domains. Live-verified via Playwright network capture + Jordan-side Pixel Helper. Plus mid-phase fix: category-page Buybox now wired to live CR-80 Shopify product (was using DEFAULT_BUYBOX_PACKS with no variantId, ATC broken). Next: Phase 10 (launch readiness — Vercel env + DNS cutover)."
progress:
  total_phases: 10
  completed_phases: 9
  total_plans: 10
  completed_plans: 10
  percent: 90
---

# Project State

## Project Reference

See: `.planning/PROJECT.md` and `context/general/scope.md`.

**Core value:** First-time visitor leaves understanding the parent brand and either buys (Shmo Review) or joins a waitlist (other three) — without ever feeling pitched to.

**Current focus:** Phase 10 — Launch readiness. Vercel env var setup (NEXT_PUBLIC_FB_PIXEL_ID + FB_CAPI_ACCESS_TOKEN — NOT FB_TEST_EVENT_CODE per Pitfall 5), Shopify webhook for cache revalidation, DNS cutover from `shop.shmocard.com` to `shmocard.com`. Highest blast radius — gated on Jordan's full design + tracking sign-off.

## Current Position

Phase: 10 of 10 (Launch readiness — ready for `/gsd-plan-phase 10`)
Status: Phase 9 complete 2026-05-22; planning Phase 10 next
Last activity: 2026-05-22 — Phase 9 close-out (Tracking — Meta Pixel + CAPI + GHL)

Progress: [█████████░] 90%

**Completed phases:** 1 (Docs refresh), 2 (Design system review), 3a (Homepage + /shmo-review category), 3 (CR-80 PDP), 4 (Link hygiene & Coming Soon stubs), 5 (L-Sign PDP), 6 (Square Card PDP + FormatCompare), 7 (Cross-PDP mobile polish), 8 (Shopify Storefront wiring), 9 (Tracking — Meta Pixel + CAPI + GHL Admin webhook).
**Remaining phases:** 10 (Launch readiness — Vercel env + DNS cutover + Shopify revalidation webhook).

## Notes

- Phase 9 wired Meta Pixel + Conversions API dual-fire for 3 events (ViewContent, AddToCart, InitiateCheckout) with shared UUIDv4 event_id for dedup. PageView auto-fires from Pixel base. Purchase fires from Shopify's Facebook & Instagram channel app (D-04 — never from our code). All events use same Pixel ID `1279390273687409` across both domains.
- GHL order webhook configured Shopify Admin → Notifications → Webhooks → Order creation → JSON → Jordan's GHL inbound URL. Zero site code per D-05.
- Phase 9 ships INDEPENDENT of Vercel deploy. All work verified on localhost. Phase 10 is when production env + DNS happens.
- Site is FULLY FUNCTIONAL as a Shopify-powered storefront with full ad tracking ready. All 3 PDPs + category page fetch live Shopify data, real cart works, checkout redirects to Shopify-hosted page, discount codes work, all 4 funnel events fire.
- 2 known issues to address in Shopify Admin (Jordan's task — no code work needed):
  - L-Sign has 8 variants (4 are duplicates of the 2 color tiers ✓ ACCEPTED — they're 2 colors × 4 qty tiers; the color × qty matrix UI in the Buybox handles this).
  - Square Card product named "Plate" in Shopify. Accepted by Jordan — Shopify name wins.
- Phase 10 admin gate: Jordan must add `NEXT_PUBLIC_FB_PIXEL_ID` + `FB_CAPI_ACCESS_TOKEN` to Vercel project env (NOT `FB_TEST_EVENT_CODE` — that stays dev-only per Pitfall 5).
