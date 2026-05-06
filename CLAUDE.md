# Shmocard Website

Brand website for Shmocard at `shmocard.com`. Retail front door — not an ad funnel. Headless Shopify + Next.js.

**Stack:** Next.js (App Router) + TypeScript · Tailwind CSS 4 · Vercel · Shopify Headless (pending). Full details in `context/general/backend.md`.

> **Status (2026-05-07):** Design wipe complete. Site is a bare Next.js + Tailwind shell. New design system folder is pending from Jordan and will land in the repo for review before any rebuild begins. Do **NOT** rebuild components, mount fonts, or invent design tokens until the new system is in place.

---

## Where to find things

All project meta-context now lives under `context/general/`. Page-level wireframe drafts live under `context/brainstorming/` (currently empty — pending new design system).

| Need | Read |
|---|---|
| Build status & roadmap | `context/general/scope.md` |
| Last session context | `context/general/handoff.md` |
| Tech stack details (Shopify, env vars, Vercel) | `context/general/backend.md` |
| Tools (skills, commands, hooks, MCPs) | `context/general/tools.md` |
| Project context (business, thesis, sub-brands) | `context/general/context.md` |
| Voice, copy, headlines, angles | `context/general/marketing.md` |
| Product catalog, formats, status | `context/general/product.md` |
| Per-page wireframes (home, shmo-review, PDPs) | `context/brainstorming/*.md` (pending) |
| Design system | _Pending — folder not yet dropped. No tokens, no components, no `DESIGN.md`._ |
| Engineering rules (verification, store protection, data discipline, file org, vault) | `.claude/rules/` |
| Personal preferences | `CLAUDE.local.md` (gitignored) |

## Vault context (Jordan's brain)

**Base path:** `/Users/jordancole/Documents/Developement/Jordan's Brain/Projects/Shmocard/Shmocard Website/`

The vault holds Jordan's working notes (daily logs, captures, cross-project context). Repo `context/general/` is the source of truth for site-build context. Don't duplicate vault notes into the repo and don't write to the vault except via the `vault-sync` skill.

## The one rule that supersedes everything

**Don't break the live store.** `shop.shmocard.com` is live and serves real customers. Never touch the primary Online Store theme, payment settings, or domain configuration. Full safety rules: `.claude/rules/live-store-protection.md`.

## Auto-trigger skill routing

Skills below should fire automatically when their condition matches. If a condition matches the current task, invoke the skill **before** writing code or producing the design.

| Condition | Skill to invoke | Notes |
|---|---|---|
| Any UI / visual / design / component / layout / page work | `frontend-design` (Anthropic plugin) | Always. Improves visual output, blocks generic AI design tells. |
| Starting any non-trivial multi-step task in this repo | `gsd-progress` → then `/gsd-plan-phase` or `/gsd-quick` | GSD owns plan → execute → verify discipline. Skip for typo-level fixes. |
| Trivial 1–3 file fix | `/gsd-fast` | No subagents, inline. |
| Resuming session after `/clear` or break | `/gsd-resume-work` or `/gsd-progress` | Restores STATE.md context. |
| Need to bootstrap or refresh `.planning/` for this repo | `gsd-shmocard` (project-local) | Replaces `/gsd-ingest-docs`. Knows our `context/general/` layout — global skill assumes ADR/PRD/SPEC dirs we don't have. |
| Session lifecycle (capture decisions, edits, bug fixes) | `claude-mem` | Auto by plugin — no manual invocation. |
| Tool-call output bloat / context preservation | `context-mode` | Auto by plugin — no manual invocation. Check stats with `/context-mode:ctx-stats`. |

**Hard rule:** for any prompt mentioning design / layout / UI / component / hero / section / typography / palette / animation, load `frontend-design` first, then proceed. If the new design system folder has not yet been dropped, do not invent visual decisions — surface that to Jordan and pause.

## Current phase

1. **Phase 1 — Docs refresh (in progress).** Bring all `.md` files into alignment with the post-wipe reality.
2. **Phase 2 — Design system review.** Jordan drops the new design system folder; we audit it for clarity and structure before any code uses it.
3. **Phase 3 — Rebuild.** Tokens → layout → homepage → `/shmo-review` → 3 PDPs → Shopify Storefront wiring.

See `context/general/scope.md` for the current punch list.
