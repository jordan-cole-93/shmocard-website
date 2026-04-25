# Shmocard Homepage — Phase A Design Spec

**Date:** 2026-04-25
**Author:** Brainstormed with Jordan via Claude Code
**Status:** Approved — ready for implementation plan

---

## 1. Scope

Phase A is the **scaffold + top-of-page** for the Shmocard parent-brand homepage at `shmocard.com/`. Goal: a homepage that renders top-to-bottom on localhost with the brand's visual identity locked in, four sub-brands introduced, and the page navigable.

**In scope:**
- Next.js (App Router) + TypeScript + Tailwind 4 + Framer Motion + Lucide scaffold in the project root
- Design tokens from `branding guide/styles.css` lifted into `app/globals.css`
- Google Fonts via `next/font`: Inter Tight, Fraunces italic, JetBrains Mono
- **Nav** (adapted from `branding guide/home-nav.jsx`)
- **Hero** (adapted from `home-hero.jsx`, copy and structure swapped to match wireframe + marketing.md)
- **ShmoFamily grid** (adapted from `home-family.jsx`, copy synced to wireframe)
- **Footer** (adapted from `home-footer.jsx`)
- Smooth-scroll behavior, sticky nav with subtle backdrop blur
- Restrained Framer Motion entrance animations + `prefers-reduced-motion` respect
- Responsive breakpoints: 375 / 768 / 1024+
- Accessibility baseline (focus rings, alt text, touch targets, contrast)

**Explicitly out of scope (deferred):**
- Wireframe sections 3 (Why Shmocard), 4 (Shmo Review Spotlight), 5–7 (Biz / Link / Reputation Spotlights), 8 (Real Results), 9 (Testimonials), 10 (FAQ), 11 (Final CTA)
- Real Shopify cart and checkout flow (cart icon is a non-functional stub)
- Email capture for "Get notified" CTAs (stubs)
- `/shmo-review` route (Hero secondary CTA links there but it 404s in Phase A — built in a later phase)
- Nano-banana mascot regeneration (existing PNG placeholders are used)
- Footer link destinations (most are `#` placeholders until those pages exist)

---

## 2. Source-of-truth boundaries

