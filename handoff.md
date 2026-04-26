# handoff.md — Session Handoff

**Last session:** 2026-04-27 — Homepage polish round (Showcase, FinalCTA, Nav, Footer) + dev tooling. Jordan declared homepage done and asked to pivot to `/shmo-review`.

---

## Project phase

**Step 4 — Resume website build (in progress)** per `scope.md`.

Homepage 11-component MVP shipped and polished. Pivoting next to `/shmo-review` category page + 3 PDPs (CR-80, L-Sign, Square Card). Imagery, email capture, and Shopify Storefront API still pending.

---

## What was done this session

- **Dev tooling:**
  - Created [.claude/launch.json](.claude/launch.json) with `next-dev` config (npm run dev, port 3000, `autoPort: true`) for Claude Preview MCP.
  - Killed orphan `next dev` PID 7213 holding the project lock so preview MCP could bind to port 3000.
  - Set Mac screenshot format to JPEG (`defaults write com.apple.screencapture type jpg`) so Jordan's pasted screenshots stop hitting the 5 MB upload cap.

- **Showcase polish** in [components/home/Showcase.tsx](components/home/Showcase.tsx):
  - Centered left column (text + CTA) — `items-start text-left` → `items-center text-center`, added `justify-center` on the CTA row.
  - Narrowed + centered the 4-tab row at the bottom — added `max-w-[880px] mx-auto`.

- **FinalCTA refactor** in [components/home/FinalCTA.tsx](components/home/FinalCTA.tsx):
  - Converted the full-bleed `cocoa-hot` slab into a contained box.
  - Outer `<Section recipe="snow">`; inner `<div className="shm-cocoa-hot rounded-2xl max-w-[920px] mx-auto px-8 py-12 lg:px-12 lg:py-14">` with the existing glow inside.
  - Tighter padding + narrower content (`max-w-[680px]`).

- **Nav fixes** in [components/nav/Nav.tsx](components/nav/Nav.tsx):
  - Replaced dead `t-body` / `t-eyebrow` / `t-h3` classes throughout with explicit Tailwind sizes (`text-[13.5px]` for nav links, `text-[10px] uppercase` for the Live badge, `text-[17px] font-semibold` for mobile menu items, `text-[11px] tracking-[1.2px]` for mobile section labels). Root cause: `t-*` classes don't exist in `app/globals.css` — only `shm-*` does, so the dead classes were no-ops and text was falling back to the browser default ~16px.
  - Added s'more mascot logo to the dark tile next to the wordmark via `next/image` (28×28 → 22×22 after Jordan asked for it smaller).
  - Bumped italic "card" wordmark to `text-[24px] leading-none` for optical match with sans-bold "Shmo" at 20px.

- **Footer expanded** in [components/footer/Footer.tsx](components/footer/Footer.tsx):
  - Added social icons row (X, Instagram, LinkedIn, YouTube) below the tagline using `react-icons/fa6` — 4 white tiles, 36×36, hairline border, hover state on color + border.
  - Fixed mobile (390 px) display bug where "Shmo Reputation" wrapped mid-word and stranded the SOON badge — added `flex-wrap`, `gap-y-1`, and wrapped the label in `<span className="whitespace-nowrap">`. Badge now drops cleanly to its own row when the column is too narrow.

- **Logo asset:**
  - Copied `pictures/logos/logo-shmocard.png` → [public/logos/logo-shmocard.png](public/logos/logo-shmocard.png) so Next.js can serve it. New `public/logos/` dir created (file-organization rule allows subfolders inside `public/`).

- **`scope.md` refreshed** to 2026-04-27. Step 4 broken into substeps with status flags (✅ homepage MVP shipped, ⏳ polish round / `/shmo-review` / PDPs / Shopify / imagery / GHL). Removed resolved "Branding direction" open decision. Added "Single source of truth = `app/globals.css`" + mascot rule to Decisions locked.

---

## What's next

**Step 4 — `/shmo-review` category page** per `scope.md`.

Concrete next actions:

1. **Decide PR #1.** Polish on Showcase / FinalCTA / Nav / Footer + DESIGN.md rewrite + reference sweep + this session's changes are all uncommitted (see git status below). Either commit + open PR #1, or hold and roll up with the imagery sprint.
2. **Plan `/shmo-review` page.** Figure out the design source — does Jordan have a Claude Design v2 export for this page? Is there a wireframe in `Jordan's Brain/Projects/Shmocard/Shmocard Website/wireframe/`? Or do we design from scratch using the existing DESIGN.md? Decide before scaffolding.
3. **Build `/shmo-review`.** Category page doubling as shop listing — routes to 3 PDPs. Use `<Section>` + `<Container>` primitives from [components/shm/Shm.tsx](components/shm/Shm.tsx). Product cards must fetch from Shopify Storefront API per `shopify-data-discipline` rule — invoke `shopify-plugin:shopify-storefront-graphql` skill before writing GraphQL.
4. **Build 3 PDPs:** `/shmo-review/cr-80`, `/shmo-review/l-sign`, `/shmo-review/square-card`.
5. **Cart wiring** via Storefront API (`cartCreate`, `cartLinesAdd`, etc.). Cart count badge in Nav was deliberately removed earlier — wire to real cart state when Shopify lands.
6. **Imagery sprint** — hero stage, Showcase right-side stages, RealResults crew tiles still placeholders. Generate 3D nano-banana renders + crew shop photos + Joey video transcription, then swap into components.
7. **Wire email capture → GHL webhook** in `Showcase.tsx` + `FinalCTA.tsx` once Jordan provides the URL.

---

## Open decisions

- **PR #1.** Commit + merge now (homepage frozen at this state) or roll up with imagery sprint into a bigger PR?
- **`/shmo-review` design source.** Wireframe vs Claude Design v2 export vs design-from-scratch?
- **GHL webhook URL.** Jordan supplies when ready.
- **Real imagery scope.** Which sections get nano-banana renders first? (Hero stage is highest impact.)
- **Joey video.** Transcription pending. Card stays "Coming Soon" until then.
- **Shopify pricing/SKU finalization.** Placeholder prices in Shopify Admin still.

---

## How to start next session

1. Read this file.
2. Read `CLAUDE.md` and `scope.md`.
3. Visit `localhost:3000` desktop (1320). Confirm homepage still renders. If preview MCP needs to start, run `preview_start` with name `next-dev` (config at [.claude/launch.json](.claude/launch.json)).
4. Ask Jordan: **"PR #1 first — commit the polish + DESIGN rewrite as PR #1, or roll up with imagery? Then for `/shmo-review`: wireframe, Claude Design export, or design from scratch?"**
5. **Source of truth reminder:** when DESIGN.md and `app/globals.css` disagree, globals.css wins. Fix DESIGN.md, not the code.
6. **Mascot rule reminder:** icon-only, max 32px. Never compose with 3D imagery in the same frame.
7. **Placeholder reminder:** all imagery in components must use `<Placeholder label="...">`. Real images swap at the end of the imagery sprint.
