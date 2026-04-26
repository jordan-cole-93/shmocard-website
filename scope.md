# scope.md — Build Scope & Status

## Current status

**Last updated:** 2026-04-27
**Stage:** Steps 1–3 complete. Step 4 in progress — homepage 11-component MVP shipped (Nav + Hero + TrustBar + ShmoFamily + WhyShmocard + Showcase + RealResults + Testimonials + FAQ + FinalCTA + Footer) renders at `localhost:3000` against the slim DESIGN.md companion. Pivoting now to `/shmo-review` category page + 3 PDPs (CR-80, L-Sign, Square Card). Imagery, email-capture wiring, and Shopify Storefront API still pending.

## What's next (in order)

1. ✅ Finish restructuring meta-context files in this project
2. ✅ Add the new branding design guide — slim `DESIGN.md` at repo root (companion to `app/globals.css`; `DESIGN.json` deleted as a separate source of truth)
3. ✅ Add the tools this project needs — MCPs, commands, skills, hooks
   - Hooks: `inject-design-rules.sh`, `check-placeholder-usage.sh`, `sweep-screenshots.sh` live in `.claude/hooks/`
   - Commands: `/dev`, `/handoff`, `/scope-update`, `/preview` live in `.claude/commands/`
   - Skills: `impeccable`, `taste-skill`, `emil-design-eng`, `caveman` (documented in `tools.md`)
   - MCPs: Context7 (project), Magic / Playwright / Vercel / Claude Preview (user-level)
4. **Resume website build (Step 4 — current)**
   - ✅ **Homepage 11-component MVP** — Nav, Hero, TrustBar, ShmoFamily, WhyShmocard, Showcase, RealResults, Testimonials, FAQ, FinalCTA, Footer all render at `localhost:3000`. Plan locked at `~/.claude/plans/i-want-to-keep-structured-cocoa.md`.
   - ⏳ **Polish round** — uncommitted polish on Showcase / FinalCTA / Nav / Footer + DESIGN.md rewrite. PR #1 still open and unmerged.
   - ⏳ **`/shmo-review` category page** — next focus. Routes to 3 PDPs (CR-80, L-Sign, Square Card).
   - ⏳ **3 product detail pages** — `/shmo-review/cr-80`, `/shmo-review/l-sign`, `/shmo-review/square-card`.
   - ⏳ **Shopify Storefront API wiring** — product cards, prices, inventory, cart, checkout. Use `shopify-plugin:shopify-storefront-graphql` skill.
   - ⏳ **Imagery sprint** — hero stage, Showcase right-side stages, RealResults crew tiles → 3D nano-banana renders + crew photos.
   - ⏳ **Email capture → GHL webhook** — stubs in `Showcase.tsx` + `FinalCTA.tsx` waiting on webhook URL from Jordan.

## MVP scope (launch target)

Homepage + `/shmo-review` category page + 3 product pages (CR-80, L-Sign, Square Card) + cart → Shopify-hosted checkout. Everything else is post-launch.

## Page structure

**Homepage (`/`)** — hero, bulk math argument, Shmo family grid, how it works, real results, testimonials, FAQ, final CTA. ✅ Built.

**Shmo Review (`/shmo-review`)** — category page doubling as shop listing. Routes to 3 PDPs. ⏳ Next focus.

**Product pages:**
- `/shmo-review/cr-80` — CR-80 wallet card ⏳
- `/shmo-review/l-sign` — L-Sign acrylic counter standee ⏳
- `/shmo-review/square-card` — Square card ⏳

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
- **Single source of truth for design tokens = `app/globals.css`** — `DESIGN.md` is a companion at repo root; if they disagree, `globals.css` wins.
- **Mascot rule = icon-only, max 32px** — no mascot in hero stages, no mascot composed with 3D imagery.

## Decisions still open

- Final retail pricing for each SKU
- Bundle pack sizes and per-unit discounts
- Exact copy for coming-soon pages
- GHL webhook URL for email capture (Jordan supplies when ready)

## Open questions before launch

- Real pricing — Shopify currently showing placeholder prices
- Third video testimonial (Carly + Joey confirmed, third pending)
- Shopify handle rename: `google-review` → `shmo-review` (post-launch SEO)
