---
phase: 07-cross-pdp-mobile-polish
phase_number: 7
phase_name: Cross-PDP Mobile Polish
status: planning
depends_on: [phase-3, phase-4, phase-5, phase-6]
total_plans: 6
autonomous: false
last_updated: "2026-05-20"
requirements:
  - PH7-BUYBOX-H2
  - PH7-HOWITWORKS-COPY
  - PH7-MOBILE-AUDIT
  - PH7-A11Y-FINAL
  - PH7-NO-REGRESSION
  - PH7-TSC
  - PH7-BUILD
files_modified:
  - components/shmo-review/Buybox.tsx
  - components/shmo-review/HowItWorks.tsx
  - .planning/STATE.md
  - .planning/ROADMAP.md
  - context/general/handoff.md
  - context/general/scope.md
  - .planning/phases/07-cross-pdp-mobile-polish/07-SUMMARY.md
  - .planning/phases/07-cross-pdp-mobile-polish/07-03-mobile-audit-NOTES.md
  - .planning/phases/07-cross-pdp-mobile-polish/07-05-a11y-NOTES.md
must_haves:
  truths:
    - "Buybox product title renders as <h2> on all 3 PDPs (semantic-only change, zero visual regression)"
    - "HowItWorks step 01 copy reads as format-agnostic on all 3 PDPs — no longer 'Crew hands the card' framing"
    - "All 3 PDPs render clean at 375/414/768 px — no horizontal overflow, no console errors, no wave-divider ~40px gap symptom"
    - "FormatCompare 3-card grid stacks to 1-column at 375 px on all 3 PDPs"
    - "CR-80 gallery's 6-thumb row wraps cleanly with FormatCompare mounted (no clipping at right edge)"
    - "Keyboard tab order on all 3 PDPs follows DOM source order and skips disabled 'You're here' button"
    - "Heading outline on all 3 PDPs starts with h2 (Buybox title), then h2 section heads, then h3 step/FAQ"
    - "design-system-auditor returns PASS on every UI plan that touches .tsx"
    - "tsc --noEmit clean AND npm run build clean at phase close"
  artifacts:
    - path: "components/shmo-review/Buybox.tsx"
      provides: "Shared Buybox with corrected heading hierarchy (h2 on bb__title)"
      contains: "<h2 className=\"bb__title\">"
    - path: "components/shmo-review/HowItWorks.tsx"
      provides: "Shared HowItWorks with format-agnostic step 01 copy"
      contains: "REVIEW_HOW_STEPS"
    - path: ".planning/phases/07-cross-pdp-mobile-polish/07-03-mobile-audit-NOTES.md"
      provides: "Cross-PDP mobile audit findings at 375/414/768 px on all 3 PDPs"
      contains: "Mobile pass"
    - path: ".planning/phases/07-cross-pdp-mobile-polish/07-05-a11y-NOTES.md"
      provides: "Cross-PDP a11y final-check findings (tab order, heading outline, contrast spot-checks)"
      contains: "a11y pass"
    - path: ".planning/phases/07-cross-pdp-mobile-polish/07-SUMMARY.md"
      provides: "Phase 7 close-out summary"
      contains: "Exit criteria"
  key_links:
    - from: "components/shmo-review/Buybox.tsx"
      to: "all 3 PDPs (/shmo-review/cr-80, /l-sign, /square-card)"
      via: "shared default export — single edit propagates to all 3 PDPs identically"
      pattern: "<h2\\s+className=\"bb__title\">"
    - from: "components/shmo-review/HowItWorks.tsx"
      to: "all 3 PDPs (/shmo-review/cr-80, /l-sign, /square-card)"
      via: "shared default export — REVIEW_HOW_STEPS[0] edit propagates to all 3 PDPs identically"
      pattern: "REVIEW_HOW_STEPS"
---

# Phase 7 — Cross-PDP Mobile Polish

## Goal

Single coordinated mobile + a11y polish pass across all 3 PDPs (`/shmo-review/cr-80`, `/l-sign`, `/square-card`). Two known deferred shared-component issues land first: (1) Buybox heading hierarchy (h3 → h2), (2) HowItWorks step 01 format-agnostic copy. Then a Playwright sweep at 375 / 414 / 768 px on every PDP confirms no regressions from the Phase 6 FormatCompare mount. Final a11y sweep confirms keyboard tab order + heading outline + contrast across all 3 PDPs.

**LAYOUT IS LOCKED for the entire phase** — spacing / type / mascot scale / copy only. No grid changes, no section reorders, no tile-ratio shifts, no new components. Runs BEFORE Phase 8 Shopify wiring so any layout fight is against placeholder data, not real Shopify strings.

All `.tsx` / `.css` edits route through the `design-system-builder` subagent. The parent never writes UI code directly.

## Success criteria (TRUE = green)

