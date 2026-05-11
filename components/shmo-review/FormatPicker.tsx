// components/shmo-review/FormatPicker.tsx
// 3-card format picker (CR-80 / L-Sign / Square Card). Server component.
//
// Composes `.shm-card --cream --hover` + `.shm-image-frame --bare` + `.shm-badge`.
// Page CSS owns layout only (.rev-format-grid + small layout helpers).
//
// SHOPIFY DATA DISCIPLINE:
//   - Presentation data (name, blurb, badge text, badge tone) lives in
//     data.ts::REVIEW_FORMATS. Framing decisions, not product attributes.
//   - Product data (price, image) is fetched live from Shopify via
//     getProductByHandle. No hardcoded prices, SKUs, or image paths.
//   - If a Shopify handle is not yet provisioned, the card renders without
//     a price (no fabricated fallback) and still links through to the PDP.
//
// Reference: .claude/rules/shopify-data-discipline.md
// Refactor: 2026-05-11 — formerly used a `.rev-format-card` BEM primitive
// that rebuilt `.shm-card` from scratch (audit C1). Now composes primitives.

import Link from "next/link";
import { getProductByHandle } from "@/lib/shopify/queries";
import type { ShopifyProduct } from "@/lib/shopify/types";
import { REVIEW_FORMATS, type ReviewFormat } from "./data";

type BadgeTone = "ember" | "honey" | "soft";

function badgeToneFor(text: string): BadgeTone {
  const t = text.toLowerCase();
  if (t.includes("seller") || t.includes("best")) return "honey";
  if (t.includes("save") || t.includes("limited")) return "ember";
  return "soft";
}

function formatMoney(amount: string, currencyCode: string): string {
  const n = Number(amount);
  if (!Number.isFinite(n)) return `${amount} ${currencyCode}`;
  if (currencyCode === "USD") return `$${n.toFixed(2)}`;
  return `${n.toFixed(2)} ${currencyCode}`;
}

type ResolvedFormat = ReviewFormat & {
  product: ShopifyProduct | null;
};

async function resolveFormats(): Promise<ResolvedFormat[]> {
  const products = await Promise.all(
    REVIEW_FORMATS.map((f) => getProductByHandle(f.shopifyHandle)),
  );
  return REVIEW_FORMATS.map((format, i) => ({
    ...format,
    product: products[i],
  }));
}

export default async function FormatPicker() {
  const formats = await resolveFormats();

  return (
    <>
      <div className="shm-section-head">
        <span className="shm-eyebrow">
          Three formats · same chip · same dashboard
        </span>
        <h2 className="shm-h2">
          Pick the shape that <em>fits</em> your shop.
        </h2>
        <p className="shm-lede">
          All three use the same reprogrammable NFC chip and ship pre-loaded
          with your Google review link. Mix and match — discounts stack
          across the whole order.
        </p>
      </div>

      <div className="rev-format-grid">
        {formats.map(({ slug, name, badge, kicker, blurb, href, product }) => {
          const image =
            product?.featuredImage ?? product?.images.nodes[0] ?? null;
          const price = product?.priceRange.minVariantPrice;
          const priceLabel = price
            ? formatMoney(price.amount, price.currencyCode)
            : null;
          const tone = badgeToneFor(badge);

          return (
            <Link
              key={slug}
              href={href}
              className="shm-card shm-card--cream shm-card--hover rev-format-card"
            >
              <span
                className={`shm-badge shm-badge--${tone} rev-format-card__badge`}
              >
                {badge}
              </span>
              <div className="shm-image-frame shm-image-frame--bare rev-format-card__media">
                {image ? (
                  <img
                    src={image.url}
                    alt={image.altText ?? `${name} — Shmo Review NFC card`}
                    loading="lazy"
                  />
                ) : null}
              </div>
              <div className="rev-format-card__body">
                <h3 className="shm-h3 rev-format-card__name">{name}</h3>
                <span className="shm-eyebrow rev-format-card__kicker">
                  {kicker}
                </span>
                <p className="rev-format-card__blurb">{blurb}</p>
                <div className="rev-format-card__foot">
                  {priceLabel ? (
                    <>
                      <span className="rev-format-card__price">
                        {priceLabel}
                      </span>
                      <span className="rev-format-card__price-meta">
                        Bulk pricing on 5+
                      </span>
                    </>
                  ) : (
                    <span className="rev-format-card__price-meta">
                      See details
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
