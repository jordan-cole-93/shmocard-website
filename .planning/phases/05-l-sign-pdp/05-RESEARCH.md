---
phase: 05-l-sign-pdp
phase_number: 5
phase_name: L-Sign PDP
status: research
researched: "2026-05-20"
---

# Phase 5 — L-Sign PDP — Research

**Researched:** 2026-05-20
**Domain:** Next.js App Router PDP composition, Shmocard design system, component reuse
**Confidence:** HIGH — all findings verified against live codebase + committed docs

---

## Summary

Phase 5 replaces the Coming Soon stub at `/shmo-review/l-sign` with a full product detail page following the CR-80 PDP pattern from Phase 3. The L-Sign is an acrylic 4×6 tabletop counter standee — same NFC + QR flow as the CR-80, different use case (counter self-serve vs. crew handoff).

The primary question is component reuse vs. fork. The answer is: **maximum reuse with one targeted refactor**. The `<Buybox>` component is CR-80-hardcoded and needs a props interface to serve L-Sign. Every below-the-fold section from Phase 3 (`Proof`, `CrewStrip` + `ProofTiles`, `HowItWorks`, `VideoTestimonials`, `FinalCta`) can be reused as-is. No new structural sections are needed — the L-Sign story fits the existing narrative arc. One L-Sign-specific section may be worth adding: a brief "Where it lives" placement visual showing the standee on a counter, but this is lower priority than the core buybox + proof stack.

**Primary recommendation:** Refactor `<Buybox>` to accept product props; reuse all 6 below-the-fold sections; build `app/shmo-review/l-sign/page.tsx` + `l-sign.css` (layout only). L-Sign imagery already exists in `public/products/l-sign/`.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|---|---|---|---|
| Product buybox (gallery + pack selector + cart) | Frontend (client component) | — | Requires `useState` for gallery/pack/qty; Zustand cart store |
| Below-the-fold sections (Proof, HowItWorks, etc.) | Frontend (server component) | — | Static marketing content, no interactivity |
| Product data (prices, SKUs, images) | `TODO(shopify):` placeholders | Phase 8 Storefront API | Shopify-data-discipline rule — never hardcode |
| Route page composition | App Router (server component) | — | `app/shmo-review/l-sign/page.tsx` |
| L-Sign-specific CSS | Page-level layout CSS | — | `app/shmo-review/l-sign/l-sign.css` (layout only, no appearance) |

---

## Q1: Buybox reuse vs. refactor

**Verdict: Minimum refactor — extract product data to props.**

`components/shmo-review/Buybox.tsx` is a `"use client"` component with all product data hardcoded as module-level constants:

```ts
const PRODUCT = {
  handle: "shmo-review-cr80",
  title: "Google Review NFC Tap Card (CR-80)",
  sub: "The countertop tap that turns happy crews into five-star reviews.",
};
const GALLERY = [ { src: "/products/cr80/transparent/magnific_2884306972.png", ... }, ... ];
const PACKS = [ { qty: 1, price: 29.99, ... }, ... ];
const CHECKLIST = [ "Hand-printed in Minneapolis on premium PVC stock", ... ];
const FAQ_ROWS = [ { q: "How it works", a: "..." }, ... ];
```

The component signature is `({ nextBg = "marsh" }: { nextBg?: SectionBg })` — no product props.

**Minimum refactor to support L-Sign:**

Extract `PRODUCT`, `GALLERY`, `PACKS`, `CHECKLIST`, and `FAQ_ROWS` from module-level constants into a `BuyboxProps` interface. Caller passes the data; defaults remain CR-80 values so existing `/shmo-review/cr-80/page.tsx` needs zero change.

```ts
// Proposed interface (builder implements)
export type BuyboxProps = {
  product: { handle: string; title: string; sub: string };
  gallery: Array<{ src: string; alt: string }>;
  packs: Array<{ qty: number; price: number; perCard: number; save: string | null; note: string | null; compare: number | null; pop: boolean }>;
  checklist: string[];
  faqRows: Array<{ q: string; a: string }>;
  nextBg?: SectionBg;
};
```

CR-80 page passes the existing hardcoded data as props (or uses a default export wrapper). L-Sign page passes L-Sign data.

**This is a refactor of an existing component — routes through `design-system-builder` per subagent-dispatch rules. The parent never writes `.tsx` directly.**

The `ariaLabel` on the `<Section>` is currently `"Buy the CR-80 card"` — also needs to become a prop. Cart `merchandiseId` and `productHandle` are `TODO(shopify):` anyway, so no Shopify-data risk in the refactor.

