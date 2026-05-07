# Phase 2 / Step 02-05: Reference-page Translation Plan

**Date:** 2026-05-07
**Status:** Locked
**Consumed by:** Phase 3 (every plan stub `03-*` references this doc)

---

## TL;DR

Translate three reference surfaces from their current rendering models into Next.js 15 App Router `.tsx` components:

| Surface | Source | Target |
|---|---|---|
| Homepage | `.claude/skills/shmocard-design-system/ui_kits/website/homepage/Shmocard Homepage.html` (Babel-loaded React 18 + 5 `home-*.jsx` bundles + `home.css`) | `app/page.tsx` + `components/home/*.tsx` + `components/home/home.css` |
| PDP / Buybox | `.claude/skills/shmocard-design-system/ui_kits/website/Buybox.html` (vanilla HTML + inline `<style>`) | `app/shmo-review/[handle]/page.tsx` + `components/pdp/*.tsx` + `components/pdp/pdp.css` |
| Cart drawer | `.claude/skills/shmocard-design-system/ui_kits/website/Cart Drawer.html` (vanilla HTML + multi-state artboard preview) | `components/cart/CartDrawer.tsx` + `components/cart/CartLine.tsx` etc. (mounted globally in `app/layout.tsx`) |

Layout in `.tsx` uses Tailwind 4 utilities (per `INTEGRATION.md`). Visual classes are `.shm-*` from the imported design system. State management = React server components where possible + minimal client state for cart, mobile nav, modals.

---

## Source state inventory

```
.claude/skills/shmocard-design-system/ui_kits/website/
├── homepage/
│   ├── Shmocard Homepage.html      (20-line shell — loads React, ReactDOM, Babel from CDN, mounts to <div id="app">)
│   ├── home.css                    (980 lines — page layout + section comments at top)
│   ├── home-bundle.jsx             (883 lines — main entry composing the page)
│   ├── home-app.jsx                (260 lines — app shell, root layout)
│   ├── home-parts.jsx              (187 lines — section components)
│   ├── home-modals.jsx             (240 lines — waitlist + cart + lightbox modals)
│   ├── home-data.jsx               (150 lines — mock content: SUB_BRANDS, SHOPS, QUOTES, AUDIENCES, HOW_STEPS, FAQ)
│   ├── tweaks-panel.jsx            (552 lines — DEV-ONLY tweak panel; do not translate)
│   ├── image-slot.js               (641 lines — DEV-ONLY image-slot picker; do not translate)
│   ├── .image-slots.state.json     (gitignored runtime state)
│   └── .design-canvas.state.json   (gitignored runtime state)
├── Buybox.html                     (418 lines — vanilla HTML + inline <style>; one PDP example)
├── Cart Drawer.html                (449 lines — vanilla HTML + multi-frame artboard previewing cart states)
└── design-canvas.jsx               (DEV-ONLY canvas; do not translate)
```

**Don't translate:**
- `tweaks-panel.jsx`, `image-slot.js`, `design-canvas.jsx` — design-time iteration tools, never ship to production.
- `.image-slots.state.json`, `.design-canvas.state.json` — runtime state, gitignored.

---

## Homepage — section-by-section translation

