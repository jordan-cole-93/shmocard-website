# handoff.md — Session Handoff

**Last session:** 2026-05-07 — Phase 2 + Phase 3 stage 3-Foundations (all 6 plans). Stage 3-Foundations complete; next stage is 3-Homepage.

---

## What was done this session

### Phase 1 close-out (refresh of all `.md` files post-design-wipe)

- Refreshed `CLAUDE.md` pointer table to resolve `context/general/*` (was repo root).
- Refreshed `.claude/rules/file-organization.md` — new `context/` subtree layout, dropped stale rows.
- Rewrote `context/general/scope.md` from scratch.
- Stubbed `context/general/tools.md`.
- Light-edit `context/general/backend.md` Animation row.

### Architecture: project-level GSD skill

- Built `.claude/skills/gsd-shmocard/SKILL.md` — project-local skill that knows this repo's actual layout (`context/general/`, `.claude/rules/`, `context/design-system/`) instead of the textbook ADR/PRD/SPEC convention global `/gsd-ingest-docs` looks for. Replaces global ingest for this project.
- Saved Jordan's recurring view ("GSD skills should be project-level") to memory at `~/.claude/projects/.../memory/feedback_skills_should_be_project_level.md`.

### `.planning/` bootstrap

- Manually wrote `.planning/PROJECT.md`, `REQUIREMENTS.md`, `ROADMAP.md`, `STATE.md` (since `gsd-sdk` binary not installed, can't run global `/gsd-plan-phase` workflow). Files follow the SDK's expected shape — once `gsd-sdk` lands, they consume cleanly.

### Git initialization

- `git init -b main`. Wrote `.gitignore` (covers `.env*`, `CLAUDE.local.md`, `.claude/settings.local.json`, runtime state JSONs, OS noise, Node/Next/Vercel artifacts).
- 2 initial commits: `chore: initial gitignore` + `chore: initial repo state`.

### Phase 2 — Design system review (full)

Phase 2 ran in 6 atomic commits (02-03 collapsed into 02-02):

1. **02-01 — Folder audit** (`AUDIT.md`, commit `d94bf89`). Read every file in `context/design-system/`. Surfaced 8 structural / naming / consistency issues.
2. **02-02 — Structural moves** (commit `a1c27b9`). Folder renamed `context/design system/` → `context/design-system/`. Nested `CLAUDE.md` collapsed into `.claude/rules/design-system.md` (Jordan's call — better than my "two files cross-referencing" proposal). `SKILL.md` frontmatter stripped (clear it's a doc, not a skill). Resolves audit issues #1, #4, #5.
3. **02-04 — Tailwind 4 ↔ `.shm-*` coexistence locked** (`INTEGRATION.md`, commit `f14a244`). Direct CSS `@import` from `app/globals.css`. No Tailwind 4 `@theme` parallel token copy. Tailwind utilities = layout only. Concrete `app/globals.css` skeleton ready for Phase 3.
4. **02-05 — Reference-page translation plan** (`TRANSLATION.md`, commit `23d5872`). Homepage → 12 sections / 11 components + 3 modals. PDP/Buybox → 14 components. Cart drawer → 12 components. Server-component-first split with `'use client'` only where state lives. ~54 new files in Phase 3.
5. **02-06 — 5 decisions locked** (`DECISIONS.md`, commit `c26f924`). D-01 Zustand + localStorage cart. D-02 framer-motion locked (Jordan override of CSS-only recommendation). D-03 `public/` assets. D-04 GHL webhook deferred. D-05 83 static Bricolage cuts deleted (~25 MB freed).
6. **02-07 — Close-out** (this commit). Phase 2 marked complete in CLAUDE.md, scope.md, ROADMAP.md, STATE.md, handoff.md.

### Architectural debt logged (not blocking)

- `gsd-sdk` not installed — global GSD workflow scripts (`/gsd-plan-phase`, `/gsd-ingest-docs`, etc.) can't run their state queries here. Manual workaround used throughout. Install once → all global commands wake up.
- `gsd-shmocard` skill currently only handles bootstrap; doesn't yet wrap plan/execute/verify. Could expand later.
- Audit issues #2 (`ui_kits/website/` mixed organization), #6 (Buybox.html double-loads fonts), #8 (preview numbering gaps) deferred — cosmetic, low-priority. Roll into Phase 3 cleanup if friction surfaces.

## Project phase

**Phase 1 — Docs refresh:** ✅ complete.
**Phase 2 — Design system review:** ✅ complete.
**Phase 3 — Rebuild:** **In progress (stage 3-Foundations complete; 3-Homepage next).** All 6 Foundations plans committed: 3-discuss, 3-A1, 3-A2, 3-A3, 3-A4, 3-A5, 3-A6.

## What was done in Phase 3 so far

- **3-discuss** (commit `8a7db32`) — `/gsd-discuss-phase 3` ran manually (gsd-sdk binary missing, fallback workflow). Captured 13 decisions in `.planning/phases/03-rebuild/CONTEXT.md`. Pawn Leads brand-separation hard rule saved to memory.
- **3-A1 — Next.js scaffold** (commit `2417ead`):
  - package.json (Next 15 + React 19 + TS + Tailwind 4 + zustand + framer-motion)
  - tsconfig.json (strict, `@/*` alias, excludes context/design-system/ui_kits/**/*.jsx)
  - next.config.ts (minimal), postcss.config.mjs (Tailwind 4 plugin)
  - app/globals.css per INTEGRATION.md skeleton (`@import "tailwindcss"` + `@import "../context/design-system/colors_and_type.css"` + `@import "../context/design-system/components.css"`)
  - app/layout.tsx (locked metadata title from marketing.md), app/page.tsx (placeholder using `.shm-bg-marsh` + `.shm-display` + `.shm-eyebrow`)
  - npm install: 51 packages, 8s. Dev server boots in ~1s.
  - Browser-verified: `pictures/screenshots/phase-3-A1-scaffold-boot.png`. Bricolage Grotesque + Inter Tight rendering, marshmallow bg, ember `<em>` accent, eyebrow pill, all design-system rules applied via CSS @import chain.
- **3-A2 — Asset migration** (commit `350effe`):
  - First-time tracking of `pictures/{cr80,l-sign,plate,mascot,logo,shmo-review}/*` (raw source archive — never previously committed since initial commit was empty here)
  - rsync pictures/* → public/* (excluding .DS_Store):
    - pictures/mascot/ → public/mascot/ (13 emotions)
    - pictures/cr80/ → public/products/cr80/
    - pictures/l-sign/ → public/products/l-sign/ (color + black + transparent variants)
    - pictures/plate/ → public/products/plate/
    - pictures/logo/ → public/logo/
    - pictures/shmo-review/ → public/hero/shmo-review/
  - 68 runtime files / 52 MB in public/
  - Smoke test: `<img src="/mascot/mascot-holding-card.png" className="shm-mascot shm-mascot--supporting" />` added to app/page.tsx
  - Browser-verified: `pictures/screenshots/phase-3-A2-asset-migration.png`. S'more mascot rendering at 140px on marshmallow bg.
- **3-A3 — Nav + Footer global components** (commit `2ec62e9`):
  - `components/Nav.tsx` + `components/Nav.module.css` — sticky `.shm-nav`, Cherry Bomb wordmark (Shmo=cocoa-deep / Card=ember), 4 product links with inline status badges (Review=clover/Live, Biz+Link+Reputation=honey/Soon), hand-drawn cart icon-button, primary "Shop" CTA. Mobile breakpoint hides links above 880px.
  - `components/Footer.tsx` + `components/Footer.module.css` — cocoa-deep surface, 4-col grid (brand+social / products / shop / help), copyright row with privacy/terms.
  - Layout in CSS Modules (per design-system rule: components own LAYOUT, primitives own appearance). All tokens via `var(--*)`, no hex.
  - Mounted in `app/layout.tsx` wrapping `{children}`.
  - Browser-verified: `pictures/screenshots/phase-3-A3-nav-footer.png`. Render matches `home-bundle.jsx` reference. Console clean except favicon 404 (fixed in 3-A6).
- **3-A4 — Mascot + Sticker components** (commit `3f7c90d`):
  - `components/Mascot.tsx` — typed wrapper around `.shm-mascot--{decoration|accent|supporting|hero}` (64/96/140/200px). Default size `supporting`.
  - `components/Sticker.tsx` — typed wrapper around `.shm-sticker--{xs|sm|md}` (44/56/76px). Drop-shadow from primitive. Default size `md`.
  - `components/mascot-poses.ts` — single source of truth for available poses (13 PNGs in public/mascot/) + tilt union + `mascotSrc()` helper.
  - Both share `tilt` (l|r|sm-l|sm-r) + `fitRatio` override (e.g. megaphone = 1.3 per components.css note) + `className` extension API.
  - Smoke-rendered all variants in app/page.tsx during verify, screenshot at `pictures/screenshots/phase-3-A4-mascot-sticker.png`, then stripped before commit.
- **3-A5 — Zustand cart store skeleton** (commit `d2e4f26`):
  - `components/cart/store.ts` — Zustand 5 + localStorage persist (D-01). State: cartId (Shopify GID), checkoutUrl, lines. Actions: setCart, addLine (merges by merchandiseId), updateQuantity (removes when ≤ 0), removeLine, clear. Persist name `shm-cart`, version 1.
  - `components/cart/types.ts` — `CartLine` type (Shopify-friendly: merchandiseId GID, productHandle, title, variantTitle, price as decimal string, currencyCode, image url+alt, quantity).
  - Selectors `selectLineCount` + `selectSubtotal` exported for cart-icon badge + drawer subtotal.
  - SSR hydration guard noted in store.ts; consumers use `useStore.persist.hasHydrated()` (handled when cart drawer lands).
  - Verified `npx tsc --noEmit` clean + dev server still 200. No browser screenshot — pure module.
- **3-A6 — 3-Foundations close-out** (this commit):
  - `app/icon.png` added (Next App Router auto-wires as favicon — kills the 404).
  - STATE.md + handoff.md bumped — 3-Foundations complete, 3-Homepage next.
  - Background dev server `bo30k1uis` killed.

## What's next

**3-Homepage stage** — 11 home section components per `.planning/phases/02-design-system-review/TRANSLATION.md`. Source-of-truth references:
- `context/design-system/ui_kits/website/homepage/Shmocard Homepage.html` (final markup)
- `context/design-system/ui_kits/website/homepage/home-bundle.jsx` (component decomposition)
- `context/design-system/ui_kits/website/homepage/home.css` (page-level layout)
- `context/design-system/ui_kits/website/homepage/home-data.jsx` (audiences, sub-brand data, FAQ data)

Section order (per TRANSLATION.md):
1. Hero (with type-cycle "missing" / "asking for" — implementation deferred to this stage)
2. Audience strip (marquee)
3. Proof grid (real Pawn Leads data — never mention "Pawn Leads" in copy, hard rule)
4. Sub-brand spotlight (Shmo Review — alternating reverse layout)
5. Sub-brand spotlight (Shmo Biz)
6. Sub-brand spotlight (Shmo Link)
7. Sub-brand spotlight (Shmo Reputation)
8. Crew strip
9. How-it-works grid
10. FAQ (rewrite during build per Jordan)
11. Final CTA (ember section)

Load `frontend-design` skill at start of 3-Homepage — composition / hierarchy / cognitive-load principles apply once we're decomposing reference into subcomponents.

**Stages after 3-Homepage:**
- 3-Homepage — 11 home section components from TRANSLATION.md
- 3-ShmoReview — category page
- 3-PDPs — `app/shmo-review/[handle]/page.tsx` + ~14 PDP components
- 3-Cart — drawer + line items + storefront wiring
- 3-Shopify — Storefront API queries + cart mutations + checkout redirect + webhook revalidation route
- 3-Waitlist — modal + Server Action posting to GHL webhook (URL from Jordan mid-stage)

## Architectural debt logged (still applies)

- `gsd-sdk` not installed — global GSD workflow scripts (`/gsd-plan-phase`, `/gsd-discuss-phase`, etc.) can't run their state queries here. Manual workaround used throughout. Install once → all global commands wake up.
- `gsd-shmocard` skill currently only handles bootstrap; doesn't yet wrap plan/execute/verify. Could expand later.
- Audit issues #2, #6, #8 still deferred (cosmetic; roll into Phase 4 cleanup if friction).

## Open decisions (still unresolved)

- **GHL webhook URL** — Jordan provides mid-Phase 3 when waitlist plan stub is being built (3-Waitlist).
- **Final Shopify pricing tiers / SKU naming** — Jordan handles in Shopify Admin during Phase 3.
- **DNS cutover plan** for `shmocard.com` — Phase 4.

## Locked rules to remember (new in Phase 3)

- **Pawn Leads brand separation HARD RULE** — never write "Pawn Leads" / "PawnLeads" anywhere on Shmocard site. Saved to project memory at `~/.claude/projects/.../memory/feedback_pawn_leads_brand_separation.md`. Pre-deploy grep check confirms zero hits.
- **Hero `<em>` type-cycle** — alternates "missing" / "asking for" every ~2.5s with crossfade. Reserve max-width for longer alternative. Implementation deferred to 3-Homepage stage.
- **Tailwind utilities = layout/spacing/sizing only** — never `bg-*` (color), `text-*-color`, `border-*`, `rounded-*`, `shadow-*`, `font-*`, `animate-*`, gradients. Always `.shm-*` for visual concerns.
- **Server-component-first** — `'use client'` only when local state, browser API, or event handler is required.

## Dev server state

Killed at 3-A6 close-out. Restart for next session: `npm run dev` (foreground or background — Turbopack reboots in ~1s). Was binding port 3001 (port 3000 held by an unrelated process).

## How to start next session

1. `git log --oneline | head -10` — last commit should be the 3-A6 close-out (Foundations complete).
2. `git status` — clean.
3. Read `CLAUDE.md` + `.planning/STATE.md` + this `handoff.md`.
4. **Load `frontend-design` skill before any 3-Homepage work** (composition decisions ahead, not pure ports — see "What's next" above).
5. Restart dev server: `npm run dev`.
6. Open `context/design-system/ui_kits/website/homepage/Shmocard Homepage.html` (or just open the HTML file in a browser tab) so the canonical reference is on screen while building.
7. Begin section 1 (Hero) — atomic commit per section, browser screenshot + console-clean verify per `verification.md` between commits.
