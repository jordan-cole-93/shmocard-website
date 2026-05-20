---
phase: 05-l-sign-pdp
phase_number: 5
phase_name: L-Sign PDP
status: planning
depends_on: [phase-3, phase-4]
total_plans: 7
autonomous: false
last_updated: "2026-05-20"
requirements: [PH5-BUYBOX-PROPS, PH5-BUYBOX-REGRESSION, PH5-LSIGN-ROUTE, PH5-LSIGN-CHECKPOINT, PH5-MOBILE-A11Y, PH5-PHASE-CLOSE]
---

# Phase 5 — L-Sign PDP

## Goal

Build `/shmo-review/l-sign` — the product detail page for the L-Sign 4×6 acrylic counter standee — by **refactoring `<Buybox>` to take product props (CR-80 data as defaults)** and **reusing every Phase 3 below-the-fold section as-is**. The page replaces the Phase 4 Coming Soon stub at `app/shmo-review/l-sign/page.tsx`.

Refactor scope is surgical: extract `PRODUCT` / `GALLERY` / `PACKS` / `CHECKLIST` / `FAQ_ROWS` / `ariaLabel` from module-level constants into a `BuyboxProps` interface. Every existing caller (`/shmo-review`, `/shmo-review/cr-80`) renders identically because the defaults equal today's hardcoded CR-80 data. The new L-Sign page passes explicit L-Sign props.

No new structural sections. No Format Compare (deferred to Phase 6 so all 3 formats land together). No new mascot, no new design-system primitives — the system already has everything this page needs.

All UI work routes through the `design-system-builder` subagent. The parent never writes `.tsx` / `.css` directly.

## Success criteria (TRUE = green)

1. Browser renders `/shmo-review/l-sign` with full PDP composition (Buybox → Proof → CrewStrip + ProofTiles → HowItWorks → VideoTestimonials → FinalCta) at desktop (1280px) + mobile (375px) with no console errors and `npx tsc --noEmit` clean after every plan.
2. **Backward compatibility verified by visual regression.** `/shmo-review` and `/shmo-review/cr-80` render pixel-equivalent before and after the Buybox refactor. Screenshots captured pre-refactor in 05-01 are diffed against post-refactor screenshots; any visible delta is a blocker.
3. `<Buybox>` exports a `BuyboxProps` interface. Every product-data field (`PRODUCT`, `GALLERY`, `PACKS`, `CHECKLIST`, `FAQ_ROWS`, `ariaLabel`) is an OPTIONAL prop that defaults to the current CR-80 values. Callers that pass no props get today's behavior.
4. L-Sign-specific data (title, sub, gallery, checklist, FAQ rows, ariaLabel) lives in `app/shmo-review/l-sign/page.tsx` (or a co-located `data.ts`) — NOT inside `Buybox.tsx`. Pack prices stay `TODO(shopify):` placeholders mirroring CR-80 1/2/5/10 tier structure (per locked decision 1).
5. Every section uses design-system primitives only — no `.foo__btn`, no `position: fixed; bottom: 0` product bars, no hex outside SVG, no system-ui fonts, no Lucide/Heroicons.
6. Wave dividers placed as siblings of their sections (CLAUDE.md hard rule). Every section uses `<Section bg=... nextBg=...>` from `components/layout/Section.tsx`. NO hand-authored `<div className="shm-wave">` inside any component.
7. Section rotation marsh / cream / ember / cocoa only. Single ember section (FinalCta) per page. Cocoa reserved for footer-adjacent transition.
8. Mobile breakpoint clean — no clipping, no overflow at 375px. Mascot count ≤ 2 per page (recommendation: zero — match CR-80).
9. L-Sign imagery sourced from `public/products/l-sign/transparent/*.png` (3 files) for the buybox gallery. No new imagery required.
10. No hardcoded prices, SKUs, or product handles in `page.tsx` — every product-data field gets a `TODO(shopify):` comment marker. Marketing-copy strings (checklist bullets, FAQ answers, headlines) stay in code per existing convention.
11. `design-system-auditor` returns PASS after each UI plan.
12. No Shopify Admin writes, no domain / theme / payment touches. No `.env` changes. Phase 5 is local-only.

## Implementation strategy

**Refactor first (backward-compat verified), then compose the L-Sign route, checkpoint, polish, close.**

1. **05-01 — Pre-refactor visual baseline.** Capture before-screenshots of `/shmo-review` and `/shmo-review/cr-80` at desktop + mobile. These are the regression baseline. No code changes.
2. **05-02 — Buybox props refactor.** Dispatch `design-system-builder` to extract product data into a `BuyboxProps` interface with CR-80 values as defaults. Then capture post-refactor screenshots of the same two pages and diff against 05-01 baselines. Any visible delta blocks the phase.
3. **05-03 — Build L-Sign PDP route.** Replace the Coming Soon stub at `app/shmo-review/l-sign/page.tsx` with the full PDP — `<Buybox>` (with L-Sign props) + reused Phase 3 sections (`Proof`, `CrewStrip` + `ProofTiles`, `HowItWorks`, `VideoTestimonials`, `FinalCta`) in the same rotation pattern as `/shmo-review/cr-80`.
4. **05-04 — Jordan checkpoint.** Browser review at desktop + mobile. Approve composition or send polish feedback (LAYOUT IS LOCKED — spacing / type / mascot only).
5. **05-05 — Polish iteration (conditional).** Only runs if 05-04 surfaces fixes. Builder dispatch flagged "LAYOUT IS LOCKED."
6. **05-06 — Mobile + a11y pass.** Playwright screenshots at 375 / 414 / 768 px. Fix any clipping / overflow / wave-divider gaps. LAYOUT IS LOCKED.
7. **05-07 — Phase close-out.** `tsc` + `npm run build` clean. Update STATE.md and handoff.md. Write SUMMARY.md.

