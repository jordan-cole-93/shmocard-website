# Shmocard — Design System

> **Scope.** This document is the visual + structural design system for Shmocard's marketing surfaces and e-commerce. It defines tokens, components, and rules. **It is not a brand book** — voice, copywriting, marketing positioning, photography moodboards, and ad guidelines live elsewhere and are consumed by Claude Code separately.
>
> **Stack.** Next.js + Tailwind CSS v4 (CSS-first config, no `tailwind.config.js`). All design tokens live in `app/globals.css` inside an `@theme` block, which auto-generates Tailwind utilities (`bg-ember`, `text-ink`, `rounded-2xl`, `font-serif`, `p-6`, etc.).
>
> **Three deliverables in this folder:**
> - `globals.css` — drop into `app/globals.css`. Source of truth.
> - `DESIGN.json` — machine-readable token + rules lookup.
> - `DESIGN.md` (this file) — human-facing system bible.

---

## 0. How Claude Code should use this system

1. **Always reference tokens, never hex codes.** `bg-ember`, `text-ink`, `rounded-2xl` — never inline `#FF5B1F`.
2. **Pick a Section Recipe before composing a section.** Don't mix colors freely; choose `snow`, `cream-soft`, `cream`, `paper`, or `cocoa-hot` and follow the recipe.
3. **Use the type ramp.** No arbitrary font-sizes. Pick `t-display`, `t-h1`, `t-h2`, `t-h3`, `t-lede`, `t-body`, `t-meta`, `t-eyebrow`.
4. **Spacing comes from the 4/8 scale.** `p-4` (16px), `p-6` (32px), etc. Never `p-[27px]`.
5. **Two image tracks only** — 3D marketing imagery vs. product photography. Never blend in the same module.
6. **Mascot is icon-only.** Never illustration scale.

---

## 1. Color

Tokens use Tailwind v4 namespaces (`--color-*`) so utilities like `bg-ember`, `text-ink`, `border-hair-2` generate automatically.

### 1.1 Surfaces

| Token | Hex | Tailwind | When to use |
|---|---|---|---|
| `--color-snow` | `#FFF8EA` | `bg-snow` | **DEFAULT page background.** Most sections. |
| `--color-cream-soft` | `#FFFBF1` | `bg-cream-soft` | Lifted cream — when cards on a snow page need extra contrast. |
| `--color-cream` | `#FFF1DC` | `bg-cream` | Warmer section — UGC, testimonials. |
| `--color-paper` | `#FFFFFF` | `bg-paper` | White card interior on cream/snow. Use sparingly as full-section bg. |
| `--color-cocoa-deep` | `#3B1F14` | `bg-cocoa-deep` | Dark hot section, footer, contained CTA card. |

### 1.2 Accent · Ember (primary)

| Token | Hex | Use |
|---|---|---|
| `--color-ember` | `#FF5B1F` | Primary CTA bg, italic accent text, focus ring |
| `--color-ember-deep` | `#E04210` | Hover/active, ember text on cream when extra contrast needed |
| `--color-ember-soft` | `#FFD8C2` | Soft ember chip backgrounds |

### 1.3 Accent · Honey (secondary)

| Token | Hex | Use |
|---|---|---|
| `--color-honey` | `#FFB833` | Pop highlights, badges, eyebrow on cocoa-hot |
| `--color-honey-soft` | `#FFE3B0` | Honey chip background |
| `--color-honey-deep` | `#E89A1A` | Honey hover/active |

### 1.4 Ink (text)

| Token | Hex | Use |
|---|---|---|
| `--color-ink` | `#3B1F14` | **Primary text + headlines on light surfaces** |
| `--color-ink-2` | `#4A2C1E` | Secondary text |
| `--color-ink-3` | `#6B4A37` | Lede paragraphs, descriptive body |
| `--color-muted` | `#8A6E5A` | Captions, eyebrow text |
| `--color-muted-2` | `#B89A82` | Placeholders, disabled labels |

### 1.5 Hairlines (borders)

| Token | Value | Use |
|---|---|---|
| `--color-hair` | `rgba(59,31,20,0.10)` | Default border on cards |
| `--color-hair-2` | `rgba(59,31,20,0.16)` | Stronger — on cream-soft, separators |
| `--color-hair-3` | `rgba(59,31,20,0.24)` | Inputs, emphasized dividers |

### 1.6 Semantic

| Token | Hex | Use |
|---|---|---|
| `--color-success` / `--color-success-soft` | `#2E7D44` / `#DDF0E2` | Confirmations, "Available now" badges |
| `--color-warn` / `--color-warn-soft` | `#C8472D` / `#FBE0D6` | Errors, destructive — distinct from ember |

