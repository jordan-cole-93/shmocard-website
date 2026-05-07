# handoff.md — Session Handoff

**Last session:** 2026-05-07 — Phase 2 design system review complete + git initialized + project-level GSD skill created.

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
**Phase 2 — Design system review:** ✅ complete (this session).
**Phase 3 — Rebuild:** **Next.** Plans already drafted in `.planning/phases/02-design-system-review/TRANSLATION.md`; need formal `/gsd-plan-phase 3` to convert into per-task PLAN.md.

## What's next

1. Run `/gsd-plan-phase 3` to formalize the Phase 3 plan from TRANSLATION.md content.
2. Phase 3 execution order (per ROADMAP.md):
   - Tokens + fonts wired into `app/globals.css` + `app/layout.tsx`
   - Base layout shell (nav, footer, container, section primitive)
   - Homepage build
   - `/shmo-review` category page
   - 3 PDPs (CR-80, L-Sign, Square Card)
   - Cart UI + Shopify Cart API wiring
   - Checkout redirect via `cart.checkoutUrl`
   - Waitlist GHL webhook integration (URL provided mid-Phase 3)
   - Webhook revalidation route
3. Estimated effort: significantly larger than Phase 2 (~54 new files + Shopify integration). Multi-session.

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
