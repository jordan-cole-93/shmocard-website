"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Users, Zap, Boxes } from "lucide-react";

interface Pillar {
  Icon: typeof Users;
  title: string;
  body: string;
}

const PILLARS: Pillar[] = [
  {
    Icon: Users,
    title: "Built for the whole crew",
    body: "Not just the owner. One tool per employee means seven times more interactions captured. Every team member has what they need.",
  },
  {
    Icon: Zap,
    title: "No apps. No logins. No friction.",
    body: "Customers tap, scan, or click. That's it. No account creation, no download, no fumbling.",
  },
  {
    Icon: Boxes,
    title: "One family. Not four subscriptions.",
    body: "Every Shmocard tool works together. Early adopters get grandfathered into new tools as they launch.",
  },
];

export function WhyShmocard() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="why" className="hsection why-section">
      <div className="hsection__head">
        <div>
          <div className="hsection__eyebrow">Why Shmocard</div>
          <h2 className="hsection__title">
            Simple tools. Real results. <em>No</em> subscription on the cards.
          </h2>
        </div>
        <p className="hsection__lede">
          Shmocard is the toolkit your crew was always missing — built around
          the one thing customers all carry: their phone. No apps, no logins,
          no rituals. Just tap.
        </p>
      </div>

      <div className="hsection__body">
        <div className="why-pillars">
          {PILLARS.map(({ Icon, title, body }, i) => (
            <motion.article
              key={title}
              className="why-pillar"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
            >
              <span className="why-pillar__icon">
                <Icon style={{ width: 22, height: 22 }} />
              </span>
              <h3 className="why-pillar__title">{title}</h3>
              <p className="why-pillar__body">{body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
