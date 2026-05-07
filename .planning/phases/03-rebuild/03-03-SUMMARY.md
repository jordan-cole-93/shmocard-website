---
phase: 03-rebuild
plan: 03
subsystem: homepage
tags: [home, hero, sub-brands, marketing, framer-motion, design-system]
requires:
  - 03-01-SUMMARY.md
  - 03-02-SUMMARY.md
provides:
  - homepage at /
  - Section primitive composition pattern (13 sections)
  - SubBrandSpotlight reusable across 4 sub-brands
  - HeroTypeCycle reusable client component
  - Reveal framer-motion shell
  - home-data.ts content registry (typed)
affects:
  - app/page.tsx (was smoke test)
tech-stack:
  added: []
  patterns:
    - Section primitive enforces 4-color rotation at type level
    - .shm-* prefix on every visual class (zero rogue Tailwind color/radius/shadow utils)
    - 'use client' only on leaf interactivity (HeroTypeCycle, FaqItem, Reveal)
    - 200px mascot showcase exception used 3× on homepage sub-brand spotlights
    - waitlist trigger button stub via data-waitlist={slug} (real wiring deferred to 03-10)
key-files:
  created:
    - components/home/home-data.ts
    - components/home/home.css
    - components/home/Reveal.tsx
    - components/home/Hero.tsx
    - components/home/HeroTypeCycle.tsx
    - components/home/AudienceStrip.tsx
    - components/home/Proof.tsx
    - components/home/SubBrandSpotlight.tsx
    - components/home/CrewStrip.tsx
    - components/home/HowItWorks.tsx
    - components/home/VideoTestimonials.tsx
    - components/home/Compatibility.tsx
    - components/home/HomeFaq.tsx
    - components/home/FaqItem.tsx
    - components/home/FinalCta.tsx
    - pictures/screenshots/03-03-homepage-full.png
    - pictures/screenshots/03-03-homepage-hero.png
  modified:
    - app/page.tsx (replaced smoke-test composition)
    - .planning/phases/03-rebuild/deferred-items.md (DI-04 added)
decisions:
  - HowItWorks waves marsh→marsh (not marsh→graham as in TRANSLATION) so VideoTestimonials sits on marsh in the rotation. Compatibility takes the graham slot before HomeFaq.
  - Hero type-cycle reserves min-width via JS measurement of the longest alt ("asking for"), eliminating layout shift between cycles.
  - VideoTestimonials media-bg variants are flat color (ember/cocoa/honey) — gradients banned by design-system rule. Original reference used gradients (showcase exception); we strip them per "normal marketing pages must follow rules strictly".
  - Crew tile placeholders use the .crew-tile primitive with a "Photo coming" chip until real assets land (per CONTEXT.md asset readiness table).
metrics:
  duration_minutes: 12
  tasks_completed: 2
  files_created: 17
  files_modified: 2
completed_date: 2026-05-07
---

# Phase 03 Plan 03: Homepage Build Summary

**One-liner:** Replaced smoke-test page.tsx with the real Shmocard homepage — 13 composed sections, locked headline with type-cycling em accent, all 4 sub-brands at equal visual weight, and a strict 4-color section rotation.

## What was built

### Task 1 — Scaffold (commit `98bbc19`)

Built the content registry, layout-only CSS, and 14 component files (12 home sections + Reveal motion shell + FaqItem leaf):

- **`home-data.ts`** — typed constants:
  - `SUB_BRANDS[4]` (Review, Biz, Link, Reputation in source order, B6)
  - `AUDIENCES[10]` (B2 — exact source order locked)
  - `SHOPS[8]` (real shop names + owner first names + verified review-volume increases)
  - `QUOTES[2]` (verbatim from marketing.md)
  - `HOW_STEPS[6]` (B4 locked)
  - `FAQ[7]` (drafted from marketing.md FAQ table — Jordan reviews at sign-off per B5)
  - `VIDEO_TILES[3]` (Carly two-clip pair + Joey pending tile)
