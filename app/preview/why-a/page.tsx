"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Zap, Boxes } from "lucide-react";
import "../../home.css";
import "../preview.css";

const PILLARS = [
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

export default function WhyA() {
  return (
    <div className="home">
      <div className="preview-shell">
        <div className="preview-shell__inner">
          <Link className="preview-shell__crumb" href="/preview">
            ← Back to variants
          </Link>

          <div className="wa-grid">
            <div className="wa-intro">
              <span className="wa-intro__eyebrow">Why Shmocard</span>
              <h1 className="wa-intro__title">
                Simple tools. Real results. <em>No</em> subscription on the cards.
              </h1>
              <p className="wa-intro__lede">
                Built around the one thing every customer carries — their phone.
                No apps, no logins, no rituals. Just tap.
              </p>
            </div>

            <ul className="wa-list">
              {PILLARS.map((p, i) => (
                <motion.li
                  key={p.num}
                  className="wa-pillar"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.36, delay: i * 0.08, ease: "easeOut" }}
                >
                  <span className="wa-pillar__num">{p.num}</span>
                  <div className="wa-pillar__body">
                    <div className="wa-pillar__row">
                      <span className="wa-pillar__icon">
                        <p.Icon style={{ width: 16, height: 16 }} />
                      </span>
                      <h2 className="wa-pillar__title">{p.title}</h2>
                    </div>
                    <p className="wa-pillar__text">{p.body}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
