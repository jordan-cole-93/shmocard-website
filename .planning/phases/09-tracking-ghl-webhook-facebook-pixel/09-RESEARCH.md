# Phase 9: Tracking — GHL webhook + Facebook Pixel — Research

**Researched:** 2026-05-21
**Domain:** Marketing analytics — Meta Pixel browser tag + Conversions API server-side mirror, dual-fire dedup, Next.js 15 App Router script-loading patterns
**Confidence:** HIGH

## Summary

Phase 9 wires Meta's Pixel (browser) + Conversions API (server) for 3 funnel events on shmocard.com — **ViewContent, AddToCart, InitiateCheckout** — with shared `event_id` per fire so Meta dedupes browser + server within its 48-hour window. **Purchase is owned by Shopify's Facebook & Instagram channel app** on shop.shmocard.com (D-04), so our code never fires it. **GHL order sync is configured directly in Shopify Admin → Notifications → Webhooks** (D-05) — zero site code, no `/api/ghl-*` route.

Three new env vars land in `backend.md` first: `NEXT_PUBLIC_FB_PIXEL_ID`, `FB_CAPI_ACCESS_TOKEN`, `FB_TEST_EVENT_CODE`. The stack is `lib/analytics/{meta-capi,hash}.ts` for server fires (mirrors `lib/shopify/index.ts`), `lib/analytics/fbq.ts` + ambient `global.d.ts` for the browser fbq typing, and `components/analytics/PixelLoader.tsx` mounted in root layout with `next/script strategy="afterInteractive"`.

**Primary recommendation:** Build types + hash helper + `metaFetch` Server Action first (same BLOCKER-fix order as Phase 8). Then `<PixelLoader>` in root layout. Then wire the 3 client call-sites (PDP `<ViewContentTracker>` client component, `Buybox.handleAdd`, `CartCheckoutButton.handleClick`). Each call-site generates a UUIDv4, fires `fbq('track', name, params, { eventID })` and a parallel `trackMetaEvent(...)` Server Action with the same id. Verify all 3 events show `Server + Browser` in Events Manager Test Events tab before declaring done.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|---|---|---|---|
| Meta Pixel base init (fbq stub, fbevents.js load, PageView) | Browser (client component) | — | `next/script` injects into `<body>`; fbq must exist before any event fire |
| Browser Pixel event fires (`fbq('track', ...)`) | Browser (client) | — | Triggered from user-facing actions (PDP view, ATC click, checkout click); requires `window.fbq` |
| Conversions API event POST | Server (Server Action) | — | `FB_CAPI_ACCESS_TOKEN` is server-only; never inline in browser |
| event_id UUIDv4 generation | Browser (client) | — | Generated where the event originates so both fires share the same id deterministically (no client→server roundtrip race) |
| fbp / fbc cookie read | Browser (client) → forwarded to Server Action | Server | Cookies are non-httpOnly (set by fbevents.js); browser reads via `document.cookie`, passes string to Server Action |
| client_ip_address + client_user_agent for CAPI | Server (Server Action via headers) | — | Server reads `request.headers` — never trust client-supplied IP/UA |
| Event Match Quality (hashed em, ph) | Server (Server Action) | — | We have no email/phone on the site (pre-checkout); send empty user_data with IP+UA+fbp+fbc only |
| GHL order sync | Shopify Admin (external) | — | D-05: Shopify webhook → GHL endpoint directly. Zero site code. |
| Purchase event | Shopify Admin (Facebook channel app, external) | — | D-04: shop.shmocard.com fires Pixel + CAPI for Purchase. Our domain never sees it. |

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---|---|---|---|
| `next/script` | bundled with Next.js 15.1.6 | Pixel script tag with `afterInteractive` strategy | First-party Next.js primitive — handles client-side injection + hydration correctly. No external dep. [VERIFIED: nextjs.org/docs/app/api-reference/components/script] |
| `node:crypto` | bundled (Node 22) | SHA-256 hashing for PII; UUIDv4 for event_id | Already used in `app/api/revalidate/route.ts`. No npm dep. SHA-256 of `john_smith@gmail.com` matches Meta's expected `62a14e44...` exactly. [VERIFIED: ran in Node 22.18.0 against Meta docs example] |
| `crypto.randomUUID()` | bundled (Node 22 + modern browsers) | event_id generation | Available globally on both sides — server (`node:crypto` or global `crypto`) and browser (Web Crypto). No npm dep. [VERIFIED: ran `crypto.randomUUID()` on Node 22.18.0 — returns valid UUIDv4] |

### Supporting

| Library | Version | Purpose | When to Use |
|---|---|---|---|
| `fbevents.js` | hosted at `connect.facebook.net/en_US/fbevents.js` | Meta Pixel JS runtime | Loaded by the standard fbq init snippet via `next/script`. Not a npm dep. |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|---|---|---|
| Manual fbq + node:crypto | `react-facebook-pixel` (npm) | Adds 30kb deps for a 10-line snippet. Doesn't typed-stub `window.fbq` for us. Doesn't help with CAPI. Skip. |
| Manual CAPI POST | `facebook-nodejs-business-sdk` | 200kb+ runtime, lots of unused surface, opaque retry logic. The CAPI endpoint is a single POST — we own the wire format and error handling. Skip. |
| `uuid` npm package | `crypto.randomUUID()` | Native is faster, zero deps, available everywhere we need. Skip the package. |

**Installation:** Phase 9 adds **zero npm dependencies**. Everything is built-in.

**Version verification:**
- `next/script` ships with `next@15.1.6` (current in `package.json`). [VERIFIED: cat package.json]
- Graph API current version is **v25.0** introduced 2026-02-18. v23.0 (2025-05-29) and v24.0 (2025-10-08) remain supported. Use **v25.0** as the version path. [VERIFIED: developers.facebook.com/docs/graph-api/changelog]
- Meta Pixel JS endpoint `connect.facebook.net/en_US/fbevents.js` is the canonical CDN (unchanged for years). [CITED: developers.facebook.com/docs/meta-pixel/get-started]

## Architecture Patterns

### System Architecture Diagram

