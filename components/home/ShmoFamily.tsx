"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/lib/icons";

type Status = "live" | "soon";

interface FamilyItem {
  key: string;
  name: string;
  italic: string;
  desc: string;
  status: Status;
  cta: string;
  ctaHref: string;
  glyph: string;
}

const FAMILY: FamilyItem[] = [
  { key: "review", name: "Shmo Review", italic: "Review", desc: "One tap. One five-star review.", status: "live", cta: "Shop now", ctaHref: "/shmo-review", glyph: "R" },
  { key: "biz", name: "Shmo Biz", italic: "Biz", desc: "Your business card, upgraded.", status: "soon", cta: "Get notified", ctaHref: "#", glyph: "B" },
  { key: "link", name: "Shmo Link", italic: "Link", desc: "All your links. One place.", status: "soon", cta: "Get notified", ctaHref: "#", glyph: "L" },
  { key: "rep", name: "Shmo Reputation", italic: "Reputation", desc: "Every review, answered automatically.", status: "soon", cta: "Get notified", ctaHref: "#", glyph: "M" },
];

function FamilyTileBody({ item }: { item: FamilyItem }) {
  const live = item.status === "live";
  return (
    <>
      <span className={`family__status ${live ? "family__status--live" : "family__status--soon"}`}>
        {live ? "Available now" : "Coming soon"}
      </span>
      <div className={`family__glyph family__glyph--${item.key}`}>{item.glyph}</div>
      <h3 className="family__name">
        Shmo <em>{item.italic}</em>
      </h3>
      <p className="family__desc">{item.desc}</p>
      <div className="family__foot">
        {item.cta} <Icon.Arrow style={{ width: 14, height: 14 }} />
      </div>
    </>
  );
}

function FamilyTile({ item, index, reduceMotion }: { item: FamilyItem; index: number; reduceMotion: boolean }) {
  const live = item.status === "live";
  const className = `family__tile ${live ? "family__tile--live" : "family__tile--soon"}`;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.32, delay: index * 0.06, ease: "easeOut" }}
    >
      {live ? (
        <Link href={item.ctaHref} className={className}>
          <FamilyTileBody item={item} />
        </Link>
      ) : (
        <a href={item.ctaHref} className={className} onClick={(e) => e.preventDefault()}>
          <FamilyTileBody item={item} />
        </a>
      )}
    </motion.div>
  );
}

export function ShmoFamily() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="family" className="hsection">
      <div className="hsection__head">
        <div>
          <div className="hsection__eyebrow">Meet the family</div>
          <h2 className="hsection__title">
            Pick your <em>tool</em>.
          </h2>
        </div>
        <p className="hsection__lede">
          Four sub-brands, one shared platform. Shmo Review is available now;
          the rest are coming over the next few quarters.
        </p>
      </div>
      <div className="hsection__body">
        <div className="family">
          {FAMILY.map((item, i) => (
            <FamilyTile key={item.key} item={item} index={i} reduceMotion={!!reduceMotion} />
          ))}
        </div>
      </div>
    </section>
  );
}
