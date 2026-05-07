# handoff.md — Session Handoff

**Last session:** 2026-05-07 — Phase 2 + early Phase 3 (3-A1 Next.js scaffold + 3-A2 asset migration). Session about to be `/compact`'d at ~50% context; this handoff is the post-compact resume pointer.

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
**Phase 3 — Rebuild:** **In progress (stage 3-Foundations, 33% in).** 3-A1 + 3-A2 committed. 3-A3 Nav + Footer next.

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

## What's next (post-compact resume)

**3-A3 — Nav + Footer components.** These are global, used by every page.

1. Build `components/Nav.tsx`:
   - Outer wrapper `.shm-nav` (sticky, marsh/85% bg + 10px backdrop blur + hairline bottom border — already styled in components.css, just compose)
   - Logo lockup: `<img src="/logo/Logo-Mascot.png" />` (32px) + ShmoCard wordmark (Shmo=cocoa, Card=ember). Wordmark uses `var(--font-wordmark)` Cherry Bomb One.
   - 4-link product menu with inline status badges:
     - Shmo Review → `.shm-badge--status-clover` "Live"
     - Shmo Biz / Link / Reputation → `.shm-badge--status-honey` "Soon"
   - Cart icon-button (links to cart drawer trigger; drawer itself comes 3-A5+)
   - Primary "Shop" CTA `.shm-btn--primary` (small size)
2. Build `components/Footer.tsx`:
   - `.shm-bg-cocoa` outer
   - 4-column grid: brand+social / products / shop / help
   - Bottom row: copyright
   - All links placeholder `#` for now; final link list = open question for build-time review
3. Wire both into `app/layout.tsx` wrapping `{children}`
4. Restore app/page.tsx to a clean placeholder (drop the smoke-test mascot since real homepage is coming)
5. Browser verify, screenshot to `pictures/screenshots/phase-3-A3-nav-footer.png`
6. Atomic commit `phase(03-A3): nav + footer global components`

**Stages after 3-A3 (still in 3-Foundations sub-phase):**
- 3-A4: Mascot.tsx + Sticker.tsx React component wrappers (replace inline `<img>` pattern with proper props-typed components)
- 3-A5: Zustand cart store skeleton at components/cart/store.ts (no UI yet, just typed store + localStorage middleware per D-01)
- 3-A6: 3-Foundations close-out — STATE.md update, dev server kill, atomic commit

**After 3-Foundations:**
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

Background process `bm3jxs5az` was running `npm run dev` pre-compact. Post-compact: assume it's gone (background processes don't survive context resets). Restart with `npm run dev` — Next 15 + Turbopack reboots in ~1s.

## How to start next session (post-compact)

1. `git log --oneline | head -10` — confirms commit chain (last commit should be `350effe phase(03-A2)`).
2. `git status` — should be clean (only untracked `.playwright-mcp/` if running locally; gitignored).
3. Read `CLAUDE.md` + `.planning/STATE.md` + this `handoff.md`.
4. Confirm `pictures/screenshots/phase-3-A2-asset-migration.png` exists and shows mascot rendering.
5. Restart dev server: `npm run dev` (background).
6. Begin 3-A3 — see "What's next" above for concrete steps.
7. Continue atomic commits per stage. Each commit ends with browser screenshot + verification per `verification.md`.

## Open decisions

- **GHL webhook URL** — Jordan provides mid-Phase 3 when waitlist forms get wired (D-04).
- **Final Shopify pricing tiers / SKU naming** — Jordan handles in Shopify Admin during Phase 3.
- **DNS cutover plan** for `shmocard.com` — Phase 4.
- `.claude/hooks/surface-applied-rules.sh` modification (Jordan's hook tweak introducing `skills= | rules= | why=` Following format) — left **uncommitted** in working tree at Phase 2 close-out. Jordan to commit when ready.

## How to start next session

1. Read `CLAUDE.md` + `context/general/scope.md` + this file + `.planning/STATE.md`.
2. Confirm working tree state — should show only the hook file (line above) as modified, otherwise clean.
3. Run `/gsd-plan-phase 3` (or invoke via project-level `gsd-shmocard` if global GSD still broken in this repo).
4. Phase 3 plans should mirror `.planning/phases/02-design-system-review/TRANSLATION.md` ordering.