```
                              ┌─────────────────────────────────────────┐
                              │  shop.shmocard.com (Shopify Hosted)     │
                              │  ─────────────────────────────────────  │
                              │  Facebook & Instagram channel app fires │
                              │  • Purchase (Pixel + CAPI)              │
                              │  • InitiateCheckout (checkout page)     │
                              │                                         │
   ┌─────────── checkout ────▶│  (Jordan configures in Shopify Admin    │
   │  redirect                │   → Customer events → "Maximum")        │
   │                          └─────────────────────────────────────────┘
   │                                            │
   │                                            │  Order Created webhook
   │                                            ▼
   │                          ┌─────────────────────────────────────────┐
   │                          │  Shopify Admin → Webhooks → POST direct │
   │                          │  to GoHighLevel endpoint                │
   │                          │  (D-05: zero site code)                 │
   │                          └─────────────────────────────────────────┘
   │
   │
   │  ┌──────────────────────────────────────────────────────────────┐
   │  │  shmocard.com (Next.js — this codebase)                      │
   │  │  ──────────────────────────────────────────────────────────  │
   │  │                                                              │
   │  │  app/layout.tsx                                              │
   │  │  └── <PixelLoader> (next/script afterInteractive)            │
   │  │       Loads fbevents.js, runs `fbq('init', ID)` + PageView   │
   │  │                                                              │
   │  │  app/shmo-review/[handle]/page.tsx (server component)        │
   │  │  └── <ViewContentTracker product={...} />  (client child)    │
   │  │       useEffect: generate eventId, dual-fire ViewContent     │
   │  │       ├── fbq('track', 'ViewContent', params, { eventID })   │
   │  │       └── trackMetaEvent({ eventName, params, eventId })     │
   │  │                                                              │
   │  │  components/shmo-review/Buybox.tsx :: handleAdd              │
   │  │  └── after addLineToCart success:                            │
   │  │       generate eventId, dual-fire AddToCart                  │
   │  │       ├── fbq('track', 'AddToCart', params, { eventID })     │
   │  │       └── trackMetaEvent({ eventName, params, eventId })     │
   │  │                                                              │
   │  │  components/cart/CartCheckoutButton.tsx :: handleClick       │
   │  │  └── before window.location.href = safeUrl:                  │
   │  │       generate eventId, dual-fire InitiateCheckout           │
   │  │       ├── fbq('track', 'InitiateCheckout', params, {eventID})│
   │  │       └── trackMetaEvent({ eventName, params, eventId })     │
   │  │           (await before redirect — beacon-safe)              │
   │  └──────────────────────────────────────────────────────────────┘
   │                                            │
   │                                            │  HTTPS POST
   │                                            ▼
   │                          ┌─────────────────────────────────────────┐
   │                          │  graph.facebook.com/v25.0/{PIXEL_ID}/   │
   │                          │  events?access_token={FB_CAPI_TOKEN}    │
   │                          │                                         │
   │                          │  test_event_code present in dev only    │
   │                          │  → events land in Test Events tab       │
   │                          │  test_event_code absent in prod         │
   │                          │  → events land in production stream     │
   │                          └─────────────────────────────────────────┘
   │
   ▼
[fbevents.js running in browser — fires Pixel HTTP beacons to www.facebook.com/tr]
```

**Component Responsibilities:**

| File | Responsibility |
|---|---|
| `components/analytics/PixelLoader.tsx` | Client component. `next/script` `afterInteractive` injects fbq base snippet. Reads `NEXT_PUBLIC_FB_PIXEL_ID`. Fires initial `fbq('track', 'PageView')`. Mounted in `app/layout.tsx`. |
| `components/analytics/ViewContentTracker.tsx` | Client child component. Receives `product` props from PDP server component. `useEffect` on mount: generate eventId, dual-fire ViewContent. |
| `lib/analytics/types.ts` | `MetaEventName`, `MetaEventParams`, `MetaUserData`, `MetaCustomData` types. |
| `lib/analytics/hash.ts` | `sha256Lower(value: string): string` (lowercase + trim + sha256). Used only for email/phone if/when we collect them — Phase 9 has none. Defined for future use + documentation. |
| `lib/analytics/fbq.ts` | Client-only helper. Typed `trackPixelEvent(name, params, eventId)` wraps `window.fbq('track', name, params, { eventID })`. Guards against fbq undefined (script not loaded yet). |
| `lib/analytics/meta-capi.ts` | Server-only. `metaFetch(payload)` mirrors `shopifyFetch` — single POST to Graph API, never logs token, generic errors. |
| `components/analytics/actions.ts` | `"use server"` Server Actions: `trackViewContent`, `trackAddToCart`, `trackInitiateCheckout`. Each reads IP + UA from `headers()`, builds CAPI payload, calls `metaFetch`. |
| `app/global.d.ts` | Ambient `Window.fbq` declaration + `_fbq` queue type. |

### Recommended Project Structure

```
lib/
├── shopify/              (existing — mirrors this layout)
└── analytics/            (NEW)
    ├── types.ts          (MetaEventName, MetaEventParams, MetaUserData)
    ├── hash.ts           (sha256Lower for future PII)
    ├── meta-capi.ts      (server-only metaFetch helper)
    └── fbq.ts            (client-only typed wrapper around window.fbq)

components/
├── cart/                 (existing — calls trackAddToCart from handleAdd)
└── analytics/            (NEW)
    ├── PixelLoader.tsx           (mounts fbq base via next/script)
    ├── ViewContentTracker.tsx    (PDP child — fires ViewContent on mount)
    └── actions.ts                ("use server" — trackViewContent etc.)

app/
├── layout.tsx            (mount <PixelLoader />)
├── global.d.ts           (NEW — window.fbq ambient type)
└── shmo-review/
    ├── cr-80/page.tsx    (mount <ViewContentTracker product={...} />)
    ├── l-sign/page.tsx   (same)
    └── square-card/page.tsx (same)
```

### Pattern 1: Pixel base loader via next/script afterInteractive

**What:** Mount a `<PixelLoader>` client component in `app/layout.tsx` that uses `next/script` with `strategy="afterInteractive"` (the default) to inject the standard fbq init snippet. `afterInteractive` loads early but after hydration starts — appropriate for analytics (matches Next.js docs explicit recommendation for tag managers/analytics).

**When to use:** Once, in the root layout. Mounting in pages would re-init on every navigation.

**Why `afterInteractive` not `lazyOnload`:** `lazyOnload` defers until browser idle — misses early bounces (visitor closes tab before idle = no PageView fire). Tracking accuracy beats marginal CWV gain. `beforeInteractive` is wrong because it must live in Document (pages router pattern) and would block first paint.

**Why not `beforeInteractive`:** App Router pattern is `afterInteractive`. `beforeInteractive` is reserved for bot detectors / consent managers per Next.js docs. Pixel is not blocking; analytics is the canonical `afterInteractive` use case.

**Example:**
```tsx
// components/analytics/PixelLoader.tsx
// Source: https://nextjs.org/docs/app/api-reference/components/script
//         + https://developers.facebook.com/docs/meta-pixel/get-started

"use client";

import Script from "next/script";

export default function PixelLoader() {
  const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  if (!pixelId) return null; // graceful degradation in dev w/o pixel set

  return (
    <Script id="meta-pixel-base" strategy="afterInteractive">
      {`
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
        document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${pixelId}');
        fbq('track', 'PageView');
      `}
    </Script>
  );
}
```

Mount in `app/layout.tsx` just below `<CartDrawer />`:
```tsx
<CartDrawer />
<ModalRoot />
<PixelLoader />
```

[CITED: developers.facebook.com/docs/meta-pixel/get-started for the base snippet; verified against Context7 fetch of the official ads-commerce docs which shows the identical snippet.]

### Pattern 2: Dual-fire from a client call site

**What:** Each event fires from two places with the same `event_id`:
1. Browser: `fbq('track', name, params, { eventID })`
2. Server: Server Action `trackXxx({ params, eventId })` → `metaFetch` POST

**Why same `event_id`:** Meta dedupes server + browser events when both `event_id` AND `event_name` match within a **48-hour window** for the same Pixel ID. [VERIFIED: developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events]

**Why client generates:** The browser fires synchronously and immediately. If server generated and returned the id, we'd race against navigation (especially for InitiateCheckout, which precedes a redirect). Client generates → client fires Pixel with `eventID` → client fires Server Action with the same `eventId` → both arrive at Meta with matching identity.

