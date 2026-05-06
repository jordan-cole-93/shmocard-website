# tools.md — Tool Stack Reference

What's wired into this repo for Claude Code, and how each piece is used. Skills auto-trigger by topic; commands are manual; hooks fire on lifecycle events; MCPs expose external systems as tools.

---

## Auto-trigger skills (used in this repo)

| Skill | When it fires | What it does |
|---|---|---|
| `frontend-design` (Anthropic plugin) | Any UI / visual / design / component / layout / page work | Improves visual output, blocks generic AI design tells. **Hard rule:** load before any UI prompt. |
| `gsd-progress` | Resuming work or starting a non-trivial multi-step task | Restores `STATE.md` context and routes to the right GSD command. |
| `gsd-plan-phase` | Non-trivial multi-step task in this repo | Generates a `PLAN.md` with subagent verification before code changes. |
| `gsd-quick` | Multi-step task with light scope | Atomic commits + state tracking, skips heavier subagents. |
| `gsd-fast` | Trivial 1–3 file fix | Inline, no subagents, no planning overhead. |
| `claude-mem` | Every session | Auto-captures decisions, edits, bugfixes by the plugin. |
| `context-mode` | Any tool call producing >20 lines of output | Routes large outputs through a sandbox; only summary enters context. Stats: `/context-mode:ctx-stats`. |
| `shopify-data-discipline` | Prompts mentioning product data, prices, SKUs, cart, checkout | Loads the "data lives in Shopify, presentation lives in code" rule. |
| `vault-sync` | "Save this to my vault" / "capture this" / "add to Obsidian" | Writes to Jordan's vault under `Jordan's Brain/` with `(AICHECK)` prefix. |

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

Hooks live at `.claude/hooks/` and are wired in `.claude/settings.json`. Current state after the design wipe:

- The `inject-design-rules.sh` and `check-placeholder-usage.sh` hooks were **disabled and removed** during the wipe — they referenced the deleted `DESIGN.md` / `PATTERNS.md`. They will be reinstated (or replaced) when the new design system lands.
- The caveman + rule-surfacing user-prompt-submit hooks remain active (these enforce caveman comms mode and the "Following:" output line).
- Live-store-protection pre-tool-use hook remains active for Shopify-related Bash commands and `.env*` edits.

## MCP servers

Configured in `.mcp.json` and via plugin marketplace:

| MCP | Purpose |
|---|---|
| Context7 | Up-to-date library docs for Next.js, Tailwind, Shopify, etc. |
| Playwright | Browser automation for screenshots and interaction tests |
| context-mode | Sandbox for large tool outputs |
| shopify-plugin | Storefront API, Admin API, Hydrogen, Liquid skill bundle |

Other MCPs available at the user level (Notion, GitHub, Vercel, Stripe, Gmail, Apify, etc.) are not used by this project's day-to-day workflow but are accessible if a task needs them.

## Where each tool category is configured

| Tool category | Config location |
|---|---|
| Skills | `~/.claude/skills/` (user) and `.claude/skills/` (repo) |
| Commands | `~/.claude/commands/` (user) and `.claude/commands/` (repo) |
| Hooks | `.claude/hooks/` + `.claude/settings.json` |
| MCPs | `.mcp.json` + plugin marketplace |
| Permissions | `.claude/settings.json` (committed) + `.claude/settings.local.json` (gitignored) |

## When to extend this list

Add a row here when a new skill, command, hook, or MCP becomes part of the everyday workflow for this repo. Don't list user-level tools that are never invoked here — keep this file scoped to what actually shapes Shmocard work.
