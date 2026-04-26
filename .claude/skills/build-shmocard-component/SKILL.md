---
name: build-shmocard-component
description: Use when building, scaffolding, or refactoring any Shmocard section or component (Hero, FAQ, Footer, ProductCard, etc.). Defines the project-standard workflow — read DESIGN.md, pick a section recipe, use Placeholder for imagery, write the component, verify in browser.
---

# Build Shmocard Component — workflow skill

This is the project's standard workflow for any new section or component. Auto-triggers when Claude is asked to build, scaffold, refactor, or "create a component" / "build a section" / "rebuild Hero" / etc.

## When this fires

Triggers on prompts mentioning: build / scaffold / create / refactor + (component | section | hero | footer | nav | card | block | tile | feature | testimonial | FAQ | CTA | strip).

## The workflow (do this in order)

### 1. Pick the section recipe (DESIGN.md §6)

Before writing any JSX, decide which of the 5 recipes the section uses:
- `snow` — default page section
- `cream-soft` — for cards needing extra contrast
- `cream` — warmer, UGC/testimonial sections
- `paper` — sparingly, for dense info
- `cocoa-hot` — climax sections (max 1-2 per page)

Apply the recipe's surface, eyebrow color, heading color, body color, card background, and CTA style. **Never invent backgrounds.**

### 2. Compose with the type ramp (DESIGN.md §2)

Use the named ramp classes:
- `t-display` — hero only
- `t-h1` / `t-h2` / `t-h3` — page / section / sub-section
- `t-lede` — paragraph below headline
- `t-body` / `t-meta` / `t-eyebrow` — body, captions, eyebrows

**Italic accent rule:** max 1 Fraunces italic accent per scene, 1-2 words, ember-colored. Pattern:
```tsx
<h2 className="t-h2">Common questions, <em className="font-serif italic font-normal text-ember">honest</em> answers.</h2>
```

### 3. Use `<Placeholder>` for ALL imagery

Never hardcode `/mascot/...` or `/products/...` paths. Real imagery (3D nano-banana renders) gets generated at the end of the build.

```tsx
<Placeholder label="hero illustration — toolkit pose" aspectRatio="16/9" />
```

If `<Placeholder>` doesn't exist yet in the project, create it at `components/ui/Placeholder.tsx` first.

### 4. File structure

- Path: `components/<category>/<Name>.tsx`
- One default-exported component per file
- Sub-components in same file only if exclusively used by parent
- Server component by default. Use `"use client"` only when interactivity demands it (state, effects, browser APIs).

### 5. Apply the spacing & token discipline

- 4/8 scale only (`p-4`, `gap-7`, etc.) — never `p-[27px]`
- Tailwind utilities only — never `style={}`, never legacy `--shmo-*` tokens
- Hairlines + shadows: never both heavily on the same element

### 6. Verify in browser before claiming done

- `/dev` to ensure dev server is running
- Navigate to the page that uses the component
- Take a screenshot to `pictures/screenshots/<component-name>.png`
- Check: no console errors, mobile width, French copy length tolerance

## When to invoke other skills

- **Component architecture / CSS engineering** → also invoke `taste-skill-shmocard`
- **Polish / animation / micro-interactions** → also invoke `emil-design-eng-shmocard`
- **Final review / audit** → also invoke `impeccable-shmocard`
- **Section variations requested** → use the `/preview` command to scaffold preview pages, never paste multiple variations into chat

## What NOT to do

- Don't skip the section recipe step.
- Don't import real PNGs from `public/mascot/` or `public/products/`.
- Don't invent hex codes or arbitrary spacing values.
- Don't claim done without browser verification.

## References

- `DESIGN.md` — full design system
- `DESIGN.json` — machine-readable tokens
- `app/globals.css` — Tailwind v4 `@theme` token definitions
- `.claude/rules/verification.md` — verification standards
