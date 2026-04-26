# tools.md — What's Available to Build With

Complete cheat sheet of every tool wired into this project. Check here before building anything new.

**Last updated:** 2026-04-26 (Step 3 of project plan — tool stack rebuild)

---

## Skills — auto-detected by Claude OR invoked manually

Skills in this list are global (live in `~/.claude/skills/`) — they're available in any project. The list below is the **chosen stack for Shmocard**. Other skills exist but are not the default for this work.

### Design / UI craft

| Skill | When it fires | Source of truth |
|---|---|---|
| `impeccable` | UI review, audit, polish — anti-patterns, hierarchy, motion, micro-interactions | DESIGN.md anti-pattern compliance |
| `taste-skill` | UI/UX architecture — component structure, CSS hardware acceleration, design engineering | DESIGN.md token compliance |
| `emil-design-eng` | Emil Kowalski's craft philosophy — animation decisions, the invisible details that make software feel right | Polish layer on top of DESIGN.md |

These auto-trigger when Jordan's prompt mentions design/UI/polish/etc. They also stack — multiple can apply to the same task.

### General

| Skill | When to invoke |
|---|---|
| `caveman` | Long sessions where token usage matters. Switches Claude into ultra-compressed mode. Manual invocation only — `/caveman`. |

### Process / workflow (auto-fire from `superpowers:` plugin)

| Skill | When it fires |
|---|---|
| `superpowers:brainstorming` | Creative work, new features — explores intent before implementation |
| `superpowers:systematic-debugging` | Bugs, test failures, unexpected behavior |
| `superpowers:verification-before-completion` | Before claiming work is done — requires real verification |
| `superpowers:writing-plans` | Multi-step task planning, after brainstorming |

---

## Hooks — auto-fire on events

Project-scoped hooks live in `.claude/hooks/` and are wired into `.claude/settings.json`.

| Hook | Event | Matcher | What it does |
|---|---|---|---|
| `inject-design-rules.sh` | UserPromptSubmit | (none) | Injects 5 non-negotiable design rules (Placeholder, mascot icon-only, screenshots → pictures/screenshots/, variations → app/preview/<name>/, source of truth) when prompt mentions UI/design/component/section/etc. |
| `check-placeholder-usage.sh` | PostToolUse | Write\|Edit | Greps `components/*.tsx` for hardcoded `/mascot/` or `/products/` paths. Blocks the edit if found and tells Claude to use `<Placeholder>`. |
| `sweep-screenshots.sh` | Stop | (none) | At end of every turn, moves any stray `*.png` from repo root or `.playwright-mcp/` to `pictures/screenshots/`. |
| (inline in settings.json) | PreToolUse | Write\|Edit | Blocks edits to `.env` files |
| (inline in settings.json) | PreToolUse | Bash | Validates Shopify-related bash commands aren't destructive |

---

## MCPs — what Claude can talk to

| MCP | Scope | What it's for | When to use |
|---|---|---|---|
| **context7** | Project (`.mcp.json`) | Live docs lookup for libraries — Next.js 16, React 19, Tailwind 4, Framer Motion 12, Shopify Storefront | Any time writing framework-specific code. Stops slop from stale training data on bleeding-edge library APIs. |
| **Magic** (21st) | User-level | UI component generation + variation | When Jordan wants visual options or a different layout. Default to **builder** (generates fresh) not **inspiration** (searches existing library). |
| **Playwright** | Plugin (claude-plugins-official) | Browser automation, screenshots, full snapshots | Default browser tool. Smoke-test dev server. Screenshots auto-route to `pictures/screenshots/`. |
| **Vercel** | User-level (claude.ai remote MCP) | Deploy logs, project info, runtime logs | Deploy debugging, performance investigation. |

**Not active:**
- Stripe MCP — reserved for future subscription flow
- GitHub MCP — not loaded; ask if heavy GitHub Issues/PR workflow emerges
- Browsermcp — replaced by Playwright (Playwright is more capable; one tool > two)

### Shopify Plugin Skills

The `shopify-plugin` is installed and provides authoritative Shopify API references. Always load before writing Shopify code.

| Skill | When to use |
|---|---|
| `shopify-plugin:shopify-storefront-graphql` | **Primary.** Any Storefront API query, cart mutation, product fetch, collection query. |
| `shopify-plugin:shopify-custom-data` | Metafields or Metaobjects |
| `shopify-plugin:shopify-dev` | General Shopify developer documentation search |

---

## Commands — Invoke Manually

Project-scoped commands live in `.claude/commands/`. Type `/<name>` to invoke.

| Command | When to invoke | What it does |
|---|---|---|
| `/dev` | Start of session | Boots Next.js dev server in background, waits for "Ready", confirms `localhost:3000` loads. |
| `/handoff` | End of session | Writes structured handoff to `handoff.md` — what changed, what's next, blockers. |
| `/scope-update` | When build state shifts | Scans repo + git log, refreshes `scope.md` to reflect actual current state. |
| `/preview <name>` | When making section variations | Scaffolds a new preview page at `app/preview/<name>/page.tsx` using the new design tokens. |

### Built-in commands also available

`/code-review`, `/init`, `/review`, `/security-review` — these come with Claude Code and don't need a project-level wrapper.

---

## Sub-Agents — none active

The previous setup had `design-reviewer`, `accessibility-reviewer`, `copy-reviewer`, `nano-banana`. **All deleted in the 2026-04-26 reset.** The hooks + design skills now cover the same territory:

- Design review → `impeccable` + `taste-skill` + `emil-design-eng` skills + `check-placeholder-usage.sh` hook
- Copy review → DESIGN.md voice rules + manual review when needed
- Mascot generation → out of scope (3D imagery via separate nano-banana workflow at end of build)

If a specific reviewer agent becomes necessary later, it goes in `.claude/agents/`. For now, intentionally empty.

---

## Fonts (loaded via next/font in app/layout.tsx)

| Role | Font | Status |
|---|---|---|
| Sans (dominant) | **Inter Tight** (400/500/600/700/800) | ✅ Active |
| Serif (italic accent) | **Fraunces italic** (400/500) | ✅ Active |

JetBrains Mono was dropped in Step 2 — not used in the new design system.

---

## Asset folders

| Folder | What goes in it |
|---|---|
| `pictures/` | Reference assets — mockups, screenshots, mascot poses, inspiration images |
| `pictures/screenshots/` | All Playwright/browser screenshots (enforced by `sweep-screenshots.sh` hook) |
| `pictures/mascot/`, `pictures/cr80/`, etc. | Source mascot poses + product reference images |
| `public/mascot/`, `public/products/` | Stand-in assets from Claude Design bundle. **Not for production use** — final imagery will be 3D nano-banana renders. Use `<Placeholder>` in components. |

---

## What's intentionally NOT here

- No `scripts/` folder — generation scripts (mascot poses, hero variants) are out of scope until late in the build.
- No `outputs/` folder — sub-agent outputs aren't needed because no sub-agents are active.
- No `branding guide/` folder — replaced by `DESIGN.md` at repo root (companion to `app/globals.css`).
