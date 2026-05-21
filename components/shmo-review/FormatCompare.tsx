// components/shmo-review/FormatCompare.tsx — Format comparison section.
// Shared decision-support section for CR-80, L-Sign, and Square Card PDPs.
// Composes .shm-product primitive (components.css).
// Async server component — fetches Shopify products in parallel.
//
// Mount on a PDP by passing the current product's handle as `currentHandle`.
// The current card renders a disabled ghost "You're here" button.

import Section from "@/components/layout/Section";
import { getProductByHandle } from "@/lib/shopify/queries";
import type { ShopifyProduct } from "@/lib/shopify/types";

// Framing copy — page-level merchandising decisions, not product attributes.
// Inline duplicate of FormatPicker constants.
// DO NOT extract to a shared lib until that task is explicitly planned.
const FORMAT_COPY: Record<
  string,
  {
    sub: string;
    badge: string | null;
    badgeTone: "ember" | "honey" | "soft";
  }
> = {
  "google-reviews-nfc-tap-card-cr80": {
    sub: "Wallet-size · PVC · best seller",
    badge: "Best seller",
    badgeTone: "ember",
  },
  "google-review-nfc-tap-card-l-sign": {
    sub: "Counter standee · 4×6 acrylic",
    badge: null,
    badgeTone: "soft",
  },
  "google-review-plaque": {
    sub: 'Disc · 2.25" · sticks anywhere',
    badge: "New",
    badgeTone: "honey",
  },
};

const HANDLES = [
  "google-reviews-nfc-tap-card-cr80",
  "google-review-nfc-tap-card-l-sign",
  "google-review-plaque",
] as const;

const PRODUCT_PAGE_HREFS: Record<(typeof HANDLES)[number], string> = {
  "google-reviews-nfc-tap-card-cr80": "/shmo-review/cr-80",
  "google-review-nfc-tap-card-l-sign": "/shmo-review/l-sign",
  "google-review-plaque": "/shmo-review/square-card",
};

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

export type FormatCompareProps = {
  currentHandle: string;
};

export default async function FormatCompare({ currentHandle }: FormatCompareProps) {
  // Fetch all three products in parallel. Null = product not found in Shopify.
  const products = await Promise.all(
    HANDLES.map((h) => getProductByHandle(h)),
  );

  return (
    <Section
      bg="cream"
      className="format-compare"
      id="format-compare"
      ariaLabel="Compare Shmo Review formats"
    >
      <div className="shm-section-head">
        <span className="shm-eyebrow">Three formats · same chip</span>
        <h2 className="shm-h2">
          Not sure this is the <em>right</em> one?
        </h2>
        <p className="shm-lede">
          All three use the same reprogrammable NFC chip and ship pre-loaded
          with your review link.
        </p>
      </div>
      <div className="format-grid">
        {HANDLES.map((handle, i) => {
          const product: ShopifyProduct | null = products[i];
          const copy = FORMAT_COPY[handle];
          const href = PRODUCT_PAGE_HREFS[handle];
          const isCurrent = handle === currentHandle;

          // Product not found in Shopify — render disabled placeholder card.
          if (!product) {
            return (
              <article className="shm-product" key={handle} data-current={isCurrent || undefined}>
                <div className="shm-product__media" />
                <div className="shm-product__body">
                  <h3 className="shm-product__name">{copy.sub}</h3>
                  <p className="shm-product__sub">{copy.sub}</p>
                  <div className="shm-product__row">
                    <span className="shm-product__price">—</span>
                    <button className="shm-btn shm-btn--ghost shm-btn--sm" disabled type="button">
                      {isCurrent ? "You're here" : "Coming soon"}
                    </button>
                  </div>
                </div>
              </article>
            );
          }

          const imageUrl =
            product.featuredImage?.url ??
            product.images.nodes[0]?.url ??
            "";
          const imageAlt =
            product.featuredImage?.altText ??
            product.images.nodes[0]?.altText ??
            "";
          const price = formatPrice(
            product.priceRange.minVariantPrice.amount,
            product.priceRange.minVariantPrice.currencyCode,
          );

          return (
            <article
              key={product.handle}
              className="shm-product"
              data-current={isCurrent || undefined}
            >
              {isCurrent ? (
                <div className="shm-product__media">
                  {copy.badge && (
                    <span className="shm-product__tag">
                      <span className={`shm-badge shm-badge--${copy.badgeTone}`}>
                        {copy.badge}
                      </span>
                    </span>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt={imageAlt ?? ""} />
                </div>
              ) : (
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
              )}
              <div className="shm-product__body">
                <h3 className="shm-product__name">{product.title}</h3>
                <p className="shm-product__sub">{copy.sub}</p>
                <div className="shm-product__row">
                  <span className="shm-product__price">{price}</span>
                  {isCurrent ? (
                    <button
                      className="shm-btn shm-btn--ghost shm-btn--sm"
                      type="button"
                      disabled
                      aria-disabled="true"
                    >
                      {"You're here"}
                    </button>
                  ) : product.availableForSale ? (
                    <a className="shm-btn shm-btn--primary shm-btn--sm" href={href}>
                      View product
                    </a>
                  ) : (
                    <button className="shm-btn shm-btn--ghost shm-btn--sm" disabled type="button">
                      Coming soon
                    </button>
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
