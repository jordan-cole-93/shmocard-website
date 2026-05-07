---
name: shmocard-build-page
description: Use BEFORE spawning a subagent to build a NEW Shmocard page from scratch (or rebuild a page where layout decisions are explicitly approved). Returns the verbatim guardrail block the orchestrator MUST splice into the subagent's Agent prompt. For polish on an existing page, use shmocard-polish-section instead. Triggers on phrases like "build a new page", "scaffold the homepage", "create the PDP", "ship the category page".
---

# Shmocard build-page dispatch — embed block

**This skill returns a prompt fragment.** When the orchestrator (parent agent) is about to spawn a UI-build subagent via the Agent tool, it MUST first invoke this skill, then splice the entire `<embed>` block below verbatim into the front of the subagent's Agent prompt. The subagent itself cannot invoke skills (SDK limitation). All rules must travel as text.

**How to use:**
1. Orchestrator reads this SKILL.md.
2. Copies everything between `<embed>` and `</embed>` markers verbatim.
3. Splices into Agent prompt at the TOP, before the task brief.
4. Spawns subagent (typically `gsd-executor`) with the augmented prompt.

**When NOT to use this skill:**
- Polish on an already-shipped page → use `shmocard-polish-section` instead (stricter layout-lock).
- Server Action / Storefront / cart / Shopify backend work → use `shmocard-shopify-work` instead.
- Visual review / critique pass → use `shmocard-design-review` instead.

---

<embed>

# SHMOCARD BUILD — HARD CONSTRAINTS (read first, do not skip)

You are building a Shmocard website page. Repo root: `/Users/jordancole/Documents/Developement/Projects/Shmocard/Shmo Website`. The `Skill` tool is NOT available in your environment (Anthropic SDK structural limitation). All rules you need are inlined below or referenced by file path you must Read before any code.

## Mandatory file reads (in order, before any code)

1. `.claude/rules/design-system.md`
2. `.claude/rules/file-organization.md`
3. `.claude/rules/verification.md`
4. `.claude/rules/live-store-protection.md`
5. `.claude/rules/shopify-data-discipline.md`
6. `.claude/rules/vault-conventions.md`
7. `context/design-system/SKILL.md`
8. `context/design-system/README.md`
9. `context/design-system/PRIMITIVES.md`
10. `context/design-system/colors_and_type.css` — token + type ramp source-of-truth
11. `context/design-system/components.css` — primitive source-of-truth (READ; do NOT edit from a build task)
12. `context/design-system/ui_kits/website/<relevant-page>.html` — canonical reference for the page you're building
13. `context/general/marketing.md` — locked headlines (verbatim copy required)
14. `context/general/context.md` — brand thesis
15. `context/general/product.md` — product specs (where relevant)

The CSS source files (`colors_and_type.css`, `components.css`) WIN against any documentation that disagrees.

## Compose primitives, do NOT invent

- The page is built by composing primitives from `components.css` inside `<Section bg=...>` and `<Container>` wrappers from `components/layout/`.
- If a needed primitive does not exist in `components.css`, STOP and log to `.planning/phases/<current-phase>/deferred-items.md` as a primitive request. Do NOT invent a custom one in page CSS.
- Page-level CSS (`components/<page>/<page>.css`) owns LAYOUT only — grid, flex, padding, gap. Appearance lives in `components.css`. Never restyle a `.shm-*` primitive from a page-level file.

## Anti-slop principles (frontend-design — embedded)

- **No generic AI design tells.** No centered hero with a button stack. No 3-up icon grids that all look the same. No marquee strips for the sake of motion. Earn every section.
- **Type contrast.** Hero ≫ lede ≫ body. The display-to-body size ratio should read visually as ≥ 3×, ideally ≥ 4×.
- **Density rhythm.** Some sections breathe; others compress. Uniform density = generic.
- **One earned moment per section.** Each section should have at least one element that feels deliberate, not template-default.
- **Whitespace is content.** Cramped beats nothing; sparse beats cramped on premium feel.
- **No fake trust.** No fake stats, fake testimonials, dummy stars. Use real verified data only.

## Impeccable principles (embedded)

- Spacing is the #1 lever for "premium vs flat" feel.
- Type pairings: display = `--font-display` (Bricolage 700/800); body = `--font-sans` (Inter Tight 400–700); accent = `--font-hand` (Shadows Into Light Two); wordmark = `--font-wordmark` (Cherry Bomb One — LOGO ONLY).
- Hierarchy: pick ONE focal element per section. Everything else recedes.
- Colors: use the 4-color rotation strictly. `marsh` (~60%) → `graham` (~25%) → `ember` (~10%) → `cocoa` (~5%). Wave dividers between sections (`.shm-wave shm-wave--{next-bg}`).
- Edges: hairlines default; chunky outline + 4px shadow opt-in (`.shm-card--hard`).

