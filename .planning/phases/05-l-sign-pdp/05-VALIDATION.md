---
phase: 5
slug: l-sign-pdp
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-05-20
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for L-Sign PDP execution.

Phase 5 refactors `<Buybox>` to take product props (with CR-80 defaults), ships `/shmo-review/l-sign` PDP composing reused Phase 3 sections, and runs a mobile + a11y pass. The codebase has no test framework (no `vitest`, `jest`, `playwright.config.*` — confirmed absent in Phase 4 VALIDATION.md). Verification is **type-checker + visual diff + Playwright screenshots + browser-rendered proof** per `.claude/rules/verification.md`.

The highest-risk gate in Phase 5 is the **Buybox backward-compat refactor** — `/shmo-review` family page AND `/shmo-review/cr-80` PDP must render pixel-equivalent before and after the refactor. Plan 05-01 captures PRE baselines; 05-02 captures POST and diffs.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — type-check + visual diff + browser proof |
| **Config file** | none |
| **Quick run command** | `npx tsc --noEmit` |
| **Full suite command** | `npx tsc --noEmit && npm run build` |
| **Estimated runtime** | ~15 seconds (`tsc`), ~40 seconds (`build`) |

---

## Sampling Rate

- **After every task commit:** `npx tsc --noEmit`. Clean = green.
- **After every plan wave:** `npx tsc --noEmit && npm run build`. Clean = green.
- **After Buybox refactor (05-02):** Visual diff PRE/POST screenshots of `/shmo-review` AND `/shmo-review/cr-80` at desktop (1280px) + mobile (375px). ZERO drift = green; any visible drift blocks.
- **Before phase close (05-07):** `tsc` + `build` clean; full-site smoke test on all 12 routes; no console errors.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | PH5-BUYBOX-REGRESSION | T-05-01 | PRE baselines captured | manual + Playwright | screenshot capture at 2 routes × 2 viewports | ✅ existing | ⬜ pending |
| 05-02-01 | 02 | 1 | PH5-BUYBOX-PROPS | T-05-01 | Refactor preserves all existing JSX & class names | type-check + visual diff | `npx tsc --noEmit` + PRE/POST diff | ✅ existing | ⬜ pending |
| 05-02-02 | 02 | 1 | PH5-BUYBOX-REGRESSION | T-05-01 | Zero visual drift on family page + CR-80 PDP | visual diff | Playwright diff | ✅ existing | ⬜ pending |
| 05-03-01 | 03 | 2 | PH5-LSIGN-ROUTE | T-05-02, T-05-03 | All product data behind `TODO(shopify):` markers; img src paths verified | type-check + browser | `tsc` + render at `/shmo-review/l-sign` | ✅ existing | ⬜ pending |
| 05-04-01 | 04 | 3 | PH5-LSIGN-CHECKPOINT | — | Jordan approves L-Sign composition | manual | browser review at desktop + mobile | ✅ existing | ⬜ pending |
| 05-05-01 | 05 | 3 | PH5-LSIGN-POLISH | — | LAYOUT IS LOCKED on any polish | type-check + visual | `tsc` + before/after screenshot | ✅ existing | ⬜ pending (conditional, skippable) |
| 05-06-01 | 06 | 4 | PH5-MOBILE-A11Y | — | No clipping, overflow, or wave gaps at 375/414/768 | manual + Playwright | screenshots × 3 widths | ✅ existing | ⬜ pending |
| 05-07-01 | 07 | 4 | phase-exit | all | All routes render clean | type-check + build + browser | `tsc` + `build` + full-site smoke | ✅ existing | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

None — no test framework to install. Existing tooling (`tsc`, `next build`, Playwright via MCP) covers all phase verification.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Buybox renders identically pre/post refactor on `/shmo-review` | PH5-BUYBOX-REGRESSION | Visual regression cannot be unit-tested | 05-01 captures PRE; 05-02 captures POST; diff at desktop + mobile |
| Buybox renders identically pre/post refactor on `/shmo-review/cr-80` | PH5-BUYBOX-REGRESSION | Same | Same as above |
| `<ComingSoon>` stub at `/shmo-review/l-sign` is fully replaced by PDP | PH5-LSIGN-ROUTE | Route replacement check | Visit `/shmo-review/l-sign` — confirm no ComingSoon component visible, Buybox + below-the-fold sections render |
| L-Sign PDP visual composition matches Phase 3 CR-80 shape | PH5-LSIGN-CHECKPOINT | Visual design parity | 05-04 Jordan checkpoint at desktop + mobile |
| Mobile breakpoints (375/414/768) clean | PH5-MOBILE-A11Y | Layout responsive behavior | 05-06 Playwright screenshots × 3 widths |
| All hrefs from L-Sign PDP resolve (Buybox CTA, FAQ links, etc.) | phase-exit | Runtime navigation | 05-07 full-site smoke test |
| No console errors on `/shmo-review/l-sign` | phase-exit | Runtime-only | Browser DevTools check at 05-04, 05-06, 05-07 |
| All product data uses `TODO(shopify):` markers | T-05-02 | Static analysis catches via grep | `grep -n "TODO(shopify):" app/shmo-review/l-sign/page.tsx` returns expected count |

---

## Validation Sign-Off

- [x] All tasks have either `<automated>` verify (`tsc`/`build`) OR documented manual verification in the table above
- [x] Sampling continuity: no 3 consecutive tasks without `tsc` verify
- [x] Wave 0 covers all MISSING references (none — no framework to install)
- [x] No watch-mode flags (`tsc --noEmit` is one-shot)
- [x] Feedback latency < 60s (`build` is ~40s)
- [x] **High-risk refactor gated:** 05-01 → 05-02 visual diff blocks Phase 5 if Buybox refactor introduces ANY visual drift on the two existing callers
- [x] `nyquist_compliant: true` set in frontmatter — strategy is "type-check + visual proof" because the project has no test framework and Phase 5 is UI + props refactor with no testable business logic

**Approval:** approved 2026-05-20 — manual-only + visual-diff strategy fits a UI-refactor + PDP-build phase.
