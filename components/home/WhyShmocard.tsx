import { Boxes, Users, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

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
    <section
      id="why"
      aria-label="Why Shmocard"
      className="bg-snow border-b border-hair"
    >
      <div className="max-w-[1320px] mx-auto px-7 py-9">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-7 lg:gap-8 items-start">
          <div className="max-w-[28ch]">
            <span className="inline-flex items-center gap-3 mb-3">
              <span
                aria-hidden="true"
                className="block w-[22px] h-px bg-ember opacity-50"
              />
              <span className="t-eyebrow-italic">Why Shmocard</span>
            </span>
            <h2 className="t-h2">
              Simple tools. Real results.{" "}
              <em className="font-serif italic font-normal text-ember">
                No
              </em>{" "}
              subscription on the cards.
            </h2>
            <p className="t-lede mt-4">
              Built around the one thing every customer carries — their
              phone. No apps, no logins, no rituals. Just tap.
            </p>
          </div>

          <ul className="border-t border-hair">
            {PILLARS.map(({ num, title, body, Icon }) => (
              <li
                key={num}
                className="grid grid-cols-[60px_1fr] gap-7 lg:gap-8 py-5 border-b border-hair items-start"
              >
                <span
                  className="font-serif italic font-normal text-ember tabular-nums"
                  style={{ fontSize: "36px", lineHeight: 1 }}
                >
                  {num}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 rounded-sm bg-ember-soft text-ember-deep flex items-center justify-center shrink-0">
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
      </div>
    </section>
  );
}
