"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/lib/icons";
import { Placeholder } from "@/components/ui/Placeholder";
import "../../home.css";
import "../preview.css";

interface Brand {
  id: string;
  name: string;
  role: string;
  status: "live" | "soon";
  headline: React.ReactNode;
  lede: string;
  cta: { label: string; href: string };
  visualLabel: string;
}

const BRANDS: Brand[] = [
  {
    id: "review",
    name: "Shmo Review",
    role: "NFC review cards that send customers straight to your Google profile.",
    status: "live",
    headline: (
      <>
        One tap. One <em>five-star</em> review.
      </>
    ),
    lede:
      "Cards, signs and discs that take a happy customer straight to your Google review page. No app, no login, no QR-code gymnastics.",
    cta: { label: "Shop now", href: "/shmo-review" },
    visualLabel: "Shmo Review · CR-80 card photo",
  },
  {
    id: "biz",
    name: "Shmo Biz",
    role: "An NFC business card that lives on the customer's phone the moment you tap.",
    status: "soon",
    headline: (
      <>
        Your business card. <em>Finally</em> worth handing out.
      </>
    ),
    lede:
      "Paper cards get lost. Shmo Biz delivers your name, title, phone, website and socials in one tap — and it stays up to date forever.",
    cta: { label: "Get notified", href: "#" },
    visualLabel: "Shmo Biz · phone + business card mock",
  },
  {
    id: "link",
    name: "Shmo Link",
    role: "One branded link that sends customers to every destination that matters.",
    status: "soon",
    headline: (
      <>
        One link. <em>Every</em> destination.
      </>
    ),
    lede:
      "Google page, booking, menu, socials — all reachable from a single branded hub. Built for Main Street businesses, not influencers.",
    cta: { label: "Get notified", href: "#" },
    visualLabel: "Shmo Link · phone showing link hub",
  },
  {
    id: "reputation",
    name: "Shmo Reputation",
    role: "An AI review responder that answers every review in your brand's voice.",
    status: "soon",
    headline: (
      <>
        Every review, <em>answered</em>.
      </>
    ),
    lede:
      "Responding to reviews builds trust and improves local ranking. Shmo Reputation answers every review automatically — positive and negative.",
    cta: { label: "Get notified", href: "#" },
    visualLabel: "Shmo Reputation · review + auto-reply mock",
  },
];

export default function SpotlightsC() {
  const [active, setActive] = useState(0);
  const brand = BRANDS[active];

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

          <div className="vc-shell">
            <div className="vc-list" role="tablist">
              {BRANDS.map((b, i) => (
                <button
                  key={b.id}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  onClick={() => setActive(i)}
                  className={`vc-item ${i === active ? "vc-item--active" : ""}`}
                >
                  <div className="vc-item__head">
                    <span className="vc-item__name">{b.name}</span>
                    <span className="vc-item__status">
                      {b.status === "live" ? "Live" : "Soon"}
                    </span>
                  </div>
                  <p className="vc-item__role">{b.role}</p>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={brand.id}
                className="vc-stage"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.32, ease: "easeOut" }}
              >
                <div className="vc-stage__head">
                  <span
                    className={`vc-stage__status ${
                      brand.status === "live" ? "vc-stage__status--live" : ""
                    }`}
                  >
                    {brand.status === "live" ? "Live now" : "Coming soon"}
                  </span>
                  <h2 className="vc-stage__title">{brand.headline}</h2>
                  <p className="vc-stage__lede">{brand.lede}</p>
                </div>

                <div className="vc-stage__visual">
                  <Placeholder label={brand.visualLabel} aspect="16 / 9" />
                </div>

                <div className="vc-stage__cta-row">
                  {brand.status === "live" ? (
                    <Link className="btn btn--primary btn--lg" href={brand.cta.href}>
                      {brand.cta.label} <Icon.Arrow style={{ width: 16, height: 16 }} />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="btn btn--ghost btn--lg"
                      onClick={(e) => e.preventDefault()}
                    >
                      {brand.cta.label} <Icon.Arrow style={{ width: 16, height: 16 }} />
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
