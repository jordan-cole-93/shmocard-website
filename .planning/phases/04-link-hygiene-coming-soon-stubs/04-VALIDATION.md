---
phase: 4
slug: link-hygiene-coming-soon-stubs
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-05-20
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

Phase 4 ships 1 component (`ComingSoon.tsx`) + 5 route stubs + 10 href upgrades + 2 verification checkpoints. The codebase has no test framework (verified absent: no `vitest`, `jest`, `playwright.config.*` files; not in `package.json`). All verification is **type-checker + browser-rendered + Playwright-screenshot proof** per `.claude/rules/verification.md` — no unit/integration runner.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — visual + type-check + browser proof |
| **Config file** | none |
| **Quick run command** | `npx tsc --noEmit` |
| **Full suite command** | `npx tsc --noEmit && npm run build` |
| **Estimated runtime** | ~15 seconds (`tsc`), ~40 seconds (`build`) |

---

## Sampling Rate

- **After every task commit:** Run `npx tsc --noEmit`. Clean = green.
- **After every plan wave:** Run `npx tsc --noEmit && npm run build`. Clean = green.
- **Before phase close (04-06):** `tsc` + `build` clean, full-site browser smoke test passes, all Playwright screenshots saved.
- **Max feedback latency:** ~40 seconds (full build).

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | PH4-COMINGSOON-COMPONENT | T-04-01 | `disabled` input prevents XSS injection | type-check | `npx tsc --noEmit` | ✅ existing | ⬜ pending |
| 04-01-02 | 01 | 1 | PH4-COMINGSOON-COMPONENT | T-04-03 | No hardcoded secrets in copy | manual | grep for token/secret patterns in `components/ComingSoon.tsx` | ✅ existing | ⬜ pending |
| 04-02-01 | 02 | 1 | PH4-COMINGSOON-COMPONENT | — | Jordan visual approval | manual | browser render at `/shmo-biz` | ✅ existing | ⬜ pending |
| 04-03-01 | 03 | 2 | PH4-STUB-ROUTES | T-04-04 | mascot src paths resolve | type-check + browser | `npx tsc --noEmit` + browser render | ✅ existing | ⬜ pending |
| 04-04-01 | 04 | 2 | PH4-LINK-AUDIT | T-04-02 | All hrefs are static literals | type-check + grep | `npx tsc --noEmit` + anchor-stub grep | ✅ existing | ⬜ pending |
| 04-05-01 | 05 | 3 | PH4-NAV-VERIFY | — | Hamburger toggles, every link navigates | manual + Playwright | browser click-through at 1280px + 375px | ✅ existing | ⬜ pending |
| 04-06-01 | 06 | 3 | phase-exit | all | All 8 pages render, no console errors | type-check + build + browser | `tsc` + `build` + full-site smoke | ✅ existing | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

None — no test framework to install. Existing tooling (`tsc`, `next build`, Playwright via MCP) covers all phase verification needs.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| ComingSoon component composes only `.shm-*` primitives | PH4-COMINGSOON-COMPONENT | Design-system compliance not enforceable by `tsc` | `design-system-auditor` agent dispatch (read-only) returns PASS |
| Coming Soon page renders correctly at 1280px + 375px | PH4-COMINGSOON-COMPONENT | Visual layout cannot be unit-tested | Playwright screenshot at both widths saved to `pictures/screenshots/` |
| Hamburger nav opens and every link navigates | PH4-NAV-VERIFY | Interactive flow requires a real browser | 04-05 click-through checklist |
| Footer renders + every link navigates | PH4-NAV-VERIFY | Same as above | 04-05 click-through checklist |
| No 404s on any built page | PH4-LINK-AUDIT | Route resolution is runtime-only | 04-06 full-site smoke test |
| No console errors on any page load | all | Console is runtime-only | Browser DevTools check during 04-02, 04-05, 04-06 |

---

## Validation Sign-Off

- [x] All tasks have either `<automated>` verify (`tsc` / `build`) OR documented manual verification in the table above
- [x] Sampling continuity: no 3 consecutive tasks without `tsc` verify (every plan has `tsc` in its verify block)
- [x] Wave 0 covers all MISSING references (none — no framework to install)
- [x] No watch-mode flags (`tsc --noEmit` is one-shot)
- [x] Feedback latency < 60s (`build` is ~40s)
- [x] `nyquist_compliant: true` set in frontmatter — strategy is "type-check + visual proof" because the project has no test framework and Phase 4 is a UI-only phase where automated unit tests would be theatre

**Approval:** approved 2026-05-20 — manual-only strategy fits a 1-component / 5-stub / 10-href phase with no testable business logic.
