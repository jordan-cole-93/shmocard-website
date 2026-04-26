# Shmocard — Design System

> **Source of truth = `app/globals.css`.** This file is the human-facing companion. If they disagree, globals.css wins — fix this file.
>
> **Stack.** Next.js + Tailwind CSS v4 (CSS-first, no `tailwind.config.js`). Tokens live in `app/globals.css` inside `@theme`. Tailwind generates utilities (`bg-ember`, `text-ink`, etc.) automatically.
>
> **Reusable primitives** live in `components/shm/Shm.tsx` (`<Section>`, `<Display>`, `<H2>`, `<Lede>`, `<I>`, `<Button>`, `<Card>`, `<Badge>`, `<ImageFrame>`, `<FamilyTile>`).

---

## 0. How to use this system

1. **Tokens, not hex.** `bg-ember`, `text-ink`, `border-hair`. Never inline `#FF5B1F` or `rgba(...)`.
2. **Pick a section recipe.** `snow`, `cream-soft`, `cream`, `paper`, `cocoa-hot`. Don't mix surfaces freely.
3. **Use the type primitives.** `<Display>`, `<H1>`, `<H2>`, `<H3>`, `<Lede>`, `<Body>` from `Shm.tsx` (they emit `.shm-display`, `.shm-h1`, etc.). Don't write raw `text-[19px]`.
4. **Spacing comes from Tailwind defaults** + the `.shm-container` (28px gutter, 1320px max-w) and `.shm-section` (88px desktop / 56px mobile vertical) primitives.
5. **Two image tracks.** 3D marketing imagery vs. real product photography. Never blend in the same module.
6. **Mascot is icon-only** (max 32px). Never illustration scale.

---

## 1. Color tokens (mirrors `app/globals.css`)

### Surfaces

| Token | Hex | Tailwind | Use |
|---|---|---|---|
| `--color-snow` | `#FFF8EA` | `bg-snow` | DEFAULT page background |
| `--color-cream-soft` | `#FFFBF1` | `bg-cream-soft` | Lifted cream — cards on snow need contrast |
| `--color-cream` | `#FFF1DC` | `bg-cream` | Warmer section — UGC, testimonials |
| `--color-paper` | `#FFFFFF` | `bg-paper` | White card interior. Use sparingly as section bg |
| `--color-graham-soft` | `#FFE0C2` | `bg-graham-soft` | Peach backdrop — `<ImageFrame>` interior, hero stages |
| `--color-cocoa` | `#6B3A1E` | `bg-cocoa` | Mid-brown — testimonial dark tile |
| `--color-cocoa-deep` | `#3B1F14` | `bg-cocoa-deep` | Cocoa-hot section bg, footer accent |

### Ember (primary accent)

| Token | Hex | Use |
|---|---|---|
| `--color-ember` | `#FF5B1F` | Primary CTA bg, italic accent text on light, focus ring |
| `--color-ember-deep` | `#E04210` | Ember hover/active |
| `--color-ember-soft` | `#FFD8C2` | Soft ember chips, COMING SOON pill, mascot badge |

### Honey (secondary accent)

| Token | Hex | Use |
|---|---|---|
| `--color-honey` | `#FFB833` | Pop highlights, badges, italic accent on cocoa-hot |
| `--color-honey-soft` | `#FFE3B0` | Honey chip background |
| `--color-honey-deep` | `#E89A1A` | Honey hover/active, warm star color |

### Ink (text)

| Token | Hex | Use |
|---|---|---|
| `--color-ink` | `#3B1F14` | Primary text, headlines on light |
| `--color-ink-2` | `#4A2C1E` | Secondary text |
| `--color-ink-3` | `#6B4A37` | Lede paragraphs, body |
| `--color-muted` | `#8A6E5A` | Captions, eyebrows |
| `--color-muted-2` | `#B89A82` | Placeholders, disabled labels |

### Hairlines (translucent ink)