**Risk:** Refactoring a shared component (`/shmo-review` family page also imports `<Buybox>`) — `/shmo-review/page.tsx` must be audited to confirm it either doesn't use `<Buybox>` or passes compatible props. [VERIFIED: `app/shmo-review/page.tsx` exists but its import structure needs checking — see Open Questions Q1.]

---

## Q2: L-Sign imagery

**Verdict: Imagery exists. No placeholder needed for gallery. Use `carrousel-color/` as primary.**

`public/products/l-sign/` contains three subdirectories:

```
public/products/l-sign/
  transparent/
    magnific_2884477047.png    ← transparent bg, suitable for gallery hero
    magnific_2884490360.png
    magnific_2884500886.png
  carrousel-color/
    L Sign - Google - 1.jpg   ← branded color version
    L Sign - Google - 2.jpg
    L Sign - Google - 3.jpg
    Google - Google - 2.jpg
    Google - Google - 3.jpg
    Group 8.jpg
    magnific_2884497265 (1).jpg
    magnific_2884573578.jpg
  carrousel-black/
    L Sign (Black) - Google - 1.jpg
    L Sign (Black) - Google - 1-1.jpg
    L Sign (Black) - Google - 3.jpg
    Google - Google - 2.jpg
    Google - Google - 3.jpg
    L Sign Black A.jpg
    L Sign Black B.jpg
```

**Recommended gallery composition:** Mirror CR-80 pattern — use `transparent/` PNGs as the primary gallery set (clean white-bg presentation in the gallery frame), with `carrousel-color/` available for lifestyle shots. 3 transparent images exist; that's enough for a gallery (CR-80 uses 6 but 3 is acceptable for launch).

The `Buybox` gallery currently uses `.png` transparent files from `cr80/transparent/`. Same pattern applies to L-Sign. No new imagery needed.

**[VERIFIED: directory listing of `public/products/l-sign/` confirmed above]**

---

## Q3: Below-the-fold section reuse table

| Section | Component | Verdict | Rationale |
|---|---|---|---|
| Buybox | `components/shmo-review/Buybox.tsx` | REFACTOR (props interface) | CR-80 hardcoded — needs props to serve L-Sign data. Layout/primitives unchanged. |
| Proof | `components/shmo-review/cr-80/Proof.tsx` | REUSE AS-IS | Proof points are product-family level (all Shmo Review). Testimonials reference CR-80 cards but the claim ("5 Google Reviews just today") is not product-specific — it speaks to the NFC tap mechanism which L-Sign shares. No L-Sign-specific testimonials exist in `marketing.md`. |
| CrewStrip | `components/home/CrewStrip.tsx` | REUSE AS-IS | Bulk math argument ("~2 vs ~15") applies to any Shmo Review format. Counter-placement reinforces the L-Sign narrative specifically — "lives next to the register" maps directly to the CrewStrip visual. |
| ProofTiles | `components/shmo-review/ProofMarquee.tsx` (exported as `ProofTiles`) | REUSE AS-IS | Stats grid (verified %) is format-agnostic. |
| HowItWorks | `components/shmo-review/HowItWorks.tsx` | REUSE AS-IS | The 4-step flow (crew hands card → customer taps → review page opens → five stars) is mechanically identical for L-Sign. Step 01 copy says "employee hands the card" — for L-Sign the card is self-serve on the counter, not handed. However, this is a minor copy nuance. Two options: (a) reuse as-is accepting the slight inaccuracy, (b) make step titles a prop. Recommendation: **reuse as-is for Phase 5** — the flow is close enough and the copy mismatch is subtle. Flag for Phase 7 mobile polish or a dedicated "how it works" variant if Jordan wants to differentiate. |
| VideoTestimonials | `components/home/VideoTestimonials.tsx` | REUSE AS-IS | Videos feature CR-80 users but speak to results, not product format. "14 reviews in the first week" is a Shmo Review proof point, not CR-80 specific. |
| FinalCta | `components/home/FinalCta.tsx` | REUSE AS-IS | Already fully parameterized (`bg`, `nextBg` props). Generic "Pick a card, pick a kit" copy is appropriate for both PDPs. |

**Net new components required:** Zero structural. One refactor (`Buybox` props). One new route file + CSS file.

---

## Q4: L-Sign-unique sections needed

**Verdict: None required for Phase 5. One optional low-priority addition.**

