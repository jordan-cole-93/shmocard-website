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
    title: (
      <>
        Built for the whole <em>crew</em>.
      </>
    ),
    body: "Not just the owner. One tool per employee means seven times more interactions captured. The card behind the counter does ~2 reviews/week. One per employee does ~15.",
    surface: "default" as const,
  },
  {
    num: "02",
    Icon: Zap,
    title: (
      <>
        No apps. No logins. <em>No</em> friction.
      </>
    ),
    body: "Customers tap, scan, or click. That's it. No account creation, no download, no walkthroughs. The product gets out of the way.",
    surface: "honey" as const,
    flip: true,
  },
  {
    num: "03",
    Icon: Boxes,
    title: (
      <>
        One family. <em>Not</em> four subscriptions.
      </>
    ),
    body: "Every Shmocard tool works together — same dashboard, same brand, same crew. Early adopters get grandfathered into new tools as we ship them.",
    surface: "blush" as const,
  },
];

export default function WhyB() {
  return (
    <div className="home">
      <div className="preview-shell">
        <div className="preview-shell__inner">
          <Link className="preview-shell__crumb" href="/preview">
            ← Back to variants
          </Link>

          <div className="preview-head">
            <span className="preview-head__eyebrow">Why Shmocard</span>
            <h1 className="preview-head__title">
              Simple tools. Real results. <em>No</em> subscription on the cards.
            </h1>
            <p className="preview-head__lede">
              Built around the one thing every customer carries — their phone.
              No apps, no logins, no rituals. Just tap.
            </p>
          </div>

          <div className="wb-rows">
            {PILLARS.map((p, i) => {
              const Icon = p.Icon;
              return (
                <motion.div
                  key={p.num}
                  className={`wb-row ${p.flip ? "wb-row--flip" : ""}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.36, delay: i * 0.06, ease: "easeOut" }}
                >
                  <div
                    className={`wb-row__visual ${
                      p.surface === "honey"
                        ? "wb-row__visual--honey"
                        : p.surface === "blush"
                        ? "wb-row__visual--blush"
                        : ""
                    }`}
                  >
                    <span className="wb-row__num">{p.num}</span>
                    <Icon style={{ width: 56, height: 56 }} strokeWidth={1.5} />
                  </div>
                  <div className="wb-row__copy">
                    <h2 className="wb-row__title">{p.title}</h2>
                    <p className="wb-row__text">{p.body}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
