# Shmocard Website

Brand website for Shmocard at `shmocard.com`. Retail front door — not an ad funnel. Headless Shopify + Next.js.

**Stack:** Next.js (App Router) + TypeScript · Tailwind CSS 4 · Vercel · Shopify Headless (pending). Full details in `context/general/backend.md`.

> **Status (2026-05-07):** Phase 1 + Phase 2 complete. Site is a bare Next.js + Tailwind shell with the design system audited and integration locked. **Design system at `context/design-system/`** — soft neobrutalism, `.shm-*` utility prefix, 4-color section rotation, 4 bundled fonts (variable Bricolage + Cherry Bomb + Inter Tight upright/italic + Shadows Into Light Two — 83 redundant static cuts deleted), 28 preview cards, 3 reference pages. Auto-loaded rules at `.claude/rules/design-system.md`. **Ready for Phase 3 rebuild** — see `.planning/phases/02-design-system-review/INTEGRATION.md` (token import strategy), `TRANSLATION.md` (section → `.tsx` map), and `DECISIONS.md` (Zustand + framer-motion + `public/` + GHL deferred).

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
| Design system source (CSS, fonts, primitives, reference pages) | `context/design-system/` (read `SKILL.md` first) |
| Design system rules (auto-applied for any UI work) | `.claude/rules/design-system.md` |
| Engineering rules (verification, store protection, data discipline, file org, vault, design system) | `.claude/rules/` |
| Personal preferences | `CLAUDE.local.md` (gitignored) |

## Vault context (Jordan's brain)

**Base path:** `/Users/jordancole/Documents/Developement/Jordan's Brain/Projects/Shmocard/Shmocard Website/`

The vault holds Jordan's working notes (daily logs, captures, cross-project context). Repo `context/general/` is the source of truth for site-build context. Don't duplicate vault notes into the repo and don't write to the vault except via the `vault-sync` skill.

## The one rule that supersedes everything

**Don't break the live store.** `shop.shmocard.com` is live and serves real customers. Never touch the primary Online Store theme, payment settings, or domain configuration. Full safety rules: `.claude/rules/live-store-protection.md`.

## Auto-trigger skill routing

Skills below should fire automatically when their condition matches. If a condition matches the current task, invoke the skill **before** writing code or producing the design.

### Subagent-dispatch wrappers (project-local — MANDATORY before spawning UI/Shopify subagents)

**Why these exist:** spawned subagents structurally cannot access the Skill tool ([SDK issue #102](https://github.com/anthropics/claude-agent-sdk-typescript/issues/102)). Global skills like `frontend-design`, `impeccable`, `redesign-skill` only work inside the parent agent. To enforce design rules on UI work, the parent (orchestrator) MUST invoke the matching project-local wrapper skill first; the wrapper returns a verbatim guardrail block to splice into the subagent's Agent prompt. Rules travel as text inside the prompt — not as a Skill call the subagent can't make.

| Condition | Wrapper to invoke (parent-side) | Use case |
|---|---|---|
| Spawning a subagent to **polish** an existing page (spacing / type / color / mascot — LAYOUT IS LOCKED) | `shmocard-polish-section` | Phase 4 page-by-page polish |
| Spawning a subagent to **build a new page** from scratch | `shmocard-build-page` | Greenfield page work or layout-approved rebuild |
| Spawning a subagent to **review a page visually** (Codex peer review or any review subagent) | `shmocard-design-review` | End-of-phase Codex pass; visual audits |
| Spawning a subagent for **Shopify Storefront / cart / Server Action / webhook** work | `shmocard-shopify-work` | Live-store-protection enforcement on backend dispatch |

**Hard rule:** when dispatching a UI or Shopify subagent, ALWAYS invoke the matching `shmocard-*` wrapper first. The wrapper produces the prompt; never write the subagent prompt freehand. Skipping the wrapper = subagent works without rules = rejected output (this is what happened on plan 04-01 — the executor changed video-tile sizing and box layouts because the layout-lock rule never reached its prompt).

### Parent-agent skill routing (parent CAN invoke directly)

| Condition | Skill to invoke | Notes |
|---|---|---|
| Any UI / visual / design / component / layout / page work (parent agent — not subagent dispatch) | `frontend-design` (Anthropic plugin) | Always. Improves visual output, blocks generic AI design tells. |
| Polish / hierarchy / spacing refinement (parent agent) | `impeccable` (Anthropic plugin) | Polish layer for finished structure. |
| Upgrade existing UI to premium quality (parent agent) | `redesign-skill` | Pairs with `impeccable` on polish passes. |
| Starting any non-trivial multi-step task in this repo | `gsd-progress` → then `/gsd-plan-phase` or `/gsd-quick` | GSD owns plan → execute → verify discipline. Skip for typo-level fixes. |
| Trivial 1–3 file fix | `/gsd-fast` | No subagents, inline. |
| Resuming session after `/clear` or break | `/gsd-resume-work` or `/gsd-progress` | Restores STATE.md context. |
| Need to bootstrap or refresh `.planning/` for this repo | `gsd-shmocard` (project-local) | Replaces `/gsd-ingest-docs`. Knows our `context/general/` layout. |
| Session lifecycle (capture decisions, edits, bug fixes) | `claude-mem` | Auto by plugin — no manual invocation. |
| Tool-call output bloat / context preservation | `context-mode` | Auto by plugin — no manual invocation. Check stats with `/context-mode:ctx-stats`. |

**Hard rule:** for any prompt mentioning design / layout / UI / component / hero / section / typography / palette / animation, load `frontend-design` first AND read `.claude/rules/design-system.md` (which points at the source-of-truth docs in `context/design-system/`). Design system rules WIN on visual / typography / mascot / section-rotation / utility-class-prefix conflicts. `frontend-design` anti-slop principles still apply for composition / hierarchy / cognitive load.

**LAYOUT IS LOCKED on polish tasks.** When Jordan says "polish", "fix the spacing", "the design is missing something", or any refinement-not-restructure language, use `shmocard-polish-section` and respect its layout-lock. NEVER change grid columns, element ordering, tile size ratios, or structural HTML on a polish task. See `.claude/rules/design-system.md` for full rule text; the wrapper carries the embed for subagents.

## Current phase

1. ✅ **Phase 1 — Docs refresh.** All `.md` files aligned with post-wipe reality.
2. ✅ **Phase 2 — Design system review.** Audit + integration plan + translation plan + 5 locked decisions. Complete 2026-05-07.
3. **Phase 3 — Rebuild (next).** Tokens → base layout → homepage → `/shmo-review` → 3 PDPs → cart + Storefront API. Detailed plan in `.planning/phases/02-design-system-review/TRANSLATION.md`. Run `/gsd-plan-phase 3` to formalize.
4. **Phase 4 — Launch readiness.** Mobile pass, a11y, Vercel env, DNS cutover.

See `context/general/scope.md` for the live punch list and `.planning/ROADMAP.md` for atomic-commit history.
