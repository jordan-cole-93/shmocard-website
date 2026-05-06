# ShmoCard — Brand & Business Context

This document gives you the business, brand, and audience context for ShmoCard. It is not a layout brief. It tells you *what* the brand is, *who* it sells to, and *what each page needs to do* — so you can decide independently how to design and structure the experience.

---

## What ShmoCard is

ShmoCard is a hardware + software toolkit for local business owners worldwide. The flagship product is an **NFC card that, when tapped by a customer's phone, opens that business's Google review page directly** — no app, no login, no friction. Three more products are on the roadmap.

The website at `ShmoCard.com` is the brand's **retail front door**. Traffic arrives from organic search, direct visits, word of mouth from existing customers, and referrals from peers. 

A visitor's job, when they land, is to confirm in under thirty seconds:
1. This is a real tool.
2. It's sold by people who understand how a small shop actually runs.
3. It will solve their review problem without disrupting their day.

If those three things click, they convert — either by buying a card (Shmo Review is live) or joining a waitlist (Shmo Biz, Shmo Link, Shmo Reputation are coming soon).

---

## Who buys this

Local business owners, worldwide. Real shops with a counter and a small crew.

Typical buyer profiles:
- Pawn shop owners
- Barbers and barbershop owners
- Auto mechanics and shop owners
- Jewelers
- Roofers and home-service operators
- Salon owners
- Independent retailers, cafés, restaurants, mobile service crews

They are **not technical**. They have heard "you need more Google reviews" for years but have never found a tool that actually fits how their shop operates day to day. They trust peers and tradesmen more than marketers. They have been pitched a lot of things and are tired of slick. They do not want to read a manual. They want to hand a card to a customer and have a five-star review appear.

When they arrive on the site they are usually one of two people:
- **Active shopper** — they saw a competitor using a card, heard about it from another shop owner, or are actively searching for "NFC review card" / "Google review tap card."
- **Returning customer** — they already own cards and are checking on a new product, restocking, or referring a friend.

The site does not need to convince a stranger they have a review problem. It needs to convince someone who already knows they have one that this is the right tool.

---

## Product family overview

| Product | What it is | Status |
|---|---|---|
| **ShmoReview** | NFC cards / L signs / Plate that open a business's Google review page on tap | **Live — flagship** |
| **ShmoBiz** | NFC business cards (digital + physical) — replaces paper business cards | Coming soon |
| **ShmoLink** | Link-in-bio for local businesses — one tap, all the important links | Coming soon |
| **ShmoReputation** | AI-powered Google review auto-responder — replies to every review | Coming soon |

Shmo Review has three formats, each its own product page:
- **CR-80 Card** — wallet-size, the core product
- **L-Sign** — counter-top acrylic standee
- **Plate Card** — square format that sticks to surfaces

Detailed product info lives in `product.md`.

---

## What each page needs to do

These are the three pages this design pass covers. I am giving you the *job* of each page, not the sections. You decide structure.

### 1. Homepage — ShmoCard (parent brand)

**URL:** `/`

**The job:** Introduce the parent brand and present all four products as a coherent toolkit. A first-time visitor should leave understanding that ShmoCard is a *family of tools for local crews* — not just one NFC card. The locked hero headline is **"The toolkit your crew's been missing."**

This page promotes all four sub-brands **with equal weight** — even though three are not yet live. Shmo Review converts to purchase; the other three convert to a waitlist (email captured to a webhook).

This is not a Shmo Review shop page. It is the parent doorway. A visitor who only wants a review card should be one click from Shmo Review. A visitor who's curious about the broader brand should understand the full vision.

### 2. Category page — Shmo Review

**URL:** `/shmo-review`

**The job:** Sell the Shmo Review category. Make the bulk math argument unmissable. Show all three formats (CR-80, L-Sign, Square Card) as a family and route shoppers to the right one. The locked headline is **"One tap. One five-star review."** A secondary locked tagline used elsewhere on this category is **"Built for crews. Priced for bulk."**

Visitors arrive here either from the homepage or from search. They are typically deciding *whether to buy at all* and *which format fits their shop*. The page must answer: what is this, why one per employee, how does it work, what does it cost, what do other shops say, what format do I need.

### 3. Product Page — Shmo Review CR-80 Google Review Card

**URL:** `/shmo-review/cr-80`

**The job:** Convert a buyer who has already decided they want an NFC review card. The CR-80 is the **core, best-selling, wallet-size format**. This page sells the specific product — pricing tiers, quantity, programming process (we ship pre-loaded with their Google review link), shipping speed, reprogrammability, returns. It must also reinforce the bulk math one more time at the moment of purchase, because a buyer ordering 1 card is a buyer who will not see the results.

Pricing, inventory, variants, and product images come from Shopify via the Storefront API. The design should accommodate a buy box but the prices themselves are not in this brief — they are managed in Shopify Admin and pulled at runtime.

---

## Hard rules

- **Never invent stats.** Verified proof points are listed in `marketing.md`. Anything not on that list is off-limits.
- **Live store protection.** The actual e-commerce store and checkout are Shopify-hosted. This site links *into* the existing store/checkout — it does not rebuild it.

---

## How to use the rest of this brief

- **`marketing.md`** — voice rules, locked headlines, sales copy fragments, proof points, testimonials, FAQ. Pull from this freely; do not invent new copy that contradicts it.
- **`product.md`** — full product catalog with technical specs, formats, compatibility, shipping, programming process, returns. Pull product-truth from here.
