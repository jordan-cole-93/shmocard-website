# handoff.md — Session Handoff

**Last session:** 2026-04-25 (afternoon → evening) — Shmocard parent-brand homepage rebuild (~85% done)

---

## What's the project right now

**Goal:** Build and launch `shmocard.com` — homepage + Shmo Review category page + 3 PDPs + Shopify-hosted checkout.
**Stage:** Homepage is one section away from feature-complete. **Final CTA** is the only section left to build before scope.md MVP can go through a full-page brand pass.

**Working directory:** `/Users/jordancole/Documents/Developement/Projects/Shmocard/Shmocard Website/`

---

## CRITICAL — read before writing any code

1. **Memory rules** at `~/.claude/projects/-Users-jordancole-Documents-Developement-Projects-Shmocard-Shmocard-Website/memory/` are loaded automatically. Especially:
   - `feedback_subbrand_showcase_pattern.md` — Showcase pattern locked (auto-cycling stage + tabs)
   - `feedback_why_section_pattern.md` — Why-section pattern locked (numbered narrative stack)
   - `feedback_magic_mcp_builder_vs_inspiration.md` — **Always use Magic MCP `builder` tool, not `inspiration`.** Inspiration only searches existing 21st.dev library and returns weak/irrelevant results for unique patterns.
   - `feedback_parent_brand_vs_subbrand.md` — Homepage promotes 4 tools equally; do NOT add Shmo-Review-specific elements (bulk pricing, format selectors, card prices) to the parent-brand surfaces.
   - `feedback_use_placeholders_for_images.md` — Always `<Placeholder label="...">` during build, never raw image paths.

2. **Use Playwright MCP to verify visually.** Don't ship and report "done" without screenshotting. Section we touched, viewport-only screenshot, confirm before claiming success. Static `fullPage: true` doesn't trigger framer-motion `whileInView` animations — viewport screenshots are reliable.

3. **When Jordan says "wrong" / "don't like" / "you're not using X" — do not explain or push back. Just fix.** Save the diagnosis for after the fix lands.

---

## What's built (homepage, in render order)

| # | Section | Component | Status |
|---|---|---|---|
| 1 | Nav | `components/nav/Nav.tsx` | Stable |
| 2 | Hero | `components/home/Hero.tsx` | ✅ Updated — meta strip swapped for **avatar trust stack** (Magic-built, 5 warm avatars + 5 honey stars + "Loved by Carly, Marshall, and 500+ Main Street crews") |
| 3 | TrustBar | `components/home/TrustBar.tsx` | Stable |
| 4 | ShmoFamily | `components/home/ShmoFamily.tsx` | Stable (cream bg) |
| 5 | WhyShmocard | `components/home/WhyShmocard.tsx` | ✅ Numbered narrative stack pattern (cream bg) |
| 6 | SubBrandShowcase | `components/home/SubBrandShowcase.tsx` | ✅ MAJOR REWORK this session — see below |
| 7 | RealResults | `components/home/RealResults.tsx` | ✅ Pivoted from chocolate stat tiles → **"Real shops, real *tap* moments."** strip with 6 small warm-tone tiles + verified client names |
| 8 | Testimonials | `components/home/Testimonials.tsx` | ✅ "Real crews, real *five-star* moments." with 3 video-style cards (choc-deep / chocolate / ember rotation), white footer band, Fraunces italic quotes, timestamp pills, snow play button |
| 9 | FAQ | `components/home/FAQ.tsx` | ✅ 8-question single-open accordion (cream bg, 820px max-width centered, hairline dividers, ember `+` → `×` icon) |
| 10 | Footer | `components/footer/Footer.tsx` | Stable |

### SubBrandShowcase — most-touched section this session

The chocolate-bg "Four tools. *One* toolkit." section. Final state after several iterations:

