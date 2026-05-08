# Shmocard primitives — quick reference

> **Generated from `colors_and_type.css` + `components.css`.** If a class isn't listed here, search `components.css` before inventing one. The CSS is the source of truth — when this doc disagrees with the CSS, the CSS wins.

---

## STOP — before writing any new class

If you're about to type one of these, **the primitive already exists.** Use it instead.

| You almost typed… | Use this | File |
|---|---|---|
| `.btn`, `.button`, `.cta`, `.product__add`, `.cart__checkout` | `.shm-btn` (+ variant) | components.css |
| `.tag`, `.pill`, `.chip`, `.product__tag`, `.cart__discount-pill` | `.shm-badge` (+ variant) | components.css |
| `.card`, `.tile`, `.panel`, `.testimonial__box`, `.product-tile` | `.shm-card` (+ variant) — or `.shm-product` for product grid tiles | components.css |
| `.input`, `.email-field`, `.checkout__email` | `.shm-input` inside `.shm-field` | components.css |
| `.faq-item`, `.accordion`, `.faq__row` | `.shm-faq-list` + `.shm-faq-item` + `.shm-faq-trigger` | components.css |
| `.cart-line`, `.drawer`, `.cart__row`, `.basket__*` | `.shm-cart-*` family — DO NOT recreate | components.css |
| `.buybox`, `.sticky-buy`, `position: fixed; top: 0` with product copy | `.shm-buybox-sticky` — DO NOT recreate | components.css |
| `.checklist`, `.benefit-list`, `.feature-list` | `.shm-checklist` (+ `--featured`) | components.css |
| `.steps`, `.how-it-works__step`, numbered tiles | `.shm-step` | components.css |
| `.review-card`, `.testimonial`, customer-quote box | `.shm-review` | components.css |
| `.bg-cocoa`, `.bg-cream`, `.dark-section` (no `shm-` prefix) | `.shm-bg-cocoa`, `.shm-bg-marsh`, etc. — text/accent flips ONLY fire on `shm-bg-*` | colors_and_type.css |

**Hard rule:** every utility is `shm-` prefixed. Drop the prefix and dark-section text-flips silently fail. If you typed `.bg-cocoa` once, search-and-replace `.bg-` → `.shm-bg-` before saving.

**Composition law:** new components own LAYOUT only — grid, padding, aspect ratio. Appearance lives in `components.css`. If you find yourself styling `.shm-btn` from a page CSS file, the variant belongs in `components.css`.

---

## Tokens (use these, never hex)

### Surface colors (`--color-*`)
- `--color-white` `#FFFFFF` — pure white, hard FAQ accent only
- `--color-marshmallow` `#FFFBF1` — default page bg, primary surface
- `--color-cream` `#FFF8EA` — secondary surface, cart/upsell tray bg
- `--color-graham-soft` `#FFE0C2` — secondary section bg
- `--color-graham-gold` `#E89A1A`
- `--color-honey` `#FFB833` — on-dark primary, accent on cocoa surfaces
- `--color-ember` `#FF5B1F` — primary accent, em accent on light bgs
- `--color-cherry` `#E04210` — primary CTA hover
- `--color-chocolate` `#6B3A1E` — secondary button fill
- `--color-cocoa-deep` `#3B1F14` — ink, hard outlines, climax bg

### Ink (text colors)
- `--color-ink` `#3B1F14` — primary body text
- `--color-ink-2` `#4A2C1E`
- `--color-ink-3` `#5A3520` — lede, helper text
- `--color-muted` `#8A6E5A` — deemphasized

### Semantic
- `--color-clover` `#2A7F3E` — savings/free-ship green
- `--color-clover-tint` `#DCEFD8`
- `--color-ember-tint` `#FFF1E5` — selected card wash

### Hairlines (translucent ink)
- `--color-hair` `rgba(59, 31, 20, 0.10)`
- `--color-hair-2` `rgba(59, 31, 20, 0.16)`
- `--color-hair-3` `rgba(59, 31, 20, 0.24)`

### Type families
- `--font-wordmark` Cherry Bomb One — **parent logo + sub-brand wordmarks** (Shmo Review/Biz/Link/Reputation), never headlines
- `--font-display` Bricolage Grotesque — display & headings
- `--font-sans` Inter Tight — body & UI
- `--font-hand` Shadows Into Light Two — hand accent only

