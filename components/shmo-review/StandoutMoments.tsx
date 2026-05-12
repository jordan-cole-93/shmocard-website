// components/shmo-review/StandoutMoments.tsx — Shmo Review standout cards.
// Phase 6. Ported 1:1 from
// .claude/skills/shmocard-design-system/ui_kits/website/homepage-shmoreview/review-parts.jsx:295-323
// + review.css:620-672 (+ 1044 breakpoint) + REVIEW_STANDOUT data from
// review-data.jsx:96-122.
//
// Three hero stat cards (Allan 80+ / Carly 14 / Marshall 5) on marsh.
// Each card uses a tone variant (.standout-card--ember/--cocoa/--honey)
// for its bg + ink color.
//
// Server component.

import Section from "@/components/layout/Section";

const REVIEW_STANDOUT: Array<{
  big: string;
  metric: string;
  quote: string;
  person: string;
  shop: string;
  tone: "ember" | "cocoa" | "honey";
}> = [
  {
    big: "80+",
    metric: "reviews in 6 weeks",
    quote:
      "Allan was the highest-rated guy on the crew before. Now he's the highest-rated on Google, too.",
    person: "Allan",
    shop: "Granters Auto · Phoenix",
    tone: "ember",
  },
  {
    big: "14",
    metric: "in week one",
    quote:
      "Marshall's already gotten five today and we've been open for an hour and a half.",
    person: "Carly",
    shop: "Axel's Pawn · Minneapolis",
    tone: "cocoa",
  },
  {
    big: "5",
    metric: "in 90 minutes",
    quote: "He got five Google reviews in less than two hours of being open.",
    person: "Marshall",
    shop: "Axel's Pawn · Minneapolis",
    tone: "honey",
  },
];

export default function StandoutMoments() {
  return (
    <Section bg="marsh" nextBg="marsh" className="standout" ariaLabel="Standout moments">
      <div className="shm-section-head">
        <span className="shm-eyebrow">Standout moments</span>
        <h2 className="shm-h2">
          What happens when crews <em>actually</em> hand them over.
        </h2>
        <p className="shm-lede">
          Three weeks. Three crews. Three numbers we couldn&apos;t have predicted.
        </p>
      </div>
      <div className="standout-grid">
        {REVIEW_STANDOUT.map((s, i) => (
          <article className={`standout-card standout-card--${s.tone}`} key={i}>
            <div className="standout-card__big">{s.big}</div>
            <div className="standout-card__metric">{s.metric}</div>
            <blockquote className="standout-card__quote">&ldquo;{s.quote}&rdquo;</blockquote>
            <figcaption className="standout-card__attr">
              <b>{s.person}</b>
              <span>{s.shop}</span>
            </figcaption>
          </article>
        ))}
      </div>
    </Section>
  );
}