- **Section bg: `--choc-deep`** (#3B1F14, near-black brown). Was `--chocolate` earlier — Jordan asked for darker.
- **Stage box bg: `--ink-2`** (#4A2C1E, barely lighter than section). Was `--cream`, then `--chocolate`, finally `--ink-2` per Jordan's "almost close to the color of the background" direction.
- **Stage box border: `1px solid var(--graham)`** — solid ember red hairline. Jordan asked for a "border color red" per his read of the branding guide. If still too punchy, dial back to `rgba(255, 91, 31, 0.5)`.
- **Slide text on the dark stage:** title in `--snow`, italic em in `--honey`, lede in `--blush-soft`. Status pill kept as-is (snow bg with green/honey accent).
- **Auto-cycling stage** (5s interval, pauses on hover/focus) with 4 tool-colored tabs at the bottom.
- **Conversion adds shipped this session:**
  1. **Release roadmap** above the stage — Magic-built milestone indicator (`.rr` namespace). 4 connected nodes: Live (filled ember + check + Fraunces italic) / Next / After / Later, with sub-brand names underneath. "CURRENTLY SHIPPING / SHMO REVIEW" caption to the right.
  2. **Email capture on coming-soon slides** — when the active brand is Biz/Link/Reputation, the "Get notified" button is replaced by an inline `[email input] [Notify me →]` form. On submit, swaps to a green "You're on the list" success state. Stub only — wire to GHL webhook per `project_email_capture_target.md` memory rule when ready.
- **Removed this session:** "Grandfathered into all 4 tools" callout below the tabs — Jordan rejected it.

---

## What's left to build

1. **Final CTA** — the last homepage section. Per handoff plan: choc-deep bg, primary "Shop Shmo Review" + soft "Join the waitlist." Mirror the dark surface used in the Showcase section above for bookend rhythm.
2. **Optional FAQ variation** — Jordan asked for one more FAQ variation via Magic MCP `builder` at the end of session, then interrupted before I generated it. He may want to revisit tomorrow. Pattern direction proposed: 5/7 split with questions list left + selected answer panel right. Use **`builder` tool, not `inspiration`** (per memory rule).

After Final CTA ships, the homepage hits 100% feature-complete. Then:
- Full-page brand-review pass against `design.md` and `marketing.md`
- Brand-check on every section file via `/brand-check`
- Content density audit per `slide-creator:references:design-quality` ruleset (Jordan loaded this earlier — applies broadly)
- Then move to `/shmo-review` category page + 3 PDPs

---

## Surface rhythm (current state)

| Section | Surface | Notes |
|---|---|---|
| Hero | Cream | Avatar stack inline |
| TrustBar | Paper + hairlines | |
| ShmoFamily | Cream | |
| WhyShmocard | Cream | (was peachy `--graham-soft`, now matches the page rhythm with `--cream`) |
| SubBrandShowcase | **Choc-deep** + ink-2 stage with ember border | Premium dark moment |
| RealResults | Cream | Warm tile strip with 6 soft tones |
| Testimonials | Snow (slightly lighter than cream) | 3 video-style cards |
| FAQ | Cream | Single-open accordion |
| Final CTA (planned) | **Choc-deep** | Bookend dark — same as Showcase |
| Footer | Cream | |

`--section-y` is currently 48px (was 88px) — Jordan reduced section spacing earlier in the session.

---

## Preview routes that survived (all under `/preview`)

These are reference implementations for variants that didn't ship. Don't delete — useful for future side-by-side comparisons.

- `/preview` — index of all preview variants
- `/preview/spotlights-a / -b / -c` — sub-brand showcase variants (A shipped)
- `/preview/why-a / -b / -c` — why-section variants (A shipped)
- `/preview/hero-trust / -testimonial / -avatar` — hero conversion-lever variants (avatar shipped)

Deleted this session: `bulk-a/b/c`, `hero-format`, `hero-bulk` (all Shmo Review-specific, will rebuild on `/shmo-review` page later if needed); `progress-variant` (shipped to live).

---

## Open decisions / things to confirm next session

1. **Ember border on showcase stage** — Jordan said the branding guide has a "border color red" but `design.md` doesn't explicitly document an ember-card-border pattern. He may have meant the ember accent rule generally. If he wants softer, dial to `rgba(255, 91, 31, 0.5)` or `0.4`.
2. **"Coming soon" pills on Biz / Link / Reputation in nav** — earlier flagged as a header polish item, not yet shipped.
3. **FAQ section eyebrow + headline duplicate the word "Common questions"** — minor typographic polish (could swap eyebrow to "Before you buy" or "The fine print").
4. **Email capture on coming-soon slides is stubbed** — needs to be wired to the GHL webhook per memory rule before launch.
5. **Real product photos / mascot images** — every `<Placeholder>` swaps to a real image at the end of the build via `nano-banana` (mascots) or actual product photography. Don't replace placeholders ad-hoc.

---

## How to start the next session

1. Read this file. (You're doing it now.)
2. Boot dev server: `cd "/Users/jordancole/Documents/Developement/Projects/Shmocard/Shmocard Website" && npm run dev`
3. Open `http://localhost:3000` and visually confirm Hero / TrustBar / ShmoFamily / Why / Showcase (chocolate, ember-bordered stage, milestone roadmap, email capture on coming-soon, 4 tabs) / RealResults / Testimonials / FAQ are all rendering.
4. Ask Jordan: "Final CTA next, or revisit anything from the existing sections?"
5. Build Final CTA. Then full-page brand pass.

**Latest commit before session end:** see `git log -1 --oneline` after this commit lands. The branch was deployed to Vercel preview at end of session — URL captured in commit body.
