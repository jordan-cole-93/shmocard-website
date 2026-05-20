# Roadmap: Shmocard Website

## Overview

Bare Next.js + Tailwind shell → audited design system → homepage + /shmo-review category → CR-80 PDP → link hygiene + Coming Soon stubs → L-Sign PDP → Square Card PDP → cross-PDP mobile polish → Shopify Storefront wiring → tracking (GHL + FB Pixel) → launch on `shmocard.com`. Source of truth for current state: `context/general/scope.md` + `handoff.md`.

## Phases

- [x] **Phase 1: Docs refresh** — Bring every `.md` file into alignment with the post-wipe reality. Complete 2026-05-07.
- [x] **Phase 2: Design system review** — Audited `.claude/skills/shmocard-design-system/`, locked structural moves, locked Tailwind 4 ↔ `.shm-*` integration, locked reference-page translation map. Complete 2026-05-07.
- [x] **Phase 3a: Homepage + /shmo-review category** — Tokens, base layout, homepage, /shmo-review category/family page. Complete 2026-05-16 (handoff.md).
- [x] **Phase 3: CR-80 PDP** — Build `/shmo-review/cr-80` product detail page from scratch. Complete 2026-05-20 (SUMMARY.md).
- [x] **Phase 4: Link hygiene & Coming Soon stubs** — Audit every CTA / nav / footer link on built pages; stub `/shmo-review/l-sign`, `/shmo-review/square-card`, `/shmo-biz`, `/shmo-link`, `/shmo-reputation` as Coming Soon pages so nothing 404s. Complete 2026-05-20 (SUMMARY.md).
- [x] **Phase 5: L-Sign PDP** — Build `/shmo-review/l-sign` product detail page using patterns established in Phase 3. Replaces the Phase 4 Coming Soon stub. Complete 2026-05-20 (SUMMARY.md).
- [x] **Phase 6: Square Card PDP + FormatCompare section** — Build `/shmo-review/square-card` product detail page using patterns from Phases 3 + 5; ships new shared `<FormatCompare>` component mounted on all 3 PDPs. Complete 2026-05-20 (SUMMARY.md).
- [x] **Phase 7: Cross-PDP mobile polish** — One pass across all 3 PDPs at 375 / 414 / 768 px. LAYOUT IS LOCKED — spacing / type / mascot only. Run before Shopify wiring so layout fights stay against placeholder data, not real Shopify strings. Complete 2026-05-20 (SUMMARY.md).
- [ ] **Phase 8: Shopify Storefront wiring** — Replace placeholder product data with live Storefront API queries; wire cart + checkout redirect. Read-only Admin (no mutations).
- [ ] **Phase 9: Tracking — GHL webhook + Facebook Pixel** — Wire GHL webhook for order / customer sync; install Facebook Pixel + Conversions API for `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`. Depends on Phase 8 because pixel events fire on cart / checkout actions that don't exist until wiring is live.
- [ ] **Phase 10: Launch readiness** — Final a11y audit, Vercel env vars, DNS cutover from `shop.shmocard.com` to `shmocard.com`. Highest blast radius — last phase.

## Phase Details

### Phase 3: CR-80 PDP

**Goal**: Build a complete `/shmo-review/cr-80` product detail page from scratch using the existing Shmocard design system. The page sells the CR-80 wallet-size NFC Google review card to local shop crews.

**Depends on**: Phase 3a (homepage + /shmo-review category page must exist; design system primitives + `components/shmo-review/Buybox.tsx` are already in place).

**In scope**:
1. CR-80 PDP top section / buybox — decide between (a) reuse current `components/shmo-review/Buybox.tsx` as-is, or (b) refactor it to accept product props so both `/shmo-review` and `/shmo-review/cr-80` share one component. Visual structure must stay aligned with the design system (`.review-buybox`, `.pdp-buybox`, `.gal`, `.bb`, `.shm-pack-rows`, `.shm-google`, `.shm-faq-list`, `.shm-buybox-sticky`).
2. Below-the-fold PDP sections, added one at a time after buybox approval: proof, why CR-80, setup steps, product details, format comparison (CR-80 vs L-Sign vs Square), FAQ, final CTA.
3. CR-80-specific imagery and copy that avoids drifting into a generic Shopify look.
4. Section rotation: marsh / graham / ember / cocoa only. Wave dividers as siblings, never children.
5. All UI work routed through the `design-system-builder` agent per `.claude/rules/subagent-dispatch.md`.