1. `components/shmo-review/Buybox.tsx` line 191 renders `<h2 className="bb__title">` instead of `<h3>`. No CSS change needed — `bb__title` is tag-agnostic. Heading outline on all 3 PDPs starts with h2.
2. `components/shmo-review/HowItWorks.tsx` `REVIEW_HOW_STEPS[0]` reads as format-agnostic — title + body + details no longer assume crew-mediated handoff. Builder picks final wording within the format-agnostic constraint (default: "Put the card where customers can reach it").
3. PRE/POST screenshot diff on at least one representative PDP confirms zero visual regression from the Buybox h3→h2 edit.
4. PRE/POST screenshot diff on at least one representative PDP confirms zero visual regression from the HowItWorks step 01 copy edit (text-only delta in the rendered article).
5. Full-page Playwright screenshots of all 3 PDPs at 375 / 414 / 768 px saved to `pictures/screenshots/` (9 screenshots total in Plan 07-03).
6. No horizontal overflow at any width on any PDP — `document.documentElement.scrollWidth <= viewport.width` per breakpoint.
7. No console errors on any PDP at any breakpoint.
8. No wave-divider ~40px gap symptom on any PDP — every section uses `<Section bg=... nextBg=...>` (no hand-authored `<div className="shm-wave">` inside another component's JSX).
9. CR-80 gallery's 6-thumb strip wraps cleanly at 375 px with FormatCompare now mounted below (no clipping at right edge).
10. FormatCompare 3-card grid stacks to 1-column at 375 px on all 3 PDPs with correct `currentHandle` wiring ("You're here" on the current format's card on each PDP).
11. Keyboard tab order on each PDP follows DOM source order: Skip-link / Nav → Cart → Gallery thumbs → BB title (non-interactive) → Pack rows → Qty dec → Qty inc → ATC → FAQ → FormatCompare "You're here" (disabled, skipped) → FormatCompare "View product" links → Video play buttons → FinalCta links → Footer.
12. `design-system-auditor` returns PASS after every UI plan that touches `.tsx`.
13. `npx tsc --noEmit` clean after every plan with code changes.
14. `npm run build` clean at phase close — all routes statically generated.
15. No Shopify Admin writes, no domain / theme / payment touches, no `.env` changes. Phase 7 is local-only.

## Implementation strategy

**Land shared-component fixes first (single source of truth → all 3 PDPs benefit), screenshot the result, audit cross-PDP at mobile breakpoints, fix any drift, a11y final check, close.**

Order matters because Buybox.tsx and HowItWorks.tsx are SHARED — fixing them once produces the same change on all 3 PDPs. Auditing AFTER the fixes captures the final state for Phase 7's regression baseline. Auditing before would screenshot a state that's about to change.

1. **07-01 — Fix Buybox heading hierarchy (h3 → h2).** Single-character edit in `Buybox.tsx` line 191. `bb__title` CSS is tag-agnostic per RESEARCH.md — zero visual regression expected. PRE screenshots captured FIRST (CR-80 desktop + 375 px), edit lands, POST screenshots captured, diff confirms text-node-only delta. Dispatched through `design-system-builder` per `.claude/rules/subagent-dispatch.md`.
2. **07-02 — Fix HowItWorks step 01 format-agnostic copy.** Edit `REVIEW_HOW_STEPS[0]` `title` + `body` + `details` strings in `HowItWorks.tsx`. Text-only delta in rendered article — no class changes, no structural changes. PRE/POST screenshots on one representative PDP confirm zero layout shift. Builder picks final wording within format-agnostic constraint (default below). Dispatched through `design-system-builder` with explicit "copy-only edit — LAYOUT IS LOCKED" flag.
3. **07-03 — Cross-PDP mobile audit at 375 / 414 / 768 px.** Full-page Playwright screenshots × 3 PDPs × 3 breakpoints = 9 screenshots. Look for drift from Phase 5/6 mobile baselines + the CR-80-specific 6-thumb wrap concern. Document findings in `07-03-mobile-audit-NOTES.md`. No code changes in this plan — pure verification + reporting.
4. **07-04 — Polish iteration (conditional).** Only runs if 07-03 surfaces issues. LAYOUT IS LOCKED — spacing / type / mascot only. If clean, SKIP.
5. **07-05 — Cross-PDP a11y final check.** Verify keyboard tab order, heading outline (h2 first now), color contrast spot-checks across all 3 PDPs. Verify qty button touch target ≥ 44px (gap from Phase 5/6 notes). Document findings in `07-05-a11y-NOTES.md`. No code changes expected — surface bugs to Jordan if found.
6. **07-06 — Phase close-out.** `tsc` + `npm run build` clean. Update STATE.md, ROADMAP.md, handoff.md, scope.md. Write 07-SUMMARY.md. Recommend `/gsd-plan-phase 8` (Shopify Storefront wiring) next.

**All UI work goes through `design-system-builder`.** Polish (07-04) carries the explicit "this is a polish task — LAYOUT IS LOCKED" flag in the builder dispatch.

---

## Atomic plans

### 07-01 — Fix Buybox heading hierarchy (h3 → h2)

- **Goal:** Promote the Buybox product title from `<h3>` to `<h2>` in `components/shmo-review/Buybox.tsx` line 191. `bb__title` CSS is tag-agnostic — zero visual regression. Heading outline on all 3 PDPs now starts with h2 (Buybox title) before any section's h2 — correct WCAG 1.3.1 hierarchy. PRE/POST screenshots on CR-80 (representative PDP) confirm text-node-only delta in the rendered DOM.
- **Type:** `auto` → `design-system-builder` dispatch (LAYOUT IS LOCKED) → `design-system-auditor`
- **Files touched:**
  - `components/shmo-review/Buybox.tsx` (line 191 only — `h3` → `h2` tag swap, no other changes)
  - NO CSS changes (bb__title is tag-agnostic per RESEARCH.md)
  - NO changes to any PDP `page.tsx` file
- **Requirement IDs:** PH7-BUYBOX-H2, PH7-NO-REGRESSION
- **Builder prompt anchor:**

  > "Single-character semantic edit in `components/shmo-review/Buybox.tsx`. **LAYOUT IS LOCKED.** This is a shared component used by all 3 PDPs (CR-80, L-Sign, Square Card) — the edit propagates to all 3 identically.
  >
  > Current state (line 191):
  >
  > ```tsx
  > <h3 className=\"bb__title\">{product.title}</h3>
  > ```
  >
  > Required edit (line 191 only):
  >
  > ```tsx
  > <h2 className=\"bb__title\">{product.title}</h2>
  > ```
  >
  > Reason: the product title is the page-level subject on each PDP. There is no h1 or h2 above the Buybox on any PDP (verified by reading all 3 page.tsx files). The original h3 was an accident of porting from `review-buybox.jsx` which lived inside a page with an outer h1. WCAG 1.3.1 (info and relationships) prefers a continuous heading outline that doesn't invert (don't start with h3 before h2).
  >
  > Before edits: take a Playwright screenshot of `/shmo-review/cr-80` at desktop (1280px) → save to `pictures/screenshots/07-PRE-buybox-h2-cr80-desktop.png` and at mobile (375px) → `pictures/screenshots/07-PRE-buybox-h2-cr80-mobile.png`. CR-80 is the representative PDP because it carries the largest gallery (6 thumbs) — most sensitive to inadvertent layout shifts.
  >
  > After edits: take Playwright screenshots at same widths → `pictures/screenshots/07-POST-buybox-h2-cr80-desktop.png` and `pictures/screenshots/07-POST-buybox-h2-cr80-mobile.png`.
  >
  > Visual diff expectation: ZERO visual delta. The `bb__title` class controls all typography (font-family, size, weight, line-height, color). The DOM tag is the only thing that changes. If POST screenshots differ visually from PRE, the assumption was wrong — surface to Jordan before continuing.
  >
  > Do NOT:
  > - Modify any other line of `Buybox.tsx`.
  > - Modify any CSS file (bb__title is tag-agnostic).
  > - Modify any PDP page.tsx file.
  > - Modify any other component file.
  > - Wrap the h2 in any container or add any attribute beyond `className=\"bb__title\"`.
  > - Add `aria-level` or any other accessibility attribute (h2 already communicates level 2 semantically)."

- **Verification steps:**
  1. `npx tsc --noEmit` clean.
  2. `git diff --stat` shows only `components/shmo-review/Buybox.tsx` modified.
  3. `git diff components/shmo-review/Buybox.tsx` shows exactly 2 line changes: one deletion (`<h3 ...>` opening), one addition (`<h2 ...>` opening), and the matching closing tag swap. No other changes.
  4. `grep -n "<h2 className=\"bb__title\">" components/shmo-review/Buybox.tsx` returns exactly 1 match.
  5. `grep -n "<h3 className=\"bb__title\">" components/shmo-review/Buybox.tsx` returns 0 matches (old tag fully removed).
  6. Browser renders `/shmo-review/cr-80`, `/shmo-review/l-sign`, `/shmo-review/square-card` with Buybox title visually unchanged.
  7. DevTools Elements panel confirms the rendered tag is `H2` on all 3 PDPs.
  8. Playwright accessibility snapshot shows `heading "Google Review NFC ..." [level=2]` on each PDP's Buybox.
  9. PRE and POST screenshots saved at the 4 documented paths.
  10. PRE/POST visual diff (eyeball or pixel-diff): ZERO visual delta.
  11. No console errors on any PDP.
  12. `design-system-auditor` returns PASS — confirms no primitive restyles, no class changes, no Tailwind for visual concerns introduced.
- **Commit message format:** `a11y(buybox): promote product title from h3 to h2`

---

### 07-02 — Fix HowItWorks step 01 format-agnostic copy

- **Goal:** Edit `REVIEW_HOW_STEPS[0]` in `components/shmo-review/HowItWorks.tsx` so step 01 copy works for all 3 PDPs (CR-80 = crew handoff, L-Sign = self-serve standee, Square Card = adhesive disc). Text-only delta — no class changes, no structural HTML changes, no prop interface changes. Builder picks final wording within the format-agnostic constraint; default is "Put the card where customers can reach it" per RESEARCH.md Q2 Option A. PRE/POST screenshot on one representative PDP confirms zero layout shift.
- **Type:** `auto` → `design-system-builder` dispatch flagged "copy-only edit — LAYOUT IS LOCKED" → `design-system-auditor`
- **Files touched:**
  - `components/shmo-review/HowItWorks.tsx` (`REVIEW_HOW_STEPS[0]` const only — `title`, `body`, `details` string values)
  - NO changes to the `REVIEW_HOW_STEPS` type, the `screen` value (`"handoff"`), the `n` value (`"01"`), or the array structure
  - NO changes to the `PhoneScreen` component (the `"handoff"` screen visual stays as-is)
  - NO changes to any PDP page.tsx file
  - NO CSS changes
- **Requirement IDs:** PH7-HOWITWORKS-COPY, PH7-NO-REGRESSION
- **Builder prompt anchor:**

  > "Copy-only edit to `REVIEW_HOW_STEPS[0]` in `components/shmo-review/HowItWorks.tsx`. **LAYOUT IS LOCKED.** This is a shared component used by all 3 PDPs — the copy edit propagates to all 3 identically. Only the `title`, `body`, and `details` STRING VALUES of the first array entry change. The `n` (`\"01\"`), `screen` (`\"handoff\"`), and array structure stay exactly as-is. The `PhoneScreen` component's `\"handoff\"` visual stays unchanged.
  >
  > Current state (lines 20-26):
  >
  > ```ts
  > {
  >   n: \"01\",
  >   title: \"Crew hands the card\",
  >   body: \"After every transaction, an employee hands the customer the card. The ask happens at the right moment — when the customer is happy.\",
  >   screen: \"handoff\",
  >   details: [\"Best after checkout\", \"Lives with the crew\", \"No counter card\"],
  > },
  > ```
  >
  > Required edit — the new copy must be FORMAT-AGNOSTIC. It must read correctly on:
  > - **CR-80** (wallet-size card, often crew-handed)
  > - **L-Sign** (self-serve counter standee, no staff handoff needed)
  > - **Square Card** (adhesive disc on any surface, customer self-initiates)
  >
  > Default copy (proposed in RESEARCH.md Q2 Option A — builder may polish if a tighter phrasing fits the design-system voice):
  >
  > ```ts
  > {
  >   n: \"01\",
  >   title: \"Put the card where customers can reach it\",
  >   body: \"After the transaction — or right at the counter — your NFC card is there. The ask happens at the right moment, when the customer is happy.\",
  >   screen: \"handoff\",
  >   details: [\"Works at checkout\", \"Self-serve or crew-assisted\", \"No app needed\"],
  > },
  > ```
  >
  > Voice constraints (from `.claude/skills/shmocard-design-system/README.md`):
  > - No exclamation marks.
  > - No emoji as decoration.
  > - Short, declarative, US English.
  > - \"Customers\" not \"users.\" Verbs over nouns.
  >
  > Builder may rewrite within these constraints if a tighter phrasing reads cleaner — surface the final wording in the auditor handoff. The semantic target: step 01 reads true whether the customer is being handed a card (CR-80), walking up to a standee (L-Sign), or noticing a disc stuck on a surface (Square Card).
  >
  > Before edits: take a Playwright screenshot of `/shmo-review/l-sign` (representative PDP — its self-serve framing was the original mismatch) at desktop (1280px, full page) → `pictures/screenshots/07-PRE-howitworks-step01-l-sign-desktop.png` and at mobile (375px, full page) → `pictures/screenshots/07-PRE-howitworks-step01-l-sign-mobile.png`.
  >
  > After edits: take Playwright screenshots at same widths → `pictures/screenshots/07-POST-howitworks-step01-l-sign-desktop.png` and `pictures/screenshots/07-POST-howitworks-step01-l-sign-mobile.png`.
  >
  > Visual diff expectation: text content of step 01's title + body + details items changes. EVERYTHING ELSE on the page stays pixel-identical — no spacing shifts, no wrap differences in adjacent sections, no PhoneScreen changes. If anything outside the step-01 article shifts, surface to Jordan.
  >
  > Do NOT:
  > - Modify the `Screen` type (`\"handoff\" | \"tap\" | \"review\" | \"submitted\"`).
  > - Modify the `n`, `screen` values of step 01.
  > - Modify steps 02, 03, 04 (their copy already works across all 3 formats).
  > - Modify the `PhoneScreen` component (the `\"handoff\"` visual — hand + card SVG — stays as-is).
  > - Modify the `bgs` or `nextBgs` arrays.
  > - Add new props to the component (the prop-driven approach from RESEARCH.md Q2 Option B is out of scope for Phase 7 — locked decision is Option A).
  > - Modify any class names or structural JSX.
  > - Add or remove any `<li>` from the `details` array (3 items stays 3 items)."

- **Verification steps:**
  1. `npx tsc --noEmit` clean.
  2. `git diff --stat` shows only `components/shmo-review/HowItWorks.tsx` modified.
  3. `git diff components/shmo-review/HowItWorks.tsx` shows changes ONLY within the `REVIEW_HOW_STEPS[0]` object — `title`, `body`, `details` string values only. No type changes, no structural changes.
  4. `grep -n "Crew hands the card" components/shmo-review/HowItWorks.tsx` returns 0 matches.
  5. `grep -n "Lives with the crew" components/shmo-review/HowItWorks.tsx` returns 0 matches (old details items fully removed).
  6. The `screen: "handoff"` line is still present and unchanged.
  7. The `n: "01"` line is still present and unchanged.
  8. `REVIEW_HOW_STEPS` still has 4 entries (steps 01-04).
  9. Browser renders `/shmo-review/cr-80`, `/shmo-review/l-sign`, `/shmo-review/square-card` — each shows the new step 01 copy in the first HowItWorks section.
  10. New copy reads true on all 3 PDPs (eyeball check: does it match the format on each page?). No exclamation marks, no emoji.
  11. The PhoneScreen "handoff" visual (hand + card SVG) renders unchanged.
  12. PRE and POST screenshots saved at the 4 documented paths. PRE/POST visual diff: only step 01's text changes; everything else stays pixel-identical.
  13. No console errors on any PDP.
  14. `design-system-auditor` returns PASS — confirms text-only edit, no class changes, no primitive restyles.
- **Commit message format:** `polish(how-it-works): make step 01 copy format-agnostic across PDPs`

---

### 07-03 — Cross-PDP mobile audit at 375 / 414 / 768 px

- **Goal:** Full Playwright sweep across all 3 PDPs at 375 / 414 / 768 px. Capture 9 full-page screenshots (3 PDPs × 3 breakpoints). Look for any drift from Phase 5/6 baselines (which already passed clean) — primarily the CR-80 6-thumb gallery wrap with FormatCompare now mounted, and FormatCompare consistency across all 3 PDPs. Document findings in a working note file. No code changes in this plan — pure verification + reporting. If issues found, surface to 07-04; if clean, 07-04 is skipped.
- **Type:** `auto` → `design-system-builder` dispatch (audit-only, no code edits) → `design-system-auditor` not required (no UI changes)
- **Files touched:**
  - `.planning/phases/07-cross-pdp-mobile-polish/07-03-mobile-audit-NOTES.md` (NEW — working note with audit findings)
  - 9 PNG files in `pictures/screenshots/` (see paths below)
  - NO `.tsx` or `.css` changes in this plan
- **Requirement IDs:** PH7-MOBILE-AUDIT, PH7-NO-REGRESSION
- **Builder prompt anchor:**

  > "Cross-PDP mobile audit. **NO CODE CHANGES IN THIS PLAN.** Pure verification + screenshot capture + notes file. If issues are found, document them — do NOT fix them inline; surface to the parent for routing to plan 07-04.
  >
  > Required full-page Playwright screenshots (use `--full-page` flag to avoid the sticky-nav screenshot artifact noted in Phase 6):
  >
  > **CR-80 PDP** (`/shmo-review/cr-80`):
  > - 375 × 812 → `pictures/screenshots/07-mobile-cr-80-375.png`
  > - 414 × 896 → `pictures/screenshots/07-mobile-cr-80-414.png`
  > - 768 × 1024 → `pictures/screenshots/07-mobile-cr-80-768.png`
  >
  > **L-Sign PDP** (`/shmo-review/l-sign`):
  > - 375 × 812 → `pictures/screenshots/07-mobile-l-sign-375.png`
  > - 414 × 896 → `pictures/screenshots/07-mobile-l-sign-414.png`
  > - 768 × 1024 → `pictures/screenshots/07-mobile-l-sign-768.png`
  >
  > **Square Card PDP** (`/shmo-review/square-card`):
  > - 375 × 812 → `pictures/screenshots/07-mobile-square-card-375.png`
  > - 414 × 896 → `pictures/screenshots/07-mobile-square-card-414.png`
  > - 768 × 1024 → `pictures/screenshots/07-mobile-square-card-768.png`
  >
  > Per-PDP, per-breakpoint, verify (use RESEARCH.md Q3 checklist):
  >
  > | Section | What to verify |
  > |---|---|
  > | Buybox — gallery | Main image fills content width. Thumbs wrap cleanly. **CR-80 specifically: 6 thumbs may wrap to 2 rows — verify no thumb clips at the right edge.** L-Sign: 3 thumbs. Square: 5 thumbs. |
  > | Buybox — pack rows | All 4 rows visible. No horizontal overflow. Heights consistent with Phase 5/6 baseline. |
  > | Buybox — qty + ATC | ATC full-width. Qty stepper rendered. |
  > | Buybox — FAQ | All 4 accordion items visible. |
  > | Wave dividers | No ~40px gap symptom between any sections. |
  > | Proof | Single-column. No overflow. |
  > | CrewStrip | No horizontal scroll bleed. |
  > | HowItWorks | 4 alternating sections, single-column, phone frame fits within content width at 375. **Verify step 01's NEW format-agnostic copy renders correctly.** |
  > | FormatCompare | 3-card grid stacks to 1-column at 375. \"You're here\" button visible (38px → 44px verified fixed in Phase 6). Active card matches the current PDP (CR-80 card on /cr-80, etc). |
  > | VideoTestimonials | No overflow. Disabled button states visible. |
  > | FinalCta | CTA buttons stack correctly. |
  > | Horizontal overflow check | `document.documentElement.scrollWidth <= viewport.width` per breakpoint per PDP. |
  > | Console errors | Zero errors at every breakpoint on every PDP. |
  >
  > **Cross-PDP FormatCompare wiring spot-check** (verify `currentHandle` is correct on each PDP):
  >
  > | PDP | Expected \"You're here\" target | Other 2 cards must link to |
  > |---|---|---|
  > | /shmo-review/cr-80 | CR-80 card | /shmo-review/l-sign, /shmo-review/square-card |
  > | /shmo-review/l-sign | L-Sign card | /shmo-review/cr-80, /shmo-review/square-card |
  > | /shmo-review/square-card | Square Card card | /shmo-review/cr-80, /shmo-review/l-sign |
  >
  > **Verify Buybox heading hierarchy fix (from 07-01) holds:** DevTools / Playwright accessibility snapshot shows Buybox product title rendered as `<h2>` on all 3 PDPs.
  >
  > **Verify HowItWorks step 01 copy fix (from 07-02) holds:** All 3 PDPs show the new format-agnostic copy in step 01.
  >
  > Document findings in `.planning/phases/07-cross-pdp-mobile-polish/07-03-mobile-audit-NOTES.md` using the same table format as Phase 5's `05-06-mobile-a11y-NOTES.md` and Phase 6's `06-07-mobile-a11y-NOTES.md`. Include:
  > - Per-PDP, per-breakpoint section-level pass/fail table.
  > - Cross-PDP FormatCompare wiring confirmation.
  > - Heading hierarchy + step 01 copy fix confirmations.
  > - Any unexpected drift from Phase 5/6 baselines (RESEARCH.md Q4 anticipated this is LOW risk; if found, surface to parent for 07-04 routing).
  > - Final note: 'no fixes needed — proceed to 07-05' OR 'fixes needed — see surfaced items'.
  >
  > Do NOT:
  > - Edit any `.tsx` file.
  > - Edit any `.css` file.
  > - Edit any PDP page.tsx.
  > - Edit any component.
  > - Capture element-bounding-box screenshots of FormatCompare (use full-page only — element captures show the sticky-nav overlap artifact noted in Phase 6 / RESEARCH.md Pitfall 3)."

- **Verification steps:**
  1. All 9 full-page screenshots saved at documented paths.
  2. `07-03-mobile-audit-NOTES.md` exists with per-PDP, per-breakpoint section-level audit table.
  3. CR-80 6-thumb wrap explicitly verified — pass or fail noted in the file.
  4. FormatCompare `currentHandle` wiring verified on all 3 PDPs — pass or fail noted in the file.
  5. Buybox h2 hierarchy confirmed visible on all 3 PDPs (post-07-01).
  6. HowItWorks step 01 new copy confirmed visible on all 3 PDPs (post-07-02).
  7. Notes file's final line is either "no fixes needed — proceed to 07-05" or "fixes needed — see surfaced items".
- **Commit message format:** `docs(phase-7): cross-PDP mobile audit notes + screenshots`
- **Skip rule:** This plan never skips — it's the regression gate.

---

### 07-04 — Polish iteration (conditional — only runs if 07-03 surfaces issues)

- **Goal:** Apply fixes for any drift surfaced in 07-03. LAYOUT IS LOCKED — spacing / type / mascot scale / color-token swaps only. Most likely targets: `app/shmo-review/shmo-review.css` (page-level layout-only tweaks), possibly `components/shmo-review/FormatCompare.tsx` (if cross-PDP mobile drift found there — affects all 3 PDPs at once). Do NOT touch `Buybox.tsx` or `HowItWorks.tsx` again after 07-01 / 07-02 unless 07-03 surfaces a specific regression from those plans.
- **Type:** `auto` → `design-system-builder` dispatch flagged "polish task — LAYOUT IS LOCKED" → `design-system-auditor`
- **Files touched:** Whichever files 07-03 names. Most likely candidates: `app/shmo-review/shmo-review.css` (page-level layout-only spacing), possibly `components/shmo-review/FormatCompare.tsx`. DO NOT touch `.claude/skills/shmocard-design-system/components.css` (primitive CSS — separate scope review required).
- **Requirement IDs:** PH7-NO-REGRESSION
- **Builder prompt anchor:**

  > "This is a polish task — LAYOUT IS LOCKED. Do NOT change grid columns, element ordering, tile size ratios, or structural HTML on any Phase 7 surface. Allowed changes: spacing (padding / margin / gap), type sizing (within existing scale), color token swaps (within design-system tokens — `--color-marsh`, `--color-cream`, `--color-ember`, `--color-cocoa`, `--color-honey`).
  >
  > Findings from 07-03 mobile audit (verbatim, see `.planning/phases/07-cross-pdp-mobile-polish/07-03-mobile-audit-NOTES.md`):
  >
  > [REPLACE WITH 07-03 SURFACED ITEMS AT EXECUTION TIME]
  >
  > Hard constraints:
  > - DO NOT touch `components/shmo-review/Buybox.tsx`. The h2 fix from 07-01 is final.
  > - DO NOT touch `components/shmo-review/HowItWorks.tsx`. The step 01 copy fix from 07-02 is final.
  > - DO NOT modify primitive CSS (`.claude/skills/shmocard-design-system/components.css`). If a primitive CSS change is needed, surface to parent — requires Jordan approval like the `.shm-btn--sm` fix in Phase 6.
  > - DO NOT introduce new primitives. Compose existing ones.
  > - DO NOT introduce Tailwind utilities for color, type, radius, shadow, or motion.
  > - DO NOT introduce hex colors outside inline SVG.
  > - DO NOT introduce or modify mascots.
  >
  > Reference the existing 07-03 screenshots in `pictures/screenshots/07-mobile-*.png` as the baseline you are polishing FROM. After polish lands, re-capture screenshots to the same paths and confirm with Jordan."

- **Verification steps:**
  1. `npx tsc --noEmit` clean.
  2. `design-system-auditor` returns PASS — confirms no structural HTML changed, no class names invented, no primitives restyled.
  3. Re-captured screenshots show only the polish delta, not layout changes.
  4. Issues from 07-03 resolved or explicitly deferred with Jordan approval.
- **Commit message format:** `polish(phase-7): <specific fix>` (e.g., `polish(phase-7): tighten gallery thumb wrap at 375px`)
- **Skip rule:** If 07-03's notes file final line reads "no fixes needed — proceed to 07-05", SKIP this plan entirely.

---

### 07-05 — Cross-PDP a11y final check

- **Goal:** Verify a11y compliance across all 3 PDPs now that the heading-hierarchy fix has landed. Confirm keyboard tab order matches DOM source order, heading outline starts with h2 (Buybox) on all 3 PDPs, color contrast spot-checks pass on dark sections, qty button touch targets meet 44px minimum. Document findings in `07-05-a11y-NOTES.md`. No code changes expected — if a touch-target or other primitive-level gap is found, surface to Jordan for separate-scope decision (like the Phase 6 `.shm-btn--sm` fix).
- **Type:** `auto` → `design-system-builder` dispatch (audit-only, no code edits) → no auditor required (no UI changes expected)
- **Files touched:**
  - `.planning/phases/07-cross-pdp-mobile-polish/07-05-a11y-NOTES.md` (NEW — working note with a11y findings)
  - NO `.tsx` or `.css` changes expected in this plan (any primitive-level fix gets surfaced, not silently applied)
- **Requirement IDs:** PH7-A11Y-FINAL, PH7-BUYBOX-H2
- **Builder prompt anchor:**

  > "Cross-PDP a11y final check. **NO CODE CHANGES IN THIS PLAN.** Pure verification + notes file. If any primitive-level issue is found (e.g., touch target < 44px on a design-system class), document it and surface to parent — do NOT modify primitive CSS inline. Same protocol Phase 6 used for the `.shm-btn--sm` fix.
  >
  > For each PDP (`/shmo-review/cr-80`, `/shmo-review/l-sign`, `/shmo-review/square-card`), capture an accessibility snapshot via Playwright and verify the following:
  >
  > **1. Heading outline (post-07-01 h2 fix):**
  >
  > Expected outline per PDP after the h2 promotion:
  >
  > ```
  > h2  — product title (Buybox)
  >   h3  — HowItWorks step titles (4 of them)
  > h2  — \"From handoff to five stars\" (HowItWorks section head, step 01 only)
  > h2  — Proof section
  > h2  — CrewStrip / ProofTiles
  > h2  — FormatCompare (\"Not sure this is the right one?\")
  >   h3  — FormatCompare card titles (3 of them: CR-80 Card, L-Sign Standee, Square Card Disc)
  > h2  — VideoTestimonials
  > h2  — FinalCta
  > h4  — Footer
  > ```
  >
  > Note: the exact section order + heading levels per PDP may vary slightly — record what's actually rendered. The key check is: the FIRST heading in the document outline is `h2` (Buybox title), NOT `h3`.
  >
  > **2. Keyboard tab order (per PDP):**
  >
  > Expected DOM-order tab sequence:
  > 1. Skip-link (if present)
  > 2. Nav logo
  > 3. Nav menu toggle
  > 4. Cart button
  > 5. Gallery thumb buttons (left to right)
  > 6. (Buybox product title — non-interactive, skipped)
  > 7. Pack-row radios (top to bottom)
  > 8. Qty decrease
  > 9. Qty increase
  > 10. ATC button
  > 11. FAQ triggers (top to bottom — 4 of them)
  > 12. FormatCompare \"You're here\" button — disabled, **must be skipped by tab focus** (verify HTML `disabled` attr is present, not just `aria-disabled`)
  > 13. FormatCompare \"View product\" links (2 of them, left to right of non-current cards)
  > 14. Video play buttons
  > 15. FinalCta CTA links
  > 16. Footer social links + nav links
  >
  > Tab through each PDP in browser DevTools or via Playwright `page.keyboard.press('Tab')` repeatedly — record the actual focus sequence, compare to expected. Flag any mismatches.
  >
  > **3. Color contrast spot-checks:**
  >
  > Use Chrome DevTools \"Color contrast\" audit on the following text-on-bg combos (one PDP is enough — Square Card recommended since it's the newest):
  > - Buybox h2 title (cocoa-deep on marsh) — expect WCAG AA pass
  > - Pack-row name + price (cocoa-deep on cream pack-row bg) — expect AA pass
  > - HowItWorks step badge (ember badge text) — expect AA pass
  > - FormatCompare \"You're here\" button text (disabled state) — verify ≥ 3:1 against cream card bg
  > - FinalCta CTA text on ember bg — expect AA pass
  > - Footer text on cocoa-deep bg — expect AA pass
  >
  > **4. Qty button touch target (gap from Phase 5/6 — RESEARCH.md OQ-2):**
  >
  > Measure `.shm-qty__btn` rendered height in DevTools or Playwright. Required: ≥ 44px (WCAG 2.5.5). If < 44px, surface to parent — this is a `components.css` primitive fix, same protocol as Phase 6's `.shm-btn--sm` change. Do NOT modify primitive CSS in this plan.
  >
  > **5. FAQ aria-expanded check (gap from Phase 5/6 — RESEARCH.md OQ-4):**
  >
  > Verify FAQ trigger buttons communicate expanded state. Open one in browser, inspect the DOM — `aria-expanded` attribute should toggle between `\"true\"` (open) and `\"false\"` (closed). `Buybox.tsx` line 321 confirms this is wired; verify it actually serializes to the rendered DOM.
  >
  > **6. Sanity check — disabled `aria-current` not needed:**
  >
  > FormatCompare's \"You're here\" button is disabled. RESEARCH.md confirms it has both HTML `disabled` and `aria-disabled=\"true\"`. Verify both present in rendered DOM.
  >
  > Document findings in `.planning/phases/07-cross-pdp-mobile-polish/07-05-a11y-NOTES.md` using the same table format as `06-07-mobile-a11y-NOTES.md`. Include:
  > - Heading outline check per PDP (PASS / FAIL).
  > - Keyboard tab order check per PDP (PASS / FAIL with any deviations from expected).
  > - Color contrast spot-check results.
  > - Qty button touch target measurement (specific pixel value).
  > - FAQ aria-expanded check.
  > - Final line: 'no fixes needed — phase 7 ready to close' OR 'surfaced items: [list]'.
  >
  > Do NOT:
  > - Edit any `.tsx` file.
  > - Edit any `.css` file.
  > - Edit any PDP page.tsx.
  > - Edit any component."

- **Verification steps:**
  1. `07-05-a11y-NOTES.md` exists with all 6 audit sections.
  2. Heading outline confirmed h2-first on all 3 PDPs (verifies 07-01 fix delivered).
  3. Keyboard tab order PASS or specific deviations noted on all 3 PDPs.
  4. Color contrast spot-checks complete.
  5. Qty button touch target measurement recorded with specific pixel value.
  6. FAQ aria-expanded check recorded.
  7. Notes file's final line is either "no fixes needed — phase 7 ready to close" or "surfaced items: [list]".
  8. No `.tsx` or `.css` files modified (git diff confirms).
- **Commit message format:** `docs(phase-7): cross-PDP a11y final check notes`
- **Skip rule:** This plan never skips — it's the a11y gate.

---

### 07-06 — Phase close-out

- **Goal:** Final sweep. `tsc` + build clean, regression smoke test passes on all 3 PDPs, STATE / ROADMAP / handoff / scope / SUMMARY updated. Phase 7 closed. Recommend `/gsd-plan-phase 8` (Shopify Storefront wiring) next.
- **Type:** `checkpoint:human-verify` (close-out)
- **Files touched:**
  - `.planning/STATE.md` (status update — Phase 7 complete, Phase 8 ready)
  - `.planning/ROADMAP.md` (mark Phase 7 `[x] complete`, add completion date)
  - `context/general/handoff.md` (Phase 7 close summary)
  - `context/general/scope.md` (update live punch list — Phase 7 done, Phase 8 next)
  - `.planning/phases/07-cross-pdp-mobile-polish/07-SUMMARY.md` (NEW — phase close)
- **Requirement IDs:** PH7-TSC, PH7-BUILD
- **Verification steps:**
  1. `npx tsc --noEmit` clean.
  2. `npm run build` clean (no build errors, no static-generation failures). All routes statically generated.
  3. Build output shows all 3 PDPs' route sizes ≈ matching (they should ALL be ~192 B since they share Buybox + HowItWorks + below-fold sections; the h2 + copy edits are semantic / text-only and don't change bundle size).
  4. Dev server running. Smoke test in order: `/`, `/shmo-review`, `/shmo-review/cr-80`, `/shmo-review/l-sign`, `/shmo-review/square-card`. Each loads without console errors at desktop AND mobile.
  5. Confirm Buybox renders h2 product title on all 3 PDPs (DevTools Elements panel).
  6. Confirm HowItWorks step 01 shows new format-agnostic copy on all 3 PDPs.
  7. Confirm FormatCompare still mounted on all 3 PDPs with correct `currentHandle` wiring.
  8. Update `.planning/STATE.md` → "Phase 7 complete, Phase 8 (Shopify Storefront wiring) ready."
  9. Update `.planning/ROADMAP.md` → mark Phase 7 `[x] complete`, add completion date `2026-05-20` (or actual completion date).
  10. Update `context/general/handoff.md` with Phase 7 close summary: Buybox h2 fix, HowItWorks step 01 format-agnostic copy, cross-PDP mobile audit clean, a11y final check clean, all 3 PDPs ready for Phase 8 Shopify wiring.
  11. Update `context/general/scope.md` punch-list: Phase 7 → done, Phase 8 → next.
  12. Write `.planning/phases/07-cross-pdp-mobile-polish/07-SUMMARY.md` with: what shipped (Buybox h2, HowItWorks step 01 copy, cross-PDP audit + a11y notes), what didn't ship (any items surfaced to Jordan for separate-scope decisions — qty button touch target if < 44px, etc.), atomic plan status table (07-01 through 07-06 with commit hashes), exit criteria check.
