"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export function BulkMath() {
  const reduceMotion = useReducedMotion();
  const fadeUp = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.4, delay, ease: "easeOut" as const },
  });

  return (
    <div className="bulkmath">
      <motion.h3 className="bulkmath__heading" {...fadeUp(0)}>
        The math behind a crew kit.
      </motion.h3>

      <div className="bulkmath__body">
        <motion.div className="bulkmath__stack" {...fadeUp(0.05)}>
          <div className="bulkmath__card bulkmath__card--quiet">
            <div className="bulkmath__num bulkmath__num--ink">2</div>
            <div className="bulkmath__unit">reviews/week</div>
            <div className="bulkmath__sub">One card behind the counter</div>
          </div>

          <div className="bulkmath__connector" aria-hidden="true">↓</div>

          <div className="bulkmath__card bulkmath__card--ember">
            <div className="bulkmath__num bulkmath__num--ember">15</div>
            <div className="bulkmath__unit">reviews/week</div>
            <div className="bulkmath__sub">One per employee</div>
          </div>
        </motion.div>

        <motion.div className="bulkmath__mascot" {...fadeUp(0.15)} aria-hidden="true">
          <Image
            src="/mascot/crew-lineup.png"
            alt=""
            width={520}
            height={520}
          />
        </motion.div>
      </div>

      <motion.p className="bulkmath__takeaway" {...fadeUp(0.25)}>
        Same shop. <em>Seven times</em> the reviews. That&apos;s the math.
      </motion.p>
    </div>
  );
}