**All UI work goes through `design-system-builder`.** Polish iterations carry the explicit "this is a polish task — LAYOUT IS LOCKED" flag.

**Section rotation plan (final shape — mirrors CR-80 PDP):**

| # | Section | Component | bg | nextBg |
|---|---|---|---|---|
| 1 | Buybox (with L-Sign props) | `Buybox` (refactored) | `marsh` | `cream` |
| 2 | Proof | `cr-80/Proof` (reuse) | `cream` | `marsh` |
| 3 | CrewStrip + ProofTiles | `CrewStrip` (reuse) | `marsh` | `cream` |
| 4 | HowItWorks (4 alternating sections) | `HowItWorks` (reuse) | cream/marsh internal | exits on marsh |
| 5 | VideoTestimonials | `VideoTestimonials` (reuse) | `cream` | `ember` |
| 6 | FinalCta | `FinalCta` (reuse) | `ember` | `cocoa` |

**Note on HowItWorks step 01 ("Crew hands the card"):** Reuse as-is for Phase 5. The copy mismatch (L-Sign is self-serve, not handed) is a known minor inaccuracy. Recommendation: defer differentiated copy to Phase 7 (Cross-PDP mobile polish) or Phase 6 (Square Card) when all 3 PDPs are inspectable. Flagged in Open Decisions below.

---

## Atomic plans

### 05-01 — Pre-refactor visual regression baseline

- **Goal:** Capture screenshots of `/shmo-review` and `/shmo-review/cr-80` at desktop (1280px) and mobile (375px) BEFORE touching `Buybox.tsx`. These are the regression baseline for 05-02. No code changes.
- **Type:** `auto` (no builder dispatch — pure capture)
- **Files touched:** NONE
- **Requirement IDs:** PH5-BUYBOX-REGRESSION
- **Verification steps:**
  1. Dev server running at localhost:3000.
  2. `npx tsc --noEmit` clean.
  3. Playwright captures:
     - `/shmo-review` desktop → `pictures/screenshots/regression-baseline/shmo-review-desktop-PRE.png`
     - `/shmo-review` mobile (375px) → `pictures/screenshots/regression-baseline/shmo-review-mobile-PRE.png`
     - `/shmo-review/cr-80` desktop → `pictures/screenshots/regression-baseline/cr-80-desktop-PRE.png`
     - `/shmo-review/cr-80` mobile (375px) → `pictures/screenshots/regression-baseline/cr-80-mobile-PRE.png`
  4. All 4 files saved; no console errors during capture.
- **Commit message format:** No commit (screenshots only; baseline lives in working tree).

---

### 05-02 — Refactor `<Buybox>` to take product props (CR-80 as defaults) + verify regression

- **Goal:** Extract product data from module-level constants into a `BuyboxProps` interface. Every new prop is OPTIONAL with the current CR-80 hardcoded values as default. `/shmo-review` and `/shmo-review/cr-80` callers pass nothing and continue rendering identically. Then capture POST screenshots and visually diff against 05-01 baselines.
- **Type:** `auto` → `design-system-builder` dispatch → visual regression diff → `design-system-auditor`
- **Files touched:**
  - `components/shmo-review/Buybox.tsx` (refactor — props interface added, defaults wired)
  - NO changes to `app/shmo-review/page.tsx`
  - NO changes to `app/shmo-review/cr-80/page.tsx`
  - NO changes to `app/shmo-review/shmo-review.css`
- **Requirement IDs:** PH5-BUYBOX-PROPS, PH5-BUYBOX-REGRESSION
- **Builder prompt anchor:** "Refactor `components/shmo-review/Buybox.tsx` to accept product data as props. **LAYOUT IS LOCKED — do not change JSX structure, class names, primitive composition, gallery layout, pack row layout, FAQ wiring, or any rendered markup.** The only changes are: (1) extract module-level constants into a typed props interface with defaults, (2) reference props inside the component instead of the constants.

Required interface (exported from the file):

```ts
export type BuyboxPack = {
  qty: number;
  price: number;
  perCard: number;
  save: string | null;
  note: string | null;
  compare: number | null;
  pop: boolean;
};

export type BuyboxGalleryImage = { src: string; alt: string };

export type BuyboxFaqRow = { q: string; a: string };

export type BuyboxProduct = {
  handle: string;
  title: string;
  sub: string;
};

export type BuyboxProps = {
  product?: BuyboxProduct;
  gallery?: BuyboxGalleryImage[];
  packs?: BuyboxPack[];
  checklist?: string[];
  faqRows?: BuyboxFaqRow[];
  ariaLabel?: string;
  nextBg?: SectionBg;
};
```