| Token | Value | Use |
|---|---|---|
| `--color-hair` | `rgba(59,31,20,0.10)` | Default card border |
| `--color-hair-2` | `rgba(59,31,20,0.16)` | Stronger — cards on cream-soft |
| `--color-hair-3` | `rgba(59,31,20,0.24)` | Inputs, emphasized dividers |

### Paper-on-cocoa (text + lines on cocoa-hot)

| Token | Use |
|---|---|
| `--color-paper-soft` (rgba 0.85) | High-contrast text on cocoa-hot |
| `--color-paper-mute` (rgba 0.62) | Secondary text on cocoa-hot |
| `--color-paper-dim` (rgba 0.45) | Placeholder, muted on cocoa-hot |
| `--color-paper-line` (rgba 0.18) | Borders on cocoa-hot |
| `--color-paper-line-2` (rgba 0.28) | Stronger borders on cocoa-hot |
| `--color-cocoa-tint` (rgba 0.04) | Subtle lift card on cocoa-hot |
| `--color-success-bright` `#6EE3A1` | Mint success text on cocoa-hot |

### Semantic

| Token | Hex | Use |
|---|---|---|
| `--color-success` / `--color-success-soft` | `#2E7D44` / `#DDF0E2` | "Live now" badges, confirmations |
| `--color-warn` / `--color-warn-soft` | `#C8472D` / `#FBE0D6` | Errors, destructive |

**Color rule:** never pure black, never pure gray. Ink is always chocolate. Borders are always translucent ink.

---

## 2. Typography

```
--font-sans:  Inter Tight  → UI, body, all headlines
--font-serif: Fraunces     → italic accent only
```

### Type ramp (defined as `.shm-*` classes in `globals.css`)

| Class / Primitive | Family / Weight | Size / LH | Use |
|---|---|---|---|
| `.shm-display` / `<Display>` | Inter Tight 600 | clamp(44, 6.2vw, 84) / 0.98 | Hero only |
| `.shm-h1` / `<H1>` | Inter Tight 600 | 60 / 64 | Page title |
| `.shm-h2` / `<H2>` | Inter Tight 600 | 44 / 1.04 | Section title |
| `.shm-h3` / `<H3>` | Inter Tight 600 | 22 / 26 | Card title |
| `.shm-lede` / `<Lede>` | Inter Tight 400 | 17 / 26 | Intro paragraph |
| `.shm-body` / `<Body>` | Inter Tight 400 | 14 / 22 | Default paragraph |
| `.shm-meta` | Inter Tight 400 | 13 / 1.5 | Captions |
| `.shm-eyebrow` | Inter Tight 600 | 11px / 1.6px tracking / UPPERCASE | Standard eyebrow |
| `.shm-eyebrow-italic` / `<Eyebrow>` | Fraunces italic 400 | 15 / ember | Editorial eyebrow (default) |

### Italic accent rule (Fraunces)

- `<I>` from `Shm.tsx` — auto ember on light, auto honey on cocoa-hot.
- 1–2 words max per usage. Never set body text in serif.
- Pattern: `<H2>Common questions, <I>honest</I> answers.</H2>`

### Wrapping

- All H1/H2/Display: `text-wrap: balance` (built into `.shm-*`).
- Lede/body: `text-wrap: pretty`.

---

## 3. Spacing & layout

Use Tailwind's default `--spacing-*` scale (4/8 base) for utilities. Layout primitives are class-based:

| Primitive | Value | Use |
|---|---|---|
| `.shm-container` | `max-w 1320px`, `padding-x 28px` | Page max width + horizontal gutter |
| `.shm-section` | `padding-y 88px` (56px ≤720px) | Section vertical rhythm |

`<Section recipe="...">` already wraps content in `.shm-container`. Don't reach for `max-w-[1320px]` or raw `py-[88px]` — use the primitive.

---

## 4. Radii, shadows, motion

**Radii.** `xs 4 · sm 6 · md 10 · lg 14 · xl 20 · 2xl 28 · full 999`. Default button = `rounded-md`. Default card = `rounded-xl`. Hero stage / contained CTA / feature card = `rounded-2xl`.

