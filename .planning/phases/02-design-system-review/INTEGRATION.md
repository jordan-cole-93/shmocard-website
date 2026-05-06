# Phase 2 / Step 02-04: Tailwind 4 ↔ `.shm-*` Coexistence

**Date:** 2026-05-07
**Status:** Locked
**Decision authority:** Phase 2 (consumed by Phase 3 wiring)

---

## TL;DR

**Direct CSS import from `app/globals.css`. No Tailwind 4 `@theme` block for design tokens.** Use Tailwind 4 utilities for **layout only** (grid, flex, spacing, sizing). Color, type, radius, shadow, motion = always `.shm-*` classes or `var(--*)` tokens. The CSS files in `context/design-system/` stay the canonical source of truth — Tailwind never gets a parallel copy.

---

## The two real options (revisited)

### Option A — Direct CSS import (RECOMMENDED, LOCKED)

`app/globals.css` does:

```css
@import "tailwindcss";

/* Design system: tokens, type ramp, section backgrounds, waves */
@import "../context/design-system/colors_and_type.css";

/* Design system: every primitive (.shm-btn, .shm-card, .shm-cart-*, etc.) */
@import "../context/design-system/components.css";
```

**Pros:**
- CSS files in `context/design-system/` stay the **single source of truth.** Edit there → changes propagate everywhere.
- Zero drift risk between Tailwind config and the design system.
- The design system's invariants (`.shm-*` prefix, no gradients, no left-border stripes, no decorative blurs) are enforced because Tailwind never gets a chance to generate competing utilities.
- Backwards compatible with the existing reference pages (homepage HTML, Buybox.html, Cart Drawer.html) since they already use the same CSS files.

**Cons:**
- Cannot use Tailwind shortcuts for tokens (e.g., `bg-ember-500`). Must always use `.shm-bg-ember` / `var(--color-ember)`. **This is a feature, not a bug** — it's the design system's "every utility is `.shm-` prefixed" rule enforced by absence.
- Tailwind 4's stock color/spacing utilities (`bg-blue-500`, `text-2xl`, `rounded-lg`) remain available technically. They MUST NOT be used for design-token concerns. Convention enforces this; lint rule (eslint-plugin-tailwindcss with allowlist) could enforce more strictly later.

### Option B — Transcribe tokens into Tailwind 4 `@theme` (REJECTED)

`app/globals.css` does:

```css
@import "tailwindcss";

@theme {
  --color-marshmallow: #FFFBF1;
  --color-cream: #FFF8EA;
  --color-ember: #FF5B1F;
  /* ...every token from colors_and_type.css... */
  --font-display: "Bricolage Grotesque", ui-sans-serif, system-ui;
  /* ...etc... */
}
```

**Why rejected:**
- **Drift hazard.** Token definitions now live in two places: `context/design-system/colors_and_type.css` AND `app/globals.css`. Updating one without the other = silent visual bug.
- **Violates the design system's own rule** ("the CSS is the source of truth"). Adding a parallel Tailwind 4 source breaks the contract.
- **Tailwind generates competing utilities.** Putting `--color-ember` in `@theme` makes Tailwind generate `.bg-ember`, `.text-ember`, `.border-ember` — direct conflict with `.shm-bg-ember`. Choosing which wins becomes a rule everyone has to remember.
- **Locks us out of escape valves.** The `.shm-bg-*` selectors run a chain of dark-section text/em/eyebrow flips (see `colors_and_type.css` lines 293–343). Tailwind utilities don't have that machinery — you'd lose the auto-flip for free.

**This option is only attractive if** we wanted to drop the `.shm-*` system entirely and rebuild on Tailwind primitives. We're not doing that.

---

## Locked rules (Phase 3 contract)

These rules apply to every `.tsx`, `.css`, and component file written in Phase 3 onward. Violations are bugs.

### Always use `.shm-*` for:

- **Backgrounds:** `<section className="shm-bg-marsh">` not `<section className="bg-orange-50">`.
- **Type:** `<h1 className="shm-display">` not `<h1 className="text-6xl font-extrabold">`.
- **Buttons:** `<button className="shm-btn shm-btn--primary">` not `<button className="bg-orange-500 px-6 py-3 rounded-full">`.
- **Cards:** `<div className="shm-card">` not bespoke layouts.
- **Badges, inputs, fields, eyebrows, mascot, sticker, image frames, FAQ, nav, cart drawer, buybox, sticky bar, gallery, packs** — all from `.shm-*`.
- **Color references in code:** `var(--color-ember)` not `#FF5B1F` or `text-orange-500`.
- **Section dividers:** `<div className="shm-wave shm-wave--graham" />` not Tailwind shapes.

### Use Tailwind 4 utilities ONLY for:

- **Layout:** `flex`, `grid`, `grid-cols-*`, `flex-row`, `items-center`, `justify-between`, `gap-*`.
- **Spacing:** `p-*`, `px-*`, `py-*`, `pt-*`, `m-*`, `mx-auto` (when not using `.shm-container`).
- **Sizing:** `w-full`, `max-w-*`, `min-h-*`, `h-*`. Prefer `--container-max` token via `style={{ maxWidth: 'var(--container-max)' }}` when matching the design system's container.
- **Responsive prefixes:** `md:`, `lg:`, `xl:` on the above.
- **State variants** for layout only: `hover:flex-col`, etc.

### NEVER use Tailwind utilities for:

