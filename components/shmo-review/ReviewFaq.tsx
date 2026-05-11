// components/shmo-review/ReviewFaq.tsx
// Server-rendered FAQ section using the SOFT hairline .shm-faq-list
// primitive (default; .shm-faq-list--featured-card is rare per
// design-system.md). Each item is a client FaqItem reused from home.
// Content from data.ts::REVIEW_FAQ.

import FaqItem from "@/components/home/FaqItem";
import { REVIEW_FAQ } from "./data";

export default function ReviewFaq() {
  return (
    <>
      <div className="shm-section-head">
        <span className="shm-eyebrow">FAQ</span>
        <h2 className="shm-h2">
          Questions, answered <em>plainly</em>.
        </h2>
      </div>
      <div className="rev-faq__wrap">
        <ul className="shm-faq-list">
          {REVIEW_FAQ.map((item, i) => (
            <FaqItem
              key={item.q}
              question={item.q}
              answer={item.a}
              defaultOpen={i === 0}
            />
          ))}
        </ul>
      </div>
    </>
  );
}
