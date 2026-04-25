"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/lib/icons";
import { Placeholder } from "@/components/ui/Placeholder";

export interface SubBrandSpotlightProps {
  id: string;
  eyebrow: string;
  headline: ReactNode;
  lede: string;
  cta: {
    label: string;
    href: string;
    type: "live" | "soon";
  };
  visualLabel: string;
  /** Box surface. "chocolate" inverts text colors. */
  surface?: "cream" | "snow" | "honey" | "blush" | "graham" | "chocolate" | "paper";
  /** If true, visual is on the left and copy on the right. */
  flip?: boolean;
}

export function SubBrandSpotlight({
  id,
  eyebrow,
  headline,
  lede,
  cta,
  visualLabel,
  surface = "paper",
  flip = false,
}: SubBrandSpotlightProps) {
  const reduceMotion = useReducedMotion();
  const fadeUp = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.36, delay, ease: "easeOut" as const },
  });

  const ctaIsLive = cta.type === "live";

  return (
    <section id={id} className="spotlight">
      <motion.div
        className={`spotlight__box spotlight__box--${surface} ${flip ? "spotlight__box--flip" : ""}`}
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="spotlight__copy">
          <motion.span className="spotlight__eyebrow" {...fadeUp(0)}>
            {eyebrow}
          </motion.span>
          <motion.h2 className="spotlight__title" {...fadeUp(0.05)}>
            {headline}
          </motion.h2>
          <motion.p className="spotlight__lede" {...fadeUp(0.1)}>
            {lede}
          </motion.p>
          <motion.div {...fadeUp(0.15)}>
            {ctaIsLive ? (
              <Link className="btn btn--primary btn--lg spotlight__cta" href={cta.href}>
                {cta.label} <Icon.Arrow style={{ width: 16, height: 16 }} />
              </Link>
            ) : (
              <button
                type="button"
                className="btn btn--ghost btn--lg spotlight__cta"
                onClick={(e) => e.preventDefault()}
              >
                {cta.label} <Icon.Arrow style={{ width: 16, height: 16 }} />
              </button>
            )}
          </motion.div>
        </div>

        <motion.div className="spotlight__visual" {...fadeUp(0.1)}>
          <Placeholder label={visualLabel} aspect="4 / 3" />
        </motion.div>
      </motion.div>
    </section>
  );
}
