import { Section, Eyebrow, H2, Lede, I } from "@/components/shm/Shm";

type Crew = { id: string; client: string; tileBg: string };

const CREWS: Crew[] = [
  { id: "garden", client: "Garden City", tileBg: "bg-cream" },
  { id: "buffalo", client: "Buffalo Jewelry", tileBg: "bg-honey-soft" },
  { id: "axels", client: "Axel's Pawn", tileBg: "bg-ember-soft" },
  { id: "cc", client: "CC Pawn", tileBg: "bg-cream-soft" },
  { id: "granters", client: "Granters", tileBg: "bg-snow" },
  { id: "allan", client: "Allan Macias", tileBg: "bg-honey-soft" },
];

const STRIPE_PATTERN =
  "repeating-linear-gradient(45deg, rgba(59,31,20,0.08) 0, rgba(59,31,20,0.08) 1px, transparent 1px, transparent 10px)";

export default function RealResults() {
  return (
    <Section recipe="snow" id="results">
      <div className="max-w-[720px]">
        <Eyebrow>Crews using Shmocard</Eyebrow>
        <H2 className="mt-3">
          Real shops, real <I>tap</I> moments.
        </H2>
        <Lede className="mt-4">
          Six local crews handing Shmocards across the counter today. Tap to
          leave a review — no app, no login, no friction.
        </Lede>
      </div>

      <ul className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
        {CREWS.map((c) => (
          <li key={c.id} className="flex flex-col gap-3">
            <figure
              className={`relative rounded-xl border border-hair overflow-hidden ${c.tileBg}`}
              style={{ aspectRatio: "1/1", backgroundImage: STRIPE_PATTERN }}
            >
              <figcaption className="absolute inset-0 flex items-center justify-center px-4 text-center">
                <span className="text-[10px] font-semibold tracking-[1.4px] uppercase text-ember-deep">
                  {c.client} shop photo
                </span>
              </figcaption>
            </figure>
            <span className="text-[14px] font-semibold text-ink text-center">
              {c.client}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