The L-Sign product story (acrylic tabletop standee, self-serve counter tap) is handled by:
- Buybox: product title, sub-headline, and checklist bullets differentiate from CR-80
- CrewStrip: "~2 vs ~15" bulk math still applies (L-Sign supplements crew cards, not replaces)
- HowItWorks: mechanically identical tap flow

**Optional — "Where it lives" placement visual (LOW priority):**
A single-section callout showing the L-Sign on a counter (product photo + short copy: "Sits next to the register. Guests tap before they walk out.") could reinforce the use case. This is NOT required for launch — the Buybox copy + imagery handles placement context adequately. Recommend deferring to Phase 7 CRO pass unless Jordan specifically wants it.

**What NOT to build:**
- No "Why L-Sign vs CR-80" comparison section — Format Compare (deferred from Phase 3) is the right vehicle, and it should land in Phase 6 (Square Card) so all 3 formats are shown simultaneously (see Q5).
- No separate materials/finish section — checklist rows in the Buybox FAQ handle this.
- No custom HowItWorks variant — reuse as-is per Q3 above.

---

## Q5: Format Compare section — Phase 5 or Phase 6?

**Verdict: Defer to Phase 6 (Square Card PDP).**

The Format Compare section was deferred from Phase 3 specifically because "waits on Phase 4 + 5" (SUMMARY.md). Now Phase 5 is L-Sign — but the same argument applies: the comparison table is most useful showing all 3 formats (CR-80, L-Sign, Square). Building it in Phase 5 with only 2/3 formats means it needs to be updated again in Phase 6.

**Recommendation:** Build Format Compare once in Phase 6 as a shared component at `components/shmo-review/FormatCompare.tsx`, then back-port it to CR-80 and L-Sign PDPs in the same Phase 6 task wave. This is one clean build vs. two partial builds.

The planner should include a note that Phase 6 will add `<FormatCompare>` to CR-80 and L-Sign in addition to Square Card.

---

## Q6: Page composition + section rotation

**Proposed L-Sign PDP composition:**

| # | Section | Component | bg | nextBg | Notes |
|---|---|---|---|---|---|
| 1 | Buybox | `Buybox` (refactored) | `marsh` | `cream` | L-Sign props; same as CR-80 |
| 2 | Proof | `cr-80/Proof` (reuse) | `cream` | `marsh` | Proof points are format-agnostic |
| 3 | CrewStrip + ProofTiles | `CrewStrip` (reuse) | `marsh` | `cream` | `nextBg="cream"` per CR-80 pattern |
| 4–7 | HowItWorks (4 sections) | `HowItWorks` (reuse) | `cream`→`marsh`→`cream`→`marsh` | internal alternation | Exits on `marsh` |
| 8 | VideoTestimonials | `VideoTestimonials` (reuse) | `cream` | `ember` | `bg="cream" nextBg="ember"` |
| 9 | FinalCta | `FinalCta` (reuse) | `ember` | `cocoa` | `nextBg="cocoa"` (footer) |

**Rotation analysis:**
- marsh → cream (Buybox→Proof) — valid contrast
- cream → marsh (Proof→CrewStrip) — valid
- HowItWorks alternates cream/marsh internally — valid (component manages its own wave siblings)
- Final marsh → cream (last HowItWorks step exits marsh; VideoTestimonials is cream) — valid
- cream → ember (VideoTestimonials→FinalCta) — high emphasis, correct
- ember → cocoa (FinalCta→footer) — correct per design system

This is identical to the CR-80 PDP rotation, which Jordan approved. [VERIFIED: CR-80 `page.tsx` confirms this sequence]

**CSS:** Create `app/shmo-review/l-sign/l-sign.css` (layout only). Import `../shmo-review.css` (parent CSS already handles most layout — same pattern as `cr-80/page.tsx` which imports `"../shmo-review.css"`). L-Sign CSS file may be minimal or empty if no layout differences emerge.

---

## Q7: Mascot pose

**Current stub:** `pointing` (Phase 4 Coming Soon stub).

**Recommendation for full PDP:** Remove the mascot from the Buybox entirely (CR-80 has none — matches the ecommerce density rule). If a mascot moment is used, place it in one section only.

**Best candidate pose:** `mascot-tap-moment` — directly illustrates the NFC tap interaction that is the L-Sign's core value. Place in HowItWorks step 02 ("Customer taps") as a decorative accent if a mascot moment is desired.

**Alternative:** `mascot-star-burst` — celebrates review success; could work in Proof or FinalCta.