- **Checkpoint:** Jordan confirms phase exit criteria pass. Phase 7 closed. Recommend `/gsd-plan-phase 8` next.
- **Commit message format:** `chore(phase-7): close out cross-PDP mobile polish phase`

---

## Open decisions

Locked decisions from the user (2026-05-20) are baked in and not re-litigable:

1. ✅ **Buybox heading hierarchy — Option A (promote h3 → h2)** — LOCKED. One-line edit; `bb__title` is tag-agnostic; zero visual regression expected.
2. ✅ **HowItWorks step 01 — Option A (format-agnostic rewrite)** — LOCKED. Text-only edit to `REVIEW_HOW_STEPS[0]`. Builder picks final wording within format-agnostic constraint; default proposal: "Put the card where customers can reach it" + matching body + details.
3. ✅ **Phase 7 scope: verification-heavy** — LOCKED. Mobile audit is mostly confirmation since Phase 5 + 6 already passed clean. Net-new checks: CR-80 6-thumb wrap with FormatCompare mounted, FormatCompare cross-PDP consistency at 375 px.
4. ✅ **`.shm-btn--sm` 44px fix already shipped in Phase 6** — LOCKED. Not re-litigated in Phase 7.
5. ✅ **LAYOUT IS LOCKED** for entire phase — LOCKED. Spacing / type / mascot / copy only.
6. ✅ **All UI work routes through `design-system-builder`** — LOCKED per `.claude/rules/subagent-dispatch.md`.

