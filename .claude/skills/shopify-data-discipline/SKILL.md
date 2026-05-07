---
name: shopify-data-discipline
description: Use when touching product data, prices, SKUs, cart, checkout, or any Shopify-sourced content. Enforces the rule "data lives in Shopify, presentation lives in code" and routes to the Storefront API skill for queries.
---

# Shopify Data Discipline — workflow skill

Auto-triggers when Claude is touching anything related to product data, pricing, inventory, or cart/checkout.

## When this fires

Triggers on prompts mentioning: product / price / SKU / variant / inventory / stock / cart / checkout / Shopify / Storefront / collection.

## The rule

**Data lives in Shopify. Presentation lives in code.**

| Thing | Where it lives | Where to fetch |
|---|---|---|
| Product name, price, image URL | Shopify Admin | Storefront API |
| Variants (size, finish) | Shopify Admin | Storefront API |
| Inventory / stock | Shopify Admin | Storefront API |
| Layout | Code | Tailwind utilities (layout/spacing only) |
| Typography, colors, radii, shadows, motion | Code | `.shm-*` classes + tokens from `context/design-system/colors_and_type.css` (per `.claude/rules/design-system.md`) |
| Marketing copy (hero headlines, CTAs) | Code | hardcoded in JSX |
| FAQ answers | Code | hardcoded in component |

## What Claude should do

### 1. Always read `.claude/rules/shopify-data-discipline.md` first

That rule file is the source of truth for this discipline.

### 2. Invoke the Shopify Storefront skill

For any GraphQL query/mutation work: invoke `shopify-plugin:shopify-storefront-graphql` for the authoritative API reference.

### 3. Use the right query patterns

- **Product fetch:** by handle, ID, or query string. Always include `images`, `priceRange`, `availableForSale`.
- **Cart create:** `cartCreate` mutation with line items.
- **Cart update:** `cartLinesAdd` / `cartLinesUpdate` / `cartLinesRemove`.
- **Checkout:** redirect to `cart.checkoutUrl` (Shopify-hosted, NOT custom).

### 4. Never hardcode

- ❌ Never hardcode product names, prices, SKUs, or image URLs in components.
- ❌ Never bypass Storefront API by storing product data in JSON or a CMS.
- ❌ Never write to Shopify Admin API from this repo (read-only is the rule).
- ❌ Never use Storefront API tokens in client-side code without scoping (use `.env.local` + server components).

### 5. Combine with the Placeholder rule during build

When building a product component **before** the Shopify wiring is in place:
- Layout is hardcoded in the component (placement of name, price, CTA).
- `<Placeholder label="product name">`, `<Placeholder label="price">`, `<Placeholder label="product photo">` for the data slots.
- Wire to Shopify in a later step — replace placeholders with `{product.title}`, `{product.priceRange.minVariantPrice.amount}`, `<img src={product.images.nodes[0].url} />`.

## What's out of scope

- **Admin API writes** — creating/updating products, orders, customers from this repo. Requires explicit Jordan approval.
- **Custom checkout** — needs Shopify Plus (~$2300/mo). Use Shopify-hosted checkout.
- **Static product JSON** — no offline catalogs, no scraping.

## Enforcement

- A pre-tool-use hook in `.claude/settings.json` validates Shopify-related Bash commands aren't destructive.
- The rule lives in `.claude/rules/shopify-data-discipline.md` (full detail).
- This skill auto-loads the rule + the Storefront API skill so all three travel together.

## References

- `.claude/rules/shopify-data-discipline.md` — full rule
- `.claude/rules/live-store-protection.md` — what's safe vs unsafe
- `shopify-plugin:shopify-storefront-graphql` — API reference
- `backend.md` — env vars, tokens, Vercel config