**Out of scope**:
- Shopify Storefront API wiring — placeholder data with `TODO(shopify):` markers (deferred to Phase 6).
- L-Sign and Square Card PDPs (Phases 4 and 5).
- Custom checkout (Shopify-hosted only).
- Restoring or referencing pre-purge `03-05-PLAN.md` content — starting from scratch per Jordan 2026-05-16.

**Success criteria** (what must be TRUE):
1. Browser renders `/shmo-review/cr-80` with no console errors, no TypeScript errors.
2. Buybox composition is approved by Jordan in the browser before below-the-fold sections are added.
3. Every section uses design-system primitives only — no `.foo__btn`, no `position: fixed; bottom: 0` product bars, no hex colors outside SVG brand marks, no system-ui fonts, no Lucide/Heroicons.
4. Wave dividers placed as siblings of their sections (CLAUDE.md hard rule).
5. Mobile breakpoint clean — no clipping, no overflow.
6. Format comparison section makes CR-80 vs L-Sign vs Square trade-off clear to a first-time visitor.
7. Page composition fits within the four-bg section rotation.
8. No hardcoded product prices/SKUs/names in component code (they go in `TODO(shopify):` placeholders for Phase 6 to swap).

**Plans**: TBD — `/gsd-plan-phase 3` will break this into atomic plans.

### Phase 4: Link hygiene & Coming Soon stubs

**Goal**: Every link on every built page resolves to either a real page or a Coming Soon placeholder. No 404s, no dead CTAs.

**In scope**:
1. Build a reusable `<ComingSoon>` component (Shmocard design system primitives only — hero card, headline, body, optional email-capture stub).
2. Stub routes for `/shmo-review/l-sign`, `/shmo-review/square-card`, `/shmo-biz`, `/shmo-link`, `/shmo-reputation`, and any other sub-brand surfaces the homepage / footer link to.
3. Audit every CTA / nav / footer link on `/`, `/shmo-review`, `/shmo-review/cr-80` — they all resolve cleanly (real page OR Coming Soon stub).
4. Verify mobile nav + footer nav both work.

**Out of scope**:
- Building actual L-Sign / Square Card PDPs (Phases 5 + 6).
- Email-capture wiring (collect-only; backend integration deferred).
- Any Shopify product wiring.

**Depends on**: Phase 3 (CR-80 PDP shipped — so we can audit its outbound links).
**Plans**: TBD — `/gsd-plan-phase 4`.

### Phase 5: L-Sign PDP

**Goal**: Build `/shmo-review/l-sign` product detail page using patterns established in Phase 3. Replaces the Phase 4 Coming Soon stub.
**Depends on**: Phase 3 + Phase 4 (Coming Soon stub exists at the L-Sign route).
**Plans**: TBD.

### Phase 6: Square Card PDP

**Goal**: Build `/shmo-review/square-card` product detail page using patterns established in Phase 3. Replaces the Phase 4 Coming Soon stub.
**Depends on**: Phase 3 + Phase 4 + Phase 5 (Square inherits L-Sign learnings).
**Plans**: TBD.

### Phase 7: Cross-PDP mobile polish

**Goal**: Single mobile + a11y pass across all 3 PDPs at 375 / 414 / 768 px. Catch clipping, overflow, wave-divider gaps, mascot-cap violations, headline overflow before they multiply across Shopify-data variants. Lands two known deferred shared-component fixes first: Buybox heading hierarchy (h3 → h2) + HowItWorks step 01 format-agnostic copy. Then a Playwright sweep × 3 PDPs × 3 breakpoints confirms no regressions from the Phase 6 FormatCompare mount. LAYOUT IS LOCKED — spacing / type / mascot / copy only.

