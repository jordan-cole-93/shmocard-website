# Phase 7: Cross-PDP Mobile Polish — Research

**Researched:** 2026-05-20
**Domain:** React / Next.js App Router — mobile polish + accessibility across 3 shared-component PDPs
**Confidence:** HIGH (all findings from direct codebase inspection)

---

## Recommended Approach (Summary)

Phase 7 is a verification + light-edit phase, not a build phase. The Playwright mobile passes in Phases 5 + 6 already passed clean at 375/414/768 px — so the risk of hidden mobile bugs is low. The work is:

1. **Fix two known deferred issues** in shared components first (Buybox heading + HowItWorks copy). One code change, all 3 PDPs benefit automatically.
2. **Run a fresh Playwright screenshot pass** across all 3 PDPs at 375/414/768 px to catch anything that changed between Phase 5/6 individual passes and the current integrated state (FormatCompare now mounted on all 3).
3. **Spot-check a11y** — keyboard tab order, ARIA labels, contrast. Most already PASS from Phase 5/6 audits.
4. **Close with a tsc + build gate.**

No new components. No new CSS. LAYOUT IS LOCKED. Fix what's broken, screenshot what's clean, commit and close.

---

## User Constraints (from CONTEXT.md)

No CONTEXT.md exists for Phase 7 yet. Constraints are locked by ROADMAP.md + project rules:

### Locked Decisions
- Phase 7 is local-only — no Shopify writes, no domain touches.
- All `.tsx` / `.css` edits route through the `design-system-builder` subagent.
- LAYOUT IS LOCKED: spacing, type, mascot scale ONLY. No grid changes, no section reorders, no tile-ratio shifts.
- Run BEFORE Phase 8 Shopify wiring.

### Claude's Discretion
- Approach to Buybox heading hierarchy fix (h3 → h2 vs off-screen h2).
- Approach to HowItWorks copy fix (agnostic edit vs prop-driven vs per-PDP variant).
- Order of sub-tasks within the phase.

### Deferred (OUT OF SCOPE)
- Shopify wiring (Phase 8).
- Tracking pixels (Phase 9).
- L-Sign-specific testimonials / videos.
- DRY extraction of FORMAT_COPY to `lib/shmo-review/format-copy.ts`.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Heading hierarchy fix | Frontend (shared component) | — | `Buybox.tsx` is a client component; edit `h3` → `h2` in one file, all 3 PDPs benefit |
| HowItWorks copy | Frontend (shared component) | — | `HowItWorks.tsx` is server-safe; copy lives in `REVIEW_HOW_STEPS` const array |
| Mobile layout verification | Browser / Playwright | — | Screenshots confirm rendered output, not source |
| a11y verification | Browser / axe / manual | — | ARIA roles, keyboard tab order are runtime concerns |
| Touch-target compliance | Design system CSS | — | `.shm-btn--sm` already fixed to 44px in Phase 6 (`components.css`) |

---

## Q1: Buybox Heading Hierarchy — Recommended Fix

### Current state
`Buybox.tsx` line 191: `<h3 className="bb__title">{product.title}</h3>`

Page section headings (Proof, HowItWorks, VideoTestimonials, FinalCta) all use `<h2>`. Result: the page's first heading is an `h3`, then `h2`s appear below it — an inverted WCAG 1.3.1 (info and relationships) hierarchy.

Affects all 3 PDPs identically. Not a regression; was present since Phase 3.

### Options

| Option | Approach | Risk |
|--------|----------|------|
| A: Promote to `h2` | Change `h3` → `h2` in Buybox.tsx line 191 | Zero. The buybox sits at the top of the page; it IS the page-level heading. |
| B: Off-screen `h2` wrapper | Add `<h2 className="sr-only">{product.title}</h2>` before the `h3` | Redundant; adds invisible DOM noise. |

### Recommendation: Option A (promote to `h2`)

The product title IS the page-level subject. `h2` is correct. The `h3` was an accident of the original review-buybox.jsx port — the JSX reference used `h3` in a context where an outer page `h1` existed (the homepage). On a standalone PDP there is no `h1` or `h2` above the buybox.

