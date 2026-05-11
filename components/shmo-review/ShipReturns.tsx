// components/shmo-review/ShipReturns.tsx
// 4-item strip with hand-drawn cocoa-deep SVG icons. Server component.
// Stroke 2.4px round-caps + round-joins per design-system iconography rule.
// Content from data.ts::REVIEW_SHIP_RETURNS.

import { REVIEW_SHIP_RETURNS } from "./data";

const STROKE = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 2.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Icon({ name }: { name: "truck" | "return" | "refresh" | "shield" }) {
  if (name === "truck") {
    return (
      <svg viewBox="0 0 24 24" {...STROKE}>
        <rect x="2" y="8" width="13" height="9" rx="1.5" />
        <path d="M15 11h4l2 3v3h-6" />
        <circle cx="6" cy="19" r="2" />
        <circle cx="18" cy="19" r="2" />
      </svg>
    );
  }
  if (name === "return") {
    return (
      <svg viewBox="0 0 24 24" {...STROKE}>
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <polyline points="3 4 3 10 9 10" />
      </svg>
    );
  }
  if (name === "refresh") {
    return (
      <svg viewBox="0 0 24 24" {...STROKE}>
        <circle cx="12" cy="12" r="9" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    );
  }
  // shield
  return (
    <svg viewBox="0 0 24 24" {...STROKE}>
      <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export default function ShipReturns() {
  return (
    <div className="rev-ship-returns__inner">
      {REVIEW_SHIP_RETURNS.map((item) => (
        <div key={item.title} className="rev-ship-returns__item">
          <span className="rev-ship-returns__icon" aria-hidden="true">
            <Icon name={item.icon} />
          </span>
          <div>
            <div className="rev-ship-returns__title">{item.title}</div>
            <div className="rev-ship-returns__sub">{item.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
