---
phase: 04-link-hygiene-coming-soon-stubs
phase_number: 4
phase_name: Link hygiene & Coming Soon stubs
status: complete
completed: "2026-05-20"
---

# Phase 4 — Link hygiene & Coming Soon stubs — SUMMARY

## What shipped

1. **Shared `<ComingSoon>` component** at `components/ComingSoon.tsx` — pure server component composing `.shm-section`, `.shm-section-head`, `.shm-eyebrow`, `.shm-h1`, `.shm-lede`, mascot (140px sticker), and a visible-but-disabled email-capture form. Form-card constrained to ~520px centered on desktop, full-width on mobile.

2. **5 Coming Soon stub routes**, each a ~12-line server component composing `<ComingSoon>` with sub-brand props + a different mascot pose (D-03):
   - `/shmo-biz` — Shmo Biz, holding-card mascot, "Business profile tools for your crew."
   - `/shmo-link` — Shmo Link, heart-hands mascot, "Smart NFC links for anywhere you work."
   - `/shmo-reputation` — Shmo Reputation, megaphone mascot, "Your reviews. Your dashboard."
   - `/shmo-review/l-sign` — Shmo Review · L-Sign, pointing mascot, "Counter standee. Tap, scan, done."
   - `/shmo-review/square-card` — Shmo Review · Square Card, thumbs-up mascot, "Sticks to anything. Stays everywhere."

3. **11 hrefs upgraded** across 3 files (10 planned + 1 follow-up):
   - `components/NavMenu.tsx` — 3 sub-brand hrefs: `#shmo-biz` → `/shmo-biz`, `#shmo-link` → `/shmo-link`, `#shmo-reputation` → `/shmo-reputation`. All upgraded to `<Link>` (NavMenu is `"use client"` — safe).
   - `components/Footer.tsx` — 5 hrefs: same 3 sub-brand routes + L-Sign + Square Card. All Footer internal-route `<a>` upgraded to `<Link>` with single `import Link from "next/link"`.
   - `components/shmo-review/FormatPicker.tsx` — 2 `PRODUCT_PAGE_HREFS` entries: L-Sign + Square Card upgraded from `#formats` to real PDP routes.
   - **Follow-up:** Footer "CR-80 Card" link updated from `/shmo-review#buybox` → `/shmo-review/cr-80` (dedicated PDP).

## Inline polish iterations

- **04-01 bug fix:** ComingSoon mascot was rendering at full page width because the original component dispatch wrote `className="shm-mascot--supporting"` without the required base `.shm-mascot` class. Builder follow-up dispatch added the base class. Mascot now respects the 140px sticker cap per `components.css:354-360`.
- **04-02 polish:** Per Jordan's review, mascot reordered to sit BETWEEN section-head and email-capture field (was below the field). Form-card constrained to ~520px max-width centered on desktop via inline `maxWidth` wrapper (no new CSS class — page-level layout). Form stays full-width on mobile naturally.

## Locked decisions honored

- **D-01** Email-capture stub: visible-but-disabled with helper text "We'll email you when this launches." ✓
- **D-02** No UI-SPEC.md generated — composed directly from RESEARCH.md primitives ✓
- **D-03** Existing generic mascot poses (5 different ones across 5 routes) ✓
- **D-04** Single shared `<ComingSoon>` component with props (not 5 forked components) ✓

## Atomic plans status

| Plan | Status | Notes |
|---|---|---|
| 04-01 — Build ComingSoon + /shmo-biz stub | ✅ | Shipped `db1b14e`. One inline mascot-class fix during 04-02 review. |
| 04-02 — Composition checkpoint | ✅ | Jordan approved 2026-05-20 after polish (mascot reorder + form max-width). |
| 04-03 — Stub 4 remaining routes | ✅ | Shipped `d4fba9f`. All 4 routes verified rendering. |
| 04-04 — Link audit, upgrade 10 hrefs | ✅ | Shipped `d75aab4`. Anchor stubs eliminated. |
| 04-04-follow-up — CR-80 Card → PDP | ✅ | Shipped `ecb2e08`. Footer "CR-80 Card" → `/shmo-review/cr-80`. |
| 04-05 — Mobile nav + footer click-through | ⏭ | Skipped per Jordan's call (DOM eval + tsc + build clean already proved hrefs correct). |
| 04-06 — Phase close-out | ✅ | This commit. tsc + build clean; STATE.md + handoff.md + ROADMAP.md updated. |

## Deferred (out of scope per RESEARCH.md Q4)

These intentionally stay as `#` for now and will be addressed in their own phases:

- Footer social icon hrefs (Instagram, Facebook, YouTube) — deferred until social presence exists.
- `#how` anchor link — real anchor target on `/shmo-review`, not a stub.
- Footer policy stubs: Shipping & returns, Contact support, Privacy, Terms, How it works — deferred until policy pages exist (likely Phase 8 or 10).

## Build verification

- `npx tsc --noEmit` — clean ✓
- `npm run build` — clean, all 12 routes statically generated ✓
- 5 new Coming Soon routes each weigh 138 B (shared shell), confirming the pattern is lean ✓
- No console errors on any route load (verified via DOM eval on `/`) ✓

## What's next

**Phase 5 — L-Sign PDP.** Build `/shmo-review/l-sign` PDP using patterns established in Phase 3 (CR-80). Will replace the Phase 4 Coming Soon stub at that route. Run `/gsd-plan-phase 5` to kick off.