**Hard rule:** Max 2 mascot moments per page, max 140px. Zero is acceptable. CR-80 PDP ships without a mascot — L-Sign can do the same.

[VERIFIED: `public/mascot/mascot-tap-moment.png` exists; `mascot-star-burst.png` exists]

---

## Q8: Headline / lede candidates

From `marketing.md` — L-Sign specific copy:

**Tag:** "For the counter"
**Kicker:** "Tabletop stand · 4×6"
**Format pitch:** "Lives next to the register. Guests tap on their way out — no staff prompt needed."

**Buybox title candidates (for `PRODUCT.title` prop):**
1. "Google Review NFC Tap Sign (L-Sign)" — mirrors CR-80 naming convention
2. "Shmo Review L-Sign — Counter Standee" — sub-brand forward
3. "L-Sign · NFC Counter Standee" — concise, format-first

**Buybox sub-headline candidates (for `PRODUCT.sub` prop):**
1. "Lives next to the register. Guests tap on their way out — no staff prompt needed." ← directly from `marketing.md`, plainspoken
2. "Set it on the counter. Customers tap before they walk out." ← shorter
3. "The sign that asks for the review so your crew doesn't have to." ← benefit-forward

**Checklist candidates (for `CHECKLIST` prop — L-Sign specific):**
- "4×6 acrylic tabletop standee — sits next to any register"
- "Pre-programmed to your Google review link before shipping"
- "Works on every modern phone — no app, no download"
- "60-day reprogramming + return guarantee"
- "QR code on back covers phones that can't tap"

**L-Sign FAQ rows (for `FAQ_ROWS` prop):**
- Q: "What is the L-Sign?" / A: "A 4×6 acrylic tabletop standee. Set it next to the register. Customers tap on their way out and land straight on your Google review page."
- Shipping, return, reprogramming rows — identical to CR-80

**Page metadata:**
- Title: "L-Sign Counter Standee — Shmo Review"
- Description: "Acrylic NFC counter standee for your register. Customers tap on their way out. Pre-programmed before shipping, with QR fallback."

[CITED: `context/general/marketing.md` — Format-by-format pitches section]

---

## Q9: Open questions (RESOLVED 2026-05-20)

| # | Question | Resolution |
|---|---|---|
| OQ-1 | Does `/shmo-review/page.tsx` import `<Buybox>`? | ✅ **RESOLVED — YES.** Parent verified by grep: `app/shmo-review/page.tsx:14: import Buybox from "@/components/shmo-review/Buybox";` Plan 05-01 + 05-02 use CR-80 data as defaults so the family page caller renders identically (zero-prop call still works). |
| OQ-2 | Same 1/2/5/10 pack tiers for L-Sign? | ✅ **RESOLVED — YES, mirror CR-80.** Per Jordan's locked decision 2026-05-20 ("Build L-Sign with current CR-80 buybox model"). L-Sign `PACKS` array uses identical 1/2/5/10 structure with `TODO(shopify):` price placeholders for Phase 8 to swap. |
| OQ-3 | L-Sign-specific testimonials, or inherit CR-80/general? | ✅ **RESOLVED — REUSE.** `marketing.md` has no L-Sign-specific testimonials. Reuse Phase 3 `Proof.tsx` as-is. If Jordan surfaces L-Sign quotes later, revisit in Phase 7 polish. |
| OQ-4 | "The math only works when the crew taps" headline OK for L-Sign? | ✅ **RESOLVED — KEEP.** Headline still holds — crew *directing* customers toward the L-Sign at the counter matters. Reuse Phase 3 `Proof` as-is. |
| OQ-5 | `HowItWorks` step 01 "Crew hands the card" mismatch with L-Sign self-serve flow? | ✅ **RESOLVED — REUSE AS-IS for Phase 5.** Acknowledged minor copy inaccuracy. Flagged in Plan Open Decision 4 for potential Phase 7 (cross-PDP mobile polish) editorial pass. |
| OQ-6 | L-Sign-specific video testimonials? | ✅ **RESOLVED — REUSE.** No L-Sign-specific video in `marketing.md`. Reuse Phase 3 `VideoTestimonials` as-is. |

All 6 open questions resolved before plan lock. Plan-checker confirmed PASS 2026-05-20.

---

## Project Constraints (from CLAUDE.md)