**Color rule:** Never pure black, never pure gray. Ink is always chocolate. Borders are always translucent ink.

---

## 2. Typography

Two families, used together. Sans dominant, serif as italic accent only.

```css
--font-sans:  "Inter Tight", "Inter", system-ui, sans-serif;  /* UI, body, all headlines */
--font-serif: "Fraunces", "Source Serif Pro", Georgia, serif; /* italic accent only */
```

### 2.1 Type ramp

| Class | Family / Weight | Size / LH | Tracking | Use |
|---|---|---|---|---|
| `.t-display` | Inter Tight 600 | clamp(44, 6.2vw, 84) / 0.98 | -0.035em | Hero headline only |
| `.t-h1` | Inter Tight 600 | 60 / 64 | -0.035em | Page title |
| `.t-h2` | Inter Tight 600 | 44 / 46 | -0.025em | Section title |
| `.t-h3` | Inter Tight 600 | 22 / 26 | -0.015em | Card title, sub-section |
| `.t-lede` | Inter Tight 400 | 17 / 26 | — | Intro paragraph below H1/H2 |
| `.t-body` | Inter Tight 400 | 14 / 22 | — | Default paragraph |
| `.t-meta` | Inter Tight 400 | 13 / 1.5 | — | Captions |
| `.t-eyebrow` | Inter Tight 600 | 11 | 1.6px, UPPERCASE | Section eyebrow |
| `.t-eyebrow-italic` | Fraunces italic 400 | 15 | — | Warm editorial eyebrow alt |

### 2.2 Italic accent rule

- Fraunces italic appears **max 1–2 times per scene**, always **1–2 words**.
- Always colored **ember** (`text-ember`).
- Never set body text in serif. Never italicize multiple consecutive words.
- Pattern: `<h2 class="t-h2">Common questions, <em class="text-ember font-serif italic font-normal">honest</em> answers.</h2>`

### 2.3 Wrapping

- All H1/H2/Display: `text-wrap: balance`.
- All body/lede paragraphs: `text-wrap: pretty`.

---

## 3. Spacing & layout

```
1 = 4px    2 = 8px    3 = 12px   4 = 16px   5 = 24px
6 = 32px   7 = 48px   8 = 64px   9 = 96px
```

| Layout primitive | Value | Use |
|---|---|---|
| `--spacing-gutter` | 28px | Horizontal page padding |
| `--spacing-section` | 88px | Vertical rhythm between sections (56px on mobile) |
| `--spacing-maxw` | 1320px | Page max content width |

**Rules**
- Never invent values outside the scale.
- Card internal padding: 24–32px.
- Section vertical padding: 88px desktop / 56px mobile.

---

## 4. Radii, borders, shadows

### Radii
```
xs 4 · sm 6 · md 10 · lg 14 · xl 20 · 2xl 28 · full 999
```
Default button = `rounded-md`. Default card = `rounded-xl`. Hero stage / contained CTA card = `rounded-2xl`.

### Shadows (chocolate-tinted, never gray/black)
- `shadow-sm` — subtle card lift
- `shadow-md` — default card hover
- `shadow-lg` — modal, popover
- `shadow-card` — primary product/feature cards

**Rule:** Never combine `shadow-lg` with a heavy hairline border on the same element. Pick one.

---

## 5. Motion

| Token | Value | Use |
|---|---|---|
| `--motion-fast` | 150ms | Hover, focus |
| `--motion-normal` | 220ms | Panel/accordion |
| `--motion-slow` | 320ms | Page transitions |
| `--ease-standard` | `cubic-bezier(.2,.8,.2,1)` | General |
| `--ease-out` | `cubic-bezier(.16,1,.3,1)` | Entry animations |

---

## 6. Section recipes

A page should mix at most 3 recipes. Always alternate `snow ↔ cream-soft` for breathing room. **Cocoa-hot is the climax** — never two in a row.

### 6.1 `snow` — DEFAULT
- Background: `bg-snow`
- Eyebrow: `text-ember`
- Heading: `text-ink`
- Body: `text-ink-3`
- Card: `bg-paper border border-hair`
- CTA: ember primary

### 6.2 `cream-soft`
- Background: `bg-cream-soft`
- Card: `bg-paper border border-hair-2` (stronger border so cards read)

### 6.3 `cream` (warm)
- Background: `bg-cream`
- Use for UGC strips, warm storytelling.

### 6.4 `paper`
- Background: `bg-paper`
- Card on this surface: `bg-snow border border-hair`
- Use sparingly — feature explainers, dense info.

