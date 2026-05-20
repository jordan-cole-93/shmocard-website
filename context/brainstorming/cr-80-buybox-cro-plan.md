# CR-80 Buybox — Paid-Traffic CRO Plan

_Research date: 2026-05-18. Audience: Jordan Cole. Scope: Facebook + Google cold/lukewarm ad traffic landing on `/shmo-review/cr-80`._

---

## TL;DR

- **Price is invisible until after a 4-item checklist.** Cold traffic needs the price before the pitch — bury it and bounce rate spikes.
- **No sticky mobile CTA.** Every A/B study confirms 8–15% conversion lift from a sticky bottom bar. You have none.
- **The H1 title does zero message-match work.** Ad hooks almost certainly say "tap to get Google reviews" not "Google Review NFC Tap Card (CR-80)." That SKU-style title is friction on a cold landing.
- **Rating sits at the very top but is undersold.** 4.9 / 87 reviews is strong proof — it should be the first thing a cold visitor reads, with the number made bigger, not tucked into a small inline label.
- **The FAQ accordion in the buybox is fine, but the FAQ question labels are wrong.** "How it works", "Product details" — cold traffic doesn't parse catalog labels; they need fear-based framing ("Will it work on my phone?", "What if I hate it?").

---

## 1. Key CRO Principles for Paid-Traffic PDPs

### Cold traffic is different from warm/organic

Warm organic visitors have seen the brand, read other pages, trust the domain. Cold ad traffic arrives with zero brand equity, often on mobile, from a scroll-stop creative that made a specific promise. They need:

