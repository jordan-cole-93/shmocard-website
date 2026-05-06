# File Organization (Locked)

**The repo layout below is locked. Don't restructure without Jordan's explicit approval.**

If you think the structure should change, **ask first**. Don't move folders, rename rule files, or invent new top-level directories on your own initiative.

## What lives where

### Repo root

| Path | Purpose |
|---|---|
| `CLAUDE.md` | Lean entry point — system brain + pointer table |
| `CLAUDE.local.md` | Personal developer preferences (gitignored) |
| `.mcp.json` | MCP server config (Context7) |
| `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs` | Standard project config |
| `.env.local` | Local-only secrets (gitignored, never commit) |

### `context/` directory

All long-form project context lives here. Meta-files used to live at repo root and have been consolidated under `context/general/`.

| Path | Purpose |
|---|---|
| `context/general/scope.md` | Project state — what's built, what's next |
| `context/general/handoff.md` | Last session summary |
| `context/general/backend.md` | Tech stack details (Shopify, Next.js, env vars, Vercel) |
| `context/general/tools.md` | Tool stack reference (skills, commands, hooks, MCPs) |
| `context/general/context.md` | Business, brand, audience, page intents |
| `context/general/marketing.md` | Voice rules, locked headlines, proof points, FAQ |
| `context/general/product.md` | Product catalog, formats, specs, programming, returns |
| `context/brainstorming/*.md` | Per-page wireframe drafts (homepage, shmo-review, 3 PDPs) — currently empty pending new design system |
| `context/design-system/` | Shmocard design system — CSS source of truth (`colors_and_type.css`, `components.css`), fonts, 28 preview cards, 3 canonical reference pages, `SKILL.md` + `README.md` + `PRIMITIVES.md` operator docs. Auto-loaded rules at `.claude/rules/design-system.md`. |

### `.claude/` directory

| Path | Purpose |
|---|---|
| `.claude/settings.json` | Permissions + hooks (committed) |
| `.claude/settings.local.json` | Personal permission overrides (gitignored) |
| `.claude/rules/` | Engineering rule files (this folder) |
| `.claude/commands/` | Custom slash commands |
| `.claude/skills/` | Project-specific skills (wrappers + workflows) |
| `.claude/hooks/` | Lifecycle automation scripts |
| `.claude/launch.json` | Editor launch config |

### Code directories

Currently the repo is a bare Next.js + Tailwind shell. `app/`, `components/`, `lib/`, `public/` will be re-created when the rebuild begins (Phase 3). They must live at repo root per Next.js conventions.

| Path | Purpose |
|---|---|
| `app/` | Next.js App Router (will live at root) |
| `components/` | React components (will live at root) |
| `lib/` | Shared utilities (will live at root) |
| `public/` | Next.js static assets (will live at root) |
| `pictures/` | Reference assets — mockups, mascot poses, screenshots |
| `pictures/screenshots/` | All screenshots (enforced by hook) |

## Hard rules

- **No new top-level folders without approval.** Don't invent `scripts/`, `outputs/`, `docs/`, `src/`, `branding guide/`, `rules/`. Jordan removed several of these intentionally.
- **Don't move meta-context files.** `scope.md`, `backend.md`, `tools.md`, `handoff.md`, `context.md`, `marketing.md`, `product.md` stay under `context/general/` — not at repo root, not in `.claude/rules/`.
- **Don't move code folders.** When `app/`, `components/`, `lib/`, `public/` come back, they must stay at root (Next.js conventions).
- **Don't move `.claude/settings.json` or `.claude/settings.local.json`.** Claude Code requires them inside `.claude/`.
- **Vault notes stay in the vault.** Don't copy `Jordan's Brain/` notes into the repo. Reference by full path when needed.

## When the structure changes

If a real need to add or rename emerges:

1. Propose the change to Jordan with reasoning.
2. Wait for explicit approval.
3. Update this file, `CLAUDE.md`, and any other rule file that references paths.
4. Update VS Code file nesting if the new file should appear under an existing parent.

Drift in file organization causes hallucinations. Keep the layout stable.
