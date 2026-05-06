# Working in this project

This project is the **Shmocard design system**. Treat it like a design system in active maintenance, not a sandbox for one-off pages.

## Read these first, every time

1. `SKILL.md` — operator's manual. Has the primitive table, the hard rules, and the canonical reference pages.
2. `README.md` — brand voice, content rules, visual foundations.
3. `colors_and_type.css` and `components.css` — the source of truth. **The CSS wins** when docs disagree.
4. `ui_kits/website/homepage/Shmocard Homepage.html` (+ `home.css` header) — the canonical marketing page. Section rotation, hero, sub-brand spotlight, FAQ, footer all live here.
5. `ui_kits/website/Buybox.html` and `Cart Drawer.html` — canonical PDP and cart.

If a request maps to one of those reference pages, **start by copying the reference**. Do not invent a layout from scratch.

## Hard rules

- **Every utility class is `shm-` prefixed.** `.shm-btn`, `.shm-bg-cocoa`, `.shm-card`. Drop the prefix and dark-section text-flips silently fail. If you typed `.btn` or `.bg-cocoa`, fix it before saving.
- **Reuse primitives. Never restyle them.** If you're typing `.foo__btn`, `.product-tile`, `.cart-line`, stop — that primitive already exists. The smell test: `.foo__btn` / `.foo__pill` / `.foo__card` / `.cart-*` / `.buybox-*` (without `shm-`) are all bugs.
- **Cart and buybox are not optional.** Use `.shm-cart-*` and `.shm-buybox-sticky` from `components.css`. Do not write a custom drawer or sticky bar.
- **No primitive restyles in page CSS.** Page-level files (`home.css`, etc.) own LAYOUT only — grid, padding, aspect ratio. Appearance lives in `components.css`. If you find yourself styling `.shm-btn` from a page file, the variant belongs in `components.css`.
- **Tokens, not hex.** `var(--color-ember)`, never `#FF5B1F`. Same for radii, shadows, motion.
- **Soft by default, hard when it counts.** Cards, FAQ lists, and image frames default to soft hairlines. Hard chunky outline + 4px shadow is opt-in (`.shm-card--hard`, `.shm-faq-list--featured-card`, `.shm-image-frame--hard`). Reach for hard sparingly.
- **Section rotation = four bgs only.** `marsh` (default ~60%) → `graham` (~25%) → `ember` (~10%) → `cocoa` (~5%). Class names are `.shm-bg-marsh / -graham / -ember / -cocoa` (the token is `--color-cocoa-deep`; the class drops the suffix). Put `.shm-wave shm-wave--{next-bg}` between sections.
- **Mascot is a sticker, max 140px, max 2 per page.** Often zero is correct. Never a hero image. The 200px `.shm-mascot--hero` variant exists for the homepage sub-brand spotlights only — don't reach for it on normal marketing pages.
- **No exclamation marks. No emoji as decoration. No gradients. No drop-shadow blurs. No left-border accent stripes.**

> **Showcase exception — `Shmocard Homepage.html`.** The homepage is the system's flagship piece, not the 80% template. It takes a couple of deliberate liberties: spotlight mascot art rendered larger than 140px, and flat-color video tiles that read denser than a typical section. Normal marketing pages must follow the rules above strictly. If you're cloning the homepage to bootstrap a new page, strip the showcase liberties first.

## When adding to the system

- A new component goes in `components.css`, with a preview card in `preview/`. Both, or it's incomplete.
- A new variant of an existing primitive goes next to the primitive in `components.css`, never inside a page-level file.
- If you change a token, update every preview that demonstrates it. The previews are the QA fixtures.
- Update `SKILL.md` and `README.md` when the system gains or loses a primitive.

## When building a new page

- Place it under `ui_kits/website/<page-name>/` so it sits alongside the existing reference pages.
- Page-level CSS lives in a sibling `<page>.css`. Header it with a section-by-section comment guide (see `home.css` for the format).
- React/JSX bundles use a sibling `<page>-bundle.jsx` loaded with `<script type="text/babel" src="...">`. Keep components within the bundle scoped — never define a global `const styles = {…}`.
- Compose primitives. If you can't build the page from `components.css`, the gap is in the system, not the page — add the primitive to `components.css` first.

## Don't

- Don't add filler content, dummy stats, or decorative iconography to fill space. Every element earns its place.
- Don't introduce new fonts. The four bundled in `fonts/` are the whole stack.
- Don't use Lucide / Heroicons / 1.5px stroke icons. Iconography is hand-drawn cocoa-deep, 2.4–2.6px stroke, round caps.
- Don't write `position: fixed; bottom: 0` with product copy inside. That's `.shm-buybox-sticky` (which actually slides from the top — read the reference).
- Don't ship a marketing-page section that bypasses the rotation. If it doesn't fit `marsh / graham / ember / cocoa`, the section is wrong, not the palette. (The homepage showcase is the only page that takes liberties here — see the showcase exception above.)
