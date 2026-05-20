---
phase: 06-square-card-pdp
phase_number: 6
phase_name: Square Card PDP + Format Compare
status: research-complete
researched: "2026-05-20"
---

# Phase 6: Square Card PDP + Format Compare — Research

**Researched:** 2026-05-20
**Domain:** Next.js App Router · Shmocard design system · product page composition · cross-PDP shared component
**Confidence:** HIGH — all findings verified against live codebase, existing plans, and product docs.

---

## Summary

Phase 6 has two deliverables:

1. **Square Card PDP** at `/shmo-review/square-card`. Replaces the Phase 4 Coming Soon stub. The pattern is a direct copy of L-Sign (`app/shmo-review/l-sign/page.tsx`): define `SQUARE_PRODUCT`, `SQUARE_GALLERY`, `SQUARE_PACKS`, `SQUARE_CHECKLIST`, `SQUARE_FAQ_ROWS` at module level, pass as props to `<Buybox>`, mount the same Phase 3 reused sections below. No new components, no new CSS, no new design-system primitives needed.

2. **Format Compare section** (`components/shmo-review/FormatCompare.tsx`). New dedicated component — NOT an extension of `FormatPicker`. Builds once in Phase 6 and back-ports to `/shmo-review/cr-80` and `/shmo-review/l-sign` in the same phase. Accepts `currentHandle` prop to suppress the CTA for the active format and show a "You're here" indicator instead.

All UI work routes through the `design-system-builder` subagent. The parent orchestrator writes no `.tsx` / `.css` directly.

**Primary recommendation:** Build Square Card PDP first (plans 06-01 through 06-03), then build FormatCompare (plan 06-04), back-port it to CR-80 + L-Sign (plan 06-05), then checkpoint + polish + close.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|---|---|---|---|
| Square Card PDP page composition | Frontend Server (SSR / RSC) | — | Server component page; Buybox is the only client island |
| `<Buybox>` client interactivity | Browser / Client | — | `"use client"` — pack selection, qty, cart add, FAQ toggle |
| `<FormatCompare>` | Frontend Server (RSC) | — | Static copy + links only; no client state needed |
| Square Card images | CDN / Static | — | `/products/plate/transparent/*.png` served from `public/` |
| Back-port mounts (CR-80, L-Sign pages) | Frontend Server (SSR / RSC) | — | RSC page files; add one import + one JSX node |

---

## Q1 — Square Card imagery

**Status: VERIFIED against `public/products/plate/transparent/`**

Five transparent PNGs present. Filenames:

| Slot | Path | Suggested alt |
|---|---|---|
| main (hero) | `/products/plate/transparent/magnific_2885042834.png` | Square Card NFC disc, front view |
| angle | `/products/plate/transparent/magnific_2885058687.png` | Square Card disc, angled |
| close-up | `/products/plate/transparent/magnific_2885065402.png` | Square Card disc, close-up |
| in-use | `/products/plate/transparent/magnific_2885073898.png` | Square Card disc, stuck to surface |
| detail | `/products/plate/transparent/magnific_2885081184.png` | Square Card disc, back detail |

**Five images** vs CR-80's six and L-Sign's three. Use all five — the gallery supports any count via the `gallery` prop. The `packIdx` default clamps to `Math.min(3, packs.length - 1)` so a 4-pack array remains compatible.

`FormatPicker.tsx` already defines the Square Card fallback image as `magnific_2885042834.png` — confirming this is the canonical hero image.

**No new imagery required.** [VERIFIED: ls public/products/plate/transparent/]

---

## Q2 — Square Card Buybox props

Define as module-level consts in `app/shmo-review/square-card/page.tsx`, each with `TODO(shopify):` markers. Mirror L-Sign pattern exactly.

### SQUARE_PRODUCT
```ts
// TODO(shopify): replace with Storefront API product query.
const SQUARE_PRODUCT: BuyboxProduct = {
  handle: 'google-review-plaque', // TODO(shopify): confirm exact handle in Shopify Admin
  title: 'Google Review NFC Disc (Square Card)',
  sub: 'Sticks to anything — door, window, dashboard. Built for mobile crews.',
};
```

**Handle source:** `context/general/product.md` + `FormatPicker.tsx` — both agree on `google-review-plaque`. [VERIFIED: FormatPicker.tsx line 47, product.md Square Card section]

### SQUARE_GALLERY (5 images)
```ts
// TODO(shopify): swap gallery to Shopify product.images.nodes[].url.
const SQUARE_GALLERY: BuyboxGalleryImage[] = [
  { src: '/products/plate/transparent/magnific_2885042834.png', alt: 'Square Card NFC disc, front view' },
  { src: '/products/plate/transparent/magnific_2885058687.png', alt: 'Square Card disc, angled' },
  { src: '/products/plate/transparent/magnific_2885065402.png', alt: 'Square Card disc, close-up' },
  { src: '/products/plate/transparent/magnific_2885073898.png', alt: 'Square Card disc, stuck to surface' },
  { src: '/products/plate/transparent/magnific_2885081184.png', alt: 'Square Card disc, back detail' },
];
```