Implementation rules:
- Move the existing `PRODUCT`, `GALLERY`, `PACKS`, `CHECKLIST`, `FAQ_ROWS` module-level constants into `DEFAULT_*` exports (e.g., `export const DEFAULT_BUYBOX_PRODUCT`, `DEFAULT_BUYBOX_GALLERY`, `DEFAULT_BUYBOX_PACKS`, `DEFAULT_BUYBOX_CHECKLIST`, `DEFAULT_BUYBOX_FAQ_ROWS`). Keep all the existing `TODO(shopify):` comments attached to these constants.
- Component signature becomes: `export default function Buybox({ product = DEFAULT_BUYBOX_PRODUCT, gallery = DEFAULT_BUYBOX_GALLERY, packs = DEFAULT_BUYBOX_PACKS, checklist = DEFAULT_BUYBOX_CHECKLIST, faqRows = DEFAULT_BUYBOX_FAQ_ROWS, ariaLabel = 'Buy the CR-80 card', nextBg = 'marsh' }: BuyboxProps)`.
- Replace `PRODUCT.title` / `PRODUCT.sub` / `PRODUCT.handle` references with `product.title` / `product.sub` / `product.handle`.
- Replace `GALLERY[…]` references with `gallery[…]`.
- Replace `PACKS[…]` references with `packs[…]`. The initial `packIdx` default (3 = 10-pack) must continue to work with a 4-element pack array; if `packs.length` is shorter, clamp via `useState(Math.min(3, packs.length - 1))`.
- Replace `CHECKLIST` with `checklist`, `FAQ_ROWS` with `faqRows`.
- Replace `'Buy the CR-80 card'` aria-label literal with `ariaLabel`.
- Inside `handleAdd()`: `merchandiseId` uses `product.handle`, `productHandle` uses `product.handle`, `title` uses `product.title`, `imageUrl` / `imageAlt` use `gallery[0]`. The TODO(shopify) comments stay.

Do NOT change:
- The `'use client'` directive.
- Any JSX rendered markup (gallery, bb column, pack rows, qty block, CTA button, faq list — all stay exactly as is).
- The `Section` wrapper composition (`<Section bg='marsh' nextBg={nextBg} className='review-buybox' id='buybox' ariaLabel={ariaLabel}>`).
- Any class names, including `.review-buybox`, `.pdp-buybox`, `.gal`, `.gal__main`, `.gal__thumbs`, `.gal__thumb`, `.bb`, `.bb__title`, `.bb__sub`, `.bb__rule`, `.bb__cta`, `.bb__meta`, `.bb__faq`, `.qty-block`, `.qty-label`, `.shm-*` primitives.
- The 4 STARS rating block, the rating count '87 verified reviews' (this is page-decoration, not product data — leave hardcoded).
- The bb__meta '60-day return' / 'Ships in 3 days' text (page-decoration, leave hardcoded).

After the refactor: `npx tsc --noEmit` MUST be clean. Both `/shmo-review` and `/shmo-review/cr-80` MUST render identically to before."
- **Verification steps:**
  1. `npx tsc --noEmit` clean.
  2. Builder confirms zero changes to `app/shmo-review/page.tsx` and `app/shmo-review/cr-80/page.tsx` (only `Buybox.tsx` modified). Confirm via `git diff --stat`.
  3. `design-system-auditor` returns PASS — confirms no class names changed, no primitive composition altered, no JSX restructured. Only data-source plumbing changed.
  4. Playwright captures POST screenshots (same widths as 05-01):
     - `/shmo-review` desktop → `pictures/screenshots/regression-baseline/shmo-review-desktop-POST.png`
     - `/shmo-review` mobile (375px) → `pictures/screenshots/regression-baseline/shmo-review-mobile-POST.png`
     - `/shmo-review/cr-80` desktop → `pictures/screenshots/regression-baseline/cr-80-desktop-POST.png`
     - `/shmo-review/cr-80` mobile (375px) → `pictures/screenshots/regression-baseline/cr-80-mobile-POST.png`
  5. Visual diff each PRE/POST pair side-by-side. **Any visible delta = blocker.** Re-dispatch builder with the diff highlighted until PRE and POST match.
  6. No console errors on either page.
- **Checkpoint:** Implicit pass gate — if visual diff shows ANY drift, this plan does NOT complete. Builder iterates until PRE = POST.
- **Commit message format:** `refactor(buybox): extract product data into props with CR-80 defaults`

---

### 05-03 — Build `/shmo-review/l-sign` PDP

- **Goal:** Replace the 12-line Coming Soon stub at `app/shmo-review/l-sign/page.tsx` with the full PDP. Compose `<Buybox>` with explicit L-Sign props (defined in the page file itself, with `TODO(shopify):` markers on every product-data field) + reuse Phase 3 below-the-fold sections in the same rotation pattern as `/shmo-review/cr-80`.
- **Type:** `auto` → `design-system-builder` dispatch → `design-system-auditor`
- **Files touched:**
  - `app/shmo-review/l-sign/page.tsx` (REPLACE the Coming Soon stub — full PDP composition)
  - NO new components (every below-the-fold section is reused from Phase 3)
  - NO new CSS (page imports `../shmo-review.css` same as CR-80)
  - NO changes to `components/shmo-review/Buybox.tsx`, `Proof.tsx`, `CrewStrip.tsx`, `HowItWorks.tsx`, `VideoTestimonials.tsx`, `FinalCta.tsx`
