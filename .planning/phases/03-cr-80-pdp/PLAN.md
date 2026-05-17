---
phase: 03-cr-80-pdp
phase_number: 3
phase_name: CR-80 PDP
status: planning
depends_on: [phase-3a]
total_plans: 10
autonomous: false
last_updated: "2026-05-17"
---

# Phase 3 — CR-80 PDP

## Goal

Build `/shmo-review/cr-80` — the product detail page for the CR-80 wallet-size NFC Google review card — from scratch using the existing Shmocard design system. The page must sell the bulk-math argument ("one per employee, not one per shop") to local US shop crews, fit the four-bg section rotation, and leave Shopify product data on `TODO(shopify):` markers for Phase 6.

The page replaces the current stub at `app/shmo-review/cr-80/page.tsx` (which only renders `<Buybox nextBg="marsh" />`) with a full PDP: buybox up top, then proof, why, setup, details, format compare, FAQ, final CTA — added one section at a time after Jordan approves the buybox direction.

## Success criteria (TRUE = green)

(Copied from `.planning/ROADMAP.md` Phase 3, expanded.)

1. Browser renders `/shmo-review/cr-80` with no console errors and `npx tsc --noEmit` is clean after every plan.
2. Buybox composition is approved by Jordan in the browser before below-the-fold sections are added (Plan 03-02 is a `checkpoint:human-verify`).
3. Every section uses design-system primitives only — no `.foo__btn`, no `position: fixed; bottom: 0` product bars, no hex colors outside SVG brand marks, no system-ui fonts, no Lucide / Heroicons / 1.5px stroke icons.
4. Wave dividers placed as siblings of their sections (CLAUDE.md hard rule). Every section uses `<Section bg=... nextBg=...>` from `components/layout/Section.tsx` — never hand-author `<div className="shm-wave">` inside another component.
5. Section rotation = marsh / graham / ember / cocoa only. Ember used for exactly one high-emphasis CTA; cocoa used for the final CTA / footer-adjacent moment.
6. Mobile breakpoint clean — no clipping, no overflow at 375px width. Mascot a sticker only (max 140px, max 2 per page).
7. Format comparison section makes CR-80 vs L-Sign vs Square trade-off clear to a first-time visitor.
8. Page composition fits within the four-bg section rotation with a coherent rhythm (Plan 03-10 audits).
9. No hardcoded product prices/SKUs/names in component code — every value the buybox or any section displays goes through a `TODO(shopify):` placeholder for Phase 6 to swap. Marketing-copy strings (headlines, blurbs, FAQ answers) stay in components per existing convention.
10. The CR-80 PDP visually reads as a Shmocard page — not a generic Shopify theme. Hand-printed feel, ember accent, cocoa ink, wave dividers, sticker mascots.

## Implementation strategy

**Buybox first, below-the-fold one section at a time, builder agent per plan.**

1. **03-01** audits the existing `components/shmo-review/Buybox.tsx` against the canonical reference at `.claude/skills/shmocard-design-system/ui_kits/website/Buybox.html`. NO refactor — Jordan's direction (2026-05-17): use the existing buybox as-is. Read-only `design-system-auditor` dispatch returns PASS or a drift list.
2. **03-02** is a browser checkpoint. Jordan verifies `/shmo-review/cr-80` renders the existing Buybox correctly at desktop + mobile. If 03-01 surfaced drift Jordan wants fixed inline, it lands here (primitive-composition only, no structural change). Below-the-fold work begins only after Jordan approves.
3. **03-03 through 03-09** add one below-the-fold section per plan, in order. Each plan:
   - Dispatches `design-system-builder` to build the section as its own component under `components/shmo-review/pdp/`.
   - Mounts the component into `app/shmo-review/cr-80/page.tsx` with the correct `<Section bg=... nextBg=...>` placement.
   - Dispatches `design-system-auditor` (read-only) to verify primitive composition before commit.
   - Ends in a `checkpoint:human-verify` for that section.
   - Commits with `feat(cr-80): add <section>` once Jordan approves.
4. **03-10** is the mobile + a11y pass + verification screenshots. Closes the phase.

