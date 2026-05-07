# Phase 3 — Deferred Items

Issues surfaced during plan execution that are out of scope for the current plan.
Each entry: source plan, discovery, recommended owner.

---

## DI-01 — `@import url(...)` in `context/design-system/colors_and_type.css` violates CSS @import-first rule

**Surfaced during:** 03-01 audit (Task 2 — `npm run build`)
**Impact:** Non-fatal build warning. Bundled `@font-face` declarations on lines 21-65 win at runtime so brand fonts render correctly (verified via screenshot). The Google Fonts `@import` on line 76 is purely a fallback that the bundler ignores.
**Recommended fix:** Move the `@import url("https://fonts.googleapis.com/...")` line above the `@font-face` blocks (or remove it entirely — the bundled fonts cover all four families).
**Owner:** Design system (not Phase 3 wiring). File this against `context/design-system/` whenever the design-system review reopens. Editing source-of-truth CSS during a Phase 3 audit-only plan is out of scope.
**Severity:** cosmetic (build warning only)

---

## DI-02 — `--font-sans` token name documented in 03-01 must-haves does not match design system source

**Surfaced during:** 03-01 audit (Task 2 — token verification)
**Issue:** Plan 03-01 frontmatter `must_haves.truths` references `var(--font-body)` and `var(--color-graham)`. The design system source defines these as `--font-sans` (Inter Tight) and `--color-graham-soft` / `--color-graham-gold` respectively. There is no `--font-body` or bare `--color-graham` token.
**Impact:** Audit verification needed adjusted token names. The wiring is correct — the must-have was authored against incorrect token labels.
**Recommended fix:** When 03-03+ stages reference Inter Tight, use `var(--font-sans)`. When referencing the graham palette, use `var(--color-graham-soft)` (default surface) or `var(--color-graham-gold)` (badge accent).
**Owner:** Plan-checker / planner — update downstream Phase 3 plan must-haves if they inherit the same names.
**Severity:** documentation drift only (no runtime bug)
