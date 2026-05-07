// app/shmo-review/page.tsx
// /shmo-review category page — Shmo Review hub.
// Server component. Composes Wave-1 Section primitive + Wave-2 category sub-components.
//
// Section rotation (REQ-09): marsh -> graham -> marsh -> marsh -> cocoa -> marsh.
// Locked content lives inside the components — see CategoryHero for headline + tagline.

import Section from "@/components/layout/Section";
import CategoryHero from "@/components/category/CategoryHero";
import BulkMath from "@/components/category/BulkMath";
import FormatCards from "@/components/category/FormatCards";
import CategoryFaq from "@/components/category/CategoryFaq";
import {
  HOW_IT_WORKS_SHORT,
  PROOF_QUOTES,
  PROOF_RESULTS,
} from "@/components/category/category-data";
import "@/components/category/category.css";

export const metadata = {
  title: "Shmo Review — One tap. One five-star review.",
  description:
    "NFC review cards built for crews. Tap to leave a Google review in seconds. CR-80 wallet card, L-Sign counter standee, Square Card adhesive disc.",
};

function HowItWorksShort() {
  return (
    <div>
      <div className="cat-how__head">
        <span className="shm-eyebrow">How it works</span>
        <h2 className="shm-h2">Five steps. About four seconds.</h2>
        <p className="shm-lede">
          From the customer's tap to a posted five-star review.
        </p>
      </div>
      <ol className="cat-how__grid">
        {HOW_IT_WORKS_SHORT.map((step) => (
          <li key={step.n} className="shm-card cat-how__step">
            <span className="cat-how__num" aria-hidden="true">
              {step.n}
            </span>
            <h3 className="shm-h3">{step.title}</h3>
            <p className="shm-body">{step.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Proof() {
  return (
    <div>
      <div className="cat-proof__head">
        <span className="shm-eyebrow">Real shops, real numbers</span>
        <h2 className="shm-h2">What happens when crews tap.</h2>
        <p className="shm-lede">
          Verified review-volume increases from real shops running Shmo Review
          cards. Numbers, not promises.
        </p>
      </div>

      {/* No .shm-card wrapper here. On cocoa-bg sections, the design system
          flips .shm-h3 to marshmallow — a white card behind that creates
          white-on-white. Direct on cocoa, the text reads correctly. */}
      <div className="cat-proof__grid">
        {PROOF_RESULTS.map((row) => (
          <div key={row.shop} className="cat-proof__row">
            <span className="shm-h2">{row.increase}</span>
            <p className="shm-body">{row.shop}</p>
            <p className="shm-meta">{row.owner}</p>
          </div>
        ))}
      </div>

      {/* Quotes stay on cocoa bg — no card wrapper. The cocoa-section
          cascade already flips .shm-lede to marshmallow @ 0.86, which
          reads cleanly on the chocolate background. */}
      <div className="cat-proof__quotes">
        {PROOF_QUOTES.map((q) => (
          <blockquote key={q.attribution} className="cat-proof__quote">
            <p className="shm-lede">&ldquo;{q.quote}&rdquo;</p>
            <cite className="shm-meta">{q.attribution}</cite>
          </blockquote>
        ))}
      </div>
    </div>
  );
}

export default function ShmoReviewPage() {
  return (
    <main>
      <Section bg="marsh" nextBg="graham" ariaLabel="Shmo Review hero">
        <CategoryHero />
      </Section>

      <Section bg="graham" nextBg="marsh" ariaLabel="Bulk math">
        <BulkMath />
      </Section>

      {/* FormatCards stays on marsh and flows into HowItWorks (also marsh).
          No wave divider between same-bg sections — wave is only emitted
          when nextBg differs. */}
      <Section bg="marsh" id="formats" ariaLabel="Formats">
        <FormatCards />
      </Section>

      <Section bg="marsh" nextBg="cocoa" ariaLabel="How it works">
        <HowItWorksShort />
      </Section>

      <Section bg="cocoa" nextBg="marsh" ariaLabel="Proof from real shops">
        <Proof />
      </Section>

      <Section bg="marsh" ariaLabel="Frequently asked questions">
        <CategoryFaq />
      </Section>
    </main>
  );
}
