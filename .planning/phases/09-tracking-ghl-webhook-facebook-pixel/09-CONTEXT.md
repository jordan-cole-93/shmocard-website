# Phase 9: Tracking — GHL webhook + Facebook Pixel — Context

**Gathered:** 2026-05-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Wire customer-acquisition tracking for the Shmocard storefront. Two destinations:

1. **Meta Ads** — Facebook Pixel (browser) + Conversions API (server) for the 4 standard funnel events: `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`. Used by Meta's algorithm to optimize ad delivery.
2. **GoHighLevel (GHL)** — order/customer sync via webhook so the CRM has every Shopify order for follow-up, lifecycle automations, and parent-business reporting.

The site-side scope is the *signal emission* — fire the right events at the right times with clean payloads. Meta-side configuration (Shopify channel app install, data-sharing settings, GHL endpoint setup) lives in Shopify Admin and is Jordan's responsibility, not code.

Phase 9 ships independent of Phase 10 — no Vercel deploy needed because the Purchase event is handled by Shopify's official Facebook integration, not by a site-side webhook.

</domain>

<decisions>
## Implementation Decisions

### Architecture — split-domain Pixel
- **D-01:** Pixel architecture is **split-domain**. `shop.shmocard.com` (Shopify-hosted checkout) is owned by Shopify's Facebook & Instagram sales channel app — it fires Pixel + Conversions API for `Purchase` and the checkout-page events automatically. `shmocard.com` (our Next.js site) fires `ViewContent`, `AddToCart`, `InitiateCheckout` from our code. Same Pixel ID on both domains so events stack/dedupe in Events Manager.
- **D-02:** Site events use **dual-fire (browser Pixel + server-side CAPI)** for max signal. Each event fires from the browser via Pixel JS *and* from a Next.js Server Action to the FB Graph API. Both fires share the same `event_id` (UUIDv4) so Meta dedupes them in Events Manager. This is the "Maximum" pattern that recovers ad-blocked / iOS17-ITP traffic.
- **D-03:** **Site fires `InitiateCheckout` too** when the user clicks the cart's "Checkout" button (before redirect to `shop.shmocard.com`). Shopify's channel app will also fire `InitiateCheckout` on checkout-page arrival. Different `event_id` values → both count as separate signals; loses no signal if either is blocked.
- **D-04:** `Purchase` is **never** fired from our code. Shopify owns it 100%.

### GHL webhook
- **D-05:** GHL order-sync webhook is configured via **Shopify Admin → Settings → Notifications → Webhooks → Order created → POST to GHL endpoint**. Zero site code, zero Vercel dependency. Jordan owns the field mapping in Admin. If GHL needs a payload transformation Shopify Admin can't do, that's a future site-side proxy in a later phase — but unlikely for the standard order shape.
- **D-06:** No site-side `/api/ghl-*` route is built in Phase 9. Site has zero responsibility for GHL signal.

### Event taxonomy & dedup
- **D-07:** Use the **4 standard Facebook events as named**: `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`. No custom events. Standard parameters (`content_ids`, `content_type: "product"`, `value`, `currency: "USD"`).
- **D-08:** Each event fire gets a unique **UUIDv4 `event_id`**. Same `event_id` shared between browser Pixel and our CAPI call for the same logical event (enables dedup). No deterministic derivation from Shopify IDs — the value of dedup is the cross-source match, not human readability.

### Test strategy
- **D-09:** Test events use the **FB Test Events code** pattern. `FB_TEST_EVENT_CODE` env var set in `.env.local` only — when present, events fire with the `test_event_code` param so Meta routes them to Events Manager's "Test Events" tab instead of production stream. Production env vars do NOT include `FB_TEST_EVENT_CODE`, so prod fires real events.
- **D-10:** Verification flow before declaring Phase 9 done: walk through PDP → ATC → cart drawer → Checkout button on a Test Events code session. Confirm Events Manager shows all 3 site events (ViewContent, AddToCart, InitiateCheckout) as `Server + Browser` (both fires landed, dedup worked). Confirm Shopify channel app fires Purchase with same Pixel ID.

