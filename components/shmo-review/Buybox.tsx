"use client";

// components/shmo-review/Buybox.tsx — Shmo Review CR-80 buybox (PDP).
// Phase 3. Ported 1:1 from
// .claude/skills/shmocard-design-system/ui_kits/website/homepage-shmoreview/review-buybox.jsx:1-225
// + review.css:286-353 (+ 1037-1058 breakpoints).
//
// ATC is wired to the real Shopify Storefront API via addLineToCart
// (components/cart/actions.ts). On success the cart store is updated
// wholesale from the server response and the drawer opens. Loading +
// error states are handled inline; errors are generic (never raw
// Shopify userErrors — phishing-surface rule).
//
// Composes design-system primitives only:
//   .shm-rating, .shm-eyebrow, .shm-h2, .shm-btn--primary/--xl,
//   .shm-checklist--featured, .shm-pack-rows + .shm-pack-row,
//   .shm-qty, .shm-faq-list,
//   .shm-badge--ember/--honey.
// No primitive restyles. Layout-only CSS lives in shmo-review.css.

import { useState } from "react";

import { addLineToCart } from "@/components/cart/actions";
import { trackAddToCart } from "@/components/analytics/actions";
import { useCartStore } from "@/components/cart/store";
import { mapShopifyCartLines } from "@/components/cart/useCartHydration";
import Section, { type SectionBg } from "@/components/layout/Section";
import { generateEventId } from "@/lib/analytics/event-id";
import { trackPixelEvent } from "@/lib/analytics/fbq";

const STARS = [0, 1, 2, 3, 4];

// ---------------------------------------------------------------------------
// Exported types
// ---------------------------------------------------------------------------

export type BuyboxPack = {
  qty: number;
  price: number;
  perCard: number;
  save: string | null;
  note: string | null;
  compare: number | null;
  pop: boolean;
  tier?: string;
  tierTone?: "soft" | "cream" | "honey" | "ember";
  variantId?: string;
  availableForSale?: boolean;
};

export type BuyboxGalleryImage = { src: string; alt: string };

export type BuyboxFaqRow = { q: string; a: string };

export type BuyboxProduct = {
  handle: string;
  title: string;
  sub: string;
};

export type BuyboxColor = {
  name: string;      // raw Shopify value e.g. "White", "Black"
  cssColor: string;  // CSS color fallback when no variant image
  imageSrc?: string; // variant image URL (preferred)
  imageAlt?: string; // variant image alt text
};

export type BuyboxProps = {
  product?: BuyboxProduct;
  gallery?: BuyboxGalleryImage[];
  packs?: BuyboxPack[];
  /** Color swatches — only present for multi-option products (e.g. L-Sign). */
  colors?: BuyboxColor[];
  /** Per-color pack lists — keyed by color name. Parallel to `colors`. */
  packsByColor?: Record<string, BuyboxPack[]>;
  checklist?: string[];
  faqRows?: BuyboxFaqRow[];
  ariaLabel?: string;
  nextBg?: SectionBg;
};

// ---------------------------------------------------------------------------
// CR-80 defaults (exported so future PDPs can reference them)
// ---------------------------------------------------------------------------

export const DEFAULT_BUYBOX_PRODUCT: BuyboxProduct = {
  handle: "shmo-review-cr80",
  title: "Google Review NFC Tap Card (CR-80)",
  sub: "The countertop tap that turns happy crews into five-star reviews.",
};

export const DEFAULT_BUYBOX_GALLERY: BuyboxGalleryImage[] = [
  { src: "/products/cr80/transparent/magnific_2884306972.png", alt: "CR-80 NFC tap card, front view" },
  { src: "/products/cr80/transparent/magnific_2884313989.png", alt: "CR-80 NFC tap card, trio stacked" },
  { src: "/products/cr80/transparent/magnific_2884319754.png", alt: "CR-80 NFC tap card, angled" },
  { src: "/products/cr80/transparent/magnific_2884323875.png", alt: "CR-80 NFC tap card, close-up" },
  { src: "/products/cr80/transparent/magnific_2884329985.png", alt: "CR-80 NFC tap card, in hand" },
  { src: "/products/cr80/transparent/magnific_2884336096.png", alt: "CR-80 NFC tap card, back" },
];

