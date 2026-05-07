// components/home/CrewStrip.tsx
// Server component. Inserted directly after Shmo Review spotlight.
// 6-up crew photo grid — assets pending; render placeholder tiles.

import "./home.css";
import Section from "@/components/layout/Section";

const PLACEHOLDER_LABELS = [
  "Crew tile",
  "Crew tile",
  "Crew tile",
  "Crew tile",
  "Crew tile",
  "Crew tile",
];

export default function CrewStrip() {
  return (
    <Section bg="marsh" nextBg="graham" ariaLabel="Crew strip — the people who use Shmo Review">
      <div className="crew-strip__head">
        <span className="crew-strip__hash">For the people on the floor</span>
        <h2 className="shm-h2">Card per <em>crew member</em>, not card per shop.</h2>
        <p className="crew-strip__lede">
          The card has to live with the person handing the customer their coffee, keys, or receipt
          — <b>not on the counter</b>. That&apos;s where the math comes from.
        </p>
      </div>
      <div className="crew-grid">
        {PLACEHOLDER_LABELS.map((label, i) => (
          <div key={i} className="crew-tile" aria-hidden="true">
            <span className="crew-tile__chip">Photo coming</span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}