Correct hierarchy after fix:
```
h2  — product title (Buybox)
  h3  — HowItWorks step titles (how-warm-step__title)
  h3  — FAQ section headings (implicitly via shm-faq-question styling)
h2  — "From handoff to five stars" (HowItWorks section head)
h2  — Proof section
h2  — FinalCta
h4  — Footer
```

**Edit scope:** `Buybox.tsx` line 191 only. One character change (`h3` → `h2`). No CSS changes needed — `bb__title` styles are tag-agnostic.

**ASSUMED:** No other component on these PDPs renders an `h1` or `h2` above the Buybox. Confirmed by reading all 3 page.tsx files — none add a heading above `<Buybox>`. [VERIFIED: direct codebase read]

---

## Q2: HowItWorks Step 01 Copy — Recommended Fix

### Current state
`HowItWorks.tsx` lines 21–27:
```typescript
{
  n: "01",
  title: "Crew hands the card",
  body: "After every transaction, an employee hands the customer the card. The ask happens at the right moment — when the customer is happy.",
  screen: "handoff",
  details: ["Best after checkout", "Lives with the crew", "No counter card"],
}
```

This copy assumes a crew-mediated handoff. It is correct for CR-80. It is misleading for:
- **L-Sign:** self-serve standee next to the register; no staff handoff needed.
- **Square Card:** adhesive disc on a surface; customer self-initiates.

### Options

| Option | Approach | Code complexity | Copy accuracy |
|--------|----------|----------------|---------------|
| A: Make step 01 format-agnostic | Edit the shared copy to remove "crew hands the card" framing | Minimal — edit one const | Good enough |
| B: Prop-driven steps | Add `steps?: typeof REVIEW_HOW_STEPS` prop to HowItWorks; per-PDP overrides in page.tsx | Moderate — new prop interface, 3 page.tsx edits | Exact |
| C: Per-PDP variants | Split into `HowItWorks.tsx` / `HowItWorksLSign.tsx` / `HowItWorksSquare.tsx` | High — code duplication | Exact but fragile |

### Recommendation: Option A (format-agnostic edit)

Phase 7 scope is LAYOUT IS LOCKED, spacing/type/mascot only. HowItWorks copy is a **text edit** — no class changes, no structural changes. Option A fits within scope.

Proposed format-agnostic rewrite of step 01 only:

```typescript
{
  n: "01",
  title: "Put the card where customers can reach it",
  body: "After the transaction — or right at the counter — your NFC card is there. The ask happens at the right moment, when the customer is happy.",
  screen: "handoff",
  details: ["Works at checkout", "Self-serve or crew-assisted", "No app needed"],
}
```

This framing works for all three formats:
- CR-80: crew hands it over — still true.
- L-Sign: sits at the counter — "where customers can reach it" fits.
- Square Card: stuck to a surface — "where customers can reach it" fits.

**If Jordan wants per-format accuracy** (Option B), the prop interface would mirror BuyboxProps:

```typescript
// HowItWorks.tsx
export type HowItWorksStep = {
  n: string;
  title: string;
  body: string;
  screen: Screen;
  details: string[];
};

export const DEFAULT_HOW_STEPS: HowItWorksStep[] = [ /* existing array */ ];

export default function HowItWorks({ steps = DEFAULT_HOW_STEPS }: { steps?: HowItWorksStep[] }) {
  // ...
}
```

Then each page.tsx passes `steps={L_SIGN_HOW_STEPS}` etc. This is clean but adds scope.

**Recommendation for Phase 7:** Option A. If Jordan wants per-PDP step copy, that's a decision — flag as open question below.

---

## Q3: Cross-PDP Mobile Audit Checklist

All three PDPs share the same component tree:
`Buybox → Proof → CrewStrip → HowItWorks → FormatCompare → VideoTestimonials → FinalCta`

