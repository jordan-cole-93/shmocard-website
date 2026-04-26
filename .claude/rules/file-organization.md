# File Organization (Locked)

**The repo layout below is locked. Don't restructure without Jordan's explicit approval.**

If you think the structure should change, **ask first**. Don't move folders, rename rule files, or invent new top-level directories on your own initiative.

## What lives where

### Repo root

| Path | Purpose |
|---|---|
| `CLAUDE.md` | Lean entry point — system brain + pointer table |
| `CLAUDE.local.md` | Personal developer preferences (gitignored) |
| `DESIGN.md` | Full design system narrative |
| `DESIGN.json` | Machine-readable design tokens |
| `scope.md` | Project state — what's built, what's next |
| `handoff.md` | Last session summary |
| `backend.md` | Tech stack details (Shopify, Next.js, env vars, Vercel) |
| `tools.md` | Tool stack reference (skills, commands, hooks, MCPs) |
| `.mcp.json` | MCP server config (Context7) |
| `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs` | Standard project config |

### `.claude/` directory

| Path | Purpose |
|---|---|
| `.claude/settings.json` | Permissions + hooks (committed) |
| `.claude/settings.local.json` | Personal permission overrides (gitignored) |
| `.claude/rules/` | Engineering rule files (this folder) |
| `.claude/commands/` | Custom slash commands |
| `.claude/skills/` | Project-specific skills (wrappers + workflows) |
| `.claude/agents/` | Sub-agents (currently empty — intentional) |
| `.claude/hooks/` | Lifecycle automation scripts |

### Code directories

| Path | Purpose |
|---|---|
| `app/` | Next.js App Router (must stay at root) |
| `components/` | React components (must stay at root) |
| `lib/` | Shared utilities |
| `public/` | Next.js static assets |
| `pictures/` | Reference assets — mockups, mascot poses, screenshots |
| `pictures/screenshots/` | All screenshots (enforced by hook) |

## Hard rules

- **No new top-level folders without approval.** No `scripts/`, `outputs/`, `docs/`, `src/`, `branding guide/`, `rules/`. Jordan removed several of these intentionally.
- **Don't move rule files at root.** `scope.md`, `backend.md`, `tools.md`, `handoff.md` stay at repo root — not in `.claude/rules/`.
- **Don't move code folders.** `app/`, `components/`, `lib/` must stay at root (Next.js conventions).
- **Don't move `.claude/settings.json` or `.claude/settings.local.json`.** Claude Code requires them inside `.claude/`.
- **Don't move `DESIGN.md` or `DESIGN.json`.** They're project deliverables that live at root.
- **Vault context lives in the vault.** `context.md`, `marketing.md`, `product.md`, and `wireframe/*` are in `Jordan's Brain/`, not this repo. Don't duplicate them here.

## When the structure changes

If a real need to add or rename emerges:

1. Propose the change to Jordan with reasoning.
2. Wait for explicit approval.
3. Update this file, `CLAUDE.md`, and any other rule file that references paths.
4. Update VS Code file nesting if the new file should appear under an existing parent.

Drift in file organization causes hallucinations. Keep the layout stable.
