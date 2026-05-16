"use client";

// components/shmo-review/Buybox.tsx — Shmo Review CR-80 buybox (PDP).
// Phase 3. Ported 1:1 from
// .claude/skills/shmocard-design-system/ui_kits/website/homepage-shmoreview/review-buybox.jsx:1-225
// + review.css:286-353 (+ 1037-1058 breakpoints).
//
// PLACEHOLDER PRODUCT DATA. Every product field (handle / title / sub /
// pack prices / SKUs / image URLs) is hardcoded with a TODO(shopify):
// marker. A future phase swaps these to Storefront API + variant
// metafields via the shmocard-shopify-work wrapper. See plan in
// context/brainstorming/shmo-review.md.
//
// Composes design-system primitives only:
//   .shm-rating, .shm-eyebrow, .shm-h2, .shm-btn--primary/--xl,
//   .shm-checklist--featured, .shm-pack-rows + .shm-pack-row,
//   .shm-callout--success, .shm-qty, .shm-google, .shm-faq-list,
//   .shm-badge--ember/--honey, .shm-section-head--start.
// No primitive restyles. Layout-only CSS lives in shmo-review.css.

import { useState } from "react";

import { useCartStore } from "@/components/cart/store";
import type { CartLine } from "@/components/cart/types";
import Section, { type SectionBg } from "@/components/layout/Section";

const STARS = [0, 1, 2, 3, 4];

// TODO(shopify): replace with Storefront API product query result.
const PRODUCT = {
  handle: "shmo-review-cr80",
  title: "Google Review NFC Tap Card (CR-80)",
  sub: "The countertop tap that turns happy crews into five-star reviews.",
};

// TODO(shopify): swap gallery to Shopify product.images.nodes[].url.
const GALLERY: Array<{ src: string; alt: string }> = [
  { src: "/products/cr80/transparent/magnific_2884306972.png", alt: "CR-80 NFC tap card, front view" },
  { src: "/products/cr80/transparent/magnific_2884313989.png", alt: "CR-80 NFC tap card, trio stacked" },
  { src: "/products/cr80/transparent/magnific_2884319754.png", alt: "CR-80 NFC tap card, angled" },
  { src: "/products/cr80/transparent/magnific_2884323875.png", alt: "CR-80 NFC tap card, close-up" },
  { src: "/products/cr80/transparent/magnific_2884329985.png", alt: "CR-80 NFC tap card, in hand" },
  { src: "/products/cr80/transparent/magnific_2884336096.png", alt: "CR-80 NFC tap card, back" },
];

// TODO(shopify): pack pricing tiers come from Shopify variants + metafields.
const PACKS = [
  { qty: 1,  price: 29.99,  perCard: 29.99, save: null,  note: null,                       compare: null,   pop: false },
  { qty: 2,  price: 49.99,  perCard: 25.00, save: null,  note: null,                       compare: 59.98,  pop: false },
  { qty: 5,  price: 119.99, perCard: 24.00, save: "20%", note: "Free shipping included",   compare: 149.95, pop: false },
  { qty: 10, price: 219.99, perCard: 22.00, save: "27%", note: "Free shipping included",   compare: 299.90, pop: true  },
];

const CHECKLIST = [
  "Hand-printed in Minneapolis on premium PVC stock",
  "Pre-programmed to your Google review link before shipping",
  "Works on every modern phone — no app, no download",
  "60-day reprogramming + return guarantee",
];

const FAQ_ROWS = [
  { q: "How it works", a: "Customer taps the card. Their phone opens your Google review page. They post — done." },
  { q: "Shipping", a: "Order by Tuesday 5pm CT, ships Friday. 3-day standard. Free expedited on 10+ packs." },
  { q: "60-day return + reprogramming guarantee", a: "Don't love it? Return for full refund within 60 days. Reprogram destination URL anytime." },
  { q: "Product details", a: "CR-80 / 85.6×54mm / 0.76mm PVC. NTAG 215 NFC chip. QR fallback printed on back. Hand-printed in Minneapolis." },
];