- ❌ `bg-*` (any color)
- ❌ `text-*` for color (`text-2xl` for size is allowed if not contradicting `.shm-display` etc.)
- ❌ `border-*`, `border-color-*`
- ❌ `rounded-*` (use `var(--radius-lg)` etc. or `.shm-card`'s built-in radius)
- ❌ `shadow-*` (only `.shm-card--hard` shadow exists; never blurry shadows)
- ❌ `font-*` (font-family belongs to the type ramp; weight belongs to `.shm-h1` etc.)
- ❌ `animate-*` / Tailwind transitions for design-system motion (use `--motion-*` tokens)
- ❌ Anything that creates a gradient

---

## Concrete `app/globals.css` skeleton (Phase 3 ready)

Phase 3 task 03-01 starts here:

```css
/* app/globals.css
   ----------------------------------------------------------
   Loads Tailwind 4 (for layout/spacing utilities) + the
   Shmocard design system (tokens, type ramp, primitives).
   See .planning/phases/02-design-system-review/INTEGRATION.md
   for the rule of which utility set wins which concern.
   ---------------------------------------------------------- */

@import "tailwindcss";

/* Design system foundation: tokens, type ramp, section bgs, wave dividers,
   hairline flips for dark surfaces. Loads all 4 fonts via @font-face
   (relative paths from the file's location). */
@import "../context/design-system/colors_and_type.css";

/* Design system primitives: every .shm-* component class (buttons, cards,
   badges, inputs, image frames, FAQ, mascot, sticker, nav, cart drawer,
   product cards, form patterns, PDP/buybox, checklist, callout). */
@import "../context/design-system/components.css";

/* Project-specific overrides go BELOW the design system imports
   so they win on source-order specificity. Page-level layout CSS
   should NOT live here — it goes in components/<area>/<page>.css
   or component-scoped CSS. */
```

**Path note:** `app/globals.css` lives at `app/globals.css`. Relative `../context/design-system/...` resolves correctly from that location.

**Font loading:** `colors_and_type.css` declares `@font-face` for all 4 brand fonts using relative `fonts/...` paths. Because the import path is `../context/design-system/colors_and_type.css`, the browser resolves `fonts/...` relative to **that file's location** (`context/design-system/`), so the fonts load from `context/design-system/fonts/`. **No `app/layout.tsx` font mounting needed for the brand fonts** — they're loaded by the imported CSS.

⚠️ **Caveat:** if Vercel or Next.js's CSS bundler doesn't preserve relative font paths through `@import` chains, font loading may fail in production. **Verify in Phase 3 by running `npm run build && npm start`, opening DevTools → Network, and confirming the 4 .ttf files load with 200 status from the deployed origin.** If they don't, fall back to mounting fonts via `next/font/local` in `app/layout.tsx` and removing the `@font-face` blocks from `colors_and_type.css` (or just supplementing — the file's `@font-face` declarations win over Google Fonts fallback regardless).

---

## Optional hardening (defer to later)

### A. Tailwind 4 theme reset

To **technically prevent** Tailwind from generating its default color/font/radius utilities (which engineers should never reach for but currently could), Tailwind 4 supports clearing categories via `@theme`:

```css
@theme {
  --color-*: initial;
  --font-*: initial;
  --radius-*: initial;
  --shadow-*: initial;
  /* keep spacing, breakpoints, typography sizes for layout work */
}
```

This is **optional**, defer to Phase 3 cleanup. The convention rule above covers the same ground without forcing a deeper Tailwind-4 reset that could surprise contributors. Add it if `bg-*` / `text-*-color` violations creep in during Phase 3.

### B. Lint rule (allowlist)

A small `eslint-plugin-tailwindcss` config with an allowlist of permitted Tailwind utilities (layout/spacing only) could enforce the rule mechanically. Adding mid-Phase-3 is fine; not required for correctness.

### C. A second consumer file

Phase 3 may eventually want **per-page CSS files** (`components/home/home.css`, etc.) that import the design system foundation but layer page-specific layout. The design system already does this with `home.css` in the reference homepage. Expected pattern: page CSS file imports nothing (the system CSS is global via `app/globals.css`); page CSS files own only LAYOUT.

---

## Decision summary

| Decision | Outcome |
|---|---|
| Token strategy | Direct CSS `@import`, no Tailwind `@theme` parallel copy |
| Source of truth | `context/design-system/colors_and_type.css` + `components.css` |
| Tailwind utility scope | Layout + spacing + sizing only |
| Forbidden Tailwind utilities | `bg-*`, `text-*` (for color), `border-*`, `rounded-*`, `shadow-*`, `font-*`, `animate-*`, gradient utilities |
| Font mounting | Via `@font-face` in `colors_and_type.css` (no `next/font` initially); verify in Phase 3 build |
| Phase 3 entry point | `app/globals.css` skeleton above |

---

## Verification

This decision passes when:

- ✅ `app/globals.css` can be written verbatim from the skeleton above and a fresh `npm run dev` renders the homepage with all `.shm-*` styles applied.
- ✅ A button using `<button className="shm-btn shm-btn--primary">Buy</button>` renders as a pill with chunky cocoa outline + 4px offset shadow on hover.
- ✅ A section using `<section className="shm-section shm-bg-cocoa"><h2 className="shm-h2">Headline</h2></section>` renders with cocoa-deep background, marshmallow heading text, full dark-section flips applied.
- ✅ A `.bg-ember` (no `.shm-` prefix) shows as a generic Tailwind class in DevTools (because Tailwind 4 ships some default colors), but is **not used in code** — verified by `grep -rn 'className="[^"]*bg-' app/ components/ | grep -v shm-bg-` returning zero hits.

These all happen in Phase 3. This phase locks the contract; Phase 3 wires it.

---

## Next step

**02-05** — reference-page translation plan (`Shmocard Homepage.html`, `Buybox.html`, `Cart Drawer.html` → Next.js `.tsx` components). This step's locked decisions feed directly into translation: every component will import `.shm-*` classes; layout uses Tailwind utilities; no token transcription anywhere.