**All UI work goes through `design-system-builder`.** The parent (this orchestrator and any execute-plan invocation) never writes `.tsx` or `.css` directly for these plans. Polish iterations within a plan invoke the builder with `"this is a polish task — LAYOUT IS LOCKED, do not change grid columns, element ordering, tile size ratios, or structural HTML"` per the rule logged in MEMORY.md.

**Section rotation plan (final shape, subject to 03-01 outcome):**

| # | Section | bg | nextBg |
|---|---|---|---|
| Buybox (03-02) | Product hero + buybox | `marsh` | `graham` |
| Proof (03-03) | Verified results + testimonials | `graham` | `marsh` |
| Why CR-80 (03-04) | Wallet-size value props | `marsh` | `graham` |
| Setup (03-05) | 3-step program / tap / review | `graham` | `marsh` |
| Details (03-06) | Specs · materials · NFC chip · QR | `marsh` | `marsh` |
| Format compare (03-07) | CR-80 vs L-Sign vs Square | `marsh` | `ember` |
| Final CTA (03-09) | Order CTA | `ember` | `cocoa` |
| FAQ (03-08) | CR-80-specific FAQ | `cocoa` | `cocoa` (footer) |

> Note: 03-08 (FAQ) and 03-09 (Final CTA) order is flexible. If Jordan prefers FAQ before final CTA at review time, swap the bg pairings — the design system supports both. Either way ember holds the single high-emphasis CTA per page.

---

## Atomic plans

### 03-01 — Verify existing Buybox matches canonical design-system reference

- **Goal:** Confirm `components/shmo-review/Buybox.tsx` is already a faithful translation of `.claude/skills/shmocard-design-system/ui_kits/website/Buybox.html` (the canonical PDP buybox reference). NO refactor — Jordan's direction (2026-05-17): use the existing buybox as-is. This plan is a verification gate only.
- **Type:** `audit` → `design-system-auditor` dispatch
- **Files touched:** NONE (read-only audit). If drift is found, the auditor flags it; the parent decides whether to (a) fix drift inline as a follow-up plan in this phase, or (b) defer drift fixes to a separate cleanup phase.
- **Auditor prompt anchor:** "Audit `components/shmo-review/Buybox.tsx` + relevant page-level CSS in `app/shmo-review/shmo-review.css` (sections `.review-buybox`, `.pdp-buybox`, `.gal`, `.bb`, `.shm-pack-row` overrides) against the canonical reference at `.claude/skills/shmocard-design-system/ui_kits/website/Buybox.html`. Verify: (1) every primitive class matches the reference; (2) section structure, gallery layout, pack rows, checklist, Google review button, FAQ list, sticky CTA all compose the right primitives; (3) NO custom restyles of design-system primitives leak into page-level CSS; (4) wave divider is rendered as a sibling via `Section` (never as a child); (5) `.shm-buybox-sticky` behaves as defined in `components.css` (slides DOWN from top, not fixed bottom); (6) every product-data field has a `TODO(shopify):` marker or a clear placeholder-data origin. Report PASS or list specific drift items with line refs."
- **Verification:**
  - Auditor returns PASS, OR returns a list of specific drift items.
  - If PASS → proceed to 03-02.
  - If FAIL → surface findings to Jordan, agree on scope of cleanup (inline vs separate phase), then proceed.
- **Commit message format:** No commit. Audit only.

### 03-02 — CR-80 PDP buybox checkpoint

- **Goal:** Confirm `/shmo-review/cr-80` renders the existing Buybox correctly (the route already exists as a stub rendering `<Buybox nextBg="marsh" />` per handoff). Jordan reviews in the browser; below-the-fold work begins only after his approval. The existing Buybox header comment (line 3) already identifies it as the CR-80 buybox, so no content swap is needed for Phase 3 — CR-80-specific copy / variant data swap is a Phase 6 (Shopify wiring) concern, not a Phase 3 concern.
- **Type:** `checkpoint:human-verify`
- **Files touched:** NONE in this plan if 03-01 returned PASS. If 03-01 surfaced drift Jordan wants fixed inline, those edits land here under `design-system-builder` dispatch (NOT a refactor — primitive-composition fixes only, no structural change).
- **Verification:**
  - Dev server running, `/shmo-review/cr-80` open in browser at desktop + mobile (375px) widths.
  - No console errors, `npx tsc --noEmit` clean.
  - Playwright screenshots saved to `pictures/screenshots/cr-80-buybox-03-02-desktop.png` and `pictures/screenshots/cr-80-buybox-03-02-mobile.png`.
