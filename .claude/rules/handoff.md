# handoff.md — Session Handoff

**Last session:** 2026-04-25 — Shmocard parent-brand homepage rebuild (in progress)

---

## What's the project right now

**Goal:** Build the Shmocard parent-brand homepage at `shmocard.com/`.
**Stage:** Section-by-section rebuild against the design handoff. ~50% of sections done.

**Working directory:** `/Users/jordancole/Documents/Developement/Projects/Shmocard/Shmocard Website/`

---

## CRITICAL — read before writing any code

1. **Design handoff** lives at `/Users/jordancole/Downloads/design_handoff_shmocard/`. Read its `CLAUDE.md`, `tokens.css`, and the JSX files in `reference/components/` BEFORE writing any UI code. The reference HTML is the canonical visual target — open it in a browser if needed.

2. **Tokens are `--shmo-*` prefixed.** Global level (`app/globals.css`) defines `--shmo-cream`, `--shmo-ember`, `--shmo-ink`, etc. The `.home` wrapper scope additionally aliases the OLD unprefixed names (`--cream`, `--graham`, `--ink`, etc.) so the lifted handoff `home-styles.css` works. **Don't break this — every page is wrapped in `<div className="home">` for a reason.**

3. **Memory rules** (in `~/.claude/projects/-Users-jordancole-Documents-Developement-Projects-Shmocard-Shmocard-Website/memory/`) — review at session start. Especially:
   - **Parent brand vs Shmo Review distinction** — the homepage promotes 4 tools equally. NOT a Shmo Review shop page. The handoff prototype is a Shmo Review shop — use it for visual technique only.
   - **No invented stats** — only verified proof points from `marketing.md`.
   - **Use abstract `<Placeholder>` for all images** — never `<Image src="/mascot/...">`. Real images swap at the end with nano-banana.
   - **Hard rules from handoff**: one ember CTA per viewport, italic accent = exactly one word per headline, no emoji, hairline borders only, no grey shadows.

4. **Section structure follows wireframe + marketing.md content + handoff visual technique** — NOT the handoff's section order (which is a Shmo Review shop layout). The wireframe at `wireframe/home-page-shmocard.md` is the parent-brand structure.

---

## What's built (in page order)

| # | Section | File | Status |
|---|---|---|---|
| 1 | Nav | `components/nav/Nav.tsx` | ✅ Done |
| 2 | Hero | `components/home/Hero.tsx` | ✅ Done — parent-brand copy *"The toolkit your crew's been **missing**."* + Sparkles pill *"Live now: Shmo Review · 3 more on the way"* + `<Placeholder>` for mascot |
| 3 | TrustBar | `components/home/TrustBar.tsx` | ✅ Done — 4 items: Made for Main Street · No subscription on cards · Works on any phone · One family, four tools |
| 4 | ShmoFamily | `components/home/ShmoFamily.tsx` | ✅ Done (Phase A — implicitly approved when verified with new tokens) |
| 5 | WhyShmocard | `components/home/WhyShmocard.tsx` | ✅ Done — 2-col split, peachy `--graham-soft` section bg, no white cards (inline pillars with hairline dividers) |
| 6 | 4 sub-brand spotlights | `components/home/SubBrandSpotlight.tsx` + `SubBrandSpotlights.tsx` | ⏳ JUST SHIPPED, AWAITING JORDAN VERIFY — boxed cards (color is on the box, not the section). Cream / Honey-soft / Blush-soft / Chocolate. Section bg is cream. |
| 7 | Footer | `components/footer/Footer.tsx` | ✅ Done |

## What's left to build

In order:
1. **Real Results** — 5 verified proof tiles (Garden City +86%, Buffalo Jewelry +81%, Axel's Pawn +71%, Marshall 5/2hr, Allan Macias 80+/week). Surface: dark warm — Choc-deep with honey numbers.
2. **MascotMoment** (optional) — small transition piece between sections.
3. **Testimonials** — 3 quote cards: 2 from Carly's verified quotes + 1 placeholder card "More crews coming soon" for Joey. NO video player yet (deferred until video files exist).
4. **FAQ** — 8 questions accordion (questions in `wireframe/home-page-shmocard.md` Section 10).
5. **Final CTA** — Choc-deep bg, ember "Shop Shmo Review" + soft "Join the waitlist". Bookends the dark-section pattern.

---

## Surface rhythm (locked)

| Section | Surface | Notes |
|---|---|---|
| Hero | Cream | Default warm |
| TrustBar | Paper + hairlines | Clean lift |
| ShmoFamily | Cream | |
| WhyShmocard | Graham-soft (peachy) | One warm light tint |
| Sub-brand spotlights | Cream section + boxed cards (Paper / Honey-soft / Blush-soft / Chocolate) | Color on the box, not section |
| Real Results | Choc-deep (planned) | Premium dark for stats |
| Testimonials | Snow OR Graham-soft (TBD) | Quiet warmth |
| FAQ | Cream | Calm read |
| Final CTA | Choc-deep (planned) | Bookend dark, ember CTA pops |
| Footer | Cream | Exit |

---

## Open questions / decisions to make next session

1. **Sub-brand spotlights boxed treatment** — Jordan needs to verify the boxed conversion. If approved, move to Real Results.
2. **Real Results layout** — handoff doesn't have an exact template. Options: 5 stat tiles in a 3+2 layout, or 5-up horizontal row. Use Magic MCP for variations if needed (per Jordan's "in pocket when needed" approval).
3. **Testimonials video** — keep as placeholder cards for now. Real video files don't exist yet. When they do, swap card → video player.
4. **"Get notified" CTAs** — currently stubs (click does nothing). Future GHL webhook (memory `project_email_capture_target.md`).

---

## Workflow rules learned the hard way (this session)

1. **One section at a time.** Jordan verifies before next. He's burned by big multi-section dispatches that go off-track.
2. **Don't merge or remove sections** without asking. Earlier I conflated "make sections boxed" with "merge family + spotlights into one section" — Jordan got upset, had to revert. Lesson: when in doubt, ask.
3. **When Jordan says "wrong" / "don't like" — don't explain, just fix.** (Memory rule.)
4. **Visual changes need browser verification** — but Browsermcp needs the extension connected (Jordan's end). Have him refresh and tell me.
5. **Magic MCP** — keep in pocket. Use only for sections where the handoff doesn't have a clear template (e.g., Real Results, Final CTA). Don't ask Jordan to paste code as a workaround.

---

## How to start the next session

1. Read this file.
2. Memory `MEMORY.md` is loaded automatically — verify the entries match what's needed.
3. Boot dev server: `cd "/Users/jordancole/Documents/Developement/Projects/Shmocard/Shmocard Website" && npm run dev`
4. Open `http://localhost:3000` and visually confirm Hero / TrustBar / ShmoFamily / WhyShmocard / 4 boxed Sub-brand spotlights are all rendering correctly.
5. Ask Jordan: "Boxed spotlights look right? Or anything to tweak before Real Results?"
6. Continue with Real Results → MascotMoment → Testimonials → FAQ → Final CTA.

**Latest commit:** `0806b22 feat(spotlights): convert to boxed cards — color treatment moves from section bg to contained box`
