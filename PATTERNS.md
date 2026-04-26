# Shmocard — Patterns Book

> **For Claude Code.** Replicate, don't reinvent. Every section on a Shmocard page is one of the recipes below. Read the JSX, copy it, swap the data.

## Setup checklist (do once per project)

1. Drop `design-system/globals.css` into `app/globals.css`.
2. Copy `design-system/components/Shm.tsx` and `design-system/components/Faq.tsx` into your project (e.g. `components/shm/`).
3. Copy `design-system/app/_reference/page.tsx` into your project as `app/_reference/page.tsx`. **Keep this file.** It is your visual QA target.
4. Update import paths if your `@/` alias differs.

## The Golden Rules

1. **Always wrap a section in `<Section recipe="…">`.** Never hand-roll `<section className="bg-…">`.
2. **Always wrap content in `<Container>`.** `Section` already does this for you.
3. **Type ramp only.** `<Display> <H1> <H2> <H3> <Lede> <Body>`. No raw `<h2 className="text-4xl">`.
4. **Italic accent** = `<I>word</I>` inside a headline. 1–2 words max. Auto ember on light, auto honey on cocoa-hot.
5. **Buttons** = `<Button>` or `<ButtonLink>`, never `<button className="bg-ember">`.
6. **Hero primary CTA = `variant="accent"`** (ink chocolate, not ember). Section primaries = `variant="primary"` (ember).
7. **Two-image-track rule.** Marketing surfaces use `<ImageFrame>` (3D imagery slot). Product cards use real product photography. Never mix in one component.

## Recipes (page composition)

A page mixes at most 3 recipes. Default rhythm: `snow → cream-soft → snow → cocoa-hot → snow → cream-soft`. **Cocoa-hot is the climax — never two in a row.**

| Recipe | When |
|---|---|
| `snow` | DEFAULT page bg, most sections |
| `cream-soft` | Section that needs separation from a `snow` neighbor + cards must read clearly |
| `cream` | Warmer storytelling — UGC, testimonials |
| `paper` | Sparingly — dense info, feature explainer |
| `cocoa-hot` | Climax — toolkit reveal, contained CTA, hero promo. 1–2 per page max |

## Reference-driven workflow (this kills hallucination)

When asked to build a page:

1. Open `app/_reference/page.tsx`.
2. Find the recipe(s) you need — Hero, Family, Cocoa-Hot, Generic-with-cards, FAQ, Component gallery.
3. Copy the JSX block.
4. Swap data (BRANDS, FAMILY, QUESTIONS, etc.) — don't change the structure.
5. Visit `/_reference` in dev to confirm a one-to-one visual match.

## Common mistakes to avoid

- ❌ Hero primary as `variant="primary"` — should be `variant="accent"` (ink, not ember).
- ❌ Cocoa-hot section without `<Section recipe="cocoa-hot">` — you'll lose the honey glow + auto-honey italic.
- ❌ Using Tailwind `bg-ember` for a button — use `<Button variant="primary">`.
- ❌ Inventing tab styling — copy the showcase JSX from the reference.
- ❌ Mascot at hero scale — mascot is icon-only (16–32px).
- ❌ Two `<Section recipe="cocoa-hot">` in a row.
- ❌ Overriding `--spacing-*` in globals.css — collides with Tailwind's `p-1`, `p-2`, etc. Use Tailwind's default spacing scale; layout primitives are baked into `.shm-section` / `.shm-container`.

## Adding a new section type

1. Add a new card in `app/_reference/page.tsx` showing it.
2. If it needs new CSS, put it in the `@layer components` block of `globals.css` (prefixed `.shm-`).
3. If it needs a new component, add it to `components/Shm.tsx`.
4. Document it here with a copy-paste JSX block.

That's the whole system. Replicate, don't reinvent.
