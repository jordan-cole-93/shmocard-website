// components/shmo-review/FormatCompare.tsx — Format comparison section.
// Shared decision-support section for CR-80, L-Sign, and Square Card PDPs.
// Composes .shm-product primitive (components.css:1128+).
// Server component — no Shopify fetches, copy-driven only.
//
// Mount on a PDP by passing the current product's handle as `currentHandle`.
// The current card renders a disabled ghost "You're here" button.

import Section from "@/components/layout/Section";

// Framing copy — inline duplicate of FormatPicker constants.
// DO NOT extract to a shared lib until that task is explicitly planned.
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

const FORMAT_TITLES: Record<string, string> = {
  "google-reviews-nfc-tap-card-cr80": "CR-80 Card",
  "google-review-nfc-tap-card-l-sign": "L-Sign Standee",
  "google-review-plaque": "Square Card Disc",
};

// Fallback images — matches FormatPicker FALLBACK_IMAGES.
const FORMAT_IMAGES: Record<string, { src: string; alt: string }> = {
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

const PRODUCT_PAGE_HREFS: Record<(typeof HANDLES)[number], string> = {
  "google-reviews-nfc-tap-card-cr80": "/shmo-review/cr-80",
  "google-review-nfc-tap-card-l-sign": "/shmo-review/l-sign",
  "google-review-plaque": "/shmo-review/square-card",
};

export type FormatCompareProps = {
  currentHandle: string;
};

export default function FormatCompare({ currentHandle }: FormatCompareProps) {
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
        {HANDLES.map((handle) => {
          const copy = FORMAT_COPY[handle];
          const image = FORMAT_IMAGES[handle];
          const title = FORMAT_TITLES[handle];
          const href = PRODUCT_PAGE_HREFS[handle];
          const isCurrent = handle === currentHandle;

          return (
            <article
              key={handle}
              className="shm-product"
              data-current={isCurrent || undefined}
            >
              <div className="shm-product__media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.src} alt={image.alt} />
                {copy.badge && (
                  <span className="shm-product__tag">
                    <span className={`shm-badge shm-badge--${copy.badgeTone}`}>
                      {copy.badge}
                    </span>
                  </span>
                )}
              </div>
              <div className="shm-product__body">
                <h3 className="shm-product__name">{title}</h3>
                <p className="shm-product__sub">{copy.sub}</p>
                <p className="shm-lede">{copy.blurb}</p>
                <div className="shm-product__row">
                  {isCurrent ? (
                    <button
                      className="shm-btn shm-btn--ghost shm-btn--sm"
                      type="button"
                      disabled
                      aria-disabled="true"
                    >
                      {"You're here"}
                    </button>
                  ) : (
                    <a
                      className="shm-btn shm-btn--primary shm-btn--sm"
                      href={href}
                    >
                      View product
                    </a>
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