- **Checkpoint:** Jordan approves the buybox in the browser. **No below-the-fold sections begin until this approval lands.**
- **Commit message format:** No commit unless 03-01 surfaced drift fixed inline — then `fix(buybox): align with canonical design-system reference`

### 03-03 — Proof section (verified results + testimonials)

- **Goal:** Add proof section that lands the bulk-math argument with verified client metrics + one or two verbatim testimonials. graham bg, nextBg marsh.
- **Type:** `auto` → `design-system-builder` dispatch → `design-system-auditor` → `checkpoint:human-verify`
- **Files touched:**
  - `components/shmo-review/cr-80/Proof.tsx` (new)
  - `app/shmo-review/cr-80/page.tsx` (mount Proof under Buybox)
  - `app/shmo-review/shmo-review.css` (page-level layout only — grid, padding, aspect)
- **Builder prompt anchor:** "Build a Proof section under `components/shmo-review/cr-80/Proof.tsx` using `<Section bg='graham' nextBg='marsh'>`. Compose `.shm-section-head`, `.shm-eyebrow`, `.shm-h2` with em accent, then a 2-column desktop / 1-column mobile layout: (a) `.shm-card` grid showing 4-6 verified review-volume increases from `context/general/marketing.md` (Chase +43%, Vito +60%, Carly +71%, Joey +81%); (b) one verbatim testimonial using `.shm-review` primitive — pick Carli Karlson or Allan Macias from marketing.md. Eyebrow: 'Real shops · real numbers'. Headline: 'The math <em>only</em> works when the crew taps.'. No exclamation marks. No hex outside SVG. No restyling primitives. Industry / shop names must NOT mention 'Pawn Leads' (MEMORY rule); 'pawn shop' as a descriptor is fine since marketing.md uses it."
- **Verification:**
  - `tsc` clean, no console errors.
  - Section renders graham bg, wave-divider sibling to next-section marsh.
  - `design-system-auditor` returns PASS (composes `.shm-section`, `.shm-card`, `.shm-review`, `.shm-eyebrow`, `.shm-h2`, no custom prefixes).
  - Mobile 375px clean.
  - Playwright screenshot to `pictures/screenshots/cr-80-proof-03-03.png`.
- **Checkpoint:** Jordan approves before 03-04 starts.
- **Commit message format:** `feat(cr-80): add proof section`

### 03-04 — Why CR-80 section (wallet-size value props)

- **Goal:** Pitch the CR-80 specifically vs the other two formats. Lead with "lives in the pocket of the person handing over the receipt." marsh bg, nextBg graham.
- **Type:** `auto` → `design-system-builder` dispatch → `design-system-auditor` → `checkpoint:human-verify`
- **Files touched:**
  - `components/shmo-review/cr-80/WhyCr80.tsx` (new)
  - `app/shmo-review/cr-80/page.tsx` (mount)
- **Builder prompt anchor:** "Build `components/shmo-review/cr-80/WhyCr80.tsx` using `<Section bg='marsh' nextBg='graham'>`. Composition: section head (eyebrow 'Why the CR-80', headline 'Built for the <em>back pocket</em>.'), then a 3-card row using `.shm-card` primitive — each card has a hand-drawn cocoa-deep SVG icon (2.4-2.6px stroke, round caps, inline SVG only) + `.shm-h3` + body. Three props: (1) 'Pocket-sized, not counter-sized' — the CR-80 follows the crew member, captures ~15 reviews/week vs ~2 for a counter card. (2) 'Pre-programmed before it ships' — Google review link burned in at print time; QR fallback on back. (3) 'Reprogrammable for life' — destination URL editable from dashboard. Optional sticker mascot accent (`.shm-sticker--sm` or `.shm-mascot--decoration`, max one, tilted) on the section head. No exclamation marks. No hex outside SVG."
- **Verification:** same gate as 03-03 — tsc, auditor PASS, mobile clean, screenshot saved.
- **Commit message format:** `feat(cr-80): add why-CR-80 section`