- UI work MUST go through `design-system-builder` subagent. Parent never writes `.tsx` / `.css` directly.
- New route: `app/shmo-review/l-sign/page.tsx` (already exists as Coming Soon stub — will be replaced).
- New components: `components/shmo-review/l-sign/` (create if L-Sign-specific components needed; none required per Q4).
- Every utility class `.shm-` prefixed. No `.btn`, no `.card`, no custom primitives.
- Section rotation: marsh / graham / ember / cocoa only.
- Wave dividers via `<Section bg=... nextBg=...>` — never hand-authored `<div className="shm-wave">`.
- No hardcoded prices, SKUs, product names — all in `TODO(shopify):` markers.
- Live store untouched. Phase 5 is local-only, no Shopify Admin writes.
- `design-system-auditor` dispatched after each UI change, before commit.
- Screenshots in `pictures/screenshots/`.

---

## Standard Stack

No new dependencies. Phase 5 uses the exact stack Phase 3 established:

| Library | Version | Purpose |
|---|---|---|
| Next.js App Router | Existing | Route, server components |
| TypeScript | Existing | Type safety |
| Tailwind 4 | Existing | Layout utilities (flex, grid, gap only — appearance via `.shm-*`) |
| Zustand | Existing | Cart state (`useCartStore`) |
| Shmocard design system CSS | Existing | All appearance primitives |

**No installs required.**

---

## Don't Hand-Roll

| Problem | Don't build | Use instead |
|---|---|---|
| Cart state + drawer | Custom cart component | Existing `useCartStore` + `.shm-cart-*` primitives |
| Sticky buy bar | `position: fixed; bottom: 0` | `.shm-buybox-sticky` from `components.css` |
| Pack selector | Custom tier UI | `.shm-pack-rows` + `.shm-pack-row` primitives |
| Gallery | Custom image carousel | Existing gallery pattern from CR-80 `Buybox.tsx` |
| FAQ accordion | Custom accordion | `.shm-faq-list` + `.shm-faq-item` primitives |
| Section backgrounds | Custom bg classes | `.shm-bg-{marsh|graham|ember|cocoa}` via `<Section bg=...>` |

---

## Common Pitfalls

### Pitfall 1: Buybox refactor breaks `/shmo-review` family page
**What goes wrong:** `/shmo-review/page.tsx` may also import `<Buybox>`. If the props refactor removes defaults, the family page breaks.
**Prevention:** Audit `/shmo-review/page.tsx` imports first (plan 05-01). Make all new props optional with CR-80 data as defaults. Existing callers pass nothing and keep current behavior.

### Pitfall 2: Wave divider inside section (recurring bug — 5h debug in Phase 3)
**What goes wrong:** Builder places `<div className="shm-wave...">` inside a `</section>` tag instead of as a sibling. Creates ~40px empty gap between content and wave.
**Prevention:** Always use `<Section bg=... nextBg=...>` — the Section primitive renders the wave as a Fragment sibling automatically. Builder system prompt already enforces this. Symptom to watch: empty space below section content before wave.

### Pitfall 3: Mascot class missing base `.shm-mascot`
**What goes wrong:** Using `.shm-mascot--supporting` without the required base `.shm-mascot` class causes mascot to render at full page width. (This happened in Phase 4 and required a builder follow-up dispatch.)
**Prevention:** Always include both classes: `className="shm-mascot shm-mascot--supporting"`.

### Pitfall 4: L-Sign product data in module scope (not props)
**What goes wrong:** Builder creates a new `LSignBuybox.tsx` fork instead of refactoring `Buybox.tsx` to accept props. Two components diverge and Phase 8 Shopify wiring has to wire both separately.
**Prevention:** Plan 05-01 explicitly states: refactor `Buybox.tsx` to props — do not fork.

### Pitfall 5: Tailwind utilities for appearance
**What goes wrong:** Using `bg-gray-100`, `text-orange-500`, `shadow-md` instead of `.shm-*` tokens. Works visually in dev but bypasses design system — dark-surface text flips fail, color tokens drift.
**Prevention:** Tailwind 4 utilities for layout only (flex, grid, gap, padding). Color, shadow, type = `.shm-*` classes or `var(--color-*)` tokens only.

---

## Assumptions Log

