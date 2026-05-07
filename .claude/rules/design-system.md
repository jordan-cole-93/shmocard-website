# Design System Rules

**Auto-applies whenever Claude works on UI / visual / design / component / layout / page tasks in this repo.**

The Shmocard design system lives at `.claude/skills/shmocard-design-system/`. The CSS inside that folder is the **source of truth** when docs disagree. This rule file is the orchestrator that points at the source-of-truth docs and surfaces the hard rules Claude must respect every time it touches a `.tsx`, `.css`, or visual asset.

---

## Read these before any UI work (mandatory order)

1. **`.claude/skills/shmocard-design-system/SKILL.md`** — operator's manual. Has the primitive table, hard rules, canonical reference pages.
2. **`.claude/skills/shmocard-design-system/README.md`** — brand voice, content rules, visual foundations.
3. **`.claude/skills/shmocard-design-system/colors_and_type.css`** + **`.claude/skills/shmocard-design-system/components.css`** — the source of truth. **The CSS wins** when docs disagree.
4. **`.claude/skills/shmocard-design-system/PRIMITIVES.md`** — canonical primitive index (token list, type ramp, every component family with every variant).
5. **`.claude/skills/shmocard-design-system/ui_kits/website/homepage/Shmocard Homepage.html`** (+ `home.css` header) — canonical marketing page reference. Section rotation, hero, sub-brand spotlight, FAQ, footer all live here.
6. **`.claude/skills/shmocard-design-system/ui_kits/website/Buybox.html`** and **`Cart Drawer.html`** — canonical PDP and cart references.

If a request maps to one of those reference pages, **start by copying the reference**. Do not invent a layout from scratch.

---

## Hard rules (every utility violation is a bug)

- **Every utility class is `shm-` prefixed.** `.shm-btn`, `.shm-bg-cocoa`, `.shm-card`. Drop the prefix and dark-section text-flips silently fail. If you typed `.btn` or `.bg-cocoa`, fix it before saving.
- **Reuse primitives. Never restyle them.** If you're typing `.foo__btn`, `.product-tile`, `.cart-line`, stop — that primitive already exists in `components.css`. The smell test: `.foo__btn` / `.foo__pill` / `.foo__card` / `.cart-*` / `.buybox-*` (without `shm-`) are all bugs.
- **Cart and buybox are not optional.** Use `.shm-cart-*` and `.shm-buybox-sticky` from `components.css`. Do not write a custom drawer or sticky bar. The buybox slides DOWN from the top on scroll — never `position: fixed; bottom: 0` with product copy.
- **No primitive restyles in page CSS.** Page-level files (`home.css`, etc.) own LAYOUT only — grid, padding, aspect ratio. Appearance lives in `components.css`. If you find yourself styling `.shm-btn` from a page file, the variant belongs in `components.css`.
- **Tokens, not hex.** `var(--color-ember)`, never `#FF5B1F`. Same for radii, shadows, motion.
- **Soft by default, hard when it counts.** Cards, FAQ lists, and image frames default to soft hairlines. Hard chunky outline + 4px shadow is opt-in (`.shm-card--hard`, `.shm-faq-list--featured-card`, `.shm-image-frame--hard`). Reach for hard sparingly.
- **Section rotation = four bgs only.** `marsh` (default ~60%) → `graham` (~25%) → `ember` (~10%) → `cocoa` (~5%). Class names are `.shm-bg-marsh / -graham / -ember / -cocoa` (the token is `--color-cocoa-deep`; the class drops the suffix). Put `.shm-wave shm-wave--{next-bg}` **between** sections (sibling, not child — see next rule).
- **Wave divider is a SIBLING of the section, not a child.** The wave occupies its own height *between* two sections. Putting the wave inside the previous section's `</section>` is wrong — `.shm-section`'s `padding-bottom: var(--section-py-d)` (40px) opens an empty sliver between content and wave, and the wave's `margin-bottom: -1px` can't bleed into the next section. Canonical structure (see `home-bundle.jsx:700-707`):
  ```html
  <section class="shm-section shm-bg-marsh">…</section>
  <div class="shm-wave shm-wave--graham"></div>   <!-- sibling, NOT inside -->
  <section class="shm-section shm-bg-graham">…</section>
  ```
  In this repo use `<Section bg="…" nextBg="…">` from `components/layout/Section.tsx` — it renders the wave as a Fragment sibling automatically. **Never** hand-author `<div className="shm-wave …">` inside another component's JSX. **Symptom that this rule was broken:** content ends, then a ~40px empty gap, then the wave floats below — instead of the wave biting into the boundary. If you see that gap, the wave's parent is wrong.
