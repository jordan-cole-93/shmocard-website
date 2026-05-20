---
phase: 06-square-card-pdp
phase_number: 6
phase_name: Square Card PDP + Format Compare
status: planning
depends_on: [phase-3, phase-4, phase-5]
total_plans: 8
autonomous: false
last_updated: "2026-05-20"
requirements:
  - PH6-SQUARE-ROUTE
  - PH6-BUYBOX-PROPS
  - PH6-NO-REGRESSION
  - PH6-FORMAT-COMPARE
  - PH6-BACKPORT-CR80
  - PH6-BACKPORT-LSIGN
  - PH6-MOBILE
  - PH6-DESIGN-AUDIT
  - PH6-TSC
  - PH6-BUILD
files_modified:
  - app/shmo-review/square-card/page.tsx
  - components/shmo-review/FormatCompare.tsx
  - app/shmo-review/cr-80/page.tsx
  - app/shmo-review/l-sign/page.tsx
  - app/shmo-review/shmo-review.css
  - .planning/STATE.md
  - .planning/ROADMAP.md
  - context/general/handoff.md
  - .planning/phases/06-square-card-pdp/06-SUMMARY.md
must_haves:
  truths:
    - "/shmo-review/square-card renders the full PDP (Buybox + reused below-fold sections) — no longer a Coming Soon stub"
    - "Square Card Buybox shows Square-specific title, sub, gallery (5 PNGs), packs (1/2/5/10), checklist, FAQ"
    - "FormatCompare section renders 3 format cards (CR-80, L-Sign, Square)"
    - "Active format on each PDP shows a 'You're here' ghost CTA instead of a link"
    - "FormatCompare is mounted between HowItWorks and VideoTestimonials on all 3 PDPs"
    - "/shmo-review/cr-80 and /shmo-review/l-sign render identically pre/post FormatCompare back-port except for the new section"
    - "Mobile (375/414/768px) clean on Square Card PDP — no overflow, no wave-gap, no console errors"
    - "design-system-auditor returns PASS on every UI plan"
  artifacts:
    - path: "app/shmo-review/square-card/page.tsx"
      provides: "Square Card PDP route (replaces Coming Soon stub)"
      contains: "SQUARE_PRODUCT, SQUARE_GALLERY, SQUARE_PACKS, SQUARE_CHECKLIST, SQUARE_FAQ_ROWS, <Buybox>, <FormatCompare>"
    - path: "components/shmo-review/FormatCompare.tsx"
      provides: "Shared 3-format decision-support section"
      exports: ["default FormatCompare"]
    - path: "app/shmo-review/cr-80/page.tsx"
      provides: "CR-80 PDP with FormatCompare mounted"
      contains: "<FormatCompare currentHandle=\"google-reviews-nfc-tap-card-cr80\" />"
    - path: "app/shmo-review/l-sign/page.tsx"
      provides: "L-Sign PDP with FormatCompare mounted"
      contains: "<FormatCompare currentHandle=\"google-review-nfc-tap-card-l-sign\" />"
  key_links:
    - from: "app/shmo-review/square-card/page.tsx"
      to: "components/shmo-review/Buybox.tsx"
      via: "BuyboxProps (product, gallery, packs, checklist, faqRows)"
      pattern: "<Buybox\\s+product=\\{SQUARE_PRODUCT\\}"
    - from: "app/shmo-review/square-card/page.tsx"
      to: "components/shmo-review/FormatCompare.tsx"
      via: "currentHandle prop"
      pattern: "<FormatCompare\\s+currentHandle=\"google-review-plaque\""
    - from: "components/shmo-review/FormatCompare.tsx"
      to: "/shmo-review/cr-80 + /shmo-review/l-sign + /shmo-review/square-card"
      via: "PRODUCT_PAGE_HREFS lookup → <a href={...}>"
      pattern: "href=.*/shmo-review/"
---

# Phase 6 — Square Card PDP + Format Compare

## Goal

Ship `/shmo-review/square-card` (the third and last PDP — replaces the Phase 4 Coming Soon stub) using the L-Sign pattern: data props → `<Buybox>` → reused below-the-fold sections. In the same phase, build the **`<FormatCompare>` section** that has been deferred since Phase 3 — a new dedicated component (NOT a `FormatPicker` extension), placed once on Square Card and then back-ported to CR-80 + L-Sign so all 3 PDPs ship with it together.

FormatCompare is mounted between `<HowItWorks />` and `<VideoTestimonials />` on `bg='cream'`. The ember slot stays exclusively with FinalCta. Back-ports are LAYOUT-LOCKED: one import line + one JSX node per file.

No new mascot. No `<Buybox>` modification (refactor is locked from Phase 5). No Shopify Admin writes, no `.env` changes — Phase 6 is local-only.

All UI work routes through the `design-system-builder` subagent. The parent never writes `.tsx` / `.css` directly.

## Success criteria (TRUE = green)

1. Browser renders `/shmo-review/square-card` at desktop (1280px) + mobile (375px) with full PDP composition: Buybox → Proof → CrewStrip + ProofTiles → HowItWorks → FormatCompare → VideoTestimonials → FinalCta. No console errors. `npx tsc --noEmit` clean after every plan.
2. `<FormatCompare>` exists at `components/shmo-review/FormatCompare.tsx`, server component (no `'use client'`), accepts `currentHandle: string` prop, renders 3 format cards using `.shm-product` primitive. Active format gets a disabled `.shm-btn--ghost` "You're here" button; non-active formats link to their PDP route.
3. FormatCompare mounted on all 3 PDPs (`/shmo-review/cr-80`, `/shmo-review/l-sign`, `/shmo-review/square-card`) between `<HowItWorks />` and `<VideoTestimonials />`. `currentHandle` is the correct Shopify handle for each page.
4. **Back-port to CR-80 + L-Sign is LAYOUT-LOCKED.** Each file changes by exactly two edits: one new `import FormatCompare` line + one new `<FormatCompare currentHandle="..." />` JSX node. No restructure, no reordering, no other diffs. Pre/post screenshots confirm.
5. Every section uses design-system primitives — no `.foo__btn`, no `position: fixed; bottom: 0` product bars, no hex colors outside SVG, no system-ui fonts, no Lucide/Heroicons.
6. Every section uses `<Section bg=... nextBg=...>` from `components/layout/Section.tsx`. NO hand-authored `<div className="shm-wave">`. Wave dividers placed as siblings (CLAUDE.md hard rule).
7. Section rotation marsh / cream / ember / cocoa only. Single ember section (FinalCta) per page.
8. Square Card imagery sourced from `public/products/plate/transparent/*.png` (5 files — verified present at planning time). No new imagery required.
9. No hardcoded prices, SKUs, or product handles in `page.tsx` — every product-data field gets a `TODO(shopify):` comment marker. FormatCompare uses static copy + static image paths (no Shopify fetches).
10. No mascot on Square Card PDP (locked decision — match CR-80 + L-Sign zero-mascot baseline).
11. `design-system-auditor` returns PASS after each UI plan.
12. `npx tsc --noEmit` clean AND `npm run build` clean at phase close. All routes statically generated.
13. Square Card PDP route size ≈ matches CR-80 and L-Sign (192 B target) — confirms full PDP composition, not a stub.
14. No Shopify Admin writes, no domain / theme / payment touches, no `.env` changes.

## Implementation strategy

**Build FormatCompare first (so Square Card can use it from day one), checkpoint it on CR-80 as a test mount, then ship the Square Card PDP that integrates it, then back-port to L-Sign, checkpoint all 3 PDPs together, mobile pass, close.**

This sequence diverges slightly from the RESEARCH.md draft order (which built Square Card first, then FormatCompare). The advantage of building FormatCompare first: Square Card PDP gets it natively in 06-03 (one composition, not "ship → back-port to self"). The test-mount on CR-80 (06-02) gives Jordan a real-page review of FormatCompare BEFORE Square Card is built, so any FormatCompare design feedback lands before three pages depend on it.

