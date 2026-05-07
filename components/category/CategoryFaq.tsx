// components/category/CategoryFaq.tsx
// FAQ accordion for /shmo-review. Uses the soft .shm-faq-list primitive.
// Self-contained — homepage's FaqItem ships in 03-03; this file owns its
// own client accordion item until that lands. When 03-03 ships, this can
// be refactored to import the shared FaqItem.
//
// Mascot pose budget on this page: 2 max. We use 1 here (thinking).

"use client";

import { useState } from "react";
import Sticker from "../Sticker";
import { CATEGORY_FAQ, type CategoryFaqItem } from "./category-data";

function FaqRow({ item }: { item: CategoryFaqItem }) {
  const [open, setOpen] = useState(false);
  const panelId = `cat-faq-${item.id}`;

  return (
    <li className={`shm-faq-item${open ? " shm-faq-item--open" : ""}`}>
      <button
        type="button"
        className="shm-faq-trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="shm-faq-question">{item.q}</span>
        <span className="shm-faq-icon" aria-hidden="true">+</span>
      </button>
      {open ? (
        <div id={panelId} className="shm-faq-answer" role="region">
          {item.a}
        </div>
      ) : null}
    </li>
  );
}

export default function CategoryFaq() {
  return (
    <div>
      <div className="cat-faq__head">
        <span className="shm-eyebrow">FAQ</span>
        <h2 className="shm-h2">Six questions. Six straight answers.</h2>
        <p className="shm-lede">
          Everything most crews ask before their first bulk order.
        </p>
        <div className="cat-faq__sticker" aria-hidden="true">
          <Sticker pose="thinking" size="md" tilt="sm-r" />
        </div>
      </div>

      <ul className="shm-faq-list shm-faq-list--soft">
        {CATEGORY_FAQ.map((item) => (
          <FaqRow key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}
