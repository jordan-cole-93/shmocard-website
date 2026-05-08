# Shmocard Design System

> **Shmocard is a family of four NFC tools built for local shop crews.** Tap a card, post a Google review, share a contact, jump to a link hub, or auto-respond to reviews. One brand, one dashboard, one-time card purchase — no app, no login, no friction.

Voice is **warm, direct, crew-first**. The visual system is **soft neobrutalism** — chocolate ink instead of black, cream surfaces instead of white, a single ember-orange accent that earns every appearance, pill-shaped CTAs with a chunky offset shadow, and a cute s'more mascot used as a sticker (never a hero image). Inspired by suggy.fr.

---

> **⚠️ EVERY UTILITY IS `shm-` PREFIXED. NO EXCEPTIONS.**
>
> `.shm-bg-cocoa`, NOT `.bg-cocoa`. `.shm-btn`, NOT `.btn`. `.shm-card`, NOT `.card`.
> The text-color and accent flips target `.shm-bg-*` selectors, so dropping the
> prefix silently breaks every dark-section heading, em accent, and eyebrow.
> If you typed `.bg-cocoa` once, search-and-replace `.bg-` → `.shm-bg-` before going further.

---

## Source of truth

The CSS is the system. The previews show the system. The docs describe the system. If they disagree, the CSS wins.

**Before generating a new page, read `ui_kits/website/homepage-shmocard/Shmocard Homepage.html` and its `home.css` header.** That homepage is the canonical marketing-page reference — section rotation, hero composition, sub-brand spotlights, video tiles, FAQ, footer. Copy its structure rather than inventing one. For PDPs and ecommerce flows, the same applies to `Buybox.html` and `Cart Drawer.html` in the same folder.

| File | Role |
|---|---|
| `colors_and_type.css` | Every token + the `.shm-*` type ramp. Import first. |
| `components.css` | Every primitive (`.shm-btn`, `.shm-card`, `.shm-badge`, `.shm-input`, `.shm-faq-*`, `.shm-mascot--*`, `.shm-nav`, `.shm-cart-*`, `.shm-wave`, `.shm-press-strip`). Import second. |
| `fonts/` | The four brand fonts as local `.ttf` files. `colors_and_type.css` declares them via `@font-face`; copy this folder alongside the CSS. |
| `preview/` | Visual cards (one per token group / primitive). Each card double-acts as the QA fixture. |
| `README.md` | Brand context, content rules, visual foundations (this file). |
| `SKILL.md` | One-page operator's manual for an LLM building Shmocard pages. |
| `assets/` | Logo, mascot variants, product photography. |
| `ui_kits/website/` | **Canonical reference pages** — `homepage/Shmocard Homepage.html` (full marketing page), `Buybox.html` (PDP + sticky bar), `Cart Drawer.html`. Open before generating any new ecommerce or marketing surface. |

---

## Sub-brand family

| Brand | Status | What it is |
|---|---|---|
| **Shmo Review** | ✅ Live | NFC review cards, L-signs, square discs that send happy customers to your Google profile. |
| **Shmo Biz** | ⏳ Soon | NFC business card. |
| **Shmo Link** | ⏳ Soon | Branded link-in-bio for local shops. |
| **Shmo Reputation** | ⏳ Soon | AI review responder. |

---

## Logo & wordmark

The logo is the **mascot + wordmark "ShmoCard"** locked together, mascot on the left.

- **Wordmark font** — Cherry Bomb One (token: `--font-wordmark`). Locked. Never substituted.
- **Two-tone** — `Shmo` in cocoa-deep + descriptor (`Card` for the parent, or `Review` / `Biz` / `Link` / `Reputation` for sub-brands) in ember. On dark surfaces, `Shmo` flips to marshmallow; the ember descriptor stays (or flips to honey when ember would clash).
- **Sub-brand wordmarks share the parent's treatment.** Each sub-brand has its own logo: same Cherry Bomb font, same single-concatenated-word shape, same two-tone color split — only the descriptor changes (`ShmoReview`, `ShmoBiz`, `ShmoLink`, `ShmoReputation`).
- **Single word, no space** — "ShmoCard", not "Shmo Card".
- **Sizes** — hero 56 / nav 36 / compact 22 (px). Mascot height matches wordmark cap-height ±10%.