**Example:**
```tsx
// components/shmo-review/Buybox.tsx :: handleAdd (additions inside try block)
import { trackPixelEvent } from "@/lib/analytics/fbq";
import { trackAddToCart } from "@/components/analytics/actions";

async function handleAdd() {
  // ... existing variantId validation ...
  setAdding(true);
  setAddError(null);
  try {
    const cart = await addLineToCart(variantId, qty);
    const lines = mapShopifyCartLines(cart);
    useCartStore.getState().setCart(cart.id, cart.checkoutUrl, lines);

    // --- BEGIN PHASE 9 INSTRUMENTATION ---
    const eventId = crypto.randomUUID();
    const contentId = variantId; // Shopify variant GID — sent to Meta as content_id
    const valueNum = Number((pack.price * qty).toFixed(2));
    const params = {
      content_ids: [contentId],
      content_type: "product" as const,
      contents: [{ id: contentId, quantity: qty }],
      value: valueNum,
      currency: "USD" as const,
    };
    // Browser fire — fire-and-forget; do not block UI.
    trackPixelEvent("AddToCart", params, eventId);
    // Server fire — fire-and-forget; do not block UI on Meta network latency.
    trackAddToCart({ params, eventId }).catch(() => {
      /* generic: never surface CAPI errors to user */
    });
    // --- END PHASE 9 INSTRUMENTATION ---

    openCart();
  } catch (err) {
    setAddError("Couldn't add to cart. Please try again.");
    console.error("addLineToCart failed", err);
  } finally {
    setAdding(false);
  }
}
```

### Pattern 3: CAPI Server Action (mirrors shopifyFetch)

**What:** Server-only `metaFetch` helper does a single POST to the Graph API endpoint. Server Actions build the payload from request headers (IP, UA) + client-supplied event params + fbp/fbc forwarded as strings.

**Endpoint:** `https://graph.facebook.com/v25.0/{PIXEL_ID}/events?access_token={TOKEN}` [VERIFIED: developers.facebook.com/docs/marketing-api/conversions-api/using-the-api]

**Example:**
```tsx
// lib/analytics/meta-capi.ts
import "server-only";

const CAPI_API_VERSION = "v25.0";

type MetaEventPayload = {
  event_name: string;
  event_time: number; // unix seconds
  event_id: string;
  event_source_url: string;
  action_source: "website";
  user_data: {
    client_ip_address?: string;
    client_user_agent?: string;
    fbp?: string;
    fbc?: string;
  };
  custom_data?: {
    content_ids?: string[];
    content_type?: "product";
    contents?: { id: string; quantity: number }[];
    value?: number;
    currency?: "USD";
  };
};

function getPixelId(): string {
  // server-side read of the same id that NEXT_PUBLIC_ exposes (read both for safety)
  const id = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  if (!id) throw new Error("NEXT_PUBLIC_FB_PIXEL_ID is not set");
  return id;
}

function getAccessToken(): string {
  const tok = process.env.FB_CAPI_ACCESS_TOKEN;
  if (!tok) throw new Error("FB_CAPI_ACCESS_TOKEN is not set");
  return tok;
}

export async function metaFetch(event: MetaEventPayload): Promise<void> {
  const pixelId = getPixelId();
  const token = getAccessToken();
  const endpoint = `https://graph.facebook.com/${CAPI_API_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(token)}`;

  const body: { data: MetaEventPayload[]; test_event_code?: string } = {
    data: [event],
  };
  const testCode = process.env.FB_TEST_EVENT_CODE;
  if (testCode) body.test_event_code = testCode;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
    // Never cache analytics writes
    cache: "no-store",
  });

  if (!res.ok) {
    // Generic error — never echo token or body to caller (phishing-surface rule)
    console.error(`[meta-capi] ${res.status} ${res.statusText}`);
    throw new Error("meta-capi: send failed");
  }
}
```

```tsx
// components/analytics/actions.ts
"use server";

import { headers } from "next/headers";
import { metaFetch } from "@/lib/analytics/meta-capi";

type TrackInput = {
  params: {
    content_ids?: string[];
    content_type?: "product";
    contents?: { id: string; quantity: number }[];
    value?: number;
    currency?: "USD";
  };
  eventId: string;
  fbp?: string;
  fbc?: string;
  eventSourceUrl: string;
};

async function buildUserData(input: { fbp?: string; fbc?: string }) {
  const h = await headers();
  return {
    client_ip_address:
      h.get("x-forwarded-for")?.split(",")[0].trim() ||
      h.get("x-real-ip") ||
      undefined,
    client_user_agent: h.get("user-agent") || undefined,
    fbp: input.fbp,
    fbc: input.fbc,
  };
}

export async function trackAddToCart(input: TrackInput): Promise<void> {
  await metaFetch({
    event_name: "AddToCart",
    event_time: Math.floor(Date.now() / 1000),
    event_id: input.eventId,
    event_source_url: input.eventSourceUrl,
    action_source: "website",
    user_data: await buildUserData({ fbp: input.fbp, fbc: input.fbc }),
    custom_data: input.params,
  });
}
// trackViewContent + trackInitiateCheckout follow the same shape
```

### Pattern 4: TypeScript ambient declaration for window.fbq

**What:** Single ambient `app/global.d.ts` that augments `Window` with `fbq` and `_fbq`. There is no `@types/facebook-pixel` package — write the declaration by hand.

**Example:**
```ts
// app/global.d.ts
// Source: derived from the canonical Meta Pixel snippet at
//   https://developers.facebook.com/docs/meta-pixel/get-started
// `fbq` is callable with multiple shapes — the union below covers the
// 4 forms used in Phase 9 (track + trackCustom + init + page-view ping).

type FbqEventID = { eventID?: string };
type FbqParams = Record<string, unknown>;

interface FbqFn {
  (cmd: "init", pixelId: string, options?: FbqParams): void;
  (cmd: "track", eventName: string, params?: FbqParams, opts?: FbqEventID): void;
  (cmd: "trackCustom", eventName: string, params?: FbqParams, opts?: FbqEventID): void;
  (cmd: "consent", action: "grant" | "revoke"): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  loaded: boolean;
  version: string;
  push: (...args: unknown[]) => void;
}

declare global {
  interface Window {
    fbq?: FbqFn;
    _fbq?: FbqFn;
  }
}

export {};
```

### Pattern 5: PDP ViewContent fire from a client child

**What:** PDP page is an `async` server component (fetches Shopify product). Mount a tiny client child `<ViewContentTracker product={...}>` inside the server component — pass plain serializable product fields (id, variant id, price) as props. The child fires ViewContent on mount.

**Why client child not Server Action on route enter:** Server Actions don't run on route enter — they run on form submit / `<button onClick={action}>`. A Server Component-only fire would need to happen on a `headers()`-bound code path on every render, which is fragile and conflates render with analytics. A client `useEffect` on mount is the canonical pattern.

**Where to source content_id:** Best practice for ecommerce dynamic ads: send the **product-level identifier** that's also in your catalog. Since the Shopify product GID is what Shopify's channel app reports for Purchase, we send `product.id` (the product GID, not variant GID) for ViewContent. For AddToCart + InitiateCheckout we send the variant GID because that's what the cart line represents — Meta's documentation accepts either, but the dedup-vs-Shopify alignment is product GID for product views and variant GIDs for cart actions. [ASSUMED — needs verification against Shopify channel app's actual `content_ids` payload once Jordan installs it; if Shopify uses variant GIDs for Purchase, change ViewContent to variant GID too for cross-event matching.]

```tsx
// components/analytics/ViewContentTracker.tsx
"use client";

import { useEffect, useRef } from "react";
import { trackPixelEvent } from "@/lib/analytics/fbq";
import { trackViewContent } from "./actions";

