// components/home/CrewStrip.tsx
// Server component. Inserted directly after Shmo Review spotlight on the
// homepage, and reused on /shmo-review. Accepts bg/nextBg overrides so
// the rotation can be tuned per page; defaults match the homepage usage.
// 6-up crew photo grid — fills slots from CREW data, falls back to placeholder.

import "./home.css";
import Section from "@/components/layout/Section";
import type { SectionBg } from "@/components/layout/Section";
import { CREW } from "./home-data";

type Props = {
  bg?: SectionBg;
  nextBg?: SectionBg;
  tiles?: number;
  columns?: 3 | 6;
};

export default function CrewStrip({ bg = "marsh", nextBg = "graham", tiles = 6, columns = 6 }: Props = {}) {
  const visibleCrew = CREW.slice(0, tiles);
  const gridClass =
    columns === 3 ? "crew-grid crew-grid--3col" :
    tiles <= 3    ? "crew-grid crew-grid--3" :
                    "crew-grid";
  return (
    <Section bg={bg} nextBg={nextBg} ariaLabel="Crew strip — the people who use Shmo Review">
      <div className="crew-strip__head">
        <span className="crew-strip__hash">For the people on the floor</span>
        <h2 className="shm-h2">Card per <em>crew member</em>, not card per shop.</h2>
        <p className="crew-strip__lede">
          The card has to live with the person handing the customer their coffee, keys, or receipt
          — <b>not on the counter</b>. That&apos;s where the math comes from.
        </p>
      </div>
      <div className={gridClass}>
        {visibleCrew.map((c, i) =>
          c.photo ? (
            <div key={i} className="crew-tile crew-tile--photo">
              <img
                className="crew-tile__photo"
                src={c.photo}
                alt={c.name ? `${c.name}${c.shop ? ` — ${c.shop}` : ""}` : ""}
                loading="lazy"
              />
              {c.stat && (
                <div className="crew-tile__sticker" aria-label={c.stat}>
                  <svg
                    className="crew-tile__sticker-shape"
                    viewBox="0 0 220 120"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M 30 72 Q 22 36, 60 32 Q 70 8, 112 22 Q 142 4, 168 30 Q 205 30, 195 68 Q 218 95, 178 102 Q 168 122, 132 108 Q 100 122, 78 104 Q 38 112, 30 72 Z"
                      fill="var(--color-marshmallow)"
                      stroke="var(--color-cocoa-deep)"
                      strokeWidth="3"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="crew-tile__sticker-text">{c.stat}</span>
                </div>
              )}
            </div>
          ) : (
            <div key={i} className="crew-tile" aria-hidden="true">
              <span className="crew-tile__chip">Photo coming</span>
              <span>Crew tile</span>
            </div>
          )
        )}
      </div>
    </Section>
  );
}
