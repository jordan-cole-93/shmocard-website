---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
last_updated: "2026-05-07T06:15:00.000Z"
last_activity: "2026-05-07 06:15 — 03-08 cart drawer complete. 12 .shm-cart-* primitive components + useCartHydration hook + global CartDrawer mount via app/layout.tsx. Zustand persist middleware DROPPED entirely (Cart Persistence Trap mitigation, RESEARCH.md Pitfall 6) — httpOnly cookie + Storefront query are sole source of truth for cartId/lines; UI state resets on reload. CartCheckoutButton calls assertCheckoutUrl Server Action before window.location.href (T-03-08-01 open-redirect guard). Built temp app/cart-smoke/ harness to verify add-to-cart end-to-end while sibling 03-05 PDP runs in parallel (DI-06 cleanup deferred). Browser-verified flow: cart create → add 2 products → qty +1 → remove → reload → hydrate from cookie. Screenshots 03-08-cart-empty.png + 03-08-cart-with-lines.png. Commits d01fca7 + 27aae54. REQ-06 cart UX surface satisfied. REQ-09 design system discipline holds. Wave 3 03-08 done."
progress:
  total_phases: 4
  completed_phases: 0
  total_plans: 12
  completed_plans: 7
  percent: 58
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-05-07)

**Core value:** First-time visitor leaves understanding the parent brand and either buys (Shmo Review) or joins a waitlist (other three) — without ever feeling pitched to.
**Current focus:** Phase 3 — Rebuild (in progress, stage 3-Foundations complete; 3-Homepage next)

## Current Position

Phase: 3 of 4 (Rebuild — in progress)
Stage: Waves 1+2 complete; Wave 3 03-08 complete. Sibling 03-05 (CR-80 PDP) running in parallel; 03-06/07 (L-Sign, Square Card PDPs) pending.
Status: In progress
Last activity: 2026-05-07 06:15 — 03-08 cart drawer complete. 12 .shm-cart-* components + global CartDrawer mount + useCartHydration hook (cookie-driven). Zustand persist DROPPED (Cart Persistence Trap mitigation). assertCheckoutUrl open-redirect guard wired. Smoke harness verified add-to-cart → qty → remove → reload-hydration end-to-end. Commits d01fca7 + 27aae54. REQ-06 + REQ-09 satisfied for cart surface.

Progress: [██████░░░░] 58%

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