- **Requirement IDs:** PH5-LSIGN-ROUTE
- **Builder prompt anchor:** "Replace `app/shmo-review/l-sign/page.tsx` (currently a 12-line Coming Soon stub) with a full L-Sign PDP. **LAYOUT IS LOCKED for every reused section — do not edit `Proof.tsx`, `CrewStrip.tsx`, `HowItWorks.tsx`, `VideoTestimonials.tsx`, `FinalCta.tsx`, or `Buybox.tsx`.** This task is pure composition: define L-Sign props, pass them to `<Buybox>`, mount the reused sections in the documented order.

Required imports (mirror `app/shmo-review/cr-80/page.tsx`):

```ts
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
import VideoTestimonials from '@/components/home/VideoTestimonials';
import FinalCta from '@/components/home/FinalCta';
import { ProofTiles } from '@/components/shmo-review/ProofMarquee';
```

Required metadata:

```ts
export const metadata = {
  title: 'L-Sign Counter Standee — Shmo Review',
  description:
    'Acrylic NFC counter standee for your register. Customers tap on their way out. Pre-programmed before shipping, with QR fallback.',
};
```

Required L-Sign product props (define as module-level consts above the component, each with a `TODO(shopify):` comment marker per `.claude/rules/shopify-data-discipline.md`):

```ts
// TODO(shopify): replace with Storefront API product query for the L-Sign handle.
const L_SIGN_PRODUCT: BuyboxProduct = {
  handle: 'shmo-review-l-sign', // TODO(shopify): confirm exact handle in Shopify Admin
  title: 'Google Review NFC Tap Sign (L-Sign)',
  sub: 'Lives next to the register. Guests tap on their way out — no staff prompt needed.',
};

// TODO(shopify): swap gallery to Shopify product.images.nodes[].url.
const L_SIGN_GALLERY: BuyboxGalleryImage[] = [
  { src: '/products/l-sign/transparent/magnific_2884477047.png', alt: 'L-Sign counter standee, front view' },
  { src: '/products/l-sign/transparent/magnific_2884490360.png', alt: 'L-Sign counter standee, angled' },
  { src: '/products/l-sign/transparent/magnific_2884500886.png', alt: 'L-Sign counter standee, close-up' },
];

// TODO(shopify): pack pricing tiers come from Shopify variants + metafields.
// Structure mirrors CR-80 (1/2/5/10 tiers); price values are placeholders until Phase 8 wires Storefront API.
const L_SIGN_PACKS: BuyboxPack[] = [
  { qty: 1,  price: 49.99,  perCard: 49.99, save: null,  note: null,                     compare: null,   pop: false },
  { qty: 2,  price: 89.99,  perCard: 45.00, save: null,  note: null,                     compare: 99.98,  pop: false },
  { qty: 5,  price: 199.99, perCard: 40.00, save: '20%', note: 'Free shipping included', compare: 249.95, pop: false },
  { qty: 10, price: 359.99, perCard: 36.00, save: '28%', note: 'Free shipping included', compare: 499.90, pop: true  },
];

const L_SIGN_CHECKLIST = [
  '4×6 acrylic tabletop standee — sits next to any register',
  'Pre-programmed to your Google review link before shipping',
  'Works on every modern phone — no app, no download',
  '60-day reprogramming + return guarantee',
];

const L_SIGN_FAQ_ROWS: BuyboxFaqRow[] = [
  { q: 'What is the L-Sign?', a: 'A 4×6 acrylic tabletop standee. Set it next to the register. Customers tap on their way out and land straight on your Google review page.' },
  { q: 'Shipping', a: 'Order by Tuesday 5pm CT, ships Friday. 3-day standard. Free expedited on 5+ packs.' },
  { q: '60-day return + reprogramming guarantee', a: 'Don\\'t love it? Return for full refund within 60 days. Reprogram destination URL anytime.' },
  { q: 'Product details', a: '4×6 acrylic standee with embedded NTAG 215 NFC chip. QR fallback printed on back. Hand-finished in Minneapolis.' },
];
```

Required component composition (mirror `app/shmo-review/cr-80/page.tsx` section order exactly):

```tsx
export default function LSignPage() {
  return (
    <main>
      <Buybox
        product={L_SIGN_PRODUCT}
        gallery={L_SIGN_GALLERY}
        packs={L_SIGN_PACKS}
        checklist={L_SIGN_CHECKLIST}
        faqRows={L_SIGN_FAQ_ROWS}
        ariaLabel='Buy the L-Sign standee'
        nextBg='cream'
      />
      <Proof />
      <CrewStrip nextBg='cream' afterGrid={<ProofTiles />} />
      <HowItWorks />
      <VideoTestimonials bg='cream' nextBg='ember' />
      <FinalCta />
    </main>
  );
}
```

