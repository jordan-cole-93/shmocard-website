"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import "../../home.css";
import "../preview.css";

const PILLARS = [
  {
    num: "01",
    title: "Built for the whole crew",
    body: "Not just the owner. One tool per employee means seven times more interactions captured.",
  },
  {
    num: "02",
    title: "No apps. No logins. No friction.",
    body: "Customers tap, scan, or click. That's it. No account creation, no download.",
  },
  {
    num: "03",
    title: "One family. Not four subscriptions.",
    body: "Every Shmocard tool works together. Early adopters get grandfathered into new tools.",
  },
];

export default function WhyC() {
  return (
    <div className="home">
      <div className="preview-shell">
        <div className="preview-shell__inner">
          <Link className="preview-shell__crumb" href="/preview">
            ← Back to variants
          </Link>

          <div className="wc-shell">
            <motion.div
              className="wc-left"
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <span className="wc-left__eyebrow">Why Shmocard</span>
              <h2 className="wc-left__title">
                Simple tools. Real results. <em>No</em> subscription on the cards.
              </h2>
              <p className="wc-left__lede">
                Built around the one thing every customer carries — their phone.
                No apps, no logins, no rituals. Just tap.
              </p>
            </motion.div>

            <motion.div
              className="wc-right"
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.06 }}
            >
              {PILLARS.map((p, i) => (
                <motion.div
                  key={p.num}
                  className="wc-pillar"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.32, delay: 0.08 + i * 0.06, ease: "easeOut" }}
                >
                  <span className="wc-pillar__num">{p.num}</span>
                  <div className="wc-pillar__copy">
                    <h3 className="wc-pillar__title">{p.title}</h3>
                    <p className="wc-pillar__text">{p.body}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
