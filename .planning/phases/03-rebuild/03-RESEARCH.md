# Phase 3: Rebuild — Research

**Researched:** 2026-05-07
**Domain:** Headless Shopify storefront on Next.js 15 + design-system-driven UI rebuild
**Confidence:** HIGH on stack/patterns/CONTEXT alignment · MEDIUM on Shopify webhook timing edge cases · LOW on GHL webhook schema (deferred)

---

## Summary

Phase 3 rebuilds the Shmocard marketing site by composing the locked design system (`.claude/skills/shmocard-design-system/`) into Next.js 15 App Router pages. The Foundations stage is already shipped (3-A1..3-A6) — `app/globals.css` imports the design system, `Nav` + `Footer` mount globally, `Mascot` + `Sticker` typed wrappers exist, and a Zustand cart store skeleton is in place. The remaining work is content-and-data-heavy: 11 home sections, a `/shmo-review` category page, 3 PDPs that fetch from Shopify Storefront API, a cart drawer wired to Cart API mutations, a webhook revalidation route, and a deferred GHL waitlist webhook stub.

The decisions that shape every plan stub are already locked in `CONTEXT.md` and `DECISIONS.md`: Zustand for cart, framer-motion for section/drawer/modal motion (CSS for hover), Storefront API only (zero Admin API), Server-Component-first with `'use client'` only for interactive surfaces, `.shm-*` utility prefix mandatory, and the four-color section rotation enforced.

