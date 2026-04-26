import { ArrowRight } from "lucide-react";

type FamilyItem = {
  key: string;
  glyph: string;
  italic: string;
  desc: string;
  status: "live" | "soon";
  cta: string;
  href: string;
  glyphBg: string;
  glyphText: string;
};

const FAMILY: FamilyItem[] = [
  {
    key: "review",
    glyph: "R",
    italic: "Review",
    desc: "One tap. One five-star review.",
    status: "live",
    cta: "Shop now",
    href: "#review",
    glyphBg: "bg-ember-deep",
    glyphText: "text-cream",
  },
  {
    key: "biz",
    glyph: "B",
    italic: "Biz",
    desc: "Your business card, upgraded.",
    status: "soon",
    cta: "Get notified",
    href: "#biz",
    glyphBg: "bg-ink",
    glyphText: "text-cream",
  },
  {
    key: "link",
    glyph: "L",
    italic: "Link",
    desc: "All your links. One place.",
    status: "soon",
    cta: "Get notified",
    href: "#link",
    glyphBg: "bg-honey",
    glyphText: "text-ink",
  },
  {
    key: "rep",
    glyph: "M",
    italic: "Reputation",
    desc: "Every review, answered automatically.",
    status: "soon",
    cta: "Get notified",
    href: "#reputation",
    glyphBg: "bg-cocoa-deep",
    glyphText: "text-cream",
  },
];

export default function ShmoFamily() {
  return (
    <section id="family" className="bg-cream-soft">
      <div className="max-w-[1320px] mx-auto px-7 py-9">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-6 lg:gap-12 items-end mb-9">
          <div>
            <span className="inline-flex items-center gap-3 mb-2">
              <span
                aria-hidden="true"
                className="block w-[22px] h-px bg-ember opacity-50"
              />
              <span className="t-eyebrow-italic">Meet the family</span>
            </span>
            <h2 className="t-h2">
              Pick your{" "}
              <em className="font-serif italic font-normal text-ember">
                tool
              </em>
              .
            </h2>
          </div>
          <p className="t-lede">
            Four sub-brands, one shared platform. Shmo Review is available
            now; the rest are coming over the next few quarters.
          </p>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FAMILY.map((item) => {
            const live = item.status === "live";
            return (
              <li key={item.key}>
                <a
                  href={item.href}
                  className={`relative flex flex-col h-full min-h-[320px] rounded-xl border p-7 shadow-sm transition hover:shadow-md hover:-translate-y-[3px] ${
                    live
                      ? "bg-paper border-hair-2"
                      : "bg-paper border-hair"
                  }`}
                >
                  <span
                    className={`absolute top-4 right-4 text-[10.5px] font-semibold tracking-[0.8px] uppercase rounded-full px-2 py-1 ${
                      live
                        ? "bg-success-soft text-success"
                        : "bg-hair text-muted"
                    }`}
                  >
                    {live ? "Available now" : "Coming soon"}
                  </span>

                  <span
                    className={`w-12 h-12 rounded-md inline-flex items-center justify-center font-bold text-[18px] tracking-[-0.02em] mb-5 ${item.glyphBg} ${item.glyphText}`}
                  >
                    {item.glyph}
                  </span>

                  <h3 className="t-h3">
                    Shmo{" "}
                    <em className="font-serif italic font-normal text-ember">
                      {item.italic}
                    </em>
                  </h3>

                  <p className="t-body text-ink-3 mt-2">{item.desc}</p>

                  <div
                    className={`mt-auto pt-6 flex items-center gap-2 t-meta font-medium ${
                      live ? "text-ink" : "text-muted"
                    }`}
                  >
                    {item.cta}
                    <ArrowRight size={14} strokeWidth={1.75} />
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
