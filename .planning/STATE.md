---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: launch
status: planning
last_updated: "2026-05-20T07:15:00+02:00"
last_activity: "2026-05-20 — Phase 6 (Square Card PDP + FormatCompare) complete. Shipped new <FormatCompare> shared component mounted on all 3 PDPs (CR-80, L-Sign, Square Card) between HowItWorks and VideoTestimonials. Replaced Phase 4 Square Card Coming Soon stub with full PDP composing Buybox-with-props + reused Phase 3 sections + FormatCompare. System-wide design-system polish: .shm-btn--sm min-height bumped 38px → 44px for WCAG AA touch target. All 3 PDPs at consistent 196 B route size. Next: Phase 7 (Cross-PDP mobile polish)."
progress:
  total_phases: 10
  completed_phases: 7
  total_plans: 8
  completed_plans: 7
  percent: 70
---

# Project State

## Project Reference

See: `.planning/PROJECT.md` and `context/general/scope.md`.

**Core value:** First-time visitor leaves understanding the parent brand and either buys (Shmo Review) or joins a waitlist (other three) — without ever feeling pitched to.

**Current focus:** Phase 7 — Cross-PDP mobile polish. Single mobile + a11y pass across all 3 PDPs (CR-80, L-Sign, Square Card) at 375/414/768 px. LAYOUT IS LOCKED — spacing/type/mascot only. Catch shared-component issues (e.g., Buybox heading hierarchy a11y from Phase 5 SUMMARY, HowItWorks step copy editorial). Run before Shopify wiring so layout fights stay against placeholder data.

## Current Position

Phase: 7 of 10 (Cross-PDP mobile polish — ready for `/gsd-plan-phase 7`)
Status: Phase 6 complete 2026-05-20; planning Phase 7 next
Last activity: 2026-05-20 — Phase 6 close-out

Progress: [███████░░░] 70%

**Completed phases:** 1 (Docs refresh), 2 (Design system review), 3a (Homepage + /shmo-review category), 3 (CR-80 PDP), 4 (Link hygiene & Coming Soon stubs), 5 (L-Sign PDP), 6 (Square Card PDP + FormatCompare).
**Remaining phases:** 7 (Cross-PDP mobile polish), 8 (Shopify Storefront wiring), 9 (Tracking — GHL + FB Pixel), 10 (Launch readiness — DNS cutover).

## Notes

- All 3 PDPs now consistent: same shape (Buybox → Proof → CrewStrip + ProofTiles → HowItWorks → FormatCompare → VideoTestimonials → FinalCta), same route size (196 B), same composition pattern.
- `<Buybox>` accepts product props with CR-80 defaults (Phase 5 refactor) — used explicitly by L-Sign + Square Card; family page `/shmo-review` continues to render with CR-80 defaults.
- `<FormatCompare>` is a new dedicated shared component — NOT a FormatPicker extension. Pure static copy, no Shopify fetches.
- Design-system source-of-truth edit landed in Phase 6: `.shm-btn--sm` min-height 38 → 44 px for WCAG AA. System-wide.
- All Phase 4 + 5 + 6 UI work routed through `design-system-builder` per `.claude/rules/subagent-dispatch.md`.