The audit should verify every section at each breakpoint on each PDP. Phase 5 + 6 already passed — the goal here is confirming no regressions from mounting FormatCompare on all 3 and from the `.shm-btn--sm` touch-target fix.

### Per-PDP, per-breakpoint checklist

**Breakpoints:** 375 px, 414 px, 768 px
**PDPs:** `/shmo-review/cr-80`, `/shmo-review/l-sign`, `/shmo-review/square-card`

| Section | What to verify |
|---------|---------------|
| **Buybox — gallery** | Main image fills content width. Thumbs wrap cleanly (CR-80: 6 thumbs may wrap to 2 rows; L-Sign: 3 thumbs; Square: 5 thumbs). No thumb clipping at right edge. |
| **Buybox — pack rows** | All 4 rows visible. Heights ≥ 44px (rows with badge: ~110px, rows without: ~96px). No horizontal overflow. |
| **Buybox — qty + ATC** | ATC button full-width. Qty stepper 44px touch targets (already verified Phase 5/6). |
| **Buybox — FAQ** | All 4 accordion items expand/collapse. No overflow on longest label. |
| **Wave dividers** | No ~40px gap symptom between sections. All using Section component (sibling wave). |
| **Proof** | Single-column stat cards. No overflow. |
| **CrewStrip** | No horizontal scroll bleed. |
| **HowItWorks — 4 steps** | Alternating cream/marsh sections, articles single-column. Phone frame fits within content width at 375. |
| **FormatCompare** | 3-card grid stacks to 1-column at 375. "You're here" button ≥ 44px (fixed in Phase 6). "View product" links readable. No overflow. |
| **VideoTestimonials** | No overflow. Disabled button states visible. |
| **FinalCta** | CTA buttons stack correctly. No clipping. |
| **Horizontal overflow** | Full-page screenshot: no section exceeds viewport width. |

### CR-80-specific
- Gallery has 6 thumbs — most likely to wrap to 2 rows. Verify no row 2 thumb clips the right edge.

### L-Sign-specific
- Gallery has 3 thumbs — already verified Phase 5, but re-verify with FormatCompare now mounted.

### Square Card-specific
- Gallery has 5 thumbs (4 + 1 on row 2) — already verified Phase 6.

### FormatCompare cross-PDP spot-check (also in Phase 6, re-verify)
| PDP | "You're here" target | Both "View product" links present |
|-----|---------------------|----------------------------------|
| /cr-80 | CR-80 card | L-Sign + Square Card |
| /l-sign | L-Sign card | CR-80 + Square Card |
| /square-card | Square Card | CR-80 + L-Sign |

---

## Q4: Anticipated Issues

Based on component analysis and Phase 5/6 findings:

### Low-risk (likely clean, verify anyway)
- **Wave-divider gap** — all PDPs use `<Section>` which renders wave as sibling fragment. No manual `<div className="shm-wave">` detected in any PDP page.tsx. Risk: LOW.
- **Pack-row stacking** — already verified in Phase 5 + 6. Risk: LOW.
- **FAQ jank** — state-driven open/close in Buybox. Already verified. Risk: LOW.
- **FinalCta CTA stacking** — already verified Phase 5. Risk: LOW.

### Medium-risk (changed since individual PDP passes)
- **CR-80 gallery thumb row wrap** — 6 thumbs; CR-80 was verified in an earlier pass before FormatCompare was mounted. DOM structure unchanged but worth re-screenshotting to confirm no paint artifact.
- **FormatCompare sticky nav overlap artifact** — Phase 6 noted Playwright captures element bounding box with fixed nav overlapping. Use full-page screenshots for final record; element-level captures are unreliable for this section.

### Known-clean (explicitly passed in Phase 5/6)
- `.shm-btn--sm` touch target — fixed to `min-height: 44px` in Phase 6 (components.css). [VERIFIED: Phase 6 SUMMARY]
- Horizontal overflow at 375 — all PDPs passed. [VERIFIED: Phase 5/6 mobile notes]
- Console errors — clean on all breakpoints. [VERIFIED: Phase 5/6 mobile notes]