### Radii
- `--radius-sm` 10px
- `--radius-md` 16px — inputs, selects
- `--radius-lg` 22px — **default card radius**
- `--radius-xl` 28px — image frames, hero modules
- `--radius-full` 999px — buttons, badges, eyebrows

### Outlines
- `--outline-soft` `1.5px solid rgba(59,31,20,0.14)` — image frames
- `--outline-soft-2` `2px solid rgba(59,31,20,0.18)` — **default card outline**
- `--outline-hard` `2px solid var(--color-cocoa-deep)` — buttons
- `--outline-hard-3` `2.5px solid var(--color-cocoa-deep)` — hard cards, FAQ featured

### Shadows
- `--shadow-none` `none` — **default for cards**
- `--shadow-chunk-sm` `2px 2px 0 var(--color-cocoa-deep)` — buttons resting
- `--shadow-chunk` `4px 4px 0 var(--color-cocoa-deep)` — buttons hover, hard cards

### Motion
- `--motion-fast` 150ms — hover
- `--motion-base` / `--motion-normal` 220ms — panels
- `--motion-slow` 320ms — drawers
- `--ease-standard` `cubic-bezier(.2,.8,.2,1)`

### Layout
- `--container-max` 1200px
- `--container-pad` 28px
- `--section-py-d` 40px — default section padding
- `--section-py-d-lg` 80px — hero / showcase
- `--section-py-d-xl` 120px — final CTA / embedded sections
- `--wave-height` 18px (default) / `--wave-height-lg` 64px / `--wave-height-xl` 80px

---

## Type ramp

| Class | Use |
|---|---|
| `.shm-display` | Hero headline. clamp 44–88px, Bricolage 800. |
| `.shm-h1` | Page-level heading. clamp 36–60px. |
| `.shm-h2` | Section heading. clamp 28–44px. |
| `.shm-h3` | Card / sub-section heading. 22px. |
| `.shm-lede` | Subhead under a headline. 19px Inter Tight, ink-3. |
| `.shm-body` | Body copy. 17px. |
| `.shm-meta` | Small print. 13px muted. |
| `.shm-eyebrow` | Uppercase pill above a heading (with ✦ ember mark). |
| `.shm-hand` / `.shm-hand--lg` | Handwritten ember accent (Shadows Into Light Two). |

**Em accent** — wrap 1–2 words in `<em>` inside any heading. Renders Bricolage 800 in ember (auto-honey on cocoa/ember/cherry/chocolate bgs).

---

## Section surfaces & dividers

### Backgrounds (apply ONE per `<section>`)
- `.shm-bg-marsh` — **default ~60%**
- `.shm-bg-graham` — secondary ~25%
- `.shm-bg-ember` — spice ~10%, one high-emphasis CTA per page
- `.shm-bg-cocoa` — climax ~5%, final CTA / footer

Also available (use sparingly): `.shm-bg-cream`, `.shm-bg-honey`, `.shm-bg-cherry`, `.shm-bg-chocolate`. **Do not invent more.**

Each `shm-bg-*` ships full text/em/eyebrow/hairline flips for dark surfaces. **Only `shm-bg-*` triggers the flip** — `.bg-cocoa` (no prefix) silently breaks dark sections.

### Layout
- `.shm-container` — max-width 1200px, 28px gutter
- `.shm-section` — default section padding
- `.shm-section-head` / `.shm-section-head--left` — eyebrow + heading + lede block, centered by default

### Wave dividers
Place between sections, **colored to match the NEXT section.**

- `.shm-wave shm-wave--{marsh|graham|cream|honey|ember|cherry|chocolate|cocoa}` — 18px default
- `.shm-wave--lg` 64px / `.shm-wave--xl` 80px — **REQUIRED for high-contrast transitions** (cocoa↔marsh, ember↔marsh, cherry↔marsh)
- `.shm-wave.flip` or `.shm-wave--from-top` — invert direction (color bleeds DOWN from section above)

Pair `--xl` waves with `padding-bottom: calc(var(--section-py-d) + var(--wave-height-xl))` on the section above.

---

## Buttons — `.shm-btn`

Pill, hard outline, chunky offset shadow. Default fill is ember.

### Sizes
- `.shm-btn--sm` — 13px / 38px tall
- (default) — 15px / 48px tall
- `.shm-btn--lg` — 17px
- `.shm-btn--xl` — 19px (ships `--shadow-chunk` resting)

### Role variants — pick by JOB, not color

