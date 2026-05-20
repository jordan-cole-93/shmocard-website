# scope.md — Project State & Roadmap

**Last updated:** 2026-05-20

Brand website for Shmocard at `shmocard.com`. Retail front door, headless Shopify + Next.js. Live store at `shop.shmocard.com` is untouched and stays untouched.

---

## Where we are right now

Homepage and `/shmo-review` family page are live. **CR-80 PDP shipped 2026-05-20** with Buybox, Proof, CrewStrip + ProofTiles, HowItWorks (restructured to 4 alternating sections), VideoTestimonials, and FinalCta. Pack-row selector polished for mobile CRO (96 px uniform rows, SAVE badge under pack name). Two CRO research deliverables committed (paid-traffic plan + competitor selector teardown).

Architecture lock (2026-05-16, confirmed in `.planning/PROJECT.md`): `/shmo-review` is the **category / family page** for all Shmo Review formats. Each format also gets its own PDP. This **supersedes** the 2026-05-11 "single-page-with-anchors" decision — PDPs are not abandoned.

What exists in the codebase:
- `app/page.tsx` — homepage (Hero, sub-brand spotlights for Biz/Link/Reputation, FAQ, FinalCta) — desktop + mobile passes complete
- `app/shmo-review/page.tsx` — `/shmo-review` category / family page
- `app/shmo-review/cr-80/page.tsx` — **CR-80 PDP, complete 2026-05-20**
- `app/cart-smoke/page.tsx` — Shopify cart wiring smoke test
- `app/layout.tsx`, `app/globals.css` — base shell
- `components/shmo-review/` — Buybox + family-page sections (Hero, BulletStrip, FormatPicker, HowItWorks, ProofMarquee, Faq, CrewStrip, VideoTestimonials, ProofTiles)
- `components/shmo-review/cr-80/` — CR-80-specific sections (Proof, FinalCta)
- `components/` — Nav (with mobile hamburger), Footer, Section primitive, home page components, cart components, modals/WaitlistModal, layout primitives
- `lib/` — Shopify Storefront helpers, cart utilities, waitlist
- `.claude/skills/shmocard-design-system/` — operator's manual, primitives, reference pages, fonts
- `public/` — illustrations, mascot poses, sub-brand artwork
- `pictures/screenshots/` — 50+ verification screenshots across homepage, /shmo-review, and CR-80 PDP iterations

What does **not** exist yet:
- L-Sign PDP (`/shmo-review/l-sign`) — Phase 5
- Square Card PDP (`/shmo-review/square-card`) — Phase 6
- Coming Soon stubs for sub-brand surfaces (`/shmo-biz`, `/shmo-link`, `/shmo-reputation`) — Phase 4
- Webhook revalidation route — Phase 8 (Shopify wiring)
- Live Storefront API queries on the PDPs (data is currently `TODO(shopify):` placeholders) — Phase 8
- GHL webhook for order sync — Phase 9
- Facebook Pixel + Conversions API — Phase 9

---

## What changed vs the prior design pass

The **product, marketing, and backend stay the same**. The only thing being redone is the visual system — colors, type, layout language, motion, components. Locked headlines and product facts in `marketing.md` / `product.md` carry over unchanged.

---

## Phases

Source of truth for phase structure: `.planning/ROADMAP.md` (10 phases total). Mirror below kept short.

### Phase 1 — Docs refresh (✅ complete 2026-05-07)

Every `.md` file aligned with the post-wipe reality.

### Phase 2 — Design system review (✅ complete 2026-05-07)

Design system audited, structural moves executed, Tailwind 4 ↔ `.shm-*` integration locked (Option A direct CSS import), translation plan locked, 5 decisions locked (Zustand cart, framer-motion, `public/` assets, GHL deferred, static font cuts deleted). Now lives at `.claude/skills/shmocard-design-system/`.

### Phase 3a — Homepage + /shmo-review category (✅ complete 2026-05-16)

Base layout shell (Nav with mobile hamburger, Footer, Section primitive), homepage (Hero, sub-brand spotlights, FAQ, FinalCta), `/shmo-review` family page, cart UI + Shopify Cart API smoke test at `/cart-smoke`.

### Phase 3 — CR-80 PDP (✅ complete 2026-05-20)

