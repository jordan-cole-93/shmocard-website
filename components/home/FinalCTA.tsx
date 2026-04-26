import { ArrowRight } from "lucide-react";
import { Section, Eyebrow, H2, Lede, I, ButtonLink } from "@/components/shm/Shm";

export default function FinalCTA() {
  return (
    <Section recipe="cocoa-hot" id="get-started">
      <div className="text-center max-w-[820px] mx-auto">
        <Eyebrow>Ready when you are</Eyebrow>
        <H2 className="mt-3">
          One card per person. <I>Fifteen</I> reviews per week.
        </H2>
        <Lede className="mt-4 mx-auto">
          Shmo Review is live today. Biz, Link, and Reputation are next.
        </Lede>
        <div className="flex flex-wrap justify-center gap-3 mt-7">
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
    </Section>
  );
}
