# Roadmap: Shmocard Website

## Overview

Bare Next.js + Tailwind shell → audited design system → rebuilt homepage + Shmo Review category + 3 PDPs + Shopify Storefront wiring → launch on `shmocard.com`. Source of truth for phase shape: `context/general/scope.md`. ROADMAP.md mirrors scope.md — never the other way around.

## Phases

- [x] **Phase 1: Docs refresh** — Bring every `.md` file into alignment with the post-wipe reality.
- [ ] **Phase 2: Design system review** — Audit `context/design system/`, propose clean structure, lock `DESIGN.md` / `PATTERNS.md`, decide wiring strategy.
- [ ] **Phase 3: Rebuild** — Tokens → base layout → homepage → `/shmo-review` → 3 PDPs → cart + Storefront API.
- [ ] **Phase 4: Launch readiness** — Mobile pass, a11y, Vercel env, DNS cutover.

## Phase Details

### Phase 1: Docs refresh

**Goal**: Every `.md` file accurately reflects the post-2026-05-06 wipe and the new `context/general/` layout.
**Depends on**: Nothing (first phase).
**Requirements**: All meta-context.
**Success Criteria** (what must be TRUE):
  1. `CLAUDE.md` pointer table resolves all referenced paths.
  2. No live references to deleted artifacts (`DESIGN.md`, `PATTERNS.md`, `design system/`, `framer-motion` as live stack, vault `wireframe/` mirrors).
  3. `scope.md` accurately captures current 4-phase plan.
  4. `handoff.md` dated to last session.
  5. `tools.md` reflects active skill / command / hook / MCP set.
  6. `.claude/rules/file-organization.md` agrees with reality.
**Plans**: Complete — work done inline 2026-05-07.

Plans:
- [x] 01-01: Refresh `CLAUDE.md` pointer table to `context/general/*`
- [x] 01-02: Refresh `.claude/rules/file-organization.md` for new layout
- [x] 01-03: Rewrite `context/general/scope.md` from scratch
- [x] 01-04: Refresh `context/general/handoff.md` to 2026-05-07
- [x] 01-05: Stub `context/general/tools.md`
- [x] 01-06: Light-edit `context/general/backend.md` Animation row → "pending"

### Phase 2: Design system review

**Goal**: Audit the design system folder Jordan dropped at `context/design system/`, propose a clean structure, lock the canonical files, and produce a wiring plan for Phase 3.
**Depends on**: Phase 1.
**Requirements**: REQ-09.
**Success Criteria** (what must be TRUE):
  1. Folder structure audited — every file accounted for, redundant/unclear files flagged.
  2. Naming issues surfaced (folder name has space; `home-*.jsx` fragmented; mixed loose-vs-nested HTML in `ui_kits/website/`).
  3. Coexistence plan locked — Tailwind 4 ↔ `.shm-*` utilities don't fight; tokens import path decided; CSS-as-source-of-truth preserved.
  4. Two CLAUDE.md files reconciled — root and `context/design system/CLAUDE.md` reference each other and don't conflict.
  5. Reference pages (`Shmocard Homepage.html`, `Buybox.html`, `Cart Drawer.html`) translated into a Phase 3 implementation plan (Babel-loaded JSX → real Next.js components).
  6. `SKILL.md`'s skill-frontmatter status decided (register or remove).
  7. Open questions for Jordan surfaced and answered before Phase 3 begins.
**Plans**: TBD via `/gsd-plan-phase 2`.

Plans:
- [ ] 02-01: Folder audit + structural diagnosis (read every file in `context/design system/`)
- [ ] 02-02: Propose clean folder layout + concrete moves (rename, relocate, consolidate)
- [ ] 02-03: Reconcile root CLAUDE.md with `context/design system/CLAUDE.md` — cross-references + non-conflict
- [ ] 02-04: Tailwind 4 ↔ `.shm-*` coexistence decision (token import path)
- [ ] 02-05: Reference-page translation plan (HTML/JSX → Next.js components)
- [ ] 02-06: Surface open questions to Jordan (rename folder? where does `SKILL.md` register?)
- [ ] 02-07: Lock decisions in `DESIGN.md` + `PATTERNS.md` (or design-system-equivalent)

### Phase 3: Rebuild

**Goal**: Working `shmocard.com` with homepage + Shmo Review category + 3 PDPs + cart + Shopify Storefront API.
**Depends on**: Phase 2.
**Requirements**: REQ-01, REQ-02, REQ-03, REQ-04, REQ-05, REQ-06, REQ-07, REQ-08, REQ-09.
**Success Criteria** (what must be TRUE):
  1. Homepage renders all 4 sub-brands with equal weight; locked headline; section rotation.
  2. `/shmo-review` sells the category; bulk math visible; locked headline + tagline.
  3. CR-80 / L-Sign / Square Card PDPs each fetch product data from Shopify and offer working cart-add.
  4. Cart drawer uses `.shm-cart-*` primitives; checkout redirects via `cart.checkoutUrl`.
  5. Webhook revalidation route live; product edits in Shopify Admin propagate in ~5s.
  6. Waitlist forms capture to GHL webhook (URL pending).
  7. No `.shm-*`-prefix violations. No hardcoded product data. No Admin API references.
**Plans**: TBD via `/gsd-plan-phase 3` (planned after Phase 2 lands).

Plans:
- [ ] 03-01: Tokens + fonts wired into `app/globals.css` + `app/layout.tsx`
- [ ] 03-02: Base layout shell (nav, footer, container, section primitive)
- [ ] 03-03: Homepage build
- [ ] 03-04: `/shmo-review` category page
- [ ] 03-05: CR-80 PDP
- [ ] 03-06: L-Sign PDP
- [ ] 03-07: Square Card PDP
- [ ] 03-08: Cart UI + Shopify Cart API wiring
- [ ] 03-09: Checkout redirect via `cart.checkoutUrl`
- [ ] 03-10: Waitlist GHL webhook integration
- [ ] 03-11: Webhook revalidation route (`app/api/revalidate/route.ts`)
- [ ] 03-12: Storefront API queries finalized for all PDPs and category page

### Phase 4: Launch readiness

**Goal**: Site is shippable to `shmocard.com`.
**Depends on**: Phase 3.
**Requirements**: REQ-10.
**Success Criteria** (what must be TRUE):
  1. Mobile renders correctly at 375 / 414 / 768 / 1024 / 1440px.
  2. Lighthouse Performance ≥ 90, Accessibility ≥ 95.
  3. Vercel env mirrors `.env.local`.
  4. DNS cutover plan agreed; `shmocard.com` → Vercel.
  5. Live-store-protection sanity check passes (no Admin API references).
**Plans**: TBD via `/gsd-plan-phase 4`.

Plans:
- [ ] 04-01: Mobile pass on every page
- [ ] 04-02: Lighthouse / a11y pass
- [ ] 04-03: Vercel env vars mirrored
- [ ] 04-04: DNS cutover plan agreed with Jordan
- [ ] 04-05: Final live-store-protection sanity check

---

*ROADMAP.md mirrors `context/general/scope.md`. If they disagree, scope.md wins — re-derive ROADMAP via `gsd-shmocard` skill (refresh mode).*
