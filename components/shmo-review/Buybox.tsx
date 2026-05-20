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
import { useCartStore } from "@/components/cart/store";
import { mapShopifyCartLines } from "@/components/cart/useCartHydration";
import Section, { type SectionBg } from "@/components/layout/Section";

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

export type BuyboxProps = {
  product?: BuyboxProduct;
  gallery?: BuyboxGalleryImage[];
  packs?: BuyboxPack[];
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
  { qty: 1,  price: 29.99,  perCard: 29.99, save: null,  note: null,                       compare: null,   pop: false },
  { qty: 2,  price: 49.99,  perCard: 25.00, save: null,  note: null,                       compare: 59.98,  pop: false },
  { qty: 5,  price: 119.99, perCard: 24.00, save: "20%", note: "Free shipping included",   compare: 149.95, pop: false },
  { qty: 10, price: 219.99, perCard: 22.00, save: "27%", note: "Free shipping included",   compare: 299.90, pop: true  },
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
  checklist = DEFAULT_BUYBOX_CHECKLIST,
  faqRows = DEFAULT_BUYBOX_FAQ_ROWS,
  ariaLabel = "Buy the CR-80 card",
  nextBg = "marsh",
}: BuyboxProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [packIdx, setPackIdx] = useState(Math.min(3, packs.length - 1)); // 10-pack default (most popular)
  const [qty, setQty] = useState(1);
  const [faqOpen, setFaqOpen] = useState(-1);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const pack = packs[packIdx];
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
          <div className="gal__thumbs">
            {gallery.map((t, i) => (
              <button
                key={i}
                type="button"
                className={`gal__thumb${activeIdx === i ? " is-active" : ""}`}
                onClick={() => setActiveIdx(i)}
                aria-label={`View image ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.src} alt="" />
              </button>
            ))}
          </div>
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
            {packs.map((p, i) => (
              <label
                key={i}
                className={`shm-pack-row${packIdx === i ? " shm-pack-row--checked" : ""}${p.pop ? " shm-pack-row--pop" : ""}`}
                data-selected={packIdx === i}
              >
                {p.pop && (
                  <span className="shm-pack-row__pop shm-badge shm-badge--ember shm-badge--sm">Most popular</span>
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
