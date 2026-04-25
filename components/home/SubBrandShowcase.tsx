"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/lib/icons";
import { Star, Briefcase, Link2, Megaphone } from "lucide-react";

type Surface = "paper" | "honey" | "blush" | "chocolate";

interface Box {
  id: string;
  status: "live" | "soon";
  Icon: typeof Star;
  italic: string;
  tagline: string;
  description: string;
  cta: { label: string; href: string };
  surface: Surface;
}

const BOXES: Box[] = [
  {
    id: "review",
    status: "live",
    Icon: Star,
    italic: "Review",
    tagline: "One tap. One five-star review.",
    description:
      "NFC cards, signs and discs that send happy customers straight to your Google profile.",
    cta: { label: "Shop now", href: "/shmo-review" },
    surface: "paper",
  },
  {
    id: "biz",
    status: "soon",
    Icon: Briefcase,
    italic: "Biz",
    tagline: "Your business card, upgraded.",
    description:
      "Lives on the customer's phone the moment you tap. Always up to date.",
    cta: { label: "Get notified", href: "#" },
    surface: "honey",
  },
  {
    id: "link",
    status: "soon",
    Icon: Link2,
    italic: "Link",
    tagline: "All your links. One place.",
    description:
      "Google profile, booking, menu, socials — all in one branded hub.",
    cta: { label: "Get notified", href: "#" },
    surface: "blush",
  },
  {
    id: "reputation",
    status: "soon",
    Icon: Megaphone,
    italic: "Reputation",
    tagline: "Every review, answered.",
    description:
      "Auto-reply to every review in your brand's voice, while you keep working.",
    cta: { label: "Get notified", href: "#" },
    surface: "chocolate",
  },
];

export function SubBrandShowcase() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="family" className="showcase">
      <div className="showcase__inner">
        <div className="showcase__head">
          <span className="showcase__eyebrow">Meet the toolkit</span>
          <h2 className="showcase__title">
            Four tools. <em>One</em> family.
          </h2>
          <p className="showcase__lede">
            Reviews, business cards, link hubs, reputation — one platform for every
            customer interaction your crew was letting slip.
          </p>
        </div>

        <div className="showcase__grid">
          {BOXES.map((b, i) => (
            <motion.article
              key={b.id}
              id={b.id}
              className={`showcase__box showcase__box--${b.surface}`}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.36, delay: i * 0.06, ease: "easeOut" }}
            >
              <span className={`showcase__status showcase__status--${b.status}`}>
                {b.status === "live" ? "Live now" : "Coming soon"}
              </span>

              <span className="showcase__icon">
                <b.Icon style={{ width: 28, height: 28 }} />
              </span>

              <h3 className="showcase__name">
                Shmo <em>{b.italic}</em>
              </h3>

              <p className="showcase__tagline">{b.tagline}</p>
              <p className="showcase__desc">{b.description}</p>

              <div className="showcase__foot">
                {b.status === "live" ? (
                  <Link
                    className="btn btn--primary btn--sm showcase__cta"
                    href={b.cta.href}
                  >
                    {b.cta.label}{" "}
                    <Icon.Arrow style={{ width: 14, height: 14 }} />
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm showcase__cta"
                    onClick={(e) => e.preventDefault()}
                  >
                    {b.cta.label}{" "}
                    <Icon.Arrow style={{ width: 14, height: 14 }} />
                  </button>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
