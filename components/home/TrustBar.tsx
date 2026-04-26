import { Ban, Boxes, Home, Smartphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const TRUST_ITEMS: Array<{
  title: string;
  sub: string;
  Icon: LucideIcon;
}> = [
  {
    title: "Made for local shops",
    sub: "Independent crews everywhere",
    Icon: Home,
  },
  {
    title: "No subscription on cards",
    sub: "One-time purchase, yours forever",
    Icon: Ban,
  },
  {
    title: "Works on any phone",
    sub: "iPhone XS+, Android 5.0+",
    Icon: Smartphone,
  },
  {
    title: "One family, four tools",
    sub: "Reviews, contacts, links, reputation",
    Icon: Boxes,
  },
];

export default function TrustBar() {
  return (
    <section
      aria-label="Why crews choose Shmocard"
      className="bg-snow border-y border-hair"
    >
      <div className="shm-container py-6">
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-7">
          {TRUST_ITEMS.map(({ title, sub, Icon }) => (
            <li key={title} className="flex items-center gap-3">
              <span
                className="shrink-0 rounded-full bg-ember-soft text-ember-deep flex items-center justify-center"
                style={{ width: "36px", height: "36px" }}
              >
                <Icon size={16} strokeWidth={1.6} />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-[14px] font-semibold text-ink">
                  {title}
                </span>
                <span className="text-[12.5px] text-ink-3 mt-0.5">{sub}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