### SQUARE_PACKS (mirrors L-Sign 1/2/5/10 structure)
```ts
// TODO(shopify): pack pricing tiers come from Shopify variants + metafields.
// Price values are placeholders; structure mirrors CR-80 / L-Sign locked decision.
const SQUARE_PACKS: BuyboxPack[] = [
  { qty: 1,  price: 39.99,  perCard: 39.99, save: null,  note: null,                     compare: null,   pop: false },
  { qty: 2,  price: 69.99,  perCard: 35.00, save: null,  note: null,                     compare: 79.98,  pop: false },
  { qty: 5,  price: 169.99, perCard: 34.00, save: '15%', note: 'Free shipping included', compare: 199.95, pop: false },
  { qty: 10, price: 299.99, perCard: 30.00, save: '25%', note: 'Free shipping included', compare: 399.90, pop: true  },
];
```

Price values are placeholder guesses. Phase 8 overwrites. All carry `TODO(shopify):`.

### SQUARE_CHECKLIST
```ts
const SQUARE_CHECKLIST: string[] = [
  '2.25" adhesive-backed disc — sticks to any clean surface',
  'Pre-programmed to your Google review link before shipping',
  'Works on every modern phone — no app, no download',
  '60-day reprogramming + return guarantee',
];
```

### SQUARE_FAQ_ROWS
```ts
const SQUARE_FAQ_ROWS: BuyboxFaqRow[] = [
  { q: 'What is the Square Card?', a: 'A 2.25" adhesive-backed NFC disc. Stick it to a door, window, dashboard, or laptop. Customers tap and land straight on your Google review page.' },
  { q: 'Shipping', a: 'Order by Tuesday 5pm CT, ships Friday. 3-day standard. Free expedited on 5+ packs.' },
  { q: '60-day return + reprogramming guarantee', a: "Don't love it? Return for full refund within 60 days. Reprogram destination URL anytime." },
  { q: 'Product details', a: '2.25" disc with embedded NTAG 215 NFC chip. Adhesive-backed. QR fallback printed on back. Pre-programmed before shipping.' },
];
```

All copy pulled from `context/general/product.md` + `context/general/marketing.md`. [VERIFIED: product.md Square Card section, marketing.md format-by-format pitches]

---

## Q3 — Format Compare component design

### Recommendation: New dedicated `FormatCompare.tsx` (not extending `FormatPicker`)

**Why not extend `FormatPicker`:**

`FormatPicker` is a server component that calls `getProductByHandle()` for all three handles in parallel — fetching live Shopify data at render time. The Format Compare purpose on a PDP is different: it's a decision-support component that shows copy-driven format differences to help a visitor confirm they picked the right format (or discover an alternative). It does NOT need live pricing — that's already shown in the Buybox above. Adding `highlightHandle` to `FormatPicker` means every PDP mounts an async Shopify fetch for data it already has in the page. This is redundant and introduces a dependency on Shopify API availability for a static-copy section.

**The right design: static `FormatCompare.tsx`**

- Server component, no `"use client"`, no async Shopify fetch.
- Props: `currentHandle: string` — the Shopify handle of the active format.
- Renders three format cards using `.shm-product` primitive (same primitive `FormatPicker` uses).
- Active format: CTA becomes `"You're here"` ghost button (disabled), card gets a `data-current="true"` attribute + subtle visual treatment (soft ember-tint wash via inline `style` or a modifier class — planner decides with builder at execution time).
- Non-active formats: CTA links to their PDP (`/shmo-review/cr-80`, `/shmo-review/l-sign`, `/shmo-review/square-card`).
- Images: use the same fallback paths already in `FormatPicker.tsx`'s `FALLBACK_IMAGES` (no Shopify fetch required for Phase 6 — exact same local PNG paths).
- Copy: pulled from `FormatPicker.tsx`'s `FORMAT_COPY` record (sub + blurb + badge) — move to a shared `lib/shmo-review/format-copy.ts` or duplicate inline in `FormatCompare.tsx` (simpler — planner decides at planning time).

**Primitive composition:**

