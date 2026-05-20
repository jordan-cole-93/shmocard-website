# Phase 6 Plan 06-07 — Mobile + a11y findings

**Captured:** 2026-05-20
**Routes:** /shmo-review/square-card at 375/414/768 px + FormatCompare spot-check on /cr-80, /l-sign, /square-card at 375 px

---

## Mobile pass (Square Card PDP)

| Width | Section | Status | Notes |
|-------|---------|--------|-------|
| 375 | Buybox — gallery thumbs | PASS | 5 thumbs: 4 on row 1 + 1 on row 2, wraps cleanly. No clipping. |
| 375 | Buybox — pack rows | PASS | Rows 1–2: 96px. Rows 3–4 (with badge): 110px. All above 44px touch min. |
| 375 | Buybox — CTA button | PASS | "Add to cart" 63px tall, full-width. Solid touch target. |
| 375 | Buybox — FAQ accordion | PASS | 4 rows render, no page-shift jank observed. |
| 375 | Proof | PASS | Single-column, no overflow. |
| 375 | CrewStrip | PASS | Scrolls within bounds, no horizontal overflow. |
| 375 | HowItWorks | PASS | 4 alternating sections, single-column layout, clean. |
| 375 | FormatCompare | PASS | 3-card grid stacks to 1-column. No overflow. (See note on sticky nav screenshot artifact below.) |
| 375 | VideoTestimonials | PASS | Transitions cleanly from FormatCompare cream bg. |
| 375 | FinalCta | PASS | CTA buttons stack correctly. |
| 375 | Horizontal overflow (all sections) | PASS | main box = 360px (375 viewport - scrollbar). No section exceeds 360px. |
| 375 | Wave-divider gap symptom | PASS | No ~40px gap observed. All sections use Section component. |
| 414 | All sections | PASS | Layout mirrors 375 cleanly. No regressions. |
| 768 | All sections | PASS | Two-column buybox restores at 1100px; 768 renders single-column correctly. |

### Screenshot artifacts note
The FormatCompare element screenshots show the sticky nav bar overlapping the top of the section bounding box. This is a Playwright element-screenshot artifact (the fixed nav paints on top of the captured region). The section content itself is not clipped — full-page screenshots confirm correct rendering with no gap or overlap.

---

## FormatCompare spot-check (3 PDPs at 375px)

| PDP | Status | Notes |
|-----|--------|-------|
| /cr-80 | PASS | 1-column stack. CR-80 card shows "You're here" (disabled). L-Sign + Square Card show "View product" links. No overflow. |
| /l-sign | PASS | 1-column stack. L-Sign card shows "You're here" (disabled). CR-80 + Square Card show "View product" links. No overflow. |
| /square-card | PASS | 1-column stack. Square Card shows "You're here" (disabled). CR-80 + L-Sign show "View product" links. No overflow. |

---

## a11y pass

| Element | Check | Status | Notes |
|---------|-------|--------|-------|
| FormatCompare "You're here" button | `aria-disabled="true"` | PASS | Both HTML `disabled` attr AND `aria-disabled="true"` present (FormatCompare.tsx line 135–136). |
| FormatCompare "View product" links | Descriptive anchor text | PASS | Text is "View product" on all non-current cards. Acceptable — each card has a visible h3 heading providing context. |
| FormatCompare "You're here" button | Touch target height ≥ 44px | FAIL | Measures 38px tall. `.shm-btn--sm` has `min-height: 38px` (components.css line 61). 6px below WCAG 2.5.5 minimum. **Surfaced to parent — see below.** |
| Pack rows | Touch target height ≥ 44px | PASS | Rows 1–2: 96px. Rows 3–4: 110px. |
| Add to cart CTA | Touch target height ≥ 44px | PASS | 63px tall. |
| Color contrast — cocoa on cream | Design system baseline | PASS | Per design system spec. No deviations introduced. |
| Keyboard tab order | Gallery thumbs → bb title → checklist → pack rows → qty → CTA → FAQ → FormatCompare cards L→R → VideoTestimonials → FinalCta | PASS | Tab order matches DOM source order. FormatCompare cards render CR-80 → L-Sign → Square Card left-to-right, consistent with HANDLES array order in FormatCompare.tsx. |
| Console errors | Clean on page load | PASS | No errors. Fast Refresh HMR messages only. |

---

## Fixes applied

None — all clean within scope. No changes to `shmo-review.css` were needed.

---

## Surfaced to parent (bugs needing separate scope)

### 1. `.shm-btn--sm` touch target: 38px < 44px minimum

**Where:** `components.css` line 61 — `.shm-btn--sm { min-height: 38px; }`

**Affected:** Every `shm-btn--sm` instance across all PDPs — most visibly the "You're here" disabled button in FormatCompare, and the "View product" links on non-current cards.

**Fix scope:** This is a design-system primitive change in `components.css`, not page-level CSS. Bumping `min-height` to `44px` on `.shm-btn--sm` affects all three PDPs identically and any other page using `--sm` buttons. Needs explicit parent approval before touching.

**Suggested fix:** `min-height: 44px` on `.shm-btn--sm` in `components.css`. Padding would stay the same (`10px 16px`); only the floor rises. No visual regression expected — buttons would gain 6px of vertical space.
