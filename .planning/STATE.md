---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: launch
status: planning
last_updated: "2026-05-20T20:20:00+02:00"
last_activity: "2026-05-20 — Phase 8 (Shopify Storefront wiring) complete. All 3 PDPs now fetch live Shopify data via getProductByHandle + mapProductToBuyboxProps. Buybox.handleAdd wires real addLineToCart; 6 TODO(shopify) markers cleared. End-to-end discount code support shipped (CR8020OFF tested). Checkout redirect verified to shop.shmocard.com. 2 Shopify Admin bugs surfaced for Jordan (L-Sign duplicate variants, Square Card naming mismatch — accepted). Webhooks deferred to Phase 10. Next: Phase 9 (Tracking — GHL webhook + Facebook Pixel + Conversions API)."
progress:
  total_phases: 10
  completed_phases: 9
  total_plans: 9
  completed_plans: 9
  percent: 90
---

# Project State

## Project Reference

See: `.planning/PROJECT.md` and `context/general/scope.md`.

**Core value:** First-time visitor leaves understanding the parent brand and either buys (Shmo Review) or joins a waitlist (other three) — without ever feeling pitched to.

**Current focus:** Phase 9 — Tracking. Wire GHL webhook + Facebook Pixel + Conversions API. Pixel events fire on the cart/checkout actions that just got wired in Phase 8.

## Current Position

Phase: 9 of 10 (Tracking — ready for `/gsd-plan-phase 9`)
Status: Phase 8 complete 2026-05-20; planning Phase 9 next
Last activity: 2026-05-20 — Phase 8 close-out

Progress: [█████████░] 90%

**Completed phases:** 1 (Docs refresh), 2 (Design system review), 3a (Homepage + /shmo-review category), 3 (CR-80 PDP), 4 (Link hygiene & Coming Soon stubs), 5 (L-Sign PDP), 6 (Square Card PDP + FormatCompare), 7 (Cross-PDP mobile polish), 8 (Shopify Storefront wiring).
**Remaining phases:** 9 (Tracking — GHL + FB Pixel), 10 (Launch readiness — DNS cutover + webhooks).

## Notes

- Site is FULLY FUNCTIONAL as a Shopify-powered storefront. All 3 PDPs fetch live data, real cart works, checkout redirects to Shopify-hosted page. Discount codes work end-to-end.
- 2 known issues to address in Shopify Admin (Jordan's task — no code work needed):
  - L-Sign has 8 variants (4 duplicated). Delete duplicates in Shopify → buybox auto-corrects.
  - Square Card product named "Plate" in Shopify. Accepted by Jordan — Shopify name wins.
- Webhooks deferred to Phase 10 — need public URL (no Vercel deploy yet per Jordan's rule).
- Phase 9 will install Facebook Pixel + Conversions API + wire GHL webhook for order sync.
