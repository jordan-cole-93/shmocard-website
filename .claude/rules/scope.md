# scope.md — Build Scope & Status

## Sitemap

Full site structure with every URL, page hierarchy, shared pages, partner programs, and utility pages lives here:

**Path:** `wireframe/sitemap.md`

Read this before building any page or navigation element.

---

## MVP scope (launch target)

Homepage + `/shmo-review` category page + 3 product pages (CR-80, L-Sign, Square Card) + cart → Shopify-hosted checkout. Everything else is post-launch.

## Page structure

**Homepage (`/`)** — Hero, bulk math argument, Shmo family grid, how it works, real results, testimonials, FAQ, final CTA.

**Shmo Review (`/shmo-review`)** — Category page doubling as shop listing. Routes to 3 PDPs.

**Product pages:**
- `/shmo-review/cr-80` — CR-80 wallet card
- `/shmo-review/l-sign` — L-Sign acrylic counter standee
- `/shmo-review/square-card` — Square card

**Shared (post-MVP):** Blog, Help Center, FAQ page, Affiliate, Reseller, Account, legal pages.

**Coming soon pages (post-MVP):** `/shmo-biz`, `/shmo-link`, `/shmo-reputation`

## Current status

**Last updated:** 2026-04-25
**Stage:** Fresh start. Previous session archived. Starting from scaffold.

## Wireframes

Page layouts and section structures live in `wireframe/`. Read the relevant wireframe before building any page or section.

| File | What it covers |
|---|---|
| `wireframe/sitemap.md` | Full site structure, all URLs, page hierarchy |
| `wireframe/home-page-shmocard.md` | Shmocard brand homepage |
| `wireframe/home-page-shmoreview.md` | Shmo Review category page |
| `wireframe/product-page-cr80.md` | CR-80 product page |
| `wireframe/product-page-l-sign.md` | L-Sign product page |
| `wireframe/product-page-square.md` | Square card product page |

Add new wireframes to `wireframe/` as pages are planned.

---

## What's next

1. Scaffold Next.js project
2. Set up Shopify Headless connection
3. Branding guide + design system locked
4. Build homepage
5. Build Shmo Review category page + 3 PDPs
6. Vercel deploy + Shopify webhooks

## Decisions locked

- **Headless Shopify** via Headless sales channel — not Shopify Plus
- **Shopify-hosted checkout** — custom checkout requires Shopify Plus (~$2,300/mo), out of budget
- **ReConvert** (or equivalent) for post-purchase upsells on Shopify thank-you page
- **S'more palette** — non-negotiable warm earth tones
- **"Built for crews. Priced for bulk."** — locked homepage headline
- **Warm Professional** — locked design direction (refined, hairlines, soft shadows — not neo-brutalist)
- **Data in Shopify, presentation in code** — never hardcode product data

## Decisions still open

- Final retail pricing for each SKU
- Bundle pack sizes and per-unit discounts
- Exact copy for coming-soon pages

## Open questions before launch

- Real pricing — Shopify currently showing placeholder prices
- Third video testimonial (Carly + Joey confirmed, third pending)
- Google Fonts setup for Inter Tight + Fraunces + JetBrains Mono
- Shopify handle rename: `google-review` → `shmo-review` (post-launch SEO)