type Props = {
  productId: string;       // Shopify product GID
  defaultVariantId: string; // For Purchase-side alignment if we ever switch
  price: number;           // Default variant price (number, not string)
  handle: string;          // For event_source_url construction
};

export default function ViewContentTracker({ productId, price, handle }: Props) {
  const firedRef = useRef(false);
  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    const eventId = crypto.randomUUID();
    const params = {
      content_ids: [productId],
      content_type: "product" as const,
      value: price,
      currency: "USD" as const,
    };
    trackPixelEvent("ViewContent", params, eventId);
    const fbp = readCookie("_fbp");
    const fbc = readCookie("_fbc");
    trackViewContent({
      params,
      eventId,
      fbp: fbp ?? undefined,
      fbc: fbc ?? undefined,
      eventSourceUrl: window.location.href,
    }).catch(() => {});
  }, [productId, price, handle]);
  return null;
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : null;
}
```

### Anti-Patterns to Avoid

- **Don't fire from server component render.** Render functions are pure — they run on every revalidate. Wiring `metaFetch` into a server component body double-fires across React strict-mode renders + ISR refresh + cache misses. Always fire from explicit user-action handlers or client `useEffect`.
- **Don't await CAPI before the next user action.** `trackAddToCart` is fire-and-forget — its latency must never block ATC button completion. Buybox already opens the drawer before the Server Action resolves; CAPI just rides along.
- **Don't pass fbp/fbc through the server.** They're set by fbevents.js as non-httpOnly cookies. The client reads them via `document.cookie` and forwards them as plain strings to the Server Action. The server doesn't read them from request cookies because Next.js cookie helpers don't see non-httpOnly third-party cookies reliably on every host config.
- **Don't fire Purchase from our code.** D-04 is locked. The Shopify channel app on shop.shmocard.com owns Purchase. Firing from our code would create unmatched events (same Pixel ID, different domain, different event_id) and inflate Purchase counts.
- **Don't init Pixel via Tailwind classes or any non-script mechanism.** The official snippet is the only supported init path. fbevents.js sets up the queue + drains it; substituting our own loader breaks this.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---|---|---|---|
| Pixel script injection | Custom `useEffect` that creates a `<script>` and inserts into head | `next/script` `afterInteractive` | Next handles double-mount + hydration order correctly; manual DOM insertion duplicates on Fast Refresh |
| Pixel init snippet | Inventing your own fbq stub | The exact `!function(f,b,e,v,n,t,s)...` snippet from Meta docs | The snippet sets up the queue + push mechanism that fbevents.js drains on load. Custom init breaks this. |
| event_id generation | Timestamps, request IDs, hashes of inputs | `crypto.randomUUID()` | Native UUIDv4 is collision-safe + already available everywhere |
| SHA-256 hashing | Custom hashing, third-party packages | `node:crypto.createHash('sha256').update(value).digest('hex')` | Native. Matches Meta's normalization examples bit-for-bit (verified). |
| Cookie reading on server side | Trying to read `_fbp`/`_fbc` from `cookies()` Next helper | Read in browser via `document.cookie`, forward as Server Action arg | Non-httpOnly third-party cookies have inconsistent server visibility across hosts |
| UUID npm package | `uuid`, `nanoid`, `cuid` | `crypto.randomUUID()` | Zero deps. Already present. |
| Event payload type system | Custom Zod schema, runtime validation | Plain TypeScript types in `lib/analytics/types.ts` | Meta's CAPI accepts a stable JSON shape — runtime validation overhead doesn't pay back. Compile-time types are enough. |
| GHL endpoint receiver | Next.js route handler with HMAC verification | Nothing — Shopify Admin → Webhooks → POST direct to GHL | D-05 locked. Zero site code. |

**Key insight:** Phase 9 is fundamentally **plumbing**, not invention. Meta supplies the wire format, the SDK snippet, and the verification tools. Every "smart" custom addition (typed wrappers around the typed wrappers, retry logic, queue serialization) is overhead that breaks the dedup contract. Mirror `lib/shopify/index.ts`'s posture: one helper that does one POST, one Server Action per event, one client component per call site.

## Runtime State Inventory

> Phase 9 has no runtime-state migration concerns — this is a greenfield instrumentation phase, not a rename/refactor.

| Category | Items Found | Action Required |
|---|---|---|
| Stored data | None — no existing analytics state stored anywhere | None |
| Live service config | Meta Pixel ID + Pixel app install on Shopify's Facebook & Instagram channel — Jordan-side admin task, not code | Jordan: install Facebook & Instagram channel app, set data sharing to **Maximum**, configure Pixel ID. Out of code scope. |
| OS-registered state | None | None |
| Secrets/env vars | 3 new env vars (D-11) | Document in `backend.md` FIRST. Set in `.env.local`. Production vars set in Vercel at Phase 10. |
| Build artifacts | None | None |

## Common Pitfalls

### Pitfall 1: PageView fires twice on first paint
**What goes wrong:** Pixel JS runs `fbq('track', 'PageView')` on init. Then a React `useEffect` also calls it. Result: duplicate PageView in Events Manager.
**Why it happens:** Tutorials say "fire PageView from a useEffect for SPA route changes." App Router's `<Script>` snippet already calls `fbq('track', 'PageView')` in the inline init.
**How to avoid:** Init snippet handles initial PageView. Do NOT add a separate PageView call from a useEffect on first mount. **App Router note:** Next.js App Router uses RSC streaming; full document navigations re-init the script, but client-side route changes do NOT (no script re-execution). Phase 9 ships with **initial-PageView only** — SPA-style additional PageView fires across `/shmo-review` → `/shmo-review/cr-80` etc. are deferred. Risk: incomplete view counts for users who navigate via internal links. Mitigate later if Jordan flags it.
**Warning signs:** Events Manager shows 2× PageView count vs. unique sessions.

### Pitfall 2: event_id mismatch between Pixel and CAPI
**What goes wrong:** Browser fires with `eventID: "abc"`. Server fires with `event_id: "abc"`. But Pixel uses `eventID` (camelCase, optional argument), CAPI uses `event_id` (snake_case, top-level field). Easy to typo.
**Why it happens:** The two API shapes differ. Pixel's 4th arg to `fbq('track', ...)` is an object with `eventID`; CAPI's payload has `event_id` at the top of the event object.
**How to avoid:** Both shapes live in `lib/analytics/types.ts`. The dual-fire helper always takes one `eventId: string` and writes both shapes correctly. Never inline either field.
**Warning signs:** Events Manager Test Events tab shows `Server` event and `Browser` event with the same name but **does NOT** flag them as deduplicated. Inspect both events — if their identifiers differ, the wiring is wrong.

### Pitfall 3: Standard event names are case-sensitive
**What goes wrong:** Sending `"addtocart"` from the server and `"AddToCart"` from the browser → Meta treats them as different events, never dedupes.
**Why it happens:** Meta's docs list standard event names in PascalCase. Some tutorials use lowercase.
**How to avoid:** Use a TypeScript union `type MetaEventName = "ViewContent" | "AddToCart" | "InitiateCheckout"` — compiler rejects typos. Never accept a string from external input.
**Warning signs:** Events Manager shows separate "AddToCart" and "addtocart" rows.

### Pitfall 4: Missing `event_source_url` or `client_user_agent` for website events
**What goes wrong:** CAPI returns a warning (sometimes an error) when `action_source: "website"` and either `event_source_url` or `client_user_agent` is missing.
**Why it happens:** Required since Feb 2021 for all website events. Easy to miss when copying from CRM example payloads (those use `action_source: "system_generated"`).
**How to avoid:** Server Action reads `headers()` for User-Agent. Client passes `window.location.href` as `eventSourceUrl`. Both are mandatory in the type signature.
**Warning signs:** Events Manager shows "Missing required parameters" warnings on CAPI events.

### Pitfall 5: Forgetting to omit FB_TEST_EVENT_CODE in production
**What goes wrong:** Production deploys with `FB_TEST_EVENT_CODE` set → real customer events all land in Test Events tab → never count for optimization.
**Why it happens:** Env var copied wholesale from `.env.local` to Vercel.
**How to avoid:** `backend.md` documents `FB_TEST_EVENT_CODE` as **dev-only — DO NOT SET IN VERCEL PRODUCTION**. Phase 10 launch checklist verifies it's absent. The Server Action only includes `test_event_code` if the env var is non-empty — so omitting it in Vercel is the simplest mitigation.
**Warning signs:** Events Manager production stream goes flat after deploy; Test Events tab still ticking.

### Pitfall 6: Cart Persistence Trap (already mitigated in cart store, restated)
**What goes wrong:** Persisting `event_id` or last-fired tracking state to localStorage rehydrates with stale values across page loads.
**How to avoid:** Don't persist anything. `crypto.randomUUID()` is cheap — generate fresh per fire. Phase 9 adds no Zustand state.

### Pitfall 7: fbp not available before fbevents.js loads
**What goes wrong:** First ViewContent fires from `useEffect` → reads `document.cookie` → `_fbp` cookie not yet written by fbevents.js → fires CAPI with `fbp: undefined`. Event Match Quality lower than possible.
**Why it happens:** fbevents.js writes `_fbp` on its own first run, which happens shortly after `afterInteractive` injects the script.
**How to avoid:** Acceptable for first PDP visit. The cookie persists across navigation, so the second pageview onwards always has fbp. Alternative: introduce a 100-300ms delay before the first ViewContent fire — but this adds complexity for marginal first-visit Match Quality gain. Recommend deferring this micro-optimization unless Match Quality scores show problems.
**Warning signs:** Events Manager Diagnostics shows low Match Quality on ViewContent events.

### Pitfall 8: Shopify channel app uses different Pixel ID
**What goes wrong:** Jordan picks Pixel A for our code and Pixel B for Shopify channel app → events stack on two separate Pixels → ML can't combine signal.
**How to avoid:** Jordan-side admin task. `backend.md` must document: "The `NEXT_PUBLIC_FB_PIXEL_ID` value MUST match the Pixel ID installed in Shopify Admin → Sales channels → Facebook & Instagram → Customer events."
**Warning signs:** Two different Pixels show partial event counts; neither shows the full funnel.

### Pitfall 9: ad-blockers block fbq calls but NOT Server Actions
**What goes wrong:** Browser fbq blocked → Pixel event never fires → CAPI fires alone → Events Manager shows only "Server" matches.
**Why it happens:** This is the whole point of dual-fire. Not actually a pitfall; it's the design.
**How to avoid:** Nothing to avoid — the CAPI fire recovers the signal. Just be aware Events Manager will show CAPI-only events for ad-blocked users.

### Pitfall 10: InitiateCheckout drops because of navigation race
**What goes wrong:** Checkout button click → fire fbq + Server Action → immediately `window.location.href = checkoutUrl` → fbq HTTP beacon canceled by navigation; Server Action canceled too if `await` was used.
**Why it happens:** Full navigation tears down the JS context.
**How to avoid:**
1. Pixel: `fbq` uses `sendBeacon` under the hood when available — beacons survive navigation. No special handling needed.
2. CAPI Server Action: do NOT await before the redirect. Fire the action, do NOT chain `.then(() => navigate)`. The action runs server-side independently of the client tab — even if the tab navigates, the server keeps processing. (The `CartCheckoutButton` currently awaits `assertCheckoutUrl` then sets `window.location.href` — fire `trackInitiateCheckout` before the await on assertCheckoutUrl, ride beside it. Both server calls run server-side independently of the tab.)
**Warning signs:** Events Manager shows ViewContent + AddToCart on a session but no InitiateCheckout.

## Code Examples

### ViewContent on PDP

```tsx
// app/shmo-review/cr-80/page.tsx (Phase 9 addition)
import ViewContentTracker from "@/components/analytics/ViewContentTracker";

