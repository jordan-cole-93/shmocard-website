# handoff.md — Session Handoff

**Last session:** 2026-05-08 — Long iteration session on homepage social proof + the three "Soon" sub-brand illustrations (Biz / Link / Reputation), plus first-pass video integration and several earlier polish items.

---

## Project phase

Still inside **Phase 3 — Rebuild** (per `context/general/scope.md`). Phase 3 is "build out the site from the new design system, in order of leverage." Homepage is the surface in flight; this session pushed it close to first-pass complete on the spotlight area, video tiles, crew strip, and proof testimonials. Phase 4 (launch readiness) untouched.

No phase metadata changes; STATE.md not updated this session.

---

## What was done this session

### Crew strip — Nick Fulton tile + cloud sticker

- Wired the first crew tile to render Nick Fulton's photo (`public/clients/nick-fulton.jpg`).
- Added typed `CREW` array to `home-data.ts` + `CrewMember` type with optional `photo` / `name` / `shop` / `stat` fields. Five remaining tiles stay placeholders.
- Replaced the flat dark chip with a hand-drawn lobed-cloud SVG sticker badge (marshmallow fill, cocoa-deep stroke, soft shadow, slight tilt). 6-lobe quadratic-bezier path.
- Sticker positioned half-out / half-in the tile so it overlaps the bottom edge instead of covering Nick's hand. Required `overflow: visible` on the tile + `border-radius` on the photo so the photo still clips to the rounded shape.
- **Files:** `components/home/CrewStrip.tsx`, `components/home/home-data.ts`, `components/home/home.css` (new `.crew-tile__sticker*` rules), `public/clients/nick-fulton.jpg`.

### Proof section — real client photos in quote avatars

