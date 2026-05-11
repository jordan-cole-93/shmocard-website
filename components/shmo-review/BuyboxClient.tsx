"use client";

// components/shmo-review/BuyboxClient.tsx
// All interactive state + DOM for the embedded CR-80 buybox.
//
// Composes design-system primitives end-to-end:
//   .shm-gallery / .shm-gallery__main / .shm-gallery__thumb (gallery)
//   .shm-rating / .shm-rating__stars/__num/__count        (rating)
//   .shm-display / .shm-lede                               (title + subline)
//   .shm-checklist--featured                                (4-bullet list)
//   .shm-pack-rows / .shm-pack-row / .shm-pack-row__*      (pack selector)
//   .shm-callout--success                                   (free-ship band)
//   .shm-qty / .shm-qty__btn / .shm-qty__val               (qty stepper)
//   .shm-google / .shm-google__icon/__input/__hint          (config input)
//   .shm-btn--primary --xl                                  (add-to-cart)
//
// Page-level layout uses .rev-buybox-grid (2-column) + .rev-bb (right
// column rhythm) + .rev-bb__meta (post-CTA strip). No primitive restyles.
//
// CART WIRING: addLineToCart Server Action → updates httpOnly cookie cart
// → on success, open the existing CartDrawer via useCartStore.open().

import { useState, useTransition } from "react";

import type { ShopifyProduct, ShopifyVariant } from "@/lib/shopify/types";
import { addLineToCart } from "@/components/cart/actions";
import { useCartStore } from "@/components/cart/store";
import { mapShopifyCartLines } from "@/components/cart/useCartHydration";

type Copy = {
  subline: string;
  bullets: readonly string[];
  rating: { score: string; countLabel: string };
  meta: readonly string[];
};

type Props = {
  product: ShopifyProduct;
  defaultVariantId: string | null;
  copy: Copy;
};

type PackInfo = {
  variantId: string;
  qty: number;
  price: number;
  compare: number | null;
  perCard: number | null;
  savePct: number;
  freeShip: boolean;
  available: boolean;
  currencyCode: string;
};

const FREE_SHIP_THRESHOLD_USD = 50;

function formatMoney(amount: number, currencyCode: string): string {
  if (currencyCode === "USD") return `$${amount.toFixed(2)}`;
  return `${amount.toFixed(2)} ${currencyCode}`;
}

function parseQty(v: ShopifyVariant): number {
  for (const opt of v.selectedOptions ?? []) {
    const m = opt.value.match(/^(\d+)/);
    if (m) return parseInt(m[1], 10);
  }
  const m = v.title.match(
    /(\d+)\s*[-\s]?cards?|pack\s*of\s*(\d+)|(\d+)\s*[-\s]?pack/i,
  );
  if (m) return parseInt(m[1] ?? m[2] ?? m[3], 10);
  const fallback = v.title.match(/(\d+)/);
  return fallback ? parseInt(fallback[1], 10) : 1;
}

function deriveSinglePrice(variants: ShopifyVariant[]): number {
  const sorted = [...variants].sort(
    (a, b) => parseQty(a) - parseQty(b),
  );
  return Number(sorted[0]?.price.amount ?? 0);
}

function buildPacks(variants: ShopifyVariant[]): PackInfo[] {
  const singlePrice = deriveSinglePrice(variants);
  return variants
    .map((v) => {
      const qty = parseQty(v);
      const price = Number(v.price.amount);
      const compare = qty > 1 ? singlePrice * qty : null;
      const savePct =
        compare && compare > price
          ? Math.round(((compare - price) / compare) * 100)
          : 0;
      const perCard = qty > 1 ? price / qty : null;
      return {
        variantId: v.id,
        qty,
        price,
        compare,
        perCard,
        savePct,
        freeShip: price >= FREE_SHIP_THRESHOLD_USD,
        available: v.availableForSale,
        currencyCode: v.price.currencyCode,
      };
    })
    .sort((a, b) => a.qty - b.qty);
}

function GoogleGIcon() {
  // Google brand logo — multi-color is the intended treatment. Hex literals
  // are Google's brand spec, not Shmocard design tokens.
  return (
    <svg viewBox="0 0 48 48" width="22" height="22" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

function Star() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2l3 7h7l-5.6 4.2L18 21l-6-4-6 4 1.6-7.8L2 9h7z" />
    </svg>
  );
}

