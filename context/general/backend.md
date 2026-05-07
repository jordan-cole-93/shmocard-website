# backend.md — Technical Architecture

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS 4 |
| Animation | `framer-motion` for section reveals + drawer / modal entrances; CSS transitions for per-element hover (already in design-system `components.css`). Locked 2026-05-07 per `.planning/phases/02-design-system-review/DECISIONS.md` D-02. Constraints: subtle/fast/non-bouncy, match `--motion-*` tokens. |
| Hosting | Vercel |
| Backend | Shopify via Headless sales channel |
| Checkout | Shopify-hosted (redirect via `cart.checkoutUrl`) |
| Post-purchase upsell | ReConvert (Shopify app, ~$29/mo) |
| Payments | Shopify Payments (card purchases) + Stripe (future software subscription only) |
| Database | None — Shopify covers all backend needs |

## Shopify headless setup

The site connects to Shopify via the **Headless sales channel** (`Shmo Card Headless`).

- Product catalog, pricing, inventory, bundles, and page content live in **Shopify admin — not in code**
- Editing a product in Shopify admin updates the site in ~5 seconds via webhook revalidation
- The site uses **Storefront API** (GraphQL) for all product fetching and cart operations

**Ownership boundary:**
- **We own:** all landing pages, product pages, pre-checkout funnel, cart, design
- **Shopify owns:** final checkout page, order confirmation email, post-purchase upsell UI

## Cart → checkout flow

1. Customer browses product pages on our site
2. Cart managed via Shopify Cart API (`cartCreate`, `cartLinesAdd`, etc.)
3. Customer clicks "Checkout" → redirect to Shopify-hosted checkout via `cart.checkoutUrl`
4. Post-purchase upsell handled by ReConvert on Shopify's thank-you page

**Why not custom checkout?** Requires Shopify Plus (~$2,300/mo) — out of budget. Shopify's hosted checkout converts well (used by Allbirds, Gymshark).

## Webhooks + revalidation

Shopify product changes propagate in ~5 seconds:
1. Editor changes product in Shopify admin
2. Shopify fires webhook (`products create/update/delete`)
3. Webhook hits `app/api/revalidate/route.ts` with `?secret=XXX`
4. Handler validates secret, calls Next.js revalidation API
5. Site re-renders with fresh Shopify data

## Environment variables

| Var | Purpose |
|---|---|
| `SHOPIFY_STORE_DOMAIN` | `shmocard.myshopify.com` |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Storefront API read token (Headless channel) |
| `SHOPIFY_REVALIDATION_SECRET` | Webhook validation secret |

Set in `.env.local` locally. Mirror in Vercel dashboard at deploy time.

## Shopify product handles (live)

| Our slug | Shopify handle |
|---|---|
| `/shmo-review/cr-80` | `google-reviews-nfc-tap-card-cr80` |
| `/shmo-review/l-sign` | `google-review-nfc-tap-card-l-sign` |
| `/shmo-review/square-card` | `google-review-plaque` |
| Collection | `google-review` (rename to `shmo-review` post-launch) |

## What we don't use

- **Stripe for card purchases** — reserved for future software subscription (Stripe Billing) only
- **Shopify Admin API** — MVP is read-only from Shopify; no write operations needed
- **Custom checkout** — requires Shopify Plus

## Next.js notes

This version of Next.js has breaking changes — APIs, conventions, and file structure may differ from training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any new Next.js code. Heed deprecation notices.