---

## Q5: a11y Checklist

Phase 5 + 6 ran full a11y passes. These items already PASS — re-verify spot-check only.

### Interactive elements (all 3 PDPs)
| Element | Expected label | Status going in |
|---------|---------------|-----------------|
| Nav logo | `aria-label="ShmoCard home"` | PASS (Phase 5) |
| Nav menu toggle | `button "Open primary navigation"` | PASS |
| Cart button | `button "Cart, N item(s)"` | PASS |
| Gallery main image | descriptive `alt` per product | PASS |
| Gallery thumb buttons | `button "View image N"` | PASS |
| Pack-row radios | `radio "N Card(s) $XX.XX"` | PASS |
| Pack-row fieldset | `group "Choose your pack"` | PASS |
| Qty decrease | `button "Decrease"` disabled at qty=1 | PASS |
| Qty increase | `button "Increase"` | PASS |
| ATC button | `button "Add to cart — $XX.XX"` | PASS |
| FAQ triggers | `button "{question text}"` + `aria-expanded` | PASS |
| FormatCompare "You're here" | `aria-disabled="true"` + HTML `disabled` | PASS (Phase 6) |
| FormatCompare "View product" | Descriptive in context of visible h3 | PASS |
| Video play buttons | `button "Play testimonial from {name}"` | PASS |
| Footer social links | `link "Instagram"` / `"Facebook"` / `"YouTube"` | PASS |

### Heading hierarchy (fix in Phase 7)
| Before | After fix |
|--------|-----------|
| h3 (Buybox product title) → h2 (section heads) | h2 (Buybox product title) → h2 (section heads) → h3 (HowItWorks steps) |

### Color contrast
- Design system tokens only across all PDPs. No custom colors introduced in Phases 5/6.
- `.shm-btn--sm` fix doesn't change color — contrast unaffected.
- Spot-check: cocoa text on cream/marsh/graham backgrounds. Expected: PASS (design system spec).

### Keyboard tab order (per PDP)
Expected DOM-order tab sequence:
```
Skip link (if present) → Nav → Cart button → Gallery thumbs →
BB title (non-interactive) → Pack rows (radio group) →
Qty dec → Qty inc → ATC button → FAQ triggers →
FormatCompare "You're here" (disabled, skipped) → FormatCompare "View product" links →
VideoTestimonials play buttons → FinalCta CTA links → Footer links
```
Already verified Phase 5/6 — re-confirm no regressions.

### Touch targets (all interactive elements ≥ 44px)
- Pack rows: ~96–110px. PASS.
- ATC button: ~63px. PASS.
- `.shm-btn--sm` (FormatCompare): fixed to 44px in Phase 6. PASS.
- Qty buttons: verify ≥ 44px (not explicitly measured in Phase 5/6 notes — flag for explicit check).

---

## Q6: Order of Operations

Fix shared components FIRST. One fix — all 3 PDPs benefit. Then screenshot. Then close.

```
Wave 0: Setup
  - Create Phase 7 planning dir + plan files
  - Take PRE screenshots (baseline) across all 3 PDPs at 375/414/768

Wave 1: Shared component fixes (Buybox.tsx + HowItWorks.tsx)
  - Fix 1: Buybox.tsx line 191 — h3 → h2
  - Fix 2: HowItWorks.tsx REVIEW_HOW_STEPS[0] — copy edit for format-agnostic step 01
  - Verify: tsc --noEmit clean after both edits
  - Visual regression check: POST screenshots vs PRE on CR-80 (canonical baseline)

Wave 2: Cross-PDP mobile audit
  - Full-page Playwright screenshots at 375/414/768 px for all 3 PDPs
  - Fix any issues found (spacing/type/mascot only — LAYOUT IS LOCKED)
  - Re-screenshot after fixes

Wave 3: a11y spot-check
  - Playwright accessibility snapshot on each PDP
  - Verify heading hierarchy fixed (h2 now first)
  - Verify qty button touch targets ≥ 44px (gap from Phase 5/6)
  - Keyboard tab order walkthrough (manual or Playwright focus sequence)

Wave 4: Close
  - tsc --noEmit + npm run build — must be clean
  - Commit screenshots + fixes
  - Update ROADMAP, handoff, STATE
```