| # | Claim | Section | Risk if wrong |
|---|---|---|---|
| A1 | `/shmo-review/page.tsx` does not directly render `<Buybox>` (so props refactor won't break it) | Q1 / Pitfall 1 | Low — family page likely uses its own buybox-style component or the `FormatPicker` — but must be confirmed in plan 05-01 |
| A2 | L-Sign uses same 1/2/5/10 pack tiers as CR-80 | Q6 page composition + Q9 OQ-2 | Medium — Jordan confirmed "same buybox model" but exact PACKS data not in `product.md`; price points may differ |
| A3 | `Proof.tsx` testimonials are acceptable as-is for L-Sign (no L-Sign-specific quotes exist) | Q3 | Low — `marketing.md` confirmed no L-Sign testimonials |
| A4 | No new mascot imagery needed beyond existing `public/mascot/` set | Q7 | Low — 13 poses in `public/mascot/`, `tap-moment` and `star-burst` are suitable choices |

---

## Environment Availability

Step 2.6 SKIPPED — Phase 5 is a pure Next.js + TypeScript code change. No external services, CLIs, databases, or runtimes beyond the existing dev stack (Node, npm, Next.js dev server). No installs required.

---

## Validation Architecture

### Test Framework
| Property | Value |
|---|---|
| Framework | None detected — no `jest.config.*`, no `vitest.config.*`, no `pytest.ini`, no `tests/` directory |
| Quick run command | `npx tsc --noEmit` (type safety gate) |
| Full suite command | `npm run build` (static generation + type check) |
| Visual verification | Playwright screenshots via `preview_screenshot` MCP |

### Phase Requirements → Test Map
| Req | Behavior | Test Type | Command | Notes |
|---|---|---|---|---|
| Route renders | `/shmo-review/l-sign` loads without console errors | manual/visual | `preview_screenshot url=/shmo-review/l-sign` | After each section added |
| TypeScript clean | No type errors after Buybox refactor | automated | `npx tsc --noEmit` | Run after every plan |
| Build clean | Static generation succeeds for all routes | automated | `npm run build` | Phase close gate |
| Buybox props backward compat | CR-80 and `/shmo-review` unaffected by refactor | manual/visual | `preview_screenshot url=/shmo-review/cr-80` | After 05-01 |
| Design system compliance | All `.shm-` prefixes, no primitive restyles | agent audit | `design-system-auditor` dispatch | After each section |
| Mobile clean | No overflow/clipping at 375px | visual | `preview_screenshot url=/shmo-review/l-sign width=375` | Plan 05-last |

### Wave 0 Gaps
None — no test framework to install. Visual verification via Playwright MCP screenshots is the established pattern from Phase 3.

---

## Security Domain

Phase 5 is static marketing UI + local Zustand cart state. No auth, no sessions, no user data. No server mutations. No new API routes.

- V5 Input Validation: N/A — no form inputs (buybox quantity is a bounded client-side integer, no server submission in Phase 5)
- All other ASVS categories: N/A for this phase

Live store protection: Phase 5 makes no Shopify Admin writes, no DNS changes, no `.env` modifications. [CITED: `.claude/rules/live-store-protection.md`]

---

## Sources

### Primary (HIGH confidence — verified against codebase)
- `components/shmo-review/Buybox.tsx` — confirmed hardcoded product data, props interface
- `app/shmo-review/cr-80/page.tsx` — confirmed section composition + import structure
- `components/shmo-review/cr-80/Proof.tsx` — confirmed server component, reuse profile
- `components/home/FinalCta.tsx` — confirmed props interface (`bg`, `nextBg`)
- `components/shmo-review/HowItWorks.tsx` — confirmed 4-section alternating pattern
- `public/products/l-sign/` directory listing — confirmed imagery exists
- `.planning/phases/03-cr-80-pdp/SUMMARY.md` — confirmed shipped section composition
- `.planning/phases/04-link-hygiene-coming-soon-stubs/04-SUMMARY.md` — confirmed stub at route
- `context/general/product.md` — L-Sign specs, Shopify handle, use case
- `context/general/marketing.md` — L-Sign copy fragments, proof points, voice rules
- `.claude/skills/shmocard-design-system/SKILL.md` — design system primitives, hard rules

### Secondary (MEDIUM confidence — inferred from pattern)
- L-Sign PACKS data will mirror CR-80 structure (Jordan confirmed "same buybox model") but exact prices not in `product.md` — Phase 8 Shopify wiring is the source of truth

---

## Metadata

**Confidence breakdown:**
- Buybox refactor approach: HIGH — component source read directly
- Section reuse verdicts: HIGH — all components read, Phase 3 SUMMARY confirmed
- L-Sign imagery: HIGH — directory listing confirmed
- Copy / headlines: HIGH — `marketing.md` contains explicit L-Sign copy
- Pack tier data: MEDIUM — structure confirmed, exact prices deferred to Shopify

**Research date:** 2026-05-20
**Valid until:** 2026-06-20 (stable — no external deps, no moving ecosystem)
