# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-05-07)

**Core value:** First-time visitor leaves understanding the parent brand and either buys (Shmo Review) or joins a waitlist (other three) — without ever feeling pitched to.
**Current focus:** Phase 3 — Rebuild (in progress, stage 3-Foundations)

## Current Position

Phase: 3 of 4 (Rebuild — in progress)
Plan: 2 of ~6 in stage 3-Foundations (3-A1 scaffold + 3-A2 asset migration done; 3-A3 Nav + Footer next)
Status: In progress
Last activity: 2026-05-07 — Phase 3 started. Discussion CONTEXT.md committed (8a7db32). Next.js 15 + Tailwind 4 scaffolded (2417ead). Asset migration pictures/ → public/ done with smoke test (350effe). 68 runtime files in public/, 52 MB. Mascot rendering verified at .shm-mascot--supporting size.

Progress: [██████░░░░] 60%  *(2 phases complete + Phase 3 stage 3-Foundations 33% in)*

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

**Stage 3-Foundations / commit 3-A3 = Nav + Footer components.**

Build:
- `components/Nav.tsx` — `.shm-nav` sticky bar; logo lockup (mascot 32px + ShmoCard wordmark Shmo=cocoa-deep + Card=ember); 4-link product menu with status badges (Review live = `.shm-badge--status-clover`, Biz/Link/Reputation soon = `.shm-badge--status-honey`); cart icon-button with count; primary "Shop" CTA `.shm-btn--primary--sm`. Mobile breakpoints deferred to Phase 4.
- `components/Footer.tsx` — `.shm-bg-cocoa` 4-column grid: brand+social, products, shop, help. Bottom copyright row. Use locked headlines/voice rules from `context/general/marketing.md`.

Mount both in `app/layout.tsx` (wrap `{children}`). Replace placeholder content in `app/page.tsx` to confirm both render on every page.

Verify per `verification.md`: dev server reload, browser screenshot to `pictures/screenshots/phase-3-A3-nav-footer.png`, console clean.

After 3-A3 commit, continues to:
- 3-A4: `Mascot.tsx` + `Sticker.tsx` reusable React components (replace inline `<img>` smoke test in `app/page.tsx`)
- 3-A5: Cart store skeleton at `components/cart/store.ts` (Zustand + localStorage middleware per D-01). No UI yet — just the typed store + persist config.
- 3-A6: 3-Foundations sub-phase close-out (handoff.md update, kill dev server bg, commit)

Then 3-Homepage (the 11 home section components from TRANSLATION.md). Largest sub-stage — multi-session.

Dev server: background process `bm3jxs5az` was running pre-compact. May need restart post-compact. Just `npm run dev` again — Next 15 + Turbopack reboots in ~1s.

---

*STATE.md is a snapshot, not a live tracker. Use `/gsd-progress` for real-time status. STATE.md is regenerated from `context/general/handoff.md` whenever `gsd-shmocard` runs in refresh mode.*
