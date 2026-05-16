# tools.md — Tool Stack Reference

What's wired into this repo for Codex and Claude-era compatibility, and how each piece is used. Codex is the active working environment for this project. The `.claude/` folder remains as a legacy/reference mirror for rules, skills, and source material while the migration settles.

---

## Active Codex setup

| Tool category | Config location |
|---|---|
| Project instructions | `AGENTS.md` |
| Codex agents | `.codex/agents/` |
| Codex hooks | `.codex/hooks.json` + `.codex/hooks/` |
| Repo-local Codex skills | `.agents/skills/` |
| Design-system runtime source | `.agents/skills/shmocard-design-system/` |
| Legacy Claude mirror / reference | `.claude/` |

The active Codex agents are:

- `design-system-builder` — mandatory for UI `.tsx` / `.css` work in `app/` or `components/`.
- `design-system-auditor` — read-only design-system compliance check.
- `shopify-data-checker` — scans product/cart/checkout diffs for hardcoded Shopify data.
- `live-store-guard` — defensive check before Shopify-touching commits.

## Auto-trigger skills (used in this repo)

| Skill | When it fires | What it does |
|---|---|---|
| `Shmocard` / `shmocard-design-system` | Any UI / visual / design / component / layout / page work | Loads the Shmocard primitive system. **Hard rule:** use before any UI prompt. |
| `gsd-progress` | Resuming work or starting a non-trivial multi-step task | Restores `STATE.md` context and routes to the right GSD command. |
| `gsd-plan-phase` | Non-trivial multi-step task in this repo | Generates a `PLAN.md` with subagent verification before code changes. |
| `gsd-quick` | Multi-step task with light scope | Atomic commits + state tracking, skips heavier subagents. |
| `gsd-fast` | Trivial 1–3 file fix | Inline, no subagents, no planning overhead. |
| `context-mode` | Any tool call producing large output | Routes large outputs through a sandbox when available. |
| `shopify-data-discipline` | Prompts mentioning product data, prices, SKUs, cart, checkout | Loads the "data lives in Shopify, presentation lives in code" rule. |
| Vault conventions | Reading/writing Jordan's Brain | Read freely when needed; write only through the project-approved vault workflow. |

## Manual commands (most-used in this repo)

| Command | Purpose |
|---|---|
| `/gsd-resume-work` | Restore session context after `/clear` or a break |
| `/gsd-plan-phase` | Plan the next phase before executing |
| `/gsd-execute-phase` | Execute a planned phase with wave-based parallelization |
| `/gsd-verify-work` | UAT-style validation for a built feature |
| `/gsd-review` | Cross-AI peer review of a phase plan |
| `/gsd-progress` | Unified situational command for advancing GSD workflow |
| `/dev` | Start the Next.js dev server and confirm `localhost:3000` |
| `/preview` | Scaffold a new preview page at `app/preview/<name>/page.tsx` |
| `/handoff` | Write a structured end-of-session handoff |
| `/init` | Initialize a CLAUDE.md (used once at project setup) |

The full GSD command surface is much wider — see `~/.claude/commands/`. Above is the everyday set for this repo.

## Hooks

Codex hooks live in `.codex/hooks/` and are wired by `.codex/hooks.json`.

- PreToolUse blocks `.env*` edits unless Jordan explicitly approves.
- PostToolUse reminds agents to capture screenshots after `.tsx` / `.css` edits.
- UserPromptSubmit surfaces project rules.
- Stop sweeps stray screenshots into `pictures/screenshots/` and runs a typecheck hook.

Claude-era hooks/settings are no longer the active source of truth for Codex work.

## MCP servers

Configured in `.mcp.json` and via plugin marketplace:

| MCP | Purpose |
|---|---|
| Context7 | Up-to-date library docs for Next.js, Tailwind, Shopify, etc. |
| Playwright | Browser automation for screenshots and interaction tests |
| context-mode | Sandbox for large tool outputs |
| shopify-plugin | Storefront API, Admin API, Hydrogen, Liquid skill bundle |

Other MCPs available at the user level (Notion, GitHub, Vercel, Stripe, Gmail, Apify, etc.) are not used by this project's day-to-day workflow but are accessible if a task needs them.

## When to extend this list

Add a row here when a new skill, command, hook, or MCP becomes part of the everyday workflow for this repo. Don't list user-level tools that are never invoked here — keep this file scoped to what actually shapes Shmocard work.
