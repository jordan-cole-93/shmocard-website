---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
last_updated: "2026-05-07T04:42:13.278Z"
last_activity: "2026-05-07 06:30 — 03-06 L-Sign PDP complete. pdp-copy.ts extended with L-Sign subline + 4 value-prop bullets + 3 FAQ entries. Browser-verified real Shopify product (8 variants, $29.99-$219.99), cart-add Server Action POST 200, drawer opens, 0 console errors. Zero new components — full reuse of 03-05 PDP tree. REQ-04 satisfied. Commits b8ec441 + 365854a."
progress:
  total_phases: 4
  completed_phases: 1
  total_plans: 12
  completed_plans: 12
  percent: 100
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-05-07)

**Core value:** First-time visitor leaves understanding the parent brand and either buys (Shmo Review) or joins a waitlist (other three) — without ever feeling pitched to.
**Current focus:** Phase 3 — Rebuild (in progress, stage 3-Foundations complete; 3-Homepage next)

## Current Position

Phase: 3 of 4 (Rebuild — in progress)
Stage: Wave 3 complete (03-05 CR-80 + 03-06 L-Sign + 03-07 Square Card + 03-08 cart drawer). Wave 4 (03-09 / 03-10 / 03-11) is next.
Status: In progress
Last activity: 2026-05-07 - Completed quick task 260507-d4g: Trim CLAUDE.md to ~50 lines and move wrapper-dispatch + hard-rule paragraphs into a new .claude/rules/subagent-dispatch.md

Progress: [██████████] 100%

## Performance Metrics

**Velocity:**

- Total plans completed: 6 (Phase 1 inline plans)
- Average duration: ~5 min/plan
- Total execution time: ~30 min for Phase 1

**By Phase:**

| Phase | Plans | Status | Notes |
|-------|-------|--------|-------|
| 1 | 6/6 | ✅ Complete | Done inline 2026-05-07, no formal phase scaffolding |
| 2 | 0/7 | Pending plan | Awaiting `/gsd-plan-phase 2` |
| 3 | 0/12 | Future | Plans after Phase 2 locks design wiring |
| 4 | 0/5 | Future | Launch readiness |

**Recent Trend:**

- Last activity: Phase 1 docs refresh + bootstrap
- Trend: Healthy — no blockers, clear next step

| Phase 03 P05 | 16m | 2 tasks | 18 files |
| Phase 03 P07 | 5m | 2 tasks | 3 files |
| Phase 03 P06 | 25m | 2 tasks | 2 files |
| Phase 03 P09 | 13 | 2 tasks | 5 files |

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 260507-d4g | Trim CLAUDE.md to ~50 lines and move wrapper-dispatch + hard-rule paragraphs into a new .claude/rules/subagent-dispatch.md | 2026-05-07 | 38b645d | [260507-d4g-trim-claude-md-to-50-lines-and-move-wrap](./quick/260507-d4g-trim-claude-md-to-50-lines-and-move-wrap/) |

## Accumulated Context

### Decisions