**Shadows.** Always chocolate-tinted (rgba `#3B1F14`). `shadow-sm` (subtle lift) · `shadow-md` (default hover) · `shadow-lg` (modal) · `shadow-card` (primary feature card). **Never combine `shadow-lg` with a heavy hairline border on the same element — pick one.**

**Motion.** `--motion-fast 150ms` (hover), `--motion-normal 220ms` (panels), `--motion-slow 320ms` (transitions). Easing: `cubic-bezier(.2,.8,.2,1)` standard, `cubic-bezier(.16,1,.3,1)` out.

---

## 5. Section recipes

A page should mix at most 3 recipes. Alternate `snow ↔ cream-soft` for breathing room. **Cocoa-hot is the climax — never two in a row.**

| Recipe | Bg | Eyebrow | Heading | Body | Card | CTA |
|---|---|---|---|---|---|---|
| `snow` (default) | `bg-snow` | ember | ink | ink-3 | `bg-paper border-hair` | ember primary |
| `cream-soft` | `bg-cream-soft` | ember | ink | ink-3 | `bg-paper border-hair-2` | ember primary |
| `cream` | `bg-cream` | ember | ink | ink-3 | `bg-paper border-hair-2` | ember primary |
| `paper` | `bg-paper` | ember | ink | ink-3 | `bg-snow border-hair` | ember primary |
| `cocoa-hot` (climax) | `bg-cocoa-deep` + ember/honey radial glow | honey | white | paper-soft | `bg-cocoa-tint border-paper-line` | ember primary |

The cocoa-hot glow lives in `.shm-cocoa-hot__glow` — emitted automatically by `<Section recipe="cocoa-hot">`. Don't recreate it inline.

---

## 6. Components

> Only patterns Shmocard ships today. New patterns get added here when they ship.

### 6.1 Button (`<Button>` / `<ButtonLink>`)

Variants: `primary`, `secondary`, `ghost`, `accent`. Sizes: `sm`, `md`, `lg`.

- **`primary`** = `bg-ember text-paper`. The only ember-filled element in a section. Standard CTA.
- **`secondary`** = `bg-paper text-ink border-hair-2`.
- **`ghost`** = transparent + `text-ink` + `border-hair-2`. Pair with primary or accent. On cocoa-hot, ghost auto-shifts to translucent paper-on-dark.
- **`accent`** = `bg-ink text-paper`. Chocolate-on-cream — used as hero primary in v2 design when ember would overpower the scene. Pair with ghost.
- Default radius `md` (10px). Min hit-target 44px. **Never two ember-primary buttons in the same row.**

### 6.2 Input

- `bg-paper border-hair-3 rounded-md`. Placeholder `text-muted-2`.
- Focus = ember 2px outline at 2px offset. Error = `border-warn bg-warn-soft` + warn helper.

### 6.3 Card (`<Card>`)

- `bg-paper border-hair rounded-xl shadow-sm`, padding 24–32px.
- On cream-soft sections, border auto-strengthens to `hair-2`.
- Hover = `translateY(-2px)` + `shadow-md`.

### 6.4 Badge (`<Badge>`)

- Pill, 11px, 600 weight, 1.6px tracking, uppercase.
- `live` = `bg-success-soft text-success`.
- `soon` = `bg-ember-soft text-ember-deep`.
- `neutral` = `bg-paper border-hair text-ink`.

### 6.5 Accordion / FAQ

- Closed `+` icon, ember on hover. Open `×` in ember-filled circle.
- Item separator = `border-b border-hair`, not full card border.
- Question 17/ink/600. Answer 15/1.6/ink-3. Single item open at a time.

### 6.6 Nav

- Sticky top, `bg-paper`, `border-b border-hair-2`, blur backdrop.
- Logo left, links center, primary CTA right.
- Active link = `text-ink`. Inactive = `text-ink-3`. Hover = `text-ink` + ember underline.
- Cart count badge — wired to Shopify Storefront API (currently removed; do not hardcode).

### 6.7 Footer