| Concern | Source of truth |
|---|---|
| Visual layout, components, type rhythm, color usage | `branding guide/` (jsx + styles.css) |
| Headlines, body copy, CTAs, voice | `.claude/rules/marketing.md` + `wireframe/home-page-shmocard.md` |
| Page hierarchy, section order | `wireframe/home-page-shmocard.md` |
| Stack and architecture | `.claude/rules/backend.md` |
| Design tokens (palette, type, spacing, shadow) | `.claude/rules/design.md` + `branding guide/styles.css` |
| Product data | Shopify (Phase A doesn't fetch any — placeholder/static only) |

**Rule:** When the branding guide jsx and the wireframe disagree on copy or structure, the wireframe wins. The branding guide jsx was generated without marketing context.

**Rule:** When the wireframe contains an unverified stat (e.g. "1,000+ local crews"), drop it. Only use verified proof points from `marketing.md`.

---

## 3. Project structure

Scaffold lands in the project root alongside existing `branding guide/`, `wireframe/`, `pictures/`, `.claude/` folders.

```
/                              ← Next.js root
├── app/
│   ├── layout.tsx              ← Fonts, <body>, global CSS import
│   ├── page.tsx                ← Composes Nav + Hero + ShmoFamily + Footer
│   ├── globals.css             ← Tokens from branding guide/styles.css + Tailwind layers + imports home.css
│   └── home.css                ← BEM section styles from branding guide/home-styles.css
├── components/
│   ├── nav/Nav.tsx
│   ├── footer/Footer.tsx
│   └── home/
│       ├── Hero.tsx
│       └── ShmoFamily.tsx
├── lib/icons.tsx               ← Lucide re-exports for Tap, Arrow, Check, Cart, Search
├── public/
│   └── mascot/                 ← Mascot PNGs copied from branding guide/assets/mascot/
├── package.json
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
└── (existing: branding guide/, wireframe/, pictures/, .claude/, CLAUDE.md, etc.)
```

No `src/` directory — single-purpose project. New page components live under `components/home/`; future product pages get their own folders (`components/shmo-review/`, etc.).

---

## 4. Design tokens & fonts

### Tokens (from `branding guide/styles.css`)
Lift directly into `app/globals.css` — no token names get renamed, no values get changed. Tokens cover:

- Colors (Cream, Snow, Paper, Ember + variants, Honey + variants, Chocolate/Ink + variants, Hair, Success, Warn)
- Spacing (`--gutter`, `--section-y`, `--maxw`)
- Radii (`--r-xs` through `--r-2xl`, `--r-full`)
- Shadows (`--sh-sm`, `--sh-md`, `--sh-lg`, `--sh-card`)
- Type scale (Display, H1, H2, H3, Eyebrow, Lede, Body, Stat, Mono)

### Fonts (via `next/font/google`)

| Role | Font | Weights | CSS variable |
|---|---|---|---|
| Sans (dominant) | Inter Tight | 400, 500, 600, 700, 800 | `--font-inter-tight` |
| Serif (accent only) | Fraunces italic | 400, 500 (ital only) | `--font-fraunces` |
| Mono | JetBrains Mono | 400, 500 | `--font-jetbrains-mono` |

Set CSS variables on `<html>` so all CSS can reference them. `next/font` self-hosts the files — no FOUC, no render-blocking external request.

### Section styles (from `branding guide/home-styles.css`)
This file contains the BEM-style section styles for nav, hero, family, footer, etc. (`.home-hero`, `.family__tile`, `.nav__link`, etc.). Lift it into `app/home.css` and import it from `app/globals.css`. Keep the file separated from tokens so reading either file stays focused.

### Tailwind + custom CSS strategy
Tailwind 4 handles utility-driven new work. The existing BEM class names from `home-styles.css` are preserved verbatim so the visual DNA from the branding guide ports cleanly without rewriting hundreds of lines as Tailwind utilities. New components prefer Tailwind utilities; ported components keep their existing BEM class names.

### Hard rule — Fraunces italic
Appears only on intentional accent words, always inside an `<em>`, always Ember (`#FF5B1F`), max one or two per scene. Never on body text. Never on multiple consecutive words.

---

## 5. Components

### 5.1 Nav (`components/nav/Nav.tsx`)

Adapted from `branding guide/home-nav.jsx`. Same structure:
- Brand wordmark: `Shmo<em>card</em>` with the "card" in Fraunces italic Ember
- Sub-brand links: Shmo Review (with **Live** pill) · Shmo Biz · Shmo Link · Shmo Reputation
- Company links: How it works · Pricing · About
- Right side: Search icon (stub), Cart icon (stub, no badge for Phase A), Shop primary CTA, Hamburger
- Mobile drawer for tablet/mobile (built into the jsx already)

**Phase A additions:**
- Sticky behavior (`position: sticky; top: 0;`)
- Subtle backdrop blur + Cream/90 background once user scrolls past 16px (a one-line scroll handler with `requestAnimationFrame` debounce)
- **All four sub-brand links scroll to `#family`** for Phase A. The full per-product spotlight sections don't exist yet, so a single shared anchor avoids broken navigation. When the spotlight sections (`#review`, `#biz`, `#link`, `#reputation`) get built in later phases, the nav anchors get re-pointed individually.

**Phase A stubs:**
- Cart icon: clickable but does nothing (no badge, no panel). Wired in a later phase when Shopify cart is in.
- Search icon: same — clickable but does nothing.

### 5.2 Hero (`components/home/Hero.tsx`)

Adapted layout from `home-hero.jsx` (split variant: copy left, mascot right). All copy and product-tile content swapped.

**Copy (locked):**
- Headline: **"The toolkit your crew's been missing."**
- Subhead: **"Four tools built for Main Street. Reviews, contacts, links, reputation — every customer interaction your crew was letting slip through the cracks."**
- Primary CTA: **"Meet the tools ↓"** → smooth-scrolls to `#family`
- Secondary CTA: **"Shop Shmo Review →"** → links to `/shmo-review` (404s in Phase A; routed in later phase)
- Trust strip: **"No subscription required · Made for Main Street."** (no invented stats)

**Visual:**
- Mascot: `public/mascot/hero-toolkit.png` (sourced from `branding guide/assets/mascot/`)
- The original 3-product tile row (CR-80 / L-Sign / Square Disc) is **removed**. In its place: a small 4-up icon row of the sub-brands using Lucide SVG icons, no copy on it. Decorative rhythm element only — the full sub-brand tiles are the next section.

**Marketing.md guardrails:**
- No "1,000+ local crews" or any invented number anywhere in this section
- No "leverage", "frictionless", "seamless", "10x", "ship", "vibe"
- Headline gets one Fraunces italic accent if it reads cleanly (e.g. emphasis on "missing"), else stays plain Inter Tight

### 5.3 ShmoFamily grid (`components/home/ShmoFamily.tsx`)

Adapted from `home-family.jsx`. Existing tile structure kept (status badge, glyph, name with `<em>` on second word, description, CTA arrow).

**Section header:**
- Eyebrow: **"Meet the family"**
- Headline: **"Pick your tool."**

**Tiles (copy from wireframe):**

| Sub-brand | One-liner | Status | CTA | Stub behavior |
|---|---|---|---|---|
| Shmo Review | "One tap. One five-star review." | Live | "Shop now →" | Links to `/shmo-review` (404s in Phase A) |
| Shmo Biz | "Your business card, upgraded." | Coming Soon | "Get notified" | Click does nothing |
| Shmo Link | "All your links. One place." | Coming Soon | "Get notified" | Click does nothing |
| Shmo Reputation | "Every review, answered automatically." | Coming Soon | "Get notified" | Click does nothing |

**Section anchor:** `<section id="family">` so the hero CTA can scroll to it.

### 5.4 Footer (`components/footer/Footer.tsx`)

Adapted from `home-footer.jsx`. 5-column grid kept: Brand + Software + Shop + Company + Support.

**Phase A copy adjustments:**
- Brand tagline: **"Made for Main Street by Shmocard."** (replaces "Built in Minneapolis, shipped worldwide" — Jordan is in France, that line wasn't accurate)
- All footer links go to `#` placeholders for Phase A — wired up as their corresponding pages get built
- Social icons stay as visual elements; URLs are `#` until real handles are confirmed
- Legal row: copyright with current year + Terms/Privacy/Cookies links (all `#` for Phase A)

---

## 6. Behavior, animation, responsive

### Page composition (`app/page.tsx`)
```tsx
<Nav />
<main>
  <Hero />
  <ShmoFamily id="family" />
</main>
<Footer />
```

### Scroll
- `<html>` gets `scroll-behavior: smooth`
- Sticky nav with offset scroll-margin on `#family` so the heading isn't hidden under the nav

### Animation (Framer Motion)
- Hero copy: fade-in + 12px translate on mount, ~280ms total. Headline → subhead → CTAs with 50ms stagger.
- Hero mascot: gentle fade-in only (no bounce — passes the tradesperson test)
- Family tiles: fade-up on scroll-into-view, 60ms stagger
- All animations replaced with instant fades when `prefers-reduced-motion` is set
- No parallax, no scroll-jacking, no hero video

### Responsive breakpoints
- **375px (mobile):** Hamburger drawer. Hero stacks (headline → subhead → CTAs → trust strip → mascot below). Family is 1 column. Footer stacks.
- **768px (tablet):** Hamburger drawer. Hero still stacked. Family is 2 columns. Footer is 2 columns.
- **1024px+ (desktop):** Full nav links visible. Hero is split (copy left, mascot right). Family is 4 columns. Footer is 5 columns.
- **Body type ≥ 16px on mobile** (ui-ux-pro-max accessibility rule)

### Mascot assets
Copy `branding guide/assets/mascot/hero-toolkit.png` into `public/mascot/`. Only this one pose is needed for Phase A. Use `next/image` for automatic WebP + srcset + lazy loading.

**Note:** All mascot images on the live site are placeholders. Real mascot regeneration via nano-banana is deferred — there's a known gotcha around JPEG output without alpha that needs solving first (background removal pipeline). Don't trigger nano-banana for Phase A.

### Accessibility baseline (non-negotiable)
- All interactive elements: `cursor-pointer`
- Visible focus rings on tab navigation: 2px Ember outline with 2px offset
- Touch targets ≥ 44×44px on CTAs, nav links, family tiles
- Mascot images: descriptive alt text (e.g. "Shmocard mascot holding a toolkit of cards")
- Cart and Search icon buttons: `aria-label`
- Color contrast: Ink on Cream passes 4.5:1; Ember reserved for buttons/accents (never body text)

---

## 7. Verification (definition of done)

### Build-level
- `npm run dev` boots without errors → localhost:3000 renders
- `npm run build` completes without TypeScript or lint errors
- No console errors in the browser on initial load

### Visual smoke test (in browser via Browsermcp before showing Jordan)
- Page renders top-to-bottom: Nav → Hero → Shmo Family → Footer
- Cream page background, paper cards, Ember accents — palette matches design.md
- Inter Tight everywhere, Fraunces italic only on intentional accent words
- Hero mascot loads, no broken image
- "Meet the tools ↓" CTA scrolls smoothly to family section, lands cleanly under sticky nav
- 4 family tiles render correctly (Shmo Review = Live; the other three = Coming Soon)

### Responsive smoke test
- 375px: hamburger drawer opens/closes, hero stacks, family is 1 column
- 768px: hero still stacked, family is 2 columns
- 1280px: full nav, hero split, family is 4 columns

### Accessibility smoke test
- Tab through page → focus rings visible on every interactive element
- Cart button has `aria-label`, mascot has descriptive alt
- No horizontal scroll on any breakpoint

### Sub-agent reviews (per CLAUDE.md universal rules)
- `design-reviewer` runs against the homepage before showing Jordan — checks against `design.md`
- `copy-reviewer` runs against the homepage before showing Jordan — checks against `marketing.md`

### What Jordan sees
Jordan opens localhost:3000, sees a homepage that feels like Shmocard, scrolls smoothly to the family grid, and the page reads cleanly on his phone. If anything in the visual review fails, fix it before claiming "ready to look at."

---

## 8. Decisions locked during brainstorming

1. Phase A scope = scaffold + nav + hero + family + footer only
2. Branding guide jsx files = visual reference; wireframe + marketing.md = copy/structure source of truth
3. Scaffold goes in project root (no `src/` or `web/` subfolder)
4. Tokens lifted directly from `styles.css` — no rename, no rework
5. Hero uses split layout variant from `home-hero.jsx`
6. Hero trust strip = "No subscription required · Made for Main Street." (no invented stats)
7. Family headline = "Pick your tool."
8. Cart, "Get notified", footer links, `/shmo-review` link = stubs for Phase A
9. Mascot regeneration via nano-banana deferred — placeholders only for Phase A
10. ui-ux-pro-max skill is loaded as a quality guardrail (Pre-Delivery Checklist) — not used to generate a design system since the design system is locked