export default function Buybox({ nextBg = "marsh" }: { nextBg?: SectionBg }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [packIdx, setPackIdx] = useState(3); // 10-pack default (most popular)
  const [qty, setQty] = useState(1);
  const [gInput, setGInput] = useState("");
  const [faqOpen, setFaqOpen] = useState(-1);

  const pack = PACKS[packIdx];
  const lineTotal = (pack.price * qty).toFixed(2);

  const addLine = useCartStore((s) => s.addLine);
  const openCart = useCartStore((s) => s.open);

  function handleAdd() {
    // TODO(shopify): wire to Storefront API cartLinesAdd via Server Action.
    // The placeholder line goes straight into the local Zustand store so
    // the existing cart drawer + count badge work end-to-end visually.
    // When Shopify lands, swap addLine() for the actions.ts mutation
    // and rely on the server reconcile to refresh `lines`.
    const line: CartLine = {
      id: `local-${Date.now()}-${packIdx}`,
      merchandiseId: `placeholder:cr80-pack-${pack.qty}`, // TODO(shopify)
      productHandle: PRODUCT.handle, // TODO(shopify)
      title: PRODUCT.title, // TODO(shopify)
      variantTitle: `${pack.qty}-pack`,
      price: pack.price.toFixed(2), // TODO(shopify)
      currencyCode: "USD",
      imageUrl: GALLERY[0].src, // TODO(shopify)
      imageAlt: GALLERY[0].alt,
      quantity: qty,
    };
    addLine(line);
    openCart();
  }

  return (
    <Section bg="marsh" nextBg={nextBg} className="review-buybox" id="buybox" ariaLabel="Buy the CR-80 card">
      <div className="shm-section-head shm-section-head--start">
        <span className="shm-eyebrow">★ Best seller · CR-80</span>
        <h2 className="shm-h2">
          Get the card the crews <em>actually</em> reach for.
        </h2>
      </div>

      <div className="pdp-buybox">
        {/* Gallery */}
        <div className="gal">
          <div className="gal__main">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY[activeIdx].src} alt={GALLERY[activeIdx].alt} />
          </div>
          <div className="gal__thumbs">
            {GALLERY.map((t, i) => (
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

          <h3 className="bb__title">{PRODUCT.title}</h3>
          <p className="bb__sub">
            <em>{PRODUCT.sub}</em>
          </p>

          <hr className="bb__rule" />

          <ul className="shm-checklist shm-checklist--featured">
            {CHECKLIST.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>

          {/* Pack selector */}
          <fieldset className="shm-pack-rows">
            <legend className="shm-pack-rows__label">Choose your pack</legend>
            {PACKS.map((p, i) => (
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
                  <img src={p.qty >= 5 ? GALLERY[1].src : GALLERY[0].src} alt="" />
                </span>
                <span className="shm-pack-row__main">
                  <span className="shm-pack-row__name">
                    {p.qty} Card{p.qty > 1 ? "s" : ""}
                    {p.save && (
                      <span className="shm-badge shm-badge--honey shm-badge--sm" style={{ marginLeft: 8 }}>
                        SAVE {p.save}
                      </span>
                    )}
                  </span>
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

          {/* Free shipping callout — only for qualifying packs */}
          {pack.price >= 55 && (
            <div className="shm-callout shm-callout--success">
              <span className="shm-callout__icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>
                <span className="shm-callout__title">Free shipping included</span>
                <span className="shm-callout__sub">On all orders over $55.00</span>
              </span>
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

          {/* Configure (Google input) */}
          <div className="config">
            <span className="config__label">Configure (optional)</span>
            <div className="shm-google">
              <span className="shm-google__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M21.35 11.1H12v3.83h5.51c-.25 1.37-1.5 4-5.51 4-3.31 0-6.01-2.74-6.01-6.12 0-3.38 2.7-6.13 6.01-6.13 1.88 0 3.14.8 3.86 1.49l2.63-2.55C16.85 4.06 14.65 3 12 3 7.03 3 3 7.03 3 12s4.03 9 9 9c5.2 0 8.65-3.65 8.65-8.78 0-.59-.06-1.04-.13-1.5z"
                    fill="#EA4335"
                  />
                  <path
                    d="M21.35 11.1H12v3.83h5.51a5.61 5.61 0 0 1-2.4 3.66l3.86 2.99c2.25-2.08 3.55-5.13 3.55-8.98 0-.59-.06-1.04-.13-1.5z"
                    fill="#4285F4"
                  />
                  <path d="M5.99 14.32a5.99 5.99 0 0 1 0-4.64L2.13 6.69a9 9 0 0 0 0 10.62l3.86-2.99z" fill="#FBBC05" />
                  <path
                    d="M12 21c2.65 0 4.85-.87 6.47-2.42l-3.86-2.99c-1.05.7-2.42 1.18-3.61 1.18-2.78 0-5.13-1.84-5.97-4.45L2.13 14.3C3.92 18.27 7.65 21 12 21z"
                    fill="#34A853"
                  />
                </svg>
              </span>
              <input
                type="text"
                className="shm-google__input"
                placeholder="Find your business on Google"
                value={gInput}
                onChange={(e) => setGInput(e.target.value)}
              />
            </div>
            <div className="config__hint">
              Found us? We&apos;ll pre-program your card before it ships. Skip and configure after delivery.
            </div>
          </div>

          <button className="bb__cta shm-btn shm-btn--primary shm-btn--xl" onClick={handleAdd}>
            Add to cart — ${lineTotal}
          </button>
          <div className="bb__meta">
            <span>60-day return</span>
            <span>Ships in 3 days</span>
          </div>

          <ul className="shm-faq-list bb__faq">
            {FAQ_ROWS.map((row, i) => (
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
