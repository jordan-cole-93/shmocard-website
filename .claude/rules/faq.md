# faq.md — Decision Log

Running log of important questions and their answers. Append new entries at the top. Skip throwaway questions — only log decisions, constraints, and knowledge worth keeping.

---

### 2026-04-25 — Why Shopify-hosted checkout instead of custom Stripe checkout?

**Q:** Why not build a fully custom checkout with Stripe?
**A:** Custom checkout with Shopify as the order backend requires Shopify Plus (~$2,300/mo) — out of budget for a $3,500 project. Non-Plus Shopify merchants must use Shopify's hosted checkout for the primary purchase flow. Shopify's checkout converts well (Allbirds, Gymshark use it). We do own everything up to checkout: landing pages, product pages, pre-checkout funnel, cart. Post-purchase upsells handled by ReConvert on Shopify's thank-you page.

---

### 2026-04-25 — Why use the Headless sales channel instead of a custom app?

**Q:** Why the Headless channel and not a custom Shopify app?
**A:** Shopify deprecated legacy "Custom Apps" on 2026-01-01. New Dev Dashboard apps require OAuth client-credentials, which is the wrong tool for a private headless storefront. The Headless sales channel is the correct 2026 path — it exposes Storefront API tokens (public + private) directly without an OAuth flow.

---

### 2026-04-25 — Does Stripe handle card purchases?

**Q:** Shouldn't Stripe handle checkout?
**A:** No. Stripe is reserved exclusively for the future software subscription (Shmo Reputation, Stripe Billing). All physical card purchase revenue goes through Shopify Payments on Shopify's hosted checkout.

---

### 2026-04-25 — What's the difference between this site and the GHL funnel?

**Q:** Is this the same as the Facebook Ads funnel?
**A:** No. Completely separate. The GHL funnel (`shmosoftware.com` URLs) targets cold Facebook Ad traffic with the free card + $7 shipping offer. This website (`shmocard.com`) is the retail front door for organic/direct/referral traffic at full retail pricing. The $7 offer must never appear on this website.
