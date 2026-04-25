"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/lib/icons";
import { Star, Briefcase, Link2, Megaphone } from "lucide-react";

const SUB_BRAND_ICONS = [
  { name: "Shmo Review", Icon: Star },
  { name: "Shmo Biz", Icon: Briefcase },
  { name: "Shmo Link", Icon: Link2 },
  { name: "Shmo Reputation", Icon: Megaphone },
];

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
                The toolkit your crew&apos;s been{" "}
                <em>missing</em>.
              </motion.h1>
              <motion.p className="home-hero__lede" {...fadeUp(0.05)}>
                Four tools built for Main Street. Reviews, contacts, links,
                reputation — every customer interaction your crew was letting
                slip through the cracks.
              </motion.p>
              <motion.div className="home-hero__ctas" {...fadeUp(0.1)}>
                <a className="btn btn--accent btn--lg" href="#family">
                  Meet the tools <span aria-hidden="true">↓</span>
                </a>
                <Link className="btn btn--ghost btn--lg" href="/shmo-review">
                  Shop Shmo Review <Icon.Arrow style={{ width: 16, height: 16 }} />
                </Link>
              </motion.div>
              <motion.div className="home-hero__meta" {...fadeUp(0.15)}>
                <span className="home-hero__meta-item">
                  <Icon.Check style={{ width: 13, height: 13, color: "var(--success)" }} />
                  No subscription required
                </span>
                <span className="home-hero__meta-sep" />
                <span className="home-hero__meta-item">
                  <Icon.Check style={{ width: 13, height: 13, color: "var(--success)" }} />
                  Made for Main Street
                </span>
              </motion.div>
            </div>

            <motion.div
              className="home-hero__icon-row"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
              aria-hidden="true"
            >
              {SUB_BRAND_ICONS.map(({ name, Icon: I }) => (
                <span key={name} className="home-hero__icon-cell" title={name}>
                  <I style={{ width: 18, height: 18 }} />
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="home-hero__stage home-hero__stage--square"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <Image
              src="/mascot/hero-toolkit.png"
              alt="Shmocard mascot holding a toolkit of cards"
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