```
<Section bg="cream" nextBg="marsh" className="format-compare" id="format-compare" ariaLabel="Compare Shmo Review formats">
  <div className="shm-section-head">
    <span className="shm-eyebrow">Three formats · same chip</span>
    <h2 className="shm-h2">Not sure this is the <em>right</em> one?</h2>
    <p className="shm-lede">All three use the same reprogrammable NFC chip and ship pre-loaded with your review link.</p>
  </div>
  <div className="format-grid">  {/* 3-column layout — same class as FormatPicker */}
    {FORMAT_DATA.map(f => (
      <article className="shm-product" key={f.handle} data-current={f.handle === currentHandle}>
        <div className="shm-product__media">
          <img src={f.imageSrc} alt={f.imageAlt} />
          {f.badge && <span className="shm-product__tag"><span className={`shm-badge shm-badge--${f.badgeTone}`}>{f.badge}</span></span>}
        </div>
        <div className="shm-product__body">
          <h3 className="shm-product__name">{f.title}</h3>
          <p className="shm-product__sub">{f.sub}</p>
          <p className="shm-product__blurb">{f.blurb}</p>  {/* layout-only addition */}
          <div className="shm-product__row">
            {f.handle === currentHandle
              ? <button className="shm-btn shm-btn--ghost shm-btn--sm" disabled type="button">You're here</button>
              : <a className="shm-btn shm-btn--primary shm-btn--sm" href={f.href}>View product</a>
            }
          </div>
        </div>
      </article>
    ))}
  </div>
</Section>
```

**`shm-product__blurb` is not in `components.css`** — the builder must either (a) use `shm-lede` inside the card body (existing primitive), or (b) add `.shm-product__blurb` to `components.css` as a paragraph variant inside `.shm-product`. Option (a) is safer for Phase 6; option (b) extends the system cleanly. Planner flags this as an execution decision for the builder — recommend option (b) since `FormatPicker` already has `blurb` copy that goes unused in current markup.

**`format-grid` layout class:** already defined in `app/shmo-review/shmo-review.css` (used by `FormatPicker`). `FormatCompare` imports the same `shmo-review.css` via the page — no new CSS file needed. [VERIFIED: FormatPicker.tsx uses `.format-grid`, l-sign/page.tsx imports `../shmo-review.css`]

---

## Q4 — Format Compare section bg + rotation placement

### Context

The Phase 3 PLAN.md (03-07) originally placed Format Compare at `marsh → ember`. But the real CR-80 PDP composition (confirmed from `app/shmo-review/cr-80/page.tsx`) does not include Format Compare — it was deferred. The actual live rotation ends:

```
VideoTestimonials bg=cream nextBg=ember → FinalCta (ember → cocoa) → footer
```

The ember slot is **taken by FinalCta**. The design system rule: one ember section per page, ember = high-emphasis CTA.

### Recommendation: `cream` bg, between HowItWorks and VideoTestimonials

Format Compare is a decision-support section, not a CTA close. It belongs before the final push (VideoTestimonials → FinalCta), not after it. Placing it between HowItWorks and VideoTestimonials keeps the narrative arc: "Here's how it works → pick the right format → see it working in real shops → buy now."

**Updated section rotation for all 3 PDPs after Phase 6:**

| # | Section | Component | bg | nextBg |
|---|---|---|---|---|
| 1 | Buybox | `Buybox` | `marsh` | `cream` |
| 2 | Proof | `cr-80/Proof` | `cream` | `marsh` |
| 3 | CrewStrip + ProofTiles | `CrewStrip` | `marsh` | `cream` |
| 4 | HowItWorks | `HowItWorks` | cream/marsh alternating | exits on `marsh` |
| 5 | **FormatCompare** (NEW) | `FormatCompare` | `cream` | `marsh` |
| 6 | VideoTestimonials | `VideoTestimonials` | `cream` | `ember` |
| 7 | FinalCta | `FinalCta` | `ember` | `cocoa` |

**Note on VideoTestimonials:** Currently called as `<VideoTestimonials bg='cream' nextBg='ember' />`. After inserting FormatCompare before it, its `bg` prop stays `cream`. The `nextBg` for FormatCompare must match VideoTestimonials' bg (`cream`), so FormatCompare renders as `bg='cream' nextBg='marsh'` and VideoTestimonials as `bg='cream' nextBg='ember'`. This means there will be a cream → marsh wave then a marsh → cream wave before VideoTestimonials. That's fine — it matches the existing CrewStrip/HowItWorks alternating pattern.

Wait — simpler: make FormatCompare `bg='cream' nextBg='cream'` with no wave, or `bg='marsh' nextBg='cream'`. Planner should resolve at plan-time based on how `Section` handles same-bg transitions. **Recommendation:** `bg='cream' nextBg='cream'` — the `Section` component handles same-bg transitions (confirmed from Phase 3 plan discussion: `nextBg='marsh'` renders marsh→marsh). The two sections visually merge into one cream block, which reads well for a secondary support section. If `Section` forces a wave even on same-bg, switch to `bg='cream' nextBg='marsh'` and adjust VideoTestimonials to `bg='marsh' nextBg='ember'` (both valid — marsh is the dominant bg color).