Hard rules:
- Pack prices ABOVE are placeholders. They follow the locked-decision structure (same 1/2/5/10 tiers as CR-80) but the dollar values are guesses until Phase 8 — every PACKS field carries a `TODO(shopify):` comment marker. **DO NOT** invent SKUs, merchandiseIds, or Shopify variant data. The Buybox `handleAdd` already routes through `TODO(shopify):` placeholders.
- DO NOT change the `Buybox` defaults. The L-Sign page passes explicit props.
- DO NOT add a mascot to the L-Sign page (CR-80 has none — match that).
- DO NOT add a Format Compare section (Phase 6 owns it).
- DO NOT add a 'Where it lives' placement section (deferred per RESEARCH.md Q4).
- DO NOT edit any reused component file.
- DO NOT introduce Tailwind utilities for color, type, radius, shadow, or motion. Layout-only Tailwind allowed.
- DO NOT introduce hex colors outside inline SVG.

If the L-Sign images at the stated paths are NOT present, fail the task and surface the missing files — DO NOT substitute different image files."
- **Verification steps:**
  1. `npx tsc --noEmit` clean.
  2. Visit `/shmo-review/l-sign` in browser at desktop (1280px) and mobile (375px).
  3. Buybox renders L-Sign title, L-Sign sub, L-Sign gallery (3 transparent PNGs), L-Sign pack tiers, L-Sign checklist, L-Sign FAQ rows.
  4. Below-the-fold: Proof → CrewStrip + ProofTiles → HowItWorks → VideoTestimonials → FinalCta render in order; section bgs match the rotation table; wave dividers appear between sections (no ~40px sliver — symptom of wave-as-child bug).
  5. No console errors.
  6. `grep -n "L Sign\\|l-sign" app/shmo-review/l-sign/page.tsx` shows L-Sign data wired; no stray CR-80 references in the L-Sign page.
  7. Confirm `/shmo-review` and `/shmo-review/cr-80` still render identically (regression smoke test): re-capture screenshots and eyeball-diff against 05-02 POST baselines.
  8. `design-system-auditor` returns PASS — confirms no primitive restyles in `page.tsx`, no Tailwind for visual concerns, no hardcoded hex outside SVG, no `position: fixed; bottom: 0` patterns.
  9. Playwright screenshots saved:
     - `pictures/screenshots/l-sign-pdp-desktop.png` (1280px, full page)
     - `pictures/screenshots/l-sign-pdp-mobile.png` (375px, full page)
- **Commit message format:** `feat(l-sign): replace Coming Soon stub with full PDP`

---

### 05-04 — L-Sign PDP composition checkpoint

- **Goal:** Jordan reviews `/shmo-review/l-sign` at desktop + mobile in the browser. Approves the composition or sends polish feedback. Polish iterations only — LAYOUT IS LOCKED. Structural changes would mean re-plan, not polish.
- **Type:** `checkpoint:human-verify`
- **Files touched:** NONE if Jordan approves as-is. If polish needed → routed through 05-05.
- **Requirement IDs:** PH5-LSIGN-CHECKPOINT
- **Verification steps:**
  1. Dev server running, `/shmo-review/l-sign` open at desktop (1280px) and mobile (375px).
  2. No console errors, `npx tsc --noEmit` clean.
  3. Screenshots from 05-03 visible in `pictures/screenshots/l-sign-pdp-desktop.png` and `l-sign-pdp-mobile.png`.
  4. Eyeball-test rotation: marsh (Buybox) → cream (Proof) → marsh (CrewStrip) → HowItWorks alternates → cream (VideoTestimonials) → ember (FinalCta) → cocoa (footer).
- **Checkpoint:** Jordan approves the L-Sign PDP composition. If polish requested, proceed to 05-05. If approved, skip 05-05 and proceed to 05-06.
- **Commit message format:** No commit unless polish lands in 05-05.

---

### 05-05 — Polish iteration (conditional — only runs if 05-04 requests fixes)

- **Goal:** Apply Jordan's polish feedback from 05-04 without changing layout. Spacing, type, mascot scale, color-token swaps only.
- **Type:** `auto` → `design-system-builder` dispatch flagged "polish task — LAYOUT IS LOCKED" → `design-system-auditor`
- **Files touched:** Whichever files Jordan's feedback names. Most likely candidates: `app/shmo-review/l-sign/page.tsx` (copy tweaks), `app/shmo-review/shmo-review.css` (page-level layout-only spacing). DO NOT touch primitive CSS in `.claude/skills/shmocard-design-system/components.css`.
- **Requirement IDs:** PH5-LSIGN-CHECKPOINT (re-verify after polish)
- **Builder prompt anchor:** "This is a polish task — LAYOUT IS LOCKED. Do NOT change grid columns, element ordering, tile size ratios, or structural HTML on `/shmo-review/l-sign`. Allowed changes: spacing (padding/margin/gap), type sizing (within existing scale), mascot scale (within `.shm-mascot--supporting` cap of 140px), color token swaps (within design-system tokens — `--color-marsh`, `--color-cream`, `--color-ember`, `--color-cocoa`, `--color-honey`).

Jordan's specific feedback from the 05-04 checkpoint:

[REPLACE WITH JORDAN'S VERBATIM FEEDBACK AT EXECUTION TIME]

Reference the existing 05-03 screenshots in `pictures/screenshots/l-sign-pdp-*.png` as the baseline you are polishing FROM. After the polish lands, re-capture screenshots to the same paths and confirm with Jordan."
- **Verification steps:**
  1. `npx tsc --noEmit` clean.
  2. `design-system-auditor` returns PASS — confirms no structural HTML changed, no class names invented, no primitives restyled.
  3. Re-captured screenshots in `pictures/screenshots/l-sign-pdp-desktop.png` and `l-sign-pdp-mobile.png` show only the polish delta, not layout changes.
  4. Re-checkpoint: Jordan confirms the polish lands correctly.
- **Commit message format:** `polish(l-sign): <Jordan's specific fix>` (e.g., `polish(l-sign): tighten buybox top padding`)
- **Skip rule:** If 05-04 returns "approved as-is" with no feedback, SKIP this plan entirely.

---

### 05-06 — Mobile + a11y pass

- **Goal:** Sweep `/shmo-review/l-sign` at 375 / 414 / 768 px. Catch any clipping, overflow, headline wraps, wave-divider gaps. a11y check on interactive elements (Buybox CTA, pack-row radios, qty buttons, FAQ accordion). LAYOUT IS LOCKED — spacing, type, mascot scale only.
- **Type:** `auto` → `design-system-builder` dispatch flagged "polish + mobile pass — LAYOUT IS LOCKED" → `design-system-auditor`
- **Files touched:** Likely none, possibly small layout-only tweaks to `app/shmo-review/shmo-review.css` if mobile clipping found. NO changes to `components/shmo-review/Buybox.tsx` (refactor is locked; any Buybox mobile fix would regress CR-80 too — block and surface to Jordan).
- **Requirement IDs:** PH5-MOBILE-A11Y
- **Builder prompt anchor:** "Full mobile pass on `/shmo-review/l-sign` at 375px, 414px, and 768px widths. This is a polish task — LAYOUT IS LOCKED, do not change grid columns, element ordering, tile size ratios, or structural HTML. Capture screenshots of each width to `pictures/screenshots/l-sign-mobile-{width}.png`. Look for:
- Clipping / horizontal scrollbars / overflow on any section.
- Wave-divider ~40px gap symptom (the wave-as-child bug — should NOT appear because every section uses `<Section bg=... nextBg=...>`, but verify).
- Pack-row layout at 375px — pack name + SAVE badge + price column stack correctly.
- Buybox gallery thumbnails fit without clipping.
- FAQ accordion expands/collapses cleanly without page-shift jank.
- HowItWorks 4 sections each render correctly mobile.
- FinalCta CTA buttons stack correctly.

Any mobile clipping in `Buybox.tsx` itself is a regression risk — DO NOT modify `Buybox.tsx`. If a Buybox mobile bug is found, surface it to Jordan with a screenshot and the line refs (the fix needs to land for both CR-80 and L-Sign, which means the parent reviews scope before dispatching a separate Buybox fix plan).

a11y check:
- Every interactive element has a label or aria-label (Buybox pack-row radios via `<input type='radio' name='pack'>`, qty buttons via existing `aria-label`, FAQ triggers via existing `aria-expanded`).
- Color contrast: cocoa text on cream / marsh bgs (already passes per design system); honey accent on cocoa/ember (already passes).
- Keyboard tab order: gallery thumbs → bb title → checklist → pack rows → qty → CTA → FAQ. Sensible. Confirm.

Document findings in a short notes file at `.planning/phases/05-l-sign-pdp/05-06-mobile-a11y-NOTES.md` (working note, not a deliverable). If everything passes clean, note 'no fixes needed' in the file and skip CSS changes."
- **Verification steps:**
  1. `npx tsc --noEmit` clean.
  2. Playwright screenshots saved: `pictures/screenshots/l-sign-mobile-375.png`, `l-sign-mobile-414.png`, `l-sign-mobile-768.png`.
  3. No horizontal scrollbar at any width.
  4. `design-system-auditor` returns PASS for any CSS changes made.
  5. `.planning/phases/05-l-sign-pdp/05-06-mobile-a11y-NOTES.md` exists with findings.
  6. If Buybox mobile bug found: blocked, surfaced to Jordan as a separate decision (do NOT silently modify Buybox).
- **Commit message format:** `polish(l-sign): mobile + a11y pass` (or no commit if no fixes needed)

---

### 05-07 — Phase close-out

- **Goal:** Final sweep. `tsc` + build clean, regression baseline confirmed, STATE / handoff / SUMMARY updated. Phase 5 closed.
- **Type:** `checkpoint:human-verify` (close-out)
- **Files touched:**
  - `.planning/STATE.md` (status update)
  - `context/general/handoff.md` (Phase 5 close summary)
  - `.planning/phases/05-l-sign-pdp/05-SUMMARY.md` (new — phase close)
- **Requirement IDs:** PH5-PHASE-CLOSE
- **Verification steps:**
  1. `npx tsc --noEmit` clean.
  2. `npm run build` clean (no build errors, no static-generation failures).
  3. Dev server running. Smoke test in order: `/`, `/shmo-review`, `/shmo-review/cr-80`, `/shmo-review/l-sign`. Each loads without console errors.
  4. Confirm `/shmo-review` and `/shmo-review/cr-80` still render identically to 05-01 baselines. (Visual diff or eyeball-compare against `pictures/screenshots/regression-baseline/*-PRE.png`.)
  5. Confirm full L-Sign PDP renders at desktop + mobile with the rotation table from the success criteria.
  6. Update `.planning/STATE.md` → "Phase 5 complete, Phase 6 (Square Card PDP) ready."
  7. Update `context/general/handoff.md` with a short Phase 5 close summary: Buybox refactor approach (CR-80 defaults), L-Sign route shipped, sections reused as-is, Format Compare still deferred to Phase 6, HowItWorks step-01 copy mismatch still flagged for Phase 7.
  8. Write `.planning/phases/05-l-sign-pdp/05-SUMMARY.md` with: what shipped, what didn't ship (Format Compare deferred to P6, differentiated HowItWorks copy deferred to P7), atomic plan status table, exit criteria check.
- **Checkpoint:** Jordan confirms phase exit criteria pass. Phase 5 closed.
- **Commit message format:** `chore(phase-5): close out L-Sign PDP phase`

---

## Open decisions

These are decision points that may surface during execution. Locked decisions from the user are already baked in and not re-litigable.

1. ✅ **Buybox shared vs forked** — LOCKED (locked decision 2 + 3): refactor to take product props with CR-80 data as defaults. No fork.
2. ✅ **Pack tier structure for L-Sign** — LOCKED (locked decision 1): mirror CR-80 1/2/5/10. Prices are placeholders with `TODO(shopify):` markers; Phase 8 wires real values.
3. ✅ **Format Compare in Phase 5?** — LOCKED (locked decision 4): NO. Deferred to Phase 6 when all 3 formats land together.
4. **HowItWorks step 01 copy ("Crew hands the card")** — Reuse as-is for Phase 5. Minor copy nuance only (L-Sign is self-serve). Flagged for Phase 7 (Cross-PDP mobile polish) or Phase 6 (Square Card) to consider differentiated copy when all 3 PDPs are inspectable side-by-side. Jordan can swap to option (b) param-driven step copy or option (c) skip-HowItWorks-for-L-Sign at the 05-04 checkpoint if he wants — both are post-checkpoint pivots, not in-plan changes.
5. **Mascot on L-Sign page** — RECOMMEND zero (match CR-80). If Jordan wants a mascot moment at 05-04, candidates are `mascot-tap-moment` (NFC tap illustration) or `mascot-star-burst` (review success). Hard cap remains 2 per page.
6. **L-Sign-specific 'Where it lives' placement section** — Deferred per RESEARCH.md Q4. Not in scope for Phase 5. Optional Phase 7 add-on if Jordan flags it later.
7. **L-Sign-specific testimonials** — None exist in `context/general/marketing.md`. Reuse `Proof.tsx` as-is per RESEARCH.md Q3. If Jordan captures L-Sign-specific quotes later, the Proof component can be parameterized in a follow-up phase.

---

## Risks

1. **Buybox refactor breaks `/shmo-review` family page render.** Highest risk in the phase — `app/shmo-review/page.tsx` line 14+34 imports and renders `<Buybox nextBg="marsh" />`. Mitigation: 05-01 captures PRE baseline; 05-02 captures POST and visually diffs. Any drift blocks. Defaults equal current CR-80 hardcoded values, so a no-prop caller MUST render identically.
2. **Wave-divider sibling regression (recurring — 5h debug in Phase 3).** Every section in `app/shmo-review/l-sign/page.tsx` uses `<Section bg=... nextBg=...>` via the reused components. The wave-as-child bug should not appear because no new section component is authored — only composition. 05-06 mobile pass watches for the ~40px-sliver symptom.
3. **L-Sign images missing at expected paths.** Verified at planning time: `public/products/l-sign/transparent/magnific_2884477047.png`, `magnific_2884490360.png`, `magnific_2884500886.png` all present. Builder confirms file existence at 05-03 edit time per the prompt anchor's hard rule ("if missing, fail the task — DO NOT substitute").
4. **Phase 8 pack-price mismatch.** The placeholder L-Sign pack prices (49.99 / 89.99 / 199.99 / 359.99) are guesses. Shopify Admin is the source of truth — Phase 8 will overwrite these. Every entry carries `TODO(shopify):` marker. No risk of hardcoded prices leaking to production because Phase 8 swaps them before launch (Phase 10).
5. **HowItWorks copy mismatch flagged but not fixed.** The "Crew hands the card" step 01 says crew-handed, L-Sign is self-serve. Documented as Open Decision 4. Risk: customer reads the PDP and gets a slightly inaccurate flow description. Acceptable for Phase 5 (the broader Shmo Review story still holds — NFC tap → review page → five stars). Phase 7 reconsiders.
6. **Builder restructures layout during polish in 05-05.** MEMORY rule: LAYOUT IS LOCKED on polish tasks. Every polish dispatch (05-05, 05-06) carries the explicit flag.
7. **Buybox mobile bug found at 05-06 forces cross-phase scope.** If 05-06 surfaces a Buybox-side mobile clipping issue, the fix lands in `Buybox.tsx` and regresses BOTH CR-80 and L-Sign. Mitigation: 05-06 prompt explicitly blocks the builder from touching `Buybox.tsx` — bug surfaces to Jordan, scope review happens before any cross-PDP Buybox edit.
8. **`TODO(shopify):` markers drift between Buybox defaults and L-Sign props.** Two sets of hardcoded product data now exist (default CR-80 in Buybox.tsx, explicit L-Sign in page.tsx). When Phase 8 wires Storefront API, both must be updated. Mitigation: both sets of constants are visibly marked `TODO(shopify):` — Phase 8 plan grep will find both.
9. **Scope creep into Phase 6 (Square Card PDP) or Phase 7 (cross-PDP polish).** Format Compare is the most likely creep target. Locked decision 4 keeps it deferred. Builder agent's enumerated rules + this plan's explicit "DO NOT" lists block.
10. **Pawn-brand bleed (MEMORY rule).** Never mention "Pawn Leads" anywhere on Shmocard. L-Sign copy in this plan does not contain "Pawn Leads." Reused Proof component uses real shop names ("The Pawn Shop", "Axel's Pawn") which is fine per existing precedent.

---

## Threat model

**Trust boundaries:**

| Boundary | Description |
|---|---|
| Browser → DOM | Static + Zustand client state; no user input persisted server-side in Phase 5 |
| User → Buybox cart actions | `handleAdd()` writes a local Zustand cart line with placeholder `merchandiseId`; no Shopify Storefront API mutation in Phase 5 (deferred to Phase 8) |
| Render → image src | All `<img src>` values are static string literals; no runtime data flows into image paths |

**STRIDE register (ASVS L1, project default = block on `high` only):**

| Threat ID | Category | Component | Disposition | Mitigation |
|---|---|---|---|---|
| T-05-01 | Tampering / Information Disclosure (refactor regression) | `components/shmo-review/Buybox.tsx` callers | mitigate | 05-01 captures PRE baselines, 05-02 captures POST and visually diffs. Any pixel-level delta blocks the plan. Defaults equal existing hardcoded values, so zero-prop callers MUST render identically. |
| T-05-02 | Information Disclosure (hardcoded product data) | `app/shmo-review/l-sign/page.tsx` constants | mitigate | Per `.claude/rules/shopify-data-discipline.md`, every product attribute (handle, title, sub, gallery URLs, pack prices, checklist, FAQ) has a `TODO(shopify):` comment marker. Phase 8 grep will find and swap them. No real prices ship to production. |
| T-05-03 | Repudiation (image src 404) | `app/shmo-review/l-sign/page.tsx` `BuyboxGalleryImage[]` | mitigate | Builder at 05-03 confirms `public/products/l-sign/transparent/*.png` files exist before locking imports (mirrors Phase 4 mascot-existence check). Hard rule: "if missing, fail the task — DO NOT substitute." 05-06 mobile pass catches any 404 as a visual defect. |
| T-05-04 | Tampering (XSS via product copy) | L-Sign FAQ rows + title + sub | accept | Copy is hardcoded string literals authored in this plan. React JSX default text-node escaping covers any future variant. No raw-HTML insertion APIs introduced. |
| T-05-05 | Denial of Service (page load) | All Phase 5 routes | accept | Server components + small client Buybox. No DB, no API, no runtime data fetches in Phase 5. Static render cost negligible. |
| T-05-06 | Elevation of Privilege (auth) | N/A | accept | No auth surface in Phase 5. Cart writes go to Zustand only — no server identity. |
| T-05-07 | Spoofing (open redirect) | Internal links in L-Sign PDP | mitigate | Phase 5 introduces no new outbound links beyond what Phase 4 audited. CTAs route to `#buybox` anchor and Buybox `handleAdd()` (local Zustand). No href values constructed from user input. |

**Block-on:** `high` severity only. All Phase 5 threats are `low` or already mitigated by static composition + the explicit regression-diff gate at 05-02. No `high` threats — phase ships once 05-04 checkpoint clears.

---

## Phase exit criteria

Phase 5 is complete when:

- All 7 plans (05-01 through 05-07) are committed in order (05-05 may be skipped if 05-04 approves as-is).
- `components/shmo-review/Buybox.tsx` exports `BuyboxProps`, accepts product data as optional props, defaults to CR-80 values.
- `/shmo-review` and `/shmo-review/cr-80` render pixel-equivalent before and after the refactor (05-02 regression diff PASS).
- `/shmo-review/l-sign` renders the full PDP (Buybox + Proof + CrewStrip + ProofTiles + HowItWorks + VideoTestimonials + FinalCta) at desktop + 375px mobile with no console errors.
- The Coming Soon stub at `app/shmo-review/l-sign/page.tsx` is REPLACED (not retained alongside).
- Every L-Sign product-data field carries a `TODO(shopify):` marker.
- `design-system-auditor` PASS on every UI plan.
- `npx tsc --noEmit` clean.
- `npm run build` clean.
- Full-page screenshots saved to `pictures/screenshots/l-sign-pdp-desktop.png` and `l-sign-pdp-mobile.png`. Regression baselines saved to `pictures/screenshots/regression-baseline/*-PRE.png` and `*-POST.png`.
- `.planning/STATE.md` updated to "Phase 5 complete, Phase 6 (Square Card PDP) ready."
- `context/general/handoff.md` updated with Phase 5 close summary.
- `.planning/phases/05-l-sign-pdp/05-SUMMARY.md` exists.