export default async function Cr80Page() {
  const product = await getProductByHandle("google-reviews-nfc-tap-card-cr80");
  const mapped = product ? mapProductToBuyboxProps(product) : {};
  const buyboxProps =
    mapped.product
      ? { ...mapped, product: { ...mapped.product, sub: CR80_SUB } }
      : mapped;

  // Source ViewContent fields from live product if available, else null skip.
  const defaultPrice = product?.priceRange?.minVariantPrice?.amount
    ? Number(product.priceRange.minVariantPrice.amount)
    : null;
  const defaultVariantId = product?.variants?.nodes?.[0]?.id ?? null;

  return (
    <main>
      <Buybox {...buyboxProps} nextBg="cream" />
      {/* ... rest of page ... */}
      {product && defaultPrice !== null && defaultVariantId && (
        <ViewContentTracker
          productId={product.id}
          defaultVariantId={defaultVariantId}
          price={defaultPrice}
          handle="google-reviews-nfc-tap-card-cr80"
        />
      )}
    </main>
  );
}
```

### Pixel client helper

```ts
// lib/analytics/fbq.ts
"use client";

import type { MetaEventName, MetaCustomData } from "./types";

export function trackPixelEvent(
  name: MetaEventName,
  params: MetaCustomData,
  eventId: string,
): void {
  if (typeof window === "undefined") return;
  if (!window.fbq) return; // script not loaded yet — silent no-op
  try {
    window.fbq("track", name, params, { eventID: eventId });
  } catch {
    // Never throw from a tracker — analytics must not break UX
  }
}
```

### Types file

```ts
// lib/analytics/types.ts

export type MetaEventName = "ViewContent" | "AddToCart" | "InitiateCheckout";

export type MetaContentEntry = {
  id: string;
  quantity: number;
};

export type MetaCustomData = {
  content_ids?: string[];
  content_type?: "product";
  contents?: MetaContentEntry[];
  value?: number;
  currency?: "USD";
};

export type MetaUserData = {
  client_ip_address?: string;
  client_user_agent?: string;
  fbp?: string;
  fbc?: string;
  em?: string[]; // SHA-256 hex, lowercase, trim before hash
  ph?: string[]; // SHA-256 hex, digits only, no leading zeros, no symbols
};

