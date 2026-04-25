
## Overview

Shmocard is the parent brand of an ecommerce site with **four sub-brand categories**. Each sub-brand is a category inside the main Shmocard site — not a standalone website. All sub-brands share the same parent-level pages (cart, account, blog, help center, affiliate program, etc.).

- **Parent brand:** Shmocard
- **Sub-brands:** Shmo Review, Shmo Biz, Shmo Link, Shmo Reputation
- **Nav pattern:** Sub-brands appear as menu items; selecting one opens that category's page, from which the user can browse the products within.

---

## Page hierarchy

### 1. Homepage

- **URL:** `/`
- **Type:** Full marketing homepage
- **Contents:** Hero, value proposition, testimonials, showcase of all four sub-brands

### 2. Sub-brand category pages

Each sub-brand has its own category landing page.

#### 2.1. Shmo Review `/shmo-review` — LIVE

- **Type:** Category landing page
- **Note:** This page doubles as the "shop all review cards" listing — there is no separate collection page above the products.
- **Products:**
    - CR-80 Card — `/shmo-review/cr-80` — sales page
    - L Sign — `/shmo-review/l-sign` — sales page
    - Square Card — `/shmo-review/square-card` — sales page

#### 2.2. Shmo Biz `/shmo-biz` — COMING SOON

- **Type:** Coming soon page
- **Note:** Digital business card + physical NFC business card. No products yet.

#### 2.3. Shmo Link `/shmo-link` — COMING SOON

- **Type:** Coming soon page
- **Note:** Linktree-style product. When live, the sub-brand page will be an overview/positioning page and will have its own dedicated sales page.

#### 2.4. Shmo Reputation `/shmo-reputation` — COMING SOON

- **Type:** Coming soon page
- **Note:** AI Google review auto-reply + reputation dashboard. When live, the sub-brand page will be an overview/positioning page and will have its own dedicated sales page.

---

## Shared content pages (filterable by sub-brand)

Single pages that can be filtered by sub-brand — not duplicated per sub-brand.

### Blog `/blog`

- Blog index — `/blog`
- Post template — `/blog/:slug`
- Filterable by sub-brand

### Help Center `/help`

- Help index — `/help`
- Article template — `/help/:slug`
- Search — `/help/search`
- Filterable by sub-brand

### FAQ `/faq`

- FAQ page — `/faq`
- Filterable by sub-brand

---

## Partner programs

### Affiliate program — open to anyone

- Landing page — `/affiliate`
- Signup — `/affiliate/signup`
- Affiliate dashboard — `/affiliate/dashboard`

### Reseller program — agencies only

- Landing page — `/reseller`
- Application — `/reseller/apply`
- Reseller dashboard — `/reseller/dashboard`

---

## Account pages

- Cart — `/cart`
- Order confirmation / thank you — `/thank-you`
- Customer account — `/account`

---

## Global utility pages

Linked from the main nav and/or footer.

- About — `/about`
- Contact — `/contact`
- Terms of service — `/terms`
- Privacy policy — `/privacy`
- Refund policy — `/refund`
- Shipping policy — `/shipping`
- 404 / not found — `/404`
- Search results — `/search`
- Sitemap / robots — `/sitemap.xml`, `/robots.txt`

---

## Tree view

```
Shmocard Homepage (/)
│
├── Shmo Review (/shmo-review) [LIVE]
│   ├── CR-80 Card (/shmo-review/cr-80)
│   ├── L Sign (/shmo-review/l-sign)
│   └── Square Card (/shmo-review/square-card)
│
├── Shmo Biz (/shmo-biz) [COMING SOON]
│
├── Shmo Link (/shmo-link) [COMING SOON]
│
└── Shmo Reputation (/shmo-reputation) [COMING SOON]

Shared content (filterable by sub-brand)
├── Blog (/blog) → Post template (/blog/:slug)
├── Help Center (/help) → Article template (/help/:slug), Search (/help/search)
└── FAQ (/faq)

Partner programs
├── Affiliate (/affiliate) — open to anyone → Signup, Dashboard
└── Reseller (/reseller) — agencies only → Apply, Dashboard

Account
├── Cart (/cart)
├── Order confirmation (/thank-you)
└── Customer account (/account)

Utility pages (footer)
About, Contact, Terms, Privacy, Refund, Shipping, 404, Search, Sitemap
```

---

## Rules

- Sub-brands are categories inside the Shmocard site, not standalone brand sites. They do not have their own About, Contact, Blog, etc. Everything shared lives at the parent level.
- Blog, Help Center, and FAQ are scoped via filters, not duplicated per sub-brand.
- Shmo Review's category page doubles as the "shop all review cards" listing.
- Only Shmo Review is live. Shmo Biz, Shmo Link, and Shmo Reputation are Coming Soon pages for now.