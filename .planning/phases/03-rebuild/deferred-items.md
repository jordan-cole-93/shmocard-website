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

---

## DI-05 — `.shm-meta` not flipped for dark-section text contrast

**Surfaced during:** 03-04 Task 2 (browser verify, proof section on `.shm-bg-cocoa`)
**Issue:** `colors_and_type.css` flips `.shm-display`, `.shm-h1/2/3`, `.shm-lede`, `.shm-body`, `.shm-eyebrow`, hairlines, and `em` color on `.shm-bg-{ember|cherry|chocolate|cocoa}` — but NOT `.shm-meta`. `.shm-meta` stays at `var(--color-muted) = #8A6E5A`, which renders dark-on-cocoa with poor contrast. Owner names in the Shmo Review proof block were nearly invisible until I added a local override.
**Workaround in 03-04:** Added a 2-rule layout-file exception in `components/category/category.css` flipping `.shm-meta` to `rgba(255, 251, 241, 0.66)` inside `.shm-bg-cocoa .cat-proof__*`. Token-based (no hex). Tagged as a design-system gap.
**Recommended fix:** Add `.shm-bg-{ember|cherry|chocolate|cocoa} .shm-meta { color: rgba(255, 251, 241, 0.66) }` (or equivalent translucent marshmallow) to the dark-section rules block in `colors_and_type.css`. After that lands, remove the local override in `category.css`.
**Owner:** Design system pass.
**Severity:** a11y (low contrast on dark sections — readable but well below WCAG)

---

## DI-06 — `app/cart-smoke/` smoke harness route is a temporary 03-08 artifact

**Surfaced during:** 03-08 Task 2 (browser verify)
**Issue:** Plan 03-08 needed an end-to-end cart-add demonstration BEFORE plan 03-05 (CR-80 PDP) had wired the canonical `/shmo-review/[handle]` page (the two ran in parallel as Wave 3 siblings per the plan-checker output). Built `app/cart-smoke/page.tsx` + `app/cart-smoke/SmokeAddButton.tsx` to fetch two real products by handle and exercise `addLineToCart` against the live Storefront cart. All cart-flow screenshots + reload-hydration verification ran against this route.
**Recommended cleanup:** Once 03-05 ships and the canonical PDP add-to-cart works, delete `app/cart-smoke/` (both files). Cart drawer is unaffected — it mounts globally and is independent of the smoke route.
**Owner:** Whichever Wave-3 plan finishes second can delete the directory in its closing commit; or open a tiny standalone cleanup plan once 03-05 lands.
**Severity:** cosmetic (extra route shipped to production; harmless but uses one Storefront roundtrip on first hit)

---

## DI-07 — Verification scripts checked in at repo root

**Surfaced during:** 03-08 Task 2
**Issue:** Wrote `cart-flow-verify.mjs` + `cart-debug.mjs` + `cart-debug2.mjs` + `cart-debug3.mjs` at repo root for Playwright-driven cart-flow verification. They're not auto-loaded by `next build` (Next ignores `.mjs` files outside `app/` / `pages/`) but they pollute the repo root.
**Recommended cleanup:** Either move into a `tests/` or `scripts/` subdirectory (would require `file-organization.md` approval per project rules) OR delete after 03-08 lands. The screenshots in `pictures/screenshots/` are the lasting verification artifact; the scripts were one-shot.
**Owner:** Phase 4 test infrastructure pass — Phase 3 explicitly defers tests; if/when test scaffolding lands, fold the cart smoke flow into it as a real Playwright e2e spec.
**Severity:** cosmetic