- **Mascot is a sticker, max 140px, max 2 per page.** Often zero is correct. Never a hero image. The 200px `.shm-mascot--hero` variant exists for the homepage sub-brand spotlights only — don't reach for it on normal marketing pages.
- **No exclamation marks. No emoji as decoration. No gradients. No drop-shadow blurs. No left-border accent stripes.**
- **Iconography is hand-drawn cocoa-deep, 2.4–2.6px stroke, round caps. No Lucide / Heroicons / 1.5px stroke icons. No emoji as decoration.**

> **Showcase exception — `Shmocard Homepage.html`.** The homepage is the system's flagship piece, not the 80% template. It takes a couple of deliberate liberties: spotlight mascot art rendered larger than 140px, and flat-color video tiles that read denser than a typical section. Normal marketing pages must follow the rules above strictly. If you're cloning the homepage to bootstrap a new page, strip the showcase liberties first.

---

## Type stack (locked)

- **Wordmark** = Cherry Bomb One (`--font-wordmark`). **Logo only.**
- **Display & headings** = Bricolage Grotesque 700/800 (`--font-display`).
- **Body & UI** = Inter Tight 400–700 (`--font-body`).
- **Hand accent** = Shadows Into Light Two (`--font-hand`).

All four are bundled locally in `.claude/skills/shmocard-design-system/fonts/` — copy the folder when adopting the system. CSS declares each via `@font-face` first; Google Fonts `@import` is a fallback.

**No system-ui, no plain Inter, no Roboto, no Fraunces, no other fonts.**

---

## When adding to the system

- A new component goes in `.claude/skills/shmocard-design-system/components.css`, with a preview card in `.claude/skills/shmocard-design-system/preview/`. Both, or it's incomplete.
- A new variant of an existing primitive goes next to the primitive in `components.css`, never inside a page-level file.
- If you change a token, update every preview that demonstrates it. The previews are the QA fixtures.
- Update `SKILL.md` and `README.md` when the system gains or loses a primitive.

## When building a new page

- Compose primitives. If you can't build the page from `components.css`, the gap is in the system, not the page — add the primitive to `components.css` first.
- Page-level CSS owns LAYOUT only. No appearance.
- Don't import the design system CSS into individual components — it's mounted globally via `app/globals.css`.

## Don't

- Don't add filler content, dummy stats, or decorative iconography to fill space. Every element earns its place.
- Don't introduce new fonts. The four bundled in `.claude/skills/shmocard-design-system/fonts/` are the whole stack.
- Don't write `position: fixed; bottom: 0` with product copy inside. That's `.shm-buybox-sticky` (which actually slides from the top — read the reference).
- Don't ship a marketing-page section that bypasses the rotation. If it doesn't fit `marsh / graham / ember / cocoa`, the section is wrong, not the palette. (The homepage showcase is the only page that takes liberties here — see the showcase exception above.)
- Don't fight the design system with Tailwind 4 utilities. Tailwind utilities are allowed for **layout only** (grid, flex, padding, gap). Color, type, radius, shadow, motion = always `.shm-*` classes or design system tokens.

---

## Precedence with other rules

| If conflict with… | Winner |
|---|---|
| `frontend-design` skill (Anthropic plugin) | **Design system rules win** for visual / typography / mascot / section-rotation / icon stroke / utility-class-prefix. `frontend-design` anti-slop principles still apply for composition / hierarchy / cognitive load. |
| `subagent-dispatch.md` | **`subagent-dispatch.md` wins** for which wrapper to invoke and how to inline guardrails into Agent prompts. Design-system rules still govern the *content* of the UI guardrails. |
| `live-store-protection.md` | **`live-store-protection.md` wins.** Live store safety supersedes everything. |
| `shopify-data-discipline.md` | **`shopify-data-discipline.md` wins.** Product data lives in Shopify; design system controls presentation only. |
| `file-organization.md` | **`file-organization.md` wins** for repo structure. Design system rules apply only to design-system folder + UI work. |
| `verification.md` | **`verification.md` wins.** Don't claim a component is done without browser proof. |

## Canonical source-of-truth files (don't duplicate)

These files are authored and maintained inside `.claude/skills/shmocard-design-system/`. **Don't duplicate their content here.** Always read the source:

- `.claude/skills/shmocard-design-system/SKILL.md` — operator's manual + primitive quick reference
- `.claude/skills/shmocard-design-system/README.md` — brand context, voice, visual foundations, fonts
- `.claude/skills/shmocard-design-system/PRIMITIVES.md` — canonical primitive index
- `.claude/skills/shmocard-design-system/colors_and_type.css` — every token + type ramp
- `.claude/skills/shmocard-design-system/components.css` — every primitive
- `.claude/skills/shmocard-design-system/preview/*.html` — visual QA fixtures (one per token group / primitive)
- `.claude/skills/shmocard-design-system/ui_kits/website/` — canonical reference pages

This rule file's role is to **point at those docs and enforce that they get read** — not to mirror their content. If this rule and a source-of-truth doc disagree, the source-of-truth doc wins.
