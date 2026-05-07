// components/category/FormatCards.tsx
// Three format cards (CR-80 / L-Sign / Square Card) — entry points to the
// PDPs that ship in 03-05/06/07. Server component.
//
// Static format copy from product.md. NO live product data — title, price,
// inventory all live in Shopify and are fetched on the PDPs themselves.
// (See .claude/rules/shopify-data-discipline.md.)

import Link from "next/link";
import { FORMATS } from "./category-data";

export default function FormatCards() {
  return (
    <div>
      <div className="cat-formats__head">
        <span className="shm-eyebrow">Formats</span>
        <h2 className="shm-h2">Three shapes. One job.</h2>
        <p className="shm-lede">
          Same NFC tap. Same Google review page. Different surface for where
          your crew works.
        </p>
      </div>

      <div className="cat-formats__grid">
        {FORMATS.map((format) => (
          <article
            key={format.slug}
            className="shm-card shm-card--cream cat-format-card"
          >
            <div className="shm-image-frame cat-format-card__media">
              <img src={format.image} alt={format.imageAlt} loading="lazy" />
            </div>

            <div className="cat-format-card__body">
              <div className="cat-format-card__tag-row">
                <span className="shm-eyebrow">{format.tag}</span>
              </div>
              <h3 className="shm-h3">{format.name}</h3>
              <p className="shm-meta">{format.kicker}</p>
              <p className="shm-body">{format.oneLiner}</p>
              <p className="shm-meta">{format.bestFor}</p>
            </div>

            <Link
              href={format.href}
              className="shm-btn shm-btn--ghost cat-format-card__cta"
            >
              See details
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
