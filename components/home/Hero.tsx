import { ArrowDown, ArrowRight, Check, Star } from "lucide-react";

const AVATAR_TOKENS = [
  "bg-honey-soft",
  "bg-ember-soft",
  "bg-cream",
  "bg-honey",
];

export default function Hero() {
  return (
    <section className="bg-snow">
      <div className="max-w-[1320px] mx-auto px-7 py-9 lg:py-9">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-7 items-center">
          <div className="max-w-[560px]">
            <span className="inline-flex items-center gap-2 rounded-full bg-paper border border-hair px-3 py-1 text-ink-2 shadow-sm">
              <span className="w-5 h-5 rounded-full bg-success-soft text-success flex items-center justify-center">
                <Check size={12} strokeWidth={2.25} />
              </span>
              <span className="t-meta text-ink-2">
                Live now: Shmo Review · 3 more on the way
              </span>
            </span>

            <h1 className="t-display mt-5">
              The toolkit your crew&apos;s been{" "}
              <em className="font-serif italic font-normal text-ember">
                missing
              </em>
              .
            </h1>

            <p className="t-lede mt-5 max-w-[520px]">
              Four tools built for local shops. Reviews, contacts, links,
              reputation — every customer interaction your crew was letting
              slip through the cracks.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#family"
                className="inline-flex items-center gap-2 h-12 px-5 rounded-md bg-ink text-paper font-semibold hover:bg-cocoa-deep transition-colors active:scale-[0.98]"
              >
                Meet the tools
                <ArrowDown size={16} strokeWidth={1.75} />
              </a>
              <a
                href="#review"
                className="inline-flex items-center gap-2 h-12 px-5 rounded-md bg-paper text-ink border border-hair-2 font-semibold hover:bg-cream-soft transition-colors active:scale-[0.98]"
              >
                Shop Shmo Review
                <ArrowRight size={16} strokeWidth={1.75} />
              </a>
            </div>

            <div className="mt-7 flex items-center gap-4">
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
                <p className="t-meta text-ink-3 mt-1">
                  Loved by <strong className="text-ink">Carly</strong>,{" "}
                  <strong className="text-ink">Marshall</strong>,{" "}
                  <strong className="text-ink">Joey</strong>, and{" "}
                  <strong className="text-ink">Allan</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="lg:pl-7">
            <div
              className="relative rounded-2xl border border-hair shadow-card overflow-hidden bg-ember-soft max-w-[520px] mx-auto lg:ml-auto lg:mr-0"
              style={{
                aspectRatio: "1/1",
                backgroundImage:
                  "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.40), transparent 45%), radial-gradient(circle at 75% 80%, rgba(255,184,51,0.18), transparent 50%)",
              }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                <span className="t-eyebrow text-muted">Placeholder</span>
                <span className="t-body mt-2 text-ink-3 max-w-[28ch]">
                  Hero stage — toolkit visual (3D nano-banana, swap during
                  imagery sprint)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