---

## Q7: Open Questions (RESOLVED 2026-05-20)

### OQ-1 — HowItWorks copy granularity [NEEDS JORDAN INPUT]
**Question:** Does Jordan want format-specific step 01 copy per PDP (Option B — prop-driven), or is a format-agnostic rewrite of the shared copy sufficient (Option A)?

**Recommendation:** Option A (format-agnostic edit) — less scope, same visual result, fits "LAYOUT IS LOCKED" spirit of Phase 7.

**If Option B:** prop interface is ready-to-implement (see Q2 above). Would add ~20 lines to `HowItWorks.tsx` and ~10 lines per PDP page.tsx. Not blocked, but needs explicit approval before touching.

**Default if no input:** proceed with Option A.

### OQ-2 — Qty button touch target [RESOLVE IN WAVE 3]
Phase 5/6 notes confirmed qty buttons have accessible names but did not explicitly measure touch target height. `.shm-qty__btn` size comes from `components.css`. Measure during Wave 3.

**If < 44px:** fix in `components.css` (design-system primitive change — same process as `.shm-btn--sm` fix in Phase 6). Would need Jordan approval like Phase 6's touch-target fix.

**RESOLVED-DEFAULT:** Assume PASS until measurement says otherwise. Don't preemptively touch.

### OQ-3 — CR-80 gallery thumbs (6-thumb wrap) [RESOLVE IN WAVE 2]
6-thumb row may wrap differently depending on thumb width. Phase 5/6 did not explicitly re-verify CR-80's gallery after FormatCompare was added (no DOM change, but worth confirming in the integrated pass). RESOLVE via Playwright screenshot in Wave 2.

### OQ-4 — aria-expanded on FAQ [RESOLVE IN WAVE 3]
Phase 5 notes: "aria-expanded not visible in snapshot but buttons are present and interactive." `Buybox.tsx` line 321 confirms `aria-expanded={faqOpen === i}` is set correctly. Snapshot method may not capture dynamic state. Verify via keyboard interaction test that expanded state is communicated.

---

## Validation Architecture

Phase 7 is verification-heavy with no automated test suite. All validation is Playwright screenshots + manual a11y checks.

### Playwright Screenshot Protocol

| When | Command | Coverage |
|------|---------|----------|
| Wave 0 — PRE baseline | `npx playwright screenshot --viewport=375x812 http://localhost:3000/shmo-review/cr-80 pictures/screenshots/07-pre-cr80-375.png` (repeat for l-sign, square-card, and 414/768) | 9 screenshots: 3 PDPs × 3 breakpoints |
| Wave 1 — POST fixes | Same command set, saved as `07-post-fix-cr80-375.png` etc. | 9 screenshots |
| Wave 2 — Final audit | Full-page screenshots: add `--full-page` flag | 9 full-page screenshots per PDP |

Save all screenshots to `pictures/screenshots/` (enforced by project hook).

### Build Gate (every wave)

```bash
npx tsc --noEmit     # must be clean
npm run build        # must produce 12 static routes, all at ~196 B
```

### Phase Gate (before closing)

All 3 PDPs must:
- [ ] Render at 375/414/768 with no horizontal overflow
- [ ] Have no console errors
- [ ] Pass tsc + build clean
- [ ] Show h2 as first heading in Buybox (after fix)
- [ ] Show format-agnostic step 01 copy in HowItWorks (after fix)
- [ ] FormatCompare "You're here" button ≥ 44px (already fixed)
- [ ] All interactive elements have accessible names

### No automated a11y tests

Playwright accessibility snapshots are informational — they capture ARIA tree state but don't run axe assertions. Manual keyboard walkthrough is the primary a11y verification method for this phase. Document findings in a `07-MOBILE-A11Y-NOTES.md` analogous to Phase 5 + 6 notes files.

