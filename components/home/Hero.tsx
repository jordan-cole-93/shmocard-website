"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/lib/icons";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const fadeUp = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.28, delay, ease: "easeOut" as const },
  });

  return (
    <section className="home-hero home-hero--split">
      <div className="home-hero__inner">
        <div className="home-hero__grid">
          <div>
            <div className="home-hero__copy">
              <motion.h1 className="home-hero__title" {...fadeUp(0)}>
                Built for crews.<br />
                <em>Priced</em> for bulk.
              </motion.h1>
              <motion.p className="home-hero__lede" {...fadeUp(0.05)}>
                NFC review cards, signs and discs for teams that talk to customers
                all day. One card per crew member, not one card per shop —
                equip everyone and watch the five-stars roll in.
              </motion.p>
              <motion.div className="home-hero__ctas" {...fadeUp(0.1)}>
                <Link className="btn btn--accent btn--lg" href="/shmo-review">
                  Shop the cards <Icon.Arrow style={{ width: 16, height: 16 }} />
                </Link>
                <a className="btn btn--ghost btn--lg" href="#bundles">
                  See crew bundles
                </a>
              </motion.div>
              <motion.div className="home-hero__meta" {...fadeUp(0.15)}>
                <span className="home-hero__meta-item">
                  <Icon.Check style={{ width: 13, height: 13, color: "var(--shmo-success)" }} />
                  No subscription required
                </span>
                <span className="home-hero__meta-sep" />
                <span className="home-hero__meta-item">
                  <Icon.Check style={{ width: 13, height: 13, color: "var(--shmo-success)" }} />
                  Made for Main Street
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
            <Image
              src="/mascot/hero-crew.png"
              alt="Shmocard crew — four s'mores holding review tools"
              width={520}
              height={520}
              priority
              className="home-hero__mascot"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
