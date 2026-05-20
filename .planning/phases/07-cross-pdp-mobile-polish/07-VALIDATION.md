---
phase: 7
slug: cross-pdp-mobile-polish
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-05-20
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for Cross-PDP mobile polish.

Phase 7 ships 2 shared-component edits (Buybox h3→h2, HowItWorks step 01 copy) + cross-PDP mobile audit at 3 breakpoints × 3 PDPs + a11y final check. No new components. No new tests. Verification = type-check + visual diff + Playwright screenshots + manual a11y proof.

The highest-risk gate: **shared-component edits propagate to all 3 PDPs**. PRE/POST visual diff on at least one PDP per shared edit gates Phase 7 — any drift on the edits is a blocker.

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
- **After 07-01 + 07-02 (shared-component edits):** PRE/POST visual diff at desktop + mobile on the representative PDP. Zero drift = green.
- **After 07-03 (audit):** Document findings; trigger 07-04 polish only if drift found.
- **Before phase close (07-06):** `tsc` + `build` clean; full-site smoke on all 3 PDPs at all 3 breakpoints; no console errors.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Test Type | Automated Command | Status |
|---------|------|------|-------------|------------|-----------|-------------------|--------|
| 07-01-01 | 01 | 1 | PH7-BUYBOX-H2, PH7-NO-REGRESSION | refactor regression | type-check + visual diff | `tsc` + PRE/POST screenshots | ⬜ pending |
| 07-02-01 | 02 | 2 | PH7-HOWITWORKS-COPY, PH7-NO-REGRESSION | refactor regression | type-check + visual diff | `tsc` + PRE/POST screenshots | ⬜ pending |
| 07-03-01 | 03 | 3 | PH7-MOBILE-AUDIT | clipping/overflow | manual + Playwright | 9 screenshots × 3 PDPs × 3 widths | ⬜ pending |
| 07-04-01 | 04 | 4 | PH7-NO-REGRESSION | polish regression | type-check + visual diff | `tsc` + before/after | ⬜ pending (conditional, skippable) |
| 07-05-01 | 05 | 5 | PH7-A11Y-FINAL | a11y compliance | manual | keyboard tab + screen-reader heading outline + contrast | ⬜ pending |
| 07-06-01 | 06 | 6 | PH7-BUILD, phase-exit | all | type-check + build + smoke | `tsc` + `build` + browser × 3 PDPs | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

None — no test framework to install. Existing tooling covers all phase verification.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Buybox product title renders as `<h2>` | PH7-BUYBOX-H2 | DOM-level structural check | Visit any PDP, inspect Buybox title — confirm `<h2>` tag |
| HowItWorks step 01 reads as format-agnostic | PH7-HOWITWORKS-COPY | Editorial judgment | Eyeball on all 3 PDPs — copy makes sense for wallet card, counter standee, and adhesive disc |
| Shared-component edits propagate identically to all 3 PDPs | PH7-NO-REGRESSION | Visual diff | PRE/POST screenshots on representative PDP; spot-check other 2 PDPs |
| All 3 PDPs clean at 375/414/768 px | PH7-MOBILE-AUDIT | Layout responsive | 9 full-page Playwright screenshots; no horizontal scrollbars |
| FormatCompare consistency across 3 PDPs | PH7-MOBILE-AUDIT | Visual consistency | Spot-check FormatCompare section at 375 px on all 3 PDPs |
| Keyboard tab order is sensible on all 3 PDPs | PH7-A11Y-FINAL | Interaction-driven | DevTools keyboard navigation walk-through |
| Heading outline reads correctly (h2 first, then subsections) | PH7-A11Y-FINAL | Screen-reader logic | Accessibility tree inspection in DevTools |
| Color contrast meets WCAG AA | PH7-A11Y-FINAL | Runtime visual | DevTools contrast check on cocoa/cream/ember tokens |
| No console errors on any PDP at any breakpoint | phase-exit | Runtime-only | DevTools console at 07-03 + 07-06 |

---

## Validation Sign-Off

- [x] All tasks have either `<automated>` verify (`tsc`/`build`) OR documented manual verification
- [x] Sampling continuity: no 3 consecutive tasks without `tsc` verify
- [x] Wave 0 covers all MISSING references (none)
- [x] No watch-mode flags
- [x] Feedback latency < 60s
- [x] **Shared-component regression gated:** 07-01 + 07-02 PRE/POST diffs block Phase 7 if any visual drift
- [x] `nyquist_compliant: true` — strategy is "type-check + visual proof + a11y manual" because Phase 7 is polish, not testable business logic

**Approval:** approved 2026-05-20 — manual-only + visual-diff strategy fits the cross-PDP polish + a11y pass shape.