- **`home.css`** — layout-only translation of the reference `home.css`. NO primitive restyles — every grid/padding/aspect-ratio block is layout-only and the appearance comes from `components.css`.
- **`Reveal.tsx`** — `'use client'` framer-motion `whileInView` shell, `0.22s` ease-standard, viewport `{ once: true, margin: '0px 0px -10% 0px' }`.
- **`HeroTypeCycle.tsx`** — `'use client'` AnimatePresence crossfade between `["missing", "asking for"]`, 2.5s interval, 150ms fade. Min-width reserved by JS measurement of the longest word.
- **`FaqItem.tsx`** — `'use client'` accordion leaf composing `.shm-faq-trigger` / `.shm-faq-question` / `.shm-faq-answer` primitives. No restyles.
- 11 section components — Hero, AudienceStrip, Proof, SubBrandSpotlight, CrewStrip, HowItWorks, VideoTestimonials, Compatibility, HomeFaq, FinalCta — all server components composing the `Section` primitive with `bg` / `nextBg` props.

### Task 2 — Compose + browser verify (commit `192f5f7`)

`app/page.tsx` composes the 13 sections in source order with explicit `nextBg` props per section to enforce the 4-color rotation:

| # | Section | bg | nextBg | reverse | wave |
|---|---|---|---|---|---|
| 1 | Hero | marsh | graham | — | md |
| 2 | AudienceStrip | graham | marsh | — | md |
| 3 | Proof | marsh | marsh | — | md |
| 4 | SubBrandSpotlight Review | marsh | marsh | no | md |
| 5 | CrewStrip | marsh | graham | — | md |
| 6 | SubBrandSpotlight Biz | graham | marsh | yes | md |
| 7 | SubBrandSpotlight Link | marsh | cocoa | no | md |
| 8 | SubBrandSpotlight Reputation | cocoa | marsh | yes | xl |
| 9 | HowItWorks | marsh | marsh | — | md |
| 10 | VideoTestimonials | marsh | graham | — | md |
| 11 | Compatibility | graham | marsh | — | md |
| 12 | HomeFaq | marsh | ember | — | lg |
| 13 | FinalCta | ember | (footer) | — | — |

The Reputation→HomeFaq transition uses `waveSize="xl"` per the home.css comment ("the default 18px wave reads as a flat sliver against the dramatic color shift").

## Verification

- `npm run build`: PASS — 6/6 static pages generated, `/` is 42 kB / 144 kB First Load JS.
- Browser verified at `http://localhost:3030/` via headless Chrome (Playwright not installed locally; CLI fallback used).
- **Anti-pattern grep checks (all returned ZERO):**
  - `git grep -in 'pawn leads\|pawnleads\|@pawnleads' app/ components/ public/` → 0 matches
  - `git grep -nE 'admin\.shopifyapis\.com|/admin/api/' app/ components/ lib/` → 0 matches
  - `grep -rnE 'className="[^"]*\b(bg|text|border|rounded|shadow|font|animate)-[a-z]+-[0-9]'` (rogue Tailwind visual utils) → 0 matches
  - `grep -rnE '#[0-9a-fA-F]{3,8}\b' app/page.tsx components/home/` → 0 matches
- Hero type-cycle visually swaps between "missing" and "asking for" without layout shift (min-width reserved).
- Section rotation reads cleanly in screenshots (marsh→graham bands alternating, ember/cocoa accents in correct slots).
- All 4 sub-brands visible with equal visual weight (same headline scale, same checklist primitive, same CTA pair shape).
- Cocoa Reputation spotlight correctly flips em color to honey (`.shm-bg-cocoa .spotlight__h em` rule).

## Screenshots

- **Hero (above the fold, 1440×900):** `pictures/screenshots/03-03-homepage-hero.png`
- **Full page (1440×7800):** `pictures/screenshots/03-03-homepage-full.png`

## Deviations from plan

### Auto-fixed

1. **[Rule 1 — Bug] CR-80 hero/spotlight image 404** — plan referenced `/products/cr80/transparent/cr80-trio.png` which doesn't exist in `public/`. Actual files use generator filenames (`magnific_2884306972.png`). Pointed both Hero tile + Review spotlight chip at the real file. Logged DI-04 for follow-up renaming pass.
   - **Files modified:** `components/home/home-data.ts`, `components/home/Hero.tsx`
   - **Commit:** `192f5f7`

