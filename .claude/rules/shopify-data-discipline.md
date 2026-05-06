# Shopify Data Discipline

**Data lives in Shopify. Presentation lives in code.** Don't blur the line.

## The rule

Anything that's a **product attribute** — name, price, description, SKU, inventory, image URL, handle, variant — belongs in Shopify Admin and gets fetched via the Storefront API at runtime.

Anything that's a **presentation decision** — layout, typography, colors, spacing, copy that frames the product (headlines, hero text, CTAs) — belongs in code.

## What this means in practice

| Thing | Where it lives | Where to fetch |
|---|---|---|
| Product name "Shmo Review CR-80" | Shopify Admin | `product.title` |
| Price `$24.00` | Shopify Admin | `product.priceRange.minVariantPrice` |
| Product photo URL | Shopify Admin (or CDN) | `product.images.nodes[0].url` |
| Variant options (size, finish) | Shopify Admin | `product.options` |
| Hero headline "Built for crews. Priced for bulk." | Code (component) | hardcoded in JSX |
| Section background color | Code (Tailwind utility) | `bg-snow` |
| FAQ answers | Code (`FAQ.tsx`) | hardcoded array |

## Hard rules

1. **Never hardcode product names, prices, or SKUs in components.** Always fetch from Shopify.
2. **Never hardcode product image paths in components.** Use the URL from `product.images.nodes[].url`.
3. **Never bypass the Storefront API for product data.** No scraping, no static JSON copies of the catalog.
4. **Use the right Shopify skill.** When writing GraphQL: invoke `shopify-plugin:shopify-storefront-graphql` first.
5. **Cart goes through Storefront API too.** `cartCreate`, `cartLinesAdd`, `cartLinesRemove`, etc.
6. **Checkout is Shopify-hosted.** Don't try to build a custom checkout — that requires Shopify Plus (~$2300/mo, out of scope).

## Why this matters

- **Pricing changes don't require deploys.** Jordan updates Shopify Admin → site reflects it on next page load.
- **Inventory stays accurate.** Real-time stock counts come from Shopify, not a stale code constant.
- **Single source of truth.** No drift between "what's in code" vs "what's in Shopify" — Shopify always wins.
- **Multi-currency / multi-region.** Shopify Markets handles localization; hardcoded prices break this.

## When the Placeholder rule and Shopify rule meet

In a component that displays a product:
- **Layout** is hardcoded in the component (placement of name, price, button).
- **Data** is fetched from Shopify (the actual name, price, image URL).
- **Image** uses `<Placeholder label="...">` during build, swapped for real `<img src={product.images.nodes[0].url}>` once the page is wired to Shopify.

## Enforcement

The `shopify-data-discipline` project skill auto-triggers when prompts mention product data, prices, SKUs, cart, or checkout. It loads this rule plus the relevant Shopify skill.
