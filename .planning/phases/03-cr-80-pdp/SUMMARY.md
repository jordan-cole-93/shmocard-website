---
phase: 03-cr-80-pdp
phase_number: 3
phase_name: CR-80 PDP
status: complete
completed: "2026-05-20"
---

# Phase 3 — CR-80 PDP — SUMMARY

## What shipped

`/shmo-review/cr-80` — full product detail page for the CR-80 wallet-size NFC Google review card. Renders end-to-end at desktop + 375px mobile with no console errors and `tsc --noEmit` clean.

**Final page composition (top → bottom):**

1. **Buybox** (`components/shmo-review/Buybox.tsx`) — kept as-is per 2026-05-17 decision. No refactor; no fork. Shared with `/shmo-review` family page. Bg: marsh.
2. **Proof** (`components/shmo-review/cr-80/Proof.tsx`) — verified review-volume stats from `marketing.md` proof points + verbatim testimonial. Bg: cream (changed from graham 2026-05-18 per Jordan).
3. **CrewStrip** (reused from homepage) — added 2026-05-17 to land bulk-math argument visually. Bg: cream → marsh.
4. **ProofTiles** (stats grid under CrewStrip).
5. **VideoTestimonials** (reused from homepage) — added 2026-05-17.
6. **HowItWorks** (reused from homepage, restructured 2026-05-19) — flipped from single sticky-stack to 4 alternating full-width cream/marsh sections. Replaced the originally planned bespoke `SetupSteps.tsx`.
7. **FinalCta** (`components/shmo-review/cr-80/FinalCta.tsx`) — ember high-emphasis CTA per page rotation rule. Bg: ember → cocoa (footer).

## What didn't ship (deferred to Phase 4 / 5)

- **Why CR-80 section** — built (`d27e72a`), redesigned (`1b0c650`), then dropped per Jordan's call (`6136137`). Bulk-math argument carried by CrewStrip + Proof instead.
- **Product Details section** (03-06) — specs / NFC / QR. Deferred. Specs currently live inside the Buybox FAQ rows.
- **Format Compare section** (03-07) — CR-80 vs L-Sign vs Square. Deferred until L-Sign + Square Card PDPs exist (Phase 4 + 5).
- **Dedicated FAQ section** (03-08) — FAQ currently lives inside the Buybox component. Standalone section deferred.

## Mobile + CRO polish (2026-05-18 → 2026-05-20)

- Buybox section-head + free-shipping + Configure blocks removed.
- Buybox vertical rhythm tightened (90px → 40px padding; 130px → 40px nav-to-gallery gap).
- Pack-row selector: SAVE badge repositioned under pack name, mobile heights equalized to 96px uniform, shipping note hidden < 640px.
- HowItWorks restructured to 4 alternating cream / marsh sections; framer-motion removed.
- CrewStrip `nextBg` flipped marsh → cream to fit new rotation.

## Out-of-plan deliverables

Two CRO research artifacts produced at the end of the phase:

- **Paid-traffic CRO plan** — research-backed implementation roadmap for cold ad traffic landing on the buybox.
- **Competitor selector teardown** — element-by-element analysis with wave-prioritized recommendations.

These inform Phase 4 (L-Sign PDP) opening moves and any pre-launch CRO wave.

## Architecture decision locked

`/shmo-review` is the **category / family page** for all Shmo Review formats. Each format also gets its own PDP (`/shmo-review/cr-80`, `/shmo-review/l-sign`, `/shmo-review/square-card`). This supersedes the 2026-05-11 "single-page-with-anchors" decision. Recorded in `PROJECT.md` 2026-05-16.

## What's next

- **Phase 4** — L-Sign PDP (`/shmo-review/l-sign`). Duplicate CR-80 pattern with L-Sign-specific copy + imagery.
- **Phase 5** — Square Card PDP (`/shmo-review/square-card`). Same pattern.
- **Phase 6** — Shopify Storefront wiring. Replace all `TODO(shopify):` placeholders with real Storefront API queries; wire cart + checkout redirect.
- **Phase 7** — Tracking & link hygiene (NEW — not yet in ROADMAP.md). Button link audit, GHL webhook, Facebook Pixel, Coming Soon pages for unbuilt links.
- **Phase 8** — Launch readiness (was Phase 7). Mobile pass, a11y, Vercel env, DNS cutover to `shmocard.com`.

## Atomic plans status

| Plan | Status | Notes |
|---|---|---|
| 03-01 — Buybox audit | ✅ | Audit returned PASS — kept as-is. |
| 03-02 — Buybox checkpoint | ✅ | Jordan approved 2026-05-17. |
| 03-03 — Proof section | ✅ | Shipped 2026-05-17 (`5c82c0e`). Bg later changed to cream. |
| 03-04 — Why CR-80 | ❌ Dropped | Built + redesigned + removed (`d27e72a` → `1b0c650` → `6136137`). |
| 03-05 — Setup steps | 🔁 Replaced | Bespoke SetupSteps built (`b30554a`) then replaced with HowItWorks reuse (`e67d5c3`). |
| 03-06 — Product details | ⏭ Deferred | Specs in Buybox FAQ; standalone section deferred. |
| 03-07 — Format compare | ⏭ Deferred | Waits on Phase 4 + 5. |
| 03-08 — FAQ | ⏭ Deferred | FAQ lives in Buybox for now. |
| 03-09 — Final CTA | ✅ | Shipped 2026-05-20 (`6bac94a` mount, `a887bf4` padding polish). |
| 03-10 — Mobile + a11y pass | ✅ | Shipped 2026-05-20 (`e0b5136`). Pack-row mobile CRO, buybox cleanup, HowItWorks restructure. |
| Out-of-plan | ✅ | CrewStrip, ProofTiles, VideoTestimonials reused from homepage. |
| Out-of-plan | ✅ | Paid-traffic CRO plan + competitor selector teardown. |

## Exit criteria check

- [x] `/shmo-review/cr-80` renders full PDP, no console errors, desktop + mobile.
- [x] Every shipped section audited by `design-system-builder` workflow (builder dispatched per plan).
- [x] Full-page screenshots in `pictures/screenshots/`.
- [x] STATE / handoff updated.
- [ ] Product Details + Format Compare + standalone FAQ — explicitly deferred, not blocking phase close.

Phase 3 closed 2026-05-20.