| Variant | Use |
|---|---|
| `.shm-btn--primary` | Ember. THE buy/checkout/sign-up. **Max 1 per screen.** |
| `.shm-btn--cocoa` | Cocoa. Secondary action: view product, learn more, sign in. |
| `.shm-btn--honey` | Honey. On-dark primary inside cocoa/ember sections. |
| `.shm-btn--cream` | Cream. On-dark secondary inside cocoa/ember sections. |
| `.shm-btn--ghost` | Tertiary / cancel / dismiss. Soft outline, no shadow, no fill. |

`.shm-btn--ghost.on-dark` (or `.shm-btn--ghost` inside `.shm-bg-cocoa/ember/cherry/chocolate`) auto-flips ghost colors for dark surfaces.

---

## Cards — `.shm-card`

Soft default — thin outline, no shadow. Reach for `--hard` only when the page must thump.

### Color variants
- (default) marshmallow
- `.shm-card--graham`
- `.shm-card--honey` (cocoa text)
- `.shm-card--ember` (marsh text)
- `.shm-card--cherry` (marsh text)
- `.shm-card--cocoa` (marsh text)
- `.shm-card--chocolate` (marsh text)

### Modifiers
- `.shm-card--hard` — chunky outline + 4px offset shadow. Hero / pricing modules.
- `.shm-card--hover` — `translateY(-2px)` on hover.

---

## Badges — `.shm-badge`

Pill, soft outline, no shadow.

### Role variants
- (default) — Status (with dot), category, filter chip — recedes
- `.shm-badge--ember` — Marketing tag (Save 20%, Limited)
- `.shm-badge--honey` — Marketing tag (Bestseller, New)
- `.shm-badge--cocoa` — Value prop on light bg, contrast on cocoa surfaces
- `.shm-badge--cream` — On dark (cocoa/ember) surfaces only — default disappears there

### Status variants — `.shm-badge--status`
Add a colored dot prefix.

- `.shm-badge--status-clover` — In stock, Live, Active. **Pulses.**
- `.shm-badge--status-ember` — Selling fast, Low stock. **Pulses.**
- `.shm-badge--status-honey` — Pre-order, Coming soon
- `.shm-badge--status-muted` — Sold out, Paused, Offline

---

## Forms

### Field stack — `.shm-field`
- `.shm-field` — wrapper, owns vertical rhythm
- `.shm-field__label` — Bricolage 700, 13px (children: `.req` ember asterisk, `.opt` muted)
- `.shm-field__hint` — 12px ink-3 helper
- `.shm-field__error` — 12px ember
- `.shm-field--error` — wraps field, lights input + helper red
- `.shm-field--ok` — clover green border on input
- `.shm-field-row` — 2-column field layout (`--3-1` for 3:1 split)
- `.shm-fieldset` + `legend` — checkout sections like "Shipping address"

### Inputs
- `.shm-input` — 44px tall, marsh bg, soft outline, focus → cocoa border + soft halo
- `textarea.shm-input` — same skin, 96px min-height
- `.shm-select` — native select with caret SVG
- `.shm-check` / `.shm-radio` — chunky brand-tinted controls (cocoa border → ember when checked)

---

## FAQ — `.shm-faq-list`

Default is **soft hairline list**. Use ~95% of the time.

- `.shm-faq-list` — wrapper
- `.shm-faq-item` — row
- `.shm-faq-trigger` — clickable button (full row)
- `.shm-faq-question` — Bricolage 700, 19px
- `.shm-faq-icon` — 36px circle, rotates 45° + flips ember on `aria-expanded="true"`
- `.shm-faq-answer` — 16px ink-3 body

### Featured-card variant — RARE
Only on dedicated FAQ pages where chunky modules already dominate.

- `.shm-faq-list--featured-card` (canonical) or `.shm-faq-list--hard` (legacy alias)

White pill cards, cocoa outline + 4px shadow, ember accent on open.

---

## Mascot & sticker

### Mascot — `.shm-mascot`
Hero character. Max 2 per page. Often zero is correct.

- `.shm-mascot--decoration` — 64px (tilted accent)
- `.shm-mascot--accent` — 96px (in-card)
- `.shm-mascot--supporting` — 140px (card hero, **cap for stickers**)
- `.shm-mascot--hero` — 200px (**SHOWCASE ONLY** — reserved for the homepage sub-brand spotlights; do not use on normal marketing pages)

Per-image override: `style="--mascot-fit-ratio: 1.3"` to compensate for transparent padding (e.g. megaphone).

### Sticker — `.shm-sticker`
Smaller-than-mascot accent with baked-in cocoa drop-shadow.

