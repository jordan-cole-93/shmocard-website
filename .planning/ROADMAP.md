# Roadmap: Shmocard Website

## Overview

Bare Next.js + Tailwind shell → audited design system → homepage + /shmo-review category → CR-80 PDP → L-Sign PDP → Square Card PDP → Shopify Storefront wiring → launch on `shmocard.com`. Source of truth for current state: `context/general/scope.md` + `handoff.md`.

## Phases

- [x] **Phase 1: Docs refresh** — Bring every `.md` file into alignment with the post-wipe reality. Complete 2026-05-07.
- [x] **Phase 2: Design system review** — Audited `.claude/skills/shmocard-design-system/`, locked structural moves, locked Tailwind 4 ↔ `.shm-*` integration, locked reference-page translation map. Complete 2026-05-07.
- [x] **Phase 3a: Homepage + /shmo-review category** — Tokens, base layout, homepage, /shmo-review category/family page. Complete 2026-05-16 (handoff.md).
- [ ] **Phase 3: CR-80 PDP** — Build `/shmo-review/cr-80` product detail page from scratch. Active.
- [ ] **Phase 4: L-Sign PDP** — Build `/shmo-review/l-sign` product detail page.
- [ ] **Phase 5: Square Card PDP** — Build `/shmo-review/square-card` product detail page.
- [ ] **Phase 6: Shopify Storefront wiring** — Replace placeholder product data with live Storefront API queries; wire cart + checkout redirect.
- [ ] **Phase 7: Launch readiness** — Mobile pass, a11y, Vercel env, DNS cutover to `shmocard.com`.

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

### Phase 4: L-Sign PDP

**Goal**: Build `/shmo-review/l-sign` product detail page using patterns established in Phase 3.
**Depends on**: Phase 3.
**Plans**: TBD.

### Phase 5: Square Card PDP

**Goal**: Build `/shmo-review/square-card` product detail page using patterns established in Phase 3.
**Depends on**: Phase 3.
**Plans**: TBD.

### Phase 6: Shopify Storefront wiring

**Goal**: Replace all placeholder product data with live Storefront API queries; wire `cartCreate` / `cartLinesAdd` / cart drawer / checkout redirect. Read-only Admin (no mutations).
**Depends on**: Phases 3, 4, 5 (all PDPs must exist with placeholder data first).
**Plans**: TBD.

### Phase 7: Launch readiness

**Goal**: Final pass before DNS cutover. Mobile audit, a11y audit, Vercel env vars, DNS swap from `shop.shmocard.com` to `shmocard.com`.
**Depends on**: Phase 6.
**Plans**: TBD.