**Primary recommendation:** Treat plans 03-01 and 03-02 as **delta audits** (verify what 3-A1..3-A6 already shipped — don't rebuild), then drive plans 03-03 onward with a thin `lib/shopify/` GraphQL fetch wrapper using Next.js fetch caching with tag-based revalidation. Section composition reads directly from `.claude/skills/shmocard-design-system/ui_kits/website/homepage/Shmocard Homepage.html` + `home.css` + `home-data.jsx` — these are the canonical layouts; do not invent.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Build order — A1 sequential (LOCKED).** Foundations → Homepage → ShmoReview → PDPs → Cart → Shopify wiring → Waitlist. No vertical slices.

**Content / copy (LOCKED):**
- **B1 Hero `<em>` type-cycle:** "The toolkit your crew's been [missing | asking for]." — two-word cycle on the END, ~2.5s crossfade, reserve `min-width` from longer alt ("asking for").
- **B2 Audience marquee:** 10 audiences in source order, CSS keyframe scroll-left, 38s, paused on hover.
- **B3 Proof section data — HARD RULE:** Use real Pawn Leads client shop names + metrics. **NEVER mention "Pawn Leads"** anywhere — no copy, no alt text, no filenames, no comments. Pre-commit grep + pre-deploy grep enforce.
- **B4 HOW IT WORKS:** Keep mock 6 steps. 3-column grid, 2 rows.
- **B5 FAQ:** DEFERRED at build time — Claude drafts from `marketing.md`/`product.md`, Jordan edits when section is built. Mock FAQ is format reference only.
- **B6 Sub-brand spotlight order:** Review → Biz → Link → Reputation. Bg rotation: marsh → graham → marsh → cocoa. Crew strip after Review.
- **B7 Footer:** 4 columns: brand+social, products, shop, help. Final hrefs at build time.

**Architectural decisions (from `DECISIONS.md`):**
- D-01 Cart state: Zustand + localStorage middleware (already shipped at `components/cart/store.ts`)
- D-02 Animation: framer-motion for section reveals + drawer/modal entrances (subtle/fast/non-bouncy, match `--motion-*` tokens). CSS for hover.
- D-03 Assets: `public/` (Next.js convention) — already migrated 3-A2
- D-04 GHL webhook URL: deferred to mid-Phase 3 (env var `GHL_WAITLIST_WEBHOOK_URL`)
- D-05 Static Bricolage cuts deleted; variable font canonical

**Sub-brand waitlist UX (D1):** "Notify me" CTA opens modal at `components/modals/WaitlistModal.tsx`. Server Action posts to GHL.

### Claude's Discretion

- React component prop types and internal hooks
- Tailwind utility choices (within INTEGRATION.md "layout only" constraint)
- Individual component file naming (TRANSLATION.md provides target paths)
- TypeScript types for Shopify Storefront API responses
- Server vs client component boundaries (TRANSLATION.md provides defaults; deviations must be justified)
- CSS layout specifics inside page-level files (`home.css`, `pdp.css`, `cart-drawer.css`)
- Test scaffolding — DEFER to Phase 4
- Bundle optimization choices (Vercel handles automatically)

### Deferred Ideas (OUT OF SCOPE)

- Mobile / a11y polish (Phase 4)
- Lighthouse / performance pass (Phase 4)
- DNS cutover (Phase 4)
- Search / filtering on category page (out, ever — only 3 formats)
- Login / accounts on marketing site (out — Shopify-hosted checkout handles auth)
- Blog / CMS (out for v1)
- Multi-currency / multi-region (deferred to Shopify Markets)
- Custom checkout (out — requires Shopify Plus)
- Tests (defer; Phase 4 may add)
- Crew photos + video testimonials (placeholders for Phase 3)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| REQ-01 | Homepage with locked headline, 4 sub-brands equal weight, section rotation | TRANSLATION.md homepage section table; reference HTML at `Shmocard Homepage.html`; section bg rotation locked in B6 |
| REQ-02 | `/shmo-review` category page — bulk math, locked headline + tagline, 6 questions answered | `marketing.md` locked headlines; 3 format cards link to PDPs |
| REQ-03 | CR-80 PDP — flagship buybox via Storefront API | `Buybox.html` reference; Storefront API server-component fetch by handle (`google-reviews-nfc-tap-card-cr80`) |
| REQ-04 | L-Sign PDP — same buybox + L-Sign value props | Same PDP component tree, handle `google-review-nfc-tap-card-l-sign` |
| REQ-05 | Square Card PDP — same buybox + plate value props | Same PDP component tree, handle `google-review-plaque` |
| REQ-06 | Storefront API integration — all product/cart, no Admin API | Storefront API 2026-04, `cartCreate`/`cartLinesAdd`/`cartLinesUpdate`/`cartLinesRemove`, `cart.checkoutUrl` redirect |
| REQ-07 | Webhook revalidation route at `app/api/revalidate/route.ts`, ~5s propagation | Next.js 15 `revalidateTag`; HMAC verification via `X-Shopify-Hmac-SHA256` + raw body |
| REQ-08 | Waitlist capture to GHL webhook | Server Action posting `FormData`; URL deferred via `GHL_WAITLIST_WEBHOOK_URL` env var; honeypot + simple rate limit |
| REQ-09 | Design system integration — fonts, tokens, primitives, `.shm-*` discipline, no gradients/blurs/stripes, 4-color rotation | INTEGRATION.md direct CSS import strategy; already shipped in 3-A1 |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **Live store protection supersedes everything.** Storefront API only. No Admin API writes. No DNS / theme / payment edits.
- **Pawn Leads brand separation HARD RULE.** Never appears in any rendered HTML, alt text, filename, or comment. Use real shop names + real metrics with zero agency attribution.
- **`.shm-*` utility prefix mandatory** on every visual class. Tailwind 4 utilities for layout only (`flex`, `grid`, `gap-*`, `p-*`, `max-w-*`).
- **No primitive restyles in page CSS.** Page-level CSS owns LAYOUT only (grid, padding, aspect ratio).
- **Tokens not hex.** `var(--color-ember)` always; never `#FF5B1F` or `text-orange-500`.
- **Mascot rules.** Sticker, max 140px, max 2/page. 200px hero variant for homepage sub-brand spotlights only (showcase exception).
- **Forbidden:** gradients, drop-shadow blurs, left-border accent stripes, exclamation marks, emoji as decoration, system-ui fonts.
- **File org locked.** No new top-level folders without Jordan approval.
- **Verification standard.** Every plan ends with browser proof + screenshot to `pictures/screenshots/`. `tsc` + `next build` is not enough.
- **No raw HTML injection from external data.** Render Shopify `description` (plain text) by default; only consider rendering `descriptionHtml` if a sanitizer (e.g., DOMPurify) is added — that decision is OUT of Phase 3 scope.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Page rendering (homepage, /shmo-review, PDPs) | Frontend Server (SSR) | — | Server Components fetch Shopify, send rendered HTML |
| Product / collection fetch | API (Shopify Storefront) | Frontend Server (SSR cache via `fetch` tags) | Shopify owns product truth; SSR caches per-handle with tag invalidation |
| Cart state (line items, qty, drawer open) | Browser / Client | API (Shopify Cart) | Zustand + localStorage local; reconciles to Shopify cart GID for checkout |
| Cart mutations (`cartCreate`/`cartLinesAdd`/etc.) | API (Shopify Storefront) | Browser (initiates) | All cart writes go through Shopify; client dispatches via Server Actions |
| Checkout | API (Shopify Hosted) | — | `cart.checkoutUrl` redirect; never custom |
| Static assets (mascot, products, hero) | CDN (Vercel `public/`) | — | Standard Next.js static asset pipeline |
| Webhook revalidation | Frontend Server (Route Handler) | API (Shopify webhook origin) | `app/api/revalidate/route.ts` validates HMAC, calls `revalidateTag` |
| Waitlist form submit | Frontend Server (Server Action) | API (GHL webhook origin) | Server Action posts FormData to GHL URL; honeypot + rate-limit guard |
| Section reveal motion | Browser / Client (framer-motion) | — | viewport-triggered, `'use client'` only on motion shells |
| Hover transitions | Browser (CSS only) | — | Already in `components.css`; never re-implement in JS |

## Standard Stack

### Core (already in `package.json` — VERIFIED)

| Library | Version | Purpose | Why Standard | Source |
|---------|---------|---------|--------------|--------|
| next | ^15.1.6 | App Router framework | Locked at scaffold | [VERIFIED: package.json] |
| react / react-dom | ^19.0.0 | UI runtime | Default for Next 15 | [VERIFIED: package.json] |
| typescript | ^5 | Types | Locked | [VERIFIED: package.json] |
| tailwindcss + @tailwindcss/postcss | ^4 | Layout/spacing utilities only | INTEGRATION.md locks layout-only scope | [VERIFIED: package.json] |
| zustand | ^5.0.3 | Cart state with persist middleware | D-01 lock; ~3KB; survives navigations | [VERIFIED: package.json] |
| framer-motion | ^12.0.0 | Section reveals, drawer/modal entrances | D-02 lock | [VERIFIED: package.json] |

### Supporting (need to add or wire — Phase 3 plans)

| Library | Version | Purpose | When to Use | Source |
|---------|---------|---------|-------------|--------|
| `@shopify/storefront-api-client` | latest 2026 series | Typed wrapper around Storefront GraphQL | Server-side product/cart queries (use Next `fetch` directly is also acceptable) | [CITED: npmjs.com/package/@shopify/storefront-api-client] |
| (none) — use Next.js native `fetch` | 15.x | Caching with tag invalidation | Plain `fetch(endpoint, { method: 'POST', next: { tags: [...] } })` is the simplest path | [CITED: nextjs.org/docs/app/api-reference/functions/revalidateTag] |

**Recommendation:** Start with **plain `fetch` + a small `shopifyFetch` wrapper** (Vercel Commerce / Next.js Commerce pattern). Adding `@shopify/storefront-api-client` is optional and only buys typed query helpers — not required given how few queries this site has (3 PDPs + 1 collection + cart mutations). Keeps bundle smaller and avoids dependency bloat.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Plain `fetch` wrapper | `@shopify/storefront-api-client` | Client gives typed queries; we have ~5 queries total, doesn't earn the dep |
| Plain `fetch` wrapper | `graphql-request` | Adds ~5KB; nothing Next's `fetch` doesn't already do |
| Zustand cart | Cart cookie + Server Action only | Cookie-only is simpler but loses optimistic UI on the client; Zustand already locked |
| framer-motion 12 | `motion` package (rebrand) | framer-motion 12 is a working alias; no migration needed inside Phase 3. Keep `framer-motion` import path. |

### Version Verification

Versions in `package.json` were locked during Phase 3-A1 (2026-05-07). Re-verify only if a future plan adds a new dep:

```bash
npm view @shopify/storefront-api-client version
npm view next version
```

[ASSUMED] `framer-motion` `^12.0.0` is React 19 compatible — Motion docs state "React 19 is fully supported" but the rename to `motion/react` happened mid-2025. Sticking with `framer-motion` import path is fine for v1; migration to `motion/react` is a non-blocking later cleanup. [CITED: motion.dev/docs/react]

## Architecture Patterns

### System Architecture Diagram

```
                 ┌──────────────────────────┐
 Visitor ──▶     │ Vercel Edge / CDN        │   /products/*.png
                 │  (Next.js 15 SSR + ISR)  │   /mascot/*.png  ← public/ assets
                 └──────────┬───────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │ App Router pages                       │
        │  app/page.tsx           (Server Comp)  │
        │  app/shmo-review/page.tsx (Server)     │
        │  app/shmo-review/[handle]/page.tsx     │
        │     └─ getProductByHandle() ───────┐   │
        │  app/api/revalidate/route.ts ──┐   │   │
        └────────────────────────────────┼───┼───┘
                                         │   │
                                         │   │ fetch(POST /api/2026-04/graphql.json)
                                         │   │ tags: ['product', 'product:cr-80']
                                         │   ▼
                                         │  ┌─────────────────────────┐
                                         │  │ Shopify Storefront API  │
                                         │  │ shmocard.myshopify.com  │
                                         │  └─────────────────────────┘
                                         │             ▲
                                         │             │ cartCreate / cartLinesAdd /
                                         │             │ cartLinesUpdate / cartLinesRemove
                                         │             │
                                         │   ┌─────────┴──────────┐
                                         │   │ Server Actions     │
                                         │   │ components/cart/   │
                                         │   │   actions.ts       │
                                         │   └─────────┬──────────┘
                                         │             │
                                         │   ┌─────────▼───────────┐
                                         │   │ Browser (client)    │
                                         │   │  Zustand cart store │
                                         │   │  + localStorage     │
                                         │   │  CartDrawer.tsx     │
                                         │   │  CartLine.tsx       │
                                         │   │  PdpAddToCart.tsx   │
                                         │   └─────────┬───────────┘
                                         │             │ "Checkout" button
                                         │             ▼
                                         │   cart.checkoutUrl → Shopify-hosted checkout
                                         │
                                         │ HMAC verify (X-Shopify-Hmac-SHA256, raw body, base64)
                                         ▼
        Shopify webhooks: products create/update/delete
        ──▶ revalidate route ──▶ revalidateTag('product:<handle>')
                                 revalidateTag('collection:shmo-review')

        Waitlist:
        WaitlistModal ──▶ Server Action ──▶ POST GHL_WAITLIST_WEBHOOK_URL
        (Biz / Link / Reputation only)
```

### Component Responsibilities (file-to-purpose map)

| File / Folder | Tier | Purpose |
|---------------|------|---------|
| `app/layout.tsx` | Server | Mounts `<Nav />` + `<Footer />` + (new) `<CartDrawer />`. Imports `globals.css`. |
| `app/page.tsx` | Server | Composes 11 home sections in order. |
| `app/shmo-review/page.tsx` | Server | Category page; static copy + 3 format cards linking to PDP routes. |
| `app/shmo-review/[handle]/page.tsx` | Server | Fetches product via `getProductByHandle`; passes to `<PdpBuybox />`. |
| `app/api/revalidate/route.ts` | Server (Route Handler) | Verifies HMAC, calls `revalidateTag` for affected paths. |
| `components/home/*.tsx` | Mostly Server, some Client (motion shells) | 11 section components per TRANSLATION.md. |
| `components/pdp/*.tsx` | Mix | `PdpBuybox` (server orchestrator), gallery/qty/pack-selector/sticky-bar/add-to-cart all `'use client'`. |
| `components/cart/*.tsx` | Client | All `'use client'` (Zustand reads). |
| `components/cart/store.ts` | Client | Already shipped. Add `setCart` use during cartCreate; reconcile lines on drawer open. |
| `components/cart/actions.ts` (NEW) | Server Actions | `addLine`, `updateLine`, `removeLine`, `getOrCreateCart` — all hit Storefront API |
| `components/modals/WaitlistModal.tsx` | Client | Form + Server Action submit. |
| `components/modals/VideoLightbox.tsx` | Client | `<AnimatePresence>` open/close. |
| `lib/shopify/index.ts` (NEW) | Server-only | `shopifyFetch<T>(query, vars, tags)` wrapper around `fetch`. |
| `lib/shopify/queries.ts` (NEW) | Server-only | `PRODUCT_BY_HANDLE_QUERY`, `COLLECTION_QUERY`, cart queries. |
| `lib/shopify/mutations.ts` (NEW) | Server-only | `CART_CREATE_MUTATION`, `CART_LINES_ADD_MUTATION`, etc. |
| `lib/shopify/types.ts` (NEW) | Shared | TypeScript types for Storefront API responses. |
| `lib/waitlist.ts` (NEW) | Server-only | GHL webhook POST helper + honeypot/rate-limit. |

### Recommended Project Structure (after Phase 3)

```
app/
├── layout.tsx                        # Nav + CartDrawer + Footer + globals.css
├── globals.css                       # imports Tailwind + design system
├── page.tsx                          # homepage
├── shmo-review/
│   ├── page.tsx                      # category page
│   └── [handle]/
│       └── page.tsx                  # PDP route
└── api/
    └── revalidate/
        └── route.ts                  # POST handler for Shopify webhooks
components/
├── Nav.tsx + Nav.module.css          # already shipped
├── Footer.tsx + Footer.module.css    # already shipped
├── Mascot.tsx + Sticker.tsx          # already shipped
├── mascot-poses.ts                   # already shipped
├── home/
│   ├── home.css                      # LAYOUT ONLY
│   ├── Hero.tsx
│   ├── AudienceStrip.tsx
│   ├── Proof.tsx
│   ├── SubBrandSpotlight.tsx         # used 4× with different data
│   ├── CrewStrip.tsx
│   ├── HowItWorks.tsx
│   ├── VideoTestimonials.tsx
│   ├── Compatibility.tsx
│   ├── HomeFaq.tsx
│   ├── FinalCta.tsx
│   └── home-data.ts                  # SUB_BRANDS, SHOPS, QUOTES, AUDIENCES, HOW_STEPS, FAQ
├── pdp/
│   ├── pdp.css                       # LAYOUT ONLY (gallery grid, sticky bar)
│   ├── PdpBuybox.tsx                 # server orchestrator
│   ├── PdpGallery.tsx                # 'use client'
│   ├── PdpBuyboxColumn.tsx
│   ├── PdpHeading.tsx
│   ├── PdpChecklist.tsx
│   ├── PdpPackSelector.tsx           # 'use client'
│   ├── PdpQtyStepper.tsx             # 'use client'
│   ├── PdpGoogleInput.tsx            # 'use client'
│   ├── PdpAddToCart.tsx              # 'use client'
│   ├── PdpCallout.tsx
│   ├── PdpStickyBar.tsx              # 'use client'
│   ├── PdpFaq.tsx
│   └── pdp-copy.ts                   # programming process steps, returns, FAQ (marketing copy)
├── cart/
│   ├── cart-drawer.css               # LAYOUT ONLY
│   ├── store.ts                      # already shipped
│   ├── types.ts                      # already shipped
│   ├── actions.ts                    # NEW — server actions (cartCreate, addLine, etc.)
│   ├── CartDrawer.tsx
│   ├── CartHeader.tsx
│   ├── CartFreeShipBand.tsx
│   ├── CartLine.tsx
│   ├── CartQty.tsx
│   ├── CartUpsell.tsx
│   ├── CartMilestones.tsx
│   ├── CartSummary.tsx
│   ├── CartCheckoutButton.tsx
│   ├── CartTrustStrip.tsx
│   ├── CartPaymentsStrip.tsx
│   └── CartEmpty.tsx
└── modals/
    ├── WaitlistModal.tsx
    └── VideoLightbox.tsx
lib/
├── shopify/
│   ├── index.ts                      # shopifyFetch<T>() wrapper
│   ├── queries.ts                    # PRODUCT_BY_HANDLE_QUERY, COLLECTION_QUERY, CART_QUERY
│   ├── mutations.ts                  # CART_CREATE_MUTATION, CART_LINES_ADD_MUTATION, etc.
│   └── types.ts                      # Storefront API TypeScript types
└── waitlist.ts                       # GHL webhook helper
public/                                # already migrated 3-A2
├── hero/
├── logo/
├── mascot/                           # 13 emotion PNGs
└── products/{cr80,l-sign,plate}/
```

### Pattern 1: Storefront API fetch wrapper

**What:** Single typed wrapper for all Shopify queries; Next.js cache tags drive revalidation.
**When to use:** Every product/collection/cart read or mutation in `lib/shopify/`.

```typescript
// lib/shopify/index.ts (sketch)
// Source: vercel/commerce pattern + Next.js docs
const SHOPIFY_GRAPHQL_ENDPOINT =
  `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2026-04/graphql.json`;

type ShopifyFetchInit = {
  query: string;
  variables?: Record<string, unknown>;
  tags?: string[];
  cache?: RequestCache;
};

export async function shopifyFetch<T>({
  query,
  variables,
  tags,
  cache = 'force-cache',
}: ShopifyFetchInit): Promise<{ data: T }> {
  const res = await fetch(SHOPIFY_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token':
        process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
    },
    body: JSON.stringify({ query, variables }),
    cache,
    next: tags ? { tags } : undefined,
  });
  if (!res.ok) throw new Error(`Shopify fetch ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json;
}

