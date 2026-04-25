"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, Truck, Zap, ShieldCheck } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Placeholder } from "@/components/ui/Placeholder";
import "../../home.css";
import "../preview.css";

export default function HeroTrustPreview() {
  const reduceMotion = useReducedMotion();
  const fadeUp = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.28, delay, ease: "easeOut" as const },
  });

  return (
    <div className="home">
      <div style={{ padding: "24px 28px 0" }}>
        <Link className="preview-shell__crumb" href="/preview">
          ← Back to variants
        </Link>
      </div>

      <section className="home-hero home-hero--split">
        <div className="home-hero__inner">
          <div className="home-hero__grid">
            <div>
              <div className="home-hero__copy">
                <motion.span className="home-hero__pill" {...fadeUp(0)}>
                  <span className="home-hero__pill-dot">
                    <Sparkles style={{ width: 12, height: 12 }} />
                  </span>
                  Live now: Shmo Review · 3 more on the way
                </motion.span>
                <motion.h1 className="home-hero__title" {...fadeUp(0.05)}>
                  The toolkit your crew&apos;s been <em>missing</em>.
                </motion.h1>
                <motion.p className="home-hero__lede" {...fadeUp(0.1)}>
                  Four tools built for Main Street. Reviews, contacts, links,
                  reputation — every customer interaction your crew was letting
                  slip through the cracks.
                </motion.p>
                <motion.div className="home-hero__ctas" {...fadeUp(0.15)}>
                  <a className="btn btn--accent btn--lg" href="#family">
                    Meet the tools <span aria-hidden="true">↓</span>
                  </a>
                  <Link className="btn btn--ghost btn--lg" href="/shmo-review">
                    Shop Shmo Review <Icon.Arrow style={{ width: 16, height: 16 }} />
                  </Link>
                </motion.div>

                {/* TRUST PILLS — replaces the original meta strip */}
                <motion.div className="hero-trust-pills" {...fadeUp(0.2)}>
                  <span className="hero-trust-pill">
                    <Truck style={{ width: 14, height: 14 }} />
                    Free US shipping
                  </span>
                  <span className="hero-trust-pill">
                    <Zap style={{ width: 14, height: 14 }} />
                    Ships in 24 hours
                  </span>
                  <span className="hero-trust-pill">
                    <ShieldCheck style={{ width: 14, height: 14 }} />
                    30-day guarantee
                  </span>
                </motion.div>
              </div>
            </div>

            <motion.div
              className="home-hero__stage home-hero__stage--square"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            >
              <Placeholder label="Hero mascot · toolkit pose" aspect="1 / 1" className="home-hero__mascot" />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
