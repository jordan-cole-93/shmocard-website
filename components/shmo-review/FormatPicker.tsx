// components/shmo-review/FormatPicker.tsx — Shmo Review format picker.
// Phase 4. Composes the .shm-product primitive from the design system
// (components.css:1011-1109). Page-level layout only owns .format-grid
// + a tiny .format-blurb / .format-price-meta helper for the extra body
// rows that .shm-product__body doesn't otherwise provide.
//
// Reference data from REVIEW_FORMATS (review-data.jsx:10-47).
//
// PLACEHOLDER PRODUCT DATA. Pricing + names hardcoded with TODO(shopify)
// markers — swapped to Storefront in a future phase.
//
// Server component.

import Section from "@/components/layout/Section";
import type { SectionBg } from "@/components/layout/Section";

// TODO(shopify): pricing comes from each format's Shopify product.
const REVIEW_FORMATS: Array<{
  id: string;
  name: string;
  sub: string;
  blurb: string;
  price: string;
  priceMeta: string;
  art: string;
  artAlt: string;
  badge: string | null;
  badgeTone: "ember" | "honey" | "soft";
  href: string;
}> = [
  {
    id: "cr80",
    name: "CR-80 Card",
    sub: "Wallet-size · PVC · best seller",
    blurb:
      "The countertop tap that turns happy crews into five-star reviews. Hand it over after every transaction.",
    price: "$29.99",
    priceMeta: "Bulk: $22 / card",
    art: "/products/cr80/transparent/magnific_2884306972.png",
    artAlt: "Shmo Review CR-80 card",
    badge: "Best seller",
    badgeTone: "ember",
    href: "#buybox",
  },
  {
    id: "lsign",
    name: "L-Sign",
    sub: "Counter standee · 4×6 acrylic",
    blurb:
      "A clear acrylic standee for the counter. Tap, scan, done. Stays put when the crew is busy.",
    price: "$39.99",
    priceMeta: "Bulk: $32 / sign",
    art: "/products/l-sign/transparent/magnific_2884477047.png",
    artAlt: "Shmo Review L-Sign counter standee",
    badge: null,
    badgeTone: "soft",
    href: "#",
  },
  {
    id: "square",
    name: "Square Card",
    sub: 'Disc · 2.25" · sticks anywhere',
    blurb:
      "An adhesive-backed disc. Sticks to laptops, tablets, registers, dashboards. Travels with the crew.",
    price: "$24.99",
    priceMeta: "Bulk: $18 / disc",
    art: "/products/plate/transparent/magnific_2885042834.png",
    artAlt: "Shmo Review Square Card disc",
    badge: "New",
    badgeTone: "honey",
    href: "#",
  },
];

type Props = {
  bg?: SectionBg;
  nextBg?: SectionBg;
};

export default function FormatPicker({ bg = "marsh", nextBg = "marsh" }: Props = {}) {
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
        {REVIEW_FORMATS.map((f) => (
          <a className="shm-product" href={f.href} key={f.id}>
            <div className="shm-product__media">
              {f.badge && (
                <span
                  className={`shm-product__tag shm-badge shm-badge--${f.badgeTone}`}
                >
                  {f.badge}
                </span>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.art} alt={f.artAlt} />
            </div>
            <div className="shm-product__body">
              <h3 className="shm-product__name">{f.name}</h3>
              <p className="shm-product__sub">{f.sub}</p>
              <p className="format-blurb">{f.blurb}</p>
              <div className="shm-product__row">
                <span className="shm-product__price">{f.price}</span>
                <span className="format-price-meta">{f.priceMeta}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </Section>
  );
}
