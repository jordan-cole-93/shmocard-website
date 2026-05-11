# Shmo Review Design System Audit — 2026-05-11

## Summary

- **Compliance score: 52 / 100**
- **Critical: 4 · High: 7 · Medium: 6 · Low: 4**
- **Headline finding:** the page reads as "design-system-flavored" but the heavy lifting (cards, format tiles, objection cards, standout cards, phone-frame shadow) is hand-rolled in `shmo-review.css` instead of composing `.shm-card` / `.shm-image-frame` / `.shm-faq-list` primitives. The page CSS owns far more appearance than the rule allows — page CSS should own LAYOUT only. Section rotation also breaks the cadence (three consecutive marsh sections, no graham/ember breathing room before the dark transition).

---

## Critical violations (must fix)

### C1 — `shmo-review.css:130–222` — `.rev-format-card` rebuilds `.shm-card`
The format picker tile is a full hand-rolled card primitive: own background, border, radius, padding, hover transform, hover border-color, hover box-shadow, `__media` / `__body` / `__name` / `__price` / `__foot` sub-parts. This is exactly what the rule names as a smell test:
> "If you're typing `.foo__btn`, `.foo__pill`, `.foo__card`, stop — you're rebuilding a primitive."
**Rule:** "Reuse primitives. Never restyle them." (`design-system.md` Hard rules)
**Fix:** wrap each format in `<article class="shm-card shm-card--cream">` (or `--honey` for the popular tone), put the image inside `.shm-image-frame`, use `.shm-badge` for the tone tag, and use `.shm-h4` / body type for the name + blurb. Keep only `.rev-format-grid` for the 3-column grid in page CSS.

### C2 — `shmo-review.css:586–660` — `.rev-standout-card` rebuilds `.shm-card --ember/--cocoa/--honey`
Same offense. Three full tone variants (`--ember`, `--cocoa`, `--honey`) are hand-coded with their own background, border, color, and `__big`/`__metric`/`__quote`/`__attr` sub-parts. The system already has `.shm-card --ember`, `--cocoa`, `--honey` — the variants you need exist.
**Fix:** compose `<article class="shm-card shm-card--ember">` and put the stat / quote / attribution inside as semantic children. Only `.rev-standout-grid` (the 3-col grid) stays in page CSS.

### C3 — `shmo-review.css:733–764` — `.rev-objection-card` rebuilds a card-on-dark primitive
On the cocoa-deep section, the Objection card invents its own marshmallow-mix background + border + radius. The system's dark-section text flip happens automatically via `.shm-bg-cocoa` cascade — wrapping in `.shm-card` would inherit it for free.
**Fix:** swap to `<article class="shm-card shm-card--chocolate">` (or `--cocoa` matching the section). Keep only `.rev-objections-grid` layout.

### C4 — `shmo-review.css:248` — `.rev-phone-frame` uses a 30px / 80px-blur drop shadow
```css
box-shadow: 0 30px 80px var(--color-hair-2),
            0 0 0 1px color-mix(in srgb, var(--color-cocoa-deep) 8%, transparent);
```
**Rule:** "No drop-shadow blurs." Only `--shadow-chunk` is allowed (4px offset, NO blur). The 1px ring is fine; the 80px blur is a hard violation.
**Fix:** replace with `box-shadow: var(--shadow-chunk)` or drop the shadow entirely. The phone reads as a 3D object already from its rounded corners and dark body.

---

## High violations