export type MetaEventPayload = {
  event_name: MetaEventName;
  event_time: number; // unix seconds
  event_id: string;
  event_source_url: string;
  action_source: "website";
  user_data: MetaUserData;
  custom_data?: MetaCustomData;
};
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|---|---|---|---|
| Pixel-only browser tracking | Dual-fire Pixel + CAPI | Apple iOS 14.5 (2021) + iOS 17 ITP (2023) | Browser-only setups lose 30-50% of conversion signal to ad blockers + ITP. CAPI recovers most of it. Industry standard since 2022. |
| Manual `<script>` in `<head>` | `next/script` `afterInteractive` | Next.js 11+ (still current in 15) | Framework handles double-mount + hydration. App Router pattern is `afterInteractive` (not `beforeInteractive`) for analytics. |
| `event_id` as request ID or timestamp | `crypto.randomUUID()` UUIDv4 | Node 14.17 / Web Crypto 2021 | Native, zero deps, collision-safe |
| `@types/facebook-pixel` (never existed officially) | Hand-rolled ambient `Window.fbq` in `global.d.ts` | Never existed | DefinitelyTyped doesn't publish a Pixel typedef. Each project writes its own — 15 lines. |
| Graph API v17 / v18 paths | Graph API **v25.0** | v25.0 introduced 2026-02-18 | Latest version. Auto-upgraded for tokens generated under Conversions API settings tab. |
| `action_source` optional | `action_source` required for all events; `event_source_url` + `client_user_agent` required for website events | Feb 2021 | Missing these causes warnings/rejections in Events Manager. Build them into the type system. |
| Manual fbp/fbc cookie parsing in many guides | Same — Meta provides no JS helper; you read `document.cookie` | Always | Acceptable, but expect the snippet to be hand-written. |
| Shopify Pixel via theme.liquid | Shopify Facebook & Instagram channel app (Customer events → Maximum) | Around 2022 | Channel app fires Purchase + checkout-page events with CAPI built-in. Don't reach into theme.liquid. |

