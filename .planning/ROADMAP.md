# Roadmap: Shmocard Website

## Overview

Bare Next.js + Tailwind shell → audited design system → rebuilt homepage + Shmo Review category + 3 PDPs + Shopify Storefront wiring → launch on `shmocard.com`. Source of truth for phase shape: `context/general/scope.md`. ROADMAP.md mirrors scope.md — never the other way around.

## Phases

- [x] **Phase 1: Docs refresh** — Bring every `.md` file into alignment with the post-wipe reality.
- [x] **Phase 2: Design system review** — Audited `context/design-system/`, locked structural moves, locked Tailwind 4 ↔ `.shm-*` integration, locked reference-page translation map, locked 5 open decisions. Complete 2026-05-07.
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

**Goal**: Audit the design system folder Jordan dropped at `context/design-system/`, propose a clean structure, lock the canonical files, and produce a wiring plan for Phase 3.
**Depends on**: Phase 1.
**Requirements**: REQ-09.
**Success Criteria** (what must be TRUE):
  1. Folder structure audited — every file accounted for, redundant/unclear files flagged.
  2. Naming issues surfaced (folder name has space; `home-*.jsx` fragmented; mixed loose-vs-nested HTML in `ui_kits/website/`).
  3. Coexistence plan locked — Tailwind 4 ↔ `.shm-*` utilities don't fight; tokens import path decided; CSS-as-source-of-truth preserved.
  4. Two CLAUDE.md files reconciled — root and `context/design-system/CLAUDE.md` reference each other and don't conflict.
  5. Reference pages (`Shmocard Homepage.html`, `Buybox.html`, `Cart Drawer.html`) translated into a Phase 3 implementation plan (Babel-loaded JSX → real Next.js components).
  6. `SKILL.md`'s skill-frontmatter status decided (register or remove).
  7. Open questions for Jordan surfaced and answered before Phase 3 begins.
**Plans**: 6 of 7 atomic commits, 02-03 collapsed into 02-02. Complete 2026-05-07.

Plans:
- [x] 02-01: Folder audit (`AUDIT.md` — every file inventoried, 8 issues surfaced)
- [x] 02-02: Structural moves — folder renamed `context/design system/` → `context/design-system/`; design-system rules moved to `.claude/rules/design-system.md`; `SKILL.md` frontmatter stripped; all path refs updated
- [x] 02-03: COLLAPSED INTO 02-02 (the move-CLAUDE.md-into-rules decision made the original "reconcile two CLAUDE.md" task unnecessary)
- [x] 02-04: Tailwind 4 ↔ `.shm-*` coexistence locked (`INTEGRATION.md` — Option A direct CSS import, no `@theme` parallel copy)
- [x] 02-05: Reference-page translation plan locked (`TRANSLATION.md` — section-by-section map for homepage, PDP, cart drawer; ~54 component file count; server-component-first split; framer-motion usage map)
- [x] 02-06: 5 decisions locked (`DECISIONS.md` — D-01 Zustand cart, D-02 framer-motion, D-03 public/ assets, D-04 GHL deferred, D-05 83 static font cuts deleted)
- [x] 02-07: Phase 2 close-out — this commit
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
**Plans**: 12 plans across 4 waves. Wave 1 = audit foundations (03-01, 03-02). Wave 2 = pages + Storefront lib + revalidate route (03-03, 03-04, 03-11, 03-12). Wave 3 = PDPs + cart drawer (03-05/06/07, 03-08). Wave 4 = checkout redirect + waitlist (03-09, 03-10). Finalized 2026-05-07 via `/gsd-plan-phase 3`; revisions 2026-05-07 to address plan-checker warnings.

Plans:
- [x] 03-01-PLAN.md — AUDIT-ONLY: verify tokens + fonts wired in app/globals.css + app/layout.tsx (foundations 3-A1) ✅ 2026-05-07 (commit 14be4e5)
- [x] 03-02-PLAN.md — AUDIT shipped Nav/Footer/Mascot/Sticker + ADD Container + Section layout primitives (type-level 4-color rotation) ✅ 2026-05-07 (commits 76b22c9, cfc8611)
- [ ] 03-03-PLAN.md — Homepage: 11 sections per Shmocard Homepage.html (Hero with em type-cycle, Audience marquee, Proof, 4× SubBrandSpotlight, CrewStrip, HowItWorks, VideoTestimonials, Compatibility, HomeFaq, FinalCta)
- [ ] 03-04-PLAN.md — /shmo-review category: locked headline + tagline, bulk math, 3 format cards linking to PDPs, 6-question FAQ
- [ ] 03-05-PLAN.md — CR-80 PDP at app/shmo-review/[handle]/page.tsx (dynamic route + 12-component PDP tree, .shm-buybox-sticky slides DOWN; SHARED tree consumed by 03-06/07)
- [ ] 03-06-PLAN.md — L-Sign PDP: extend pdp-copy.ts; reuse PDP tree from 03-05
- [ ] 03-07-PLAN.md — Square Card PDP: extend pdp-copy.ts; reuse PDP tree from 03-05
- [ ] 03-08-PLAN.md — Cart drawer (.shm-cart-* primitives) + Zustand store + cookie hydration + Server Actions wired
- [ ] 03-09-PLAN.md — Hardened checkout redirect: assertCheckoutUrl allowlist (*.myshopify.com / configured store domain) + try/catch + isNavigating guard
- [ ] 03-10-PLAN.md — Waitlist modal + VideoLightbox + Server Action POST to GHL with honeypot + email/product validation + graceful fallback when URL unset (D-04)
- [x] 03-11-PLAN.md — app/api/revalidate/route.ts: HMAC SHA-256 + timingSafeEqual + revalidateTag for product handle + collection ✅ 2026-05-07 (commit ce7c52d, summary `.planning/phases/03-rebuild/03-11-SUMMARY.md`)
- [ ] 03-12-PLAN.md — lib/shopify/* (shopifyFetch, queries, mutations, types) + components/cart/actions.ts (Server Actions, httpOnly cookie, open-redirect guard)

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