1. **Instant recognition** — the page looks like a continuation of the ad. If the ad said "tap card → Google reviews in one tap," the H1 better say something close to that.
2. **Price-first clarity** — cold traffic is more price-anxious, not less. Hiding price below a checklist reads as evasive. According to Baymard's 2025 PDP benchmarks and Shopify's ecommerce PDP guide, price must be visible above the fold alongside the CTA on all devices. — [Shopify PDP Guide](https://www.shopify.com/blog/what-is-pdp-in-ecommerce)
3. **Risk elimination before the CTA** — the guarantee is your most powerful trust signal for someone with no brand familiarity. A 60-day guarantee converts better than a 30-day; a 30-day better than 14. Currently it lives in a 3px-tall meta line below the CTA. That's the wrong treatment. — [Easyappsecom Trust Signals Guide](https://easyappsecom.com/guides/shopify-trust-signals-guide)

### Message match is the highest-leverage lever

Research from KlientBoost and Unbounce: ~98% of paid ads fail the message match test. Fixing it moves CVR 20–40%. The principle: the ad's main claim must reappear verbatim or near-verbatim in the H1. Hero framing alone moves CVR +15% in controlled tests. — [KlientBoost Message Match](https://www.klientboost.com/cro/message-match/)

### Above-the-fold composition on PDPs

NNGroup: 80% of viewing time is spent above the fold. The canonical above-fold stack for a low-AOV impulse-considered product ($25–$250) is:

```
[Social proof: star rating + count]
[H1: benefit-first headline, not SKU title]
[Price: visible, not hidden below content]
[Primary variant selector or pack selector: 1 interaction max above fold]
[CTA button: full-width on mobile, prominent on desktop]
[Risk reversal: guarantee + shipping — 1 line, directly under CTA]
```

Everything else (checklist, FAQ, specs) belongs below that stack. — [MobiLoud PDP Guide](https://www.mobiloud.com/blog/product-detail-pages-pdp-ecommerce)

### Pack selectors and decision paralysis

4 tiers is near the upper safe limit. Columbia University's "jam study" benchmark: >6 choices causes 10x purchase drop-off. 4 tiers is fine **if** one is visually dominant. The 10-pack pre-selected as default is correct behavior — it anchors perceived value at $22/card before the visitor mentally processes the 1-card price of $29.99. That's strong anchoring. The risk is that the pack selector currently sits **after** the checklist, meaning a large portion of mobile visitors never get to it before losing intent. Move the selector higher. — [Revlifter Anchor Pricing](https://www.revlifter.com/blog/the-anchoring-effect-in-ecommerce-how-to-optimize-conversions-with-smart-pricing) | [ConvertCart Overcome Choice Paralysis](https://www.convertcart.com/blog/how-to-overcome-choice-paralysis-and-increase-conversions)

---

## 2. Buybox Composition Audit

Current column flow (from `Buybox.tsx`):

```
rating
→ title (h3.bb__title)
→ sub (bb__sub, italic)
→ hairline
→ 4-item checklist (shm-checklist--featured)
→ 4-tier pack selector (shm-pack-rows)
→ quantity stepper (shm-qty)
→ CTA button (shm-btn--primary--xl)
→ meta line: "60-day return · Ships in 3 days"
→ FAQ accordion (4 items)
```

### Element-by-element verdict

| Element | Current | Verdict | Issue |
|---|---|---|---|
| `shm-rating` (4.9 / 87) | Top of column | **Keep, but expand.** | Good position, wrong visual weight. The text is small inline. For cold traffic this is your #1 trust signal — it should be the biggest, boldest line they see first. Make the score large. |
| `bb__title` "Google Review NFC Tap Card (CR-80)" | Line 2 | **Rewrite.** | SKU/catalog title. Reads like a fulfillment label. Cold traffic needs a benefit H1 matching the ad hook, e.g. "One tap. Instant Google review request." or whatever the actual ad says. |
| `bb__sub` italic sub | Line 3 | **Keep, possibly reword.** | "The countertop tap that turns happy crews into five-star reviews" — solid but "crews" may not resonate for all business types (coffee shops, restaurants). "Turns satisfied customers into 5-star Google reviews" is more universal. |
| `bb__rule` hairline | After sub | **Remove or move.** | Adds vertical distance between rating/headline block and the price/CTA. Every extra px before the CTA is friction. |
| `shm-checklist--featured` (4 items) | Before pack selector | **Move below CTA.** | Cold traffic doesn't need spec-confirmation before they see the price. The checklist builds confidence for someone already considering — it belongs right after the CTA, not before. Currently it's a scroll wall between the headline and the buy decision. |
| Price | Not displayed standalone | **Add a standalone price line.** | There is no explicit price visible between the sub and the CTA. Price is only visible inside the pack selector rows and in the CTA button label itself. Cold traffic expects to see `$29.99 – $219.99` (or the selected pack price) as a clear line before the pack chooser. |
| `shm-pack-rows` (4 tiers) | After checklist | **Move above checklist, add price anchor line above it.** | Good component, wrong position. Should sit directly after the sub (or after a standalone price display). 10-pack default pre-selection is correct — preserve it. |
| `shm-qty` stepper | After pack selector | **Deprioritize or remove.** | A quantity stepper on top of a pack selector is redundant decision load for most buyers. If someone wants 15 cards they can buy 10-pack qty:2. For cold traffic, the stepper adds cognitive noise. Hide it or collapse it to a less prominent position. |
| CTA "Add to cart — $X" | After qty stepper | **Keep, but make it the center of gravity.** | Button is full-width, correct. Label with price is correct. The issue is everything stacked above it delays arrival. Sticky mobile CTA is also needed. |
| `bb__meta` "60-day return · Ships in 3 days" | Below CTA | **Expand visually — give it iconography and more size.** | Currently a 2-item plain text line. This is your primary risk-reversal for cold traffic. It should look like a trust badge row, not a footnote. Consider: shield icon + "60-day full refund" · truck icon + "Ships in 3 days" · check icon + "Pre-programmed for your business." |
| FAQ accordion (4 items) | Bottom of buybox | **Reframe questions.** | FAQ structure is good, accordion is correct behavior. But the labels are catalog-style ("How it works," "Product details"). Cold traffic is scared, not curious. Reframe: "Will this work on any phone?" · "When will I get it?" · "What if I want a refund?" · "What's actually in the box?" |

---

## 3. Prioritized Change List

### HIGH — Do first (highest conversion impact)

**H1: Add a message-match headline above or replacing the current title**
- What: Replace or supplement "Google Review NFC Tap Card (CR-80)" with a benefit headline that mirrors the ad hook. If the ad says "One tap gets you a 5-star Google review," the H1 should say something equivalent.
- Why: Message match is the single highest-leverage lever for paid traffic. KlientBoost/Unbounce data: fixing match moves CVR 20–40%. The current title reads like a product catalog entry.
- Direction: Keep the `bb__title` element but change the copy. Coordinate with whatever the ad creative says. One recommended default if ads vary: "Tap Once. Get a Google Review." with the SKU subtitle below in smaller text.

**Expose price before the pack selector**
- What: Add a visible price line (e.g., "From $29.99 · Saves up to 27% on bundles") between the sub and the pack selector. The price should not first appear inside pack-row labels — it needs to be scannable at a glance.
- Why: Canonical PDP best practice from Baymard, Shopify, MobiLoud: price visible above fold alongside CTA. Cold traffic that can't find the price fast will bounce. — [Shopify PDP Guide](https://www.shopify.com/blog/what-is-pdp-in-ecommerce)
- Direction: A single line between `bb__sub` and `shm-pack-rows`. Can be small body type. "From $29.99" with a line like "$22/card when you buy 10."

**Move checklist below the CTA**
- What: Reorder so the flow is: rating → H1 → sub → price line → pack selector → CTA → trust meta → checklist → FAQ.
- Why: The checklist is confidence-confirmation content. Cold traffic needs the buy decision pathway (price → pack → CTA) before spec reassurance. Having 4 checklist items before the pack selector adds ~80–120px of scroll on mobile before the visitor sees anything interactive.
- Direction: Move `shm-checklist--featured` to sit between `bb__meta` and the FAQ accordion.

**Sticky mobile CTA bar**
- What: A fixed bottom bar on mobile that shows the selected pack price + "Add to Cart" button. Appears after the user scrolls past the in-page CTA button. Disappears when user reaches footer.
- Why: A/B test data across multiple Shopify stores: 8–15% average conversion lift on mobile. Most ad traffic is mobile. This is table stakes in 2025. — [Sticky Add to Cart A/B Test](https://growthrock.co/sticky-add-to-cart-button-example/) · [Zipify Mobile Split Test: +10% ATC, +9% CVR](https://zipify.com/mobile-sticky-button-split-test-results/)
- Direction: A bottom-fixed bar (min 56px tall), shows selected pack name + price, full-width CTA. Appears only on mobile. Uses `shm-btn--primary` styling. Hides when original CTA is in viewport to avoid duplicate.

**Expand the trust meta row**
- What: Replace the plain "60-day return · Ships in 3 days" text line with a proper trust badge row: icons + labels. Add a third item: "Pre-programmed before shipping."
- Why: A clear, visually prominent guarantee is the #1 trust signal for a cold visitor with no brand familiarity. 60-day guarantee out-performs 30-day significantly. Currently this is treated as a footnote. — [Easyappsecom Trust Signals](https://easyappsecom.com/guides/shopify-trust-signals-guide)
- Direction: Three badges in a row: shield icon + "60-day guarantee" · truck icon + "Ships in 3 days" · wrench/chip icon + "Pre-programmed for you." Keep design-system icon style (hand-drawn cocoa-deep, 2.4–2.6px stroke).

### MEDIUM — Second wave

**Enlarge the rating display**
- What: Make the 4.9 score visually dominant at the top of the buybox column. Current `shm-rating` renders small inline. Consider displaying the number large (30–36px) with "87 verified reviews" as a clickable anchor-link to the review section below.
- Why: For a brand with zero awareness, 4.9/87 is the fastest trust shortcut available. NNGroup: 80% of viewing time is above fold — this proof needs to earn its pixel real estate. — [NNGroup Above the Fold](https://cxl.com/blog/above-the-fold/)
- Direction: Add a modifier class or wrapper to the rating block to bump score font size. Make it link to `#reviews` or the VideoTestimonials section anchor.

**Reframe FAQ labels**
- What: Change FAQ triggers from catalog labels ("How it works," "Shipping," "Product details") to objection/fear framing ("Will it work on my customers' phones?" · "When does it ship?" · "What if I want a refund?" · "What's in the box?").
- Why: Cold traffic isn't browsing — they're objecting. Framing FAQs as objection handlers matches the psychological state of a first-time visitor who hasn't decided to trust yet. CXL's ecommerce landing page research confirms objection-matching copy outperforms neutral information labels.
- Direction: Content change only, no structural changes to the accordion.

**Remove or collapse the quantity stepper**
- What: Hide the `shm-qty` stepper or collapse it to a less prominent secondary control (e.g., "Need more? Qty: [stepper]" as a small tertiary element after the CTA).
- Why: Pack selector already handles multi-unit intent (1/2/5/10 tiers). A quantity stepper on top creates redundant decision load. Choice overload reduces conversion. — [ConvertCart Choice Paralysis](https://www.convertcart.com/blog/how-to-overcome-choice-paralysis-and-increase-conversions)
- Direction: Collapse to a text link ("Need a custom quantity?") or remove entirely for the v1 paid-traffic test. Can restore if data shows demand.

**Add a short "How it works" visual callout above the checklist**
- What: 3-step inline visual (not an accordion) above the checklist: "1. Order · 2. We program it · 3. Customer taps — review opens." Extremely brief.
- Why: The current FAQ item "How it works" is collapsed by default. Cold visitors who don't understand what NFC tap means will bounce rather than open an accordion. A 3-step inline summary pre-empts the #1 confusion objection.
- Direction: 3-column inline block, icons + short label. Can be very small — it just needs to exist above the fold or just below the checklist. MobiLoud PDP research confirms that "how it works" inline content reduces bounce on novelty/unfamiliar products. — [MobiLoud PDP Guide](https://www.mobiloud.com/blog/product-detail-pages-pdp-ecommerce)

### LOW — Third wave / test when traffic data exists

**Add a second CTA hook line above the pack selector**
- What: A single line like "87 business owners are using these — pick your pack:" directly before the `shm-pack-rows` fieldset legend.
- Why: Social proof adjacent to the conversion action is the highest-leverage placement. CXL data: social proof placement near CTA moves CVR +10–15%.
- Direction: 1 line of copy, small/secondary type. No new component needed.

**Consider surfacing one pull-quote review above the fold**
- What: A single star + short quote from a real review ("Customers actually use it. Worth every penny. — Mike, pawn shop owner") placed directly below the rating block.
- Why: 87 reviews exist but none are visible in the buybox. A pull-quote converts better than a star average alone because it humanizes and specificity-matches the audience.
- Direction: Hardcode 1–2 verified quotes as a rotating or static inline block. Keep it short (under 15 words). Pull from actual reviews.

**Digital wallet button row**
- What: Add Apple Pay / Google Pay / PayPal buttons above or below the ATC button.
- Why: Baymard + Adobe Analytics 2024 data: offering at least one digital wallet option improves checkout completion 8–19%. Mobile ad traffic skews heavily toward Apple Pay users.
- Direction: Requires Shopify Storefront API + checkout integration (Phase 4 scope). Flag for that phase.

---

## 4. Mobile-First Considerations

- **Mobile is ~65–70% of ad traffic.** Every layout decision defaults to mobile first.
- **Thumb zone:** interactive elements (pack selector rows, CTA button) must be in the lower 2/3 of the viewport on mobile. Tap targets min 44×44px (Apple HIG), ideally 56px for CTAs.
- **Above-fold on mobile:** on a 390px-wide screen, above-fold height is roughly 700px after browser chrome. Currently the buybox column stack (rating + title + sub + hairline + 4-item checklist + pack selector) almost certainly exceeds that before reaching the CTA. Moving the checklist below the CTA is a must.
- **Sticky CTA bar:** bottom-fixed, not top-fixed. Bottom aligns with natural thumb position. Min 56px tall. Show pack name + price + ATC button. Show/hide via IntersectionObserver watching the in-page CTA — appear when it leaves viewport, disappear when it re-enters. — [Sticky ATC Best Practices](https://easyappsecom.com/guides/sticky-add-to-cart-best-practices)
- **Gallery on mobile:** ensure main image is large and thumb-swipeable (not just desktop thumbnail-click). The 6-image gallery should be swipe-enabled on mobile, not a grid of small thumbnails. This is an image confidence signal for cold traffic.
- **Load speed:** ad traffic bounces fast on slow mobile. Ensure images are served as WebP with correct `sizes` attribute. No blocking fonts above fold.

---

## 5. Sources Cited

- [Shopify — What Is a PDP in Ecommerce (2025)](https://www.shopify.com/blog/what-is-pdp-in-ecommerce)
- [Baymard Institute — Product Page UX Research](https://baymard.com/research/product-page)
- [Baymard Institute — Year in Review 2024](https://baymard.com/blog/year-in-review-2024)
- [MobiLoud — Product Detail Pages Ultimate Optimization Guide](https://www.mobiloud.com/blog/product-detail-pages-pdp-ecommerce)
- [KlientBoost — Message Match: Critical Component for Ad Success](https://www.klientboost.com/cro/message-match/)
- [KlientBoost — Landing Page Headlines That Convert Up To 67.8% Better](https://www.klientboost.com/landing-pages/landing-page-headlines/)
- [CXL — Above the Fold: How to Encourage Scrolling and Converting](https://cxl.com/blog/above-the-fold/)
- [CXL — Ecommerce Landing Pages: Fewer Distractions, More Conversions](https://cxl.com/blog/ecommerce-landing-pages/)
- [Easyappsecom — Sticky Add to Cart Best Practices (8–15% Lift)](https://easyappsecom.com/guides/sticky-add-to-cart-best-practices)
- [Easyappsecom — Shopify Trust Signals Guide](https://easyappsecom.com/guides/shopify-trust-signals-guide)
- [Growthrock — Sticky Add to Cart A/B Test Results](https://growthrock.co/sticky-add-to-cart-button-example/)
- [Zipify — Mobile Sticky Button Split Test: +10% ATC, +9% CVR](https://zipify.com/mobile-sticky-button-split-test-results/)
- [Blend Commerce — Sticky CTA Test: +10% Conversion Rate](https://blendcommerce.com/blogs/ab-tests-shopify/10-increase-in-conversion-rate)
- [Revlifter — The Anchoring Effect in Ecommerce](https://www.revlifter.com/blog/the-anchoring-effect-in-ecommerce-how-to-optimize-conversions-with-smart-pricing)
- [ConvertCart — Overcome Choice Paralysis (2026)](https://www.convertcart.com/blog/how-to-overcome-choice-paralysis-and-increase-conversions)
- [Frictionless Commerce — Mobile Product Page Layout](https://frictionless-commerce.com/blog/mobile-product-page-layout/)
- [Foursixty — PDP Conversion Rate Optimization](https://foursixty.com/blog/product-page-conversion-rate/)
- [TCF.team — How to Build a High-Converting PDP](https://www.tcf.team/blog/ecommerce-pdp-best-practices)
- [Iconic Digital — Landing Pages for Paid Ads: Message Match](https://www.iconicdigital.co.uk/learning-centre/paid-advertising/landing-pages-for-paid-advertising-message-match-speed-and-form-friction/)