### 6.5 `cocoa-hot` (climax)
- Background: `bg-cocoa-deep` + radial honey glow at top-center
- Eyebrow: `text-honey`
- Heading: `text-white`
- Italic accent: honey (not ember) for warmth on dark
- Body: `text-[rgba(255,235,210,0.72)]`
- Card: `bg-[rgba(255,248,234,0.04)] border border-[rgba(255,235,210,0.14)]`
- Honey glow snippet:
  ```
  background:
    radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,184,51,0.18), transparent 70%),
    var(--color-cocoa-deep);
  ```

---

## 7. Components

> Comprehensive but lean — only patterns Shmocard marketing actually uses.

### 7.1 Button
- Variants: `primary`, `secondary`, `ghost`, `link`. Sizes: `sm`, `md`, `lg`.
- **Primary** = `bg-ember text-paper` — the only ember-filled element in a section.
- **Secondary** = `bg-paper text-ink border border-hair-2`.
- **Ghost** = transparent + `text-ink` + `border-hair-2` — pair with primary.
- **Link** = `text-ember` with hover underline. Inline only.
- Default radius `rounded-md`. Pill (`rounded-full`) only when explicitly desired.
- Min hit target 44px on mobile.
- **Never two primary buttons in the same CTA row.**

### 7.2 Input
- `bg-paper border border-hair-3 rounded-md`.
- Focus = ember 2px outline at 2px offset (no box-shadow rings).
- Error = `border-warn bg-warn-soft` + warn helper text.
- Placeholder = `text-muted-2`.

### 7.3 Card
- `bg-paper border border-hair rounded-xl shadow-sm` + 24–32px padding.
- On `cream-soft` sections, use `border-hair-2`.
- Hover: `translateY(-2px)` + `shadow-md`.

### 7.4 Badge (pill)
- `rounded-full`, 11px, `font-semibold`, `tracking-[1.6px]`, `uppercase`.
- AVAILABLE NOW = `bg-success-soft text-success`.
- COMING SOON = `bg-ember-soft text-ember-deep`.
- Plain = `bg-paper border border-hair text-ink`.

### 7.5 Accordion (FAQ)
- Closed = `+` icon (ember on hover). Open = `×` in ember-filled circle.
- Item separator = `border-b border-hair`, **not** card border per item.
- Question 16/ink/semibold. Answer body 14/22 ink-3.
- Single item open at a time.

### 7.6 Nav
- Sticky top, `bg-paper`, `border-b border-hair-2`, blur backdrop.
- Logo left, links center, primary CTA right.
- Active link = `text-ink`. Inactive = `text-ink-3`. Hover = `text-ink` + ember underline.

### 7.7 Footer
- `bg-cocoa-deep` with honey eyebrow accents.
- Wordmark + tagline left, link columns right.
- Body `text-[rgba(255,235,210,0.72)]`.

### 7.8 Hero
- Snow or cream-soft bg.
- Eyebrow + display headline + lede + 1 primary CTA + 1 ghost CTA.
- Right slot: 3D imagery (marketing) OR product shot (e-commerce hero) — pick one.
- Mascot **never** at hero scale.

### 7.9 Product Card (e-commerce)
- **This is the only place product photography appears.**
- `bg-paper border border-hair-2 rounded-xl` + 1:1 product photo on cream-soft backdrop.
- Name (h3) + price (h3 weight 600) + Add-to-cart (primary button).
- Never use 3D nano-banana imagery here.

### 7.10 Testimonial card
- `bg-cream` or `bg-paper`, `border border-hair`, `rounded-xl`.
- Quote: body. Author: name (semibold ink) + role (meta muted).

### 7.11 Image frame
- All marketing imagery sits in this frame.
- `rounded-xl shadow-sm border border-hair`.
- Aspect ratios: 16/9 hero, 1/1 product, 4/5 portrait.

### 7.12 Language switcher
- `EN | FR` text toggle. **No flags** (flags = country, language ≠ country).
- Active `text-ink`, inactive `text-muted`, divider `border-hair-2`.
- Place once per page — top-right of nav OR footer corner, never both.

---

## 8. States

| State | Treatment |
|---|---|
| Default | as defined in component rules |
| Hover | `translateY(-2px)` + `shadow-md` OR color shift to `*-deep` |
| Focus | 2px ember outline at 2px offset, `:focus-visible` only |
| Active | `scale(0.98)` + `shadow-sm` |
| Disabled | `opacity-50 cursor-not-allowed`, no hover |
| Error | `border-warn bg-warn-soft` + warn helper text |

