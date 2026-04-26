import { Section, Eyebrow, H2, Lede, I, FamilyTile } from "@/components/shm/Shm";

const FAMILY = [
  {
    brandKey: "review" as const,
    glyph: "R",
    italic: "Review",
    desc: "One tap. One five-star review.",
    status: "live" as const,
    cta: "Shop now",
    href: "#review",
  },
  {
    brandKey: "biz" as const,
    glyph: "B",
    italic: "Biz",
    desc: "Your business card, upgraded.",
    status: "soon" as const,
    cta: "Get notified",
    href: "#biz",
  },
  {
    brandKey: "link" as const,
    glyph: "L",
    italic: "Link",
    desc: "All your links. One place.",
    status: "soon" as const,
    cta: "Get notified",
    href: "#link",
  },
  {
    brandKey: "rep" as const,
    glyph: "M",
    italic: "Reputation",
    desc: "Every review, answered automatically.",
    status: "soon" as const,
    cta: "Get notified",
    href: "#reputation",
  },
];

export default function ShmoFamily() {
  return (
    <Section recipe="cream-soft" id="family">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-7 lg:gap-12 items-end mb-9">
        <div>
          <Eyebrow>Meet the family</Eyebrow>
          <H2 className="mt-2">
            Pick your <I>tool</I>.
          </H2>
        </div>
        <Lede>
          Four sub-brands, one shared platform. Shmo Review is available now;
          the rest are coming over the next few quarters.
        </Lede>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FAMILY.map((item) => (
          <FamilyTile
            key={item.brandKey}
            brandKey={item.brandKey}
            glyph={item.glyph}
            name="Shmo"
            italic={item.italic}
            desc={item.desc}
            status={item.status}
            ctaLabel={item.cta}
            href={item.href}
          />
        ))}
      </div>
    </Section>
  );
}
