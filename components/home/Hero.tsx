import { ArrowDown, ArrowRight, Check, Star } from "lucide-react";
import {
  Section,
  Display,
  Lede,
  I,
  ButtonLink,
  Badge,
  ImageFrame,
} from "@/components/shm/Shm";

const AVATAR_TOKENS = [
  "bg-honey-soft",
  "bg-ember-soft",
  "bg-cream",
  "bg-honey",
];

export default function Hero() {
  return (
    <Section recipe="snow">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center">
        <div>
          <Badge variant="live">
            <Check size={12} strokeWidth={2.5} />
            Live now: Shmo Review · 3 more on the way
          </Badge>
          <div className="mt-5">
            <Display>
              The toolkit your crew&apos;s been <I>missing</I>.
            </Display>
          </div>
          <Lede className="mt-5 max-w-[520px]">
            Four tools built for local shops. Reviews, contacts, links,
            reputation — every customer interaction your crew was letting
            slip through the cracks.
          </Lede>
          <div className="flex flex-wrap gap-3 mt-7">
            <ButtonLink variant="accent" size="lg" href="#family">
              Meet the tools
              <ArrowDown size={16} strokeWidth={1.75} />
            </ButtonLink>
            <ButtonLink variant="ghost" size="lg" href="#review">
              Shop Shmo Review
              <ArrowRight size={16} strokeWidth={1.75} />
            </ButtonLink>
          </div>
          <div className="flex items-center gap-4 mt-7">
            <div className="flex">
              {AVATAR_TOKENS.map((tok, i) => (
                <span
                  key={tok}
                  aria-hidden="true"
                  className={`w-7 h-7 rounded-full border-2 border-paper ${tok}`}
                  style={{ marginLeft: i === 0 ? 0 : -10, zIndex: 4 - i }}
                />
              ))}
            </div>
            <div>
              <span
                aria-label="5 of 5 stars"
                className="flex items-center gap-[2px] text-honey-deep"
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    size={13}
                    strokeWidth={1.5}
                    fill="currentColor"
                  />
                ))}
              </span>
              <p className="shm-meta text-ink-3 mt-1">
                Loved by <strong className="text-ink">Carly</strong>,{" "}
                <strong className="text-ink">Marshall</strong>,{" "}
                <strong className="text-ink">Joey</strong>, and{" "}
                <strong className="text-ink">Allan</strong>
              </p>
            </div>
          </div>
        </div>
        <ImageFrame
          ratio="1/1"
          className="max-w-[520px] w-full mx-auto lg:ml-auto lg:mr-0"
        >
          <div className="w-full h-full flex flex-col items-center justify-center text-center px-6">
            <span className="shm-eyebrow">Placeholder</span>
            <span className="shm-body mt-2 max-w-[28ch]">
              Hero stage — toolkit visual (3D nano-banana, swap during
              imagery sprint)
            </span>
          </div>
        </ImageFrame>
      </div>
    </Section>
  );
}
