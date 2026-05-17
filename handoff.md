# handoff.md — Session Handoff

**Last session:** 2026-05-16 — Continued the `/shmo-review` build, added the first `/shmo-review/cr-80` route, and corrected a failed custom PDP buybox attempt by reverting the route to the existing Shmo Review buybox component.

---

## Project phase

Phase 3 — Rebuild is still in progress.

The active surface is now the Shmo Review product line:
- `/shmo-review` is the product-family homepage for all Shmo Review formats.
- `/shmo-review/cr-80` exists as the first product page route.
- `scope.md` is outdated where it says PDP sub-routes were abandoned. Jordan clarified on 2026-05-16 that product pages are part of the plan and `/shmo-review` must stay as the category/homepage.

Next work should stay focused on the CR80 PDP top/buybox surface before adding below-the-fold product-page sections.

---

## What was done this session

- **Shmo Review hero:** Updated `components/shmo-review/Hero.tsx` and `app/shmo-review/shmo-review.css` so the hero uses a left-copy/right-image desktop layout and the refreshed asset at `public/shmo-review/hero-image-2.png`. The source image was copied from `/Users/jordancole/Documents/Shmocard/Design/Website/Hero Image - Shmo Review 2.png`.

- **Shmo Review proof and section layout:** Moved proof boxes from a standalone marquee into the crew section. Updated `components/shmo-review/ProofMarquee.tsx`, `components/home/CrewStrip.tsx`, `app/shmo-review/page.tsx`, and `app/shmo-review/shmo-review.css`.

- **How It Works section:** Reworked `components/shmo-review/HowItWorks.tsx` with warm four-step cards and Framer Motion desktop stacking. Adjusted `app/shmo-review/shmo-review.css` for mobile so the iPhone visuals stop clipping.

- **Mobile display fixes:** Adjusted the bullet strip, How It Works iPhone sizing, and mobile nav padding in `app/shmo-review/shmo-review.css` and `components/Nav.module.css`.

- **CR80 product page route:** Created `app/shmo-review/cr-80/page.tsx`. The route currently renders the existing `components/shmo-review/Buybox.tsx` and imports `../shmo-review.css` so it uses the established Shmocard buybox composition. This is intentional after the custom PDP attempt was rejected.

- **Bad CR80 PDP attempt removed:** A custom `components/shmo-review/Cr80PdpBuybox.tsx` and `app/shmo-review/cr-80/cr80.css` were created during the session, but Jordan correctly rejected the direction as not following the design system. Those files were removed before handoff.

- **Format picker link:** Updated `components/shmo-review/FormatPicker.tsx` so the CR80 card links to `/shmo-review/cr-80`. L-Sign and Square still point to `#formats` for now.

- **Verification run:** `npx tsc --noEmit` passed after the CR80 route was rewired to the existing buybox. `curl -I http://localhost:3001/shmo-review/cr-80` returned `200`.

---

## What's next

**Step 3 — `/shmo-review` + product pages** per Phase 3 in `context/general/scope.md`.

Concrete next actions:

1. Update `context/general/scope.md` to reflect Jordan's clarified architecture: `/shmo-review` is the category/homepage, and each format also gets a PDP.
2. Start CR80 PDP work from the existing `components/shmo-review/Buybox.tsx` composition, not from a custom boxed sidebar.
3. Decide whether to refactor `components/shmo-review/Buybox.tsx` into a reusable PDP buybox that accepts product data, while keeping the exact existing visual structure/classes: `review-buybox`, `pdp-buybox`, `gal`, `bb`, `.shm-pack-rows`, `.shm-google`, `.shm-faq-list`, `.shm-buybox-sticky`.
4. Only after Jordan approves the top buybox direction, wire Shopify product/variant/image data into that correct component. Do not prioritize Shopify wiring over visual fit.
5. After the CR80 buybox is approved, add below-the-fold PDP sections one at a time: proof, why CR80, setup steps, product details, format comparison, FAQ, final CTA.

---

## Open decisions

- Whether to keep `/shmo-review/cr-80` temporarily as only the existing buybox, or immediately redesign the PDP top section around the same buybox component.
- Whether `components/shmo-review/Buybox.tsx` should remain the category-page anchored buybox, or become a shared product buybox used by `/shmo-review` and `/shmo-review/cr-80`.
- Which exact Shopify variant/pack display should appear in the final CR80 buybox. Product data must come from Shopify, but the visual structure should be approved first.
- Whether the CR80 PDP should use Shopify CDN product images or local curated CR80 assets for the first visual pass. The design must avoid drifting into a generic Shopify look.

---

## How to start next session

1. Read this file.
2. Read `AGENTS.md`.
3. Read `.claude/skills/shmocard-design-system/SKILL.md`, `.claude/skills/shmocard-design-system/PRIMITIVES.md`, and `.claude/skills/shmocard-design-system/ui_kits/website/Buybox.html`.
4. Ask Jordan: "Do you want me to first update `scope.md` to lock the product-page architecture, or go straight into redesigning the CR80 buybox using the existing Shmocard buybox component?"
5. Do not create another custom PDP shell. Keep the existing buybox composition as the base and make visual changes carefully.
