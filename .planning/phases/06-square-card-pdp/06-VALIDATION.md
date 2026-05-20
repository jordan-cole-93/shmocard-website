---
phase: 6
slug: square-card-pdp
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-05-20
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for Square Card PDP + FormatCompare execution.

Phase 6 ships 1 new component (`<FormatCompare>`) + 1 new full PDP route (`/shmo-review/square-card`) + 2 back-port mounts (CR-80 + L-Sign each get one import + one JSX node). The codebase has no test framework (confirmed across Phases 4 + 5 VALIDATION.md files — no `vitest`, `jest`, `playwright.config.*`). Verification is **type-checker + visual diff + Playwright screenshots + browser-rendered proof** per `.claude/rules/verification.md`.

The highest-risk gates in Phase 6:
1. **FormatCompare design lock** — 06-02 mounts it on CR-80 for Jordan checkpoint; if approved, no re-design risk on subsequent mounts.
2. **CR-80 + L-Sign back-port regression** — must NOT push existing content around. PRE/POST screenshot diffs at 06-02 and 06-04 gate this.

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
- **After FormatCompare back-port (06-02 + 06-04):** PRE/POST visual diff at desktop (1280) + mobile (375) for the back-ported PDP. Section added cleanly between HowItWorks and VideoTestimonials = green; any other layout drift = block.
- **After every plan wave:** `npx tsc --noEmit && npm run build`. Clean = green.
- **Before phase close (06-08):** `tsc` + `build` clean; full-site smoke on all 12 routes; no console errors; FormatCompare visible at the same position on all 3 PDPs.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 1 | PH6-FORMAT-COMPARE | T-06-04 | All hrefs static literals | type-check + browser | `tsc` + render in isolation | ✅ existing | ⬜ pending |
| 06-02-01 | 02 | 1 | PH6-BACKPORT-CR80, PH6-NO-REGRESSION | T-06-05 | Single import + single JSX node only | git diff exact-count + visual diff | `git diff --stat` + PRE/POST screenshots | ✅ existing | ⬜ pending |
| 06-03-01 | 03 | 2 | PH6-SQUARE-ROUTE, PH6-BUYBOX-PROPS, PH6-FORMAT-COMPARE | T-06-01, T-06-02, T-06-03 | `plate/transparent/` image paths + TODO(shopify) markers | type-check + browser | `tsc` + render at `/shmo-review/square-card` | ✅ existing | ⬜ pending |
| 06-04-01 | 04 | 2 | PH6-BACKPORT-LSIGN, PH6-NO-REGRESSION | T-06-05 | Single import + single JSX node only | git diff exact-count + visual diff | `git diff --stat` + PRE/POST screenshots | ✅ existing | ⬜ pending |
| 06-05-01 | 05 | 2 | PH6-FORMAT-COMPARE | — | Jordan visual approval across 3 PDPs | manual | browser review × 3 routes × 2 viewports | ✅ existing | ⬜ pending |
| 06-06-01 | 06 | 3 | PH6-FORMAT-COMPARE | — | Conditional polish; LAYOUT IS LOCKED | type-check + visual | `tsc` + before/after | ✅ existing | ⬜ pending (conditional) |
| 06-07-01 | 07 | 3 | PH6-MOBILE | — | No clipping/overflow at 375/414/768 | manual + Playwright | screenshots × 3 widths × Square Card + spot-check 2 back-ports | ✅ existing | ⬜ pending |
| 06-08-01 | 08 | 4 | PH6-BUILD, phase-exit | all | All routes render clean; FormatCompare on all 3 PDPs | type-check + build + browser | `tsc` + `build` + full-site smoke | ✅ existing | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

None — no test framework to install. Existing tooling (`tsc`, `next build`, Playwright via MCP) covers all phase verification.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| FormatCompare renders 3 format cards (CR-80, L-Sign, Square) | PH6-FORMAT-COMPARE | Visual composition cannot be unit-tested | 06-01 standalone render + 06-02 first-mount review |
| Active format shows "You're here" ghost CTA (others link out) | PH6-FORMAT-COMPARE | Conditional UI is visual + interactive | 06-05 cross-page checkpoint: confirm each PDP highlights its own card |
| FormatCompare mounted between HowItWorks and VideoTestimonials | PH6-FORMAT-COMPARE | Structural placement check | 06-05 checkpoint + 06-08 close-out smoke |
| CR-80 + L-Sign render with no layout drift after back-port | PH6-NO-REGRESSION | Visual regression cannot be unit-tested | 06-02 + 06-04 PRE/POST diff at desktop + mobile |
| `/shmo-review/square-card` shows full PDP (not Coming Soon stub) | PH6-SQUARE-ROUTE | Route replacement check | 06-08 smoke test |
| Mobile breakpoints (375/414/768) clean on Square Card | PH6-MOBILE | Layout responsive behavior | 06-07 Playwright screenshots × 3 widths |
| FormatCompare clean on mobile across all 3 PDPs | PH6-MOBILE | Same | 06-07 spot-check 2 back-ports at 375px |
| All hrefs from new component resolve | PH6-FORMAT-COMPARE | Runtime navigation | 06-05 click-through + 06-08 smoke |
| No console errors on Square Card PDP | phase-exit | Runtime-only | DevTools at 06-03, 06-05, 06-07, 06-08 |
| All Square Card product data uses `TODO(shopify):` markers | T-06-01 | Static analysis | `grep -n "TODO(shopify):" app/shmo-review/square-card/page.tsx` returns expected count |
| Square Card image paths use `plate/transparent/` (NOT `square-card/`) | T-06-03 | Path verification | `grep -n "square-card/" app/shmo-review/square-card/page.tsx` returns ZERO matches |

---

## Validation Sign-Off

- [x] All tasks have either `<automated>` verify (`tsc`/`build`) OR documented manual verification
- [x] Sampling continuity: no 3 consecutive tasks without `tsc` verify
- [x] Wave 0 covers all MISSING references (none — no framework to install)
- [x] No watch-mode flags
- [x] Feedback latency < 60s (`build` is ~40s)
- [x] **Back-port regression gated:** 06-02 + 06-04 PRE/POST visual diff blocks Phase 6 if FormatCompare insertion causes ANY drift on existing CR-80 or L-Sign PDP layout
- [x] **Image path enforcement:** explicit grep gate that `square-card/` path does NOT appear (must be `plate/transparent/`)
- [x] `nyquist_compliant: true` — strategy is "type-check + visual proof + back-port regression diff" because the project has no test framework and Phase 6 is UI composition + back-port with no testable business logic

**Approval:** approved 2026-05-20 — manual-only + visual-diff strategy fits the Square Card PDP + FormatCompare composition + back-port pattern.