---

## Project Constraints (from CLAUDE.md)

- All `.tsx` / `.css` edits through `design-system-builder` subagent — no parent-written UI code.
- Wave dividers are siblings of sections, never children — `<Section>` component handles this automatically.
- No new fonts, no hex colors, no Lucide icons.
- No new components unless a gap in `components.css` demands it (not expected in Phase 7).
- Screenshots save to `pictures/screenshots/`.
- Never touch Shopify Admin, domain settings, or `.env` files.
- `tsc --noEmit` + `npm run build` must be clean before phase close commit.

---

## Common Pitfalls

### Pitfall 1: Treating h3 → h2 as a visual change
The `bb__title` class is tag-agnostic in `shmo-review.css`. Changing `h3` to `h2` in Buybox.tsx is a semantic-only change. No CSS update needed. Risk of visual regression: zero.

### Pitfall 2: Touching HowItWorks layout while editing copy
Step 01 copy edit is a text-only change inside `REVIEW_HOW_STEPS[0]`. The Section/article/PhoneScreen structure must not be touched. Pass `"this is a copy-only edit — LAYOUT IS LOCKED"` to the design-system-builder if it handles this task.

### Pitfall 3: Full-page vs element screenshot for FormatCompare
Playwright element screenshots of FormatCompare capture the fixed sticky nav overlapping the element's bounding box — this is a screenshot artifact, not a rendering bug. Always use `--full-page` for final FormatCompare verification.

### Pitfall 4: Verifying only CR-80 after shared-component fixes
Buybox.tsx and HowItWorks.tsx are shared. After fixing, screenshot ALL 3 PDPs — not just CR-80. The whole point of Phase 7 is cross-PDP consistency.

### Pitfall 5: Skipping Wave 0 PRE screenshots
Without a PRE baseline, there's no way to prove fixes didn't regress anything. PRE shots are the regression gate for Wave 1.

---

## Sources

All findings are from direct codebase inspection — no external sources required for this phase.

| File | Finding |
|------|---------|
| `Buybox.tsx` line 191 | `h3` heading — [VERIFIED: direct read] |
| `HowItWorks.tsx` lines 21–27 | Step 01 "Crew hands the card" copy — [VERIFIED: direct read] |
| `05-06-mobile-a11y-NOTES.md` | Phase 5 mobile + a11y results — all PASS — [VERIFIED: direct read] |
| `06-07-mobile-a11y-NOTES.md` | Phase 6 mobile + a11y results — all PASS except `.shm-btn--sm` 38px (fixed) — [VERIFIED: direct read] |
| `05-SUMMARY.md` | Deferred items: heading hierarchy + HowItWorks copy — [VERIFIED: direct read] |
| `06-SUMMARY.md` | `.shm-btn--sm` fixed to 44px in Phase 6; deferred items carried forward — [VERIFIED: direct read] |
| `cr-80/page.tsx`, `l-sign/page.tsx`, `square-card/page.tsx` | All 3 PDPs use identical component tree — [VERIFIED: direct read] |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | No `h1` or `h2` exists above `<Buybox>` on any of the 3 PDPs | Q1 | Low — confirmed by reading all 3 page.tsx files; no additional heading components mounted above Buybox |
| A2 | `.shm-qty__btn` touch target is ≥ 44px | Q5 / OQ-2 | Low — if < 44px, fix in components.css during Wave 3 (same process as Phase 6 btn--sm fix) |

**Both assumptions are low-risk and resolvable in execution without Jordan input.**

---

## Metadata

**Confidence breakdown:**
- Shared component issues: HIGH — verified from source code
- Mobile audit checklist: HIGH — derived from Phase 5/6 verified findings + component analysis
- a11y checklist: HIGH — Phase 5/6 passed; only heading hierarchy is a new fix
- HowItWorks copy approach: MEDIUM — Option A is a judgment call; Jordan may prefer Option B

**Research date:** 2026-05-20
**Valid until:** Phase 7 execution (no external dependencies; all local codebase)