Unresolved items resolved in execution (not Jordan-blocking):

7. **Builder's final wording on HowItWorks step 01** — Default is RESEARCH.md Option A wording; builder may polish within voice constraints (no exclamation marks, no emoji, US English, customers not users). Surface final wording in auditor handoff.
8. **Qty button touch target measurement** — Measured in 07-05. If ≥ 44px, no action. If < 44px, surface to Jordan as separate-scope decision (same protocol as Phase 6 `.shm-btn--sm` fix). Default assumption: PASS until measurement says otherwise.

---

## Risks

1. **Buybox h2 promotion has unexpected visual side-effect.** Mitigation: `bb__title` is tag-agnostic per RESEARCH.md (all typography lives in the class, not the tag). PRE/POST screenshots in 07-01 confirm. If visual delta appears, surface to Jordan before continuing.
2. **HowItWorks step 01 copy creates unintended layout shift.** Mitigation: text-only edit, no class changes; PRE/POST screenshots on L-Sign (representative PDP) confirm zero layout-shift in adjacent sections. If the new copy is longer / shorter and changes wrap behavior, the builder can iterate within the format-agnostic constraint.
3. **Cross-PDP mobile audit surfaces a regression in shared component.** Highest risk in the phase — Buybox + HowItWorks + FormatCompare are SHARED. A regression on one PDP means a regression on all 3. Mitigation: 07-03 documents findings centrally; 07-04 polish (if needed) is gated through `design-system-builder` with LAYOUT IS LOCKED flag; primitive CSS changes (`components.css`) require Jordan approval per Phase 6 protocol.
4. **CR-80 6-thumb gallery wrap clips at 375 px.** RESEARCH.md Q4 medium-risk item. Mitigation: 07-03 captures full-page screenshot at 375 px and explicitly verifies thumb-strip wrap. If clipping found, route to 07-04 polish.
5. **Qty button touch target < 44px (RESEARCH.md OQ-2).** Low-probability since Phase 5/6 didn't surface this. If found in 07-05, surface to Jordan — `.shm-qty__btn` is in `components.css` (primitive change), same scope-review protocol as Phase 6 `.shm-btn--sm` fix.
6. **FAQ `aria-expanded` doesn't serialize to DOM (RESEARCH.md OQ-4).** `Buybox.tsx` line 321 wires it; verify rendered DOM contains the attribute when FAQ is open. If missing, fix Buybox.tsx in a separate scope (would touch a shared component that already had its 07-01 fix — needs Jordan sign-off).
7. **FormatCompare `currentHandle` mis-wired on a PDP.** Low risk — verified in Phase 6's 06-05 checkpoint. 07-03 re-verifies as part of the mobile audit.
8. **Wave-divider sibling regression (recurring — 5h debug in Phase 3 memory).** Mitigation: every section uses `<Section>` from `components/layout/Section.tsx` which renders the wave as a Fragment sibling. 07-03 watches for the ~40px-sliver symptom on all 3 PDPs at all 3 breakpoints.
9. **Builder restructures layout during polish (07-04).** MEMORY rule: LAYOUT IS LOCKED on polish tasks. The 07-04 builder prompt carries the explicit flag. `design-system-auditor` verifies no structural HTML changes.
10. **Heading outline change breaks screen-reader announcement order.** ASVS L1 a11y concern from the security threat model. Mitigation: the h3 → h2 change *improves* the outline (no inversion); 07-05 captures Playwright accessibility snapshot on all 3 PDPs and verifies the rendered outline matches the expected hierarchy. If a screen-reader-specific regression is found, surface to Jordan.
11. **Builder picks awkward wording on HowItWorks step 01.** Mitigation: voice constraints documented in 07-02 prompt; auditor verifies no exclamation marks / emoji; Jordan can re-route to a polish edit if the rendered copy reads off.
12. **Phase 7 scope creep into Phase 8 (Shopify wiring).** Mitigation: ROADMAP locks Phase 8 as the next phase; Phase 7 is verification + 2 small text-level fixes. If the audit surfaces something only Shopify-data wiring can fix (e.g., long product titles overflow), document in 07-03 / 07-05 and route to Phase 8 — do NOT fix in Phase 7 with placeholder data.