- `bg-cream-soft border-t border-hair`. Wordmark + tagline left, link columns right.
- Eyebrow `text-muted` 11px/1.6px tracking. Links `text-ink-2 hover:text-ink`.
- "Soon" pill on link = `bg-ember-soft text-ember-deep`, 10px (deliberate — smaller than standard badge to read inline).

### 6.8 Hero

- Snow or cream-soft bg.
- `<Badge variant="live">` + `<Display>` + `<Lede>` + 1 `accent` CTA + 1 `ghost` CTA.
- Right slot: `<ImageFrame>` containing 3D imagery (marketing) OR product shot (e-commerce hero) — pick one.
- Mascot **never** at hero scale.

### 6.9 Product card (e-commerce, future)

- `bg-paper border-hair-2 rounded-xl` + 1:1 product photo on `bg-cream-soft` backdrop.
- Name (h3) + price (h3 weight) + Add-to-cart (primary).
- **Only place product photography appears.** Never 3D imagery here.

### 6.10 Image frame (`<ImageFrame>`)

- `rounded-xl shadow-sm border-hair`, interior `bg-graham-soft`.
- Aspect ratios: `16/9` hero, `1/1` product, `4/5` portrait.
- All marketing 3D imagery sits inside this frame.

### 6.11 Family tile (`<FamilyTile>`)

- `bg-paper border-hair-2 rounded-xl shadow-sm`, 320px min-height.
- Glyph (36px square, brand-colored) + name + italic accent + body + status badge (top-right) + CTA arrow row.
- Hover lift 3px + `shadow-md`.

---

## 7. Iconography

- Stroke 1.5–1.7px. Sizes 16 / 20 / 24.
- Outline default; filled only for active/selected states.
- Color: ink default; ember accent; paper on cocoa-hot.
- All icons in a module share one stroke and one corner style. **Never mix outline + filled families in the same module.**

### Mascot-as-icon (locked)

Mascot only at icon scale (16–32px). 2D cartoon doesn't visually match 3D imagery — at icon scale it reads as a system glyph, not a competing illustration.

**Allowed:** footer wordmark (24px), inline next to label/CTA (16px), empty-state glyph (32px), list bullet (16px sparingly), toast icon (20px).

**Forbidden:** hero illustrations, section dividers, inside primary CTA buttons, pricing card decoration, anywhere it competes with product photography.

**Frequency:** max 2 per page. Often zero is correct.

---

## 8. Imagery — two-track rule

**Never blend tracks in the same module.**

- **Marketing 3D** (nano-banana). All marketing surfaces: hero stages, section illustrations, feature explainers. Always inside `<ImageFrame>`. Backdrop cream / snow / cocoa-deep — never paper white.
- **Product photography** (real studio). E-commerce only: PDP, Add-to-cart tiles, checkout, order confirmation. Square aspect, cream-soft backdrop, no drop shadow on the photo (the card has its own subject lighting).

---

## 9. Don'ts

- Pure black `#000` or pure gray — ink/borders are always chocolate.
- Fraunces serif for body or for >2 consecutive words.
- Ember as a flood color (it's an accent).
- Two ember-primary buttons in the same CTA row.
- Mascot at illustration / hero scale.
- 3D marketing imagery in the same module as product photography.
- `shadow-lg` together with a heavy hairline border on one element.
- Emojis as decorative accents.
- Gradient backgrounds outside the cocoa-hot recipe glow.
- Rounded card with a left-border accent stripe (SaaS-blog cliché).
- Mixing icon families (outline + filled) in the same module.
- Inline `#hex` or `rgba(...)` in components — use tokens.

---

## 10. Quick reference

```tsx
import { Section, Eyebrow, H2, Lede, I, ButtonLink } from "@/components/shm/Shm";

<Section recipe="snow" id="why">
  <Eyebrow>Why Shmocard</Eyebrow>
  <H2 className="mt-3">Simple tools. <I>Real</I> results.</H2>
  <Lede className="mt-4 max-w-[40ch]">Short lede paragraph.</Lede>
  <ButtonLink variant="accent" size="lg" href="#next">Next</ButtonLink>
</Section>
```
