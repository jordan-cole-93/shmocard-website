# product.md — Product Catalog

## Product family

| Product | Status | Route |
|---|---|---|
| **Shmo Review** | Live — flagship | `/shmo-review` |
| **Shmo Biz** | Coming soon | `/shmo-biz` |
| **Shmo Link** | Coming soon | `/shmo-link` |
| **Shmo Reputation** | Coming soon | `/shmo-reputation` |

---

## Shmo Review — Live

NFC card that, when tapped by a customer's phone, opens their Google review page directly. No app, no login, no friction.

**Core argument:** One card per employee, not one per shop. One behind the counter = ~2 reviews/week. One per employee = ~15 reviews/week.

**How it works:**
1. Business orders cards — one per employee
2. Each card programmed with their Google review link
3. Employee hands card to customer after transaction
4. Customer taps → Google review page opens instantly
5. QR code on back as fallback

### Three formats (each has its own product page)

| Format | Route | Shopify handle | Description |
|---|---|---|---|
| **CR-80 Card** | `/shmo-review/cr-80` | `google-reviews-nfc-tap-card-cr80` | Standard wallet-size NFC card. Core product. One per employee. |
| **L-Sign** | `/shmo-review/l-sign` | `google-review-nfc-tap-card-l-sign` | Acrylic counter-top standee. Stands upright at eye level. |
| **Square Card** | `/shmo-review/square-card` | `google-review-plaque` | Square NFC card format. |

> Pricing is managed in Shopify admin — never hardcode prices in code or copy.

---

## Shmo Biz — Coming Soon

Business identity product. Replaces paper business cards.

**Two formats:**
- **Digital business card** — shareable link/QR code, no hardware needed
- **Physical NFC business card** — tap to share contact profile instantly

Both deliver: name, title, phone, website, social links — always editable, always up to date.

---

## Shmo Link — Coming Soon

Link-in-bio product for local businesses. One tap or scan opens a branded page with all the business's important links.

---

## Shmo Reputation — Coming Soon

AI-powered Google Review auto-responder. Automatically responds to every review — positive and negative — on behalf of the business. Pricing: ~$50/month (software subscription via Stripe Billing — separate from card purchases).