### 03-05 — Setup steps section (program / tap / review)

- **Goal:** Show the 3-step setup the customer experiences, in order. graham bg, nextBg marsh.
- **Type:** `auto` → `design-system-builder` dispatch → `design-system-auditor` → `checkpoint:human-verify`
- **Files touched:**
  - `components/shmo-review/cr-80/SetupSteps.tsx` (new)
  - `app/shmo-review/cr-80/page.tsx` (mount)
- **Builder prompt anchor:** "Build `components/shmo-review/cr-80/SetupSteps.tsx` using `<Section bg='graham' nextBg='marsh'>`. Composition: section head (eyebrow 'How it works', headline 'Three taps from the box to a <em>five-star</em> review.'). Below the head, a 3-column desktop / 1-column mobile grid of `.shm-step` primitives. Each step is `.shm-step__num` (1/2/3) + `.shm-step__title` + `.shm-step__body`. Content pulled from `context/general/product.md` Section 'How it works':\n  1. 'You send your Google review link at checkout' — pre-programmed before shipping.\n  2. 'Hand a card after every transaction' — one per crew member, lives in the back pocket.\n  3. 'Customer taps. Review page opens. Five stars.' — QR fallback on back for non-NFC phones.\n  No mascot in this section (already used in 03-04 if applicable; 2-mascot cap holds). No exclamation marks."
- **Verification:** same gate.
- **Commit message format:** `feat(cr-80): add setup-steps section`

### 03-06 — Product details section (specs / materials / NFC chip / QR)