### Env vars (new in Phase 9)
- **D-11:** Three new env vars:
  - `NEXT_PUBLIC_FB_PIXEL_ID` — public, embedded in browser Pixel JS
  - `FB_CAPI_ACCESS_TOKEN` — server-only, signs CAPI calls from our Server Actions
  - `FB_TEST_EVENT_CODE` — server-only, dev only (omitted in production)
- Documented in `context/general/backend.md` alongside Phase 8 env vars before any code lands.

### Claude's Discretion
- Exact Pixel script-loading pattern (Next.js `<Script>` with `strategy="afterInteractive"` vs alternate strategies) — researcher / planner decides based on Next.js 15 + React Server Components considerations.
- Server Action shape for CAPI fires — single utility `fireMetaEvent(eventName, params, eventId)` vs dedicated actions per event. Planner decides.
- Where the `<PixelLoader>` component mounts — root layout vs page-conditional. Planner decides based on SSR / hydration impact.
- Specific hashed `user_data` fields sent to CAPI (`em` email hash, `client_ip_address`, `client_user_agent`, `fbp` cookie, `fbc` cookie) — researcher confirms minimum-required-for-attribution from Meta docs.
- Whether to also wire `fbp` / `fbc` cookie passthrough to Shopify cart attributes for cross-domain attribution (nice-to-have if Shopify channel app supports it).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project rules
- `.claude/rules/live-store-protection.md` — supreme rule. Shopify Admin is Jordan-owned; no Admin API writes; no theme touch.
- `.claude/rules/shopify-data-discipline.md` — data lives in Shopify, presentation in code. Tracking is "presentation" — derived from data, never invents data.
- `.claude/rules/verification.md` — must verify in Events Manager before claiming done.
- `.claude/rules/file-organization.md` — new files live under existing top-level folders (`lib/analytics/`, `components/analytics/`).

### Project context
- `.planning/ROADMAP.md` — Phase 9 entry line (top section); Phase 10 entry for what's deferred.
- `.planning/PROJECT.md` — architecture lock (2026-05-16): /shmo-review is category, /shmo-review/[handle] are PDPs.
- `context/general/backend.md` — env vars contract. Phase 9 adds 3 new vars (see D-11) — must be documented here before code.
- `.planning/phases/08-shopify-storefront-wiring/08-SUMMARY.md` — what shipped in Phase 8 (Buybox.handleAdd → addLineToCart, discount code support, FormatPicker dead-code cleanup). Phase 9 hooks ride on these.

### Existing code to wire into
- `components/cart/actions.ts` — Cart Server Actions. `addLineToCart` is the natural call-site for AddToCart event fire. `clearDiscountCodes` not relevant. CAPI dual-fire likely lives in a sibling utility, not inside cart actions themselves (separation of concerns).
- `components/shmo-review/Buybox.tsx` — `handleAdd` (line ~133) wraps `addLineToCart` from client side. AddToCart browser Pixel fires here; CAPI fires via Server Action.
- `components/cart/CartDrawer.tsx` — Checkout button (need to grep exact location) fires InitiateCheckout before redirecting to `cart.checkoutUrl`.
- `app/api/revalidate/route.ts` — HMAC webhook pattern. Not directly reused in Phase 9 (GHL is Shopify-direct, no site receiver), but the pattern is the reference if we ever need a custom webhook proxy later.
- `app/layout.tsx` — root layout. `<PixelLoader>` mounts here (or somewhere similar — planner decides).
- `app/shmo-review/cr-80/page.tsx` (+ l-sign, square-card) — async server components fetching Shopify product. ViewContent payload sources from this data (`content_ids: [product.id]`, `value: variant.price.amount`).

### External docs (research targets)
- Meta Pixel docs — Standard Events reference (`ViewContent`, `AddToCart`, etc. with required + optional parameters)
- Meta Conversions API docs — Graph API endpoint + payload shape + `user_data` hashing requirements
- Shopify Customer Events / Pixels docs — context for what Shopify channel app fires on the checkout side
- Shopify Facebook & Instagram sales channel app — install + configuration guide (Jordan-side; reference only for our side)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Server Action pattern** — `components/cart/actions.ts` is the canonical Server Action file. CAPI fires from our server follow the same pattern: server-only, no `'use client'`, typed input/output, no token in the browser.
- **HMAC verification pattern** — `app/api/revalidate/route.ts` shows the canonical webhook receiver pattern with timing-safe HMAC SHA-256. Reference only; Phase 9 doesn't add new webhook receivers.
- **Cart Zustand store** — `components/cart/store.ts` already tracks cart state, line items, discount codes. Events can derive `value` and `content_ids` from store state without re-fetching.
- **Hashed user_data** — Need a small `lib/analytics/hash.ts` for SHA-256 PII hashing per Meta CAPI requirements. No existing helper.

