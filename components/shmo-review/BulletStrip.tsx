// components/shmo-review/BulletStrip.tsx — Shmo Review bullet strip.
// Phase 2. Ported 1:1 from
// .claude/skills/shmocard-design-system/ui_kits/website/homepage-shmoreview/review-parts.jsx:65-85
// + review.css:155-197.
//
// Four stat-led promises on graham. Big number → small label →
// title → body. Hairline rule between cells (vertical, not above each).
//
// Server component.

import Section from "@/components/layout/Section";

const REVIEW_BULLETS = [
  {
    stat: "0",
    statLabel: "apps to download",
    title: "One tap, browser opens",
    body: "Customer holds their phone to the card. Google review page loads. No login, no QR, no friction.",
  },
  {
    stat: "3s",
    statLabel: "from tap to review",
    title: "Pre-programmed for you",
    body: "Send your Google link at checkout — we burn it in before shipping. Out of the box, ready to hand over.",
  },
  {
    stat: "100%",
    statLabel: "of crew, every shift",
    title: "Built for the handoff",
    body: "One card per employee, on every counter. The ask happens when the customer is happiest — at the close.",
  },
  {
    stat: "60d",
    statLabel: "no-questions return",
    title: "Reprogram for life",
    body: "Change your mind, change your link, change your business. Reprogram free, forever. Refund inside 60 days.",
  },
];

export default function BulletStrip() {
  return (
    <Section bg="graham" nextBg="marsh" className="bullet-strip" ariaLabel="Why Shmo Review works">
      <div className="bullet-strip__grid">
        {REVIEW_BULLETS.map((b, i) => (
          <div className="bullet-strip__item" key={i}>
            <div className="bullet-strip__stat">{b.stat}</div>
            <div className="bullet-strip__stat-label">{b.statLabel}</div>
            <div className="bullet-strip__title">{b.title}</div>
            <p className="bullet-strip__body">{b.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