- **Goal:** The "in-the-weeds" specs section for buyers who want to confirm the hardware. marsh bg, nextBg marsh (back-to-back same-bg with optional wave omitted via `Section` — or `nextBg='marsh'` renders a marsh→marsh transition which the Section component should handle. If it can't, use `nextBg='graham'` and adjust 03-07 to start on graham).
- **Type:** `auto` → `design-system-builder` dispatch → `design-system-auditor` → `checkpoint:human-verify`
- **Files touched:**
  - `components/shmo-review/cr-80/ProductDetails.tsx` (new)
  - `app/shmo-review/cr-80/page.tsx` (mount)
- **Builder prompt anchor:** "Build `components/shmo-review/cr-80/ProductDetails.tsx` using `<Section bg='marsh' nextBg='marsh'>` (or whatever `Section` supports for same-bg transitions — if it requires a different nextBg, use `graham` and inform the parent so 03-07 starts on graham). Composition: 2-column desktop / 1-column mobile. Left column: large image frame (`.shm-image-frame--bare` or default soft) showing a CR-80 close-up — use `/products/cr80/transparent/magnific_2884343351.png` or similar. Right column: section head (eyebrow 'Product details', headline 'CR-80 hardware, <em>plainly</em> stated.') + `.shm-checklist` (default soft variant, not `--featured`) listing: dimensions (85.6 × 54 mm), material (premium PVC, 0.76 mm), NFC chip (NTAG 215), QR fallback (printed on back), compatibility (iPhone XS+, Android 5.0+), print (custom shop branding, hand-printed in Minneapolis). Below the checklist, a `.shm-callout` with the 30-day no-questions returns line. No prices, no SKUs. All product attributes get `TODO(shopify):` comments inline if they would normally come from Shopify (dimensions and NFC chip are static product fact, fine to hardcode — they don't change per variant)."
- **Verification:** same gate.
- **Commit message format:** `feat(cr-80): add product-details section`

### 03-07 — Format comparison section (CR-80 vs L-Sign vs Square)

- **Goal:** Help a first-time visitor pick the right format. Reuse `FormatPicker` if its bg slots are compatible; otherwise build a dedicated `FormatCompare.tsx` that highlights the CR-80 as the current product. marsh bg, nextBg ember.
- **Type:** `checkpoint:decision` (reuse vs new) → `auto` → `design-system-builder` dispatch → `design-system-auditor` → `checkpoint:human-verify`
- **Files touched:**
  - Likely `components/shmo-review/cr-80/FormatCompare.tsx` (new — dedicated PDP version that marks CR-80 as "you're here" and links to the other two formats)
  - OR `components/shmo-review/FormatPicker.tsx` (extend with a `highlightHandle` prop)
  - `app/shmo-review/cr-80/page.tsx` (mount)
- **Decision context for Jordan:** `FormatPicker` is already a server component that fetches Shopify product data for all three handles. Reusing it on the PDP means the visitor sees the same grid they saw on `/shmo-review`. A dedicated `FormatCompare` could be more direct ("you're looking at the CR-80 — here's when L-Sign or Square would be better") and use less vertical space. Recommendation: extend `FormatPicker` with `highlightHandle` + `bg` + `nextBg` props rather than forking — keeps a single source of truth for product fetch logic. **Wait for Jordan's call before dispatching the builder.**
- **Builder prompt anchor (after decision):** If extending `FormatPicker`: "Add a `highlightHandle?: string` prop to `FormatPicker`. When set, the matching card gets a `.shm-product[data-highlight='true']` attribute (the builder adds the CSS — soft graham wash or hairline ember outline — in `app/shmo-review/shmo-review.css`, page-level layout territory). The highlighted card's CTA becomes a ghost 'You're here' label instead of 'View product'. Section bg/nextBg become props (default to existing `'cream' / 'marsh'`). Mount on `/shmo-review/cr-80` with `<FormatPicker bg='marsh' nextBg='ember' highlightHandle='google-reviews-nfc-tap-card-cr80' />`. Headline for the PDP context: 'Need a counter sign or a window disc <em>instead</em>?'"
- **Verification:** same gate. Plus: confirm Shopify product fetch still works (or fails gracefully into the placeholder card path FormatPicker already handles).
- **Commit message format:** `feat(cr-80): add format-compare section` OR `feat(format-picker): support highlighted-format mode for PDPs`

### 03-08 — FAQ section (CR-80-specific)

- **Goal:** Below the final CTA OR before it — depending on Jordan's preference at review time. cocoa bg if it lands after the ember CTA, marsh bg if it lands before. Default plan: cocoa bg, nextBg cocoa (sits adjacent to footer).
- **Type:** `auto` → `design-system-builder` dispatch → `design-system-auditor` → `checkpoint:human-verify`
- **Files touched:**
  - `components/shmo-review/cr-80/Faq.tsx` (new — dedicated FAQ section, distinct from the FAQ rows already inside the buybox)
  - `app/shmo-review/cr-80/page.tsx` (mount)
- **Builder prompt anchor:** "Build `components/shmo-review/cr-80/Faq.tsx` using `<Section bg='cocoa' nextBg='cocoa'>` and a `.shm-wave--lg` or `--xl` for the high-contrast inbound transition (ember → cocoa or marsh → cocoa). Composition: section head with white-on-cocoa flip (eyebrow + `.shm-h2` with em-accent — auto-honey ember on cocoa). Below the head: a `.shm-faq-list` (SOFT default variant — `--featured-card` is rare and reserved for dedicated FAQ pages) with 6-8 CR-80-specific rows. Pull from `context/general/marketing.md` FAQ table — pick `bulk`, `phone`, `reprog`, `ship`, `google-link`, `returns`. Add one CR-80-specific question Jordan asked about during planning ('What's on the card — is it our logo?' → 'Yes. Every order is custom-printed with your shop's logo, name, and color treatment. We never ship blank stock.'). Use the FAQ wiring from `Buybox.tsx` lines 327-359 (`faqOpen` state) as the interaction reference but in its own component state. No exclamation marks, no decorative emoji, no left-border accent stripe on cards."
- **Verification:** same gate. Confirm text/em flips work on cocoa bg.
- **Commit message format:** `feat(cr-80): add FAQ section`

### 03-09 — Final CTA section

- **Goal:** The single ember high-emphasis CTA section per page. Closes the sell. ember bg, nextBg cocoa.
- **Type:** `auto` → `design-system-builder` dispatch → `design-system-auditor` → `checkpoint:human-verify`
- **Files touched:**
  - `components/shmo-review/cr-80/FinalCta.tsx` (new)
  - `app/shmo-review/cr-80/page.tsx` (mount)
- **Builder prompt anchor:** "Build `components/shmo-review/cr-80/FinalCta.tsx` using `<Section bg='ember' nextBg='cocoa'>`. This is the only ember section on the page (rule: ember = one high-emphasis CTA per page). Composition: centered section head with eyebrow 'Ready to ship' (use the production-ready copy block from `context/general/marketing.md` Final-CTA section), headline 'Pick the pack. Ship Friday. Tap by <em>Monday</em>.', then two CTAs side by side: primary `.shm-btn--honey` (on-dark primary = honey, not ember-on-ember) labeled 'Shop the cards →' that jumps to `#buybox` (top of page), secondary `.shm-btn--ghost` `.on-dark` labeled 'Browse other formats' that jumps to the format-compare section. Optional sticker mascot (`.shm-sticker--md`, tilted) — but page mascot cap is 2 total, so only add if 03-04 used 0 or 1 mascot. No exclamation marks. Body line under the CTAs: 'Orders placed by Tuesday ship Friday — your crew taps for five-stars by next Monday.'"
- **Verification:** same gate. Confirm `.shm-bg-ember` text flips render correctly (auto-honey accent on ember).
- **Commit message format:** `feat(cr-80): add final CTA section`

### 03-10 — Mobile pass + a11y audit + verification screenshots

- **Goal:** Final phase-close pass. No new sections — only fixes to anything caught by mobile / a11y / screenshot review.
- **Type:** `design-system-builder` dispatch (for fixes) → `design-system-auditor` (full-page audit) → `checkpoint:human-verify`
- **Files touched:** any of the new section components from 03-03 through 03-09 + `app/shmo-review/shmo-review.css` for layout-only fixes.
- **Builder prompt anchor:** "Full mobile pass on `/shmo-review/cr-80` at 375px, 414px, and 768px widths. Capture screenshots of each section to `pictures/screenshots/cr-80-mobile-{section}-{width}.png`. Look for: clipping, horizontal scrollbars, headline overflow, image overflow, wave-divider gaps (the wave-as-sibling rule — symptom is a ~40px empty sliver before the wave). Fix any issue without changing layout structure (LAYOUT IS LOCKED rule — spacing, padding, mascot scale, type sizing only). Then run an a11y check: every interactive element has a label or aria-label, color contrast meets WCAG AA (cocoa text on marsh, marsh text on cocoa, etc. — the design system already passes; just confirm), keyboard tab order is sensible. Document findings in a short notes file at `.planning/phases/03-cr-80-pdp/03-10-mobile-a11y-NOTES.md` (this file is not a deliverable — it's a working note Jordan can scan)."
- **Verification:**
  - Full-page Playwright screenshot at 1280px width to `pictures/screenshots/cr-80-full-desktop.png`.
  - Full-page screenshot at 375px to `pictures/screenshots/cr-80-full-mobile.png`.
  - `npx tsc --noEmit` clean.
  - `npm run build` clean.
  - `design-system-auditor` PASS on every section component.
  - No console errors on page load.
- **Commit message format:** `fix(cr-80): mobile + a11y polish pass`

---

## Open decisions

These are the live decision points across the phase. The decision plans are 03-01 and 03-07; the rest are observations that the builder may surface at review time.

1. **Buybox shared vs forked** — DECIDED 2026-05-17: keep existing `components/shmo-review/Buybox.tsx` as-is, shared between `/shmo-review` and `/shmo-review/cr-80`. No refactor. CR-80-specific product data swap is a Phase 6 (Shopify wiring) concern.
2. **CR-80 imagery source — local curated assets vs Shopify CDN** (03-02 onward). Current state: `public/products/cr80/transparent/*.png` exist and the buybox already references them. Recommendation: keep local curated assets through Phase 3, swap to Shopify CDN in Phase 6. The handoff already flagged this preference ("the design must avoid drifting into a generic Shopify look").
3. **FormatPicker reuse vs FormatCompare fork** (03-07). Recommendation: extend `FormatPicker` with `highlightHandle`.
4. **FAQ before or after final CTA** (03-08 / 03-09). Default plan: ember CTA, then cocoa FAQ. Reorderable at review time.
5. **Sticker mascot count and placement.** Cap is 2 per page. Current plan reserves slots for 03-04 (Why CR-80 section head) and 03-09 (Final CTA). 03-05, 03-06, 03-07, 03-08 explicitly avoid mascots to honor the cap.
6. **Section padding for high-contrast wave transitions.** ember↔marsh and cocoa↔marsh need `--wave-height-xl` (80px) plus `padding-bottom: calc(var(--section-py-d) + var(--wave-height-xl))` on the section above. The builder must apply this in each plan that crosses ember or cocoa.

## Risks

1. **Buybox drift from canonical reference.** 03-01 audits the existing Buybox against `.claude/skills/shmocard-design-system/ui_kits/website/Buybox.html`. If drift is found, scope the fix carefully — primitive-composition fixes only, no structural change.
2. **Wave-divider sibling regression.** The wave-as-child bug cost 5h last cycle (MEMORY.md). Every section plan MUST use `<Section bg=... nextBg=...>` from `components/layout/Section.tsx`. The builder agent's system prompt enforces this — the parent flags it in every dispatch.
3. **Mascot cap creep.** Each new section is tempting to "warm up" with a sticker. The 2-per-page hard rule applies to the full PDP, not per section. 03-10 audits this.
4. **Hex color drift in inline SVGs.** Hand-drawn icons are inline SVG. The builder uses `currentColor` for stroke / fill except for the Google `G` logo (which has brand hex by design). The auditor catches any other hex.
5. **Generic-Shopify drift.** The page must read as Shmocard, not a stock theme. Symptoms to watch: thin-stroke Lucide-style icons, gradients, drop-shadows with blur, gray surfaces, left-border accent stripes on cards. The auditor catches these.
6. **Shopify wiring sneaking in.** Phase 3 is explicitly NOT Phase 6. If the builder tries to wire `cartLinesAdd` or fetch a live variant, stop and revert. `TODO(shopify):` markers stay markers until Phase 6.
7. **Mobile clipping on the buybox gallery.** The `gal__main` + `gal__thumbs` layout has historically clipped at 375px. 03-02 must include a 375px screenshot in the checkpoint material.
8. **Scope creep into Phase 4 / 5 (L-Sign / Square Card PDPs).** The format-compare section (03-07) is allowed to *link* to the other two formats; it is NOT allowed to build them. Links land on `#formats` placeholders for now.
9. **Pawn-brand bleed.** MEMORY rule: never mention "Pawn Leads" anywhere on Shmocard. Marketing.md proof points use real shop names (The Pawn Shop, Axel's Pawn) — those are fine. "Pawn Leads" the agency is not.
10. **Polish iterations restructuring layout.** MEMORY rule: LAYOUT IS LOCKED on polish tasks. Every builder dispatch for polish (after the initial section ships) must carry the explicit flag.

---

## Phase exit criteria

Phase 3 is complete when:

- All 10 plans (03-01 through 03-10) are committed in order.
- `/shmo-review/cr-80` renders the full PDP (buybox + 6 below-the-fold sections + final CTA + FAQ) with no console errors at desktop, tablet, and mobile widths.
- Every section component has been audited by `design-system-auditor` and passed.
- Full-page screenshots saved to `pictures/screenshots/cr-80-full-desktop.png` and `cr-80-full-mobile.png`.
- `.planning/STATE.md` updated to "Phase 3 complete, Phase 4 (L-Sign PDP) ready".
- `handoff.md` updated with what shipped + what's next.
