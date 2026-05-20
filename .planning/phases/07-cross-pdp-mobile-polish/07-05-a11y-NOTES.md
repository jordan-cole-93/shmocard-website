# Phase 7 Plan 07-05 — Cross-PDP a11y final check

**Captured:** 2026-05-20
**Routes:** 3 PDPs (CR-80, L-Sign, Square Card)
**Method:** Playwright accessibility snapshots + source inspection + WCAG contrast math (relative luminance formula)

---

## 1. Heading outline (per PDP)

| PDP | First heading | h2-first? | Outline matches expected? | Status |
|-----|---------------|-----------|----------------------------|--------|
| /cr-80 | `h2` "Google Review NFC Tap Card (CR-80)" (Buybox) | YES | h2 → h3 (HowItWorks steps) → h2 (Proof / CrewStrip / HowItWorks / FormatCompare / VideoTestimonials / FinalCta) → h3 (FormatCompare card titles) → h4 (Footer) | PASS |
| /l-sign | `h2` "Google Review NFC Tap Sign (L-Sign)" (Buybox) | YES | Same pattern | PASS |
| /square-card | `h2` "Google Review NFC Disc (Square Card)" (Buybox) | YES | Same pattern | PASS |

**07-01 h2 fix confirmed.** All three PDPs open with an `h2` Buybox product title. No `h3` precedes it.

Full outline confirmed from snapshots (all three PDPs identical in structure):
```
h2 — Buybox product title
  h3 — HowItWorks step titles (01–04)
h2 — Proof section head "The math only works when the crew taps."
h2 — CrewStrip "Card per crew member, not card per shop."
h2 — HowItWorks "From handoff to five stars, in one tap."
h2 — FormatCompare "Not sure this is the right one?"
  h3 — FormatCompare card titles (CR-80 Card, L-Sign Standee, Square Card Disc)
h2 — VideoTestimonials "Watch shops talk about the bulk math."
h2 — FinalCta "Pick a card, pick a kit, or build your own."
h4 — Footer column heads (Products, Shop, Help)
```

---

## 2. Keyboard tab order (per PDP)

No skip-link is present in any PDP (none exists in the codebase — `grep` returned no results).

| PDP | Actual sequence | Matches expected? | Deviations |
|-----|-----------------|-------------------|------------|
| /cr-80 | Nav logo → nav links (Shmo Review, Shmo Biz, Shmo Link, Shmo Reputation) → Cart button → Shop→ link → Gallery thumb buttons (×6) → Pack-row radios (1/2/5/10 Cards) → Decrease qty btn → Increase qty btn → ATC button → FAQ triggers (×4) → FormatCompare: L-Sign "View product" → Square Card "View product" [CR-80 "You're here" disabled — SKIPPED] → Video play buttons (×2, third disabled — skipped) → FinalCta links (×2) → Footer links | Matches expected (minus skip-link) | No skip-link. "You're here" disabled button is correctly excluded from tab order. |
| /l-sign | Same pattern; Gallery thumb buttons ×3; "You're here" is L-Sign card — SKIPPED; CR-80 and Square Card have "View product" links | Matches expected | Same as above. |
| /square-card | Same pattern; Gallery thumb buttons ×5; "You're here" is Square Card — SKIPPED; CR-80 and L-Sign have "View product" links | Matches expected | Same as above. |

**Note:** The nav contains 4 product links before Cart. The `disabled` pack-row radio buttons are not visited by Tab (browser skips disabled form controls); only the selected radio in the group receives focus per standard radio group behaviour.

---

## 3. Color contrast (Square Card spot-check)

All ratios calculated via WCAG relative luminance formula. Font size reference: body/UI text ≤ 17px (small text threshold = 4.5:1); large text ≥ 18pt/24px normal or 14pt/18.67px bold (threshold = 3:1).

| Element | Combo | Ratio | Threshold | Status |
|---------|-------|-------|-----------|--------|
| Buybox h2 title | cocoa-deep `#3B1F14` on marsh `#FFFBF1` | 14.6:1 | 4.5:1 (AA) | PASS |
| Pack-row name + price | cocoa-deep on cream `#FFF8EA` | 14.27:1 | 4.5:1 (AA) | PASS |
| "SAVE N%" badge (`.shm-badge--honey`) | cocoa-deep on honey `#FFB833` | 8.73:1 | 4.5:1 (AA) | PASS |
| "Most popular" badge (`.shm-badge--ember`) | ember `#FF5B1F` text on ember-tint `#FFF1E5` bg | **2.8:1** | 4.5:1 (AA) | **FAIL** |
| FormatCompare "You're here" disabled btn | ink-4 `#7A5A45` on cream card bg `#FFF8EA` | 5.88:1 | Disabled = exempt per WCAG 1.4.3 exception; if measured: 3:1 non-text | PASS (exempt) |
| FinalCta `.shm-btn--cream` text | cocoa-deep on cream `#FFF8EA` | 14.27:1 | 4.5:1 (AA) | PASS |
| FinalCta `.shm-btn--ghost.on-dark` text | marshmallow `#FFFBF1` on ember `#FF5B1F` | **3.0:1** | 4.5:1 (AA, 17px = small text) | **FAIL** |
| FinalCta eyebrow + h2 | cocoa-deep on ember | 4.86:1 | 4.5:1 (AA) | PASS |
| Footer text | marshmallow on cocoa-deep | 14.6:1 | 4.5:1 (AA) | PASS |

