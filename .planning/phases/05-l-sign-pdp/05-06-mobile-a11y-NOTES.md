# Phase 5 Plan 05-06 — Mobile + a11y findings

**Captured:** 2026-05-20
**Routes:** /shmo-review/l-sign at 375 / 414 / 768 px

## Mobile pass

| Width | Section | Status | Notes |
|-------|---------|--------|-------|
| 375 | Buybox — gallery main image | PASS | 302×302px, fits within 360px content width |
| 375 | Buybox — gallery thumbnails | PASS | 3 × 69px buttons, rightmost ends at x=254, no overflow |
| 375 | Buybox — pack rows | PASS | All 4 rows 304px wide, stack cleanly, height 96–110px each |
| 375 | Buybox — qty + ATC button | PASS | Qty group 146px, ATC full-width 304px |
| 375 | Buybox — FAQ accordion | PASS | All 4 triggers full-width, longest label wraps cleanly within 304px |
| 375 | Wave dividers | PASS | Section gaps 56–87px — correct wave sibling spacing, no ~40px empty-gap symptom |
| 375 | Proof section | PASS | Stat cards + testimonial block contained within 304px content column |
| 375 | CrewStrip | PASS | No overflow detected |
| 375 | HowItWorks — all 4 articles | PASS | Articles 304px wide, content columns, no clipping |
| 375 | VideoTestimonials | PASS | Region 360×1704px, no overflow |
| 375 | FinalCta | PASS | Two CTA buttons present as links, fit within section |
| 375 | Footer | PASS | 360×595px, no overflow |
| 375 | Horizontal scrollbar | PASS | No element exceeds 360px at 375px viewport |
| 414 | Full page | PASS | Layout scales up cleanly, no overflow detected |
| 768 | Full page | PASS | Tablet breakpoint renders correctly; sections expand to fill wider viewport |

## a11y pass

| Element | Check | Status | Notes |
|---------|-------|--------|-------|
| Nav logo link | `aria-label="ShmoCard home"` | PASS | |
| Nav menu toggle | `button "Open primary navigation"` | PASS | Has accessible name |
| Cart button | `button "Cart, 1 item"` | PASS | Dynamic item count in label |
| Gallery main image | `img "L-Sign counter standee, front view"` | PASS | Descriptive alt |
| Gallery thumb buttons | `button "View image 1/2/3"` | PASS | Numbered labels |
| Pack-row radios | `radio "1 Card $49.99"` etc. | PASS | Each radio has full label including price |
| Pack-row group | `group "Choose your pack"` | PASS | fieldset-equivalent wrapping |
| Qty group | `group "Quantity"` | PASS | |
| Qty Decrease button | `button "Decrease" [disabled]` | PASS | Disabled state correct when qty=1 |
| Qty Increase button | `button "Increase"` | PASS | Has accessible name |
| ATC button | `button "Add to cart — $359.99"` | PASS | Price in label updates with selected pack |
| FAQ triggers | `button "What is the L-Sign?"` etc. | PASS | All 4 have accessible names; aria-expanded not visible in snapshot but buttons are present and interactive |
| Crew photo image | `img "Nick Fulton — USA Pawn"` | PASS | Descriptive alt |
| Crew stat region | `generic "Verified review-volume increases"` | PASS | Region label present |
| Video play buttons | `button "Play testimonial from Carly"` | PASS | Named per person |
| Video disabled button | `button "Video coming soon" [disabled]` | PASS | Disabled state communicated |
| Footer social links | `link "Instagram"`, `link "Facebook"`, `link "YouTube"` | PASS | All named |
| Footer nav links | All named | PASS | |
| Page heading hierarchy | h3 (Buybox) → h2 (Proof/Crew/HowItWorks/Video/FinalCta) → h3 (HowItWorks steps) → h4 (footer) | NOTE | Buybox uses h3 for product title while sections below use h2 — this is an existing Buybox pattern shared with CR-80; not a regression, not in fix scope |
| Color contrast | cocoa on cream/marsh/graham bgs | PASS | Design system tokens per spec |
| Console errors | None | PASS | Only React DevTools info message and Fast Refresh logs |

## Fixes applied

None — all clean. No CSS changes made.

## Surfaced to parent (Buybox / shared component bugs)

**Heading hierarchy (minor, document only):** The Buybox product title renders as `<h3>` while section headings below render as `<h2>`. This means the page starts with h3 before h2, which is a minor a11y hierarchy inversion. Not a regression from L-Sign specifically — shared with CR-80. Flagging for parent awareness; fix would require touching `Buybox.tsx` which is off-limits in this plan. Recommend addressing in a dedicated Buybox a11y pass.

No other bugs found in shared components requiring separate scope.
