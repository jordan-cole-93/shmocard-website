---
name: gsd-shmocard
description: Use when bootstrapping or refreshing the .planning/ scaffolding for the Shmocard website. Replaces /gsd-ingest-docs for this project — it reads this repo's actual doc layout (context/general/*, .claude/rules/*, context/design-system/*) instead of looking for textbook ADR/PRD/SPEC dirs that don't exist here. Triggers on phrases like "bootstrap planning", "set up GSD", "init .planning/", "refresh .planning/".
---

# gsd-shmocard

Project-scoped GSD wrapper. Replaces `/gsd-ingest-docs` for this repo.

## Why this exists

Global `/gsd-ingest-docs` auto-discovery scans for `*/adr/*`, `*/prd/*`, `*/spec/*`, `*/docs/*`. **This repo has none.** Project context lives in:

- `CLAUDE.md` (root)
- `context/general/*.md` (scope, handoff, backend, tools, context, marketing, product)
- `.claude/rules/*.md` (file-organization, live-store-protection, shopify-data-discipline, verification, vault-conventions)
- `context/design-system/` (CLAUDE.md, SKILL.md, README.md, PRIMITIVES.md, CSS, reference pages)
- `CLAUDE.local.md` (gitignored personal preferences)

Running global ingest here finds zero docs and stalls. This skill knows the real layout.

## When this fires

Manual. Jordan invokes via:
- "bootstrap planning"
- "set up GSD" / "init `.planning/`"
- "refresh `.planning/`" (after scope.md changes)

Also fires when Claude needs `.planning/ROADMAP.md` or `.planning/STATE.md` and the dir is missing.

## What Claude should do

### Step 1 — Source-of-truth scan

Read these files (mandatory order):

1. `CLAUDE.md` — current phase, pointer table, hard rules
2. `context/general/scope.md` — phase plan + open decisions (authoritative for ROADMAP)
3. `context/general/handoff.md` — last session state (authoritative for STATE)
4. `context/general/context.md` — business + audience + page intents
5. `context/general/backend.md` — stack + Shopify integration
6. `context/general/marketing.md` — locked headlines, voice rules
7. `context/general/product.md` — catalog
8. `.claude/rules/live-store-protection.md` — hard constraint (LOCKED decision)
9. `.claude/rules/shopify-data-discipline.md` — hard constraint (LOCKED decision)
10. `.claude/rules/file-organization.md` — folder structure (LOCKED decision)
11. `.claude/rules/design-system.md` — design-system orchestrator rule (auto-applies for UI work; LOCKED)
12. `context/design-system/SKILL.md` — operator's manual + primitive table
13. `context/design-system/PRIMITIVES.md` — canonical primitive index

If any file is empty or missing, stop and surface that to Jordan. Don't fabricate.

### Step 2 — Detect mode

```bash
[ -d .planning ] && echo "MODE=refresh" || echo "MODE=new"
```

