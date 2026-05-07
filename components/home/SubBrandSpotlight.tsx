// components/home/SubBrandSpotlight.tsx
// Server component. One layout, used 4× per home page (Review/Biz/Link/Reputation).
// Reverses every other one. Mascot via 200px showcase exception
// (.shm-mascot--hero) — homepage only, per design-system rule.

import "./home.css";
import type { SectionBg } from "@/components/layout/Section";
import Section from "@/components/layout/Section";
import Mascot from "@/components/Mascot";
import type { SubBrand } from "./home-data";

type Props = {
  data: SubBrand;
  nextBg: SectionBg;
  waveSize?: "sm" | "md" | "lg" | "xl";
};

export default function SubBrandSpotlight({ data, nextBg, waveSize }: Props) {
  const reverse = !!data.reverse;
  const sectionId = data.slug;

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
            <div className="formats-row">
              {data.formats.map((f) => (
                <div key={f.title} className="shm-card format-mini">
                  <div className="format-mini__title">{f.title}</div>
                  <div className="format-mini__sub">{f.sub}</div>
                </div>
              ))}
            </div>
          )}

          <div className="spotlight__cta-row">
            {data.ctaPrimary.modal === "waitlist" ? (
              <button
                type="button"
                className="shm-btn shm-btn--primary"
                data-waitlist={data.slug}
                data-product={data.eyebrow}
              >
                {data.ctaPrimary.label}
              </button>
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
              <img src={data.art.src} alt={data.eyebrow} className="spotlight__art-img" />
              {data.art.chip && (
                <span className="spotlight__art-chip">
                  <span className="spotlight__art-chip-pill">{data.art.chip.pill}</span>
                  {data.art.chip.label}
                </span>
              )}
            </>
          ) : (
            <Mascot
              pose={data.art.pose}
              size="hero"
              fitRatio={data.art.fitRatio}
              alt=""
            />
          )}
        </div>
      </div>
    </Section>
  );
}