// Tag conventions:
//   'product'                    — invalidates all product reads
//   `product:${handle}`          — invalidates one product
//   'collection'                 — invalidates collection lists
//   `collection:${handle}`       — invalidates one collection
```

### Pattern 2: PDP server-component fetch

```typescript
// app/shmo-review/[handle]/page.tsx (sketch)
// Note: Next.js 15 — params is async, must be awaited
import { notFound } from 'next/navigation';
import { getProductByHandle } from '@/lib/shopify/queries';
import { PdpBuybox } from '@/components/pdp/PdpBuybox';

export default async function PdpPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) notFound();
  return <PdpBuybox product={product} />;
}
```

### Pattern 3: Cart mutation via Server Action

```typescript
// components/cart/actions.ts (sketch)
'use server';
import { cookies } from 'next/headers';
import { shopifyFetch } from '@/lib/shopify';
import { CART_CREATE_MUTATION, CART_LINES_ADD_MUTATION } from '@/lib/shopify/mutations';

export async function addLineToCart(merchandiseId: string, quantity: number) {
  const cookieStore = await cookies();
  let cartId = cookieStore.get('shm-cart-id')?.value;

  if (!cartId) {
    const { data } = await shopifyFetch<CartCreatePayload>({
      query: CART_CREATE_MUTATION,
      variables: { lines: [{ merchandiseId, quantity }] },
      cache: 'no-store',
    });
    cartId = data.cartCreate.cart.id;
    cookieStore.set('shm-cart-id', cartId, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 14, // 14 days
    });
    return data.cartCreate.cart;
  }

  const { data } = await shopifyFetch<CartLinesAddPayload>({
    query: CART_LINES_ADD_MUTATION,
    variables: { cartId, lines: [{ merchandiseId, quantity }] },
    cache: 'no-store',
  });
  return data.cartLinesAdd.cart;
}
```

[CITED: nextjs.org/docs/app/api-reference/functions/cookies] — `cookies()` returns a Promise in Next.js 15; must `await`.

### Pattern 4: Webhook revalidation handler with HMAC

```typescript
// app/api/revalidate/route.ts (sketch)
// Source: medium.com/@frankjinzhang/how-to-validate-shopify-webhook-hmac-in-nextjs
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import crypto from 'node:crypto';