2. **[Rule 1 — Bug] HARD-RULE comment in `home-data.ts` violated its own rule** — initial comment included the literal string the rule prohibits. Rephrased to use a generic "services agency" reference so the pawn-leads grep returns 0.
   - **Files modified:** `components/home/home-data.ts`
   - **Commit:** `98bbc19`

3. **[Rule 3 — Blocking] HowItWorks `nextBg` adjusted** — TRANSLATION row #9 has HowItWorks `marsh→graham`, but plan 03-03 also lists VideoTestimonials in the rotation, which the TRANSLATION table doesn't slot into. Set HowItWorks `nextBg=marsh` so VideoTestimonials sits on marsh and Compatibility takes the graham slot. Net rotation still respects `marsh ~60% / graham ~25% / ember ~10% / cocoa ~5%`.
   - **Files modified:** `components/home/HowItWorks.tsx`, `components/home/VideoTestimonials.tsx`, `app/page.tsx`
   - **Commit:** `192f5f7`

### New deferred items

- **DI-04** — product asset filenames not yet on friendly slugs. Logged in `.planning/phases/03-rebuild/deferred-items.md`. Owner: future asset-cleanup plan or Phase 4 polish pass.

## FAQ draft (for Jordan review per CONTEXT.md B5)

Drafted from `marketing.md` FAQ table + `product.md` content. Live at `components/home/home-data.ts:FAQ`. The 7 entries:

1. **What is ShmoCard?** ShmoCard is a family of NFC tools built for local shop crews — review cards, business cards, link hubs, and an AI review responder. One brand, one dashboard, one-time card purchase.
2. **Does it work with every phone?** iPhone XS and newer (2018+) and Android 5.0 and newer have NFC built in — customers tap and the page opens. A QR code on the back covers any phone that can't.
3. **Can I change where the card sends people?** Yes — every card is reprogrammable for life. Update the destination URL from the dashboard whenever you want.
4. **Why one card per crew member?** A card behind the counter captures roughly 2 reviews a week. One per employee captures roughly 15. The card has to live with the person handing the customer their coffee, keys, or receipt — not on the counter.
5. **How fast does it ship?** Orders placed by Tuesday 5pm CT ship Friday. Standard shipping is 3 days; bulk orders of 10 or more ship free expedited.
6. **Is the card printed with our brand?** Yes — every order is custom-printed with your shop's logo, name, and color treatment. Send us your assets at checkout.
7. **What if my crew hates it?** 30-day no-questions returns. Box it back up and we'll refund the full amount.

Jordan: edit verbatim in `components/home/home-data.ts` — these are typed constants, not JSX, so swapping copy is a single-file change.

## Self-Check: PASSED

**Files exist:**
- `components/home/home-data.ts` — FOUND
- `components/home/home.css` — FOUND
- `components/home/Reveal.tsx` — FOUND
- `components/home/Hero.tsx` — FOUND
- `components/home/HeroTypeCycle.tsx` — FOUND
- `components/home/AudienceStrip.tsx` — FOUND
- `components/home/Proof.tsx` — FOUND
- `components/home/SubBrandSpotlight.tsx` — FOUND
- `components/home/CrewStrip.tsx` — FOUND
- `components/home/HowItWorks.tsx` — FOUND
- `components/home/VideoTestimonials.tsx` — FOUND
- `components/home/Compatibility.tsx` — FOUND
- `components/home/HomeFaq.tsx` — FOUND
- `components/home/FaqItem.tsx` — FOUND
- `components/home/FinalCta.tsx` — FOUND
- `pictures/screenshots/03-03-homepage-full.png` — FOUND (1.3 MB)
- `pictures/screenshots/03-03-homepage-hero.png` — FOUND (206 kB)

**Commits exist on `main`:**
- `98bbc19` feat(03-03): scaffold home-data + 11 section components + Reveal/HeroTypeCycle — FOUND
- `192f5f7` feat(03-03): compose homepage — 13 sections + section rotation + screenshots — FOUND
