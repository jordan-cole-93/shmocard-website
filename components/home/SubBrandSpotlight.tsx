// components/home/SubBrandSpotlight.tsx
// Client component. One layout, used 4× per home page (Review/Biz/Link/Reputation).
// Reverses every other one. Art slot renders either a real photo (Shmo Review)
// or a 1.1-ratio placeholder square (the three "Soon" sub-brands, until photos land).
//
// Client because of the interactive format picker on Shmo Review:
// hovering / clicking a format-mini swaps the spotlight art image to that
// variant's carousel shot. Format-mini cards are NOT links — the "Shop"
// CTA is what navigates to the PDP.

"use client";

import "./home.css";
import { useState } from "react";
import type { SectionBg } from "@/components/layout/Section";
import Section from "@/components/layout/Section";
import type { SubBrand } from "./home-data";
import NotifyButton from "./NotifyButton";
import SubBrandIllustration from "./SubBrandIllustration";

// Sub-brand slugs that open the waitlist modal. Shmo Review never opens
// the modal — it routes to /shmo-review for purchase.
const WAITLIST_SLUGS = new Set(["biz", "link", "reputation"] as const);
type WaitlistSlug = "biz" | "link" | "reputation";

type Props = {
  data: SubBrand;
  nextBg: SectionBg;
  waveSize?: "sm" | "md" | "lg" | "xl";
};

export default function SubBrandSpotlight({ data, nextBg, waveSize }: Props) {
  const reverse = !!data.reverse;
  const sectionId = data.slug;

  // Active format index for the spotlight art picker. Default to first format
  // (CR-80 on Shmo Review). Unused when data.formats is undefined.
  const [activeFormatIdx, setActiveFormatIdx] = useState(0);
  const activeFormat = data.formats?.[activeFormatIdx];

  return (
    <Section
      bg={data.bg}
      nextBg={nextBg}
      waveSize={waveSize}
      id={sectionId}
      ariaLabel={`${data.eyebrow} — ${data.name}`}
    >
      <div className={`spotlight ${reverse ? "spotlight--reverse" : ""}`}>
        <div className="spotlight__copy">
          <div className="spotlight__meta">
            <span className="spotlight__num">{data.number}</span>
            <span className="shm-eyebrow">{data.eyebrow}</span>
            <span
              className={`shm-badge shm-badge--status shm-badge--status-${data.badgeStatus}`}
            >
              {data.badge}
            </span>
          </div>

          <h2 className="shm-display spotlight__h">
            {data.headlineLead}
            <em>{data.headlineEm}</em>
            {data.headlineTrail}
          </h2>

          <p className="shm-lede spotlight__lede">{data.lede}</p>

          <ul className="shm-checklist shm-checklist--featured">
            {data.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>

          {data.formats && (
            <div className="formats-row" role="tablist" aria-label="Format picker">
              {data.formats.map((f, i) => (
                <button
                  key={f.title}
                  type="button"
                  role="tab"
                  aria-selected={i === activeFormatIdx}
                  className={`shm-card format-mini${
                    i === activeFormatIdx ? " format-mini--active" : ""
                  }`}
                  onClick={() => setActiveFormatIdx(i)}
                  onMouseEnter={() => setActiveFormatIdx(i)}
                  onFocus={() => setActiveFormatIdx(i)}
                >
                  <div className="format-mini__title">{f.title}</div>
                  <div className="format-mini__sub">{f.sub}</div>
                </button>
              ))}
            </div>
          )}

          <div className="spotlight__cta-row">
            {data.ctaPrimary.modal === "waitlist" &&
            WAITLIST_SLUGS.has(data.slug as WaitlistSlug) ? (
              <NotifyButton
                product={data.slug as WaitlistSlug}
                label={data.ctaPrimary.label}
              />
            ) : (
              <a
                className="shm-btn shm-btn--primary"
                href={data.ctaPrimary.href ?? "#"}
              >
                {data.ctaPrimary.label}
              </a>
            )}
            {data.ctaSecondary && (
              <a className="shm-btn shm-btn--ghost" href={data.ctaSecondary.href}>
                {data.ctaSecondary.label}
              </a>
            )}
          </div>

          <p className="spotlight__aside">{data.aside}</p>
        </div>

        <div className="spotlight__art">
          {data.art.kind === "photo" ? (
            <>
              <img
                src={activeFormat?.image ?? data.art.src}
                alt={activeFormat?.title ?? data.eyebrow}
                className="spotlight__art-img"
              />
              {(activeFormat || data.art.chip) && (
                <span className="spotlight__art-chip">
                  <span className="spotlight__art-chip-pill">
                    {activeFormat?.title ?? data.art.chip!.pill}
                  </span>
                  {activeFormat?.sub ?? data.art.chip!.label}
                </span>
              )}
            </>
          ) : data.art.kind === "illustration" ? (
            <div className="spotlight__illustration-frame">
              <SubBrandIllustration illustrationKey={data.art.key} />
            </div>
          ) : (
            <div className="spotlight__placeholder" aria-hidden="true">
              <span className="spotlight__placeholder-chip">Photo coming</span>
              <span>{data.art.label ?? `${data.eyebrow} photo`}</span>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