export async function POST(req: NextRequest) {
  const rawBody = await req.text(); // raw body required for HMAC
  const hmacHeader = req.headers.get('x-shopify-hmac-sha256') ?? '';
  const topic = req.headers.get('x-shopify-topic') ?? '';

  const computed = crypto
    .createHmac('sha256', process.env.SHOPIFY_REVALIDATION_SECRET!)
    .update(rawBody, 'utf8')
    .digest('base64');

  if (
    !crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(hmacHeader))
  ) {
    return NextResponse.json({ error: 'invalid hmac' }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const handle: string | undefined = payload.handle;

  if (topic.startsWith('products/')) {
    revalidateTag('product');
    if (handle) revalidateTag(`product:${handle}`);
    revalidateTag('collection:shmo-review');
  }
  return NextResponse.json({ revalidated: true });
}
```

**Important:** Next.js 15 Route Handlers receive raw body via `req.text()` — no body-parser interference. Use `crypto.timingSafeEqual` to avoid timing attacks. [VERIFIED: shopify.dev/docs/apps/build/webhooks/subscribe/https on HMAC base64 + raw body requirement]

### Pattern 5: Server Action for waitlist

```typescript
// components/modals/WaitlistModal.tsx (form)
'use client';
import { submitWaitlist } from '@/lib/waitlist';
export function WaitlistModal({ product }: { product: 'biz' | 'link' | 'reputation' }) {
  return (
    <form action={submitWaitlist}>
      <input type="hidden" name="product" value={product} />
      {/* Honeypot — bots fill, humans don't see */}
      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        style={{ position: 'absolute', left: '-9999px' }}
      />
      <input type="email" name="email" required />
      <button type="submit" className="shm-btn shm-btn--primary">Notify me</button>
    </form>
  );
}

// lib/waitlist.ts
'use server';
export async function submitWaitlist(formData: FormData) {
  if (formData.get('company_website')) return { ok: true }; // bot trap
  const url = process.env.GHL_WAITLIST_WEBHOOK_URL;
  if (!url) return { ok: false, error: 'webhook-unconfigured' };
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: formData.get('email'),
      product: formData.get('product'),
      submitted_at: new Date().toISOString(),
    }),
  });
  return { ok: true };
}
```

### Pattern 6: framer-motion section reveal (matches design system motion tokens)

```typescript
// components/home/SubBrandSpotlight.tsx (motion shell)
'use client';
import { motion } from 'framer-motion';
const ease: [number, number, number, number] = [0.2, 0.8, 0.2, 1]; // matches --ease-standard