### H1 — `app/shmo-review/page.tsx:60–105` — section rotation cadence is broken
Order: marsh → graham → **marsh → marsh** → graham → **marsh → marsh** → cocoa → **marsh → marsh** → ember. **Five** instances of two-marsh-in-a-row, no ember section before the FinalCta, no graham between marsh blocks.
**Rule:** "Section rotation = four bgs only … `marsh` (default ~60%) → `graham` (~25%) → `ember` (~10%) → `cocoa` (~5%)" with default order Marsh → Graham → Marsh → Ember → Marsh → Cocoa. Three marsh sections back-to-back kills rhythm and makes the page feel monochrome.
**Fix:** put one of (FormatPicker | BuyboxSection | ShipReturns | ReviewFaq) on a non-marsh bg. Suggested: BuyboxSection on `graham` (it's the workhorse section and graham is the workshop tile), or ShipReturns on `graham` as a utility strip, or push ReviewFaq to `graham` so the ember FinalCta has a real graham→ember transition.

### H2 — `shmo-review.css:148, 248` — page CSS owns drop-shadow appearance
Hover shadow on format card (`0 12px 40px`) is a blur. Same problem as C4 — only `--shadow-chunk` is allowed.
**Fix:** on hover, swap to `--shadow-chunk` (and the card's intrinsic outline goes hard via `.shm-card--hard`), or no shadow at all and lean on the `--outline-hard-3` 4px chunk-offset.

### H3 — `shmo-review.css:471` — `.rev-phone-screen--submitted` uses `var(--color-clover)`
There is no `clover` in the four-color rotation or the 10-surface palette (white · marshmallow · cream · graham-soft · graham-gold · honey · ember · cherry · chocolate · cocoa-deep). The success screen in the phone mock is using a non-system green.
**Fix:** swap to a system surface. The success-state token is the success callout — use the `.shm-callout--success` palette or pick `--color-honey` / `--color-ember` / `--color-cocoa-deep` for the screen background. If you genuinely need a green success surface, propose adding it to `colors_and_type.css` rather than declaring it inline.

### H4 — `shmo-review.css:399–467` — `.rev-phone-review-card` reinvents card + button + stars
The mini review card inside the phone has its own border, radius, gap, textbox surface, and a "post button" rendered as a chocolate panel. Stars are hand-drawn SVGs. This is a system inside a system.
**Fix:** the phone-screen mock is decorative — keep it self-contained, but pull the visible bits from primitives: `.shm-card` for the wrapping card, `.shm-btn--cocoa` for the post button (constrained to phone width via page CSS), `.shm-rating__stars` for the star row. Anything left over (the textbox shim) is legitimate page CSS.

### H5 — `shmo-review.css:586–610` — Standout cards bypass `.shm-card --hard`
The standout cards have `border: 1.5px solid var(--color-hair)` defaults — but the homepage reference treats the stat-quote tile as a `.shm-card--hard` candidate (chunky outline + offset shadow, anchored). Soft hairlines on a 3-column hero-statement grid undersell the moment.
**Rule:** "Soft by default, hard when it counts." Standout is exactly "when it counts."
**Fix:** `.shm-card --hard --ember` / `--cocoa` / `--honey`. Drop the hand-rolled border + radius.

### H6 — `shmo-review.css:381–384, 644, 652, 763` — `color-mix(... transparent)` for surfaces
Multiple surfaces are built from `color-mix(in srgb, var(--color-marshmallow) X%, transparent)`. These are not real tokens — they're ad-hoc translucency. The system's hairlines (`--color-hair`, `--color-hair-2`) and surfaces are flat solids.
**Fix:** use `--color-hair-on-dark` / `--color-hair` (whichever the design system exposes) for borders, and `--color-marshmallow` / `--color-cream` for surfaces. If a translucent value is truly needed (dark-section dividers), add a named token to `colors_and_type.css` instead of mixing inline.

### H7 — `shmo-review.css:794` — icon stroke just below the 2.4–2.6 floor in some children
Most page-level SVGs use `stroke-width: 2.4` which is compliant. Audit confirms `ChecklistTick` is at 2.5 (compliant). However, in `shmo-review.css:794` the ship-returns icons declare `stroke-width: 2.4` on the wrapper, but the inline SVGs in `ShipReturns.tsx` likely need verification — confirm no Lucide / Heroicon imports landed accidentally.

---

## Medium violations

### M1 — `Hero.tsx:18` — `rev-hero` and `rev-hero__inner` collapsed onto one element
The CSS treats `.rev-hero` (positioning context) and `.rev-hero__inner` (flex column) as two separate selectors. Both classes on one `<div>` works because the rules don't conflict, but the comment in the CSS shows the original intent was a wrapper + inner pair. Either delete the unused selector or restore the wrapper.

### M2 — `StandoutMoments.tsx:32` — `<figcaption>` without `<figure>` parent
`<figcaption>` is required to be inside `<figure>`. Currently it lives inside `<article>`.
**Fix:** wrap the quote + attribution in `<figure>` or change `<figcaption>` to `<div>`.

### M3 — `shmo-review.css:88–97` — Bullet-strip stat uses `clamp(56px, 5.6vw, 84px)` outside the type ramp
The display-size stat font is hand-tuned rather than using `.shm-stat` / `.shm-h1` / `.shm-h2`. Tokens, not hand-tuned `clamp()`.
**Fix:** use the closest ramp class (e.g. `.shm-h1` or `.shm-stat` if it exists). If the ramp doesn't have what you need, add it to `colors_and_type.css` — don't fork it in page CSS.

### M4 — `shmo-review.css:611–660` — `.rev-standout-card__big` size 96px also outside ramp
Same as M3 — a 96px stat number is `.shm-stat-xl` territory. Define it once in the system or use the existing ramp.

### M5 — `shmo-review.css:540–544` — `padding: 28vh 0` and `gap: 28vh` on `.rev-how-stage__steps`
Viewport-height padding for the scroll-stage is creative but coupling to viewport-height breaks on short browsers / mobile landscape / Safari URL-bar bounce. Use a fixed token (`var(--section-py-d-xl)`) plus a sensible CSS variable.
**Fix:** swap `vh` to `var(--section-py-d-xl)` and let the sticky behavior do the work, or scope `vh` behind a `@media (min-height: 720px)` guard.

### M6 — `BuyboxClient.tsx:159–164` — "Most popular" defaults to highest-quantity, no `data-popular` system marker
Functionally fine, but the design system uses `data-selected` / `data-popular` attributes on pack-rows. The component already uses `data-selected`; double-check `shm-pack-row__pop` matches the system's "Most popular" badge convention versus a one-off span.

---

## Low / nits

### L1 — `shmo-review.css:65–70` — `.rev-dot` for meta-row dot
Tiny 4×4 dot reinvented in page CSS. The hero-meta separator is `·` (U+00B7) on the homepage reference — drop the `<span class="rev-dot">` element entirely.

### L2 — `shmo-review.css:879–884` — `.rev-bb__rule` as `<hr>` with custom border
Pure layout — fine, but the system likely has `.shm-rule` or similar. If it does, use it. If not, this is the rare legitimate page CSS.

### L3 — Hero.tsx — `<em>bulk</em>` in headline is one word — **compliant**.
Documented as a passing check, not a violation. The ember accent rule is honored here.

### L4 — `shmo-review.css:912–915` — `.rev-bb__error` uses `var(--color-ember)` for error text
Ember is the brand accent color. Using it for inline error text is fine on light backgrounds but reads as "brand accent," not "error." Consider whether errors should have their own callout pattern (e.g. `.shm-callout--error`) rather than red-ish text.

---

## Component-by-component breakdown

- **`app/shmo-review/page.tsx`** — VIOLATIONS FOUND. Section rotation cadence breaks (H1). Wave-divider sibling rule is honored via `<Section>` — PASS on that.
- **`Hero.tsx`** — Mostly PASS. M1 (rev-hero / rev-hero__inner collision) and structurally clean. Em accent compliant.
- **`BulletStrip.tsx`** — PASS structurally; stat sizing M3 is a CSS-side nit.
- **`Objections.tsx`** — VIOLATIONS FOUND. C3 (rebuilds card primitive). Component JSX itself is clean.
- **`StandoutMoments.tsx`** — VIOLATIONS FOUND. C2 (rebuilds tonal cards) + M2 (figcaption outside figure).
- **`NumbersWall.tsx`** — Did not deep-read; based on `shmo-review.css:663–724`, the row pattern is layout-only with `--color-ember` bar fills. Likely PASS; verify no hex.
- **`ShipReturns.tsx`** — Likely PASS; icon wrapper uses cream surface + cocoa stroke at 2.4. Verify stroke compliance in JSX-side SVGs.
- **`HowItWorksSticky.tsx`** — Did not deep-read; phone-frame CSS has C4 (drop-shadow blur), H3 (clover surface), H4 (review-card reinvented), M5 (vh padding).
- **`FormatPicker.tsx`** — VIOLATIONS FOUND. C1 (rebuilds card primitive). JSX is clean; the offense is in the CSS.
- **`BuyboxSection.tsx`** — Did not deep-read; expected PASS based on BuyboxClient composition.
- **`BuyboxClient.tsx`** — PASS structurally. Composes `.shm-gallery`, `.shm-rating`, `.shm-checklist`, `.shm-pack-rows`, `.shm-callout`, `.shm-qty`, `.shm-google`, `.shm-btn`. The Google-G hex literals are the documented brand-spec exception. Stroke-width 2.5 on ChecklistTick is in range. **This is the model the other components should follow.**
- **`FinalCta.tsx`** — Did not deep-read; flagged H1-related (only ember section on page).
- **`ReviewFaq.tsx`** — Did not deep-read; expected PASS if it composes `.shm-faq-list`.
- **`data.ts`** — Content only, not in scope.
- **`index.ts`** — Barrel export, not in scope.
- **`shmo-review.css`** — VIOLATIONS FOUND. C1, C2, C3, C4, H2, H3, H4, H5, H6, M3, M4, M5, L1.

---

## Recommended fix order

1. **C1 — Rebuild FormatPicker on `.shm-card`** (~30 min). Highest visible impact; the 3-tile picker is the page's first content beat.
2. **C2 — Rebuild StandoutMoments on `.shm-card --ember/--cocoa/--honey --hard`** (~30 min). Solves both C2 and H5 in one pass.
3. **C3 — Rebuild Objections on `.shm-card --chocolate`** (~20 min). Inherits dark-section text flip for free.
4. **C4 + H2 — Strip drop-shadow blurs** (~10 min). Find/replace `box-shadow: 0 .. .. .. blur` with `var(--shadow-chunk)` or remove.
5. **H1 — Fix section rotation cadence** (~10 min). Push one section to graham, one to ember. Suggested: BuyboxSection → graham, keep FinalCta on ember.
6. **H3 — Replace `--color-clover` with system surface** (~5 min).
7. **H4 — Recompose phone review-card inside `.shm-card`** (~20 min).
8. **H6 — Replace ad-hoc `color-mix(... transparent)` with named tokens** (~15 min).
9. **M2 — Wrap `<figcaption>` in `<figure>` in StandoutMoments** (~2 min).
10. **M3 + M4 — Map outlier stat font-sizes to the type ramp** (~15 min, may require adding a `.shm-stat-xl` token).
11. **M5 — Replace `28vh` with `--section-py-d-xl`** (~5 min).
12. **Cleanup M1, L1** (~5 min).

**Estimated total work to get to ≥ 90/100:** 2–3 hours of focused refactor. The structural pattern from `BuyboxClient.tsx` (compose primitives, page CSS owns layout only) is the target for every other component.