---

## Threat model

**Trust boundaries:**

| Boundary | Description |
|---|---|
| Browser → DOM | Static + Zustand client state; no user input persisted server-side in Phase 7 (zero new server surface — text edits to existing shared components only) |
| Render → screen-reader announcement | Buybox `<h2>` change communicates heading level 2 to assistive tech across all 3 PDPs; tag swap is the only DOM-tag mutation in the phase |
| Render → semantic outline | HowItWorks step 01 text content changes; structural HTML stays identical |
| Phase 7 → Phase 8 (downstream) | Phase 7 hardens cross-PDP polish BEFORE real Shopify product strings land — text edits to placeholder copy must not bake in length assumptions that break with real Shopify titles |

**STRIDE register (ASVS L1, project default = block on `high` only):**

| Threat ID | Category | Component | Disposition | Mitigation |
|---|---|---|---|---|
| T-07-01 | Tampering (shared-component regression — Buybox h2 propagates to all 3 PDPs) | `components/shmo-review/Buybox.tsx` line 191 | mitigate | 07-01 captures PRE / POST Playwright screenshots on CR-80 (representative PDP — largest gallery, most layout-sensitive). `git diff` confirms only h3 → h2 tag swap, no class / CSS / structural changes. `design-system-auditor` PASS confirms primitive discipline holds. Browser smoke test on all 3 PDPs verifies title still renders identically. |
| T-07-02 | Tampering (shared-component regression — HowItWorks step 01 copy propagates to all 3 PDPs) | `components/shmo-review/HowItWorks.tsx` `REVIEW_HOW_STEPS[0]` | mitigate | 07-02 captures PRE / POST Playwright screenshots on L-Sign (representative PDP — its self-serve framing was the original mismatch source). `git diff` confirms changes are confined to `REVIEW_HOW_STEPS[0]` string values; no type / structural / class changes. Builder voice constraints (no exclamation marks, no emoji, US English) verified by auditor. |
| T-07-03 | Information Disclosure / Spoofing (a11y heading-outline regression) | All 3 PDPs after 07-01 | mitigate | The h3 → h2 promotion fixes a WCAG 1.3.1 (info and relationships) inversion. 07-05 verifies the post-fix outline on all 3 PDPs starts with h2 (Buybox), then h2 section heads, then h3 step / FAQ. Playwright accessibility snapshot serializes the rendered outline. |
| T-07-04 | Tampering (mobile audit drift — Phase 6 → Phase 7 baseline shift) | Cross-PDP renders at 375 / 414 / 768 px | mitigate | 07-03 captures fresh full-page screenshots at all 3 breakpoints on all 3 PDPs and compares against Phase 5 / 6 mobile-a11y notes baselines. Drift surfaces to 07-04 polish iteration; no silent fixes. |
| T-07-05 | Repudiation (qty button touch target gap from Phase 5/6) | `components.css` `.shm-qty__btn` primitive | mitigate | 07-05 measures rendered height with explicit pixel value. If < 44px, surfaced to Jordan for separate-scope decision (matches Phase 6 `.shm-btn--sm` 38px → 44px protocol). No silent primitive-CSS edits. |
| T-07-06 | Tampering (FAQ aria-expanded not serializing to rendered DOM) | Buybox `Buybox.tsx` line 321 | mitigate | 07-05 inspects rendered DOM with FAQ open. If attribute missing, surface as a separate Buybox.tsx scope (would re-open a shared component after 07-01 — needs Jordan sign-off). |
| T-07-07 | Information Disclosure (Playwright screenshot leaks env / token data) | `pictures/screenshots/` | accept | Screenshots are of localhost dev server with placeholder data + `TODO(shopify):` markers. No real Shopify tokens, no real customer data, no production URL. Screenshots routinely committed in prior phases without incident. |
| T-07-08 | Denial of Service (Phase 7 changes degrade page load) | All 3 PDPs | accept | Phase 7 changes are: 1 tag swap, 1 const string-value edit, audit notes files. No bundle-size impact, no new client code, no new dependencies. `npm run build` route-size check at 07-06 confirms ≈ identical to Phase 6 baseline. |
| T-07-09 | Elevation of Privilege (auth) | N/A | accept | No auth surface in Phase 7. No server actions modified. No new API routes. |
| T-07-10 | Spoofing (HowItWorks step 01 copy misleads about format capabilities) | `HowItWorks.tsx` step 01 text | mitigate | Format-agnostic wording must read true on all 3 formats (CR-80 / L-Sign / Square Card). Verification 07-03 step 9 confirms by eyeball check on all 3 PDPs. Builder voice constraints + auditor PASS bound the wording. |
| T-07-11 | Tampering (FormatCompare `currentHandle` mis-wired) | `app/shmo-review/*/page.tsx` files | mitigate | Already verified in Phase 6 06-05 checkpoint. 07-03 re-verifies as part of the cross-PDP audit — table explicitly checks "You're here" target matches the active PDP. |
| T-07-12 | Tampering (wave-divider gap regression) | `<Section>` usage across all 3 PDPs | mitigate | Every section uses `<Section bg=... nextBg=...>` from `components/layout/Section.tsx` which renders the wave as a Fragment sibling. 07-03 watches for ~40px-sliver symptom at all 3 breakpoints. |

