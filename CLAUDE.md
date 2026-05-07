# Shmocard Website

Brand website for Shmocard at `shmocard.com`. Retail front door — not an ad funnel. Headless Shopify + Next.js.

**Stack:** Next.js (App Router) + TypeScript · Tailwind CSS 4 · Vercel · Shopify Headless (pending). Full details in `context/general/backend.md`.

> **Status (2026-05-07):** Phase 1 + Phase 2 complete. Site is a bare Next.js + Tailwind shell with the design system audited and integration locked. Ready for Phase 3 rebuild — see `.planning/phases/02-design-system-review/TRANSLATION.md`.

---

## Where to find things

| Need | Read |
|---|---|
| Build status & roadmap | `context/general/scope.md` |
| Last session context | `context/general/handoff.md` |
| Tech stack details (Shopify, env vars, Vercel) | `context/general/backend.md` |
| Tools (skills, commands, hooks, MCPs) | `context/general/tools.md` |
| Project context (business, thesis, sub-brands) | `context/general/context.md` |
| Voice, copy, headlines, angles | `context/general/marketing.md` |
| Product catalog, formats, status | `context/general/product.md` |
| Per-page wireframes | `context/brainstorming/*.md` (pending) |
| Design system source | `.claude/skills/shmocard-design-system/` (read `SKILL.md` first) |
| Personal preferences | `CLAUDE.local.md` (gitignored) |
| Project-local subagents (auditors, safety gates) | `.claude/agents/` (3 files: `design-system-auditor`, `shopify-data-checker`, `live-store-guard`) |

## Engineering rules (`.claude/rules/`)

| File | Applies when |
|---|---|
| `design-system.md` | Any UI / visual / design / component / layout / page work |
| `subagent-dispatch.md` | Spawning a subagent (UI hand-author guardrails or `shmocard-shopify-work` wrapper) |
| `skill-routing.md` | Parent agent deciding which skill to load |
| `live-store-protection.md` | Any Shopify Admin / theme / domain / payments touchpoint |
| `shopify-data-discipline.md` | Product data, prices, SKUs, cart, checkout |
| `verification.md` | Before claiming "done" on any task |
| `file-organization.md` | Adding / moving folders or top-level files |
| `vault-conventions.md` | Reading or writing to Jordan's Brain (Obsidian) |

## Vault context

**Base path:** `/Users/jordancole/Documents/Developement/Jordan's Brain/Projects/Shmocard/Shmocard Website/`

Read freely. Don't write except via the `vault-sync` skill. Don't duplicate vault notes into the repo.

## The one rule that supersedes everything

**Don't break the live store.** `shop.shmocard.com` is live. Never touch the primary Online Store theme, payment settings, or domain configuration. See `.claude/rules/live-store-protection.md`.

## Current phase

1. ✅ **Phase 1 — Docs refresh.**
2. ✅ **Phase 2 — Design system review.** Complete 2026-05-07.
3. **Phase 3 — Rebuild (next).** Tokens → base layout → homepage → `/shmo-review` → 3 PDPs → cart + Storefront API. Run `/gsd-plan-phase 3`.
4. **Phase 4 — Launch readiness.** Mobile pass, a11y, Vercel env, DNS cutover.

See `context/general/scope.md` for the live punch list and `.planning/ROADMAP.md` for atomic-commit history.
