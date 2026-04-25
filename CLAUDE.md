# Shmocard Website

Brand website for Shmocard at `shmocard.com`. Retail front door — not an ad funnel. Warm professional design — refined, sans-dominant with serif accents. Headless Shopify + Next.js. Read the right rule file before working.

---

## Rule files

| Task | Read |
|---|---|
| What is this project? Business, thesis, sub-brands? | `.claude/rules/context.md` |
| Full site structure, all URLs, page hierarchy? | `wireframe/sitemap.md` |
| What's built? What's next? Blockers? | `.claude/rules/scope.md` |
| Skills, plugins, commands, agents, MCPs? | `.claude/rules/tools.md` |
| Shopify, stack, env vars, webhooks, Vercel? | `.claude/rules/backend.md` |
| Design system, palette, typography, mascot? | `.claude/rules/design.md` |
| CSS design tokens (copy to globals.css)? | `branding guide/styles.css` |
| Reference implementation for a homepage section? | `branding guide/home-[section].jsx` |
| Button, card, pill, input patterns? | `branding guide/ds-components.jsx` |
| Voice, copy, headlines, angles, proof points? | `.claude/rules/marketing.md` |
| Product catalog, formats, status? | `.claude/rules/product.md` |
| What was happening at end of last session? | `.claude/rules/handoff.md` |
| Why did we decide X the way we did? | `.claude/rules/faq.md` |

---

## Sub-agents

| Agent | Model | When Claude calls it |
|---|---|---|
| `design-reviewer` | Sonnet | Before showing Jordan any component or page |
| `copy-reviewer` | Haiku | Before any user-facing text goes into a component |

---

## Universal rules

- **Don't break the live store** — `shop.shmocard.com` is live. Never touch the primary Online Store theme, domain, or payment settings.
- **Test before claiming done** — verify in browser before telling Jordan to preview.
- **Face problems** — diagnose and fix. Never dodge.
- **No generic AI aesthetics** — no Inter/Roboto as display fonts, no purple gradients, no cookie-cutter layouts.
- **Data in Shopify, presentation in code** — product names, prices, images live in Shopify admin. Never hardcode.
- **Ask before editing vault notes** — don't modify existing vault notes without permission.
- **`(AICHECK)` prefix** — files Claude creates in the vault get this prefix.

---

## Project folders

| Folder | What goes in it |
|---|---|
| `pictures/` | All image assets — mockups, mascot poses, inspiration references, product shots |
| `wireframe/` | Wireframe files — page layouts and section structures before building |
| `outputs/` | Sub-agent generated files |
| `.claude/rules/` | Rule files — loaded on demand by Claude |
| `.claude/commands/` | Slash commands — `/dev`, `/handoff`, `/brand-check`, `/scope-update` |
| `.claude/skills/` | Auto-trigger skills — design tokens, brand review, UI/UX, copy review, Shopify check |
| `.claude/agents/` | Sub-agent definitions |
| `.claude/agent-memory/` | Agent memory — written automatically, do not edit manually |

---

## Vault context

**Vault:** `/Users/jordancole/Documents/Developement/Jordan's Brain/`
**Project note:** `Projects/Shmocard/Shmocard Website/Shmocard Website.md`
