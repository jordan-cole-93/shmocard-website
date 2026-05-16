---
name: Shmocard
description: Design system for Shmocard — a family of NFC tools for local shop crews. Soft neobrutalism with chocolate ink, cream surfaces, ember accent, pill CTAs, hand-drawn icons, and a cute s'more mascot used as a sticker. Use when building marketing pages, product surfaces, or extensions to shmocard.com.
---

# Shmocard design system — soft neobrutalism

**⚠️ Every utility is `shm-` prefixed. No exceptions.** `.shm-bg-cocoa`, `.shm-btn`, `.shm-card`. Drop the prefix and the dark-section text-flips silently fail.

The CSS is the source of truth. Read in order:
1. **`README.md`** — brand context, content fundamentals, visual foundations.
2. **`colors_and_type.css`** — every token + the `.shm-*` type ramp. Import first.
3. **`components.css`** — every primitive. Import second.
4. **`PRIMITIVES.md`** — the canonical primitive index. The table below is a quick reference; PRIMITIVES.md is comprehensive (cart, buybox, PDP blocks, callouts, pack-rows, ratings, etc.). When in doubt, search there before reinventing.
5. **`preview/`** — visual cards for every token and component.
6. **`ui_kits/website/`** — canonical reference pages (homepage, cart drawer, buybox). Read these BEFORE generating new marketing or PDP screens.

## Primitives you MUST reuse (composition law)

The system is built from primitives. New components compose them; they never restyle them. **The table below is the quick reference. `PRIMITIVES.md` is the canonical, comprehensive index.**

| Need | Primitive | Variants |
|---|---|---|
| Button | `.shm-btn` | `--primary`, `--ghost` (+ `.on-dark`), `--cocoa`, `--ember`, `--lg`, `--sm` |
| Pill / tag / status | `.shm-badge` | `--ember`, `--honey`, `--cream`, `--cocoa`, `--soft` |
| Surface (card, tile, panel) | `.shm-card` | `--cream`, `--graham`, `--honey`, `--ember`, `--cherry`, `--cocoa`, `--chocolate`, `--hard` |
| Text input | `.shm-input` | — |
| Select | `.shm-select` | — |
| Field stack (label + input + hint/error) | `.shm-field` + `.shm-field__label`/`__hint`/`__error` | — |
| Eyebrow (uppercase pill above headline) | `.shm-eyebrow` | — |
| Hand-written accent | `.shm-hand` | — |
| Mascot (sticker scale) | `.shm-mascot--{decoration\|accent\|supporting}` | 64 / 96 / 140 px (`--hero` 200 px is showcase-only — homepage spotlights) |
| Sticker (sticker accent) | `.shm-sticker--{xs\|sm\|md}` | 44 / 56 / 76 px |
| Image frame | `.shm-image-frame` | `--bare` (no border), `--hard` (chunky) |
| FAQ list | `.shm-faq-list` (soft, default) | `--featured-card` (rare — dedicated FAQ pages) |
| Nav bar | `.shm-nav` | — |
| Cart drawer | `.shm-cart-*` family | — |
| Section bg | `.shm-bg-{marsh\|graham\|ember\|cocoa}` (the four rotation colors) | — |
| Section divider | `.shm-wave shm-wave--{next-color}` | `--lg` / `--xl` (tall, for high-contrast), `.flip` / `--from-top` |

**Rules.** (1) If a primitive exists for the role, use it. Never write `.product__add`, `.cart__checkout`. (2) New components own LAYOUT, not appearance — they do not restyle the primitives inside them. (3) Variants of a primitive go in `components.css` next to the primitive, never inside another component's block.

The smell test: if you're typing `.foo__btn`, `.foo__pill`, `.foo__card`, stop — you're rebuilding a primitive. Same rule for `.cart-*`, `.drawer-*`, `.buybox-*`, `.faq-item`, `.product-tile` without `shm-` — those primitives already exist in `components.css`.

## Canonical reference pages

**These are not optional reading.** Before generating a homepage, PDP, cart, or marketing surface, open the matching reference page below and copy its section structure and class composition. Do not invent a layout when a reference exists.

| Page type | Reference file | What it teaches |
|---|---|---|
| Homepage / marketing landing | `ui_kits/website/homepage-shmocard/Shmocard Homepage.html` (+ `home.css`, `home-bundle.jsx`) | Section rotation (marsh→graham→marsh→sub-brand sequence→ember→cocoa), hero with type-cycle, audience marquee, proof grid, sub-brand spotlight (alternating reverse), crew strip, video testimonials, how-it-works grid, FAQ, final-CTA, footer. The `home.css` header has a section-by-section pattern guide. |
| PDP / buybox | `ui_kits/website/Buybox.html` | Full PDP layout (gallery + buybox column + checklist + packs + qty + callout + FAQ). Sticky bar that slides DOWN from the top on scroll uses `.shm-buybox-sticky` — never recreate. |
| Cart | `ui_kits/website/Cart Drawer.html` | Slide-in cart drawer with line items, totals, checkout CTA. Use the `.shm-cart-*` family from `components.css` — never recreate. |

**Cart and buybox are not optional primitives.** When a homepage, PDP, or any ecommerce flow needs a cart drawer or sticky buy-bar, you MUST use `.shm-cart-*` and `.shm-buybox-sticky` from `components.css`. Do not write a custom drawer. Do not recreate the sticky bar. If you find yourself styling `position: fixed` with product copy inside, stop — `.shm-buybox-sticky` is the answer.

## Hard rules (the brand will break without these)

