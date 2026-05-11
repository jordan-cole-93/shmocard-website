// components/shmo-review/BulletStrip.tsx
// 4-stat trust strip below the hero. Server component.
// Content sourced from data.ts::REVIEW_BULLETS.
// Layout: 4-col grid (desktop) → 2-col (1100px) → 1-col (720px), see shmo-review.css.

import { REVIEW_BULLETS } from "./data";

export default function BulletStrip() {
  return (
    <div className="rev-bullet-strip__grid">
      {REVIEW_BULLETS.map((bullet) => (
        <div key={bullet.stat + bullet.title} className="rev-bullet-strip__item">
          <div className="rev-bullet-strip__stat">{bullet.stat}</div>
          <div className="rev-bullet-strip__stat-label">{bullet.statLabel}</div>
          <div className="rev-bullet-strip__title">{bullet.title}</div>
          <p className="rev-bullet-strip__body">{bullet.body}</p>
        </div>
      ))}
    </div>
  );
}
