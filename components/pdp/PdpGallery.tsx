"use client";

// components/pdp/PdpGallery.tsx
// Main image + thumb strip. Active-thumb state held locally.
//
// Receives images from the Storefront API response (plain image objects).
// Falls back to a single neutral marshmallow tile if the product has no
// images attached in Shopify (rare but possible during onboarding).
//
// The wrapper carries id="pdp-gallery" so PdpStickyBar's IntersectionObserver
// can watch it. When the gallery exits the viewport from the top, the
// sticky bar slides DOWN.

import { useState } from "react";
import type { ShopifyImage } from "@/lib/shopify/types";

type Props = {
  images: ShopifyImage[];
  productTitle: string;
};

export default function PdpGallery({ images, productTitle }: Props) {
  const safeImages: ShopifyImage[] =
    images && images.length > 0
      ? images
      : [
          {
            url: "",
            altText: productTitle,
            width: null,
            height: null,
          },
        ];

  const [activeIdx, setActiveIdx] = useState(0);
  const active = safeImages[activeIdx] ?? safeImages[0];

  return (
    <div id="pdp-gallery" className="pdp-gal">
      <div className="pdp-gal__main">
        {active.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={active.url}
            alt={active.altText ?? productTitle}
            width={active.width ?? undefined}
            height={active.height ?? undefined}
          />
        ) : null}
      </div>
      {safeImages.length > 1 ? (
        <div className="pdp-gal__thumbs">
          {safeImages.map((img, i) => (
            <button
              key={img.url || i}
              type="button"
              className="pdp-gal__thumb"
              data-active={i === activeIdx ? "true" : "false"}
              onClick={() => setActiveIdx(i)}
              aria-label={`Show image ${i + 1} of ${safeImages.length}`}
            >
              {img.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img.url} alt={img.altText ?? ""} />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