The mascot is a **sticker**, not a hero image. Use it small, near a headline word or in a section corner. Never as a centerpiece, never larger than 140px (`--supporting`). Often zero is correct.

| Class | Size | Use |
|---|---|---|
| `--decoration` | 64px | Tilted accent next to a chip or eyebrow. |
| `--accent` | 96px | Inside a card, beside a small section. |
| `--supporting` | 140px | Card hero, lifestyle row. Cap. |

13 mascot emotions live in `assets/mascot/`. Pick by meaning (celebrating, heart-hands, charge, holding-card, etc.) — never by aesthetic.

**Per-mascot fit overrides.** Mascot PNGs ship with inconsistent transparent padding around the character — the megaphone mascot, for example, reads ~30% smaller than the phone mascot at the same `width`. Compensate with the `--mascot-fit-ratio` custom property:

```html
<img src="mascot/megaphone.png"
     class="shm-mascot shm-mascot--accent"
     style="--mascot-fit-ratio: 1.3;">
```

Long-term: re-export with tight bboxes, or ship SVG. Until then, override per-image.

### Stickers

`.shm-sticker` is the smaller-than-mascot accent ramp — use it for sticker moments beside headings, near eyebrows, or in section corners. Stickers ship with the cocoa drop-shadow baked in and pair with `.shm-tilt-*` utilities.

| Class | Size | Use |
|---|---|---|
| `--xs` | 44px | Margin notes, near a chip. |
| `--sm` | 56px | Beside an eyebrow or quote. |
| `--md` | 76px | Beside a section heading (default). |

**Doc rule:** max 3 stickers per page; never one on every heading.

---

## Content fundamentals

**Voice.** Warm, direct, crew-first. **You** is the customer; **we** is rare.

**Casing.** Sentence case for everything except eyebrows (UPPERCASE 12px 0.04em tracking inside a soft pill).

**Sentence rhythm.** Short, declarative. One thought per sentence. No semicolons.

**Specifics over abstractions.** "Got 14 in the first week" beats "boost your reviews."

**The ember accent.** 1–2 words inside a headline, wrapped `<em>word</em>` (or `<em class="shm-italic">`). Bricolage Grotesque 800 in ember — **sans, NOT italic** (auto-honey on cocoa surfaces).

**No emoji as decoration.** Customer quotes can contain user-generated emoji — that's the only path.

**No exclamation marks.** Confidence comes from specifics.

---

## Visual foundations

**Color philosophy.** Never pure black, never pure gray. Ink is chocolate `#3B1F14`. Borders are translucent ink. Page background defaults to **marshmallow** `#FFFBF1`.

**Surface palette — 10 flat solids only.** white `#FFFFFF` · marshmallow `#FFFBF1` · cream `#FFF8EA` · graham-soft `#FFE0C2` · graham-gold `#E89A1A` · honey `#FFB833` · ember `#FF5B1F` · cherry `#E04210` · chocolate `#6B3A1E` · cocoa-deep `#3B1F14`.

**No gradients. No patterns. No textures. No glow. No blobs.** Every surface is a single flat color.

### Section-color rotation (the rhythm)

A page rotates through **four** surface colors only. This is the rhythm:

| Color | Role | % of page |
|---|---|---|
| **Marshmallow** `--color-marshmallow` | Default — hero, copy-heavy, anywhere needing breathing room | ~60% |
| **Graham soft** `--color-graham-soft` | Secondary — set-piece sections (use cases, comparison rows) | ~25% |
| **Ember** `--color-ember` | Spice — one high-emphasis CTA section per page | ~10% |
| **Cocoa-deep** `--color-cocoa-deep` | Climax — final CTA, footer | ~5% |

Default page rotation: **Marsh → Graham → Marsh → Ember → Marsh → Cocoa**.

**Vertical rhythm.** Sections use `--section-py-d` (compact ecommerce density). No giant white space. Sections separated by `.shm-wave--{next-color}` — wave is colored to match the *next* section so it eats into the boundary.

