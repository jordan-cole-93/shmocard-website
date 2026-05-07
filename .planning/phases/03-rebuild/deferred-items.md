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

---

## DI-03 — Parallel-agent commit collision during Wave-2 execution (03-04 + 03-11 + 03-12)

**Surfaced during:** 03-04 Task 1 commit (2026-05-07 ~05:38 UTC+2)
**Issue:** While 03-04 was being executed, at least one other plan was running in parallel and writing files (`lib/shopify/*`, `app/api/revalidate/route.ts`, `pictures/screenshots/03-11-*.png`, `context/general/backend.md`). Result: two commits landed with **mismatched messages and content**:
  - `27cb2d5` `feat(03-04): add /shmo-review category sub-components + content data` — actually contains `lib/shopify/*` + `backend.md` (03-12 content)
  - `ce7c52d` `feat(03-12): shopifyFetch wrapper + Storefront queries + types` — actually contains the 03-04 `components/category/*` files + 03-11 revalidate route + 03-11 screenshots
**Impact:** Per-plan reverts via `git revert` are now non-surgical. Both plans' content is on `main` and works; only the per-commit attribution is wrong. No runtime bug. CI / build is green.
**Recommended fix:** Cosmetic. Either accept the misattribution and document in each plan's SUMMARY, or rewrite messages via interactive rebase once Phase 3 closes. Do NOT attempt history rewrites mid-Phase 3 — risks losing parallel-agent work.
**Owner:** GSD orchestrator — wave-spawned executors share a working tree. Auto mode + parallel waves should either serialize commits or run each agent in its own worktree.
**Severity:** cosmetic (commit history mismatch only; on-disk content is correct)

---

## DI-04 — Product asset filenames not yet renamed to friendly slugs

**Surfaced during:** 03-03 Task 2 (browser verify, hero CR-80 art 404)
**Issue:** Phase 3 plan 03-03 referenced `/products/cr80/transparent/cr80-trio.png` (the slug used in the design-system reference `home-data.jsx`). Actual files in `public/products/cr80/transparent/` are sourced from generation tools and named `magnific_2884306972.png` etc. — five PNGs, no friendly slugs. Same pattern in `cr80/carrousel/` (mix of `CR80 - Google - N.jpg` + `magnific_*.jpg` + `freepik_*.jpg`) and `plate/` and `l-sign/`.
**Workaround in 03-03:** hero tile + Review spotlight chip both point at `magnific_2884306972.png` directly. Works, but the path leaks generator filenames into the rendered DOM.
**Recommended fix:** Rename / consolidate to canonical slugs (`cr80-trio.png`, `cr80-fan.png`, `lsign-counter.png`, `plate-disc.png`) in a future asset-cleanup plan. Touch the 5 occurrences across `home-data.ts`, `Hero.tsx`, and any PDP/category components landing in 03-04 + 03-05+.
**Owner:** Phase 3 asset cleanup (defer until all PDPs are wired so we know which images to keep) or a Phase 4 asset-pass.
**Severity:** cosmetic (URLs leak generator filenames; no functional bug)