[ASSUMED] exact same-bg transition rendering behavior — not confirmed against `Section.tsx` source. Planner should verify before wiring.

---

## Q5 — Back-port effort to CR-80 + L-Sign

**Back-port is two file edits + one import each. LAYOUT IS LOCKED.**

### CR-80: `app/shmo-review/cr-80/page.tsx`

Add one import and insert `<FormatCompare>` in the composition. Changes:

```tsx
// Add import:
import FormatCompare from '@/components/shmo-review/FormatCompare';

// Add in <main> between HowItWorks and VideoTestimonials:
<HowItWorks />
<FormatCompare currentHandle="google-reviews-nfc-tap-card-cr80" />  // "You're here" on CR-80
<VideoTestimonials bg="cream" nextBg="ember" />
```

### L-Sign: `app/shmo-review/l-sign/page.tsx`

Same pattern:

```tsx
// Add import:
import FormatCompare from '@/components/shmo-review/FormatCompare';

// Add in <main> between HowItWorks and VideoTestimonials:
<HowItWorks />
<FormatCompare currentHandle="google-review-nfc-tap-card-l-sign" />  // "You're here" on L-Sign
<VideoTestimonials bg="cream" nextBg="ember" />
```

**Files changed in back-port step:**
- `app/shmo-review/cr-80/page.tsx` — add 1 import, insert 1 JSX node
- `app/shmo-review/l-sign/page.tsx` — add 1 import, insert 1 JSX node

**No changes to:**
- `components/shmo-review/cr-80/Proof.tsx`
- `components/shmo-review/Buybox.tsx`
- `components/shmo-review/HowItWorks.tsx`
- Any other component — back-port is mount-only

**Regression risk:** Low. Adding a section between HowItWorks and VideoTestimonials does not restructure existing sections. Wave dividers render automatically via `<Section nextBg=...>`. The `design-system-auditor` confirms the mount is clean. Take PRE/POST screenshots before and after back-porting for both pages.

[VERIFIED: cr-80/page.tsx lines 1-32, l-sign/page.tsx lines 1-83 — both use same section order, both import same reused components]

---

## Q6 — Square Card page composition (full)

**Mirror `app/shmo-review/l-sign/page.tsx` exactly, substituting Square Card props and `FormatCompare`.**

```tsx
// app/shmo-review/square-card/page.tsx

import '../shmo-review.css';
import Buybox, {
  type BuyboxProduct,
  type BuyboxGalleryImage,
  type BuyboxPack,
  type BuyboxFaqRow,
} from '@/components/shmo-review/Buybox';
import Proof from '@/components/shmo-review/cr-80/Proof';
import CrewStrip from '@/components/home/CrewStrip';
import HowItWorks from '@/components/shmo-review/HowItWorks';
import FormatCompare from '@/components/shmo-review/FormatCompare';
import VideoTestimonials from '@/components/home/VideoTestimonials';
import FinalCta from '@/components/home/FinalCta';
import { ProofTiles } from '@/components/shmo-review/ProofMarquee';

export const metadata = {
  title: 'Square Card NFC Disc — Shmo Review',
  description:
    'Adhesive-backed NFC disc for any surface. Sticks to doors, windows, dashboards. Pre-programmed before shipping, with QR fallback.',
};

// [SQUARE_PRODUCT, SQUARE_GALLERY, SQUARE_PACKS, SQUARE_CHECKLIST, SQUARE_FAQ_ROWS]
// — see Q2 above for exact values —

export default function SquareCardPage() {
  return (
    <main>
      <Buybox
        product={SQUARE_PRODUCT}
        gallery={SQUARE_GALLERY}
        packs={SQUARE_PACKS}
        checklist={SQUARE_CHECKLIST}
        faqRows={SQUARE_FAQ_ROWS}
        ariaLabel="Buy the Square Card disc"
        nextBg="cream"
      />
      <Proof />
      <CrewStrip nextBg="cream" afterGrid={<ProofTiles />} />
      <HowItWorks />
      <FormatCompare currentHandle="google-review-plaque" />
      <VideoTestimonials bg="cream" nextBg="ember" />
      <FinalCta />
    </main>
  );
}
```

Section rotation for Square Card PDP:

| # | Section | bg | nextBg |
|---|---|---|---|
| 1 | Buybox | marsh | cream |
| 2 | Proof | cream | marsh |
| 3 | CrewStrip + ProofTiles | marsh | cream |
| 4 | HowItWorks | alternating | exits marsh |
| 5 | FormatCompare | cream | marsh or cream |
| 6 | VideoTestimonials | cream | ember |
| 7 | FinalCta | ember | cocoa |

---

## Q7 — Headline / lede candidates for Square Card PDP