function ChecklistTick() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <polyline
        points="20 6 9 17 4 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function BuyboxClient({ product, defaultVariantId, copy }: Props) {
  const packs = buildPacks(product.variants.nodes);
  const popularVariantId =
    packs[packs.length - 1]?.variantId ?? null;

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    defaultVariantId,
  );
  const [quantity, setQuantity] = useState(1);
  const [googleUrl, setGoogleUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const openCart = useCartStore((s) => s.open);
  const setCart = useCartStore((s) => s.setCart);

  const images = product.images.nodes;
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const activeImage = images[activeImageIdx] ?? product.featuredImage ?? null;

  const selectedPack = packs.find((p) => p.variantId === selectedVariantId) ?? packs[0];
  const ctaPriceLabel = selectedPack
    ? formatMoney(selectedPack.price, selectedPack.currencyCode)
    : null;

  const handleAdd = () => {
    if (!selectedVariantId || !selectedPack) return;
    setError(null);
    const attributes = googleUrl.trim()
      ? [{ key: "google_url", value: googleUrl.trim().slice(0, 1024) }]
      : undefined;
    startTransition(async () => {
      try {
        const cart = await addLineToCart(
          selectedVariantId,
          quantity,
          attributes,
        );
        setCart(cart.id, cart.checkoutUrl, mapShopifyCartLines(cart));
        openCart();
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Couldn't add to cart. Try again.",
        );
      }
    });
  };

  return (
    <div className="rev-buybox-grid" aria-label={product.title}>
      {/* ────────── Gallery (left) — thumbs first per .shm-gallery
          grid order (80px thumb strip + 1fr main). ────────── */}
      <div className="shm-gallery rev-bb-gallery">
        {images.length > 1 ? (
          <div className="shm-gallery__thumbs" role="tablist" aria-label="Product images">
            {images.slice(0, 6).map((img, i) => (
              <button
                key={img.url}
                type="button"
                role="tab"
                aria-selected={i === activeImageIdx}
                data-active={i === activeImageIdx ? "true" : undefined}
                className="shm-gallery__thumb"
                onClick={() => setActiveImageIdx(i)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.altText ?? ""} />
              </button>
            ))}
          </div>
        ) : null}
        <div className="shm-gallery__main">
          {activeImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activeImage.url}
              alt={activeImage.altText ?? product.title}
            />
          ) : null}
        </div>
      </div>

      {/* ────────── Buybox column (right) ────────── */}
      <div className="rev-bb">
        <div className="shm-rating">
          <span className="shm-rating__stars" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} />
            ))}
          </span>
          <span className="shm-rating__num">{copy.rating.score}</span>
          <span className="shm-rating__count">· {copy.rating.countLabel}</span>
        </div>

        <h1 className="shm-display rev-bb__title">{product.title}</h1>

        <p className="shm-lede rev-bb__subline">{copy.subline}</p>

        <hr className="rev-bb__rule" />

        <ul className="shm-checklist shm-checklist--featured rev-bb__bullets">
          {copy.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>

        <fieldset className="shm-pack-rows rev-bb__packs">
          <legend className="shm-pack-rows__label">Choose your pack</legend>
          {packs.map((pack) => {
            const checked = pack.variantId === selectedVariantId;
            const isPopular = pack.variantId === popularVariantId && packs.length > 1;
            return (
              <label
                key={pack.variantId}
                className="shm-pack-row"
                data-selected={checked ? "true" : undefined}
              >
                <input
                  type="radio"
                  name="pack"
                  value={pack.variantId}
                  checked={checked}
                  onChange={() => setSelectedVariantId(pack.variantId)}
                  disabled={!pack.available}
                />
                <span className="shm-pack-row__thumb">
                  {activeImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={(images[0] ?? activeImage).url}
                      alt=""
                    />
                  ) : null}
                </span>
                <span className="shm-pack-row__main">
                  <span className="shm-pack-row__name">
                    {pack.qty} {pack.qty === 1 ? "Card" : "Cards"}
                    {pack.savePct > 0 ? (
                      <span className="shm-pack-row__save shm-badge shm-badge--ember">
                        SAVE {pack.savePct}%
                      </span>
                    ) : null}
                  </span>
                  {pack.freeShip ? (
                    <span className="shm-pack-row__note">
                      <ChecklistTick />
                      Free shipping included
                    </span>
                  ) : null}
                </span>
                <span className="shm-pack-row__price">
                  <span className="shm-pack-row__price-now">
                    {formatMoney(pack.price, pack.currencyCode)}
                  </span>
                  {pack.perCard !== null && pack.compare !== null ? (
                    <span className="shm-pack-row__price-meta">
                      {formatMoney(pack.perCard, pack.currencyCode)} / card ·{" "}
                      <s>{formatMoney(pack.compare, pack.currencyCode)}</s>
                    </span>
                  ) : null}
                </span>
                {isPopular ? (
                  <span className="shm-pack-row__pop shm-badge shm-badge--ember">
                    Most popular
                  </span>
                ) : null}
              </label>
            );
          })}
        </fieldset>

        <div className="shm-callout shm-callout--success rev-bb__callout">
          <span className="shm-callout__icon" aria-hidden="true">
            <ChecklistTick />
          </span>
          <span>
            <span className="shm-callout__title">Free shipping included</span>
            <span className="shm-callout__sub">
              On all orders over {formatMoney(FREE_SHIP_THRESHOLD_USD, "USD")}
            </span>
          </span>
        </div>

        <div className="rev-bb__qty-block">
          <div className="rev-bb__field-label">Quantity</div>
          <div className="shm-qty" role="group" aria-label="Quantity">
            <button
              type="button"
              className="shm-qty__btn"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
            >
              –
            </button>
            <span className="shm-qty__val" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              className="shm-qty__btn"
              aria-label="Increase quantity"
              onClick={() => setQuantity((q) => Math.min(99, q + 1))}
              disabled={quantity >= 99}
            >
              +
            </button>
          </div>
        </div>

        <div className="rev-bb__config">
          <div className="rev-bb__field-label">Configure (optional)</div>
          <label className="shm-google">
            <span className="shm-google__icon">
              <GoogleGIcon />
            </span>
            <input
              type="text"
              className="shm-google__input"
              placeholder="Find your business on Google"
              value={googleUrl}
              onChange={(e) => setGoogleUrl(e.target.value)}
              maxLength={1024}
            />
          </label>
          <p className="shm-google__hint">
            Found us? We&rsquo;ll pre-program your card before it ships. Skip
            and configure after delivery.
          </p>
        </div>

        <button
          type="button"
          className="shm-btn shm-btn--primary shm-btn--xl rev-bb__cta"
          onClick={handleAdd}
          disabled={
            pending || !selectedVariantId || !selectedPack?.available
          }
        >
          {pending
            ? "Adding…"
            : `Add to cart${ctaPriceLabel ? ` — ${ctaPriceLabel}` : ""}`}
        </button>

        {error ? (
          <p className="rev-bb__error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="rev-bb__meta">
          {copy.meta.map((m, i) => (
            <span key={m}>
              {i > 0 ? " · " : null}
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