1. **06-01 — Build `<FormatCompare>` component.** Dispatch `design-system-builder` to author the new shared component. Standalone — not yet mounted on any page. Builder picks the `shm-product__blurb` vs `shm-lede` decision (default: use existing `shm-lede` for safety; promote to new primitive only if builder/auditor agree). No CSS file added — reuses `.format-grid` from `shmo-review.css`. No Shopify fetches — pure RSC with static copy duplicated from FormatPicker's FORMAT_COPY / FALLBACK_IMAGES / HANDLES / PRODUCT_PAGE_HREFS records.
2. **06-02 — Test-mount FormatCompare on `/shmo-review/cr-80` + Jordan checkpoint.** Mount FormatCompare on CR-80 only as the test bed. Capture before/after screenshots. Jordan reviews FormatCompare's visual treatment, copy, "You're here" indicator, mobile stacking. Approves the component or sends polish. This checkpoint exists so the FormatCompare design lands ONCE before propagating to 3 PDPs.
3. **06-03 — Build `/shmo-review/square-card` PDP** (replaces Coming Soon stub). Composes `<Buybox>` with Square props + reused below-the-fold sections + `<FormatCompare currentHandle="google-review-plaque" />` mounted in its locked position.
4. **06-04 — Back-port FormatCompare to `/shmo-review/l-sign`.** Single import + single JSX node addition. LAYOUT IS LOCKED. (CR-80 already has it from 06-02.)
5. **06-05 — Cross-page Jordan checkpoint.** Jordan reviews FormatCompare on all 3 PDPs in the same browser session. Confirms `currentHandle` wiring (CR-80 "You're here" on CR-80 card, L-Sign "You're here" on L-Sign card, Square Card "You're here" on Square Card card). Confirms Square Card PDP composition (Buybox + below-fold sections). Approves or sends polish.
6. **06-06 — Polish iteration (conditional).** Only runs if 06-05 surfaces fixes. Dispatched as polish — LAYOUT IS LOCKED.
7. **06-07 — Mobile + a11y pass.** Square Card at 375/414/768 px. Spot-check FormatCompare card stacking at the same widths on all 3 PDPs. LAYOUT IS LOCKED.
8. **06-08 — Phase close-out.** `tsc` + build clean, STATE.md / ROADMAP.md / handoff.md / SUMMARY.md updated. Phase 6 closed.

**All UI work goes through `design-system-builder`.** Polish iterations (06-06, 06-07) carry the explicit "this is a polish task — LAYOUT IS LOCKED" flag in the builder dispatch.

**Section rotation plan (final shape — applies to all 3 PDPs after Phase 6):**

| # | Section | Component | bg | nextBg |
|---|---|---|---|---|
| 1 | Buybox | `Buybox` (with format-specific props) | `marsh` | `cream` |
| 2 | Proof | `cr-80/Proof` (reuse) | `cream` | `marsh` |
| 3 | CrewStrip + ProofTiles | `CrewStrip` (reuse) | `marsh` | `cream` |
| 4 | HowItWorks (4 alternating sections) | `HowItWorks` (reuse) | cream/marsh internal | exits on marsh |
| 5 | **FormatCompare (NEW)** | `FormatCompare` (new shared component) | `cream` | `marsh` |
| 6 | VideoTestimonials | `VideoTestimonials` (reuse) | `cream` | `ember` |
| 7 | FinalCta | `FinalCta` (reuse) | `ember` | `cocoa` |