- `MODE=new` — write fresh `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, `.planning/STATE.md`
- `MODE=refresh` — re-derive ROADMAP + STATE from current scope.md + handoff.md, preserve existing per-phase artifacts under `.planning/phases/`

### Step 3 — Generate `.planning/PROJECT.md`

Distill from `context/general/context.md` + `marketing.md` + `backend.md`. Required sections:

- **Project name:** Shmocard Website
- **Core value:** Retail front door for Shmocard — sells the four-product family and converts crew-first local business owners.
- **Audience:** Local business owners (pawn shops, barbers, mechanics, jewelers, roofers, salons, retailers, cafés, mobile crews).
- **Stack:** Next.js (App Router) + TypeScript · Tailwind 4 · Vercel · Shopify Headless (Storefront API).
- **Locked decisions** (`<decisions>` block — must mirror in PROJECT.md so plan-phase respects them):
  - Live store at `shop.shmocard.com` is read-only from this repo. Storefront API only.
  - Product data lives in Shopify, presentation in code.
  - File layout per `.claude/rules/file-organization.md`.
  - Design system per `.claude/rules/design-system.md` (rule file orchestrator) + `context/design-system/SKILL.md` + `PRIMITIVES.md` + `colors_and_type.css` + `components.css` (source of truth).
  - No custom checkout. No Admin API writes. No `.env*` commits.
  - Locked headlines (from `marketing.md`):
    - Homepage hero: "The toolkit your crew's been missing."
    - Shmo Review category: "One tap. One five-star review."
    - Shmo Review tagline: "Built for crews. Priced for bulk."

### Step 4 — Generate `.planning/REQUIREMENTS.md`

Source from `context/general/context.md` "What each page needs to do" section + `scope.md` Phase 3 punch list. One requirement per page-job + per Shopify integration step. Format per `~/.claude/get-shit-done/templates/requirements.md`.

### Step 5 — Generate `.planning/ROADMAP.md`

**Mirror the phase structure already in `context/general/scope.md`. Do not invent phases.**

Current scope.md phases (as of 2026-05-07):

- Phase 1: Docs refresh — **complete** (mark `[x]`)
- Phase 2: Design system review — audit `context/design-system/`, propose clean structure, lock canonical doc files (the design system folder ships its own `SKILL.md` + `README.md` + `PRIMITIVES.md` + CSS as source of truth; no separate root-level `DESIGN.md` / `PATTERNS.md` needed)
- Phase 3: Rebuild — base layout → homepage → `/shmo-review` → 3 PDPs → cart + Storefront wiring
- Phase 4: Launch readiness — mobile pass, a11y, Vercel env, DNS cutover

Each phase must list its concrete plans (the `[ ]` checkboxes already in scope.md become plan stubs `02-01`, `02-02`, etc.).

### Step 6 — Generate `.planning/STATE.md`

Source from `context/general/handoff.md`. Must reflect:

- Current phase + progress
- Last activity date (from handoff.md)
- Recent decisions (last 3-5 from PROJECT.md Key Decisions)
- Open questions (from scope.md "Open decisions")
- Next concrete action

### Step 7 — Verify alignment

Before finalizing, confirm `.planning/ROADMAP.md` Phase 2/3 plans match `context/general/scope.md` punch list **exactly**. If they diverge, scope.md wins — re-derive ROADMAP. Surface the diff to Jordan.

### Step 8 — Commit

```
git add .planning/
git commit -m "chore(planning): bootstrap .planning/ from existing repo docs"
```

If repo has no git history yet (`has_git: false`), skip commit and tell Jordan to commit manually.

## Hard rules

- **Don't run global `/gsd-ingest-docs` after this skill.** It will look for ADR/PRD/SPEC dirs and find nothing — wastes a subagent fanout.
- **scope.md is source of truth for phases.** Never let `.planning/ROADMAP.md` drift from scope.md. If they disagree, fix ROADMAP, not scope.
- **handoff.md is source of truth for STATE.md.** Same rule.
- **Locked decisions stay locked.** Anything in `.claude/rules/*` that says "hard rule" or "locked" gets a `LOCKED` tag in PROJECT.md `<decisions>` block. `gsd-plan-phase` will refuse to plan against locked decisions.
- **Idempotent.** Re-running this skill on a populated `.planning/` refreshes ROADMAP + STATE without nuking per-phase artifacts under `.planning/phases/`.

## What this skill does NOT do

- Plan phases. That's `/gsd-plan-phase N`.
- Execute work. That's `/gsd-execute-phase N`.
- Audit the design system. That's Phase 2's actual work, planned via `/gsd-plan-phase 2`.
- Replace `/gsd-progress` for ongoing status — STATE.md is just a snapshot, not a live tracker.

## After this skill runs

Output to Jordan:

```
.planning/ bootstrapped from repo docs.

Phase 1 — Docs refresh: complete
Phase 2 — Design system review: ready to plan

Next: /gsd-plan-phase 2
```

Then stop. Don't auto-launch Phase 2 planning — Jordan decides when to start.

## References

- `~/.claude/get-shit-done/templates/project.md` — PROJECT.md format
- `~/.claude/get-shit-done/templates/requirements.md` — REQUIREMENTS.md format
- `~/.claude/get-shit-done/templates/roadmap.md` — ROADMAP.md format
- `~/.claude/get-shit-done/templates/state.md` — STATE.md format
- `context/general/scope.md` — phase source of truth (always)
- `context/general/handoff.md` — state source of truth (always)
