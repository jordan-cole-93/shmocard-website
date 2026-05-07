// components/home/Hero.tsx
// Server component. Hero headline locked per marketing.md +
// CONTEXT.md B1 — em wraps the cycling word(s).

import "./home.css";
import Section from "@/components/layout/Section";
import HeroTypeCycle from "./HeroTypeCycle";
import { SUB_BRANDS } from "./home-data";

const TILE_ART: Record<string, { src: string; status: "live" | "soon"; modifier?: string }> = {
  review: { src: "/products/cr80/transparent/magnific_2884306972.png", status: "live" },
  biz: { src: "/mascot/mascot-holding-card.png", status: "soon" },
  link: { src: "/mascot/mascot-heart-hands.png", status: "soon" },
  reputation: { src: "/mascot/mascot-megaphone.png", status: "soon", modifier: "home-hero__tile-art--megaphone" },
};

export default function Hero() {
  return (
    <Section bg="marsh" nextBg="graham" ariaLabel="Shmocard hero — the toolkit">
      <div className="home-hero">
        <span className="shm-eyebrow home-hero__eyebrow">A toolkit, not a card</span>
        <h1 className="shm-display">
          The toolkit your crew&apos;s been{" "}
          <em>
            <HeroTypeCycle words={["missing", "asking for"]} />
          </em>
          .
        </h1>
        <p className="shm-lede home-hero__lede">
          NFC tools built for local shop crews. One tap from a customer&apos;s phone — review,
          contact, link hub, or auto-reply. One brand. One dashboard. One-time card purchase.
        </p>
        <div className="home-hero__cta-row">
          <a className="shm-btn shm-btn--primary shm-btn--lg" href="/shmo-review">
            Shop Shmo Review
          </a>
          <a className="shm-btn shm-btn--ghost shm-btn--lg" href="#how">
            See the toolkit
          </a>
        </div>
        <div className="home-hero__meta">
          <span>Pre-programmed before shipping</span>
          <span className="home-hero__dot" aria-hidden="true" />
          <span>Reprogrammable for life</span>
          <span className="home-hero__dot" aria-hidden="true" />
          <span>30-day returns</span>
        </div>

        <div className="home-hero__stage">
          <div className="home-hero__toolkit">
            {SUB_BRANDS.map((sb) => {
              const tile = TILE_ART[sb.slug];
              return (
                <a
                  key={sb.slug}
                  href={sb.slug === "review" ? "/shmo-review" : `#${sb.slug}`}
                  className="home-hero__tile"
                  aria-label={sb.eyebrow}
                >
                  <span
                    className={`shm-badge ${
                      tile.status === "live" ? "shm-badge--ember" : "shm-badge--soft"
                    } home-hero__tile-status`}
                  >
                    {tile.status === "live" ? "Live" : "Soon"}
                  </span>
                  <div className={`home-hero__tile-art ${tile.modifier ?? ""}`}>
                    <img src={tile.src} alt="" />
                  </div>
                  <h3 className="home-hero__tile-name">{sb.eyebrow}</h3>
                  <p className="home-hero__tile-sub">{sb.tileSub}</p>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}