- `.shm-sticker--xs` 44px
- `.shm-sticker--sm` 56px
- `.shm-sticker--md` 76px (default)

**Doc rule:** max 3 stickers per page. Never on every heading.

### Tilt utilities (pair with mascot/sticker)
- `.shm-tilt-l` -6° / `.shm-tilt-r` 7°
- `.shm-tilt-sm-l` -3° / `.shm-tilt-sm-r` 4°

---

## Image frame — `.shm-image-frame`

Default soft (1.5px outline, no shadow), graham-soft fill.

- (default) — soft outline
- `.shm-image-frame--bare` — no border, for spotlight slots flush against section bg
- `.shm-image-frame--hard` — chunky cocoa outline + 4px shadow

---

## Nav — `.shm-nav`

Sticky top bar, marsh/85% + 10px backdrop blur, hairline bottom border.

- `.shm-nav` — outer sticky shell
- `.shm-nav__inner` — flex row inside `.shm-container`

---

## Cart drawer — `.shm-cart-*`

**DO NOT recreate.** Slides in from right, 440px wide max.

### Shell
- `.shm-scrim` (+ `.is-open`) — fixed scrim
- `.shm-cart` (+ `.is-open`) — drawer, transform translateX
- `.shm-cart__head` — header bar (cream bg)
- `.shm-cart__title` + `.shm-cart__count`
- `.shm-cart__close` — 40px round close button
- `.shm-cart__body` — scroll area
- `.shm-cart__foot` — footer (totals + checkout)

### Free-ship band
- `.shm-cart__ship` (+ `--unlocked` to flip bar to honey)
- `.shm-cart__ship-msg` (with `<b>` ember accent)
- `.shm-cart__bar` + `.shm-cart__bar-fill`

### Line item — `.shm-cart-item`
- `.shm-cart-item__thumb` — 76px square
- `.shm-cart-item__main` — name + price grid
- `.shm-cart-item__name` / `.shm-cart-item__price`
- `.shm-cart-item__price-was` — strikethrough original price
- `.shm-cart-item__save` — green savings copy
- `.shm-cart-item__meta` — variant info
- `.shm-cart-item__row` — qty + remove row
- `.shm-cart-item__remove` — underlined link button
- `.shm-cart-item.is-loading` — shimmer state

### Quantity stepper — `.shm-qty`
- `.shm-qty__btn` — 32px round button (`:disabled` allowed)
- `.shm-qty__val` — value display

### Bands & extras
- `.shm-cart-bundle` — dashed ember pill ("save when you buy together")
- `.shm-cart-reminder` — pinned ember banner above body
- `.shm-cart-discount` (+ `__row`) — collapsible discount code field
- `.shm-cart-summary` (+ `__row`, `__row--total`, `__row--reduction`) — totals
- `.shm-cart-trust` (+ `.dot`) — micro trust row
- `.shm-cart-payments` (+ `__chip`) — payment method strip
- `.shm-cart-cta` (+ `__mascot`) — full-width checkout button

### Milestones — `.shm-cart-milestones`
Visual journey toward unlock (4-step track).
- `.shm-cart-milestones__track` / `__line` / `__line-fill`
- `.shm-cart-ms` (+ `.is-active`) — single milestone
- `.shm-cart-ms__dot` / `__label`

### Upsell — `.shm-cart-upsell`
- `.shm-cart-upsell__title` / `__grid`
- `.shm-cart-upsell__card` (+ `__thumb`, `__body`, `__name`, `__price`, `__plus`)

### Empty state — `.shm-cart-empty`

---

## PDP / Buybox

### Sticky buy bar — `.shm-buybox-sticky`
**DO NOT recreate.** Slides DOWN from top on scroll (not bottom).

- `.shm-buybox-sticky[data-visible="true"]` — toggle visibility
- `.shm-buybox-sticky__inner` / `__thumb` / `__title` / `__meta` / `__cta`

### Gallery — `.shm-gallery`
- `.shm-gallery__main` — main image
- `.shm-gallery__thumbs` — vertical thumb stack
- `.shm-gallery__thumb[data-active="true"]` — active state

### Pack selector (radio cards) — `.shm-pack`
4-column quantity grid.
- `.shm-pack__opt` (+ `[data-selected="true"]` or `:has(input:checked)`)
- `.shm-pack__qty` — big number
- `.shm-pack__label` — uppercase sub
- `.shm-pack__save` — pinned savings ember pill

