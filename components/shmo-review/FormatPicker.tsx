// components/shmo-review/FormatPicker.tsx — Shmo Review format picker.
// Phase 4. Ported 1:1 from
// .claude/skills/shmocard-design-system/ui_kits/website/homepage-shmoreview/review-parts.jsx:90-130
// + review.css:199-284 (+ 1043, 1052 breakpoints) + REVIEW_FORMATS
// data from review-data.jsx:10-47.
//
// Three format cards (CR-80, L-Sign, Square Card) on marsh.
// .format-card is page-level (composes within layout); the badge,
// arrow, and price use design-system primitives + tokens.
//
// PLACEHOLDER PRODUCT DATA. Pricing + names are hardcoded with
// TODO(shopify) markers — swapped to Storefront in a future phase.
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
  tone: "ember" | "honey" | "graham";
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
    tone: "ember",
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
    tone: "honey",
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
    tone: "graham",
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
          <a className={`format-card format-card--${f.tone}`} href={f.href} key={f.id}>
            {f.badge && (
              <span
                className={`shm-badge ${
                  f.badge === "Best seller" ? "shm-badge--ember" : "shm-badge--honey"
                } format-card__badge`}
              >
                {f.badge}
              </span>
            )}
            <div className="format-card__media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.art} alt={f.artAlt} />
            </div>
            <div className="format-card__body">
              <div className="format-card__name">{f.name}</div>
              <div className="format-card__sub">{f.sub}</div>
              <p className="format-card__blurb">{f.blurb}</p>
              <div className="format-card__foot">
                <span className="format-card__price">{f.price}</span>
                <span className="format-card__price-meta">{f.priceMeta}</span>
              </div>
            </div>
            <span className="format-card__arrow" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </a>
        ))}
      </div>
    </Section>
  );
}