export const DEFAULT_BUYBOX_PACKS: BuyboxPack[] = [
  { qty: 1,  price: 29.99,  perCard: 29.99, save: null,  note: "Free shipping at 5+ packs", compare: null,   pop: false, tier: "Try",       tierTone: "cream" },
  { qty: 2,  price: 49.99,  perCard: 25.00, save: null,  note: "Free shipping at 5+ packs", compare: 59.98,  pop: false, tier: "Pair",      tierTone: "cream" },
  { qty: 5,  price: 119.99, perCard: 24.00, save: "20%", note: "Free shipping included",    compare: 149.95, pop: false, tier: "Crew",      tierTone: "honey" },
  { qty: 10, price: 219.99, perCard: 22.00, save: "27%", note: "Free shipping included",    compare: 299.90, pop: true,  tier: "Full crew", tierTone: "ember" },
];

export const DEFAULT_BUYBOX_CHECKLIST: string[] = [
  "Hand-printed in Minneapolis on premium PVC stock",
  "Pre-programmed to your Google review link before shipping",
  "Works on every modern phone — no app, no download",
  "60-day reprogramming + return guarantee",
];

export const DEFAULT_BUYBOX_FAQ_ROWS: BuyboxFaqRow[] = [
  { q: "How it works", a: "Customer taps the card. Their phone opens your Google review page. They post — done." },
  { q: "Shipping", a: "Order by Tuesday 5pm CT, ships Friday. 3-day standard. Free expedited on 10+ packs." },
  { q: "60-day return + reprogramming guarantee", a: "Don't love it? Return for full refund within 60 days. Reprogram destination URL anytime." },
  { q: "Product details", a: "CR-80 / 85.6×54mm / 0.76mm PVC. NTAG 215 NFC chip. QR fallback printed on back. Hand-printed in Minneapolis." },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Buybox({
  product = DEFAULT_BUYBOX_PRODUCT,
  gallery = DEFAULT_BUYBOX_GALLERY,
  packs = DEFAULT_BUYBOX_PACKS,
  colors,
  packsByColor,
  checklist = DEFAULT_BUYBOX_CHECKLIST,
  faqRows = DEFAULT_BUYBOX_FAQ_ROWS,
  ariaLabel = "Buy the CR-80 card",
  nextBg = "marsh",
}: BuyboxProps) {
  const hasColors = colors != null && colors.length > 1 && packsByColor != null;

  const [activeIdx, setActiveIdx] = useState(0);
  const [thumbPage, setThumbPage] = useState(0);
  const [colorIdx, setColorIdx] = useState(0);
  const [packIdx, setPackIdx] = useState(Math.min(3, packs.length - 1)); // 10-pack default (most popular)
  const [qty, setQty] = useState(1);
  const [faqOpen, setFaqOpen] = useState(-1);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Derive the active pack list — filters by selected color for multi-option products
  const currentPacks: BuyboxPack[] =
    hasColors && colors && packsByColor
      ? (packsByColor[colors[colorIdx].name] ?? packs)
      : packs;

  const pack = currentPacks[Math.min(packIdx, currentPacks.length - 1)];
  const lineTotal = (pack.price * qty).toFixed(2);

  const openCart = useCartStore((s) => s.open);

  async function handleAdd() {
    const variantId = pack.variantId;

    // Graceful degradation: if no variantId (Shopify outage / missing data),
    // do NOT attempt the mutation. Surface soft error.
    if (!variantId) {
      setAddError("Couldn't load product details. Refresh and try again.");
      return;
    }

    setAdding(true);
    setAddError(null);
    try {
      const cart = await addLineToCart(variantId, qty);
      const lines = mapShopifyCartLines(cart);
      useCartStore.getState().setCart(cart.id, cart.checkoutUrl, lines);

      // Phase 9 — AddToCart dual-fire (browser Pixel + server CAPI).
      // Fires only after the cart line is confirmed by Shopify. Shared
      // event_id dedupes the pair in Events Manager (48h window).
      // Fire-and-forget — analytics MUST NOT block ATC UX (Pitfall 10).
      const atcEventId = generateEventId();
      const value = Math.round(pack.price * qty * 100) / 100;
      const atcParams = {
        content_ids: [variantId],
        content_type: "product" as const,
        contents: [{ id: variantId, quantity: qty }],
        value,
        currency: "USD" as const,
      };

      // Server fire — independent of browser Pixel load state.
      trackAddToCart({
        params: atcParams,
        eventId: atcEventId,
        fbp: readFbCookie("_fbp") ?? undefined,
        fbc: readFbCookie("_fbc") ?? undefined,
        eventSourceUrl: window.location.href,
      }).catch(() => {
        // Server Action swallows internally — defensive extra catch.
      });

      // Browser fire — fbq may not yet be loaded; poll briefly.
      fireBrowserAtcWithRetry(atcParams, atcEventId);

      openCart();
    } catch (err) {
      // Generic error — never echo Shopify userErrors verbatim (phishing-surface)
      setAddError("Couldn't add to cart. Please try again.");
      // Log to console for dev debugging — production logs surface in Vercel
      console.error("addLineToCart failed", err);
    } finally {
      setAdding(false);
    }
  }

  return (
    <Section bg="marsh" nextBg={nextBg} className="review-buybox" id="buybox" ariaLabel={ariaLabel}>
      <div className="pdp-buybox">
        {/* Gallery */}
        <div className="gal">
          <div className="gal__main">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={gallery[activeIdx].src} alt={gallery[activeIdx].alt} />
          </div>
          {(() => {
            // Responsive page size: 4 on mobile (≤720px) handled via CSS grid;
            // JS pagination uses 6 (desktop). We always paginate in groups of 6
            // so that desktop shows clean pages. Mobile shows 4 per row but still
            // pages every 6 — the two extra on each page just wrap to a second row
            // on very small screens (but since mobile uses 4-col and we show 6,
            // the 5th and 6th sit on a second row; that's fine because mobile
            // pagination will never have >6 per page either way).
            // NOTE: To make mobile pagination use 4 per page we'd need a
            // ResizeObserver — Jordan approved simple constant-6 pages for now.
            const PAGE = 6;
            const totalPages = Math.ceil(gallery.length / PAGE);
            const showNav = gallery.length > PAGE;
            const pageStart = thumbPage * PAGE;
            const pageSlice = gallery.slice(pageStart, pageStart + PAGE);
            const prevDisabled = thumbPage === 0;
            const nextDisabled = thumbPage === totalPages - 1;

            return (
              <div className="gal__nav">
                {showNav && (
                  <button
                    type="button"
                    className="gal__nav-btn gal__nav-btn--prev"
                    onClick={() => setThumbPage((p) => Math.max(0, p - 1))}
                    disabled={prevDisabled}
                    aria-label="Previous thumbnails"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <polyline
                        points="13,4 7,10 13,16"
                        stroke="var(--color-cocoa-deep)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
                <div className="gal__thumbs">
                  {pageSlice.map((t, i) => {
                    const globalIdx = pageStart + i;
                    return (
                      <button
                        key={globalIdx}
                        type="button"
                        className={`gal__thumb${activeIdx === globalIdx ? " is-active" : ""}`}
                        onClick={() => setActiveIdx(globalIdx)}
                        aria-label={`View image ${globalIdx + 1}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={t.src} alt="" />
                      </button>
                    );
                  })}
                </div>
                {showNav && (
                  <button
                    type="button"
                    className="gal__nav-btn gal__nav-btn--next"
                    onClick={() => setThumbPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={nextDisabled}
                    aria-label="Next thumbnails"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <polyline
                        points="7,4 13,10 7,16"
                        stroke="var(--color-cocoa-deep)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
            );
          })()}
        </div>

        {/* Buybox column */}
        <div className="bb">
          <span className="shm-rating">
            <span className="shm-rating__stars">
              {STARS.map((i) => (
                <svg key={i} viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2l3 7h7l-5.6 4.2L18 21l-6-4-6 4 1.6-7.8L2 9h7z" />
                </svg>
              ))}
            </span>
            <span className="shm-rating__num">4.9</span>
            <span className="shm-rating__count">· 87 verified reviews</span>
          </span>

          <h2 className="bb__title">{product.title}</h2>
          <p className="bb__sub">
            <em>{product.sub}</em>
          </p>

          <hr className="bb__rule" />

          <ul className="shm-checklist shm-checklist--featured">
            {checklist.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>

          {/* Pack selector */}
          <fieldset className="shm-pack-rows">
            <legend className="shm-pack-rows__label">Choose your pack</legend>
            {currentPacks.map((p, i) => (
              <label
                key={`${colorIdx}-${i}`}
                className={`shm-pack-row${packIdx === i ? " shm-pack-row--checked" : ""}${p.pop ? " shm-pack-row--pop" : ""}${p.tier ? " shm-pack-row--has-tier" : ""}`}
                data-selected={packIdx === i}
              >
                {p.tier && (
                  <span className={`shm-pack-row__pop shm-badge shm-badge--${p.tierTone ?? "soft"} shm-badge--sm`}>{p.tier}</span>
                )}
                <span className="shm-pack-row__thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.qty >= 5 ? gallery[1].src : gallery[0].src} alt="" />
                </span>
                <span className="shm-pack-row__main">
                  <span className="shm-pack-row__name">
                    {p.qty} Card{p.qty > 1 ? "s" : ""}
                  </span>
                  {p.save && (
                    <span className="shm-badge shm-badge--honey shm-badge--sm">
                      SAVE {p.save}
                    </span>
                  )}
                  {p.note && (
                    <span className="shm-pack-row__note">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <rect x="3" y="8" width="13" height="8" rx="1" />
                        <path d="M16 11h4l1 2v3h-5" />
                        <circle cx="7" cy="18" r="2" />
                        <circle cx="18" cy="18" r="2" />
                      </svg>
                      {p.note}
                    </span>
                  )}
                </span>
                <span className="shm-pack-row__price">
                  <span className="shm-pack-row__price-now">${p.price.toFixed(2)}</span>
                  {p.qty > 1 && (
                    <span className="shm-pack-row__price-meta">
                      ${p.perCard.toFixed(2)} / card
                      {p.compare && (
                        <>
                          {" · "}
                          <s>${p.compare.toFixed(2)}</s>
                        </>
                      )}
                    </span>
                  )}
                </span>
                <input
                  type="radio"
                  name="pack"
                  checked={packIdx === i}
                  onChange={() => setPackIdx(i)}
                />
              </label>
            ))}
          </fieldset>

          {/* Free-shipping progress bar */}
          {(() => {
            const freeShipThreshold = currentPacks.find((p) => p.qty >= 5)?.price ?? Infinity;
            const current = pack.price;
            const unlocked = current >= freeShipThreshold;
            const fillPct = unlocked ? 100 : Math.round((current / freeShipThreshold) * 100);
            const remaining = unlocked ? 0 : freeShipThreshold - current;
            return (
              <div className={`pack-shipping${unlocked ? " pack-shipping--unlocked" : ""}`} aria-live="polite">
                <div className="pack-shipping__bar">
                  <div
                    className="pack-shipping__bar-fill"
                    style={{ width: `${fillPct}%` }}
                    role="progressbar"
                    aria-valuenow={fillPct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={unlocked ? "Free shipping unlocked" : `${fillPct}% toward free shipping`}
                  />
                </div>
                <div className="pack-shipping__label">
                  {unlocked ? (
                    <>
                      <svg
                        className="pack-shipping__icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Free shipping included
                    </>
                  ) : (
                    <>
                      <svg
                        className="pack-shipping__icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <rect x="3" y="8" width="13" height="8" rx="1" />
                        <path d="M16 11h4l1 2v3h-5" />
                        <circle cx="7" cy="18" r="2" />
                        <circle cx="18" cy="18" r="2" />
                      </svg>
                      Add{" "}
                      <strong className="pack-shipping__amount">${remaining.toFixed(2)}</strong>
                      {" "}more to unlock free shipping
                    </>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Color swatches — only shown for multi-option products (e.g. L-Sign).
              Positioned after free-shipping band, before quantity selector. */}
          {hasColors && colors && packsByColor && (
            <div className="shm-color-swatches" role="radiogroup" aria-label="Choose color">
              {colors.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  role="radio"
                  aria-checked={colorIdx === i}
                  aria-label={c.name}
                  className={`shm-color-swatch${colorIdx === i ? " is-active" : ""}`}
                  style={c.imageSrc ? undefined : { background: c.cssColor }}
                  onClick={() => {
                    setColorIdx(i);
                    setPackIdx((prev) =>
                      Math.min(prev, (packsByColor[c.name]?.length ?? 1) - 1)
                    );
                  }}
                  title={c.name}
                >
                  {c.imageSrc && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.imageSrc} alt={c.imageAlt ?? c.name} />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Quantity */}
          <div className="qty-block">
            <span className="qty-label">Quantity</span>
            <div className="shm-qty" role="group" aria-label="Quantity">
              <button
                type="button"
                className="shm-qty__btn"
                disabled={qty <= 1}
                onClick={() => setQty(Math.max(1, qty - 1))}
                aria-label="Decrease"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <span className="shm-qty__val">{qty}</span>
              <button
                type="button"
                className="shm-qty__btn"
                disabled={qty >= 99}
                onClick={() => setQty(Math.min(99, qty + 1))}
                aria-label="Increase"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <line x1="12" y1="5" x2="12" y2="19" />
                </svg>
              </button>
            </div>
          </div>

          <button
            className="bb__cta shm-btn shm-btn--primary shm-btn--xl"
            onClick={handleAdd}
            disabled={adding}
            aria-busy={adding}
          >
            {adding ? "Adding…" : `Add to cart — $${lineTotal}`}
          </button>
          {addError && (
            <p className="bb__add-error" role="alert">{addError}</p>
          )}
          <div className="bb__meta">
            <span>60-day return</span>
            <span>Ships in 3 days</span>
          </div>

          <ul className="shm-faq-list bb__faq">
            {faqRows.map((row, i) => (
              <li
                className={`shm-faq-item${faqOpen === i ? " shm-faq-item--open" : ""}`}
                key={i}
              >
                <button
                  type="button"
                  className="shm-faq-trigger"
                  aria-expanded={faqOpen === i}
                  onClick={() => setFaqOpen(faqOpen === i ? -1 : i)}
                >
                  <span className="shm-faq-question">{row.q}</span>
                  <span className="shm-faq-icon">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <line x1="10" y1="4" x2="10" y2="16" />
                      <line x1="4" y1="10" x2="16" y2="10" />
                    </svg>
                  </span>
                </button>
                {faqOpen === i && <div className="shm-faq-answer">{row.a}</div>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

// Phase 9 — local helpers for AddToCart dual-fire.
// fbp/fbc cookies are non-httpOnly (written by fbevents.js); reading via
// document.cookie is correct. May be undefined on first cart action if
// Pixel hasn't yet set them (Pitfall 7 — accepted; Match Quality improves
// on second cart action after the user has spent time on the site).
function readFbCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : null;
}

// fbq race-fix: window.fbq may not be defined right after page load if
// the Pixel script (next/script afterInteractive) hasn't finished loading.
// Poll briefly (5s budget). The server CAPI fire is independent and already
// landed by the time we attempt this — if the browser fire misses, dedup
// just degrades to CAPI-only for this event (still recovers most signal).
function fireBrowserAtcWithRetry(
  params: Parameters<typeof trackPixelEvent>[1],
  eventId: string,
): void {
  if (typeof window === "undefined") return;
  const start = Date.now();
  const tryFire = () => {
    if (typeof window.fbq === "function") {
      trackPixelEvent("AddToCart", params, eventId);
      return;
    }
    if (Date.now() - start > 5000) return; // 5s budget — accept browser fire missed
    window.setTimeout(tryFire, 100);
  };
  tryFire();
}
