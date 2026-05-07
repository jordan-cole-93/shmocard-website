---
phase: 03-rebuild
plan: 04
subsystem: shmo-review-category-page
tags: [category, faq, format-cards, bulk-math, marketing]
requires:
  - 03-02 (Section primitive — REQ-09 4-color rotation)
  - 03-foundations (app/layout.tsx, Nav, Footer, Sticker, public/products/*)
provides:
  - /shmo-review category page (REQ-02 satisfied)
  - components/category/* sub-component family (5 files)
  - 3 outbound /shmo-review/{cr-80,l-sign,square-card} link targets for 03-05/06/07 PDPs
affects:
  - app/shmo-review/page.tsx (created)
  - components/category/* (created)
  - pictures/screenshots/03-04-shmo-review-full.png (created)
tech-stack:
  added: []
  patterns:
    - "Server components compose Wave-1 Section + Wave-2 category sub-components"
    - ".shm-* prefix on every visual class; Tailwind reserved for layout"
    - "Page-level CSS owns layout only (grid, padding, aspect-ratio); visuals via design-system primitives"
    - "Locked headline + tagline strings sourced verbatim from context/general/marketing.md"
    - "Static format copy on category page; live product data deferred to PDPs (Shopify Storefront API)"
key-files:
  created:
    - app/shmo-review/page.tsx
    - components/category/category-data.ts
    - components/category/category.css
    - components/category/CategoryHero.tsx
    - components/category/BulkMath.tsx
    - components/category/FormatCards.tsx
    - components/category/CategoryFaq.tsx
    - pictures/screenshots/03-04-shmo-review-full.png
  modified:
    - .planning/phases/03-rebuild/deferred-items.md (DI-03 commit collision, DI-05 .shm-meta dark-section gap)
decisions:
  - "Inline HowItWorksShort + Proof inside page.tsx instead of separate components — they're page-specific compositions of design-system primitives, not reusable category-area components"
  - "Proof block on .shm-bg-cocoa renders rows directly without .shm-card wrapper to avoid white-on-white .shm-h3 cascade collision"
  - "Bulk math grid shows 4 tiers (1/3/5/10 employees) with no prices — illustrative volume per marketing.md only; pricing lives in Shopify on the PDPs"
  - "Replaced .shm-h3 with .shm-h2 for proof percentages so the metric reads as the primary visual element of each row"
  - "Built self-contained client FAQ accordion in CategoryFaq.tsx because shared FaqItem ships in 03-03 and isn't yet importable; refactor when 03-03 lands"
metrics:
  duration_minutes: ~25
  tasks_completed: 2
  files_changed: 8
  completed: 2026-05-07
---

# Phase 3 Plan 04: /shmo-review category page Summary

Built and browser-verified the `/shmo-review` Shmo Review category page — locked headline + tagline, illustrative bulk-math grid, three format cards routing to PDPs, 5-step compressed how-it-works, 6 real-shop proof results + 2 pull-quotes, and an 8-question FAQ. Server-rendered Next.js App Router page composing Wave-1 Section primitive with new Wave-2 category sub-components.

## Sections built (top → bottom)

| # | Section | Bg | Component | Notes |
|---|---|---|---|---|
| 1 | Hero | marsh | `CategoryHero` | Eyebrow · `.shm-display` headline · `.shm-hand` tagline · lede · 2 CTA buttons (See formats, See the math) |
| 2 | Bulk Math | graham | `BulkMath` | 4-tier grid (1/3/5/10 employees) with cards count, taps/shift, reviews/month, no prices |
| 3 | Formats | marsh | `FormatCards` | 3 cards: CR-80 · L-Sign · Square Card. Each links to `/shmo-review/{slug}` |
| 4 | How It Works | marsh | inline `HowItWorksShort` | 5 numbered steps (compressed from product.md's 6-step explainer) |
| 5 | Proof | cocoa | inline `Proof` | 6 verified shop results (+86% to +47%) + 2 testimonial blockquotes |
| 6 | FAQ | marsh | `CategoryFaq` | 8 questions covering all 6 required areas; soft `.shm-faq-list` + 1 mascot sticker (thinking pose) |

Wave dividers emitted between every bg change. No wave between adjacent same-bg sections (formats → how it works), which is the design system's expected behavior when `nextBg` matches `bg`.

## Locked content verification

| Requirement | Source | Rendered string | Verified |
|---|---|---|---|
| Headline | `marketing.md` line 56 | `One tap. One five-star review.` | ✅ Playwright `isVisible()` |
| Tagline | `marketing.md` line 57 | `Built for crews. Priced for bulk.` | ✅ Playwright `isVisible()` |
| Format hrefs | plan `<interfaces>` | `/shmo-review/cr-80` · `/shmo-review/l-sign` · `/shmo-review/square-card` | ✅ All 3 link counts ≥ 1 |
| Mascot budget | design-system rules | 1 sticker (thinking pose, FAQ block) | ✅ Within budget of 2 |

## FAQ draft (Jordan reviews at sign-off)

8 entries in `components/category/category-data.ts` `CATEGORY_FAQ`:

1. **what** — What is Shmo Review? *(verbatim from marketing.md)*
2. **why-bulk** — Why one card per crew member? *(verbatim from marketing.md)*
3. **how** — How does it work? *(compressed from marketing.md "How it works (compressed)" + product.md "How it works (full process)")*
4. **cost** — What does it cost? *(drafted: bulk discount + free expedited 10+ + "see PDP for current pricing" — no hardcoded prices per shopify-data-discipline.md)*
5. **proof** — What do other shops say? *(drafted from marketing.md Verified Proof Points + Standout Single-Shop Moments)*
6. **format** — What format do I need? *(drafted from product.md format pitches — CR-80 wallet, L-Sign counter, Square Card adhesive)*
7. **phone** — Does it work with every phone? *(verbatim from marketing.md)*
8. **returns** — What if my crew hates it? *(verbatim from marketing.md)*

## Grep checks (all clean at task close)

| Check | Pattern | Scope | Result |
|---|---|---|---|
| Pawn Leads brand leak | `pawn leads\|pawnleads` | `app/shmo-review/` + `components/category/` | 0 matches |
| Hex literal in code | `#[0-9a-fA-F]{3,8}\b` | same scope | 0 matches |
| Tailwind visual utility | `(bg\|text\|border\|rounded\|shadow)-[a-z]+-[0-9]` (excluding `shm-`) | same scope | 0 matches |

## Browser verification (2026-05-07, 1440×900 viewport)

- HTTP status: 200
- Headline visible: true
- Tagline visible: true
- Mascot count: 1 (within budget)
- Format hrefs found: 3 (each appearing 2× in DOM — anchor + Next.js prefetch)
- Console errors: 0
- 4xx/5xx responses: 0
- Screenshot: `pictures/screenshots/03-04-shmo-review-full.png` (559K, full-page)

Visual review: section rotation reads correctly, all 6 proof percentages legible after the .shm-meta dark-section fix, format card images render from `/products/{cr80,l-sign,plate}/transparent/`, FAQ accordion expand/collapse works.

## Commits

| Task | Commit (intended) | Commit (actual) | Notes |
|---|---|---|---|
| 1 | `feat(03-04): add /shmo-review category sub-components + content data` | `27cb2d5` (message only) + `ce7c52d` (content) | Parallel-agent collision — see DI-03 |
| 2 | `feat(03-04): compose /shmo-review category page + browser-verified screenshot` | `9849306` | Clean commit with all 03-04 task-2 content |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 — Bug] Proof percentages invisible on cocoa-bg section (white-on-white)**
- **Found during:** Task 2 browser verification (first screenshot pass)
- **Issue:** Wrapping proof rows in `.shm-card` (white surface) inside `.shm-bg-cocoa` triggered the design-system cascade `.shm-bg-cocoa .shm-h3 → marshmallow`, painting the percentage white on a white card.
- **Fix:** Removed the `.shm-card` wrapper from proof rows so the cocoa section's text-flip cascade applies cleanly to the metric. Promoted metric from `.shm-h3` to `.shm-h2` for visual emphasis. Quotes also drop the card wrapper.
- **Files modified:** `app/shmo-review/page.tsx` (Proof inline component)
- **Commit:** `9849306`

**2. [Rule 1 — Bug] `.shm-meta` text invisible on cocoa background**
- **Found during:** Task 2 browser verification (proof section owner names)
- **Issue:** Design-system dark-section cascade flips display/h1-3/lede/body/eyebrow + hairlines on cocoa, but skips `.shm-meta`. `var(--color-muted)` reads dark-on-dark.
- **Fix:** Added a 2-rule layout-file exception in `components/category/category.css` flipping `.shm-meta` to translucent marshmallow inside `.shm-bg-cocoa .cat-proof__*`. Token-only (no hex).
- **Files modified:** `components/category/category.css`
- **Commit:** `9849306`
- **Logged:** `deferred-items.md` DI-05 — recommended fix is to add the rule globally in `colors_and_type.css` and remove the local override.

**3. [Rule 1 — Bug] Pawn Leads brand-leak grep matched my own protective comment**
- **Found during:** Task 2 grep checks
- **Issue:** I wrote a comment in `category-data.ts` reading "Never the words 'Pawn Leads' or 'PawnLeads'" — an instruction comment that itself violated the no-pawn-leads grep rule per CONTEXT.md (no string ... in any rendered HTML, alt text, image filename, OR comment).
- **Fix:** Reworded the comment to reference "the agency" without naming it.
- **Files modified:** `components/category/category-data.ts`
- **Commit:** `9849306`

### Cosmetic Issues (logged, not fixed)

**DI-03 — Parallel-agent commit collision (Task 1 commit attribution mismatched)**
- See `deferred-items.md` DI-03. Two commits landed with mismatched messages and content because plan 03-12 was running in parallel against the same working tree. On-disk content is correct; git log message attribution is wrong for `27cb2d5` ↔ `ce7c52d`. CI green; no runtime bug.

**DI-04 — Generator filenames in product image URLs**
- Pre-existing from 03-03. My FormatCards uses `magnific_*.png` paths (the actual on-disk filenames). No fix here — defer to a future asset-cleanup pass per DI-04.

**DI-05 — `.shm-meta` not flipped on dark sections (design-system gap)**
- Mitigated locally for 03-04. Design-system fix recommended.

### No-deviations note

The plan's section-structure table specified `marsh → marsh` for FormatCards (i.e., FormatCards is on marsh and the section after is also marsh). I rendered this as `bg="marsh"` with `nextBg` undefined (no wave divider between same-bg sections), per the Section primitive's correct behavior. This matches the plan's intent — wave dividers only fire on color changes.

## Threat Flags

None. The category page is server-rendered, has no user inputs, no auth, no Storefront API calls (those land in 03-05/06/07 PDPs). Format-card hrefs are internal `<Link>` only; no external URLs.

## Self-Check: PASSED

**Files (8/8 found):**
- ✅ `app/shmo-review/page.tsx`
- ✅ `components/category/category-data.ts`
- ✅ `components/category/category.css`
- ✅ `components/category/CategoryHero.tsx`
- ✅ `components/category/BulkMath.tsx`
- ✅ `components/category/FormatCards.tsx`
- ✅ `components/category/CategoryFaq.tsx`
- ✅ `pictures/screenshots/03-04-shmo-review-full.png`

**Commits (2/2 verified in `git log`):**
- ✅ `27cb2d5` (message-only — content split with `ce7c52d` per DI-03)
- ✅ `9849306` (clean Task 2 commit)

**Build:** `npm run build` exits 0; `/shmo-review` registered as static route.

**Browser:** 200 OK, 0 console errors, locked strings visible, 3 format hrefs resolve, screenshot saved.
