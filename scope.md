# scope.md — Build Scope & Status

## Current status

**Last updated:** 2026-04-26
**Stage:** Steps 1–3 complete. Foundation rebuilt from scratch — design system loaded, tools wired up, hooks enforcing rules, commands ready. Existing homepage code deleted (`components/home/*` + `app/styles.css` + `app/home.css` + `app/preview/*`). Ready to start Step 4: rebuild homepage from Claude Design v2 reference.

## What's next (in order)

1. ✅ Finish restructuring meta-context files in this project
2. ✅ Add the new branding design guide (`DESIGN.md` + `DESIGN.json`)
3. ✅ Add the tools this project needs — MCPs, commands, skills, hooks
   - Hooks: `inject-design-rules.sh`, `check-placeholder-usage.sh`, `sweep-screenshots.sh` live in `.claude/hooks/`
   - Commands: `/dev`, `/handoff`, `/scope-update`, `/preview` live in `.claude/commands/`
   - Skills: `impeccable`, `taste-skill`, `emil-design-eng`, `caveman` (documented in `tools.md`)
   - MCPs: Context7 (project), Magic / Playwright / Vercel (user-level)
4. **Resume website build (Step 4 — current)**: rebuild homepage from Claude Design v2 reference — 9 sections (Nav, Hero, TrustBar, ShmoFamily, WhyShmocard, Showcase, RealResults, Testimonials, FAQ, FinalCTA, Footer). Then `/shmo-review` category page + 3 PDPs (CR-80, L-Sign, Square Card). Plan locked at `~/.claude/plans/i-want-to-keep-structured-cocoa.md`.

## MVP scope (launch target)

Homepage + `/shmo-review` category page + 3 product pages (CR-80, L-Sign, Square Card) + cart → Shopify-hosted checkout. Everything else is post-launch.

## Page structure

**Homepage (`/`)** — hero, bulk math argument, Shmo family grid, how it works, real results, testimonials, FAQ, final CTA.

**Shmo Review (`/shmo-review`)** — category page doubling as shop listing. Routes to 3 PDPs.

**Product pages:**
- `/shmo-review/cr-80` — CR-80 wallet card
- `/shmo-review/l-sign` — L-Sign acrylic counter standee
- `/shmo-review/square-card` — Square card

**Shared (post-MVP):** Blog, Help Center, FAQ page, Affiliate, Reseller, Account, legal pages.

**Coming soon (post-MVP):** `/shmo-biz`, `/shmo-link`, `/shmo-reputation`

## Wireframes

Wireframes live in the vault under `Jordan's Brain/Projects/Shmocard/Shmocard Website/wireframe/`. CLAUDE.md has the full path.

| File | What it covers |
|---|---|
| `wireframe/sitemap.md` | Full site structure, all URLs, page hierarchy |
| `wireframe/home-page-shmocard.md` | Shmocard brand homepage |

(Product/category page wireframes will be added as those pages are planned.)

## Decisions locked

- **Headless Shopify** via Headless sales channel — not Shopify Plus
- **Shopify-hosted checkout** — custom checkout requires Shopify Plus (~$2,300/mo), out of budget
- **ReConvert** (or equivalent) for post-purchase upsells on Shopify thank-you page
- **"Built for crews. Priced for bulk."** — locked homepage headline
- **Data in Shopify, presentation in code** — never hardcode product data

## Decisions still open

- Branding direction (palette, typography, named anti-patterns) — pending new branding guide
- Final retail pricing for each SKU
- Bundle pack sizes and per-unit discounts
- Exact copy for coming-soon pages

## Open questions before launch

- Real pricing — Shopify currently showing placeholder prices
- Third video testimonial (Carly + Joey confirmed, third pending)
- Shopify handle rename: `google-review` → `shmo-review` (post-launch SEO)