The 12 sections are spelled out in `home.css` lines 1–63 (the file's header doc). Translation maps each to a target file + Tailwind layout strategy + `.shm-*` primitives + state surface.

| # | Section | Target component | Primitives used | Notes |
|---|---|---|---|---|
| 01 | NAV | `components/nav/Nav.tsx` | `.shm-nav`, `.shm-btn`, `.shm-badge`, `.shm-cart-trigger` (from cart drawer family) | 4-link product menu with inline status badges. Cart icon-button opens drawer. Mobile breakpoint behaviors deferred to Phase 4. |
| 02 | HERO | `components/home/Hero.tsx` | `.shm-display` w/ em-cycle, `.shm-eyebrow`, `.shm-lede`, `.shm-btn--primary`, `.shm-btn--ghost`, `.shm-hand` | Type-cycle animation on the `<em>` accent — uses CSS-only or minimal client JS (see "Animation" below). 4-tile toolkit grid below the fold. |
| 03 | AUDIENCE STRIP | `components/home/AudienceStrip.tsx` | `.shm-bg-graham`, hairline borders | Single-line marquee on graham bg. `<ul>` of brand audiences from `AUDIENCES` const. CSS keyframes scroll-left, `38s` duration, paused on hover. |
| 04 | PROOF | `components/home/Proof.tsx` | `.shm-card`, `.shm-review` | 2-column: testimonial quotes (left) + grid of shop cards with "+%" metrics (right). Sources: `QUOTES` + `SHOPS` constants. |
| 05a | SUB-BRAND SPOTLIGHT — Review | `components/home/SubBrandSpotlight.tsx` (one component, used 4× w/ different data) | `.shm-bg-marsh`, `.shm-eyebrow`, `.shm-badge--status-clover`, `.shm-display`, `.shm-lede`, `.shm-checklist`, `.shm-btn--primary`, `.shm-btn--ghost`, `.shm-mascot--hero` (showcase exception) | Image slot opposite side. Reverses every other one. |
| 05b | CREW STRIP | `components/home/CrewStrip.tsx` | `.shm-bg-marsh`, `.shm-image-frame` | Inserted directly after Shmo Review spotlight. 6-up grid of square crew photos. |
| 05c | SUB-BRAND SPOTLIGHT — Biz | `<SubBrandSpotlight data={SUB_BRANDS[1]} />` | Same component, `.shm-bg-graham` | Mascot art (`holding-card.png`). "Notify me" CTA opens waitlist modal. |
| 05d | SUB-BRAND SPOTLIGHT — Link | `<SubBrandSpotlight data={SUB_BRANDS[2]} />` | Same component, `.shm-bg-marsh` | Mascot (`heart-hands.png`). |
| 05e | SUB-BRAND SPOTLIGHT — Reputation | `<SubBrandSpotlight data={SUB_BRANDS[3]} />` | Same component, `.shm-bg-cocoa` | Mascot (`megaphone.png`). Tall wave to FAQ section. |
| 06 | HOW IT WORKS | `components/home/HowItWorks.tsx` | `.shm-card`, `.shm-step` | 3-column grid of numbered steps (6 total — 2 rows). Sources `HOW_STEPS` constant. |
| 07 | VIDEO TESTIMONIALS | `components/home/VideoTestimonials.tsx` | `.shm-card`, `.shm-image-frame` | 3-up grid 4:5 video cards w/ flat-color backgrounds (ember/cocoa/honey — design system "showcase exception" allows denser flat-color tiles than usual). Click → opens lightbox modal. |
| 08 | COMPATIBILITY | `components/home/Compatibility.tsx` | `.shm-bg-graham`, hand-drawn icons | 3 icon+text items, ember icons. Static. |
| 09 | FAQ | `components/home/HomeFaq.tsx` | `.shm-faq-list` (soft default), `.shm-sticker--md` | Sticker mascot in corner of section head. Sources `FAQ` constant. |
| 10 | FINAL CTA | `components/home/FinalCta.tsx` | `.shm-bg-ember`, `.shm-display`, `.shm-btn--cream`, `.shm-btn--ghost.on-dark` | Single high-emphasis ember band. |
| 11 | FOOTER | `components/Footer.tsx` (global, not home-specific) | `.shm-bg-cocoa`, hairline grid | 4-column: brand+social, products, shop, help. Bottom copyright row. |

**Total homepage components:** 11 (Nav and Footer are global; reused by every page).

### Modals (mounted to `<div id="modal-root">` in source; in Next.js use a portal)

| Modal | Target component | Trigger | State |
|---|---|---|---|
| Cart drawer | `components/cart/CartDrawer.tsx` | Nav cart icon, "Add to cart" buttons on PDP | Cart state (line items, qty, totals, free-ship progress) |
| Waitlist | `components/modals/WaitlistModal.tsx` | "Notify me" CTAs on Biz / Link / Reputation spotlights | Open/closed + form state (email, product name) |
| Video lightbox | `components/modals/VideoLightbox.tsx` | Click on video tile in VideoTestimonials | Open/closed + active video URL |

---

## PDP / Buybox — section-by-section translation

Buybox.html composes the canonical PDP layout. Translation:

```
app/shmo-review/[handle]/page.tsx     ← server component, fetches Shopify product by handle param
└── <PdpBuybox product={product} />
    ├── <PdpGallery images={...} />              (.shm-gallery + .gal__thumbs)
    ├── <PdpBuyboxColumn product={...} />
    │   ├── <ShmRating />                        (.shm-rating)
    │   ├── <PdpHeading title sub />             (.shm-h1 + .shm-h3)
    │   ├── <PdpChecklist items />               (.shm-checklist)
    │   ├── <PdpPackSelector packs />            (.shm-pack-rows or .shm-pack)
    │   ├── <PdpQtyStepper />                    (.shm-qty)
    │   ├── <PdpGoogleInput />                   (.shm-google — captures Google review URL)
    │   ├── <PdpAddToCart />                     (.shm-btn--primary--lg, dispatches cart action)
    │   └── <PdpCallout />                       (.shm-callout — free-ship band)
    ├── <PdpStickyBar />                         (.shm-buybox-sticky — slides DOWN on scroll past gallery)
    └── <PdpFaq items />                         (.shm-faq-list)
```

**File breakdown:**

```
app/shmo-review/[handle]/page.tsx        ← Next.js dynamic route, server component
components/pdp/
├── PdpBuybox.tsx                        ← orchestrator
├── PdpGallery.tsx                       ← main image + thumb stack, client component (active state)
├── PdpBuyboxColumn.tsx                  ← right-column composition
├── PdpHeading.tsx                       ← title + sub
├── PdpChecklist.tsx                     ← simple list
├── PdpPackSelector.tsx                  ← pack-rows variant; client (selected state)
├── PdpQtyStepper.tsx                    ← qty +/- ; client
├── PdpGoogleInput.tsx                   ← captures Google review URL; client
├── PdpAddToCart.tsx                     ← dispatches cart line add; client
├── PdpCallout.tsx                       ← free-ship band
├── PdpStickyBar.tsx                     ← scroll-driven; client
├── PdpFaq.tsx                           ← reuses .shm-faq-list
└── pdp.css                              ← LAYOUT only (gallery grid, sticky bar positioning)
```

**Storefront API mapping:**

The PDP page is a **server component**. It fetches the product by handle from Shopify Storefront API (per `REQ-06` and `shopify-data-discipline.md` rule):

```tsx
// app/shmo-review/[handle]/page.tsx (sketch)
export default async function PdpPage({ params }: { params: { handle: string } }) {
  const product = await getProductByHandle(params.handle);
  return <PdpBuybox product={product} />;
}
```

Variants, pricing, image URLs, available-for-sale, options all come from `product.*` fields. Hardcoded fallback content (programming process steps, return policy, FAQ) lives in code; it's marketing copy, not product data.

---

## Cart drawer — translation

`Cart Drawer.html` is a **state-preview canvas** — multiple `.ab-frame` artboards demonstrating empty / filling / unlocked-free-ship / discount-applied / loading states side-by-side. **Don't translate the artboard layout** — just the cart drawer primitive itself.

```
components/cart/
├── CartDrawer.tsx                       ← wrapper using .shm-cart, .shm-scrim
├── CartHeader.tsx                       ← .shm-cart__head with close button
├── CartFreeShipBand.tsx                 ← .shm-cart__ship (with --unlocked variant)
├── CartLine.tsx                         ← .shm-cart-item (per line item)
├── CartQty.tsx                          ← .shm-qty (reused from PDP)
├── CartUpsell.tsx                       ← .shm-cart-upsell (cross-sell grid)
├── CartMilestones.tsx                   ← .shm-cart-milestones (4-step unlock track)
├── CartSummary.tsx                      ← .shm-cart-summary (totals)
├── CartCheckoutButton.tsx               ← .shm-cart-cta (full-width, with mascot)
├── CartTrustStrip.tsx                   ← .shm-cart-trust micro-row
├── CartPaymentsStrip.tsx                ← .shm-cart-payments
├── CartEmpty.tsx                        ← .shm-cart-empty
└── cart-drawer.css                      ← LAYOUT only (drawer positioning, scrim, transform animation)
```

**Mounting:** `<CartDrawer />` lives in `app/layout.tsx` (so it's available on every page). State is global — see "State management" below.

---

## State management approach

### Cart state — minimal client store

Use **Zustand** (small, ~3KB) or **React Context + useReducer** for cart state. Cart needs to:
- Persist across page navigations (server components remount; cart shouldn't reset)
- Sync with Shopify Cart API (`cartCreate`, `cartLinesAdd`, `cartLinesRemove`, `cartLinesUpdate`)
- Persist across page refreshes via `localStorage` (Shopify cart ID)
- Update from any page (PDP "Add to cart", cart-line `+/-`, drawer "Remove")

Recommended: **Zustand with localStorage middleware**. Simpler than Context for cross-page state, smaller than Redux, well-typed.

```tsx
// components/cart/store.ts (sketch)
export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      cartId: null,
      lines: [],
      total: '0',
      isOpen: false,
      addLine: async (variantId, qty) => { /* call Shopify cartLinesAdd, update lines */ },
      removeLine: async (lineId) => { /* ... */ },
      updateQty: async (lineId, qty) => { /* ... */ },
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false })
    }),
    { name: 'shmocard-cart' }
  )
);
```

**Open question (decision needed):** Zustand vs Context+Reducer. Recommendation: **Zustand**. Less boilerplate, smaller bundle, persists for free. Defer if Jordan prefers fewer dependencies.

### Modals — local component state

Waitlist, video lightbox, mobile nav are **local UI state** — `useState` in the component that owns them, or a tiny local context if shared between siblings. No global store needed.

### Form state — React 19 actions or controlled inputs

The waitlist form posts to GHL webhook. Use Next.js Server Action pattern:

```tsx
// components/modals/WaitlistModal.tsx (sketch)
async function submitWaitlist(formData: FormData) {
  'use server';
  await fetch(process.env.GHL_WEBHOOK_URL!, { method: 'POST', body: formData });
}
```

Server Actions are cleaner than `onSubmit` + fetch + state.

### Server vs Client components — default split

| Surface | Default | Why |
|---|---|---|
| Page roots (`app/page.tsx`, `app/shmo-review/page.tsx`, `app/shmo-review/[handle]/page.tsx`) | **Server** | Fetch Shopify data on the server; no client JS needed for the shell. |
| Static sections (`Hero`, `AudienceStrip`, `Proof`, `HowItWorks`, `Compatibility`, `Footer`) | **Server** | No interactivity. SSR + zero JS. |
| Sticky nav with cart count | **Client** | Reads cart state, updates on cart change. |
| `SubBrandSpotlight` containing waitlist trigger | **Hybrid** | Section is server; the "Notify me" button is a client component. |
| `VideoTestimonials` | **Client** | Lightbox open state. |
| `CartDrawer` and all cart components | **Client** | Cart state + animations. |
| `PdpGallery`, `PdpPackSelector`, `PdpQtyStepper`, `PdpAddToCart`, `PdpStickyBar`, `PdpGoogleInput` | **Client** | All have selected/active state or scroll-driven behavior. |
| `PdpBuybox` page wrapper itself | **Server** | Fetches product, passes data down. |

Rule: server-component-first. Add `'use client'` only when the component reads browser APIs, holds local state, or attaches event handlers.

---

## Animation approach

The design system motion tokens are:
- `--motion-fast` 150ms — hover transitions
- `--motion-base` / `--motion-normal` 220ms — panels, dropdowns
- `--motion-slow` 320ms — drawers
- `--ease-standard` `cubic-bezier(.2,.8,.2,1)`

**Default: CSS transitions only.** All hover effects, button shadow upgrade, FAQ chevron rotate, drawer slide-in, sticky bar slide-down can be done with CSS `transition` + `transform`. No JS animation library needed.

**Specific animations:**

| Animation | Implementation |
|---|---|
| Button hover (translate + shadow upgrade) | CSS `transition` on `transform` + `box-shadow` already in `components.css`. Free. |
| Cart drawer slide-in | CSS `transform: translateX()` + `transition` on `.shm-cart` + `.shm-cart.is-open` toggle. JS sets the class. |
| Sticky buybox slide-DOWN on scroll past gallery | Intersection Observer on the gallery; toggle `data-visible` on the sticky bar. CSS handles the visual. |
| Hero `<em>` type-cycle (rotates between accent words) | Small client component using `setInterval` + 3–4 cycle words. ~30 lines. No library. |
| Audience marquee scroll | Pure CSS `animation: scroll-left 38s linear infinite`. No JS. |
| FAQ chevron rotation | CSS `transition: transform` + `[aria-expanded="true"]` selector. Already in `components.css`. |
| Page-level entrance | None for v1. Add View Transitions API later if Jordan wants polish (zero-cost in Next.js 15). |

**`framer-motion` is locked in for v1** (per step 02-06 / `DECISIONS.md` D-02 — Jordan's call). Use it for **section-level reveals, drawer / modal entrances, page transitions, sub-brand spotlight reveals** — the polish surfaces. Keep CSS-only for **per-element hover transitions** (button lift, card hover, FAQ chevron, audience marquee scroll) — those are already built into `components.css` and shouldn't be re-implemented in JS.

**Constraints when using `framer-motion`** (from design system):
- Subtle, fast, never bouncy. Use `tween` + `ease: [0.2, 0.8, 0.2, 1]` (matches `--ease-standard`), NOT `spring` with high stiffness.
- Match design system timing tokens: `0.15s` (`--motion-fast`) for hover-adjacent, `0.22s` (`--motion-base`) for panels/drawers, `0.32s` (`--motion-slow`) for major transitions.
- Don't replace CSS hover transitions — those stay in `components.css`.

**Suggested usage map:**

| Surface | Approach |
|---|---|
| Button hover lift + shadow upgrade | CSS only (already in `components.css`) |
| Cart drawer slide-in | `framer-motion` `<motion.div>` with `x: -100% → 0`, 0.32s ease-standard |
| Sticky buybox slide-DOWN | `framer-motion` `<motion.div>` driven by `useScroll` + Intersection Observer, 0.22s |
| Sub-brand spotlight reveal | `framer-motion` `<motion.div>` with `opacity + y: 16 → 0`, 0.22s, triggered when section enters viewport |
| Hero `<em>` type-cycle | Small client component using `useState` + `setInterval`. `framer-motion` not needed unless we want crossfade — if so, `<AnimatePresence>` + 0.15s fade. |
| Audience marquee scroll | Pure CSS keyframes (already in `components.css`) — `framer-motion` overkill |
| FAQ chevron rotation | CSS `transition: transform` (already in `components.css`) |
| Video lightbox open | `framer-motion` `<AnimatePresence>` + scale 0.95 → 1 + opacity, 0.22s |
| Page-level transitions (route changes) | Defer to Phase 4; revisit View Transitions API if Next.js 15 supports natively. |

---

## Mascot rendering

Source pattern from `colors_and_type.css`:

```html
<img src="mascot/megaphone.png" class="shm-mascot shm-mascot--accent" style="--mascot-fit-ratio: 1.3;">
```

Translation to React:

```tsx
// components/Mascot.tsx
type MascotProps = {
  src: string;
  size: 'decoration' | 'accent' | 'supporting' | 'hero';
  fitRatio?: number;
  alt?: string;
  className?: string;
};

export function Mascot({ src, size, fitRatio, alt = '', className = '' }: MascotProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={`shm-mascot shm-mascot--${size} ${className}`}
      style={fitRatio ? { ['--mascot-fit-ratio' as any]: fitRatio } : undefined}
    />
  );
}
```

Same pattern for `<Sticker />` (`.shm-sticker--{xs|sm|md}`).

**Per-image fit ratios** (from existing data): megaphone = 1.3 (the file with the most transparent padding). Default = 1.0.

---

## Asset migration

Reference pages use these paths (relative to `ui_kits/website/`):
- `../../assets/products/cr80-flat-pair.png`, `cr80-trio.png`, `cr80-flat-pair-thumb.png`, etc.
- `../../assets/lifestyle/lifestyle-1.jpg` through `4`
- `assets/mascot/holding-card.png`, `heart-hands.png`, `megaphone.png` (and 13 mascot emotions per README)

**Currently `.claude/skills/shmocard-design-system/assets/` does not exist** (verified 2026-05-07 via `[ -d assets ]`).

**Phase 3 plan for assets:**
1. Jordan provides product photos + mascot PNGs + lifestyle images.
2. They land at **`public/`** (Next.js convention) — not `.claude/skills/shmocard-design-system/assets/`. The design system folder stays code-only; the `public/` folder serves runtime media.
3. Reference paths in `.tsx` use `/products/cr80-trio.png` (absolute from `public/`).
4. Update `home-data.jsx` mock paths during translation: `assets/products/...` → `/products/...`.

**Open question for Jordan (resolved in step 02-06):** confirm assets land in `public/` not inside the design system folder.

---

## Translation rules (every component must follow)

1. **Every utility class begins with `shm-`** unless it's a layout-only Tailwind utility.
2. **No primitive restyles in component CSS files** — only LAYOUT (grid, gap, padding, aspect-ratio).
3. **No hex codes in code** — `var(--color-ember)` or `.shm-bg-ember`, never `#FF5B1F`.
4. **Mascot via `<Mascot />` component** — always sized via `size` prop, never inline `width`.
5. **Section rotation strict** — every `<section>` uses one of `.shm-bg-{marsh|graham|ember|cocoa}`. The four supplemental bgs (cream, honey, cherry, chocolate) use sparingly.
6. **Wave dividers between sections** — `.shm-wave shm-wave--{next-bg}`. Tall waves (`--lg` / `--xl`) on high-contrast transitions.
7. **Server-component-first** — `'use client'` only where required.
8. **Storefront API for all product data** — never hardcode product attributes.
9. **`framer-motion` locked in for section-level / drawer / modal motion** (per 02-06 D-02). Per-element hover transitions stay CSS only. Subtle/fast/non-bouncy constraints apply.
10. **No emoji as decoration. No exclamation marks. No gradients. No drop-shadow blurs. No left-border accent stripes.**

---

## File count summary

After Phase 3 translation completes, the codebase adds approximately:

| Area | Files |
|---|---|
| App routes | 5 (`app/page.tsx`, `app/shmo-review/page.tsx`, `app/shmo-review/[handle]/page.tsx`, `app/api/revalidate/route.ts`, `app/layout.tsx` updates) |
| Home components | ~11 |
| PDP components | ~14 |
| Cart components | ~12 |
| Modals | ~3 |
| Global components (Nav, Footer, Mascot, Sticker) | ~4 |
| Shopify queries / lib | ~5 (queries, types, fetch wrapper, cart mutations, revalidation handler) |
| **Total new files** | **~54** |

Plus minor CSS files for layout (one per area: home.css, pdp.css, cart-drawer.css).

---

## Verification

This translation plan passes when:

- ✅ Every section in `home.css` lines 1–63 has a corresponding row in the homepage table above.
- ✅ Every primitive used in `Buybox.html` has a row in the PDP table.
- ✅ Every state demonstrated in `Cart Drawer.html` artboards has a corresponding component listed.
- ✅ Every `home-data.jsx` data structure (`SUB_BRANDS`, `SHOPS`, `QUOTES`, `AUDIENCES`, `HOW_STEPS`, `FAQ`) has a clear consumer.
- ✅ Every `'use client'` decision has a stated reason.
- ✅ Every state surface (cart, modals, forms) has a chosen approach.

(Self-check: all six verified above.)

---

## Open questions for step 02-06

1. **Cart state management** — Zustand (recommended) vs Context+Reducer vs other.
2. **Animation library** — confirm CSS-only acceptable, or pre-approve `framer-motion` for specific cases.
3. **Asset location** — confirm `public/` (Next.js convention) over `.claude/skills/shmocard-design-system/assets/`.
4. **GHL webhook URL** — needed for waitlist Server Action.
5. **Static Bricolage font cuts** — keep ~30 redundant cuts or delete (frees ~10MB)?

---

## Next step

**02-06** — resolve open questions with Jordan; capture answers in `DECISIONS.md`. Once those land, **02-07** writes the close-out (updates root CLAUDE.md, scope.md, handoff.md to mark Phase 2 complete and prep Phase 3).
