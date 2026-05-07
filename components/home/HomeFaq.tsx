// components/home/HomeFaq.tsx
// Server component. Soft hairline list, max-width 760px. Sticker mascot
// in corner of section head (one of the two homepage stickers).

import "./home.css";
import Section from "@/components/layout/Section";
import Sticker from "@/components/Sticker";
import FaqItem from "./FaqItem";
import { FAQ } from "./home-data";

export default function HomeFaq() {
  return (
    <Section bg="marsh" nextBg="ember" waveSize="lg" ariaLabel="Frequently asked questions">
      <div className="home-faq__wrap">
        <div className="home-faq__head">
          <span className="shm-eyebrow">Common questions</span>
          <h2 className="shm-h2">Quick answers, <em>no fluff</em>.</h2>
          <Sticker
            pose="thinking"
            size="md"
            tilt="r"
            className="home-faq__sticker"
            alt=""
          />
        </div>
        <ul className="shm-faq-list">
          {FAQ.map((f, i) => (
            <FaqItem key={f.q} question={f.q} answer={f.a} defaultOpen={i === 0} />
          ))}
        </ul>
      </div>
    </Section>
  );
}