export function Reveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.22, ease }} // --motion-base
    >
      {children}
    </motion.div>
  );
}
```

[CITED: motion.dev/docs/react-use-in-view] — `viewport={{ once: true }}` is the standard scroll-trigger pattern.

### Anti-Patterns to Avoid

- **Any `bg-*`, `text-*` (color), `border-*`, `rounded-*`, `shadow-*`, `font-*`, `animate-*`, gradient class from Tailwind on a visual surface.** Use `.shm-*` or `var(--token)`.
- **Hardcoding product names/prices/SKUs/image paths in components.** Always Storefront API.
- **Custom `position: fixed; bottom: 0;` "sticky bar".** That's `.shm-buybox-sticky` and it slides DOWN from top on scroll. Read `Buybox.html`.
- **Building a custom drawer.** That's `.shm-cart-*` from `components.css`. Mount once in `layout.tsx`.
- **Restyling `.shm-btn` from `home.css` or `pdp.css`.** Variants live next to the primitive in `components.css`.
- **`'use client'` at the top of a section just because one button inside is interactive.** Push the boundary down — make the button the client component, keep the section server.
- **Synchronous `cookies()` / synchronous `params` access in Next.js 15.** Both are async; must `await`.
- **Rendering Shopify-supplied HTML without sanitization.** Default to plain-text `description`. Only render `descriptionHtml` after adding a vetted sanitizer (DOMPurify) — out of Phase 3 scope.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Cart state persistence | Custom localStorage hooks | Zustand `persist` middleware (already done) | Hydration mismatch traps, JSON shape versioning |
| Cart drawer slide-in | CSS `position: fixed` ad-hoc transitions | `.shm-cart` primitive + framer-motion shell | Drawer state machine, scrim, scroll lock all in design system |
| Sticky buybox | `position: sticky` from scratch | `.shm-buybox-sticky` + IntersectionObserver toggle | Slides DOWN from top on scroll; reference page handles edge cases |
| Section reveals | Manual IntersectionObserver | framer-motion `whileInView` | One-line trigger; respects reduced motion when configured |
| Webhook signature verification | String compare on HMAC | `crypto.timingSafeEqual` after base64 decode | Timing attack avoidance is non-negotiable |
| FAQ accordion | Custom open/close JS | `.shm-faq-list` + `[aria-expanded]` CSS rule | Already wired in `components.css`; needs only client toggle |
| Marquee scroll | RAF-driven JS | CSS keyframes (already in `components.css`) | Smoother, lower CPU |
| Mascot rendering | Inline `<img>` with size styles | `<Mascot size="..." />` (already shipped) | Locks the size budget (140 / 200) at the type level |
| GraphQL client | Apollo / urql / graphql-request | Native `fetch` + `next: { tags }` | 5 queries total; deps don't earn their weight |
| Form validation | zod / react-hook-form | Native `<form>` + `required` + Server Action | Single email field per modal |
| HTML sanitization | Custom string-replacement scrub | DOMPurify (only if Shopify HTML rendering becomes required) | XSS surface is non-trivial; never roll your own |

**Key insight:** This is a small marketing + 3-PDP + cart drawer site. The temptation is to over-engineer with batteries-included e-commerce libraries. The design system + Next.js 15 native APIs cover everything. Adding deps creates more rope than it saves.

## Runtime State Inventory

> N/A — Phase 3 is greenfield rebuild, not a rename/refactor. No existing runtime state to migrate. The Foundations stage already migrated `pictures/` → `public/` (3-A2).

## Common Pitfalls

### Pitfall 1: Pawn Leads brand-name leak

**What goes wrong:** A copy draft, alt text, image filename, or git commit message includes "Pawn Leads" / "PawnLeads" / "@pawnleads".
**Why it happens:** Real client data from Pawn Leads goes into the proof section; reflexive habit attributes the source.
**How to avoid:** Run `git grep -in 'pawn leads\|pawnleads' app/ components/ public/ context/general/marketing.md` before every Phase 3 commit. Add to a pre-commit hook if the manual grep slips. Never write the string in any file Phase 3 produces.
**Warning signs:** Any review-section copy that mentions an "agency", "ad partner", "the team behind…". Drop those phrases; use shop names directly.

### Pitfall 2: Tailwind drift via reflexive `bg-*` / `text-*`

**What goes wrong:** A new section uses `bg-orange-500` or `text-2xl font-extrabold` instead of `.shm-bg-ember` and `.shm-display`.
**Why it happens:** Tailwind muscle memory, pasting from frontend-design skill examples.
**How to avoid:** When writing JSX, every `className` value goes through a self-check: visual concern → must start with `shm-` or be a CSS variable. Layout-only utilities (`flex`, `grid`, `gap-*`, `p-*`) are allowed. Run `grep -rn 'className="[^"]*\b\(bg\|text\|border\|rounded\|shadow\|font\|animate\)-[a-z0-9]' app/ components/` before commits to surface violators (filter out `shm-` matches).
**Warning signs:** Section text-flips not rendering on dark backgrounds (the dark-section flips in `colors_and_type.css` only target `.shm-bg-*` ancestors).

### Pitfall 3: Server / Client component boundary leak

**What goes wrong:** `'use client'` ends up at the top of a section that has 90% server-renderable content because one nested button is interactive — bloats the JS bundle.
**Why it happens:** Easier to flip the directive than refactor.
**How to avoid:** Push `'use client'` to the smallest unit possible. Section components stay server; only the interactive leaf (button, gallery, qty stepper, sticky bar driver) is client. TRANSLATION.md provides the default split — deviations need stated reasons.
**Warning signs:** First-load JS in Vercel build report grows >100KB above baseline; sections that don't need motion are tagged `'use client'`.

### Pitfall 4: Webhook revalidation race

**What goes wrong:** Shopify fires the webhook a few hundred ms before the Storefront API GraphQL endpoint reflects the change. Revalidation reads stale data, caches it again, propagation appears to fail.
**Why it happens:** Shopify webhook eventing is faster than read-replica lag in some regions. [CITED: vercel/commerce issue #1239]
**How to avoid:** In the revalidate route, after `revalidateTag()`, optionally schedule a second `revalidateTag()` ~2-3 seconds later (e.g., via a delay queue). For v1 a single revalidation is acceptable since CONTEXT says ~5s is the target, not <500ms.
**Warning signs:** Editors report "I changed the price 10s ago and the site still shows the old price." Manual trigger of `revalidateTag` resolves it.

### Pitfall 5: HMAC verification fails on whitespace differences

**What goes wrong:** Reading the body via `req.json()` mangles whitespace; computed HMAC won't match.
**Why it happens:** Shopify signs the **exact bytes** of the request body.
**How to avoid:** Always read `await req.text()` (raw) for HMAC, then `JSON.parse(rawBody)` only after verification.
**Warning signs:** All webhooks return 401 even when `SHOPIFY_REVALIDATION_SECRET` matches.

### Pitfall 6: Cart cookie ↔ Zustand store divergence

**What goes wrong:** Zustand store persists `cartId` in `localStorage`, but Server Actions also set/read `shm-cart-id` cookie. The two can disagree (e.g., user clears localStorage, cookie remains; or vice versa on incognito).
**Why it happens:** Two persistence mechanisms for the same value.
**How to avoid:** Pick **one source of truth for `cartId`** — recommend the **httpOnly cookie set by Server Actions** since cart mutations are server-driven. Zustand persists only `lines` (display) + UI state (`isOpen`). The store's existing `cartId` and `checkoutUrl` fields can stay but should be hydrated from a server-side getter on first client mount, not authoritative.
**Warning signs:** Cart shows lines but checkout button has no URL; or the same user has two carts on Shopify because cartId got recreated.

### Pitfall 7: Mascot pose budget violations

**What goes wrong:** A page renders 3+ mascot stickers, or a non-spotlight mascot sized >140px.
**Why it happens:** Component reuse across sections doesn't track aggregate count.
**How to avoid:** Each page-level component (`page.tsx`) maintains a literal mascot inventory in a comment. The 200px hero variant only appears on the four sub-brand spotlights of the homepage (showcase exception explicitly granted by `.claude/rules/design-system.md`).
**Warning signs:** Visual review feels "busy"; mascot sizes inconsistent.

### Pitfall 8: Hero `<em>` type-cycle layout shift

**What goes wrong:** "missing" (7 chars) and "asking for" (10 chars) render at different widths; headline reflows on cycle.
**Why it happens:** Default `display: inline` for `<em>`.
**How to avoid:** Reserve width: wrap the `<em>` in an inline-block span with `min-width` set to the longer alternative, OR render both words stacked with `position: absolute` and crossfade. Lock to longest in dev — measure "asking for" rendered width, hardcode `min-width` on the wrapper.
**Warning signs:** Sentence "jumps" every 2.5s; baseline misaligns; cumulative layout shift in Lighthouse.

### Pitfall 9: Rendering raw Shopify HTML

**What goes wrong:** `descriptionHtml` rendered into the page without sanitization → XSS surface.
**Why it happens:** Tempting because it preserves rich formatting from Shopify Admin.
**How to avoid:** Render `description` (plain text) by default. If rich formatting becomes required, add DOMPurify and sanitize before injection — that's a future scope decision, not Phase 3.
**Warning signs:** Any code that uses raw HTML injection on a Shopify field.

## Code Examples

### `lib/shopify/queries.ts` — product by handle

```typescript
// Source: shopify.dev/docs/api/storefront/latest
export const PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      availableForSale
      priceRange {
        minVariantPrice { amount currencyCode }
        maxVariantPrice { amount currencyCode }
      }
      images(first: 10) {
        nodes { url altText width height }
      }
      options { id name values }
      variants(first: 25) {
        nodes {
          id
          title
          availableForSale
          price { amount currencyCode }
          selectedOptions { name value }
        }
      }
      featuredImage { url altText width height }
    }
  }