**Deprecated/outdated:**
- **`fbq('trackCustom', ...)` for standard events** — wrong API path. Use `fbq('track', 'AddToCart', ...)` for standard names; `trackCustom` is reserved for non-standard names not in scope here.
- **Graph API v16.0 and below** — Offline Conversions API endpoints deprecated May 2025. Phase 9 uses v25.0 throughout.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|---|---|---|
| A1 | Test Events tab accepts `event_source_url=http://localhost:3000` for dev mode | Pattern 3 + Pitfall 4 | If Meta rejects localhost URLs, dev verification fails. Workaround: pass `http://shmocard.com/dev` instead. **[ASSUMED]** — Meta docs don't explicitly state localhost is accepted, but test_event_code routes events past production validation; community consensus is "any URL works in test mode." Verify in first dev test. |
| A2 | ViewContent should send product GID, not variant GID, for catalog alignment | Pattern 5 | If Shopify channel app uses variant GIDs for Purchase's content_ids, ViewContent → Purchase content matching breaks → Dynamic Product Ads remarketing audience smaller. **[ASSUMED]** — Best practice consensus, but Shopify's payload not directly inspected. Jordan can verify in Events Manager after first Purchase fires from Shopify side. |
| A3 | fbp / fbc cookies are non-httpOnly and readable from `document.cookie` | Pattern 5, Pitfall 7 | If a future Shopify or Meta change makes them httpOnly, browser passthrough breaks. **[CITED: developers.facebook.com/docs/marketing-api/conversions-api/parameters/fbp-and-fbc]** but called out as ASSUMED because not retested in this session against latest fbevents.js behavior. |
| A4 | Generic error logging from CAPI (no echo to user, server console only) is the right phishing-mitigation posture | Pattern 3, Don't Hand-Roll table | Mirrors Phase 8's `applyDiscountCode` precedent. **[VERIFIED: components/cart/actions.ts:79-87]** — same posture is in use already. |
| A5 | `crypto.randomUUID()` is available without polyfill in all supported browsers + Node 22 | Standard Stack + Pitfall 6 | If older browsers crash, all tracking dies. **[VERIFIED: ran on Node 22.18.0; widely supported in browsers since 2022 — Safari 15.4+, Chrome 92+, Firefox 95+]** |
| A6 | Shopify channel app fires Purchase + InitiateCheckout (checkout page) on shop.shmocard.com automatically when "Maximum" data sharing is set | Architectural Responsibility Map, D-01 | If channel app doesn't fire one of these, Phase 9 ships missing signal. **[CITED: help.shopify.com/en/manual/promoting-marketing/analyze-marketing/meta-data-sharing]** — Maximum enables Pixel + CAPI for all standard events. Jordan to verify in Events Manager that Purchase fires after first test transaction. |
| A7 | The Pixel ID used on shmocard.com matches the Pixel ID configured in Shopify channel app | Pitfall 8 | Mismatched IDs split signal across two Pixels. **[ASSUMED — Jordan's admin task to configure correctly]** Documented as a `backend.md` requirement so this gets surfaced before Phase 10. |
| A8 | Meta's CAPI 48-hour dedup window applies regardless of which event arrived first (server-then-browser order or browser-then-server) | Pitfall 2, Pattern 2 | If order matters, fire-and-forget client + server fires may not dedupe reliably. **[VERIFIED: developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events]** — 48-hour window with no ordering requirement. |

**Action for planner:** Surface assumptions A1, A2, A7 as items in Phase 9 verification — Jordan should confirm Test Events tab accepts localhost URL on first run (A1), inspect Shopify channel app's content_ids in a real Purchase event (A2), and confirm Pixel ID parity between channel app and `NEXT_PUBLIC_FB_PIXEL_ID` (A7).

## Open Questions

1. **Does Shopify's Facebook & Instagram channel app read custom cart attributes for fbp/fbc passthrough?**
   - What we know: Multiple third-party blogs (Foxwell, Elevar, Littledata) explicitly state Shopify's native integration has **poor fbp/fbc passthrough on the Purchase event**. Third-party tools (Littledata, Elevar) exist primarily to fix this.
   - What's unclear: Whether **passing `_fbp`/`_fbc` as cart line attributes from our domain** is read by Shopify's channel app on the checkout side. Searches surface no canonical Shopify or Meta documentation confirming this works.
   - Recommendation: **Defer.** D-01 already commits to dual-fire on our domain (which recovers most signal). Shopify-side Purchase Match Quality is Jordan's optimization to evaluate after Phase 9 ships and Events Manager shows real Match Quality scores. If scores are bad, a follow-up phase can add cart attribute passthrough or evaluate a third-party like Elevar.

2. **Should we add a `_fbp` / `_fbc` cart attribute passthrough even if Shopify doesn't read it?**
   - What we know: Cart attributes are surfaced in Shopify Admin order details and emails. Not in customer-facing UI.
   - What's unclear: If the channel app doesn't read them, passing them costs cart attribute slots for no analytics benefit.
   - Recommendation: **Don't add in Phase 9.** Re-evaluate after first month of production data with Phase 9 alone. (CONTEXT.md Specifics already calls this out as nice-to-have.)

3. **Should InitiateCheckout fire from us if Shopify also fires it on the checkout page?**
   - What we know: D-03 already says yes — dual signal with different `event_id` values, both count.
   - What's unclear: Whether Meta's algorithm penalizes "double InitiateCheckout per session" vs. counting it as cross-domain signal recovery.
   - Recommendation: **Ship D-03 as decided.** Meta's algorithm is robust to legitimate dual signals; this is the documented pattern for split-domain headless setups.

4. **Does the standard event taxonomy need `AddPaymentInfo` or `Lead`?**
   - What we know: D-07 says no — 4 standard events only.
   - What's unclear: If algorithm performance is poor with 3 events on our domain + 1 on Shopify's, will adding signal upstream help.
   - Recommendation: **Out of scope for Phase 9.** CONTEXT.md Deferred Ideas notes this for future revisit.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|---|---|---|---|---|
| `node:crypto` | hash + UUID | Yes (built-in) | Node 22.18.0 | — |
| Global `crypto.subtle` / `crypto.randomUUID` | Server Actions + client UUID | Yes (built-in) | Node 22 + modern browsers | — |
| `next/script` | Pixel base loader | Yes (built-in to next@15.1.6) | 15.1.6 | — |
| Facebook Events Manager (jordan-side) | Test Events tab verification | External (Jordan-side) | — | Cannot ship D-10 verification without it; Jordan must have Pixel created + access |
| Pixel ID (jordan-side) | `NEXT_PUBLIC_FB_PIXEL_ID` | External (Jordan-side) | — | Phase 9 cannot ship without; Jordan creates Pixel + provides ID first |
| FB CAPI Access Token (jordan-side) | `FB_CAPI_ACCESS_TOKEN` | External (Jordan-side) | — | Generated in Events Manager → Settings → Conversions API; Jordan provides |
| FB Test Event Code (jordan-side) | `FB_TEST_EVENT_CODE` for dev | External (Jordan-side) | — | Generated in Events Manager → Test Events tab; Jordan provides for dev only |
| Shopify Facebook & Instagram channel app (jordan-side) | D-01 — Purchase event firing | External (Jordan-side) | — | Phase 9 ships our 3 events even if Shopify channel app isn't installed yet; Jordan installs to complete the 4-event picture before Phase 10 |
| Tunnel for localhost webhooks (e.g., ngrok) | NOT needed | — | — | D-05 says no site receiver. Phase 9 makes no webhook receivers — Meta CAPI is outbound only. |

**Missing dependencies with no fallback:**
- Pixel ID + CAPI Access Token + Test Event Code — Jordan-side, must be provided before code lands. **Block:** Plan must include a "wait for Jordan" gate after env vars are documented in backend.md.

**Missing dependencies with fallback:**
- Shopify channel app install — partial fallback. Phase 9 ships our 3 events independently; Purchase coverage requires app install but doesn't block Phase 9's own scope.

## Validation Architecture

### Test Framework
| Property | Value |
|---|---|
| Framework | Playwright (existing) + tsc + npm run build + **manual verification in Meta Events Manager Test Events tab** |
| Config file | `playwright.config.ts` (existing) |
| Quick run command | `npx tsc --noEmit` |
| Full suite command | `npm run build && npx playwright test` |

**Why manual Events Manager check is the source of truth:** Per D-10, the verification gate is "all 3 events appear as `Server + Browser` in Events Manager Test Events tab." No unit test can simulate Meta's dedup engine. The Playwright role is to drive the UI; the Events Manager role is to confirm Meta received the events correctly.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|---|---|---|---|---|
| TRK-01 | `NEXT_PUBLIC_FB_PIXEL_ID`, `FB_CAPI_ACCESS_TOKEN`, `FB_TEST_EVENT_CODE` documented in `backend.md` env vars table | doc-check | `grep -E "FB_PIXEL_ID\|FB_CAPI_ACCESS_TOKEN\|FB_TEST_EVENT_CODE" context/general/backend.md` | ❌ Wave 0 |
| TRK-02 | `<PixelLoader>` mounted in root layout; `window.fbq` defined after `afterInteractive` script loads | smoke | Playwright: visit `/`, assert `await page.evaluate(() => typeof window.fbq)` returns `'function'` | ❌ Wave 0 |
| TRK-03 | PageView fires on initial load | smoke + manual | Playwright: assert Pixel network request to `connect.facebook.net` or `www.facebook.com/tr` includes `ev=PageView` ; **Events Manager Test Events tab shows PageView (server-side counts if we also fire CAPI — but per D-07 we only fire the 3 standard events server-side, NOT PageView, so PageView is browser-only)** | ❌ Wave 0 |
| TRK-04 | ViewContent fires once per PDP visit (browser + server) | smoke + manual | Playwright: visit `/shmo-review/cr-80`, assert Pixel network call AND `crypto.randomUUID` invoked once. **Events Manager: ViewContent appears as Server + Browser with same Pixel ID** | ❌ Wave 0 |
| TRK-05 | AddToCart fires on Buybox ATC success (browser + server) | smoke + manual | Playwright: ATC click, assert fbq call + Server Action invocation share same UUID. **Events Manager: AddToCart Server + Browser dedup** | ❌ Wave 0 |
| TRK-06 | InitiateCheckout fires before redirect, beacon survives navigation | smoke + manual | Playwright: cart drawer Checkout click; intercept the navigation, assert Pixel beacon was sent. **Events Manager: InitiateCheckout Server + Browser** | ❌ Wave 0 |
| TRK-07 | No Pixel events when env var missing | unit | Playwright: clear `NEXT_PUBLIC_FB_PIXEL_ID`, build, assert `<PixelLoader>` returns null and `window.fbq` is undefined | ❌ Wave 0 |
| TRK-08 | CAPI Server Action does NOT throw on Meta error (generic error, no user echo) | unit | Mock metaFetch to return 500; assert Server Action returns silently, console.error fired but no exception propagates to UI | ❌ Wave 0 |
| TRK-09 | `FB_TEST_EVENT_CODE` set in dev → events route to Test Events tab | manual | Run dev with code set; verify in Test Events tab. With code unset, fire should hit production stream (do not test in production phase) | manual only |
| TRK-10 | TypeScript clean (`tsc --noEmit`) | type-check | `npx tsc --noEmit` | exists (Phase 8) |
| TRK-11 | Build clean (`npm run build`) | build-check | `npm run build` | exists (Phase 8) |
| TRK-12 | Verify no token leak — `console.log` or response body never includes `FB_CAPI_ACCESS_TOKEN` | static analysis | `grep -rn "FB_CAPI_ACCESS_TOKEN\|access_token" components/ lib/ app/ \| grep -v "process.env"` returns 0 matches outside meta-capi.ts | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npx tsc --noEmit` (existing pattern from Phase 8)
- **Per wave merge:** `npm run build && npx playwright test` + manual Events Manager smoke check
- **Phase gate:** Events Manager Test Events tab shows ViewContent + AddToCart + InitiateCheckout each as `Server + Browser` rows (dedup confirmed) on a fresh test session before `/gsd-verify-work`.

### Wave 0 Gaps
- [ ] `app/global.d.ts` — ambient Window.fbq declaration. Required before any client code that calls `window.fbq` will pass tsc.
- [ ] `lib/analytics/types.ts` — shared types module.
- [ ] `lib/analytics/meta-capi.ts` — server-only CAPI helper.
- [ ] `lib/analytics/hash.ts` — SHA-256 helper (defined for future use; not called in Phase 9 since no PII captured pre-checkout).
- [ ] `lib/analytics/fbq.ts` — client typed wrapper.
- [ ] `components/analytics/PixelLoader.tsx` — base script mount.
- [ ] `components/analytics/ViewContentTracker.tsx` — PDP client child.
- [ ] `components/analytics/actions.ts` — `"use server"` track* Server Actions.
- [ ] Playwright smoke tests for TRK-02 through TRK-08.
- [ ] `backend.md` env var table updated FIRST with TRK-01.

## Security Domain

> `security_enforcement` not explicitly set in config → enabled by default.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---|---|---|
| V2 Authentication | no | Phase 9 has no user authentication surface |
| V3 Session Management | no | No new session state introduced |
| V4 Access Control | yes | `FB_CAPI_ACCESS_TOKEN` is server-only; never reach the client. Enforce via `import "server-only"` in `lib/analytics/meta-capi.ts` (same pattern as `lib/shopify/index.ts:11`). |
| V5 Input Validation | yes | Client-supplied `eventSourceUrl`, `fbp`, `fbc` go directly to CAPI. Validate `eventSourceUrl` starts with `http(s)://` and length-cap; validate `fbp`/`fbc` match `fb.<digit>.<digits>.<token>` regex. Generic error on bad input (don't echo). |
| V6 Cryptography | yes | `node:crypto` `createHash('sha256').digest('hex')` for any PII hashing; never roll a custom hash. `crypto.randomUUID()` for event_id, not Math.random. |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---|---|---|
| Access token leak via console/response | Information Disclosure | `lib/analytics/meta-capi.ts` never logs the token, never echoes the URL in errors (status + statusText only). Mirrors `lib/shopify/index.ts:67-69`. |
| Access token in client bundle | Information Disclosure | `import "server-only"` at top of `meta-capi.ts` causes a build error if any client module imports it. Same pattern as Phase 8. |
| Open-redirect via attacker-controlled event_source_url | Tampering | Server Action validates `eventSourceUrl` is `http(s)://` and a sane length before forwarding to CAPI. Meta itself doesn't redirect — but if an attacker can trick CAPI into logging weird URLs, it's noise + theoretical exfiltration. Validate. |
| Forgery of `client_ip_address` / `client_user_agent` | Spoofing | Server Action reads these from `headers()`, NEVER accepts them from client. The headers may still be spoofed by determined attackers — but that's true of any IP/UA-based system. Document the trust model. |
| Phishing-surface echo of Meta API errors to browser | Tampering / Information Disclosure | Catch-all in Server Action returns `void` or throws generic `"meta-capi: send failed"`. Browser never sees Meta's actual error message. Mirrors Phase 8 `applyDiscountCode` precedent. |
| Hash leak via logging of PII | Information Disclosure | Phase 9 collects no PII. The `hash.ts` helper is defined for future use only. When/if used, log only the hash hex digest, never the pre-hash input. |
| Replay of test_event_code to flood Test Events tab | Repudiation / no Service impact | Negligible — Test Events tab is informational only, isolated from production stream. No mitigation needed. |
| GDPR cookie violation via unconditional Pixel fire | Compliance | **CONTEXT.md Deferred:** Cookie consent banner is out of scope for Phase 9. Risk documented in CONTEXT.md Deferred Ideas; surfaces as Phase 10 / future-phase concern if EU traffic grows. |

## Project Constraints (from CLAUDE.md)

- `live-store-protection.md`: SUPREME RULE — no theme touch, no Admin API writes, no destructive Shopify CLI. Phase 9 honors this — Pixel/CAPI are signal-out only, no Admin writes.
- `shopify-data-discipline.md`: Data in Shopify, presentation in code. Pixel content_ids come from live Shopify product/variant GIDs at runtime — not hardcoded. ✓
- `verification.md`: Don't claim done without proof. Phase 9 done = Events Manager Test Events tab shows all 3 events as Server + Browser. Playwright drives the UI; Events Manager confirms reception. Screenshot of Test Events tab to `pictures/screenshots/phase-9-events-manager-test-events.png`.
- `file-organization.md`: New files go under existing top-level folders. `lib/analytics/` and `components/analytics/` are net-new but live under existing `lib/` and `components/` — no new top-level. ✓
- `design-system.md`: N/A — no UI work in Phase 9. PixelLoader and ViewContentTracker render null. No `.shm-*` classes touched.
- `vault-conventions.md`: No vault writes needed.

## Sources

### Primary (HIGH confidence)
- [Meta Pixel Get Started](https://developers.facebook.com/docs/meta-pixel/get-started/) — base snippet, `fbq` API surface, event names
- [Conversions API Using the API](https://developers.facebook.com/docs/marketing-api/conversions-api/using-the-api/) — endpoint format, payload shape, test_event_code, response handling
- [CAPI Customer Information Parameters](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters/) — em/ph/fbp/fbc hashing rules + normalization examples
- [CAPI Server Event Parameters](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/server-event/) — required fields: event_name, event_time, event_id, action_source, event_source_url
- [CAPI Deduplicate Pixel and Server Events](https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events/) — `eventID` vs `event_id` naming, 48-hour dedup window, case-sensitive event_name match
- [CAPI fbp and fbc Parameters](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/fbp-and-fbc/) — cookie format, not-hashed, 90-day fbc expiration
- [Graph API Changelog](https://developers.facebook.com/docs/graph-api/changelog) — v25.0 introduced 2026-02-18; v24.0, v23.0 still active
- [Next.js Script Component](https://nextjs.org/docs/app/api-reference/components/script) — afterInteractive vs beforeInteractive vs lazyOnload semantics in App Router
- Verified locally: `node -e "crypto.createHash('sha256').update('john_smith@gmail.com').digest('hex')"` → `62a14e44f765419d10fea99367361a727c12365e2520f32218d505ed9aa0f62f` — matches Meta's documented expected output exactly.

### Secondary (MEDIUM confidence)
- [Shopify Help — Facebook data sharing levels](https://help.shopify.com/en/manual/promoting-marketing/analyze-marketing/meta-data-sharing) — "Maximum" enables Pixel + CAPI for all events including Purchase
- [Shopify Community — fbp/fbc passthrough discussion](https://community.shopify.com/t/can-fbp-and-fbc-parameters-be-added-to-facebook-api-output/40364) — community confirmation that native passthrough is limited (informs Open Question #1)
- [Foxwell Digital — Shopify + Meta tracking](https://www.foxwelldigital.com/blog/should-you-be-worried-about-shopifys-meta-tracking-integration) — third-party perspective on Shopify channel app limitations
- [Cometly — Event Source URL guide](https://help.cometly.com/en/articles/11788368-event-source-url-for-meta-conversion-api) — confirms event_source_url + user_agent required since Feb 2021 for website events

### Tertiary (LOW confidence — used for cross-reference only, not load-bearing)
- [DEV: Add Facebook Pixel in NextJS](https://dev.to/mdranaa/add-facebook-pixel-in-nextjs-website-just-2-steps-4cmg) — community tutorial, not authoritative
- [3zeroDigital — Meta Pixel in Next.js App Directory](https://www.3zerodigital.com/blog/integrating-meta-pixel-in-a-next-js-application-with-the-app-directory) — community tutorial, blocked by web fetch (sketched pattern only)
- [Agrowth — Event Deduplication](https://agrowth.io/blogs/facebook-ads/event-deduplication-in-meta-ads) — third-party explainer on dedup; corroborates official docs
- [Watsspace — Meta CAPI deduplication](https://watsspace.com/blog/meta-conversions-api-deduplication-event_id/) — same as above

## Metadata

**Confidence breakdown:**
- Standard stack: **HIGH** — all native, verified versions, identical SHA-256 output to Meta example, Graph API version confirmed against changelog
- Architecture: **HIGH** — dual-fire is the documented pattern; Server Action mirror of Shopify pattern is direct port
- Pitfalls: **HIGH** — 10 pitfalls verified against Meta docs + community consensus; field-tested patterns
- Validation: **MEDIUM** — manual Events Manager check is required; no full automation possible. Automated layer covers what it can.
- Open Questions (Shopify cart attribute passthrough): **LOW** — no authoritative source on whether Shopify channel app reads custom cart attributes. Deferred to post-launch.

**Research date:** 2026-05-21
**Valid until:** 2026-08-21 (90 days). Meta API changes annually; re-verify Graph API version + dedup rules before any post-launch tracking changes.