**Type stack.**
- **Wordmark** = **Cherry Bomb One** (`--font-wordmark`). Parent logo + sub-brand wordmarks (`Shmo Review`, `Shmo Biz`, `Shmo Link`, `Shmo Reputation`). Never headlines or body.
- **Display & headings** = **Bricolage Grotesque** 700/800 (variable, optical-size 96).
- **Body & UI** = **Inter Tight** 400–700.
- **Hand accent** = **Shadows Into Light Two**.

All four are bundled locally as `.ttf` files in `fonts/` — see [Fonts](#fonts) below. The CSS loads them via `@font-face` first; a Google Fonts `@import` stays as a network fallback.

Headlines and Display use `text-wrap: balance`; Lede and body use `text-wrap: pretty`.

### Fonts

All four brand fonts ship with the system as local `.ttf` files in `fonts/`. `colors_and_type.css` declares them via `@font-face` at the top of the file, so they load from the project filesystem first. A Google Fonts `@import` follows as a network fallback for environments that can't read the local files (some PDF generators, sandboxed image renderers).

| Family | Token | File(s) | Role |
|---|---|---|---|
| **Cherry Bomb One** | `--font-wordmark` | `CherryBombOne-Regular.ttf` | Parent logo + sub-brand wordmarks. Never headlines or body. |
| **Bricolage Grotesque** | `--font-display` | `BricolageGrotesque-VariableFont_opsz_wdth_wght.ttf` (variable; weights 200–800, optical sizes 12–96pt). Static cuts also bundled. | Display & headings. |
| **Inter Tight** | `--font-sans` | `InterTight-VariableFont_wght.ttf` + `InterTight-Italic-VariableFont_wght.ttf` (variable; weights 100–900, upright + italic) | Body & UI. |
| **Shadows Into Light Two** | `--font-hand` | `ShadowsIntoLightTwo-Regular.ttf` | Hand accent — `.shm-hand` only. |

**When adopting the system into another project**, copy the entire `fonts/` folder alongside `colors_and_type.css`. The CSS references files by relative path (`fonts/...`), so the two must be siblings — or update the `url()`s in the `@font-face` block to match your structure.

**Spacing & layout.** `.shm-container` = max-width 1200px, 28px gutter. `.shm-section` = compact vertical padding tuned for ecommerce.

**Soft by default, hard when it counts.**
- **Cards** use `--outline-soft-2` (2px translucent ink) with **no shadow**.
- **Primary CTAs and `.shm-card--hard` hero modules** opt into `--outline-hard-3` + `--shadow-chunk` (4px offset, no blur).
- **FAQ items** default to the soft hairline list (`.shm-faq-list`). Reach for `.shm-faq-list--featured-card` only on dedicated FAQ pages where chunky modules already dominate — it's the rare variant, not the default.
- **Image frames** default to a thin soft outline. Spotlight slots can drop the border with `.shm-image-frame--bare`. Opt into `.shm-image-frame--hard` only when the photo needs to thump.
- Never blanket-apply chunky shadows.

**Section padding tokens.**
- `--section-py-d` (40px) — the default for most sections.
- `--section-py-d-lg` (80px) — hero / showcase sections that need air.
- `--section-py-d-xl` (120px) — final CTA, sections that embed another section (e.g. a crew strip inside a marketing band).
- **Wave overlap rule:** any section followed by a tall wave divider (`.shm-wave--lg` / `.shm-wave--xl`) needs `padding-bottom: calc(var(--section-py-d) + var(--wave-height-xl))` so the wave doesn't eat into content.

**Wavy section dividers.** Smooth sine curves between section colors via `.shm-wave--{next-color}`. Height is controlled by `--wave-height` (default 18px).
- For high-contrast transitions (cocoa↔marsh, ember↔marsh, cherry↔marsh), use `.shm-wave--lg` (64px) or `.shm-wave--xl` (80px). The default thin wave reads as a flat sliver against a dramatic color shift.
- Direction: by default the wave's color matches the section BELOW. Add `.shm-wave--from-top` (or legacy `.flip`) to invert and make the color read as bleeding DOWN from the section above.

**Animation & motion.** Subtle, fast, never bouncy. `150ms` hover, `220ms` panels. Easing `cubic-bezier(.2,.8,.2,1)`. Buttons translate `(-2px,-2px)` on hover and upgrade their offset shadow `2px → 4px`. FAQ chevron rotates 45°.

**Borders.** Always translucent ink: `--color-hair` (10%), `--color-hair-2` (16%), `--color-hair-3` (24%). Hard outlines use cocoa-deep solid (`--outline-hard-3`).

**Corner radii.** `sm 10 · md 16 · lg 22 · xl 28 · full 999`.
- **Buttons & badges:** `full` (pills).
- **Cards:** `lg` (22px).
- **Image frames, hero modules:** `xl` (28px).
- **Inputs:** `md` (16px).

---

## Iconography

**Hand-drawn outline icons.** Cocoa-deep stroke 2.4–2.6px, round caps, deliberate imperfection. Sizes 16 / 20 / 24. Ember dot used sparingly for emphasis. Gold reserved for filled stars / value markers.

**No SaaS-feel outline libraries (Lucide-style 1.5px). No emoji as decoration. No SVG illustrations beyond logo + chevrons.** When a section needs visual energy, use real product photography inside `.shm-image-frame`, or a sticker-sized mascot.

---

## Composition law (read this before writing any new component)

**The system is built from primitives. New components compose them; they never restyle them.**

When building anything new, walk this list before you write a single line of CSS:

| If you need… | Use this primitive | Don't write |
|---|---|---|
| A clickable button | `.shm-btn` + variant (`--primary`, `--ghost`, `--cocoa`, `--ember`, `--lg`, `--sm`) | `.product__add`, `.cart__checkout` |
| A pill with text (status, tag, label) | `.shm-badge` + variant (`--ember`, `--honey`, `--cream`, `--cocoa`, `--soft`) | `.product__tag`, `.cart__discount-pill` |
| A surface with content (card, tile, panel) | `.shm-card` + variant (`--cream`, `--cocoa`, `--hard`) | `.product__tile`, `.testimonial__box` |
| A text input | `.shm-input` | `.checkout__email` |
| A select | `.shm-select` | — |
| A label / hint / error / field stack | `.shm-field`, `.shm-field__label`, `.shm-field__hint`, `.shm-field__error` | `.product__label` |
| A small uppercase pill above a headline | `.shm-eyebrow` | — |
| A handwritten accent | `.shm-hand` | — |
| The mascot at any size | `.shm-mascot--{decoration\|accent\|supporting}` | inline `width:` |
| A FAQ list | `.shm-faq-list shm-faq-list--hard` | bespoke accordion |
| A nav bar | `.shm-nav` | bespoke header |
| A cart drawer | `.shm-cart-*` family | bespoke drawer |

**The three rules:**

1. **Reuse first, invent never.** If a primitive exists for the role, use it.
2. **New components own layout, not appearance.** A `.shm-product-card` controls its own grid, padding, aspect ratio — it does NOT restyle the `.shm-btn` inside it.
3. **Variants of a primitive go in `components.css` next to the primitive — never inside another component's block.**

**The smell test.** If you find yourself writing `.foo__btn`, `.foo__pill`, `.foo__card`, stop. You're rebuilding a primitive.

---

## The golden rules

1. **Tokens, not hex.** `var(--color-ember)`, never `#FF5B1F`.
2. **Use the type primitives.** `.shm-display`, `.shm-h1`, `.shm-h2`, `.shm-h3`, `.shm-lede`, `.shm-body` — never raw `font-size`.
3. **Ember accent = `<em>word</em>` inside a headline.** 1–2 words. Bricolage 800 in ember, sans not italic (auto-honey on cocoa).
4. **Soft by default.** Cards opt into `--hard` only when the page must thump. FAQ defaults to hard.
5. **Pill everything.** Buttons & badges round to full.
6. **Mascot is a sticker.** Use the scale utility; max 2 per page; never bigger than `--supporting`.
7. **Wavy dividers, never zigzags. No extra vertical space.**
8. **Flat solid surfaces only — NO gradients, NO patterns, NO glow, NO blobs.**
9. **Section rotation is Marsh / Graham / Ember / Cocoa — four colors, no others.**
10. **No pure black, no pure gray, no left-border accent cards, no decorative emoji, no exclamation marks.**
