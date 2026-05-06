# ShmoCard — Product Catalog

This document is the product-truth source. Specs, formats, how it works, compatibility, shipping, programming, returns. Pull product facts from here. Pricing and inventory live in Shopify and are pulled at runtime — they are not in this brief.

---

## The product family

| Product | What it is | Status |
|---|---|---|
| **ShmoReview** | NFC cards / signs / discs that open a business's Google review page on tap | **Live — flagship** |
| **ShmoBiz** | NFC business cards (digital + physical) | Coming soon |
| **ShmoLink** | Link-in-bio for local businesses | Coming soon |
| **ShmoReputation** | AI-powered Google review auto-responder | Coming soon |

Only ShmoReview is purchasable today. The other three accept email signups via a waitlist that posts to a webhook.

---

## ShmoReview — Live

The flagship product. An NFC card (or sign or disc) that, when tapped by a customer's phone, opens that business's Google review page directly. No app. No login. No QR-code gymnastics for the customer (though a QR code on the back of every product covers any phone that doesn't support NFC).

### Core argument

The product is priced and packaged for *bulk* — the entire commercial model assumes a shop is buying one card per crew member, not a single unit.

### How it works (full process)

1. The owner orders cards — one per employee — and provides their business's Google review link at checkout.
2. We program every card with that link before it ships. Cards arrive ready to use.
3. After every transaction, an employee hands a card to the customer.
4. The customer taps the card with their phone.
5. Their phone opens the shop's Google review page. They tap five stars and type a sentence.
6. If their phone doesn't support NFC, the QR code on the back of the card does the same job.

The cards are **reprogrammable for life and free** — the destination URL can be updated from a dashboard at any time, so a business that rebrands or moves locations does not need to reorder.

### Three formats (each its own product page)

#### CR-80 Card *(core product, best seller)*
- **Format:** Wallet-size, credit-card dimensions
- **Material:** PVC
- **Use case:** The classic. Slips in a wallet, clips to a lanyard, lives in a back pocket.
- **One per employee.** This is the product that makes the bulk math work.
- **URL:** `/shmo-review/cr-80`
- **Shopify handle:** `google-reviews-nfc-tap-card-cr80`

#### L-Sign *(counter-top standee)*
- **Format:** Acrylic tabletop stand, 4×6
- **Use case:** Lives next to the register. Guests tap on their way out — no staff prompt needed.
- **Best for:** Cafés, salons, retail counters where customers self-serve at the end.
- **URL:** `/shmo-review/l-sign`
- **Shopify handle:** `google-review-nfc-tap-card-l-sign`

#### Square Card *(disc / window cling)*
- **Format:** Square NFC disc, 2.25 inch diameter
- **Use case:** Sticks to anything — door, window, dashboard.
- **Best for:** Mobile crews, service vans, roofers, anywhere a counter doesn't exist.
- **URL:** `/shmo-review/square-card`
- **Shopify handle:** `google-review-plaque`

### Compatibility

- **iPhone:** XS and newer (2018+). NFC tap built in.
- **Android:** 5.0 (Lollipop) and newer. NFC tap built in.
- **Older phones / no NFC:** A QR code is printed on the back of every product. Same destination, same flow.
- **No app required.** The customer's existing browser handles the rest.

### Customization

- Every order is **printed with the shop's branding** — logo, shop name, color treatment.
- The destination URL (their Google review link) is programmed on the card before shipping.
- Cards are **reprogrammable for life** via a dashboard.

### Shipping

- Orders placed by **Tuesday 5pm CT ship Friday** of the same week.
- **Standard shipping:** 3 days.
- **Bulk orders (10+):** Ship free, expedited.

### Returns

- **30-day no-questions returns.** Box it back up, full refund.

### Onboarding the buyer's Google review link

Buyers without their Google review link can get it in under a minute:
1. Search the business name in Google Maps.
2. Click **"Ask for reviews."**
3. Copy the short link Google generates.
4. Paste it at checkout (or send it to support after).

Every card ships pre-programmed.

---

## ShmoBiz — Coming Soon

NFC business cards. Replaces paper business cards. Two formats:

- **Physical NFC business card** — tap to instantly share a contact profile (name, title, phone, website, social links).
- **Digital business card** — shareable link or QR code, no hardware needed.

Both deliver an **always-editable, always-up-to-date contact profile**, so an owner who changes role, phone number, or social handles never has to reprint cards.

**Status:** Pre-launch. Email capture only. No purchase flow yet.

---

## ShmoLink — Coming Soon

Link-in-bio for local businesses. One tap (NFC) or scan (QR) opens a branded page hosting all the business's important links — booking, menu, location, social, current promotion, ordering, hiring.

Built for shops that have a website *and* a booking platform *and* a social presence and want one entry point that aggregates everything.

**Status:** Pre-launch. Email capture only.

---

## ShmoReputation — Coming Soon

AI-powered Google review auto-responder. Automatically replies to every Google review — positive and negative — in the shop's voice, on behalf of the business.

- **Pricing model:** Software subscription, billed monthly.
- **Target price:** ~$50/month (separate from card purchases — billed via Stripe Billing, not Shopify).
- **Why:** Most shops never reply to reviews. Replying is a known ranking factor and a trust signal. Auto-responder removes the "I'll get to it later" gap.

**Status:** Pre-launch. Email capture only.

---

## Pricing & inventory

Pricing, variants (quantity tiers, format options), inventory levels, and product images are all managed in **Shopify Admin** and pulled into the website at runtime via the Shopify Storefront API.

Do not hardcode prices, SKUs, or product names into the design. The buy box on each product page expects:
- Product title (from Shopify)
- Price range / starting price (from Shopify)
- Variant selector — typically a quantity tier (10, 25, 50, 100, custom)
- Add-to-cart button (links to Shopify cart)
- Product image gallery (from Shopify)

The actual pricing tiers are confidential to this brief — the design just needs to accommodate a tiered quantity selector with a starting-from price.

---

## Checkout

Checkout is **Shopify-hosted**. The Add-to-cart button leads into Shopify's checkout flow. The website does not build a custom checkout. From the design's perspective: a click on "Add to cart" begins the existing Shopify cart/checkout experience.

---

## Why this product family exists

Local businesses lose money on review gaps every week. The cause is rarely "the customer didn't want to leave a review" — it's that the moment of asking is missed. Employees forget, get awkward, or don't have a tool. Customers intend to but never get around to it.

ShmoCard's bet is that **every problem of asking is a hardware problem**. Give the crew something to hand over, and the ask happens. Give it to one employee — incremental. Give it to the whole crew — transformational. That single insight is why the entire family of products exists, and it generalizes: Shmo Biz, Shmo Link, and Shmo Reputation all apply the same logic ("put the right tool in the right hand at the right moment") to adjacent local-business problems.
