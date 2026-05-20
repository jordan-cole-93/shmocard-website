---
phase: 06-square-card-pdp
phase_number: 6
phase_name: Square Card PDP + FormatCompare
status: complete
completed: "2026-05-20"
---

# Phase 6 — Square Card PDP + FormatCompare — SUMMARY

## What shipped

1. **`<FormatCompare>` shared component** at `components/shmo-review/FormatCompare.tsx` — pure server component, takes `currentHandle` prop. Renders 3 format cards (CR-80, L-Sign, Square) using `.shm-product` primitive. Active format shows disabled "You're here" ghost button; others link to their PDP route. No Shopify fetches, no client state, no new CSS. Inline-duplicate copy from FormatPicker (RESOLVED-DEFAULT from RESEARCH.md OQ-2).

2. **`/shmo-review/square-card` full PDP** — replaces Phase 4 Coming Soon stub. Composes `<Buybox>` with Square-Card-specific props (SQUARE_PRODUCT, SQUARE_GALLERY using 5 `plate/transparent/` PNGs, SQUARE_PACKS at 1/2/5/10 tiers, SQUARE_CHECKLIST, SQUARE_FAQ_ROWS — all `TODO(shopify):` markers). Below-the-fold composition mirrors CR-80 + L-Sign exactly with FormatCompare baked in.

3. **FormatCompare mounted on all 3 PDPs** between HowItWorks and VideoTestimonials:
   - CR-80 (06-02): `currentHandle="google-reviews-nfc-tap-card-cr80"` → CR-80 card shows "You're here"
   - L-Sign (06-04): `currentHandle="google-review-nfc-tap-card-l-sign"` → L-Sign card shows "You're here"
   - Square Card (06-03): `currentHandle="google-review-plaque"` → Square Card shows "You're here"

4. **Design-system WCAG fix.** Surfaced during 06-07: `.shm-btn--sm` min-height was 38px, 6px below WCAG AA 44px touch-target minimum. Jordan approved system-wide fix; bumped to 44px in `components.css`. Affects FormatCompare buttons + all other `.shm-btn--sm` usage across project. No visual regression.

## Atomic plans status

| Plan | Status | Notes |
|---|---|---|
| 06-01 — Build FormatCompare standalone | ✅ | Shipped `fd05602`. Pure server, all `.shm-` primitives, no new CSS. |
| 06-02 — Mount on CR-80 + Jordan checkpoint | ✅ | Shipped `72791d8`. Jordan approved design 2026-05-20 at first review. |
| 06-03 — Build Square Card PDP | ✅ | Shipped `a6416eb`. Replaces Coming Soon stub; mirrors L-Sign pattern with FormatCompare baked in. |
| 06-04 — Back-port to L-Sign | ✅ | Shipped `5badba4`. 2-line edit (import + JSX node). All 3 PDPs carry FormatCompare in same locked position. |
| 06-05 — Cross-page checkpoint | ✅ | Jordan approved all 3 PDPs 2026-05-20 ("approve, skip polish, run mobile pass"). |
| 06-06 — Conditional polish | ⏭ Skipped | Not triggered — 06-05 approved without polish. |
| 06-07 — Mobile + a11y pass | ✅ | Shipped `f08cf7c` (notes + screenshots) + `7d34c18` (WCAG touch-target fix). No clipping anywhere; 1 system-wide issue surfaced + fixed. |
| 06-08 — Phase close-out | ✅ | This commit. tsc + build clean; ROADMAP/STATE/handoff updated. |

## Locked decisions honored

- **CR-80 buybox model preserved** ✓ — Square Card uses same 1/2/5/10 pack structure, `TODO(shopify):` placeholder prices.
- **Pattern reuse over fork** ✓ — zero new structural components in Square Card PDP; reuses all Phase 3 below-the-fold sections.
- **FormatCompare = NEW dedicated component** ✓ — not a FormatPicker extension. Pure static copy, no Shopify fetches.
- **Placement: between HowItWorks + VideoTestimonials, bg=cream** ✓ — same position on all 3 PDPs.
- **Square Card images at `public/products/plate/transparent/`** ✓ — 5 PNGs verified present before locking imports.
- **Same-phase back-port to CR-80 + L-Sign with LAYOUT IS LOCKED** ✓ — both edits were exactly 2 lines (import + JSX node).
- **No mascot on Square Card PDP** ✓ — matches CR-80 + L-Sign.
- **Buybox off-limits** ✓ — Phase 6 made zero changes to `Buybox.tsx`.

## Build verification

- `npx tsc --noEmit` — clean ✓
- `npm run build` — clean, all 12 routes statically generated ✓
- All 3 PDPs at **196 B** (CR-80 + L-Sign + Square Card all consistent — confirms full PDP composition with FormatCompare on each)
- No console errors at any breakpoint or any of the 3 PDPs

## Deferred / surfaced for later

- **Buybox heading hierarchy a11y** (carried from Phase 5) — product title `h3` while page sections use `h2`. Shared across all 3 PDPs. Not a Phase 6 regression. Defer to dedicated Buybox a11y pass.
- **HowItWorks step 01 copy** (carried from Phase 5) — "Crew hands the card" doesn't perfectly fit L-Sign or Square Card flows. Reused as-is. Flag for Phase 7 editorial pass.
- **DRY extraction of FORMAT_COPY** — currently inline-duplicated in FormatCompare.tsx and FormatPicker.tsx. Acceptable for now (per RESEARCH.md OQ-2 RESOLVED-DEFAULT). Extract to `lib/shmo-review/format-copy.ts` if DRY pressure increases.

## What's next

**Phase 7 — Cross-PDP mobile polish.** Single mobile + a11y pass across all 3 PDPs at 375 / 414 / 768 px. LAYOUT IS LOCKED — spacing / type / mascot only. Catch any Buybox-shared bugs that Phases 5 + 6 surfaced (e.g., the heading-hierarchy a11y note + HowItWorks copy editorial). Run before Shopify wiring so layout fights stay against placeholder data.

Run `/gsd-plan-phase 7` to kick off.