`;

export async function getProductByHandle(handle: string) {
  const { data } = await shopifyFetch<{ product: ShopifyProduct | null }>({
    query: PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
    tags: ['product', `product:${handle}`],
  });
  return data.product;
}
```

### `lib/shopify/mutations.ts` — cartCreate + cartLinesAdd

```typescript
// Source: shopify.dev/docs/api/storefront/latest/mutations/cartLinesAdd
const CART_FIELDS = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 50) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price { amount currencyCode }
            image { url altText }
            product { handle title }
          }
        }
      }
    }
  }
`;

export const CART_CREATE_MUTATION = /* GraphQL */ `
  ${CART_FIELDS}
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_ADD_MUTATION = /* GraphQL */ `
  ${CART_FIELDS}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;
// Symmetric for CART_LINES_UPDATE_MUTATION (cartLinesUpdate) and CART_LINES_REMOVE_MUTATION (cartLinesRemove)
```

### `app/api/revalidate/route.ts` — webhook handler

See Pattern 4 above.

### Mascot inventory (per-page comment)

```tsx
// app/page.tsx — Mascot inventory (within design system budget; homepage showcase scope)
//   Spotlight: Review     → mascot/holding-card.png   (hero, 200px, showcase exception)
//   Spotlight: Biz        → mascot/holding-card.png   (hero, 200px, showcase exception)
//   Spotlight: Link       → mascot/heart-hands.png    (hero, 200px, showcase exception)
//   Spotlight: Reputation → mascot/megaphone.png      (hero, 200px, showcase exception, fitRatio 1.3)
// HomeFaq sticker: 1 (sm)
// Reference: Shmocard Homepage.html
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `getServerSideProps` / `getStaticProps` for data | Server Components + `fetch` with `next: { tags }` | Next.js 13+ | One unified data-fetch story; cache invalidation via tags |
| `import { motion } from 'framer-motion'` | `import { motion } from 'motion/react'` (rename) | mid-2025 | Both still work in `framer-motion@12`. Sticking with `framer-motion` is fine for v1; migrate later. |
| Sync `cookies()`, sync `params` | Async `cookies()`, async `params` | Next.js 15 | Must `await` both in Server Components and Route Handlers. |
| Pages Router API routes | Route Handlers (`app/api/.../route.ts`) | Next.js 13+ | `req: NextRequest`, return `NextResponse` |
| `revalidatePath` only | `revalidateTag` + `revalidatePath` both available | Next.js 13+ | Tag-based is more granular for product handles |
| Shopify Storefront API 2024-X | Storefront API 2026-04 | quarterly | Use `/api/2026-04/graphql.json` endpoint |

**Deprecated/outdated:**
- Pages Router for new code (use App Router)
- `_app.tsx` / `_document.tsx` (use `app/layout.tsx`)
- `next/head` (use `metadata` export)

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `framer-motion@^12.0.0` works with React 19 without migration to `motion/react` import path | Standard Stack | LOW — if breaks, rename imports across ~6 files |
| A2 | Storefront API version `2026-04` is the appropriate stable for 2026-05-07 build | Code Examples | LOW — versions are quarterly; bump to `2026-04` or whatever is current at build time. Verify via `https://shopify.dev/docs/api/storefront/latest` |
| A3 | One revalidation pass is sufficient for ~5s propagation target (no read-replica delay strategy) | Common Pitfall 4 | MEDIUM — if Jordan reports stale data after edits, add a delayed second revalidation or accept the delay |
| A4 | `httpOnly` cookie for `shm-cart-id` is the right source of truth (vs Zustand `cartId`) | Common Pitfall 6 | LOW — implementation detail; both can coexist if sync function is reliable. Recommend cookie because Server Actions need it server-side anyway. |
| A5 | Mascot pose budget — 4 spotlight mascots count as "showcase exception", not a violation, since the homepage explicitly opts in | Common Pitfall 7 | LOW — `.claude/rules/design-system.md` explicitly grants this exception |
| A6 | Honeypot field + simple rate-limit (e.g., 3/min/IP via Vercel KV later) is sufficient spam protection for waitlist | Pattern 5 | LOW — REQ-08 says "at minimum honeypot or simple rate limit"; honeypot alone qualifies, rate limit can come Phase 4 |
| A7 | GHL webhook accepts standard JSON `POST` with `email` + `product` + `submitted_at` | Pattern 5 | HIGH — DEFERRED until Jordan provides URL + schema. Plan 03-10 must confirm with a real GHL sandbox before considering done. |
| A8 | Product handles in `backend.md` (`google-reviews-nfc-tap-card-cr80`, etc.) are still the live values | Phase Requirements | LOW — verify by hitting Storefront API in dev mode early in plan 03-12 |

## Open Questions

1. **GHL webhook URL + schema (DEFERRED — D-04)**
   - What we know: env var `GHL_WAITLIST_WEBHOOK_URL` in `.env.local`. Server Action posts FormData/JSON.
   - What's unclear: exact JSON shape GHL expects; field names; auth header requirements.
   - Recommendation: Plan 03-10 blocks until Jordan provides URL. Stub the action so the rest of Phase 3 ships independently. Treat the GHL request shape as `{ email, product, submitted_at }` as a default; Jordan adjusts when wiring.