### Pack selector (rows) — `.shm-pack-rows`
Vertical row variant.
- `.shm-pack-rows__label` — fieldset legend
- `.shm-pack-row` (+ `[data-selected="true"]` or `:has(input:checked)`)
- `.shm-pack-row__thumb` / `__main` / `__name` / `__note`
- `.shm-pack-row__price` / `__price-now` / `__price-meta`
- `.shm-pack-row__pop` — pinned "Most popular" badge slot

### Google business input — `.shm-google`
- `.shm-google__icon` / `__input` / `__hint`

### Rating — `.shm-rating`
- `.shm-rating__stars` (honey)
- `.shm-rating__num` / `__count`

### Trust strip — `.shm-trust-strip`
4-column icon + label row, hairline top + bottom borders.
- `.shm-trust-strip__item` / `__icon` / `__label` / `__sub`

### Breadcrumb — `.shm-breadcrumb`
- `.shm-breadcrumb__sep` / `__current`

---

## Marketing primitives

### Step card — `.shm-step`
Numbered "how it works" tile.
- `.shm-step__num` — ember circle, cocoa border, Bricolage 800
- `.shm-step__title` / `.shm-step__body`

### Review card — `.shm-review`
- `.shm-review__head` / `__avatar` / `__author` / `__verified`
- `.shm-review__body` / `__date`

### Reviews summary — `.shm-reviews-summary`
- `.shm-reviews-summary__big` — 56px Bricolage 800 score
- `.shm-reviews-summary__bars`
- `.shm-reviews-bar` (+ `__track`, `__fill`)

### Press strip — `.shm-press-strip`
Thin band of grayscale customer logos.

### Checklist — `.shm-checklist`
- (default) — 16px hand-drawn cocoa check, dense list
- `.shm-checklist--featured` — 24px dashed-circle graham badge, primary benefits (~3-5 max)
- `.shm-checklist--clover` — green check variant

### Callout — `.shm-callout`
Small icon + headline + sub strip (free-shipping, success, gift unlock).
- `.shm-callout__icon` / `__title` / `__sub`
- Variants: `--success` (clover), `--ember`, `--honey`

---

## Product card — `.shm-product`

For grids, upsells, "you might also like."

- `.shm-product` — outer (soft outline, hover lifts + cocoa border)
- `.shm-product__media` — 1:1 aspect frame
- `.shm-product__tag` — pin a `.shm-badge` top-left of media
- `.shm-product__body`
- `.shm-product__name` / `.shm-product__sub`
- `.shm-product__row` / `.shm-product__price` (with `<del>` for strikethrough)

### Variants
- `.shm-product--compact` — horizontal layout (96px thumb), for cart upsells
- `.shm-product.is-oos` — out-of-stock greyed state

---

## What's NOT a primitive (yet)

Things that DO NOT have a primitive — if you need one, **add it to `components.css` first**, never to a page-level CSS file:

- Footer (no `.shm-footer-*` family yet)
- Hero composition (built ad-hoc per page using `.shm-display` + `.shm-card--hard` + image frame)
- Sub-brand spotlight row (built ad-hoc on the canonical homepage)
- Marquee / audience strip
- Video tile

If a request needs one of these, **read the canonical reference page first** (`ui_kits/website/homepage-shmocard/Shmocard Homepage.html`) and copy its composition rather than inventing.

---

## Smell test (read before saving)

If any of these are true, you have a bug:

- ❌ A class without `shm-` prefix that styles a brand element
- ❌ A `.foo__btn` / `.foo__pill` / `.foo__card` rebuilding a primitive
- ❌ A page-level CSS file (e.g. `home.css`) restyling `.shm-btn`, `.shm-card`, `.shm-faq-*`
- ❌ A hex code instead of `var(--color-*)`
- ❌ A custom cart drawer or sticky bar that ignores `.shm-cart-*` / `.shm-buybox-sticky`
- ❌ A `position: fixed; bottom: 0` with product copy (it's `.shm-buybox-sticky`, slides from TOP)
- ❌ A 5th section background outside `marsh / graham / ember / cocoa`
- ❌ A wave divider colored to match the section ABOVE instead of BELOW
- ❌ A drop-shadow with blur (`box-shadow: 0 4px 12px rgba(...)`) — only `4px 4px 0` exists
- ❌ A gradient anywhere
- ❌ An exclamation mark or decorative emoji
- ❌ An accent stripe on the left edge of a card

Fix before saving.
