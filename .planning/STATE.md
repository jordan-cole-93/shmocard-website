---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: launch
status: planning
last_updated: "2026-05-20T08:10:00+02:00"
last_activity: "2026-05-20 — Phase 7 (Cross-PDP mobile polish) complete. Buybox h3 → h2 + HowItWorks step 01 format-agnostic copy + 3 a11y primitive fixes (.shm-qty__btn touch target, .shm-badge--ember contrast, surgical ember-only ghost-button contrast override). Cross-PDP audit at 375/414/768 px clean. All 3 PDPs still 196 B. Next: Phase 8 (Shopify Storefront wiring) — the biggest remaining phase, replaces every TODO(shopify) placeholder with live API data + cart wiring."
progress:
  total_phases: 10
  completed_phases: 8
  total_plans: 9
  completed_plans: 8
  percent: 80
---

# Project State

## Project Reference

See: `.planning/PROJECT.md` and `context/general/scope.md`.

**Core value:** First-time visitor leaves understanding the parent brand and either buys (Shmo Review) or joins a waitlist (other three) — without ever feeling pitched to.

**Current focus:** Phase 8 — Shopify Storefront wiring. Replace every `TODO(shopify):` placeholder across all 3 PDPs with live Storefront API queries. Wire cart + checkout redirect. Add webhook revalidation route. Read-only Admin (no mutations).

## Current Position

Phase: 8 of 10 (Shopify Storefront wiring — ready for `/gsd-plan-phase 8`)
Status: Phase 7 complete 2026-05-20; planning Phase 8 next
Last activity: 2026-05-20 — Phase 7 close-out

Progress: [████████░░] 80%

**Completed phases:** 1 (Docs refresh), 2 (Design system review), 3a (Homepage + /shmo-review category), 3 (CR-80 PDP), 4 (Link hygiene & Coming Soon stubs), 5 (L-Sign PDP), 6 (Square Card PDP + FormatCompare), 7 (Cross-PDP mobile polish).
**Remaining phases:** 8 (Shopify Storefront wiring), 9 (Tracking — GHL + FB Pixel), 10 (Launch readiness — DNS cutover).

## Notes

- All 3 PDPs polished + a11y-clean: Buybox h2 hierarchy, format-agnostic HowItWorks copy, 44 px qty buttons, AA-compliant badge + ghost-button contrast.
- Buybox accepts product props with CR-80 defaults (Phase 5). FormatCompare shared component mounts on all 3 PDPs (Phase 6). Phase 7 polished the shared components in one sweep.
- All Phase 4-7 UI work routed through `design-system-builder` per `.claude/rules/subagent-dispatch.md`.
- **Phase 8 must invoke `shmocard-shopify-work` skill before dispatching the build** per `.claude/rules/subagent-dispatch.md`. Touches `TODO(shopify):` markers across CR-80 + L-Sign + Square Card + Buybox + FormatCompare.