**Two failures identified — both are primitive-level issues:**

1. **`.shm-badge--ember` text contrast** — ember on ember-tint = 2.8:1. Fails AA. The "Most popular" badge in every pack-row uses this class. Fix: change badge text to `var(--color-cocoa-deep)` in `components.css` (`.shm-badge--ember { color }` line). Calculated cocoa-deep on ember-tint = 13.62:1 — would pass.

2. **`.shm-btn--ghost.on-dark` text contrast** — marshmallow on ember section background = 3.0:1. Fails AA for 17px text. This is the "Browse formats" secondary CTA in FinalCta. Fix options: darken text to cocoa-deep (4.86:1 on ember — passes), OR accept as large-text if font-weight 700 at 17px can be argued (it cannot — 14pt bold = 18.67px, 17px does not qualify). Primitive fix required in `components.css`.

---

## 4. Qty button touch target

Measured `.shm-qty__btn` height: **32px** (source: `components.css` line 728: `width: 32px; height: 32px`).

Required: ≥ 44px (WCAG 2.5.5 Target Size — Enhanced).

Status: **FAIL — 32px < 44px minimum.**

This is a **primitive-level fix** in `components.css`. Same protocol as the `.shm-btn--sm` fix from Phase 6. Do NOT fix inline. Surface to parent for `components.css` patch:

```css
/* proposed fix */
.shm-qty__btn {
  width: 44px; height: 44px;   /* was 32×32 */
  …
}
```

Note: The `.shm-qty` pill container uses `overflow: hidden` — widening the button may require a visual check to ensure the pill shape still looks correct. The icon SVG inside is small; the extra tap area is whitespace within the button.

---

## 5. FAQ aria-expanded

Both FAQ implementations wired correctly:

- **Buybox FAQ** (`Buybox.tsx` line 321): `aria-expanded={faqOpen === i}` — JSX boolean, React serializes to `"true"`/`"false"` string in DOM.
- **Standalone FAQ** (`Faq.tsx` line 64): `aria-expanded={openIdx === i}` — same pattern.

Playwright snapshot confirmed: after clicking "What is the Square Card?" trigger, the button shows `[expanded]` state in the accessibility tree, confirming `aria-expanded="true"` is present in the rendered DOM.

Status: **PASS — aria-expanded toggles correctly on both FAQ implementations.**

---

## 6. FormatCompare "You're here" disabled

Source: `FormatCompare.tsx` lines 135–136:

```tsx
disabled
aria-disabled="true"
```

Both attributes present. Verified across all three PDPs:
- CR-80 PDP: "You're here" on CR-80 card (`disabled` in snapshot, "You're here" button shown as `[disabled]`)
- L-Sign PDP: "You're here" on L-Sign card (confirmed `[disabled]`)
- Square Card PDP: "You're here" on Square Card (`[disabled]`)

Keyboard tab order confirms: disabled button is excluded from focus sequence on all three PDPs.

Status: **PASS — HTML `disabled` AND `aria-disabled="true"` both present.**

---

## Surfaced items (primitive-level fixes required)

| # | Issue | Primitive to fix | File | Proposed fix |
|---|-------|------------------|------|--------------|
| A | `.shm-qty__btn` touch target 32px — below 44px WCAG 2.5.5 | `.shm-qty__btn` | `components.css` ~line 728 | Set `width: 44px; height: 44px`. Verify pill container visual. |
| B | `.shm-badge--ember` text contrast 2.8:1 — fails AA | `.shm-badge--ember` | `components.css` ~line 172 | Change `color` from `var(--color-ember)` to `var(--color-cocoa-deep)`. |
| C | `.shm-btn--ghost.on-dark` text contrast 3.0:1 on ember bg — fails AA (17px small text needs 4.5:1) | `.shm-btn--ghost` + `.on-dark` modifier | `components.css` | Options: (1) darken on-dark text to cocoa-deep, (2) add `.shm-bg-ember .on-dark` override with cocoa text. Cocoa on ember = 4.86:1. |
| D | No skip-link | Nav component | `components/Nav.tsx` | Add `<a className="shm-skip-link" href="#main-content">Skip to content</a>` before nav. Not a blocker for Phase 7 close but a known gap. |

Items A–C are primitive fixes in `components.css`. Item D is a Nav addition. None were modified inline — surfaced per Phase 6 protocol.

---

## Final verdict

**3 fixes needed before claiming full AA compliance — phase 7 cannot close clean.**

Surfaced items:
- **A** — `.shm-qty__btn` 32px touch target (primitive, `components.css`)
- **B** — `.shm-badge--ember` text contrast 2.8:1 (primitive, `components.css`)
- **C** — `.shm-btn--ghost.on-dark` on ember bg 3.0:1 contrast (primitive, `components.css`)
- **D** — No skip-link (Nav component addition — lower severity, not a contrast/touch-target blocker)

Heading outline (07-01 fix): confirmed h2-first on all 3 PDPs — PASS.
Keyboard tab order: logical, disabled elements correctly excluded — PASS.
FAQ aria-expanded: toggles correctly — PASS.
FormatCompare disabled: both `disabled` + `aria-disabled="true"` present — PASS.
