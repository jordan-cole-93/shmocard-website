// components/shmo-review/FormatPicker.tsx — Shmo Review format picker.
// Composes .shm-product primitive (components.css:1011-1109).
// Page-level layout owns .format-grid only.
//
// Product data (name, price, image, handle, availableForSale) fetched
// from Shopify Storefront API via getProductByHandle. Marketing-copy
// fields (sub, blurb, badge) remain as page-level framing copy.
//
// Handles (from context/general/backend.md):
//   CR-80  → google-reviews-nfc-tap-card-cr80
//   L-Sign → google-review-nfc-tap-card-l-sign
//   Square → google-review-plaque
//
// Server component.

import Section from "@/components/layout/Section";
import type { SectionBg } from "@/components/layout/Section";
import { getProductByHandle } from "@/lib/shopify/queries";
import type { ShopifyProduct } from "@/lib/shopify/types";

// Framing copy — page-level merchandising decisions, not product attributes.
const FORMAT_COPY: Record<
  string,
  {
    sub: string;
    blurb: string;
    badge: string | null;
    badgeTone: "ember" | "honey" | "soft";
  }
> = {
  "google-reviews-nfc-tap-card-cr80": {
    sub: "Wallet-size · PVC · best seller",
    blurb:
      "The countertop tap that turns happy crews into five-star reviews. Hand it over after every transaction.",
    badge: "Best seller",
    badgeTone: "ember",
  },
  "google-review-nfc-tap-card-l-sign": {
    sub: "Counter standee · 4×6 acrylic",
    blurb:
      "A clear acrylic standee for the counter. Tap, scan, done. Stays put when the crew is busy.",
    badge: null,
    badgeTone: "soft",
  },
  "google-review-plaque": {
    sub: 'Disc · 2.25" · sticks anywhere',
    blurb:
      "An adhesive-backed disc. Sticks to laptops, tablets, registers, dashboards. Travels with the crew.",
    badge: "New",
    badgeTone: "honey",
  },
};

// Fallback images used only when Shopify returns no image for a product.
// TODO(shopify): remove once all products have images in Shopify Admin.
const FALLBACK_IMAGES: Record<string, { src: string; alt: string }> = {
  "google-reviews-nfc-tap-card-cr80": {
    src: "/products/cr80/transparent/magnific_2884306972.png",
    alt: "Shmo Review CR-80 card",
  },
  "google-review-nfc-tap-card-l-sign": {
    src: "/products/l-sign/transparent/magnific_2884477047.png",
    alt: "Shmo Review L-Sign counter standee",
  },
  "google-review-plaque": {
    src: "/products/plate/transparent/magnific_2885042834.png",
    alt: "Shmo Review Square Card disc",
  },
};

const HANDLES = [
  "google-reviews-nfc-tap-card-cr80",
  "google-review-nfc-tap-card-l-sign",
  "google-review-plaque",
] as const;

function formatPrice(amount: string, currencyCode: string): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

type Props = {
  bg?: SectionBg;
  nextBg?: SectionBg;
};

export default async function FormatPicker({ bg = "cream", nextBg = "marsh" }: Props = {}) {
  // Fetch all three products in parallel. Null = product not found in Shopify.
  const products = await Promise.all(
    HANDLES.map((h) => getProductByHandle(h)),
  );

  return (
    <Section bg={bg} nextBg={nextBg} className="format-picker" id="formats" ariaLabel="Pick a Shmo Review format">
      <div className="shm-section-head">
        <span className="shm-eyebrow">Four formats · same chip · same dashboard</span>
        <h2 className="shm-h2">
          Pick the shape that <em>fits</em> your shop.
        </h2>
        <p className="shm-lede">
          All four use the same reprogrammable NFC chip and ship pre-loaded with your Google review
          link. Mix and match — discounts stack across the whole order.
        </p>
      </div>
      <div className="format-grid">
        {HANDLES.map((handle, i) => {
          const product: ShopifyProduct | null = products[i];
          const copy = FORMAT_COPY[handle];
          const fallback = FALLBACK_IMAGES[handle];

          // Product not found in Shopify — render disabled placeholder card.
          if (!product) {
            return (
              <article className="shm-product" key={handle}>
                <a className="shm-product__media" href="#formats">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={fallback.src} alt={fallback.alt} />
                </a>
                <div className="shm-product__body">
                  <h3 className="shm-product__name">{fallback.alt}</h3>
                  <p className="shm-product__sub">{copy.sub}</p>
                  <div className="shm-product__row">
                    <span className="shm-product__price">—</span>
                    <button className="shm-btn shm-btn--ghost shm-btn--sm" disabled type="button">Coming soon</button>
                  </div>
                </div>
              </article>
            );
          }

          const imageUrl =
            product.featuredImage?.url ??
            product.images.nodes[0]?.url ??
            fallback.src;
          const imageAlt =
            product.featuredImage?.altText ??
            product.images.nodes[0]?.altText ??
            fallback.alt;
          const price = formatPrice(
            product.priceRange.minVariantPrice.amount,
            product.priceRange.minVariantPrice.currencyCode,
          );
          const href = `/products/${product.handle}`;

          return (
            <article className="shm-product" key={product.handle}>
              <a className="shm-product__media" href={href}>
                {copy.badge && (
                  <span className="shm-product__tag">
                    <span className={`shm-badge shm-badge--${copy.badgeTone}`}>
                      {copy.badge}
                    </span>
                  </span>
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt={imageAlt ?? ""} />
              </a>
              <div className="shm-product__body">
                <h3 className="shm-product__name">{product.title}</h3>
                <p className="shm-product__sub">{copy.sub}</p>
                <div className="shm-product__row">
                  <span className="shm-product__price">{price}</span>
                  {product.availableForSale ? (
                    <a className="shm-btn shm-btn--primary shm-btn--sm" href={href}>View product</a>
                  ) : (
                    <button className="shm-btn shm-btn--ghost shm-btn--sm" disabled type="button">Coming soon</button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
