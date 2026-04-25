"use client";

import { useEffect, useState } from "react";
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
    role: "NFC review cards",
    status: "live",
    headline: (
      <>
        One tap. One <em>five-star</em> review.
      </>
    ),
    lede:
      "NFC review cards, signs and discs that send happy customers straight to your Google profile. No app, no login, no QR-code gymnastics.",
    cta: { label: "Shop now", href: "/shmo-review" },
    visualLabel: "Shmo Review · CR-80 card photo",
  },
  {
    id: "biz",
    name: "Shmo Biz",
    role: "NFC business card",
    status: "soon",
    headline: (
      <>
        Your business card. <em>Finally</em> worth handing out.
      </>
    ),
    lede:
      "Paper cards get lost. Shmo Biz lives on the customer's phone the moment you tap. Name, title, phone, website — always up to date.",
    cta: { label: "Get notified", href: "#" },
    visualLabel: "Shmo Biz · phone + business card mock",
  },
  {
    id: "link",
    name: "Shmo Link",
    role: "Link in bio for Main Street",
    status: "soon",
    headline: (
      <>
        One link. <em>Every</em> destination.
      </>
    ),
    lede:
      "Send customers to your Google page, your booking, your menu, your socials — all from one branded hub built for local businesses.",
    cta: { label: "Get notified", href: "#" },
    visualLabel: "Shmo Link · phone showing link hub",
  },
  {
    id: "reputation",
    name: "Shmo Reputation",
    role: "AI review responder",
    status: "soon",
    headline: (
      <>
        Every review, <em>answered</em>.
      </>
    ),
    lede:
      "Responding to reviews builds trust and improves local ranking. Shmo Reputation answers every review automatically, in your brand's voice.",
    cta: { label: "Get notified", href: "#" },
    visualLabel: "Shmo Reputation · review + auto-reply mock",
  },
];

export default function SpotlightsA() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive((a) => (a + 1) % BRANDS.length), 5000);
    return () => clearInterval(id);
  }, [paused]);

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

          <div
            className="va-stage"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="va-stage__grid">
              <AnimatePresence mode="wait">
                <motion.div
                  key={brand.id}
                  className="va-stage__copy"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.32, ease: "easeOut" }}
                >
                  <span
                    className={`va-status ${
                      brand.status === "live" ? "va-status--live" : "va-status--soon"
                    }`}
                  >
                    {brand.status === "live" ? "Live now" : "Coming soon"}
                  </span>
                  <h2 className="va-stage__title">{brand.headline}</h2>
                  <p className="va-stage__lede">{brand.lede}</p>
                  <div className="va-stage__cta-row">
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

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${brand.id}-vis`}
                  className="va-stage__visual"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.32, ease: "easeOut" }}
                >
                  <Placeholder label={brand.visualLabel} aspect="4 / 3" />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="va-tabs" role="tablist">
            {BRANDS.map((b, i) => (
              <button
                key={b.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={`va-tab ${i === active ? "va-tab--active" : ""}`}
              >
                <span className="va-tab__name">{b.name}</span>
                <span className="va-tab__role">{b.role}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