- **Never pure black, never pure gray.** Ink is chocolate `#3B1F14`. Borders are translucent ink.
- **Page bg = `--color-marshmallow` (`#FFFBF1`)**, not white.
- **Section rotation = four colors only.** Marshmallow (default ~60%), Graham soft (~25%), Ember (~10%), Cocoa-deep (~5%). Default order on a page: Marsh → Graham → Marsh → Ember → Marsh → Cocoa.
- **Surfaces are 10 flat solids.** white · marshmallow · cream · graham-soft · graham-gold · honey · ember · cherry · chocolate · cocoa-deep. White is reserved for hard FAQ cards. No gradients, no patterns, no textures, no glow, no blobs.
- **Soft by default, hard when it counts.** Cards use thin outlines (`--outline-soft-2`) with no shadow. Primary CTAs and `.shm-card--hard` hero modules opt into the chunky `--outline-hard-3` + `--shadow-chunk` (4px offset, no blur) treatment. FAQ defaults to the SOFT hairline list — `.shm-faq-list--featured-card` is rare. Image frames default to soft — `--bare` for spotlight slots, `--hard` only for chunky moments.
- **Pill everything.** Buttons and badges are `--radius-full`. Cards are `--radius-lg` (22px). Image frames are `--radius-xl` (28px).
- **Type stack.**
  - Wordmark = **Cherry Bomb One** (`--font-wordmark`). Parent logo + sub-brand wordmarks (`Shmo Review`, `Shmo Biz`, `Shmo Link`, `Shmo Reputation`). Never headlines or body.
  - Display & headings = **Bricolage Grotesque** 700/800 (`--font-display`).
  - Body = **Inter Tight** 400–700 (`--font-body`).
  - Hand accent = **Shadows Into Light Two** (`--font-hand`).
  - All four are bundled locally in `fonts/` — copy the folder alongside `colors_and_type.css` when adopting the system. The CSS declares each via `@font-face` (relative path `fonts/...`); a Google Fonts `@import` is a fallback for environments that can't read the filesystem.
  - No system-ui, no Inter (the regular one), no Roboto, no Fraunces.
- **Logo + sub-brand wordmarks share a treatment.** Single concatenated word (no space), two-tone: `Shmo` cocoa-deep + descriptor (`Card`, `Review`, `Biz`, `Link`, `Reputation`) ember. Parent logo is mascot (left) + `ShmoCard` wordmark; sub-brand wordmarks are the descriptor variants. On dark surfaces, `Shmo` flips to marshmallow; the ember descriptor stays (or flips to honey when ember would clash).
- **Ember accent.** 1–2 words max in a headline, wrapped `<em>word</em>`. Bricolage 800 in ember (**sans, NOT italic** — auto-honey on cocoa surfaces).
- **Mascot is a sticker, never a hero image.** Use `.shm-mascot--{decoration|accent|supporting}` (64 / 96 / 140 px). Max 2 mascot moments per page; often zero is correct. Never bigger than 140px. Override `--mascot-fit-ratio` per-image when a particular PNG has wider transparent padding (e.g. megaphone = 1.3). For sticker accents (smaller than mascots, 44/56/76px) use `.shm-sticker--{xs|sm|md}` — max 3 per page.
- **Iconography is hand-drawn.** Cocoa-deep 2.4–2.6px stroke, round caps, deliberate imperfection. No Lucide-style 1.5px outlines. No emoji as decoration.
- **No exclamation marks.** Confidence comes from specifics.
- **No left-border accent stripe on cards. No gradients. No decorative blobs. No "cocoa-hot glow".**
- **Wavy dividers, never zigzags. No extra vertical space — the wave eats into the boundary.** Default 18px height (`--wave-height`); for high-contrast transitions like cocoa↔marsh use `.shm-wave--lg` (64px) or `.shm-wave--xl` (80px), or override `--wave-height` per-divider. Add `.shm-wave--from-top` (or legacy `.flip`) to flip direction.
- **Compact section padding.** Ecommerce density, not airy marketing whitespace. Tokens: `--section-py-d` (40px default), `--section-py-d-lg` (80px hero/showcase), `--section-py-d-xl` (120px final CTA / embedded sections). When followed by a tall wave, add `padding-bottom: calc(var(--section-py-d) + var(--wave-height-xl))`.
- **Tokens, not hex.** `var(--color-ember)`, never `#FF5B1F`.

## Quick start

```html
<link rel="stylesheet" href="colors_and_type.css">
<link rel="stylesheet" href="components.css">

<section class="shm-section shm-bg-marsh">
  <div class="shm-container">
    <div class="shm-section-head">
      <span class="shm-eyebrow">Why bulk wins</span>
      <h2 class="shm-h2">One card per person.<br>Fifteen reviews per <em>week</em>.</h2>
      <p class="shm-lede">Hand one to every crew member and the math takes over.</p>
    </div>
    <a class="shm-btn shm-btn--primary shm-btn--lg">Shop the cards →</a>
  </div>
</section>
<div class="shm-wave shm-wave--graham"></div>

<section class="shm-section shm-bg-graham">…</section>
<div class="shm-wave shm-wave--marsh"></div>

<section class="shm-section shm-bg-marsh">…</section>
<div class="shm-wave shm-wave--ember"></div>

<section class="shm-section shm-bg-ember">… one high-emphasis CTA …</section>
<div class="shm-wave shm-wave--marsh"></div>

<section class="shm-section shm-bg-marsh">…</section>
<div class="shm-wave shm-wave--cocoa"></div>

<section class="shm-section shm-bg-cocoa">… final CTA / footer …</section>
```
