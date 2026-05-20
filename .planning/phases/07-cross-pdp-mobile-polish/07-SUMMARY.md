---
phase: 07-cross-pdp-mobile-polish
phase_number: 7
phase_name: Cross-PDP mobile polish
status: complete
completed: "2026-05-20"
---

# Phase 7 — Cross-PDP mobile polish — SUMMARY

## What shipped

1. **Buybox product title promoted from `<h3>` to `<h2>`** (07-01). One-line semantic edit in `components/shmo-review/Buybox.tsx`. Propagates to all 3 PDPs via shared component. PRE/POST screenshots confirm zero visual regression (`bb__title` CSS is tag-agnostic). WCAG 1.3.1: continuous heading outline now starts with h2 instead of inverting at h3.

2. **HowItWorks step 01 copy rewritten to be format-agnostic** (07-02). Text-only edit to `REVIEW_HOW_STEPS[0]` in `components/shmo-review/HowItWorks.tsx`. Old "Crew hands the card" only fit CR-80; new copy works for wallet card, counter standee, and adhesive disc:
   - title: "Put the card where customers can reach it"
   - body: "After the transaction — or right at the counter — your NFC card is there. The ask happens at the right moment, when the customer is happy."
   - details: ["Works at checkout", "Self-serve or crew-assisted", "No app needed"]

3. **3 design-system primitive a11y fixes** (07-05 follow-up):
   - **`.shm-qty__btn` touch target** — 32×32 → 44×44 px (WCAG 2.5.8). Bigger +/- buttons on the Buybox quantity stepper for easier mobile tap.
   - **`.shm-badge--ember` text contrast** — marshmallow (white) → cocoa-deep (dark). "Most popular" badge text on 10-pack tier now legible (was 3.0:1, now ~13.6:1).
   - **Ember-only ghost button contrast** — surgical override: removed `.shm-bg-ember` from the compound `.on-dark` selector and added a new ember-specific rule with cocoa-deep text + matching hover. Preserves white text on cocoa/chocolate/cherry. Affects FinalCta "Browse formats" secondary button.

## Atomic plans status

| Plan | Status | Notes |
|---|---|---|
| 07-01 — Buybox h3 → h2 | ✅ | Shipped `632fecf`. PRE/POST byte-identical screenshots — zero visual regression. |
| 07-02 — HowItWorks step 01 copy | ✅ | Shipped `56c0fa2`. Text-only edit, propagates to all 3 PDPs. |
| 07-03 — Cross-PDP mobile audit | ✅ | Shipped `521c87a`. 9 screenshots (3 PDPs × 3 widths) all clean. CR-80 6-thumb wrap, FormatCompare wiring, 07-01 + 07-02 fixes all verified. Final verdict: "no fixes needed — proceed to 07-05". |
| 07-04 — Conditional polish | ⏭ Skipped | 07-03 clean — no polish needed. |
| 07-05 — A11y final check | ✅ | Shipped `4809b39` (notes) + `d1f3ee1` (3 CSS fixes). Surfaced 3 primitive-level a11y issues; Jordan approved all 3 fixes. |
| 07-06 — Phase close-out | ✅ | This commit. tsc + build clean; ROADMAP/STATE/handoff updated. |

## Locked decisions honored

- **Buybox h3→h2 = Option A** (one-line edit, not aria-level wrap) ✓
- **HowItWorks copy = Option A** (format-agnostic rewrite, not prop-driven) ✓
- **LAYOUT IS LOCKED throughout** ✓ — no grid changes, no section reorders, no structural HTML
- **Local-only phase** ✓ — no Shopify writes, no domain touches

## Build verification

- `npx tsc --noEmit` — clean ✓
- `npm run build` — clean, all 12 routes statically generated ✓
- All 3 PDPs still at **196 B** route size (consistent — no structural changes from Phase 7)
- No console errors at any breakpoint

## Deferred / surfaced for later

- **Skip-link in Nav** (07-05 surfaced — option D) — Jordan declined to add now. Lower-priority a11y feature. Add to future a11y phase if needed.
- **Buybox heading hierarchy considered complete** — h2 sits at the top of the document outline on all 3 PDPs.
- **Earlier deferred items now CLOSED:**
  - Phase 5 SUMMARY: Buybox h3 vs h2 → FIXED in 07-01
  - Phase 5 SUMMARY + Phase 6 SUMMARY: HowItWorks step 01 copy editorial → FIXED in 07-02

## What's next

**Phase 8 — Shopify Storefront wiring.** Replace every `TODO(shopify):` placeholder across all 3 PDPs (Buybox product data, gallery, packs, checklist, FAQ) with live Storefront API queries. Wire `cartCreate` / `cartLinesAdd` / cart drawer / checkout redirect. Read-only Admin (no mutations). Add webhook revalidation route (`app/api/revalidate/route.ts`).

This is the largest remaining phase — touches every PDP's data layer. Must invoke `shmocard-shopify-work` skill before dispatching builder per `.claude/rules/subagent-dispatch.md`. Run `/gsd-plan-phase 8` to kick off.