**Block-on:** `high` severity only. All Phase 7 threats are `low` or already mitigated by tight scope (text-only edits + verification) + the PRE/POST diff gates at 07-01 / 07-02 + the cross-PDP audit at 07-03. No `high` threats — phase ships once 07-05 confirms a11y gate and 07-06 confirms tsc + build clean.

---

## Phase exit criteria

Phase 7 is complete when:

- All 6 plans (07-01 through 07-06) committed in order (07-04 may be skipped if 07-03 returns "no fixes needed").
- `components/shmo-review/Buybox.tsx` line 191 renders `<h2 className="bb__title">` (h3 fully removed — `grep -n "<h3 className=\"bb__title\">" components/shmo-review/Buybox.tsx` returns 0 matches).
- `components/shmo-review/HowItWorks.tsx` `REVIEW_HOW_STEPS[0]` reads as format-agnostic — `grep -n "Crew hands the card" components/shmo-review/HowItWorks.tsx` returns 0 matches; `grep -n "Lives with the crew" components/shmo-review/HowItWorks.tsx` returns 0 matches.
- All 3 PDPs render correctly at 375 / 414 / 768 px — 9 full-page screenshots saved in `pictures/screenshots/07-mobile-*.png`.
- `.planning/phases/07-cross-pdp-mobile-polish/07-03-mobile-audit-NOTES.md` exists with per-PDP, per-breakpoint findings table.
- `.planning/phases/07-cross-pdp-mobile-polish/07-05-a11y-NOTES.md` exists with heading outline + tab order + contrast + qty button + FAQ aria-expanded findings.
- Heading outline on all 3 PDPs starts with `h2` (Buybox title), not `h3` (verified in 07-05).
- FormatCompare `currentHandle` wiring verified on all 3 PDPs (verified in 07-03).
- Keyboard tab order on each PDP matches DOM source order (verified in 07-05).
- No console errors on any PDP at any breakpoint (verified in 07-03).
- No horizontal overflow on any PDP at any breakpoint (verified in 07-03).
- `design-system-auditor` PASS on every UI plan that touches `.tsx` (07-01, 07-02, and 07-04 if it runs).
- `npx tsc --noEmit` clean.
- `npm run build` clean. All routes statically generated.
- All 3 PDP route sizes ≈ matching Phase 6 baseline (h2 + copy edits don't change bundle size).
- `.planning/STATE.md` updated to "Phase 7 complete, Phase 8 (Shopify Storefront wiring) ready."
- `.planning/ROADMAP.md` Phase 7 marked `[x] complete` with completion date.
- `context/general/handoff.md` updated with Phase 7 close summary.
- `context/general/scope.md` punch-list reflects Phase 7 done, Phase 8 next.
- `.planning/phases/07-cross-pdp-mobile-polish/07-SUMMARY.md` exists with atomic plan status table + exit criteria check.
- No Shopify Admin writes. No domain / theme / payment touches. No `.env` changes.
