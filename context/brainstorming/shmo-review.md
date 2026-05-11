# /shmo-review — section-by-section rebuild plan

**Date locked:** 2026-05-11
**Reference:** `.claude/skills/shmocard-design-system/ui_kits/website/homepage-shmoreview/` (`Shmo Review.html` + `review-app.jsx` + `review-parts.jsx` + `review-buybox.jsx` + `review-cart.jsx` + `review.css`)
**Authority:** the reference page is the layout authority. When this plan and the reference disagree, the reference wins.

## How we build

- One section per commit. One section per browser review cycle.
- After each section: dev server up → `/shmo-review` rendered → screenshot to `pictures/screenshots/shmo-review-<n>-<name>.png` → Jordan approves → commit → next.
- Layout-only CSS goes in `app/shmo-review/shmo-review.css`. Appearance stays in design-system `components.css`. No primitive restyles.
- Wave dividers are siblings of sections — use `<Section bg nextBg>` from `components/layout/Section.tsx`.
- Per-page wave height override: this page bumps base wave to 56px / 88px / 120px (see `review.css:15-17`). Port that override to `shmo-review.css`.

## Section rotation (locked from reference)

| # | Section | bg | nextBg (wave color) |
|---|---|---|---|
| 1 | ReviewHero | marsh | graham |
| 2 | ReviewBulletStrip | graham | marsh |
| 3 | ReviewBuybox | marsh | marsh |
| 4 | FormatPicker | marsh | marsh |
| 5 | HowItWorks | marsh | marsh |
| 6 | StandoutMoments | marsh | marsh |
| 7 | NumbersWall | marsh | cocoa |
| 8 | Objections | **cocoa** | graham |
| 9 | ShipReturns | graham | marsh |
| 10 | ReviewFaq | marsh | ember |
| 11 | FinalCta | **ember** | (footer) |

Within same-color runs (3→7) the wave still draws a hairline divider thanks to the bumped page wave height.

## Phases

### Phase 0 — Scaffolding
- Create `app/shmo-review/page.tsx` (server component shell, `<main>` with no sections yet).
- Create `app/shmo-review/shmo-review.css` with the page-scoped wave override block from `review.css:15-24`.
- Create `components/shmo-review/` folder (empty until Phase 1).
- Add `/shmo-review` active state to `components/Nav.tsx` (status badge: "Live" clover; other 3 sub-brands stay "Soon" honey).
- **Verify:** route loads at `localhost:3000/shmo-review`, blank `<main>`, nav highlights "Shmo Review", no console errors.
- **Commit:** `feat(shmo-review): scaffold route + nav active state`

### Phase 1 — ReviewHero (marsh)
- Port `ReviewHero` from `review-parts.jsx:11-65` → `components/shmo-review/Hero.tsx`.
- **Decision:** placeholder image slot (use `Placeholder` pattern) since reference uses `image-slot.js`.
- **Verify:** hero renders at top, type cycle works if present, CTA pill renders, mascot at sticker scale, no layout shift.
- **Commit:** `feat(shmo-review): hero section`

### Phase 2 — ReviewBulletStrip (graham)
- Port from `review-parts.jsx:66-90` → `components/shmo-review/BulletStrip.tsx`.
- **Verify:** strip sits below hero with wave divider into graham, bullets aligned, no scroll-x.
- **Commit:** `feat(shmo-review): bullet strip`

### Phase 3 — ReviewBuybox (marsh) — placeholder product data
- Port from `review-buybox.jsx` → `components/shmo-review/Buybox.tsx` + child components (gallery, pack picker, qty stepper, checklist, callout).
- **Hardcode product data inline** (name, packs, prices, SKUs). Mark with `// TODO(shopify):` comments at every hardcode point so a future grep finds every swap site.
- Use `.shm-buybox-sticky` for the slide-down sticky bar — never recreate.
- Wire to existing cart from `components/cart/` (cart drawer already shipped).
- **Verify:** gallery renders, packs selectable, qty stepper works, "Add to cart" pushes to cart drawer, sticky bar slides down on scroll past hero.
- **Commit:** `feat(shmo-review): buybox with placeholder product data`

### Phase 4 — FormatPicker (marsh)
- Port from `review-parts.jsx:91-244` → `components/shmo-review/FormatPicker.tsx`.
- Compose `.shm-card` primitives (per prior C1 audit fix on 2026-05-11).
- **Verify:** three formats render (CR-80, L-Sign, Square Card), tone variants apply, "most-popular" badge on CR-80.
- **Commit:** `feat(shmo-review): format picker`

### Phase 5 — HowItWorks (marsh)
- Port from `review-parts.jsx:245-297` → `components/shmo-review/HowItWorks.tsx`.
- **Verify:** numbered steps, hand-drawn icons, no Lucide/heroicons leaked in.
- **Commit:** `feat(shmo-review): how it works`

### Phase 6 — StandoutMoments (marsh)
- Port from `review-parts.jsx:298-348` → `components/shmo-review/StandoutMoments.tsx`.
- Compose `.shm-card` primitives (per prior audit).
- **Verify:** moments grid, tone variants, no shadow design-system violations.
- **Commit:** `feat(shmo-review): standout moments`

### Phase 7 — NumbersWall (marsh)
- Port from `review-parts.jsx:349-386` → `components/shmo-review/NumbersWall.tsx`.
- Note the reference uses `ref={wallRef}` — port the counter-on-scroll logic if present (or static numbers first).
- **Verify:** numbers render, scroll-in animation works if ported.
- **Commit:** `feat(shmo-review): numbers wall`

### Phase 8 — Objections (cocoa)
- Port from `review-parts.jsx:387-413` → `components/shmo-review/Objections.tsx`.
- **Cocoa section** — verify text auto-flips to marshmallow ink, ember accents auto-flip to honey.
- **Verify:** dark-section text-flip working (this is exactly what the `shm-` prefix protects).
- **Commit:** `feat(shmo-review): objections section`

### Phase 9 — ShipReturns (graham)
- Port from `review-parts.jsx:414-462` → `components/shmo-review/ShipReturns.tsx`.
- **Verify:** shipping + returns info, no exclamation marks, no emoji decoration.
- **Commit:** `feat(shmo-review): ship & returns`

### Phase 10 — ReviewFaq (marsh)
- Port from `review-parts.jsx:463-500` → `components/shmo-review/Faq.tsx`.
- Use `.shm-faq-list` (soft default), not `--featured-card` unless the reference does.
- **Verify:** FAQ list expands/collapses, soft hairline default look.
- **Commit:** `feat(shmo-review): faq`

### Phase 11 — FinalCta (ember)
- Port from `review-parts.jsx:501+` → `components/shmo-review/FinalCta.tsx`.
- **Ember section** — high-emphasis closing CTA.
- **Verify:** CTA prominent, one button max, links to `#buybox`.
- **Commit:** `feat(shmo-review): final cta`

## Cart drawer & footer

Already shipped. No work here unless a section reveals a gap.

## Future phase (out of scope)

- **Shopify wiring:** grep all `// TODO(shopify):` from Phase 3 and swap to Storefront API via `shmocard-shopify-work` wrapper dispatch. Separate phase. Separate review.

## Verification checklist (every phase)

- [ ] `npm run dev` running, `/shmo-review` returns 200
- [ ] Screenshot saved to `pictures/screenshots/shmo-review-<n>-<name>.png`
- [ ] No console errors / warnings
- [ ] Mobile width (375px) still works
- [ ] No primitive restyles introduced (`.shm-*` smell-test passes)
- [ ] Wave divider sits between sections (no 40px gap above wave)
- [ ] Adjacent sections still render correctly