**Note on FormatCompare bg transition (RESEARCH.md OQ-1, ASSUMPTION A2):** Default is `bg='cream' nextBg='marsh'`. This produces a `cream → marsh` wave between FormatCompare and VideoTestimonials. VideoTestimonials currently renders `bg='cream' nextBg='ember'` — so we get the sequence `...HowItWorks (exits marsh) → marsh→cream wave → FormatCompare cream → cream→marsh wave → MARSH SLIVER → marsh→cream wave → VideoTestimonials cream → cream→ember wave → FinalCta ember`. That's one extra marsh sliver. **Resolution: change FormatCompare to `bg='cream' nextBg='cream'`** so there's no wave between FormatCompare and VideoTestimonials (they visually merge into one cream block, separated only by the section's own padding). The `Section` component emits a wave whenever `nextBg` is set — confirmed from `Section.tsx` source. If same-bg `nextBg='cream'` still renders a visible wave (unlikely since `.shm-wave--cream` would tint cream onto cream — invisible), fallback is to omit `nextBg` entirely on FormatCompare and let the next section's `bg` flow seamlessly. Builder confirms the rendered behavior at 06-01.

---

## Atomic plans

### 06-01 — Build `<FormatCompare>` shared component

- **Goal:** Author `components/shmo-review/FormatCompare.tsx` as a new server component. Renders 3 format cards using the `.shm-product` primitive; takes `currentHandle: string` prop; shows "You're here" ghost button on the active card; links to PDP route on the others. Standalone — not yet mounted on any page in this plan. Reuses `.format-grid` layout class from `shmo-review.css`. No CSS file added. No Shopify fetches.
- **Type:** `auto` → `design-system-builder` dispatch → `design-system-auditor`
- **Files touched:**
  - `components/shmo-review/FormatCompare.tsx` (NEW)
  - NO changes to `app/shmo-review/shmo-review.css` (`.format-grid` already exists)
  - NO changes to any existing page or component
  - NO new image files (Square Card images already in `public/products/plate/transparent/`)
- **Requirement IDs:** PH6-FORMAT-COMPARE, PH6-DESIGN-AUDIT, PH6-TSC
- **Builder prompt anchor:**

  > "Author a NEW server component at `components/shmo-review/FormatCompare.tsx`. This is a shared decision-support section for the 3 Shmo Review formats — it will be mounted on the CR-80, L-Sign, and Square Card PDPs in subsequent plans. **Do NOT mount it on any page in this plan.** This plan creates the component file only.
  >
  > Hard rules:
  > - Server component. **No `'use client'` directive.** No `useState`, no `useEffect`, no event handlers.
  > - **No Shopify fetches.** No `getProductByHandle()`, no async, no live pricing. FormatCompare is copy-driven, not price-driven. Prices are shown by the Buybox above on each PDP.
  > - Reuse `.format-grid` layout class from `app/shmo-review/shmo-review.css` (already defined for FormatPicker). Do NOT add new CSS to `shmo-review.css` or any other file in this plan.
  > - Use the `.shm-product` primitive from `components.css` for each format card. Use `.shm-btn`, `.shm-badge`, `.shm-eyebrow`, `.shm-h2`, `.shm-lede`, `.shm-section-head` for everything else. Every utility class is `shm-`-prefixed.
  > - Wrap the section in `<Section>` from `components/layout/Section.tsx`. Section props: `bg='cream' nextBg='cream' className='format-compare' id='format-compare' ariaLabel='Compare Shmo Review formats'`. **If `nextBg='cream'` (same-bg) renders a visible wave**, switch to omitting `nextBg` entirely so no wave is emitted between FormatCompare and the next section. The next section (VideoTestimonials) renders `bg='cream'`, so a clean cream-to-cream visual flow is the goal.
  > - Do NOT hand-author `<div className=\"shm-wave\">` anywhere.
  >
  > Required props interface:
  >
  > ```ts
  > export type FormatCompareProps = {
  >   currentHandle: string;
  > };
  > ```
  >
  > Required internal data (inline duplicate of FormatPicker constants — DO NOT extract to a shared lib in this plan; RESEARCH.md OQ-2 default is inline duplicate for simplicity):
  >
  > ```ts
  > // Static copy — mirror of FormatPicker.tsx FORMAT_COPY (page-level merchandising, not product attributes).
  > const FORMAT_COPY: Record<string, { sub: string; blurb: string; badge: string | null; badgeTone: 'ember' | 'honey' | 'soft' }> = {
  >   'google-reviews-nfc-tap-card-cr80': {
  >     sub: 'Wallet-size · PVC · best seller',
  >     blurb: 'The countertop tap that turns happy crews into five-star reviews. Hand it over after every transaction.',
  >     badge: 'Best seller',
  >     badgeTone: 'ember',
  >   },
  >   'google-review-nfc-tap-card-l-sign': {
  >     sub: 'Counter standee · 4×6 acrylic',
  >     blurb: 'A clear acrylic standee for the counter. Tap, scan, done. Stays put when the crew is busy.',
  >     badge: null,
  >     badgeTone: 'soft',
  >   },
  >   'google-review-plaque': {
  >     sub: 'Disc · 2.25\" · sticks anywhere',
  >     blurb: 'An adhesive-backed disc. Sticks to laptops, tablets, registers, dashboards. Travels with the crew.',
  >     badge: 'New',
  >     badgeTone: 'honey',
  >   },
  > };
  >
  > // Title strings (not in FormatPicker — FormatCompare needs a card title separate from the product handle).
  > const FORMAT_TITLES: Record<string, string> = {
  >   'google-reviews-nfc-tap-card-cr80': 'CR-80 Card',
  >   'google-review-nfc-tap-card-l-sign': 'L-Sign Standee',
  >   'google-review-plaque': 'Square Card Disc',
  > };
  >
  > // Static images — mirror of FormatPicker.tsx FALLBACK_IMAGES.
  > const FORMAT_IMAGES: Record<string, { src: string; alt: string }> = {
  >   'google-reviews-nfc-tap-card-cr80': { src: '/products/cr80/transparent/magnific_2884306972.png', alt: 'Shmo Review CR-80 card' },
  >   'google-review-nfc-tap-card-l-sign': { src: '/products/l-sign/transparent/magnific_2884477047.png', alt: 'Shmo Review L-Sign counter standee' },
  >   'google-review-plaque': { src: '/products/plate/transparent/magnific_2885042834.png', alt: 'Shmo Review Square Card disc' },
  > };
  >
  > const HANDLES = ['google-reviews-nfc-tap-card-cr80', 'google-review-nfc-tap-card-l-sign', 'google-review-plaque'] as const;
  >
  > const PRODUCT_PAGE_HREFS: Record<(typeof HANDLES)[number], string> = {
  >   'google-reviews-nfc-tap-card-cr80': '/shmo-review/cr-80',
  >   'google-review-nfc-tap-card-l-sign': '/shmo-review/l-sign',
  >   'google-review-plaque': '/shmo-review/square-card',
  > };
  > ```
  >
  > Required render shape (Shmocard primitive composition):
  >
  > ```tsx
  > <Section bg='cream' nextBg='cream' className='format-compare' id='format-compare' ariaLabel='Compare Shmo Review formats'>
  >   <div className='shm-section-head'>
  >     <span className='shm-eyebrow'>Three formats · same chip</span>
  >     <h2 className='shm-h2'>Not sure this is the <em>right</em> one?</h2>
  >     <p className='shm-lede'>All three use the same reprogrammable NFC chip and ship pre-loaded with your review link.</p>
  >   </div>
  >   <div className='format-grid'>
  >     {HANDLES.map((handle) => {
  >       const copy = FORMAT_COPY[handle];
  >       const image = FORMAT_IMAGES[handle];
  >       const title = FORMAT_TITLES[handle];
  >       const href = PRODUCT_PAGE_HREFS[handle];
  >       const isCurrent = handle === currentHandle;
  >       return (
  >         <article key={handle} className='shm-product' data-current={isCurrent || undefined}>
  >           <div className='shm-product__media'>
  >             {/* Next.js <Image> if FormatPicker uses it — otherwise plain <img>. Match FormatPicker's choice. */}
  >             <img src={image.src} alt={image.alt} />
  >             {copy.badge && (
  >               <span className='shm-product__tag'>
  >                 <span className={`shm-badge shm-badge--${copy.badgeTone}`}>{copy.badge}</span>
  >               </span>
  >             )}
  >           </div>
  >           <div className='shm-product__body'>
  >             <h3 className='shm-product__name'>{title}</h3>
  >             <p className='shm-product__sub'>{copy.sub}</p>
  >             <p className='shm-lede'>{copy.blurb}</p>
  >             <div className='shm-product__row'>
  >               {isCurrent ? (
  >                 <button className='shm-btn shm-btn--ghost shm-btn--sm' type='button' disabled aria-disabled='true'>You're here</button>
  >               ) : (
  >                 <a className='shm-btn shm-btn--primary shm-btn--sm' href={href}>View product</a>
  >               )}
  >             </div>
  >           </div>
  >         </article>
  >       );
  >     })}
  >   </div>
  > </Section>
  > ```
  >
  > Implementation decisions for the builder to make:
  > - **`<img>` vs `<Image>`:** match what FormatPicker uses (read FormatPicker.tsx and copy its choice). Don't introduce a new pattern.
  > - **`shm-product__blurb` primitive:** the markup above uses `shm-lede` inside the card body — safer choice that uses an existing primitive. If the auditor flags that `shm-lede` shouldn't appear inside `.shm-product__body`, switch to an inline-styled `<p>` using the existing typography tokens. **Do NOT add a new `.shm-product__blurb` class to `components.css` in this plan** — that's a separate design-system PR.
  > - **Active-state visual treatment (beyond the disabled button):** add a subtle `data-current` selector style ONLY if the auditor confirms it doesn't restyle the `.shm-product` primitive globally. Default: rely on the ghost button + disabled state to communicate active. No outline ring, no tint wash unless the auditor explicitly approves.
  >
  > Do NOT:
  > - Add `'use client'`.
  > - Fetch from Shopify.
  > - Add new CSS files or new classes to existing CSS files (other than the `data-current` selector if the auditor approves).
  > - Hand-author `<div className=\"shm-wave\">`.
  > - Restyle the `.shm-product` primitive or any other primitive in page-level CSS.
  > - Introduce hex colors outside SVG.
  > - Introduce mascots.
  > - Mount FormatCompare on any page in this plan."

- **Verification steps:**
  1. `npx tsc --noEmit` clean.
  2. File exists at `components/shmo-review/FormatCompare.tsx`.
  3. `grep -n "'use client'" components/shmo-review/FormatCompare.tsx` returns no matches (server component).
  4. `grep -n "getProductByHandle\\|async\\|await" components/shmo-review/FormatCompare.tsx` returns no matches (no Shopify fetches).
  5. `grep -n "shm-wave\\|<div className=\"shm-wave" components/shmo-review/FormatCompare.tsx` returns no matches (no hand-authored waves).
  6. `design-system-auditor` returns PASS — confirms `.shm-` prefix discipline, primitive composition, no restyles, Section wrapper usage.
  7. No console errors when component is imported (verify by transient import in a test page or via `npm run build` smoke).
- **Commit message format:** `feat(format-compare): add shared FormatCompare component`

---

### 06-02 — Test-mount FormatCompare on `/shmo-review/cr-80` + Jordan checkpoint

- **Goal:** Mount `<FormatCompare>` on the CR-80 PDP as the test bed for design review. Single import line + single JSX node addition between `<HowItWorks />` and `<VideoTestimonials />`. **LAYOUT IS LOCKED** on the rest of the page — no restructure. Capture before/after screenshots. Then Jordan reviews FormatCompare visually (desktop + mobile) and either approves the design or sends polish notes. This checkpoint exists to land FormatCompare design ONCE before propagating to L-Sign and Square Card.
- **Type:** `auto` → `design-system-builder` dispatch (LAYOUT IS LOCKED) → `design-system-auditor` → `checkpoint:human-verify`
- **Files touched:**
  - `app/shmo-review/cr-80/page.tsx` (add 1 import + 1 JSX node — NOTHING else)
  - NO changes to `components/shmo-review/FormatCompare.tsx`
  - NO changes to any other file
- **Requirement IDs:** PH6-FORMAT-COMPARE, PH6-BACKPORT-CR80, PH6-NO-REGRESSION, PH6-DESIGN-AUDIT
- **Builder prompt anchor:**

  > "Mount `<FormatCompare>` on `/shmo-review/cr-80`. **LAYOUT IS LOCKED. Single import line + single JSX node addition. NO other changes.** Do NOT restructure the CR-80 page, do NOT reorder any existing sections, do NOT modify any reused component, do NOT touch CSS, do NOT modify `Buybox.tsx`, do NOT modify `FormatCompare.tsx`.
  >
  > Required edits to `app/shmo-review/cr-80/page.tsx`:
  > 1. Add one new import line alongside the existing component imports:
  >    ```ts
  >    import FormatCompare from '@/components/shmo-review/FormatCompare';
  >    ```
  > 2. In the JSX `<main>` block, add one new line between `<HowItWorks />` and `<VideoTestimonials ... />`:
  >    ```tsx
  >    <FormatCompare currentHandle=\"google-reviews-nfc-tap-card-cr80\" />
  >    ```
  >
  > Mount position diagram (exactly between HowItWorks and VideoTestimonials):
  >
  > ```tsx
  > <HowItWorks />
  > <FormatCompare currentHandle=\"google-reviews-nfc-tap-card-cr80\" />   ← INSERT
  > <VideoTestimonials bg='cream' nextBg='ember' />
  > ```
  >
  > Before edits: take a Playwright screenshot of `/shmo-review/cr-80` at desktop (1280px) → save to `pictures/screenshots/cr-80-PRE-format-compare-desktop.png` and at mobile (375px) → `pictures/screenshots/cr-80-PRE-format-compare-mobile.png`. (These become the regression baseline for verifying no unintended layout shifts elsewhere on the page.)
  >
  > After edits: take Playwright screenshots at same widths → `pictures/screenshots/cr-80-POST-format-compare-desktop.png` and `pictures/screenshots/cr-80-POST-format-compare-mobile.png`.
  >
  > Do NOT:
  > - Modify any other line of `app/shmo-review/cr-80/page.tsx` beyond the two edits described.
  > - Modify any other file in the repo.
  > - Restructure the section order.
  > - Adjust VideoTestimonials' `bg` or `nextBg` props.
  > - Wrap FormatCompare in any container or modify its props beyond `currentHandle`."

- **Verification steps:**
  1. `npx tsc --noEmit` clean.
  2. `git diff --stat` shows only `app/shmo-review/cr-80/page.tsx` modified.
  3. `git diff app/shmo-review/cr-80/page.tsx` shows exactly 2 additions: the import line and the JSX node. No deletions, no other changes.
  4. Browser renders `/shmo-review/cr-80` with FormatCompare visible between HowItWorks and VideoTestimonials.
  5. FormatCompare CR-80 card shows the disabled "You're here" ghost button (active format).
  6. FormatCompare L-Sign + Square Card cards show "View product" links pointing to `/shmo-review/l-sign` and `/shmo-review/square-card`.
  7. `design-system-auditor` returns PASS — confirms the mount is clean, no class names changed, no primitive restyles, no Tailwind for visual concerns, no `<div className=\"shm-wave\">` introduced.
  8. PRE and POST screenshots saved. PRE/POST visual diff: only the FormatCompare section should differ; all sections above and below unchanged.
  9. No console errors.
- **Checkpoint (after builder + auditor PASS):** Jordan reviews FormatCompare on `/shmo-review/cr-80` at desktop + mobile in the browser. Approves the FormatCompare design as-is (proceed to 06-03) or sends polish notes. Polish notes route to a polish iteration (treated as inline edit to FormatCompare.tsx — explicit "LAYOUT IS LOCKED, polish only" flag).
- **Commit message format:** `feat(cr-80): mount FormatCompare between HowItWorks and VideoTestimonials`

---

### 06-03 — Build `/shmo-review/square-card` PDP (replaces Coming Soon stub)

- **Goal:** Replace the 9-line Coming Soon stub at `app/shmo-review/square-card/page.tsx` with the full PDP. Compose `<Buybox>` with explicit Square Card props (defined in the page file, every product-data field carrying a `TODO(shopify):` marker) + reused Phase 3 below-the-fold sections + `<FormatCompare currentHandle=\"google-review-plaque\" />` mounted in its locked position between HowItWorks and VideoTestimonials.
- **Type:** `auto` → `design-system-builder` dispatch → `design-system-auditor`
- **Files touched:**
  - `app/shmo-review/square-card/page.tsx` (REPLACE the Coming Soon stub — full PDP composition)
  - NO new components (FormatCompare ships in 06-01; every other below-the-fold section is reused from Phase 3)
  - NO new CSS (page imports `../shmo-review.css` same as CR-80 and L-Sign)
  - NO changes to `Buybox.tsx`, `Proof.tsx`, `CrewStrip.tsx`, `HowItWorks.tsx`, `VideoTestimonials.tsx`, `FinalCta.tsx`, `FormatCompare.tsx`
- **Requirement IDs:** PH6-SQUARE-ROUTE, PH6-BUYBOX-PROPS, PH6-FORMAT-COMPARE, PH6-DESIGN-AUDIT
- **Builder prompt anchor:**

  > "Replace `app/shmo-review/square-card/page.tsx` (currently a 9-line `<ComingSoon>` stub) with a full Square Card PDP. **LAYOUT IS LOCKED for every reused section — do NOT edit `Proof.tsx`, `CrewStrip.tsx`, `HowItWorks.tsx`, `VideoTestimonials.tsx`, `FinalCta.tsx`, `Buybox.tsx`, or `FormatCompare.tsx`.** This task is pure composition: define Square Card props, pass them to `<Buybox>`, mount the reused sections + `<FormatCompare>` in the documented order.
  >
  > Before editing, verify all 5 Square Card images exist at the documented paths:
  >
  > - `public/products/plate/transparent/magnific_2885042834.png`
  > - `public/products/plate/transparent/magnific_2885058687.png`
  > - `public/products/plate/transparent/magnific_2885065402.png`
  > - `public/products/plate/transparent/magnific_2885073898.png`
  > - `public/products/plate/transparent/magnific_2885081184.png`
  >
  > If ANY of the 5 files is missing, FAIL the task and surface the missing path — DO NOT substitute different image files.
  >
  > Required imports (mirror `app/shmo-review/l-sign/page.tsx`):
  >
  > ```ts
  > import '../shmo-review.css';
  > import Buybox, {
  >   type BuyboxProduct,
  >   type BuyboxGalleryImage,
  >   type BuyboxPack,
  >   type BuyboxFaqRow,
  > } from '@/components/shmo-review/Buybox';
  > import Proof from '@/components/shmo-review/cr-80/Proof';
  > import CrewStrip from '@/components/home/CrewStrip';
  > import HowItWorks from '@/components/shmo-review/HowItWorks';
  > import FormatCompare from '@/components/shmo-review/FormatCompare';
  > import VideoTestimonials from '@/components/home/VideoTestimonials';
  > import FinalCta from '@/components/home/FinalCta';
  > import { ProofTiles } from '@/components/shmo-review/ProofMarquee';
  > ```
  >
  > Required metadata:
  >
  > ```ts
  > export const metadata = {
  >   title: 'Square Card NFC Disc — Shmo Review',
  >   description:
  >     'Adhesive-backed NFC disc for any surface. Sticks to doors, windows, dashboards. Pre-programmed before shipping, with QR fallback.',
  > };
  > ```
  >
  > Required Square Card product props (define as module-level consts above the component, each with `TODO(shopify):` comment markers per `.claude/rules/shopify-data-discipline.md`):
  >
  > ```ts
  > // TODO(shopify): replace with Storefront API product query for the Square Card handle.
  > const SQUARE_PRODUCT: BuyboxProduct = {
  >   handle: 'google-review-plaque', // TODO(shopify): confirm exact handle in Shopify Admin
  >   title: 'Google Review NFC Disc (Square Card)',
  >   sub: 'Sticks to anything — door, window, dashboard. Ideal for mobile crews and service vans.',
  > };
  >
  > // TODO(shopify): swap gallery to Shopify product.images.nodes[].url.
  > const SQUARE_GALLERY: BuyboxGalleryImage[] = [
  >   { src: '/products/plate/transparent/magnific_2885042834.png', alt: 'Square Card NFC disc, front view' },
  >   { src: '/products/plate/transparent/magnific_2885058687.png', alt: 'Square Card disc, angled' },
  >   { src: '/products/plate/transparent/magnific_2885065402.png', alt: 'Square Card disc, close-up' },
  >   { src: '/products/plate/transparent/magnific_2885073898.png', alt: 'Square Card disc, stuck to surface' },
  >   { src: '/products/plate/transparent/magnific_2885081184.png', alt: 'Square Card disc, back detail' },
  > ];
  >
  > // TODO(shopify): pack pricing tiers come from Shopify variants + metafields.
  > // Structure mirrors CR-80 / L-Sign (1/2/5/10 tiers); price values are placeholders until Phase 8 wires Storefront API.
  > const SQUARE_PACKS: BuyboxPack[] = [
  >   { qty: 1,  price: 39.99,  perCard: 39.99, save: null,  note: null,                     compare: null,   pop: false },
  >   { qty: 2,  price: 69.99,  perCard: 35.00, save: null,  note: null,                     compare: 79.98,  pop: false },
  >   { qty: 5,  price: 169.99, perCard: 34.00, save: '15%', note: 'Free shipping included', compare: 199.95, pop: false },
  >   { qty: 10, price: 299.99, perCard: 30.00, save: '25%', note: 'Free shipping included', compare: 399.90, pop: true  },
  > ];
  >
  > const SQUARE_CHECKLIST = [
  >   '2.25\" adhesive-backed disc — sticks to any clean surface',
  >   'Pre-programmed to your Google review link before shipping',
  >   'Works on every modern phone — no app, no download',
  >   '60-day reprogramming + return guarantee',
  > ];
  >
  > const SQUARE_FAQ_ROWS: BuyboxFaqRow[] = [
  >   { q: 'What is the Square Card?', a: 'A 2.25\" adhesive-backed NFC disc. Stick it to a door, window, dashboard, or laptop. Customers tap and land straight on your Google review page.' },
  >   { q: 'Shipping', a: 'Order by Tuesday 5pm CT, ships Friday. 3-day standard. Free expedited on 5+ packs.' },
  >   { q: '60-day return + reprogramming guarantee', a: \"Don't love it? Return for full refund within 60 days. Reprogram destination URL anytime.\" },
  >   { q: 'Product details', a: '2.25\" disc with embedded NTAG 215 NFC chip. Adhesive-backed. QR fallback printed on back. Pre-programmed before shipping.' },
  > ];
  > ```
  >
  > Required component composition (mirror `app/shmo-review/l-sign/page.tsx` section order exactly, with FormatCompare added between HowItWorks and VideoTestimonials):
  >
  > ```tsx
  > export default function SquareCardPage() {
  >   return (
  >     <main>
  >       <Buybox
  >         product={SQUARE_PRODUCT}
  >         gallery={SQUARE_GALLERY}
  >         packs={SQUARE_PACKS}
  >         checklist={SQUARE_CHECKLIST}
  >         faqRows={SQUARE_FAQ_ROWS}
  >         ariaLabel='Buy the Square Card disc'
  >         nextBg='cream'
  >       />
  >       <Proof />
  >       <CrewStrip nextBg='cream' afterGrid={<ProofTiles />} />
  >       <HowItWorks />
  >       <FormatCompare currentHandle='google-review-plaque' />
  >       <VideoTestimonials bg='cream' nextBg='ember' />
  >       <FinalCta />
  >     </main>
  >   );
  > }
  > ```
  >
  > Hard rules:
  > - Pack prices above are placeholders. They follow the locked-decision structure (same 1/2/5/10 tiers as CR-80 / L-Sign) but the dollar values are guesses until Phase 8 — every PACKS field carries a `TODO(shopify):` comment marker via the `// TODO(shopify):` line above the const. **DO NOT** invent SKUs, merchandiseIds, or Shopify variant data. The Buybox `handleAdd` already routes through `TODO(shopify):` placeholders.
  > - DO NOT change the `Buybox` defaults. The Square Card page passes explicit props.
  > - DO NOT add a mascot to the Square Card page (CR-80 + L-Sign both have none — match that).
  > - DO NOT modify FormatCompare.tsx in this plan.
  > - DO NOT modify CR-80 or L-Sign in this plan — back-port to L-Sign happens in 06-04 (CR-80 already mounted in 06-02).
  > - DO NOT edit any reused component file.
  > - DO NOT introduce Tailwind utilities for color, type, radius, shadow, or motion. Layout-only Tailwind allowed.
  > - DO NOT introduce hex colors outside inline SVG.
  > - DO NOT retain any `<ComingSoon>` reference — the import and JSX are fully removed."

- **Verification steps:**
  1. `npx tsc --noEmit` clean.
  2. `grep -n "ComingSoon" app/shmo-review/square-card/page.tsx` returns no matches (stub fully replaced).
  3. Visit `/shmo-review/square-card` in browser at desktop (1280px) and mobile (375px).
  4. Buybox renders: title "Google Review NFC Disc (Square Card)", sub "Sticks to anything — door, window, dashboard. Ideal for mobile crews and service vans.", gallery with 5 transparent PNGs, pack tiers 1/2/5/10 with the placeholder prices, checklist 4 bullets, FAQ 4 rows.
  5. Below-the-fold sections render in order: Proof → CrewStrip + ProofTiles → HowItWorks → FormatCompare → VideoTestimonials → FinalCta.
  6. FormatCompare Square Card card shows the disabled "You're here" ghost button. CR-80 and L-Sign cards show "View product" links to their respective PDPs.
  7. Section bgs follow the rotation table; wave dividers appear between sections as siblings (no ~40px sliver — symptom of wave-as-child bug).
  8. No console errors.
  9. `grep -n "TODO(shopify):" app/shmo-review/square-card/page.tsx` returns at least 3 matches (PRODUCT, GALLERY, PACKS — minimum).
  10. Confirm `/shmo-review`, `/shmo-review/cr-80`, `/shmo-review/l-sign` still render — re-load each and check for console errors.
  11. `design-system-auditor` returns PASS — confirms no primitive restyles in `page.tsx`, no Tailwind for visual concerns, no hardcoded hex outside SVG, no `position: fixed; bottom: 0` patterns, no mascot.
  12. Playwright screenshots saved:
      - `pictures/screenshots/square-card-pdp-desktop.png` (1280px, full page)
      - `pictures/screenshots/square-card-pdp-mobile.png` (375px, full page)
- **Commit message format:** `feat(square-card): replace Coming Soon stub with full PDP`

---

### 06-04 — Back-port FormatCompare to `/shmo-review/l-sign`

- **Goal:** Mount `<FormatCompare currentHandle=\"google-review-nfc-tap-card-l-sign\" />` on the L-Sign PDP. Single import line + single JSX node addition. **LAYOUT IS LOCKED.** (CR-80 already mounted in 06-02.) After this plan, all 3 PDPs have FormatCompare in the same locked position.
- **Type:** `auto` → `design-system-builder` dispatch (LAYOUT IS LOCKED) → `design-system-auditor`
- **Files touched:**
  - `app/shmo-review/l-sign/page.tsx` (add 1 import + 1 JSX node — NOTHING else)
  - NO changes to `components/shmo-review/FormatCompare.tsx`
  - NO changes to any other file
- **Requirement IDs:** PH6-BACKPORT-LSIGN, PH6-NO-REGRESSION, PH6-DESIGN-AUDIT
- **Builder prompt anchor:**

  > "Mount `<FormatCompare>` on `/shmo-review/l-sign`. **LAYOUT IS LOCKED. Single import line + single JSX node addition. NO other changes.** Do NOT restructure the L-Sign page, do NOT reorder any existing sections, do NOT modify any reused component, do NOT touch CSS, do NOT modify `Buybox.tsx`, do NOT modify `FormatCompare.tsx`, do NOT modify L-Sign product props.
  >
  > Required edits to `app/shmo-review/l-sign/page.tsx`:
  > 1. Add one new import line alongside the existing component imports:
  >    ```ts
  >    import FormatCompare from '@/components/shmo-review/FormatCompare';
  >    ```
  > 2. In the JSX `<main>` block, add one new line between `<HowItWorks />` and `<VideoTestimonials ... />`:
  >    ```tsx
  >    <FormatCompare currentHandle=\"google-review-nfc-tap-card-l-sign\" />
  >    ```
  >
  > Mount position diagram (exactly between HowItWorks and VideoTestimonials):
  >
  > ```tsx
  > <HowItWorks />
  > <FormatCompare currentHandle=\"google-review-nfc-tap-card-l-sign\" />   ← INSERT
  > <VideoTestimonials bg='cream' nextBg='ember' />
  > ```
  >
  > Before edits: take a Playwright screenshot of `/shmo-review/l-sign` at desktop (1280px) → `pictures/screenshots/l-sign-PRE-format-compare-desktop.png` and at mobile (375px) → `pictures/screenshots/l-sign-PRE-format-compare-mobile.png`.
  >
  > After edits: take Playwright screenshots at same widths → `pictures/screenshots/l-sign-POST-format-compare-desktop.png` and `pictures/screenshots/l-sign-POST-format-compare-mobile.png`.
  >
  > Do NOT:
  > - Modify any other line of `app/shmo-review/l-sign/page.tsx` beyond the two edits described.
  > - Modify any other file in the repo.
  > - Restructure the section order.
  > - Adjust VideoTestimonials' `bg` or `nextBg` props.
  > - Touch the L-Sign product consts (L_SIGN_PRODUCT, L_SIGN_GALLERY, L_SIGN_PACKS, L_SIGN_CHECKLIST, L_SIGN_FAQ_ROWS).
  > - Modify FormatCompare.tsx."

- **Verification steps:**
  1. `npx tsc --noEmit` clean.
  2. `git diff --stat` shows only `app/shmo-review/l-sign/page.tsx` modified.
  3. `git diff app/shmo-review/l-sign/page.tsx` shows exactly 2 additions: the import line and the JSX node. No deletions, no other changes.
  4. Browser renders `/shmo-review/l-sign` with FormatCompare visible between HowItWorks and VideoTestimonials.
  5. FormatCompare L-Sign card shows the disabled "You're here" ghost button (active format).
  6. FormatCompare CR-80 + Square Card cards show "View product" links pointing to `/shmo-review/cr-80` and `/shmo-review/square-card`.
  7. `design-system-auditor` returns PASS.
  8. PRE and POST screenshots saved. PRE/POST visual diff: only the FormatCompare section should differ; all sections above and below unchanged.
  9. No console errors.
- **Commit message format:** `feat(l-sign): mount FormatCompare between HowItWorks and VideoTestimonials`

---

### 06-05 — Cross-page composition checkpoint (Jordan reviews all 3 PDPs)

- **Goal:** Jordan reviews FormatCompare on all 3 PDPs in the same browser session, plus the full Square Card PDP composition. Confirms `currentHandle` wiring (right "You're here" card on each page), section rotation, mobile + desktop. Approves or sends polish notes.
- **Type:** `checkpoint:human-verify`
- **Files touched:** NONE if Jordan approves as-is. If polish needed → routed through 06-06.
- **Requirement IDs:** PH6-SQUARE-ROUTE, PH6-FORMAT-COMPARE, PH6-BACKPORT-CR80, PH6-BACKPORT-LSIGN
- **Verification steps (Jordan):**
  1. Dev server running, all 3 PDPs open at desktop (1280px) AND mobile (375px).
  2. No console errors on any page, `npx tsc --noEmit` clean, `npm run build` clean (smoke run optional but recommended).
  3. Screenshots from 06-03 and 06-04 visible in `pictures/screenshots/square-card-pdp-*.png`, `cr-80-POST-format-compare-*.png`, `l-sign-POST-format-compare-*.png`.
  4. Eyeball test each PDP's section rotation: Buybox (marsh) → Proof (cream) → CrewStrip (marsh) → HowItWorks (alternates) → FormatCompare (cream) → VideoTestimonials (cream) → FinalCta (ember) → footer (cocoa).
  5. On `/shmo-review/cr-80`: FormatCompare's CR-80 card shows "You're here" disabled button.
  6. On `/shmo-review/l-sign`: FormatCompare's L-Sign card shows "You're here" disabled button.
  7. On `/shmo-review/square-card`: FormatCompare's Square Card card shows "You're here" disabled button.
  8. Click each "View product" link on each PDP — confirms route hits the correct PDP, no 404.
- **Checkpoint:** Jordan approves all 3 PDPs with FormatCompare mounted. If polish requested, proceed to 06-06. If approved, skip 06-06 and proceed to 06-07.
- **Commit message format:** No commit unless polish lands in 06-06.

---

### 06-06 — Polish iteration (conditional — only runs if 06-05 requests fixes)

- **Goal:** Apply Jordan's polish feedback from 06-05 without changing layout. Spacing, type, mascot scale, color-token swaps only. Likely targets: FormatCompare card spacing, FormatCompare copy, Square Card PDP Buybox copy, FormatCompare active-state visual treatment.
- **Type:** `auto` → `design-system-builder` dispatch flagged "polish task — LAYOUT IS LOCKED" → `design-system-auditor`
- **Files touched:** Whichever files Jordan's feedback names. Most likely candidates: `components/shmo-review/FormatCompare.tsx` (copy / active-state tweaks), `app/shmo-review/square-card/page.tsx` (Buybox copy tweaks), `app/shmo-review/shmo-review.css` (page-level layout-only spacing). DO NOT touch primitive CSS in `.claude/skills/shmocard-design-system/components.css`.
- **Requirement IDs:** PH6-DESIGN-AUDIT (re-verify after polish)
- **Builder prompt anchor:**

  > "This is a polish task — LAYOUT IS LOCKED. Do NOT change grid columns, element ordering, tile size ratios, or structural HTML on any Phase 6 surface (`/shmo-review/square-card`, FormatCompare component, or the back-port mounts on CR-80 + L-Sign). Allowed changes: spacing (padding / margin / gap), type sizing (within existing scale), color token swaps (within design-system tokens — `--color-marsh`, `--color-cream`, `--color-ember`, `--color-cocoa`, `--color-honey`).
  >
  > Jordan's specific feedback from the 06-05 checkpoint:
  >
  > [REPLACE WITH JORDAN'S VERBATIM FEEDBACK AT EXECUTION TIME]
  >
  > Reference the existing 06-03 / 06-04 screenshots in `pictures/screenshots/square-card-pdp-*.png`, `cr-80-POST-format-compare-*.png`, `l-sign-POST-format-compare-*.png` as the baseline you are polishing FROM. After the polish lands, re-capture screenshots to the same paths and confirm with Jordan.
  >
  > Hard constraints:
  > - DO NOT touch `Buybox.tsx`. Any Buybox-side polish regresses CR-80 + L-Sign too — surface to Jordan instead.
  > - DO NOT modify primitive CSS (`.claude/skills/shmocard-design-system/components.css`). Polish at page level or in FormatCompare component only.
  > - DO NOT introduce new primitives. Compose existing ones."

- **Verification steps:**
  1. `npx tsc --noEmit` clean.
  2. `design-system-auditor` returns PASS — confirms no structural HTML changed, no class names invented, no primitives restyled.
  3. Re-captured screenshots show only the polish delta, not layout changes.
  4. Re-checkpoint: Jordan confirms the polish lands correctly.
- **Commit message format:** `polish(phase-6): <Jordan's specific fix>` (e.g., `polish(phase-6): tighten FormatCompare card padding`)
- **Skip rule:** If 06-05 returns "approved as-is" with no feedback, SKIP this plan entirely.

---

### 06-07 — Mobile + a11y pass

- **Goal:** Full mobile sweep on `/shmo-review/square-card` at 375 / 414 / 768 px. Spot-check FormatCompare card stacking at the same widths on all 3 PDPs. Catch any clipping, overflow, wave-divider gaps, headline wraps. a11y check on Square Card Buybox + FormatCompare interactive elements. LAYOUT IS LOCKED — spacing, type, color-token only.
- **Type:** `auto` → `design-system-builder` dispatch flagged "polish + mobile pass — LAYOUT IS LOCKED" → `design-system-auditor`
- **Files touched:** Likely none, possibly small layout-only tweaks to `app/shmo-review/shmo-review.css` if mobile clipping found on FormatCompare. NO changes to `Buybox.tsx` (refactor is locked from Phase 5; any Buybox mobile fix would regress CR-80 + L-Sign too — surface to Jordan).
- **Requirement IDs:** PH6-MOBILE
- **Builder prompt anchor:**

  > "Full mobile pass on `/shmo-review/square-card` at 375px, 414px, and 768px widths. This is a polish task — LAYOUT IS LOCKED, do NOT change grid columns, element ordering, tile size ratios, or structural HTML. Capture screenshots of each width to:
  >
  > - `pictures/screenshots/square-card-mobile-375.png`
  > - `pictures/screenshots/square-card-mobile-414.png`
  > - `pictures/screenshots/square-card-mobile-768.png`
  >
  > Also spot-check FormatCompare card stacking at 375px on all 3 PDPs (additive screenshots — focused crop on the FormatCompare section only):
  >
  > - `pictures/screenshots/format-compare-mobile-375-cr-80.png`
  > - `pictures/screenshots/format-compare-mobile-375-l-sign.png`
  > - `pictures/screenshots/format-compare-mobile-375-square-card.png`
  >
  > Look for:
  > - Clipping / horizontal scrollbars / overflow on any section.
  > - Wave-divider ~40px gap symptom (the wave-as-child bug — should NOT appear because every section uses `<Section bg=... nextBg=...>`, but verify).
  > - Pack-row layout at 375px on Square Card — pack name + SAVE badge + price column stack correctly.
  > - Buybox gallery thumbnails fit without clipping (5 thumbs vs CR-80's 6 / L-Sign's 3 — confirm thumb strip wraps or scrolls cleanly).
  > - FAQ accordion expands/collapses cleanly without page-shift jank.
  > - HowItWorks 4 sections each render correctly mobile.
  > - FormatCompare 3-card grid stacks to 1-column at 375px without overflow, "You're here" button is touch-target friendly (min 44px tall).
  > - VideoTestimonials renders without weird transition into FormatCompare's cream bg.
  > - FinalCta CTA buttons stack correctly.
  >
  > Any mobile clipping in `Buybox.tsx` itself is a regression risk — DO NOT modify `Buybox.tsx`. If a Buybox mobile bug is found, surface it to Jordan with a screenshot and line refs (the fix needs to land for all 3 PDPs which means scope review).
  >
  > Any mobile clipping in `FormatCompare.tsx` itself is a regression risk — touching FormatCompare regresses all 3 PDPs identically (one component, three mounts) which is acceptable, but still surface the diff to Jordan before committing.
  >
  > a11y check:
  > - FormatCompare "You're here" button is disabled with `aria-disabled='true'` — confirm.
  > - FormatCompare "View product" links have descriptive anchor text — confirm.
  > - Color contrast: cocoa text on cream bg already passes per design system; the disabled ghost button must still meet 3:1 against cream (confirm via DevTools contrast check).
  > - Keyboard tab order on Square Card PDP: gallery thumbs → bb title → checklist → pack rows → qty → CTA → FAQ → (scroll) → FormatCompare cards in left-to-right order → VideoTestimonials → FinalCta. Sensible. Confirm.
  >
  > Document findings in a short notes file at `.planning/phases/06-square-card-pdp/06-07-mobile-a11y-NOTES.md` (working note, not a deliverable). If everything passes clean, note 'no fixes needed' in the file and skip CSS changes."

- **Verification steps:**
  1. `npx tsc --noEmit` clean.
  2. Playwright screenshots saved at all documented paths.
  3. No horizontal scrollbar at any width on any of the 3 PDPs.
  4. `design-system-auditor` returns PASS for any CSS changes made.
  5. `.planning/phases/06-square-card-pdp/06-07-mobile-a11y-NOTES.md` exists with findings.
  6. If Buybox or FormatCompare mobile bug found: blocked, surfaced to Jordan as a separate decision (do NOT silently modify either).
- **Commit message format:** `polish(phase-6): mobile + a11y pass` (or no commit if no fixes needed)

---

### 06-08 — Phase close-out

- **Goal:** Final sweep. `tsc` + build clean, Square Card route size confirmed ≈ matches CR-80 / L-Sign, regression smoke test passes, STATE / ROADMAP / handoff / SUMMARY updated. Phase 6 closed.
- **Type:** `checkpoint:human-verify` (close-out)
- **Files touched:**
  - `.planning/STATE.md` (status update)
  - `.planning/ROADMAP.md` (mark Phase 6 complete)
  - `context/general/handoff.md` (Phase 6 close summary)
  - `.planning/phases/06-square-card-pdp/06-SUMMARY.md` (NEW — phase close)
- **Requirement IDs:** PH6-TSC, PH6-BUILD
- **Verification steps:**
  1. `npx tsc --noEmit` clean.
  2. `npm run build` clean (no build errors, no static-generation failures). All routes statically generated.
  3. Build output shows `/shmo-review/square-card` route size ≈ matches `/shmo-review/cr-80` and `/shmo-review/l-sign` (target: 192 B like L-Sign — confirms full PDP composition, not a stub).
  4. Dev server running. Smoke test in order: `/`, `/shmo-review`, `/shmo-review/cr-80`, `/shmo-review/l-sign`, `/shmo-review/square-card`. Each loads without console errors at desktop AND mobile.
  5. Confirm FormatCompare visible on all 3 PDPs between HowItWorks and VideoTestimonials.
  6. Confirm `currentHandle` wiring: each PDP shows "You're here" on its own format card.
  7. Update `.planning/STATE.md` → "Phase 6 complete, Phase 7 (Cross-PDP mobile polish) ready."
  8. Update `.planning/ROADMAP.md` → mark Phase 6 `[x] complete`, add completion date.
  9. Update `context/general/handoff.md` with a short Phase 6 close summary: Square Card PDP shipped, FormatCompare built once + mounted on all 3 PDPs, no Buybox changes, all 3 PDPs now feature-complete except for Shopify wiring (Phase 8).
  10. Write `.planning/phases/06-square-card-pdp/06-SUMMARY.md` with: what shipped (Square Card PDP, FormatCompare component, 3-PDP mounts), what didn't ship (Shopify wiring still in Phase 8, HowItWorks step-01 copy mismatch still flagged for Phase 7), atomic plan status table, exit criteria check.
- **Checkpoint:** Jordan confirms phase exit criteria pass. Phase 6 closed. Recommend `/gsd-plan-phase 7` next (Cross-PDP mobile polish).
- **Commit message format:** `chore(phase-6): close out Square Card PDP + FormatCompare phase`

---

## Open decisions

Locked decisions from the user are already baked in and not re-litigable.

1. ✅ **Buybox model for Square Card** — LOCKED (locked decision 1): same 1/2/5/10 pack tiers as CR-80 / L-Sign, `TODO(shopify):` placeholders.
2. ✅ **Pattern reuse over fork** — LOCKED (locked decision 2): reuse Phase 3 below-the-fold sections. Don't fork.
3. ✅ **FormatCompare as new dedicated component** — LOCKED (locked decision 3): NOT a FormatPicker extension. Static RSC. No Shopify fetches.
4. ✅ **FormatCompare placement: between HowItWorks and VideoTestimonials, bg='cream'** — LOCKED (locked decision 4). Ember slot stays exclusively with FinalCta.
5. ✅ **Square Card image path: `public/products/plate/transparent/`** — LOCKED (locked decision 5). 5 PNGs verified at planning time.
6. ✅ **Back-port to CR-80 + L-Sign in same phase** — LOCKED (locked decision 6). 1 import + 1 JSX node each, LAYOUT IS LOCKED.
7. ✅ **No mascot on Square Card PDP** — LOCKED (locked decision 7). Match CR-80 + L-Sign zero-mascot baseline.
8. **FormatCompare bg transition (OQ-1 from RESEARCH.md)** — Default `cream → cream` (no internal wave between FormatCompare and VideoTestimonials, since they're both cream). Builder confirms rendered behavior at 06-01. If same-bg renders a visible wave, fallback is to omit `nextBg` entirely. Jordan can override at 06-02 checkpoint.
9. **Copy sharing between FormatPicker + FormatCompare (OQ-2)** — Default: inline duplicate in `FormatCompare.tsx`. Avoids new `lib/` structure. If Jordan wants DRY extraction later, extract to `lib/shmo-review/format-copy.ts` in a follow-up phase.
10. **HowItWorks step 01 copy ("Crew hands the card") for Square Card (OQ-4)** — Reuse as-is for Phase 6. Same decision made in Phase 5 for L-Sign. Defer copy differentiation to Phase 7 (Cross-PDP mobile polish) — Phase 7 is the natural moment for editorial review across all 3 PDPs.
11. **`shm-product__blurb` primitive (OQ-5)** — Default: use existing `shm-lede` inside the card body. Don't add a new primitive in this phase. Builder may surface this for follow-up if `shm-lede` reads wrong inside `.shm-product__body`.
12. **Square Card placeholder pack prices** — Builder uses RESEARCH.md Q2 values (39.99/69.99/169.99/299.99). All carry `TODO(shopify):` markers. Phase 8 overwrites. Jordan can override structure at any checkpoint (it's placeholder anyway).
13. **FormatCompare CTA copy for non-active cards** — Default: "View product". Builder may surface alternatives ("See details", "Open product page") at 06-02 checkpoint. Jordan picks.
14. **FormatCompare title copy** — Default: "Not sure this is the *right* one?" with `<em>right</em>`. Builder may surface alternatives at 06-02 checkpoint.

---

## Risks

1. **FormatCompare rendering bug breaks all 3 PDPs at once.** Highest risk in the phase — FormatCompare is mounted on 3 pages. A render error or visual bug regresses all 3 simultaneously. Mitigation: build FormatCompare first (06-01), test-mount on CR-80 only (06-02), Jordan checkpoint BEFORE Square Card and L-Sign get it. If FormatCompare fails the 06-02 checkpoint, iterate before 06-03 / 06-04.
2. **Wave-divider sibling regression (recurring — 5h debug in Phase 3).** FormatCompare uses `<Section bg=... nextBg=...>`. The wave-as-child bug should not appear because no new section component is hand-authored at the `<div className=\"shm-wave\">` level. 06-07 mobile pass watches for the ~40px-sliver symptom.
3. **Square Card images missing at expected paths.** Verified at planning time: all 5 files present in `public/products/plate/transparent/`. Builder confirms file existence at 06-03 edit time per the prompt anchor's hard rule ("if missing, fail the task — DO NOT substitute").
4. **Back-port to CR-80 + L-Sign accidentally restructures other sections.** MEMORY rule + builder system prompt enforces LAYOUT IS LOCKED. PRE/POST screenshot capture in 06-02 and 06-04 confirms no unintended diffs. Auditor verifies `git diff` shows exactly 2 additions per file.
5. **Same-bg wave behavior (RESEARCH.md ASSUMPTION A2).** Whether `<Section bg='cream' nextBg='cream'>` emits a visible wave is unconfirmed against Section.tsx source. Builder validates at 06-01; fallback documented (omit `nextBg`).
6. **Phase 8 pack-price mismatch.** Square Card placeholder pack prices are guesses. Shopify Admin is the source of truth — Phase 8 will overwrite. Every entry carries `TODO(shopify):` marker. No risk of hardcoded prices leaking to production because Phase 8 swaps them before Phase 10 launch.
7. **HowItWorks copy mismatch on Square Card.** "Crew hands the card" doesn't fit Square Card's stick-anywhere format. Documented as Open Decision 10. Acceptable for Phase 6 (the broader Shmo Review story still holds — NFC tap → review page → five stars). Phase 7 reconsiders across all 3 PDPs.
8. **Builder restructures layout during polish in 06-06.** MEMORY rule: LAYOUT IS LOCKED on polish tasks. Every polish dispatch (06-06, 06-07) carries the explicit flag.
9. **Buybox or FormatCompare mobile bug found at 06-07 forces cross-PDP scope.** If a Buybox-side mobile clipping issue surfaces, fixing it regresses all 3 PDPs at once. Mitigation: 06-07 prompt explicitly blocks the builder from touching `Buybox.tsx`. FormatCompare mobile bugs affect all 3 PDPs identically (one component, three mounts) — surface to Jordan before committing.
10. **`TODO(shopify):` markers drift between Buybox defaults and PDP props.** Three sets of hardcoded product data now exist (Buybox defaults = CR-80, L-Sign page, Square Card page). When Phase 8 wires Storefront API, all three must be updated. Mitigation: every set carries visible `TODO(shopify):` markers — Phase 8 plan grep will find them.
11. **Scope creep into Phase 7 (mobile polish).** Format Compare polish iterations could expand to "fix all the mobile issues on Square Card" — but Phase 7 is the dedicated cross-PDP mobile pass. Mitigation: 06-07 documents findings without fixing if the fix scope is large.
12. **Pawn-brand bleed (MEMORY rule).** Never mention "Pawn Leads" anywhere on Shmocard. Square Card copy in this plan does not contain "Pawn Leads." Reused Proof component uses real shop names ("The Pawn Shop", "Axel's Pawn") — fine per existing precedent.
13. **Coming Soon stub not fully removed.** Risk: builder keeps the `<ComingSoon>` import alongside the new PDP, leaving dead code. Mitigation: verification step `grep -n "ComingSoon" app/shmo-review/square-card/page.tsx` returns no matches.
14. **Image alt text inconsistency.** Square Card gallery uses 5 distinct alts ("front view", "angled", "close-up", "stuck to surface", "back detail"). Risk: builder shortcuts to "Square Card disc" × 5. Mitigation: builder prompt anchor specifies each alt verbatim.

---

## Threat model

**Trust boundaries:**

| Boundary | Description |
|---|---|
| Browser → DOM | Static + Zustand client state; no user input persisted server-side in Phase 6 |
| User → Buybox cart actions | `handleAdd()` writes a local Zustand cart line with placeholder `merchandiseId`; no Shopify Storefront API mutation in Phase 6 (deferred to Phase 8) |
| Render → image src | All `<img src>` values are static string literals; no runtime data flows into image paths |
| FormatCompare → PDP routes | `<a href>` values are hardcoded route strings from PRODUCT_PAGE_HREFS const; no runtime URL construction |

**STRIDE register (ASVS L1, project default = block on `high` only):**

| Threat ID | Category | Component | Disposition | Mitigation |
|---|---|---|---|---|
| T-06-01 | Tampering / Information Disclosure (back-port regression) | `app/shmo-review/cr-80/page.tsx`, `app/shmo-review/l-sign/page.tsx` | mitigate | 06-02 + 06-04 capture PRE baselines + POST screenshots. `git diff --stat` confirms only target file modified. `git diff` confirms exactly 2 additions (import + JSX node) and zero deletions. Auditor verifies. |
| T-06-02 | Information Disclosure (hardcoded product data — Square Card prices, SKUs) | `app/shmo-review/square-card/page.tsx` constants | mitigate | Per `.claude/rules/shopify-data-discipline.md`, every product attribute (handle, title, sub, gallery URLs, pack prices, checklist, FAQ) has a `TODO(shopify):` comment marker. Phase 8 grep finds and swaps them. No real prices ship to production. |
| T-06-03 | Repudiation (image src 404) | `app/shmo-review/square-card/page.tsx` `BuyboxGalleryImage[]` | mitigate | Builder at 06-03 confirms `public/products/plate/transparent/*.png` files exist before locking imports (mirrors Phase 5 L-Sign asset check). Hard rule: "if missing, fail the task — DO NOT substitute." 06-07 mobile pass catches any 404 as a visual defect. |
| T-06-04 | Tampering (XSS via product copy) | Square Card FAQ rows + title + sub + FormatCompare title / blurb | accept | Copy is hardcoded string literals authored in this plan + 06-01 builder prompt. React JSX default text-node escaping covers any future variant. No raw-HTML insertion APIs introduced. |
| T-06-05 | Spoofing (open redirect) | FormatCompare `<a href>` values | mitigate | href values are hardcoded internal route strings from PRODUCT_PAGE_HREFS const. No href construction from user input or runtime data. Internal-only links. |
| T-06-06 | Denial of Service (page load) | All Phase 6 routes | accept | Server components + small client Buybox. FormatCompare is RSC with no async work. No DB, no API, no runtime data fetches in Phase 6. Static render cost negligible. |
| T-06-07 | Elevation of Privilege (auth) | N/A | accept | No auth surface in Phase 6. Cart writes go to Zustand only — no server identity. |
| T-06-08 | Tampering (FormatCompare card swap / state) | `components/shmo-review/FormatCompare.tsx` | accept | Server component. No client state, no event handlers, no mutable references. `currentHandle` is a hardcoded string literal at each call site. No injection surface. |

**Block-on:** `high` severity only. All Phase 6 threats are `low` or already mitigated by static composition + the explicit PRE/POST diff gates at 06-02 / 06-04. No `high` threats — phase ships once 06-05 checkpoint clears.

---

## Phase exit criteria

Phase 6 is complete when:

- All 8 plans (06-01 through 06-08) committed in order (06-06 may be skipped if 06-05 approves as-is).
- `components/shmo-review/FormatCompare.tsx` exists, is a server component, takes `currentHandle: string` prop, renders 3 format cards using `.shm-product` primitive, no Shopify fetches, no hand-authored waves, design-system-auditor PASS.
- `/shmo-review/square-card` renders the full PDP (Buybox + Proof + CrewStrip + ProofTiles + HowItWorks + FormatCompare + VideoTestimonials + FinalCta) at desktop + 375px mobile with no console errors.
- The Coming Soon stub at `app/shmo-review/square-card/page.tsx` is REPLACED — `grep -n "ComingSoon" app/shmo-review/square-card/page.tsx` returns zero matches.
- Every Square Card product-data field carries a `TODO(shopify):` marker.
- `app/shmo-review/cr-80/page.tsx` and `app/shmo-review/l-sign/page.tsx` each show exactly two diff-additions vs Phase 5 close: one import line + one `<FormatCompare currentHandle="..." />` JSX node between HowItWorks and VideoTestimonials. No other changes.
- All 3 PDPs render FormatCompare in identical position with correct `currentHandle` wiring (each PDP shows "You're here" on its own format card).
- `design-system-auditor` PASS on every UI plan (06-01, 06-02, 06-03, 06-04, optionally 06-06, optionally 06-07).
- `npx tsc --noEmit` clean.
- `npm run build` clean. All routes statically generated.
- `/shmo-review/square-card` route size ≈ 192 B (matches L-Sign / CR-80 — confirms full PDP composition, not a stub).
- Full-page screenshots saved to `pictures/screenshots/square-card-pdp-desktop.png`, `square-card-pdp-mobile.png`. PRE/POST back-port screenshots for CR-80 + L-Sign saved.
- `.planning/STATE.md` updated to "Phase 6 complete, Phase 7 (Cross-PDP mobile polish) ready."
- `.planning/ROADMAP.md` Phase 6 marked `[x] complete` with completion date.
- `context/general/handoff.md` updated with Phase 6 close summary.
- `.planning/phases/06-square-card-pdp/06-SUMMARY.md` exists.
