# tools.md — What's Available to Build With

Complete cheat sheet of every tool available. Check here before building anything new.

---

## Skills — Always Watching

Auto-invoke on trigger words. You don't call these manually.

**Project-level skills** (`.claude/skills/`):

| Skill | Triggers on | What it does |
|---|---|---|
| `auto-design-tokens` | CSS, Tailwind, styling, fonts, colors | Reads `branding guide/styles.css` + `design.md` before any style work |
| `auto-brand-review` | Component/page/section complete | Fires `design-reviewer` agent before showing Jordan anything |
| `auto-uiux` | UI/UX work starting | Invokes `ui-ux-pro-max` skill before building |
| `auto-copy-review` | User-facing text (headlines, CTAs, labels) | Fires `copy-reviewer` agent on all copy |
| `auto-shopify-check` | Product data, handles, prices, cart | Validates against `product.md` + `backend.md`, flags hardcoded data |

**Global skills** (auto-detected):

| Skill | Triggers on | What it does |
|---|---|---|
| `ui-ux-pro-max` | Design work, components, UI, styling | Design intelligence — 67 styles, 96 palettes, 57 font pairings. Primary design brain. |
| `frontend-design:frontend-design` | Building UI, components, pages | Creates distinctive, production-grade interfaces. Anti-generic-AI enforcement. |
| `superpowers:brainstorming` | Creative work, new features, new components | Explores intent and design before implementation. Runs before any creative work. |
| `superpowers:systematic-debugging` | Bugs, test failures, unexpected behavior | Structured debugging before proposing fixes. |
| `superpowers:verification-before-completion` | About to claim work is done | Requires real verification before any success claim. |
| `superpowers:dispatching-parallel-agents` | 2+ independent tasks | Launches parallel sub-agents for faster execution. |

---

## Shopify Plugin Skills — Load Before Writing Shopify Code

**Shopify AI Toolkit** (`shopify-plugin` v1.1.0) is installed. Use these before writing any Shopify query — they have the authoritative API reference.

| Skill | When to use |
|---|---|
| `shopify-plugin:shopify-storefront-graphql` | **Primary.** Any Storefront API query, cart mutation, product fetch, collection query. |
| `shopify-plugin:shopify-custom-data` | Metafields or Metaobjects |
| `shopify-plugin:shopify-dev` | General Shopify developer documentation search |
| `shopify-plugin:shopify-admin` | Admin GraphQL — not used for MVP, available for future write operations |

---

## Commands — Invoke Manually

| Command | When to invoke |
|---|---|
| `/dev` | Start of session — launches dev server on localhost:3000 |
| `/handoff` | End of session — writes structured handoff to `.claude/rules/handoff.md` |
| `/brand-check <file>` | Manual design + copy review on a specific file |
| `/scope-update` | Scan project and update `.claude/rules/scope.md` with current build status |
| `/code-review` | After completing a feature or component — formal code review |
| `/new-project` | Starting a new project (global command) |

---

## Sub-Agents — Called Automatically by Claude

Project-level specialist sub-agents. Claude calls these based on context — you don't need to trigger them manually.

| Sub-agent | Model | When Claude calls it |
|---|---|---|
| `design-reviewer` | Sonnet | Before showing Jordan any component or page — checks against `design.md` |
| `copy-reviewer` | Haiku | Before any user-facing text goes into a component — checks against `marketing.md` |
| `nano-banana` | Sonnet | **Manual only** — generates S'more mascot poses and card product images via Gemini. Never auto-invoked. Only runs when Jordan explicitly asks. |

Agent outputs go in the `outputs/` folder at the project root.

---

## MCPs — Active This Project

| MCP | What it's for | When to use |
|---|---|---|
| **Magic** (`mcp__magic__21st_magic_component_builder`) | UI component generation + variation | When Jordan wants visual options or a different layout. Keep prompts minimal. |
| **Browsermcp** (`mcp__browsermcp__*`) | Click, type, screenshot, real browser | Smoke-test dev server. Screenshots to `screenshots/` for design review. |
| **Playwright** (`mcp__plugin_playwright_*`) | Broader browser automation | When Browsermcp can't do it — file uploads, multi-tab, network inspection. |

**Not active:**
- **Stripe MCP** — reserved for future subscription flow
- **GitHub / Vercel MCP** — not loaded; ask Jordan to add if needed

---

## Scripts — Dormant

Do **not** run without Jordan's explicit request.

| Script | What it does |
|---|---|
| `scripts/generate-mascot-poses.py` | Generates S'more poses via Gemini. Jordan said "stop with nano banana." |
| `scripts/generate-hero-variants.py` | Generates hero variants. Same — dormant. |

---

## Fonts

| Role | Font | Status |
|---|---|---|
| Sans (dominant) | **Inter Tight** (400/500/600/700/800) | ✅ Active via Google Fonts |
| Serif (accent) | **Fraunces italic** (400/500) | ✅ Active via Google Fonts |
| Mono | **JetBrains Mono** (400/500) | ✅ Active via Google Fonts |

**Google Fonts import:** `Inter+Tight`, `Fraunces:ital,opsz,wght@1,9..144,400;1,9..144,500`, `JetBrains+Mono`

---

## Project asset folders

| Folder | What goes in it |
|---|---|
| `pictures/` | All image assets — inspiration, mascot poses, product shots, mockups, screenshots |
| `wireframe/` | Wireframe files — page layouts before building. See `scope.md` for the file list. |
| `outputs/` | Sub-agent generated files |
