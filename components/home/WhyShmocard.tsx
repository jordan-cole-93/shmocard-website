import { Boxes, Users, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Section, Eyebrow, H2, Lede, I } from "@/components/shm/Shm";

type Pillar = {
  num: string;
  title: string;
  body: string;
  Icon: LucideIcon;
};

const PILLARS: Pillar[] = [
  {
    num: "01",
    title: "Built for the whole crew",
    body: "Not just the owner. One tool per employee means seven times more interactions captured.",
    Icon: Users,
  },
  {
    num: "02",
    title: "No apps. No logins. No friction.",
    body: "Customers tap, scan, or click. That's it. No account creation, no download, no walkthroughs.",
    Icon: Zap,
  },
  {
    num: "03",
    title: "One family. Not four subscriptions.",
    body: "Every Shmocard tool works together. Early adopters get grandfathered into new tools.",
    Icon: Boxes,
  },
];

export default function WhyShmocard() {
  return (
    <Section recipe="snow" id="why">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8 lg:gap-16 items-start">
        <div className="max-w-[28ch]">
          <Eyebrow>Why Shmocard</Eyebrow>
          <H2 className="mt-3">
            Simple tools. Real results. <I>No</I> subscription on the cards.
          </H2>
          <Lede className="mt-4">
            Built around the one thing every customer carries — their phone.
            No apps, no logins, no rituals. Just tap.
          </Lede>
        </div>

        <ul className="border-t border-hair">
          {PILLARS.map(({ num, title, body, Icon }) => (
            <li
              key={num}
              className="grid grid-cols-[60px_1fr] gap-7 lg:gap-8 py-6 border-b border-hair items-start"
            >
              <span
                className="font-serif italic font-normal text-ember tabular-nums"
                style={{ fontSize: "36px", lineHeight: 1 }}
              >
                {num}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="rounded-sm bg-ember-soft text-ember-deep flex items-center justify-center shrink-0" style={{ width: "26px", height: "26px" }}>
                    <Icon size={16} strokeWidth={1.7} />
                  </span>
                  <h3 className="text-[19px] font-semibold tracking-[-0.015em] text-ink">
                    {title}
                  </h3>
                </div>
                <p className="text-[15px] leading-[1.55] text-ink-3 max-w-[60ch]">
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