`/shmo-review/cr-80` shipped with full PDP: Buybox → Proof → CrewStrip + ProofTiles → HowItWorks (4 alternating sections) → VideoTestimonials → FinalCta. Pack-row selector polished for mobile CRO. Why CR-80 section built then dropped; Product Details + Format Compare + standalone FAQ deferred to Phase 4 onward. See `.planning/phases/03-cr-80-pdp/SUMMARY.md`.

### Phase 4 — Link hygiene & Coming Soon stubs (next)

Build a reusable `<ComingSoon>` component. Stub routes for `/shmo-review/l-sign`, `/shmo-review/square-card`, `/shmo-biz`, `/shmo-link`, `/shmo-reputation`. Audit every CTA / nav / footer link on existing pages — they all resolve to either a real page or a Coming Soon stub. Folds in the button-audit work.

### Phase 5 — L-Sign PDP

Build `/shmo-review/l-sign` using patterns established in Phase 3. Replaces the Phase 4 Coming Soon stub.

### Phase 6 — Square Card PDP

Build `/shmo-review/square-card`. Replaces the Phase 4 Coming Soon stub.

### Phase 7 — Cross-PDP mobile polish

One mobile + a11y pass across all 3 PDPs at 375 / 414 / 768 px. LAYOUT IS LOCKED — spacing / type / mascot only. Run before Shopify wiring so layout fights stay against placeholder data, not real Shopify variant strings.

### Phase 8 — Shopify Storefront wiring

Replace every `TODO(shopify):` placeholder with live Storefront API queries. Wire `cartCreate` / `cartLinesAdd` / cart drawer / checkout redirect. Add webhook revalidation route (`app/api/revalidate/route.ts`). Read-only Admin (no mutations).

### Phase 9 — Tracking — GHL webhook + Facebook Pixel

GHL webhook endpoint for Shopify order-created events (HMAC verified). Facebook Pixel + Conversions API for `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase` (server-side mirror with `event_id` dedup). Test mode validation before going live.

### Phase 10 — Launch readiness

Final a11y audit, Vercel env vars (Storefront token, GHL secret, FB Pixel + CAPI tokens), DNS cutover from `shop.shmocard.com` to `shmocard.com`. Highest blast radius — last phase.

---

## Open decisions

**Carrying into Phase 4 onward:**
- **Drop the 1-card SKU on the CR-80 PDP?** Competitor sells 1 / 2 / 5 tiers; we have 1 / 2 / 5 / 10. Cutting 1-card lifts AOV floor for ad traffic.
- **Inflate compare-price MSRP for stronger anchoring?** Current 27 % off vs competitor's 60 % off.
- **Bonus gifts available?** 5-pack "+ Setup Guide", 10-pack "+ Setup Guide + spare card". Need confirmation what exists or can be authored.
- **L-Sign + Square Card PDP scope** — same buybox composition as CR-80 or different per format?
- **GHL webhook URL** — deferred to Phase 9 (tracking).
- **Final Shopify pricing tiers / SKU naming** — Jordan handles in Shopify Admin before Phase 8 (Storefront wiring).
- **Avatar photo compression** (carried) — John 2.9 MB, Cindy 9.4 MB uncompressed.
- **Joey video status** (carried) — still pending.

**Settled (kept for trail):**
- ✅ Architecture — per-product PDP routes locked 2026-05-16 (`PROJECT.md`); supersedes the 2026-05-11 single-page-anchors approach.
- ✅ Design system — landed 2026-05-07; Phase 2 audit + integration + translation plans complete.
- ✅ Motion library — `framer-motion` locked 2026-05-07 (Phase 2 D-02). Note: CR-80 PDP `HowItWorks` was restructured to drop framer-motion in favor of static alternating sections (2026-05-19).
- ✅ Cart state — Zustand + localStorage locked 2026-05-07 (Phase 2 D-01).
- ✅ Asset location — `public/` locked 2026-05-07 (Phase 2 D-03).
- ✅ Static font cuts — deleted 2026-05-07 (Phase 2 D-05). Variable font covers same range.

---

## Hard constraints (do not violate)

- `shop.shmocard.com` is live. Don't touch the Online Store theme, payment settings, or domain config. See `.claude/rules/live-store-protection.md`.
- Product data lives in Shopify, not in code. See `.claude/rules/shopify-data-discipline.md`.
- Don't invent design primitives. The design system has landed; compose existing `.shm-*` primitives and add new variants only in the design-system source.
- Don't restructure folders without approval. See `.claude/rules/file-organization.md`.