## Hard rules (every build task — these are in `.claude/rules/design-system.md`, repeated for emphasis)

- **`.shm-*` prefix on every visual class.** No `bg-*`, `text-*`, `border-*`, `rounded-*`, `shadow-*`, `font-*` Tailwind utilities. Tailwind for layout only (`grid`, `flex`, `gap`, `padding`).
- **Tokens, not hex.** `var(--color-ember)`, never `#FF5B1F`.
- **No exclamation marks. No emoji as decoration. No gradients. No drop-shadow blurs. No left-border accent stripes.**
- **Iconography: hand-drawn cocoa-deep, 2.4–2.6px stroke, round caps.** No Lucide / Heroicons / outline icon libraries.
- **Mascot rule:** max 140px sticker, max 2 instances per page DEFAULT. Showcase exception (homepage sub-brand spotlights only): may use 200px `.shm-mascot--hero` per `.claude/rules/design-system.md` line 31 + `context/design-system/components.css:355` comment.
- **Locked headlines from `context/general/marketing.md` — verbatim. No rephrasing.**
- **No primitive edits.** `context/design-system/components.css` and `colors_and_type.css` are READ-ONLY from build tasks.
- **`.shm-section` must be present** on every section wrapper for `--section-py-d` padding tokens to apply (Phase 3 missed this — never repeat).
- **Server components by default.** `'use client'` only for components that genuinely need browser-side state / events / animation.

## File organization (per `.claude/rules/file-organization.md`)

- New top-level folders require Jordan's explicit approval — DO NOT create them.
- Code lives at repo root: `app/`, `components/`, `lib/`, `public/`.
- Page components live under `components/<page-name>/<Component>.tsx`.
- Page-level CSS lives at `components/<page-name>/<page-name>.css` and is layout-only.
- Screenshots live at `pictures/screenshots/<descriptive-name>.png`.

## Shopify data discipline (per `.claude/rules/shopify-data-discipline.md`)

- Product data (name, price, image, variants, SKUs) → fetched from Shopify via `lib/shopify/queries.ts`. NEVER hardcoded.
- Marketing copy (taglines, FAQ, hero blurb) → fine to hardcode in `<page>-data.ts` or `<page>-copy.ts`.
- Cart goes through `components/cart/actions.ts` Server Actions. Never call Storefront mutations from client.
- Checkout = Shopify-hosted via `cart.checkoutUrl`. Never build a custom checkout.

## Live store protection (per `.claude/rules/live-store-protection.md`)

- `shop.shmocard.com` is LIVE. Never modify the Online Store theme, payment settings, or domain config.
- Storefront API READS + cart only. Zero Admin API.
- Never commit `.env.local`. Use `process.env.*` for tokens.
- Open-redirect guard mandatory on checkout URL (allowlist `*.myshopify.com` + `SHOPIFY_PRIMARY_DOMAIN` + `SHOPIFY_STORE_DOMAIN`).

## Verification (per `.claude/rules/verification.md`)

- Run dev server. Confirm the page renders without errors.
- Browser-verify the rendered output. Take desktop + mobile screenshots.
- Open DevTools console. Zero red errors.
- Mobile width works at 375 / 768 / 1440 px.
- `npm run build` exits 0.
- Screenshots saved to `pictures/screenshots/<descriptive-name>.png`.

## Atomic commits

One commit per logical task. Stage only that task's files. Commit message format:
```
feat(<plan-id>): <what changed>
```

## When to stop and ask

If you encounter:
- A primitive that needs modification → STOP, log to `deferred-items.md`, surface
- A layout that needs section rotation override → STOP, surface (don't bypass the rotation)
- A locked headline that doesn't fit visually → STOP, surface (don't rephrase the headline)
- A request that would touch the live store / payment flow / Admin API → STOP, surface immediately
- Any rule that conflicts with another rule → STOP, surface (don't pick one and proceed silently)

Surface ALL of these to the orchestrator. Do not silently work around them.

</embed>

---

## End of embed block

**Reminder to orchestrator:** the subagent does NOT have the Skill tool. The block above is the only way the rules reach the subagent. Splice it verbatim. Do not summarize it.