- Replaced the "SN" / "CK" initials avatars with real photos for Scott Nell (Big Dog Pawn) and Carli Karlson (Axel's Pawn).
- `Quote` type gained optional `photo`. `Proof.tsx` falls back to initials when `photo` is absent.
- **Files:** `public/clients/scott-nell.jpg`, `public/clients/carli-karlson.jpg`, `components/home/home-data.ts`, `components/home/Proof.tsx`, `components/home/home.css` (`.proof-quote__avatar img` rule).
- **Reverted in same session:** A short-lived experiment with shop logos in the bottom-right of `proof-shop` cards. Jordan didn't like it; everything was ripped back out (no logos in `public/clients/logos/` after the revert; type, JSX, and CSS all reverted).

### Video tiles — real video for Carli, inline playback, gradient overlay

Iterated several rounds on the first video tile (Axel's Pawn, Carli):

- Wired `videoUrl: "/videos/carli-axels.mp4"` + `posterUrl: "/videos/carli-tb.jpg"` to the first VIDEO_TILES entry.
- Replaced the flat ember-color placeholder with a real `<video>` element using a custom poster, so the thumbnail shows the actual moment of the video instead of the orange block.
- Click-to-play now plays **inline in the tile** (no modal). `VideoTile.tsx` rewrote the click handler with `useState` + `useRef`: unmute → play → toggle `video-card--playing` class. Native `controls` show during playback; the play button / duration badge / quote overlay are CSS-hidden via the modifier class.
- Added a per-tile **gradient overlay** (`.video-card__media-overlay`) sitting above the video and below the chrome. Goes solid at the bottom in the tile's `bgVariant` color (ember/cocoa/honey), fades to transparent moving up — so the bottom quote text reads on a clean colored band rather than directly on video pixels. Hidden during playback.
- Updated duration field to ceiling-rounded (`"0:21"` from actual `20.7s`). Added optional `thumbnailTime?: number` field to the type for future tiles without a poster image.
- Documented the **Pawn Leads shirt exception** as a comment on Carli's tile in `home-data.ts` so the hard brand-separation rule doesn't get re-flagged.
- **Joey's video removed.** Jordan reviewed `joey-leza.mp4` (21 MB) and concluded the audio is unusable on the Shmocard site (explicit "Pongleads / give Jeff a shout" references). File deleted from `public/videos/`. Tile 3 stays in pending placeholder state.
- **Files:** `components/home/VideoTile.tsx`, `components/home/home-data.ts`, `components/home/home.css` (added `.video-card__media-bg--video`, `.video-card__media-overlay`, `--video-overlay-color` per-variant CSS custom property, `.video-card--playing` overrides). `public/videos/carli-axels.mp4` + `public/videos/carli-tb.jpg` (poster) — kept. `public/videos/joey-leza.mp4` deleted.

### Sub-brand illustrations — Biz / Link / Reputation

Replaced the three "Photo coming" placeholders with real product-mockup illustrations. New `SubBrand.art` union member: `{ kind: "illustration"; key: "biz" | "link" | "reputation" }`. New `components/home/SubBrandIllustration.tsx` server component with a key-based switcher + many helper SVG icons.

#### Shmo Biz — physical card + iPhone scene

- A tilted marshmallow business card (cocoa-deep "ShmoBiz" wordmark in two-tone, ember NFC chip, John Doe + role) on the left, in front of the phone.
- An upright iPhone on the right showing an iOS-style contact preview card: avatar (real photo `john-doe.jpg`), "John Doe / Owner · ShmoCard", divider, three contact rows with hand-drawn cocoa icons (phone / mail / globe), and a full-width ember "Save to Contacts" pill button.
- Caption "TAP TO SAVE CONTACT" at the bottom of the screen.
- The phone uses the canonical phone-frame primitive: cocoa-deep body, soft drop shadow + 1px subtle ring (no chunky border), dynamic-island notch.
- Multiple iterations went through this before landing — sticker stack, plain phone, branded ember card on screen, two-object scene — final is the two-object scene.
- **Files:** `components/home/SubBrandIllustration.tsx` (`BizPhone` + 3 line icons), `components/home/home.css` (`.phone-frame` family + `.biz-physical-card` + `.biz-contact-preview`), `public/other/john-doe.jpg`.

#### Shmo Link — phone with link-in-bio + four browser-window callouts

- Phone on the left running a Linktree-style link-in-bio screen: real photo avatar (Cindy Doe at `public/other/cindy-doe.jpg`), "Cindy Doe" name, "Local diner since 1962" tagline, green "● Open now" status pill, divider, then four destination buttons (Facebook profile / YouTube channel / Donate / Website), each with hand-drawn icon + label + right-pointing chevron.
- Four scattered **browser-window callouts** to the right:
  - **Facebook** — cocoa cover banner + cocoa avatar overlapping + name stripe + cocoa "Follow" pill
  - **YouTube** — cocoa video thumbnail with ember play button + channel avatar/name + "Subscribe" pill
  - **Donate** — heading row with ember heart + name stripe, $5 / $25 / $50 amount chips ($25 ember active), full-width ember Donate button
  - **Website** — browser URL bar (with three traffic-light dots) + cocoa header stripe + content stripes
- All callouts share a `<BrowserFrame>` wrapper component with a consistent URL bar (graham-soft + ember/honey/cocoa traffic lights) and a `.callout-page` body.
- Callouts alternate close/far horizontally next to the phone — close → far → close → far. Each callout has a thin **dashed cocoa-deep** connector line + ember endpoint dots, going from the phone button right-edge to the callout left-edge.
- **Files:** `components/home/SubBrandIllustration.tsx` (`LinkPhone`, `BrowserFrame`, callout sub-components, FacebookIcon, YoutubeIcon, HeartIcon, ChevronIcon), `components/home/home.css` (`.link-screen*`, `.link-btn`, `.link-callout*`, `.link-connectors`, `.callout-tile*`, `.callout-page*`), `public/other/cindy-doe.jpg`.

#### Shmo Reputation — MacBook with full SaaS dashboard

- A MacBook chassis (`#27130b` for the lid + base, no border, iPhone-matching soft drop shadow + 1px ring) sitting centered in the cocoa-deep section.
- Inside the screen: a full SaaS dashboard with dark theme.
  - **Left sidebar** (also `#27130b` to match chassis): brand mark + "Reputation" name, 5 nav items with hand-drawn icons (Dashboard active / Reviews + "24" pill / AI Replies / Analytics / Settings), user row at bottom with avatar + "John Doe / John's Diner".
  - **Main content** (cocoa-deep bg with marshmallow text): top bar with "Reviews" title + "Last 30 days" + search/bell. Then a **4-card stats row** (Total reviews 142 ↑12% / This week +18 ember / Avg rating 4.8★ stable / Reply rate 96% ↑AI). Then a **bar chart** ("Review volume — Daily") with 7 alternating ember/ember-faded bars. Then a **recent activity feed** with two reviews — each has avatar + name + timestamp + 5 yellow stars + quote stripes + an indented ember-tinted **AI reply box** with a sparkle icon, reply lines, and a "Sent" tag.
- Initially shipped with a floating "Auto-replied" ember pill accent next to the laptop; **removed** later in the session.
- Significant palette iteration on this one. Final: chassis + sidebar both `#27130b`; main panel + active nav cocoa-deep; everything else marshmallow / ember / honey on dark.
- **Files:** `components/home/SubBrandIllustration.tsx` (`ReputationLaptop` + StarIcon, SparkleIcon, GridIcon, BubbleIcon, ReplyIcon, ChartIcon, GearIcon), `components/home/home.css` (`.rep-laptop*`, `.rep-dashboard*`, `.rep-nav*`, `.rep-stat*`, `.rep-chart*`, `.rep-feed*`, `.rep-review*`).

### Spotlight overflow fix

Added `.spotlight__art:has(.spotlight__illustration-frame) { overflow: visible; border-radius: 0 }` so the soft drop shadow under the iPhone / MacBook can bleed past the slot's rounded edges. Photo and placeholder cases keep the original `overflow: hidden`.

### Asset additions

- `public/clients/nick-fulton.jpg`, `carli-karlson.jpg`, `scott-nell.jpg` — testimonial photos
- `public/clients/logos/` — created and removed in same session (logos experiment reverted)
- `public/other/john-doe.jpg`, `cindy-doe.jpg` — illustration avatar photos (large source files; flagged for compression before launch — both >2 MB, Cindy's source is 9.4 MB)
- `public/videos/carli-axels.mp4` (6.4 MB) + `carli-tb.jpg` poster
- Many screenshots in `pictures/screenshots/` for proof at every iteration

### Files modified

- `components/home/CrewStrip.tsx` — typed `CREW` array, photo + sticker rendering
- `components/home/Proof.tsx` — `<img>` fallback to initials in avatar
- `components/home/SubBrandSpotlight.tsx` — branch added for `art.kind === "illustration"`
- `components/home/VideoTile.tsx` — inline playback rewrite + media overlay + per-variant class
- `components/home/home-data.ts` — `Quote.photo`, `CREW`/`CrewMember`, `VideoTile.posterUrl`/`thumbnailTime`, `SubBrand.art` union extended with `illustration` kind, all three soon-tile entries switched to illustration
- `components/home/home.css` — large additions for crew sticker, video overlay, phone-frame primitive, all three illustration scenes, link-callouts + connectors
- `components/home/SubBrandIllustration.tsx` — **new file**

### Files NOT touched this session

- `STATE.md`, `ROADMAP.md`, `scope.md` — still stale relative to git
- Phase 4 routing question (A polish / B formalize visual-redesign / C launch-readiness) — still unresolved
- The other 5 crew tiles + the 2 remaining video tiles — still placeholders
- Hero CTA row spacing, Proof primitive audit, FAQ confirm, Final CTA wave — all carried from prior handoffs, still not done

---

## What's next

**Step 3 — Rebuild** per `scope.md`. Concrete next actions:

1. Decide whether the **Soon** illustrations (Biz / Link / Reputation) are locked or want another pass — Jordan ended this session not asking for further iteration.
2. **Compress the avatar photos** before launch. `public/other/cindy-doe.jpg` is 9.4 MB and `public/other/john-doe.jpg` is 2.9 MB — should be ~150 KB each at the size they actually render. Easy win but I deferred when offered.
3. Optional — fill in the rest of the social proof:
   - Crew tiles 2–6 (5 placeholders left)
   - Video tile 3 (Buffalo Jewelry) is permanently pending until Joey records a clean clip without Pawn Leads references
4. **Commit landed at end of session per Jordan's request** — see git log.
5. Carried-forward queued targets from prior handoffs (still not done): Hero CTA row spacing, Proof primitive audit (`.shm-card` confirm), FAQ block primitive confirm, Final CTA / footer wave.

---

## Open decisions

- **Phase 4 routing** — A polish vs B formalize visual-redesign vs C launch-readiness. Carried from prior handoffs; never updated `ROADMAP.md`.
- **Image compression** — Jordan never said yes/no when I offered to compress avatars (2.9 MB + 9.4 MB are too big). Default action probably should be "compress before launch" but he hasn't approved it.
- **Joey video** — confirmed off the homepage for now. Tile 3 in `VIDEO_TILES` keeps `pending: true`. Open whether to pursue a fresh take from Joey, drop the slot entirely, or reassign to a different shop.
- **Eyebrow / lede / CTA copy divergences from canonical** still in place from prior session — eyebrow "A toolkit, not a card" vs canonical "A toolkit for local crews", etc. Never resolved.

---

## How to start next session

1. Read this file.
2. Read `CLAUDE.md`.
3. Ask Jordan: **"Are the three sub-brand illustrations locked, or want another iteration on any of Biz / Link / Reputation? And — do you want me to compress the avatar photos (2.9 MB + 9.4 MB) before they ship?"**
4. Before any UI work, invoke the `shmocard-design-system` Skill via the Skill tool first per `.claude/rules/skill-routing.md` mandatory-first rule. Then read `.claude/rules/design-system.md`.
5. Useful context if iteration continues: the spotlight illustrations live in `components/home/SubBrandIllustration.tsx`. Each section's `art` field in `home-data.ts` selects the `key` (`biz`, `link`, `reputation`). All CSS is in `components/home/home.css` namespaced as `.biz-*`, `.link-*`, `.callout-*`, `.rep-*`.
6. **New audit reminder**: when adding new illustrations, the soft drop shadow on the iPhone / MacBook will be clipped by `.spotlight__art`'s `overflow: hidden` unless the slot has the `:has(.spotlight__illustration-frame)` override (already in place — just don't break it).
