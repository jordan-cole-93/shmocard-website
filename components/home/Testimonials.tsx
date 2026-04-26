import { Play } from "lucide-react";
import { Section, Eyebrow, H2, Lede, I } from "@/components/shm/Shm";

type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
  brand: string;
  duration?: string;
  cardBg: string;
  pending?: boolean;
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: "carly-1",
    quote:
      "Got 14 in the first week. Marshall's already gotten five today and we've been open for an hour and a half.",
    author: "Carly",
    role: "Owner, Axel's Pawn",
    brand: "Axel's",
    duration: "1:42",
    cardBg: "bg-[#2A130A]",
  },
  {
    id: "carly-2",
    quote: "He got five Google reviews in less than two hours of being open.",
    author: "Carly",
    role: "Owner, Axel's Pawn",
    brand: "Axel's",
    duration: "0:58",
    cardBg: "bg-cocoa",
  },
  {
    id: "joey",
    quote: "More five-star moments incoming.",
    author: "Joey",
    role: "Quote pending",
    brand: "—",
    cardBg: "bg-ember",
    pending: true,
  },
];

export default function Testimonials() {
  return (
    <Section recipe="cream" id="testimonials">
      <div className="max-w-[720px]">
        <Eyebrow>What crews say</Eyebrow>
        <H2 className="mt-3">
          Real crews, real <I>five-star</I> moments.
        </H2>
        <Lede className="mt-4">
          Short stories from owner-operators who put Shmocards on their teams.
          No script, no vague metrics — just what changed.
        </Lede>
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        {TESTIMONIALS.map((t) => (
          <article
            key={t.id}
            className="rounded-xl border border-hair overflow-hidden bg-paper flex flex-col"
          >
            <div
              className={`relative ${t.cardBg} text-paper p-7 flex flex-col justify-between`}
              style={{ minHeight: "320px" }}
            >
              {t.duration && (
                <span className="absolute top-4 right-4 text-[11px] font-semibold rounded-full bg-[rgba(0,0,0,0.4)] text-paper px-2 py-1">
                  {t.duration}
                </span>
              )}
              {t.pending && (
                <span className="absolute top-4 right-4 text-[10px] font-semibold tracking-[1.4px] uppercase rounded-full bg-[rgba(255,255,255,0.85)] text-ember-deep px-2 py-1">
                  Coming soon
                </span>
              )}
              {!t.pending && (
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper text-ink flex items-center justify-center"
                  style={{ width: "56px", height: "56px" }}
                >
                  <Play size={22} strokeWidth={1.5} fill="currentColor" />
                </span>
              )}
              <blockquote className="mt-auto font-serif italic text-[16px] leading-[1.5] text-paper max-w-[28ch]">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
            </div>

            <footer className="px-5 py-4 flex items-center justify-between">
              <div className="flex flex-col leading-tight">
                <span className="text-[14px] font-semibold text-ink">
                  {t.author}
                </span>
                <span className="text-[12.5px] text-ink-3 mt-0.5">
                  {t.role}
                </span>
              </div>
              <span className="font-serif italic text-[14px] text-ink-3">
                {t.brand}
              </span>
            </footer>
          </article>
        ))}
      </div>
    </Section>
  );
}
