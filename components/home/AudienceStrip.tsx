// components/home/AudienceStrip.tsx
// Server component. Single-line full-bleed marquee on graham bg.
// 38s scroll-left, paused on hover.
//
// Bypasses the <Section> wrapper deliberately: marquees need to run
// edge-to-edge with no .shm-section padding and no .shm-container
// max-width clipping. Matches the canonical homepage pattern
// (home-bundle.jsx:703-707). Renders the trailing wave divider as
// a sibling so the next section (marsh) butts up against the strip.

import "./home.css";
import { AUDIENCES } from "./home-data";

export default function AudienceStrip() {
  // Duplicate the list so the keyframe (-50%) cycles seamlessly.
  const items = [...AUDIENCES, ...AUDIENCES];

  return (
    <>
      <section className="shm-bg-graham" aria-label="Audiences served">
        <div className="audience-strip" aria-hidden="true">
          <div className="audience-strip__track">
            {items.map((a, i) => (
              <span key={i} className="audience-strip__group">
                <span>{a}</span>
                <span className="audience-strip__dot" aria-hidden="true" />
              </span>
            ))}
          </div>
        </div>
      </section>
      <div className="shm-wave shm-wave--marsh" aria-hidden="true" />
    </>
  );
}