2. **Cart reconciliation on page reload**
   - What we know: Zustand persists `lines`, `cartId`, `checkoutUrl` in localStorage. httpOnly cookie also stores `cartId`.
   - What's unclear: on first client mount, do we re-fetch cart from Shopify (truth) or trust localStorage display?
   - Recommendation: On `CartDrawer` mount, dispatch a `getCart(cartId)` query if `cartId` exists; reconcile lines into the store. Cheap query, prevents drift if Shopify expired or modified the cart server-side (e.g., a line went out of stock).

3. **Webhook delivery URL for Shopify Admin**
   - What we know: route is `app/api/revalidate/route.ts` → `https://shmocard.com/api/revalidate`.
   - What's unclear: Jordan needs to register the webhook in Shopify Admin → Settings → Notifications → Webhooks. Admin API writes are forbidden, so this is a manual one-time admin action.
   - Recommendation: Plan 03-11 includes a Jordan-facing checklist for manual webhook registration. Topics: `products/create`, `products/update`, `products/delete`. Format: JSON. Secret: `SHOPIFY_REVALIDATION_SECRET` value.

4. **Final pricing tiers / SKU naming**
   - Jordan's responsibility in Shopify Admin during Phase 3. Not a code-side decision. Site renders whatever Shopify returns.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | dev / build | ✓ (assumed — Next.js 15 needs ≥18.18) | — | — |
| `next` | runtime | ✓ | 15.1.6 | — |
| `react` / `react-dom` | runtime | ✓ | 19.0.0 | — |
| `zustand` | cart store | ✓ | 5.0.3 | — |
| `framer-motion` | section/drawer motion | ✓ | 12.0.0 | — |
| `tailwindcss` + `@tailwindcss/postcss` | utilities | ✓ | 4 | — |
| Shopify Storefront API | product/cart data | ✓ (live store at `shop.shmocard.com`) | 2026-04 | None — REQ-06 blocks without it |
| `SHOPIFY_STORE_DOMAIN` env | runtime | ✗ — needs `.env.local` write | — | None — REQ-06 blocks |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` env | runtime | ✗ — Jordan provisions via Headless sales channel | — | None — REQ-06 blocks |
| `SHOPIFY_REVALIDATION_SECRET` env | webhook | ✗ — generate at plan 03-11 | — | None — REQ-07 blocks |
| `GHL_WAITLIST_WEBHOOK_URL` env | waitlist | ✗ — DEFERRED | — | Stub Server Action returns `{ ok: false, error: 'webhook-unconfigured' }` until URL provided |
| Vercel deploy | hosting | — (Phase 4) | — | — |
| Crew photos | homepage CrewStrip | ✗ | — | `<Placeholder />` rectangles in muted gray (REQ-01 still satisfied) |
| Video testimonial assets | homepage VideoTestimonials | ✗ | — | `<Placeholder />` 4:5 tiles with flat ember/cocoa/honey backgrounds |

**Missing dependencies that block execution:**
- Shopify Storefront API env vars (`SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`) — Jordan must provision via Shopify Admin → Apps → Headless sales channel. Plan 03-12 (Storefront queries finalized) cannot run without these.
- `SHOPIFY_REVALIDATION_SECRET` — generated server-side; Jordan stores it both in `.env.local` and in Shopify Admin webhook settings. Plan 03-11.

**Missing dependencies with viable fallback:**
- GHL webhook URL → stub action (Plan 03-10 finishes when URL lands).
- Crew photos / video assets → `<Placeholder />` until real assets ready.

## Validation Architecture

> Phase 3 is greenfield UI + Storefront integration. CONTEXT.md Claude's Discretion explicitly **defers tests to Phase 4**. The verification standard is **browser proof per `.claude/rules/verification.md`** — every plan ends with a dev server screenshot saved to `pictures/screenshots/`.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None for Phase 3 (per CONTEXT discretion). Phase 4 may add. |
| Config file | None |
| Quick run command | `npm run dev` then manual browser verification |
| Full suite command | `npm run build && npm start` (build correctness) + browser pass |
| Phase gate | `npm run build` green + screenshots saved + `git grep` Pawn Leads check returns 0 |

### Phase Requirements → Verification Map

| Req ID | Behavior | Verification Type | Command / Method |
|--------|----------|-------------------|------------------|
| REQ-01 | Homepage renders all sections, locked headline cycle works | manual browser + screenshot | `npm run dev` → `/` → screenshot to `pictures/screenshots/03-homepage-*.png` |
| REQ-02 | `/shmo-review` renders with bulk math + locked headline + tagline | manual browser + screenshot | `npm run dev` → `/shmo-review` → screenshot |
| REQ-03 | CR-80 PDP fetches real product data from Shopify | manual browser + screenshot + DevTools network | `npm run dev` → `/shmo-review/cr-80` → check Network tab for Storefront fetch |
| REQ-04 | L-Sign PDP same | manual browser | `/shmo-review/l-sign` |
| REQ-05 | Square Card PDP same | manual browser | `/shmo-review/square-card` |
| REQ-06 | Storefront API works; cart mutations succeed; checkout redirects | manual cart flow + Shopify checkout URL load | Add to cart → open drawer → Checkout → confirm `shopify.com/...` URL |
| REQ-07 | Webhook revalidation route returns 200 on valid HMAC, 401 on invalid | curl with valid + invalid HMAC | `curl -X POST http://localhost:3000/api/revalidate -H "x-shopify-hmac-sha256: $hmac" --data-raw '...'` |
| REQ-08 | Waitlist form submits → GHL webhook receives | DevTools network + GHL inbox check | Submit modal → Network tab → confirm 200 to GHL URL |
| REQ-09 | Design system invariants hold (no `bg-*`, no Pawn Leads, no hex) | `git grep` checks | `grep -rn 'className="[^"]*\b\(bg\|text\|border\|rounded\|shadow\|font\|animate\)-' app/ components/` (filter `shm-`) + `git grep -in 'pawn leads\|pawnleads' .` |

### Sampling Rate

- **Per task commit:** browser screenshot + `npm run build` green + grep checks zero
- **Per stage merge:** full homepage walkthrough + cart flow + webhook curl
- **Phase gate:** all 9 REQs verified end-to-end in Vercel preview

### Wave 0 Gaps

- [ ] Test infrastructure: NOT REQUIRED for Phase 3 (deferred per CONTEXT)
- [ ] Pre-commit grep hook for "Pawn Leads" — recommend adding via `.claude/hooks/`
- [ ] Pre-commit grep hook for non-`shm-` `bg-*`/`text-*-color` violations — recommend
- [ ] `pictures/screenshots/` directory must exist (verify before any plan runs)

## Security Domain

