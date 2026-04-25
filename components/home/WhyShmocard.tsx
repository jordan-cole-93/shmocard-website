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
    <section id="why" className="hsection">
      <div className="hsection__head">
        <div>
          <div className="hsection__eyebrow">Why Shmocard</div>
          <h2 className="hsection__title">
            Simple tools. Real results. <em>No subscription</em> on the cards.
          </h2>
        </div>
      </div>
      <div className="hsection__body">
        <div className="why">
          {PILLARS.map(({ Icon, title, body }, i) => (
            <motion.div
              key={title}
              className="why__pillar"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.32, delay: i * 0.08, ease: "easeOut" }}
            >
              <Icon className="why__icon" style={{ width: 28, height: 28 }} />
              <h3 className="why__title">{title}</h3>
              <p className="why__body">{body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
