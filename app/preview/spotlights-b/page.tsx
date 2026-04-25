"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "@/lib/icons";
import "../../home.css";
import "../preview.css";

interface Brand {
  id: string;
  num: string;
  name: string;
  status: "live" | "soon";
  headline: React.ReactNode;
  lede: string;
  cta: { label: string; href: string };
  variant?: "default" | "feature" | "dark";
}

const BRANDS: Brand[] = [
  {
    id: "review",
    num: "01",
    name: "Shmo Review",
    status: "live",
    headline: (
      <>
        One tap. One <em>five-star</em> review.
      </>
    ),
    lede:
      "NFC review cards, signs and discs. Send happy customers straight to your Google profile — no app, no login.",
    cta: { label: "Shop now", href: "/shmo-review" },
    variant: "feature",
  },
  {
    id: "biz",
    num: "02",
    name: "Shmo Biz",
    status: "soon",
    headline: (
      <>
        Your card. <em>Finally</em> worth handing out.
      </>
    ),
    lede:
      "Paper cards get lost. Shmo Biz lives on the customer's phone the moment you tap — name, title, phone, website, always up to date.",
    cta: { label: "Get notified", href: "#" },
  },
  {
    id: "link",
    num: "03",
    name: "Shmo Link",
    status: "soon",
    headline: (
      <>
        One link. <em>Every</em> destination.
      </>
    ),
    lede:
      "Google page, booking, menu, socials — all from one branded hub built for Main Street businesses.",
    cta: { label: "Get notified", href: "#" },
  },
  {
    id: "reputation",
    num: "04",
    name: "Shmo Reputation",
    status: "soon",
    headline: (
      <>
        Every review, <em>answered</em>.
      </>
    ),
    lede:
      "AI review responder that answers every review automatically — in your brand's voice. Builds trust, improves local ranking.",
    cta: { label: "Get notified", href: "#" },
    variant: "dark",
  },
];

export default function SpotlightsB() {
  return (
    <div className="home">
      <div className="preview-shell">
        <div className="preview-shell__inner">
          <Link className="preview-shell__crumb" href="/preview">
            ← Back to variants
          </Link>

          <div className="preview-head">
            <span className="preview-head__eyebrow">The Shmocard family</span>
            <h1 className="preview-head__title">
              Four tools. <em>One</em> toolkit.
            </h1>
            <p className="preview-head__lede">
              Shmo Review is shipping. Three more sub-brands roll out through next year — same cards, same dashboard, more jobs they can do.
            </p>
          </div>

          <div className="vb-grid">
            {BRANDS.map((b, i) => (
              <motion.article
                key={b.id}
                className={`vb-card ${
                  b.variant === "feature"
                    ? "vb-card--feature"
                    : b.variant === "dark"
                    ? "vb-card--dark"
                    : ""
                }`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.36, delay: i * 0.06, ease: "easeOut" }}
              >
                <div className="vb-card__head">
                  <span className="vb-card__num">{b.num}</span>
                  <span
                    className={`vb-card__status ${
                      b.status === "live" ? "vb-card__status--live" : ""
                    }`}
                  >
                    {b.status === "live" ? "Live now" : "Coming soon"}
                  </span>
                </div>
                <div className="vb-card__body">
                  <h2 className="vb-card__title">{b.headline}</h2>
                  <p className="vb-card__lede">{b.lede}</p>
                </div>
                {b.status === "live" ? (
                  <Link className="vb-card__cta" href={b.cta.href}>
                    {b.cta.label} <Icon.Arrow style={{ width: 14, height: 14 }} />
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="vb-card__cta"
                    onClick={(e) => e.preventDefault()}
                  >
                    {b.cta.label} <Icon.Arrow style={{ width: 14, height: 14 }} />
                  </button>
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