> Phase 3 surface area: public marketing pages + cart + webhook receiver + waitlist form. ASVS scoping focused on V5 (input validation), V6 (cryptography for HMAC), V14 (config) since there's no V2/V3/V4 (no auth — Shopify hosts it).

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | NO (no user accounts on site) | n/a — Shopify hosts checkout auth |
| V3 Session Management | LIMITED | httpOnly + Secure + SameSite=Lax cookie for `shm-cart-id`; 14-day max-age |
| V4 Access Control | NO | All API routes either public (cart actions, scoped to caller's cookie) or HMAC-gated (revalidate) |
| V5 Input Validation | YES | Email validation in waitlist form; coerce all Shopify response fields to expected TypeScript types; trust no client input on revalidate route |
| V6 Cryptography | YES | `crypto.createHmac('sha256', secret)` + `timingSafeEqual` for webhook verification |
| V14 Config | YES | Env vars never in code; `.env*` is gitignored; Vercel mirrors at deploy |

### Known Threat Patterns for Next.js + Shopify Headless

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Forged webhook (attacker replays) | Spoofing | HMAC SHA-256 verification with `timingSafeEqual` (Pattern 4) |
| Storefront token leak | Information disclosure | Token is "public" by design (read-only, rate-limited by Shopify), but never log it; never return it in client responses |
| Admin API misuse | Tampering | Hard rule: zero Admin API usage. CI grep can enforce: `grep -rn 'admin\.shopifyapis\.com\|/admin/api/' app/ components/ lib/` must return 0 |
| Cart cookie theft | Spoofing / Tampering | `httpOnly` (no JS access) + `Secure` (HTTPS only) + `SameSite=Lax` (no CSRF cart-add from third-party site) |
| Waitlist form spam | Denial of service | Honeypot hidden input + (later) rate limit by IP via Vercel KV; minimum is honeypot |
| XSS via Shopify-supplied product description HTML | Tampering | Render plain-text `description`; do NOT inject raw HTML. If rich formatting becomes required later, sanitize through DOMPurify first — out of Phase 3 scope. |
| Open redirect via `cart.checkoutUrl` | Tampering | The URL comes from Shopify's response — pin to `*.myshopify.com` / configured store domain on the client before navigating. |

### Phase 3 security checklist (per plan)

- [ ] Every Server Action that takes `FormData` validates required fields and bails on extras.
- [ ] HMAC route uses `crypto.timingSafeEqual` (not `===`).
- [ ] `cart-id` cookie set with `httpOnly: true, secure: true, sameSite: 'lax'`.
- [ ] No `console.log` of env-var values, even in dev.
- [ ] No raw HTML injection from any Shopify-supplied field. If a future plan needs it, add DOMPurify and sanitize first.
- [ ] No Admin API import / fetch anywhere. CI grep enforces.
- [ ] Pre-deploy grep: `git grep -in 'pawn leads\|pawnleads\|@pawnleads' .` returns 0.

## Sources

### Primary (HIGH confidence)

- `package.json` — version lock for Next.js / React / Tailwind / Zustand / framer-motion [VERIFIED in repo]
- `.planning/phases/02-design-system-review/INTEGRATION.md` — Tailwind 4 ↔ `.shm-*` coexistence, `app/globals.css` skeleton (already shipped) [VERIFIED in repo]
- `.planning/phases/02-design-system-review/TRANSLATION.md` — section-by-section component map; ~54 file count; server/client default split [VERIFIED in repo]
- `.planning/phases/02-design-system-review/DECISIONS.md` — D-01..D-05 locked decisions [VERIFIED in repo]
- `context/general/backend.md` — Shopify integration, env vars, webhook revalidation [VERIFIED in repo]
- `.claude/skills/shmocard-design-system/SKILL.md` + `components.css` + `colors_and_type.css` — primitive source of truth [VERIFIED in repo]
- `.claude/skills/shmocard-design-system/ui_kits/website/homepage/Shmocard Homepage.html` + `home.css` + `home-data.jsx` — canonical homepage layout [VERIFIED in repo]
- `.claude/skills/shmocard-design-system/ui_kits/website/Buybox.html` — canonical PDP [VERIFIED in repo]
- `.claude/skills/shmocard-design-system/ui_kits/website/Cart Drawer.html` — canonical cart drawer [VERIFIED in repo]
- [Shopify Storefront API reference](https://shopify.dev/docs/api/storefront/latest) — Cart, cartCreate, cartLinesAdd, cartLinesUpdate, cartLinesRemove [CITED]
- [Next.js revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag) [CITED]
- [Next.js cookies()](https://nextjs.org/docs/app/api-reference/functions/cookies) — async in Next.js 15 [CITED]
- [Shopify Webhooks (HTTPS delivery + HMAC)](https://shopify.dev/docs/apps/build/webhooks/subscribe/https) [CITED]

### Secondary (MEDIUM confidence)

- [Vercel KB: Building Ecommerce Sites with Next.js and Shopify](https://vercel.com/kb/guide/building-ecommerce-sites-with-next-js-and-shopify) — pattern reference
- [vercel/commerce repo](https://github.com/vercel/commerce) — `lib/shopify/` pattern, cart cookie pattern
- [Vercel Commerce 2.0 announcement](https://vercel.com/blog/introducing-next-js-commerce-2-0) — App Router / Server Components / RSC
- [Motion (framer-motion 12) — Get Started](https://motion.dev/docs/react) — React 19 compatibility
- [Motion useInView](https://motion.dev/docs/react-use-in-view) — viewport scroll-trigger pattern
- [Building a Modern E-commerce System: Next.js 15+ Shopify (Medium)](https://medium.com/@d_pt_m/building-a-modern-e-commerce-system-next-js-15-shopify-go-high-level-architecture-c1f122c8358e) — architecture overview
- [How to validate Shopify Webhook hmac in NextJS (Medium)](https://medium.com/@frankjinzhang/how-to-validate-shopify-webhook-hmac-in-nextjs-751fbfac10a3) — HMAC pattern
- [vercel/commerce issue #1239](https://github.com/vercel/commerce/issues/1239) — webhook timing race awareness

### Tertiary (LOW confidence — flagged)

- GHL webhook schema — DEFERRED per D-04. No public canonical doc consulted; final shape comes from Jordan when URL is provisioned.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — every dep verified in `package.json`; Foundations stage already shipped.
- Architecture: HIGH — TRANSLATION.md provides explicit section→file map; INTEGRATION.md locks the CSS strategy already in place.
- Pitfalls: HIGH on items 1-3 (verified via repo + design system rules); MEDIUM on items 4-6 (webhook timing, cookie/store sync) since they depend on Shopify behavior in production.
- Storefront API patterns: HIGH on shape of queries/mutations (official docs); MEDIUM on exact API version `2026-04` (verify at build time).
- GHL waitlist: LOW — deferred upstream.

**Research date:** 2026-05-07
**Valid until:** 2026-06-07 (30 days; Storefront API minor updates quarterly, Next.js minor patches don't change App Router shape).