Decisions logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- 2026-05-07: Project-level `gsd-shmocard` skill replaces global `/gsd-ingest-docs` for this repo (the global skill assumes ADR/PRD/SPEC dirs we don't have).
- 2026-05-07: `.planning/` bootstrapped — ROADMAP.md mirrors `context/general/scope.md` exactly. Source of truth = scope.md.
- 2026-05-06: Total design wipe. Bare Next.js + Tailwind shell. New design system landed 2026-05-07.
- LOCKED: Live store at `shop.shmocard.com` is read-only from this repo. Storefront API only.
- LOCKED: Product data in Shopify, presentation in code.
- LOCKED: Locked headlines per `context/general/marketing.md`.
- [Phase 3 / 03-02]: 2026-05-07: Section primitive enforces 4-color rotation (REQ-09) at the type level via `SectionBg = 'marsh'|'graham'|'ember'|'cocoa'`. Container polymorphic via `as` prop. Wave size mapping: `lg`/`xl` emit CSS modifiers; `sm`/`md` fall back to default thin wave (no `--sm`/`--md` exist).
- [Phase 3 / 03-04]: 2026-05-07: /shmo-review proof block on cocoa-bg renders rows without `.shm-card` wrapper to avoid white-on-white `.shm-h3` cascade. Bulk-math grid shows 4 tiers (1/3/5/10) with illustrative volume only — pricing fetched in PDPs (Shopify Storefront API). HowItWorks-short and Proof inlined inside `app/shmo-review/page.tsx`; only reusable category primitives factored into `components/category/*`.
- [Phase ?]: PdpBuyboxContext over Zustand for shared client state — single-page scope, keeps cart store clean per Cart Persistence Trap
- [Phase ?]: Removed position:sticky from .pdp-gal so IntersectionObserver fires when gallery exits viewport
- [Phase ?]: Extended addLineToCart with optional attributes? param — used for google_review_url cart-line attribute
- [Phase 03]: Square Card PDP wired by extending pdp-copy.ts only — zero new components, full reuse of 03-05 PDP tree — REQ-05 satisfied; PDP component tree from 03-05 consumes the slug as designed
- [Phase 03 / 03-06]: 2026-05-07: L-Sign PDP wired by extending pdp-copy.ts only (subline + 4 bullets + 3rd FAQ on shift-swap) — zero new components, full reuse of 03-05 PDP tree — REQ-04 satisfied; cart-add Server Action POST 200 confirmed; lowest variant $29.99 from Shopify Storefront
- [Phase 03 / 03-06]: 2026-05-07: Documented parallel-execution working-tree race (sibling 03-07 swept 03-06's L-Sign subline + bullets edits into commit e882f98). Mitigation for future parallel waves: serialize plans that touch the same file, OR atomic edit-then-stage instead of batched staging
- [Phase 03]: Verified PDP against 'next start' (production build) — 'next dev' has a pre-existing framer-motion vendor-chunk HMR crash — Production server is the operational reality; deferred dev HMR fix to Phase 4
- [Phase ?]: 03-09 — Allowlist accepts SHOPIFY_PRIMARY_DOMAIN (and shop.<primary>) in addition to *.myshopify.com; required because Shopify resolves cart.checkoutUrl to the merchant primary host once configured

### Pending Todos

None captured. Open questions live in `## Open Questions` below.

### Known Constraints

See PROJECT.md Constraints section. Highlights:

- No git history yet (repo not `git init`'d as of 2026-05-07).
- All `.shm-*` design-system invariants per `context/design-system/CLAUDE.md`.
- File layout locked per `.claude/rules/file-organization.md`.

## Open Questions

Resolved during Phase 2 (see `.planning/phases/02-design-system-review/DECISIONS.md`):

- ✅ **Folder rename** — `context/design system/` → `context/design-system/` (step 02-02)
- ✅ **`SKILL.md` registration** — frontmatter stripped, auto-loading via rule file (step 02-02)
- ✅ **Two CLAUDE.md files** — collapsed to one + `.claude/rules/design-system.md` (step 02-02)
- ✅ **Tailwind 4 ↔ `.shm-*` coexistence** — direct CSS import, no `@theme` parallel copy (step 02-04, INTEGRATION.md)
- ✅ **Reference-page translation strategy** — locked (step 02-05, TRANSLATION.md)
- ✅ **Cart state** — Zustand + localStorage (D-01)
- ✅ **Animation library** — `framer-motion` for sections / drawers / modals; CSS for hover (D-02)
- ✅ **Asset location** — `public/` not in design system folder (D-03)
- ✅ **Static font cuts** — 83 redundant Bricolage cuts deleted (D-05)

Still open:

- **GHL webhook URL** for waitlist captures (D-04 — deferred to mid-Phase 3 when forms get wired).
- **Final Shopify pricing tiers / SKU naming** — Jordan handles in Shopify Admin during Phase 3.

## Next Concrete Action

**Begin 3-Homepage stage** — 11 home section components per `.planning/phases/02-design-system-review/TRANSLATION.md`.

**Before starting:** load `frontend-design` skill (composition-heavy, not a pure port).

**References to keep open:**

- `context/design-system/ui_kits/website/homepage/Shmocard Homepage.html`
- `context/design-system/ui_kits/website/homepage/home-bundle.jsx`
- `context/design-system/ui_kits/website/homepage/home.css`
- `context/design-system/ui_kits/website/homepage/home-data.jsx`

**Section order:**

1. Hero (with type-cycle "missing" / "asking for")
2. Audience strip (marquee)
3. Proof grid (real Pawn Leads data — never mention "Pawn Leads" in copy)

4–7. Sub-brand spotlights (Review, Biz, Link, Reputation — alternating reverse)

8. Crew strip
9. How-it-works grid
10. FAQ (rewrite during build)
11. Final CTA (ember)

**Pattern per section:** read reference markup → create `components/home/<Section>.tsx` (+ `.module.css` for layout) → mount in `app/page.tsx` with proper `.shm-wave` dividers between → browser-verify → atomic commit.

Dev server: killed at 3-A6 close-out. Restart with `npm run dev`.

---

*STATE.md is a snapshot, not a live tracker. Use `/gsd-progress` for real-time status. STATE.md is regenerated from `context/general/handoff.md` whenever `gsd-shmocard` runs in refresh mode.*
