# handoff.md — Session Handoff

**Last session:** 2026-05-07 — Phase 1 docs refresh after the design wipe.

---

## What was done this session

- Audited every `.md` file in the repo against the post-wipe reality.
- Updated `CLAUDE.md` — pointer table now resolves to `context/general/*` (was repo root). Dropped stale references to `DESIGN.md`, `PATTERNS.md`, the deleted `design system/` folder, and Jordan's vault `wireframe/` notes (the repo no longer mirrors them).
- Updated `.claude/rules/file-organization.md` — new `context/general/` and `context/brainstorming/` sections, removed root-meta-files hard rule that no longer matched reality, removed `.claude/agents/` / `.claude/memory/` / `.claude/plans/` rows that are not present.
- Rewrote `context/general/scope.md` from scratch (it had been emptied). Captures current bare-shell state, three-phase plan (docs refresh → design-system review → rebuild), and open decisions.
- Stubbed `context/general/tools.md` (was empty) to reflect the current skills / commands / hooks / MCP setup.
- Light edit on `context/general/backend.md` — the Animation row no longer hard-codes Framer Motion (removed during the wipe).
- Left `context.md`, `marketing.md`, `product.md` untouched — Jordan flagged those as stable.
- Left `context/brainstorming/*.md` (homepage-shmocard, homepage-shmoreview, 3 PDPs) empty — they are placeholders for new wireframes after the design system lands.

## Project phase

**Phase 1 — Docs refresh (this session, ✅ complete).**
**Phase 2 — Awaiting new design system folder.** No rebuild work begins until Jordan drops it and we audit it together.

## What's next

1. Jordan drops the new design system folder into the repo.
2. Phase 2 kicks off — review folder structure, identify messy parts, propose clean layout, lock `DESIGN.md` / `PATTERNS.md`.
3. Phase 3 — wire tokens, mount fonts, rebuild base layout, then homepage → `/shmo-review` → 3 PDPs → Shopify Storefront wiring.

## Open decisions

- Whole new design system — pending Jordan's folder drop.
- GHL webhook URL for waitlist capture.
- Final Shopify pricing / SKU finalization.
- Motion library choice (re-add `framer-motion` or use something lighter).

## How to start next session

1. Read `CLAUDE.md` + `context/general/scope.md` + this file.
2. Confirm the new design system folder has landed.
3. If yes — start Phase 2 review. If no — wait for Jordan, do not invent design decisions.
