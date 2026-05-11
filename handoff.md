# handoff.md — Session Handoff

**Last session:** 2026-05-11 — audited the `/shmo-review` rebuild against the Shmocard design system and refactored the worst violations onto primitives.

---

## Project phase

**Phase 3 — Rebuild, mid-stream.** The `/shmo-review` page was rebuilt earlier today from the new component scaffold (`components/shmo-review/*`) and is now design-system compliant on its biggest violation surfaces. Homepage and 3 PDP rebuilds are still pending per `context/general/scope.md`.

---

## What was done this session

- **Design-system audit of `/shmo-review`** — produced `.planning/audits/shmo-review-audit.md` after the page renders failed the "100% design-system" bar. Scored 52/100 with 4 critical, 7 high, 6 medium, 4 low violations. Headline finding: page CSS was rebuilding `.shm-card` primitives instead of composing them.
- **Critical refactors landed:**
  - **C1 — FormatPicker** (`components/shmo-review/FormatPicker.tsx`, `components/shmo-review/shmo-review.css:123–196`): now composes `.shm-card --cream --hover` + `.shm-image-frame --bare` + `.shm-badge --honey/--soft`. Badge tone derived from text. Page CSS owns layout only.
  - **C2 — StandoutMoments** (`components/shmo-review/StandoutMoments.tsx`, `components/shmo-review/shmo-review.css:573–625`): now composes `.shm-card --hard --ember/--cocoa/--honey` (audit H5 promoted to `--hard` for "when it counts"). Chunky outline + offset shadow visible. M2 fixed in passing — `<figcaption>` now lives inside `<figure>`.
  - **C3 — Objections** (`components/shmo-review/Objections.tsx`, `components/shmo-review/shmo-review.css:716–751`): now composes `.shm-card --chocolate`. Ad-hoc `color-mix(... transparent)` borders removed; text-flip inherits from variant.
  - **C4 — Phone-frame shadow** (`components/shmo-review/shmo-review.css:248`): `box-shadow: 0 30px 80px var(--color-hair-2)` → `var(--shadow-chunk)`. No more blurred drop-shadow.
- **High refactors landed:**
  - **H1 — Section rotation** (`app/shmo-review/page.tsx:48–122`): rebuilt to clean `marsh → graham` alternation. Previous order had five marsh-marsh runs and read monochrome. Now: marsh→graham→marsh→graham→marsh→graham→marsh→cocoa→marsh→graham→ember. BuyboxSection moved from marsh to graham per audit recommendation.
  - **H2 — Format card hover blur** — resolved as a side effect of C1.
  - **H3 — `--color-clover`** (`components/shmo-review/shmo-review.css:472, 487`): submitted phone-screen surface swapped to `--color-ember` (system surface, not the unaudited `clover`).
  - **H5 — Standout soft cards** — resolved by C2 (now `--hard`).
- **Verification:** typecheck clean. Screenshots saved to `pictures/screenshots/`:
  - `format-picker-c1-refactor.png`
  - `standout-moments-c2-refactor.png`
  - `objections-c3-refactor.png`
  - `shmo-review-after-audit-fixes-fullpage.png` (full-page proof of rotation + all card refactors)

---

## What's next

**Phase 3 — continue Rebuild** per `context/general/scope.md`.

In priority order:

1. **Jordan reviews `/shmo-review` in the browser.** The screenshots prove it renders, but the cadence and tonal-card placement need a human eye. Specifically: does BuyboxSection on graham still feel right for the conversion-critical section?
2. **Finish the remaining audit items on `/shmo-review`:**
   - H4 — Recompose the inner phone review-card mock onto `.shm-card` (`components/shmo-review/shmo-review.css:399–467`).
   - H6 — Replace remaining ad-hoc `color-mix(... transparent)` calls in the phone-screen mock + numbers-bar fill with named tokens or drop them.
   - H7 — Verify `ShipReturns.tsx` SVG stroke widths are 2.4–2.6px (audit didn't fully confirm).
   - M1, M3–M6, L1–L4 — cleanup pass. None are blocking; do them or punt.
3. **Then rebuild the homepage** (next page after `/shmo-review` per scope.md). Same composition discipline: build the page by composing primitives, not by inventing BEM cards in page CSS. `BuyboxClient.tsx` is the model — it does this correctly.

---

## Open decisions

- **BuyboxSection on graham vs marsh.** Audit endorsed graham (rotation rhythm); the actual conversion section now sits on a slightly warmer beige. Jordan should eyeball whether product photography reads as clean on graham as it did on marsh. Easy revert if not.
- **`shm-stat-xl` token** (audit M3/M4): standout `__big` (96px) and bullet-strip `__stat` (84px clamp) are outside the current type ramp. Either tune them down to existing ramp values, or add a new ramp class to `.claude/skills/shmocard-design-system/colors_and_type.css`. Needs Jordan's call.
- **Phone review-card recompose (H4).** It's a decorative inner mock inside the sticky-scroll. Worth refactoring for purity, or punt as "decorative, leave alone"?

---

## How to start next session

1. Read this file.
2. Read `CLAUDE.md`.
3. Read `.planning/audits/shmo-review-audit.md` for the remaining punch list.
4. Ask Jordan: **"Did BuyboxSection on graham feel right when you reviewed `/shmo-review`? Continue the audit punch list, or pivot to the homepage rebuild?"**
5. If continuing: pick up at H4 (phone review-card on `.shm-card`).
6. If pivoting to homepage: open `.claude/skills/shmocard-design-system/ui_kits/website/homepage-shmocard/Shmocard Homepage.html` first — it's the canonical reference, copy structure rather than invent.
