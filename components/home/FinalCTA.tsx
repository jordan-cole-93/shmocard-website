import { ArrowRight } from "lucide-react";
import { Section, Eyebrow, H2, Lede, I, ButtonLink } from "@/components/shm/Shm";

export default function FinalCTA() {
  return (
    <Section recipe="snow" id="get-started" className="!pt-4 lg:!pt-8">
      <div className="shm-cocoa-hot rounded-2xl max-w-[920px] mx-auto px-8 py-12 lg:px-12 lg:py-14">
        <div className="shm-cocoa-hot__glow" aria-hidden="true" />
        <div className="relative z-[1] text-center max-w-[680px] mx-auto">
          <Eyebrow>Ready when you are</Eyebrow>
          <H2 className="mt-2">
            One card per person. <I>Fifteen</I> reviews per week.
          </H2>
          <Lede className="mt-3 mx-auto">
            Shmo Review is live today. Biz, Link, and Reputation are next.
          </Lede>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <ButtonLink variant="primary" size="lg" href="#review">
              Shop Shmo Review
              <ArrowRight size={16} strokeWidth={1.75} />
            </ButtonLink>
            <ButtonLink variant="ghost" size="lg" href="#family">
              Join the waitlist
              <ArrowRight size={16} strokeWidth={1.75} />
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
