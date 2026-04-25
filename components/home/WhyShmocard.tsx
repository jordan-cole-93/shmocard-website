"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Users, Zap, Boxes } from "lucide-react";

interface Pillar {
  num: string;
  Icon: typeof Users;
  title: string;
  body: string;
}

const PILLARS: Pillar[] = [
  {
    num: "01",
    Icon: Users,
    title: "Built for the whole crew",
    body: "Not just the owner. One tool per employee means seven times more interactions captured.",
  },
  {
    num: "02",
    Icon: Zap,
    title: "No apps. No logins. No friction.",
    body: "Customers tap, scan, or click. That's it. No account creation, no download, no walkthroughs.",
  },
  {
    num: "03",
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
          <span className="why-section__eyebrow">Why Shmocard</span>
          <h2 className="why-section__title">
            Simple tools. Real results. <em>No</em> subscription on the cards.
          </h2>
          <p className="why-section__lede">
            Built around the one thing every customer carries — their phone.
            No apps, no logins, no rituals. Just tap.
          </p>
        </div>

        <ul className="why-section__pillars">
          {PILLARS.map((p, i) => (
            <motion.li
              key={p.num}
              className="why-pillar"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.36, delay: i * 0.08, ease: "easeOut" }}
            >
              <span className="why-pillar__num">{p.num}</span>
              <div className="why-pillar__body">
                <div className="why-pillar__row">
                  <span className="why-pillar__icon">
                    <p.Icon style={{ width: 16, height: 16 }} />
                  </span>
                  <h3 className="why-pillar__title">{p.title}</h3>
                </div>
                <p className="why-pillar__text">{p.body}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
