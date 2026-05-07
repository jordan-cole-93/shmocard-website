// components/home/AudienceStrip.tsx
// Server component. Single-line marquee on graham bg.
// 38s scroll-left, paused on hover (CONTEXT.md B2).

import "./home.css";
import Section from "@/components/layout/Section";
import { AUDIENCES } from "./home-data";

export default function AudienceStrip() {
  // Duplicate the list so the keyframe (-50%) cycles seamlessly.
  const items = [...AUDIENCES, ...AUDIENCES];

  return (
    <Section bg="graham" nextBg="marsh" ariaLabel="Audiences served">
      <div className="audience-strip" aria-hidden="false">
        <div className="audience-strip__track">
          {items.map((a, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 44 }}>
              <span>{a}</span>
              <span className="audience-strip__dot" aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}