**In scope**:
1. Buybox heading hierarchy fix — promote product title from `<h3>` to `<h2>` in `components/shmo-review/Buybox.tsx` line 191. `bb__title` is tag-agnostic — zero visual regression.
2. HowItWorks step 01 copy fix — format-agnostic rewrite of `REVIEW_HOW_STEPS[0]` `title` / `body` / `details` in `components/shmo-review/HowItWorks.tsx`. Text-only edit. Default wording: "Put the card where customers can reach it" (builder picks final wording within voice constraints).
3. Cross-PDP mobile audit at 375 / 414 / 768 px — 9 full-page Playwright screenshots (3 PDPs × 3 breakpoints).
4. CR-80 6-thumb gallery wrap re-verified with FormatCompare now mounted.
5. FormatCompare cross-PDP consistency spot-check (`currentHandle` wiring on all 3 PDPs).
6. Cross-PDP a11y final check — keyboard tab order, heading outline (h2-first), color contrast spot-checks, qty button touch target measurement, FAQ aria-expanded check.
7. LAYOUT IS LOCKED — spacing / type / mascot scale / copy only. No grid changes, no section reorders, no tile-ratio shifts.
8. All UI work routed through `design-system-builder` per `.claude/rules/subagent-dispatch.md`.

**Out of scope**:
- Shopify wiring (Phase 8).
- Tracking pixels (Phase 9).
- L-Sign-specific testimonials / videos.
- DRY extraction of FORMAT_COPY to `lib/shmo-review/format-copy.ts`.
- HowItWorks prop-driven steps (Option B in RESEARCH.md) — Phase 7 locks Option A (format-agnostic shared copy).
- `.shm-btn--sm` touch target (already fixed to 44px in Phase 6).
- Primitive CSS changes in `.claude/skills/shmocard-design-system/components.css` — any primitive-level a11y fix gets surfaced to Jordan for separate-scope decision (matches Phase 6 protocol).

**Depends on**: Phases 5 + 6 (all 3 PDPs exist with placeholder data + FormatCompare mounted).

**Plans**: 6 plans
- [ ] 07-01-PLAN.md — Fix Buybox heading hierarchy (h3 → h2 on `bb__title`) + PRE/POST visual diff on CR-80
- [ ] 07-02-PLAN.md — Fix HowItWorks step 01 format-agnostic copy + PRE/POST visual diff on L-Sign
- [ ] 07-03-PLAN.md — Cross-PDP mobile audit at 375/414/768 px (3 PDPs × 3 breakpoints = 9 full-page screenshots) + audit notes file
- [ ] 07-04-PLAN.md — Conditional polish iteration (skip if 07-03 clean) — LAYOUT IS LOCKED
- [ ] 07-05-PLAN.md — Cross-PDP a11y final check (heading outline, tab order, contrast, qty button measurement, FAQ aria-expanded) + a11y notes file
- [ ] 07-06-PLAN.md — Phase close-out (tsc + build clean, STATE.md / ROADMAP.md / handoff.md / scope.md / 07-SUMMARY.md updates)

### Phase 8: Shopify Storefront wiring

**Goal**: Replace all `TODO(shopify):` placeholder data with live Storefront API queries; wire `cartCreate` / `cartLinesAdd` / cart drawer / checkout redirect. Read-only Admin (no mutations).

**Depends on**: Phases 3, 5, 6 (all 3 PDPs must exist with placeholder data first) + Phase 7 (mobile polish done before swapping to real-length Shopify strings).
**Plans**: TBD.

### Phase 9: Tracking — GHL webhook + Facebook Pixel

**Goal**: Order data flows from Shopify → GHL for follow-up sequences; Facebook Pixel + Conversions API fires standard events on cart and checkout interactions.

**In scope**:
1. GHL webhook endpoint (Next.js route handler) for Shopify order-created events. Verify HMAC signature.
2. Facebook Pixel base code installed site-wide (head injection or Next.js `Script` strategy).
3. Standard pixel events wired: `ViewContent` (PDP load), `AddToCart` (cart mutation), `InitiateCheckout` (checkout redirect), `Purchase` (post-checkout return).
4. Conversions API server-side mirror for the same events (deduplication via `event_id`).
5. Test mode validation (FB Events Manager test events tab) before going live.

**Depends on**: Phase 8 (pixel events fire on real cart/checkout flow; GHL webhook needs real Shopify order events).
**Plans**: TBD.

### Phase 10: Launch readiness

**Goal**: Final pass before DNS cutover. Final a11y audit, Vercel env vars (Storefront token, GHL webhook secret, FB Pixel + CAPI tokens), DNS swap from `shop.shmocard.com` to `shmocard.com`.

**Depends on**: Phase 9 (tracking live and verified in test mode before flipping DNS).
**Plans**: TBD.