### Established Patterns
- **No Admin API writes** — Phase 9 is read-only from Shopify Admin's perspective. Pixel/CAPI = signals out, not Admin mutations.
- **Generic errors only** — Per Phase 8's `applyDiscountCode` precedent, any FB CAPI error never echoes back to the browser. Log to server console for debugging, return generic success/failure to client.
- **Env vars documented in backend.md before code** — Phase 8 set this precedent. Phase 9's 3 new vars (D-11) must land in `context/general/backend.md` before code uses them.
- **Type-first via tsc gate** — Per Phase 8 BLOCKER-fix order, types and contracts land first, then implementation, then UI. Apply same here: define `MetaEventPayload` types, hash helper, then Server Actions, then `<PixelLoader>`, then event-fire call sites.

### Integration Points
- **ViewContent** — Fires on `/shmo-review/cr-80`, `/shmo-review/l-sign`, `/shmo-review/square-card` PDPs. Could fire from a client component mounted in each PDP, OR from a route-segment `track-page-view` Server Action invoked on the server component side. Planner picks.
- **AddToCart** — Fires from `Buybox.tsx:handleAdd` (client) after `addLineToCart` success. Pixel fires immediately; CAPI fires via a `trackAddToCart` Server Action invoked alongside.
- **InitiateCheckout** — Fires from `CartDrawer.tsx` checkout button handler (client) before redirect. Same dual-fire pattern.
- **Purchase** — NEVER fires from our code. Shopify channel app on shop.shmocard.com owns it. Verify in Events Manager that Pixel ID matches and event lands with same `content_ids` as our AddToCart.

</code_context>

<specifics>
## Specific Ideas

- **Maximum data sharing** — Jordan to verify Shopify Admin → Settings → Customer events → Facebook channel data sharing is set to "Maximum" (not the Jan 2026 default "Optimized" which suppresses events).
- **Same Pixel ID on both domains** — Jordan picks one Pixel ID in Meta Business Manager. That same ID gets used in (a) Shopify channel app config and (b) our `NEXT_PUBLIC_FB_PIXEL_ID` env var. No second/dev Pixel — dev uses `FB_TEST_EVENT_CODE` against the real Pixel.
- **Phase 9 ships pre-Vercel-deploy.** No site-side webhook receivers, no public URL needed. Pixel + CAPI both work in localhost dev via Test Events code. This is the key reason for the split-domain decision — unblocks Phase 9 from Phase 10.
- **Cookie consent is deferred.** Phase 9 fires Pixel/CAPI unconditionally on every visit. GDPR / cookie banner is a separate concern (probably a future phase, possibly Phase 10 if Jordan flags it as launch-blocking).

</specifics>

<deferred>
## Deferred Ideas

- **Cookie consent banner / GDPR compliance** — Tracking fires unconditionally in Phase 9. If France/EU traffic becomes meaningful, add consent gate in a future phase.
- **Custom events beyond the standard 4** — e.g., `AddPaymentInfo`, `Lead`, `CompleteRegistration`. Not in scope; revisit when Meta's algorithm needs more signal.
- **Custom site-side webhook proxy for GHL** — Rejected in D-05 (Shopify Admin direct chosen). If a payload transformation need emerges, separate phase.
- **TikTok Pixel, Google Ads conversion tag, LinkedIn Insight Tag** — Other ad platforms. Out of scope; Phase 9 is Meta-only per ROADMAP.
- **fbp/fbc cookie passthrough to Shopify cart attributes** — Mentioned in Claude's Discretion above. Nice-to-have for cross-domain attribution; researcher checks if Shopify channel app reads custom cart attributes. If complex, deferred.

</deferred>

---

*Phase: 09-tracking-ghl-webhook-facebook-pixel*
*Context gathered: 2026-05-21*
