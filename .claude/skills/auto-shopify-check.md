---
name: auto-shopify-check
description: "Fires when referencing Shopify product data in code — handles, prices, SKUs, product names, variants, cart, checkout. Validates against product catalog and backend rules. Triggers on: product handle, SKU, price, product name, Shopify, cart, checkout, variant, add to cart."
---

**When referencing any product data in code — validate it against the source of truth first.**

## Required reads

1. `.claude/rules/product.md` — product catalog, formats, SKUs, status
2. `.claude/rules/backend.md` — Shopify handles, API setup, env vars, checkout flow

## What to validate

| Check | Rule |
|---|---|
| Product handles | Must match Shopify exactly: `google-reviews-nfc-tap-card-cr80`, `google-review-nfc-tap-card-l-sign`, `google-review-plaque` |
| URL routing | `/shmo-review/cr-80` maps to handle `google-reviews-nfc-tap-card-cr80` — verify the mapping |
| Prices | Never hardcode — prices come from Shopify Storefront API |
| Product names | Never hardcode — names come from Shopify Storefront API |
| Images | Never hardcode URLs — images come from Shopify Storefront API |
| Cart flow | Cart managed via Shopify Cart API, checkout via `cart.checkoutUrl` redirect |

## The rule

**Data lives in Shopify. Code is presentation only.**

If you catch yourself typing a price, product name, or image URL directly into a component — stop. Fetch it from the API instead. Flag any hardcoded product data immediately and replace with a dynamic fetch.
