"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

interface Format {
  slug: string;
  name: string;
  desc: string;
  image: string;
}

const FORMATS: Format[] = [
  {
    slug: "cr-80",
    name: "CR-80 Card",
    desc: "Standard wallet-size NFC card. Core product. One per employee.",
    image: "/products/card-cr80.jpg",
  },
  {
    slug: "l-sign",
    name: "L-Sign",
    desc: "Acrylic counter-top standee. Stands at eye level.",
    image: "/products/card-lsign.jpg",
  },
  {
    slug: "square-card",
    name: "Square Card",
    desc: "Square NFC format.",
    image: "/products/card-square.jpg",
  },
];

export function ThreeFormats() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="formats">
      <motion.h3
        className="formats__heading"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        Three formats. <em>One</em> job.
      </motion.h3>

      <div className="formats__grid">
        {FORMATS.map((f, i) => (
          <motion.div
            key={f.slug}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.32, delay: i * 0.06, ease: "easeOut" }}
          >
            <Link href={`/shmo-review/${f.slug}`} className="formats__card">
              <div className="formats__media">
                <Image src={f.image} alt={`${f.name} product photo`} width={400} height={300} />
              </div>
              <h4 className="formats__name">{f.name}</h4>
              <p className="formats__desc">{f.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