---

## 9. Iconography

- **Stroke** 1.5px. **Sizes** 16 / 20 / 24.
- **Style** outline default; filled only for active/selected.
- **Color** ink default; ember for accent; paper on cocoa-hot.
- All icons in a module share one stroke and one corner style. **Never mix outline and filled families in the same module.**

### 9.1 Mascot-as-icon (THE rule)

The mascot **only appears at icon scale** as a small companion graphic. Never as illustration, hero, or photographic-style imagery.

**Why.** Product photography is real 3D. Marketing imagery is 3D-rendered (nano-banana). The mascot is a 2D cartoon — mixing those scales breaks coherence. At icon size the mascot reads as a system glyph, not a competing illustration.

**Allowed slots**
- Footer wordmark companion (24px)
- Inline next to a label or CTA (16px)
- Empty-state glyph in a card (32px)
- List bullet replacement (16px) — sparingly
- Toast / notification icon (20px)

**Forbidden**
- Hero illustrations
- Section dividers / decorative imagery
- Inside primary CTA buttons
- Pricing card decoration
- Anywhere it would compete with product photography

**Frequency.** Max 2 mascot icons per page. Often zero is correct.

**Assets.** Mascot icon assets are generated separately (nano-banana) at 16/20/24/32px PNG with transparent background.

---

## 10. Imagery — the two-track rule

There are exactly **two image tracks**. **Never blend them in the same module.**

### 10.1 Marketing 3D
- **What.** 3D-rendered scenes (nano-banana) — toolkit shots, ambient props, environmental textures.
- **Where.** All marketing surfaces — hero stages, section illustrations, feature explainers.
- **Framing.** Always inside `.imageFrame` — `rounded-xl shadow-sm border border-hair`.
- **Backdrop.** Cream, snow, or cocoa-deep — never on paper white.

### 10.2 Product photography
- **What.** Real studio photo of the physical Shmocard.
- **Where.** **E-commerce only** — product detail, Add-to-cart tiles, checkout, order confirmation.
- **Framing.** 1:1 aspect, cream-soft backdrop, no drop shadow on the photo (the card has its own subject lighting).
- **Forbidden.** Never appears in marketing flow surfaces. Never alongside 3D imagery in the same component.

---

## 11. Internationalization (EN / FR)

**Mechanic only — no copy guidance.** French copy runs ~15–25% longer than English; components must flex.

- Buttons: never fixed-width. Use `min-w-*` and let content size.
- Headlines: never assume single line. Allow 2–3 lines + `text-wrap: balance`.
- Nav: allow wrap or compress to a hamburger earlier in FR.
- Eyebrows: keep 11px uppercase; tighten tracking `1.6px → 1.4px` for long FR words if needed.
- **Truncation forbidden** in primary CTAs and pricing labels.
- Language switcher: see §7.12.

---

## 12. Don'ts (high-signal anti-patterns)

- ❌ Pure black `#000` — ink is always chocolate.
- ❌ Pure gray borders — borders are translucent ink.
- ❌ Fraunces serif for body or for >2 consecutive words.
- ❌ Ember as a flood color (it's an accent).
- ❌ Two primary buttons in the same CTA group.
- ❌ Mascot at illustration / hero scale.
- ❌ 3D marketing imagery in the same module as product photography.
- ❌ Spacing values outside the 4/8 scale.
- ❌ `shadow-lg` together with a heavy hairline border on one element.
- ❌ Emojis as decorative accents.
- ❌ Gradient backgrounds outside the cocoa-hot recipe.
- ❌ Rounded card with a left-border accent stripe (SaaS-blog cliché — not Shmocard).
- ❌ Mixing icon families (outline + filled) in the same module.

---

## 13. Quick-reference: build a section in 30 seconds

```tsx
// 1. Pick a recipe.
<section className="bg-snow py-[88px]">
  <div className="max-w-[1320px] mx-auto px-7">

    {/* 2. Eyebrow + headline + lede */}
    <span className="t-eyebrow text-ember">Section eyebrow</span>
    <h2 className="t-h2 mt-3">
      Something <em className="font-serif italic font-normal text-ember">honest</em> here.
    </h2>
    <p className="t-lede mt-4 max-w-2xl">A short lede paragraph.</p>

    {/* 3. Cards using the recipe */}
    <div className="mt-12 grid grid-cols-3 gap-6">
      <article className="bg-paper border border-hair rounded-xl shadow-sm p-7">
        <h3 className="t-h3">Card title</h3>
        <p className="t-body mt-2">Card body copy.</p>
      </article>
    </div>

  </div>
</section>
```