Sourced from `context/general/marketing.md` + `context/general/product.md`. All respect voice rules (short sentences, no exclamation marks, no hedging, second person).

**Option A (positioning-led):**
- Title meta: "Square Card NFC Disc — Shmo Review"
- Buybox title: "Google Review NFC Disc (Square Card)"
- Buybox sub: "Sticks to anything — door, window, dashboard. Built for mobile crews."

**Option B (use-case-led):**
- Buybox sub: "The review card that travels with your crew. Stick it anywhere."

**Option C (contrast-led — positions vs CR-80 and L-Sign):**
- Buybox sub: "No counter needed. Sticks to any surface — laptops, vans, dashboards."

**Recommendation:** Option A. The sub from `marketing.md` ("Sticks to anything — door, window, dashboard. Ideal for mobile crews and service vans.") is already locked copy. Use it verbatim (with minor trim: "service vans" → keep, it's specific and true). It passes the tradesperson test.

**Coming Soon stub headline** ("Sticks to anything. Stays everywhere.") is strong — consider carrying it into the buybox title or as an eyebrow. The lede from the stub ("Travels with the crew. 2.25" disc, ships pre-programmed.") also works as a checklist bullet.

[VERIFIED: marketing.md format-by-format pitches, product.md Square Card section]

---

## Q8 — Open questions for Jordan

| # | Question | Default if Jordan doesn't respond | Risk |
|---|---|---|---|
| OQ-1 | FormatCompare bg: `cream → cream` (no internal wave) vs `cream → marsh`? | Use `cream → cream` (same-bg merge — cleaner for a secondary section) | Visual rhythm — minor |
| OQ-2 | Copy shared between `FormatPicker` and `FormatCompare` — inline duplicate or extract to `lib/shmo-review/format-copy.ts`? | Inline duplicate (simpler, avoids new lib structure) | Maintenance — low |
| OQ-3 | Square Card placeholder pack prices — confirm structure is right before execution (L-Sign was ~$50/$90/$200/$360; Square Card lower since it's the disc format)? | Proceed with Q2 values (placeholder anyway; Phase 8 overwrites) | None — all `TODO(shopify):` |
| OQ-4 | `HowItWorks` step copy: "Crew hands the card" doesn't fit Square Card's stick-anywhere format. Differentiate now or defer to Phase 7 (same question as L-Sign in Phase 5)? | Reuse HowItWorks as-is (matches Phase 5 precedent — defer to Phase 7) | Minor copy inaccuracy |
| OQ-5 | FormatCompare `shm-product__blurb` — add new sub-primitive to `components.css` or use existing `shm-lede` inside the card? | Planner decides with builder; prefer adding to `components.css` if space | None |

All OQs are LOW risk. Phase 6 can proceed without any of them resolved — defaults are documented.

---

## Standard Stack

No new dependencies. Phase 6 is pure composition.

| Library | Version | Purpose | Status |
|---|---|---|---|
| Next.js App Router | existing | RSC page files, metadata export | Already installed |
| TypeScript | existing | Strict types, `BuyboxProps` imports | Already installed |
| Tailwind CSS 4 | existing | Layout-only utilities (grid, gap, padding) | Already installed |
| Shmocard design system | `.claude/skills/shmocard-design-system/` | `.shm-*` primitives | Already mounted globally |

**No new npm installs.**

---

## Architecture Patterns

### Pattern 1: PDP page = props file + section mount (no new components)
```tsx
// Square Card follows L-Sign exactly
// Data as module-level consts → passed to <Buybox> → reused sections below
const SQUARE_PRODUCT = { ... };
export default function SquareCardPage() {
  return <main><Buybox product={SQUARE_PRODUCT} ... /><Proof />...</main>;
}
```
[VERIFIED: app/shmo-review/l-sign/page.tsx — confirmed pattern]

### Pattern 2: FormatCompare = static RSC, `currentHandle` controls "You're here"
```tsx
export default function FormatCompare({ currentHandle }: { currentHandle: string }) {
  return (
    <Section bg="cream" nextBg="marsh" ...>
      {FORMAT_DATA.map(f => (
        <article className="shm-product" data-current={f.handle === currentHandle}>
          ...
          {f.handle === currentHandle
            ? <button disabled>You're here</button>
            : <a href={f.href}>View product</a>}
        </article>
      ))}
    </Section>
  );
}
```

### Pattern 3: Back-port = one import + one JSX node (LAYOUT IS LOCKED)
The back-port adds `<FormatCompare currentHandle="..." />` between `<HowItWorks />` and `<VideoTestimonials />`. It does not restructure existing sections.

### Anti-Patterns to Avoid
- **Extending `FormatPicker` with `highlightHandle`:** Phase 3 PLAN.md proposed this. Rejected — adds async Shopify fetch to a static-copy section. New dedicated `FormatCompare` is correct.
- **Building FormatCompare as a client component:** No interactivity needed. Keep RSC.
- **New CSS file for FormatCompare:** `shmo-review.css` `.format-grid` layout class already exists. FormatCompare uses `format-grid` — same as FormatPicker. No new CSS file.
- **Mascot on Square Card PDP:** Locked decision — zero, same as CR-80 + L-Sign.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead |
|---|---|---|
| Format grid layout | Custom CSS grid | `.format-grid` in `shmo-review.css` (already defined) |
| Product card | Custom article | `.shm-product` primitive from `components.css` |
| Section + wave divider | `<div className="shm-wave">` | `<Section bg=... nextBg=...>` from `components/layout/Section.tsx` |
| Badge | Custom span | `.shm-badge shm-badge--ember/honey/soft` |
| CTA button | Custom button | `.shm-btn shm-btn--primary/--ghost shm-btn--sm` |

---

## Common Pitfalls

### Pitfall 1: Wave-divider as child (5h debug — Phase 3)
**What goes wrong:** Placing `<div className="shm-wave">` inside a `<section>` instead of as a sibling creates a ~40px gap between content and wave.
**Prevention:** Every section uses `<Section bg=... nextBg=...>`. The `design-system-builder` system prompt enforces this. The `design-system-auditor` catches violations.
**Warning signs:** Empty gap between section content and wave bottom.

### Pitfall 2: FormatCompare fetching Shopify data
**What goes wrong:** Temptation to fetch live prices inside `FormatCompare` to show "starting from $X" per format.
**Prevention:** FormatCompare is copy-driven, not price-driven. Prices are already shown in the Buybox for the current product. Other format prices are unknown/placeholder. Keep FormatCompare fully static — no `getProductByHandle()` calls.

### Pitfall 3: Buybox `packIdx` default clamping
**What goes wrong:** `Math.min(3, packs.length - 1)` — if `SQUARE_PACKS` has 4 entries (indices 0–3), default is index 3 (10-pack), same as CR-80. This is correct behavior. Do not change the clamp logic.
**Prevention:** SQUARE_PACKS has 4 entries matching CR-80 and L-Sign structure. No change to `Buybox.tsx`.

### Pitfall 4: Back-port breaks wave rotation on CR-80 / L-Sign
**What goes wrong:** Inserting FormatCompare without adjusting `nextBg` on HowItWorks or `bg` on VideoTestimonials.
**Prevention:** HowItWorks exits on `marsh` (confirmed from Phase 5 PLAN.md). FormatCompare enters on `cream` (matches `marsh → cream` wave). VideoTestimonials already takes `bg='cream'`. The sequence `...HowItWorks → FormatCompare bg=cream → VideoTestimonials bg=cream...` introduces one extra `marsh → cream` wave, which is aesthetically fine. The auditor confirms the rotation is valid.

### Pitfall 5: Pawn-brand bleed (MEMORY rule)
`Proof.tsx` uses real shop names ("The Pawn Shop", "Axel's Pawn") — that is fine per existing precedent. Never write "Pawn Leads" in any Square Card copy.

---

## Runtime State Inventory

Not applicable — Phase 6 is greenfield composition (new route, new component). No rename/refactor. No runtime state affected.

---

## Environment Availability

| Dependency | Required By | Available | Notes |
|---|---|---|---|
| `public/products/plate/transparent/*.png` | Square Card gallery | ✓ (5 files) | Verified |
| `components/shmo-review/Buybox.tsx` BuyboxProps | Square Card Buybox | ✓ | Refactored in Phase 5 |
| `components/shmo-review/cr-80/Proof.tsx` | Reused below-fold | ✓ | Ships in Phase 3 |
| `components/home/CrewStrip.tsx` | Reused below-fold | ✓ | Ships in Phase 3 |
| `components/shmo-review/HowItWorks.tsx` | Reused below-fold | ✓ | Ships in Phase 3 |
| `components/home/VideoTestimonials.tsx` | Reused below-fold | ✓ | Ships in Phase 3 |
| `components/home/FinalCta.tsx` | Reused below-fold | ✓ | Ships in Phase 3 |
| `components/shmo-review/ProofMarquee.tsx` (ProofTiles) | CrewStrip afterGrid | ✓ | Ships in Phase 3 |
| `app/shmo-review/shmo-review.css` `.format-grid` | FormatCompare layout | ✓ | Already defined for FormatPicker |

**No missing dependencies.** Phase 6 can execute immediately.

---

## Implementation Strategy (for planner)

**Phase 6 atomic plan shape:**

| Plan | Type | Deliverable |
|---|---|---|
| 06-01 | auto → builder → auditor | Square Card PDP: replace Coming Soon stub with full PDP (Buybox + props + reused sections, WITHOUT FormatCompare). Composition checkpoint immediately after. |
| 06-02 | checkpoint:human-verify | Jordan reviews `/shmo-review/square-card` at desktop + mobile. Approve or send polish. |
| 06-03 | auto → builder → auditor (conditional) | Polish if 06-02 flags feedback. LAYOUT IS LOCKED. |
| 06-04 | auto → builder → auditor | Build `components/shmo-review/FormatCompare.tsx`. Mount on `/shmo-review/square-card` (add import + JSX node). |
| 06-05 | auto → builder → auditor | Back-port FormatCompare to `/shmo-review/cr-80` and `/shmo-review/l-sign`. Take PRE/POST screenshots for both pages. |
| 06-06 | checkpoint:human-verify | Jordan reviews FormatCompare on all 3 PDPs. Approve or send polish. |
| 06-07 | auto → builder → auditor (conditional) | Polish if 06-06 flags feedback. LAYOUT IS LOCKED. |
| 06-08 | auto | Mobile + a11y pass: Square Card at 375/414/768px. Check FormatCompare card stacking, wave gaps. |
| 06-09 | checkpoint:human-verify (close-out) | tsc + build clean. Update STATE.md, handoff.md, SUMMARY.md. Phase 6 closed. |

**Total: 9 plans (06-03 and 06-07 conditional; may be skipped)**

---

## Project Constraints (from CLAUDE.md)

| Directive | Source |
|---|---|
| All UI work via `design-system-builder` subagent — parent never writes `.tsx`/`.css` | `.claude/rules/subagent-dispatch.md` |
| `.shm-*` prefix on every utility class — text-flip auto-rules fire only on `shm-bg-*` | `.claude/rules/design-system.md` |
| Section rotation `marsh/cream/ember/cocoa` only | `.claude/rules/design-system.md` |
| Wave dividers as siblings via `<Section bg= nextBg=>` — never hand-authored `<div class="shm-wave">` | `.claude/rules/design-system.md` (+ MEMORY.md 5h debug) |
| No mascot on Square Card PDP (locked decision) | Phase 6 objective brief |
| LAYOUT IS LOCKED on back-port edits to CR-80 + L-Sign | `.claude/rules/subagent-dispatch.md`, MEMORY.md |
| No Shopify Admin writes, no `.env` changes — Phase 6 is local-only | `.claude/rules/live-store-protection.md` |
| Screenshot proof before claiming "done" | `.claude/rules/verification.md` |
| No hardcoded prices/SKUs — every product-data field gets `TODO(shopify):` | `.claude/rules/shopify-data-discipline.md` |
| Don't break the live store — `shop.shmocard.com` is live | CLAUDE.md |
| Pawn Leads never mentioned on Shmocard | MEMORY.md |

---

## Validation Architecture

### Test Framework

| Property | Value |
|---|---|
| Framework | Playwright (visual regression via screenshots) |
| Config | No automated test suite — verification is visual + tsc + build |
| Quick run | `npx tsc --noEmit` |
| Full suite | `npx tsc --noEmit && npm run build` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | Notes |
|---|---|---|---|---|
| PH6-SQUARE-ROUTE | `/shmo-review/square-card` renders full PDP (not Coming Soon stub) | visual | Playwright screenshot at 1280px | Compare page size vs stub (~192B target like L-Sign) |
| PH6-BUYBOX-PROPS | Square Card Buybox shows correct title/sub/gallery/packs | visual | Dev server + screenshot | Eyeball diff vs L-Sign pattern |
| PH6-NO-REGRESSION | `/shmo-review` and `/shmo-review/cr-80` render identically before/after | visual regression | PRE/POST Playwright diff | Critical for back-port plan |
| PH6-FORMAT-COMPARE | FormatCompare renders 3 format cards; active format shows "You're here" | visual | Dev server at each of 3 PDPs | Verify `currentHandle` wiring |
| PH6-BACKPORT-CR80 | `/shmo-review/cr-80` mounts FormatCompare between HowItWorks + VideoTestimonials | visual | Playwright screenshot | CR-80 "You're here" active |
| PH6-BACKPORT-LSIGN | `/shmo-review/l-sign` mounts FormatCompare between HowItWorks + VideoTestimonials | visual | Playwright screenshot | L-Sign "You're here" active |
| PH6-MOBILE | Square Card PDP clean at 375/414/768px | visual | Playwright screenshots × 3 | No overflow, no wave gap |
| PH6-DESIGN-AUDIT | `design-system-auditor` PASS on all new/modified components | audit | Agent dispatch | After each builder plan |
| PH6-TSC | `npx tsc --noEmit` clean after every plan | automated | `npx tsc --noEmit` | Block on failure |
| PH6-BUILD | `npm run build` clean at phase close | automated | `npm run build` | All routes statically generated |

### Sampling Rate

- **Per plan commit:** `npx tsc --noEmit` + Playwright screenshot of affected route
- **Per wave:** `npx tsc --noEmit && npm run build`
- **Phase gate:** Full build green + all screenshot proofs + `design-system-auditor` PASS before close

### Wave 0 Gaps

- `components/shmo-review/FormatCompare.tsx` — does not exist; created in plan 06-04
- No test framework gaps — existing pattern (Playwright + tsc + build) covers all requirements

---

## Security Domain

Phase 6 adds no new trust boundaries, no new user inputs, no new API surfaces.

| ASVS Category | Applies | Control |
|---|---|---|
| V2 Authentication | No | No auth surface |
| V3 Session Management | No | No session in Phase 6 |
| V4 Access Control | No | Public routes only |
| V5 Input Validation | No | No new user inputs — FormatCompare is static RSC; Buybox `currentHandle` is a hardcoded string literal |
| V6 Cryptography | No | No crypto |

**Threat notes:**
- FormatCompare renders no user-supplied data. `currentHandle` is a hardcoded string literal at call site — no injection surface.
- Image `src` values are static string literals from module-level consts — no runtime data flow into image paths.
- All cart actions remain in Zustand local state with `TODO(shopify):` markers — no Storefront API mutations in Phase 6.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|---|---|---|
| A1 | Square Card placeholder pack prices (39.99/69.99/169.99/299.99) are plausible | Q2 | None — all `TODO(shopify):` markers; Phase 8 overwrites |
| A2 | `Section` component handles `cream → cream` same-bg transition without forcing a visible wave | Q4 | Visual rhythm issue — easy fix by switching to `cream → marsh` at execution time |
| A3 | `.format-grid` CSS class in `shmo-review.css` is generic enough to work for FormatCompare (not scoped to FormatPicker) | Q3 | CSS scoping issue — would require a minor CSS addition; low effort fix |

**All assumptions are LOW risk. None require Jordan input before planning begins.**

---

## Open Questions (RESOLVED 2026-05-20)

1. **FormatCompare bg transition (OQ-1, RESOLVED-DEFAULT):** Use `cream → cream` as default. If `Section` forces a wave on same-bg, switch to `cream → marsh` and adjust VideoTestimonials to `bg='marsh' nextBg='ember'`. Planner documents both paths.

2. **Copy sharing between FormatPicker + FormatCompare (OQ-2, RESOLVED-DEFAULT):** Inline duplicate in `FormatCompare.tsx`. Avoids new `lib/` structure. If Jordan or the planner wants DRY extraction, extract to `lib/shmo-review/format-copy.ts` — no functional difference.

3. **HowItWorks step copy for Square Card (OQ-4, RESOLVED-DEFAULT):** Reuse as-is. Same decision made in Phase 5 for L-Sign. Defer copy differentiation to Phase 7.

---

## Sources

### Primary (HIGH confidence)
- `app/shmo-review/l-sign/page.tsx` — L-Sign pattern Phase 6 mirrors
- `components/shmo-review/Buybox.tsx` — BuyboxProps interface (Phase 5 refactor)
- `components/shmo-review/FormatPicker.tsx` — FORMAT_COPY, FALLBACK_IMAGES, HANDLES, PRODUCT_PAGE_HREFS
- `components/layout/Section.tsx` — SectionBg type (marsh | graham | ember | cocoa | cream)
- `app/shmo-review/cr-80/page.tsx` — CR-80 composition (no FormatCompare confirmed)
- `public/products/plate/transparent/` — 5 Square Card images verified
- `context/general/product.md` — Square Card specs, handle, use case
- `context/general/marketing.md` — Square Card copy, voice rules, FAQ

### Secondary (MEDIUM confidence)
- `.planning/phases/05-l-sign-pdp/05-PLAN.md` — atomic plan shape to mirror
- `.planning/phases/05-l-sign-pdp/05-SUMMARY.md` — Phase 5 exit state, deferred items
- `.planning/phases/03-cr-80-pdp/PLAN.md` — FormatCompare origin (03-07), original design decision

### Tertiary (LOW confidence — assumptions only)
- A1-A3 in Assumptions Log above

---

## Metadata

**Confidence breakdown:**
- Square Card PDP: HIGH — direct mirror of L-Sign; assets verified; props fully specified
- FormatCompare design: HIGH — primitive composition clear; only execution details deferred to builder
- Section bg rotation: MEDIUM — one assumption on same-bg behavior; easy fallback documented
- Back-port effort: HIGH — two files, two lines each; no structural risk

**Research date:** 2026-05-20
**Valid until:** 2026-06-20 (stable design system; no external dependencies)
