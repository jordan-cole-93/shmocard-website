# Requirements: Shmocard Website

Source-of-truth requirements for the Shmocard brand website. Derived from `context/general/context.md` ("What each page needs to do") + `context/general/scope.md` Phase 3 punch list + `context/general/backend.md` integration notes.

## Active

### REQ-01 — Homepage (parent brand)

**URL:** `/`
**Job:** Introduce the parent brand and present all four products as a coherent toolkit. First-time visitor leaves understanding ShmoCard is a *family of tools for local crews* — not just one NFC card.

**Acceptance:**
- Hero uses locked headline "The toolkit your crew's been missing." (Bricolage 800, ember accent on 1–2 words max).
- All four sub-brands surfaced with equal visual weight (Shmo Review, Shmo Biz, Shmo Link, Shmo Reputation), even though only Shmo Review is live.
- Shmo Review CTA → purchase path. Other three CTAs → waitlist (email captured to GHL webhook).
- Section rotation follows the 4-color rule (marsh → graham → marsh → ember → marsh → cocoa).
- One click from hero to `/shmo-review` for visitors who only want a review card.

### REQ-02 — Shmo Review category page

**URL:** `/shmo-review`
**Job:** Sell the Shmo Review category. Make the bulk math argument unmissable. Show all three formats as a family and route shoppers to the right one.

**Acceptance:**
- Locked headline "One tap. One five-star review."
- Locked tagline "Built for crews. Priced for bulk." appears at least once.
- Answers six questions: what is this, why one per employee, how does it work, what does it cost, what do other shops say, what format do I need.
- Three format cards (CR-80, L-Sign, Square Card) link to their PDPs.
- Bulk math is visible above the fold or directly after the hero.

### REQ-03 — Shmo Review CR-80 PDP (flagship)

**URL:** `/shmo-review/cr-80`
**Shopify handle:** `google-reviews-nfc-tap-card-cr80`
**Job:** Convert a buyer who has already decided they want an NFC review card. CR-80 is the wallet-size flagship.

**Acceptance:**
- Buybox layout uses `.shm-buybox-sticky` from the design system (sticky bar slides DOWN from top on scroll — never recreate).
- Pricing tiers, quantity, programming process (we ship pre-loaded with Google review link), shipping speed, reprogrammability, returns — all surfaced.
- Bulk math reinforced once more at point of purchase.
- Product name, price, image, variants come from Shopify Storefront API at runtime — never hardcoded.

### REQ-04 — Shmo Review L-Sign PDP

**URL:** `/shmo-review/l-sign`
**Shopify handle:** `google-review-nfc-tap-card-l-sign`
**Job:** Convert buyers wanting the counter-top acrylic standee.

**Acceptance:**
- Same buybox + Storefront API discipline as REQ-03.
- L-Sign-specific value props (visibility, no countertop hardware, swap during shifts).

### REQ-05 — Shmo Review Square Card PDP

**URL:** `/shmo-review/square-card`
**Shopify handle:** `google-review-plaque`
**Job:** Convert buyers wanting the square plate format that adheres to surfaces.

**Acceptance:**
- Same buybox + Storefront API discipline as REQ-03.
- Plate-specific value props (mounting locations, adhesive, surface compatibility).

### REQ-06 — Shopify Storefront API integration

**Job:** All product data, cart operations, checkout redirect.

**Acceptance:**
- Storefront API queries fetch product, collection, and cart data. Read-only.
- Cart mutations: `cartCreate`, `cartLinesAdd`, `cartLinesRemove`, `cartLinesUpdate`. Persisted via Shopify cart ID in cookie/localStorage.
- "Checkout" button redirects to `cart.checkoutUrl` (Shopify-hosted).
- Env vars `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN` set in `.env.local` and Vercel.
- No Admin API writes anywhere in the codebase.

### REQ-07 — Webhook revalidation

**Path:** `app/api/revalidate/route.ts`
**Job:** Shopify product changes propagate to the site in ~5 seconds.

**Acceptance:**
- Receives Shopify webhook (`products create / update / delete`).
- Validates `?secret=` against `SHOPIFY_REVALIDATION_SECRET`.
- Calls Next.js revalidation API for affected paths.
- Site re-renders with fresh Shopify data within ~5 seconds.

### REQ-08 — Waitlist capture (Shmo Biz / Shmo Link / Shmo Reputation)

**Job:** Capture interest emails for the three coming-soon sub-brands.

**Acceptance:**
- Each sub-brand surface (homepage spotlight, future dedicated pages) has a waitlist form.
- Submission posts to GHL webhook URL (TBD — open decision).
- Confirmation state shown without page reload.
- No spam protection bypass — at minimum honeypot or simple rate limit.

### REQ-09 — Design system integration

**Job:** Wire `context/design-system/` into the codebase without breaking the system's invariants.

**Acceptance:**
- All four bundled fonts (Bricolage Grotesque, Cherry Bomb One, Inter Tight, Shadows Into Light Two) mounted via `app/layout.tsx`.
- Tokens from `colors_and_type.css` available globally — either imported into `app/globals.css` or transcribed into Tailwind 4 `@theme`.
- Primitives from `components.css` available — either imported or component-wrapped in React.
- Every utility class used in code is `.shm-` prefixed. No `.btn`, `.card`, `.bg-cocoa` without `shm-`.
- No primitive restyles in page CSS. Page-level files own LAYOUT only.
- No gradients, no drop-shadow blurs, no left-border accent stripes. Wave dividers only.
- Section rotation = `marsh / graham / ember / cocoa` only.
- Mascot used as sticker, max 140px, max 2 per page (max 200px on homepage spotlight only).

### REQ-10 — Launch readiness

**Job:** Site is shippable to `shmocard.com`.

**Acceptance:**
- Mobile pass: every page renders correctly at 375px, 414px, 768px, 1024px, 1440px.
- A11y pass: keyboard nav, alt text, semantic HTML, color contrast WCAG AA.
- Lighthouse: Performance ≥ 90, Accessibility ≥ 95.
- Vercel env vars mirrored from `.env.local`.
- DNS cutover plan agreed with Jordan; `shmocard.com` resolves to Vercel.
- Live-store-protection sanity check — no Admin API references in codebase.

## Out of Scope

- **Custom checkout** — see PROJECT.md.
- **Admin API writes** — see PROJECT.md.
- **Stripe payments for card purchases** — reserved for future software subscription.
- **Multi-currency / multi-region** — relies on Shopify Markets; defer to future milestone.
- **Search / filtering on category page** — only 3 formats, no need.
- **User accounts / login on the marketing site** — checkout handles auth via Shopify hosted flow.
- **Blog / CMS** — out of scope for v1.
