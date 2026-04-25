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
    body: "Not just the owner. One tool per employee means seven times more interactions captured.",
  },
  {
    Icon: Zap,
    title: "No apps. No logins. No friction.",
    body: "Customers tap, scan, or click. That's it. No account creation, no download.",
  },
  {
    Icon: Boxes,
    title: "One family. Not four subscriptions.",
    body: "Every Shmocard tool works together. Early adopters get grandfathered into new tools.",
  },
];

export function WhyShmocard() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="why" className="why-section">
      <div className="why-section__inner">
        <div className="why-section__intro">
          <div className="why-section__eyebrow">Why Shmocard</div>
          <h2 className="why-section__title">
            Simple tools. Real results. <em>No</em> subscription on the cards.
          </h2>
          <p className="why-section__lede">
            Built around the one thing every customer carries — their phone.
            No apps, no logins, no rituals. Just tap.
          </p>
        </div>

        <ul className="why-section__pillars">
          {PILLARS.map(({ Icon, title, body }, i) => (
            <motion.li
              key={title}
              className="why-pillar"
              initial={reduceMotion ? false : { opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.34, delay: i * 0.08, ease: "easeOut" }}
            >
              <span className="why-pillar__icon">
                <Icon style={{ width: 18, height: 18 }} />
              </span>
              <div className="why-pillar__text">
                <h3 className="why-pillar__title">{title}</h3>
                <p className="why-pillar__body">{body}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
