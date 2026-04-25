import Link from "next/link";
import { Icon } from "@/lib/icons";
import { SpotlightHeader } from "./spotlight/SpotlightHeader";
import { HowItWorks } from "./spotlight/HowItWorks";
import { BulkMath } from "./spotlight/BulkMath";
import { ThreeFormats } from "./spotlight/ThreeFormats";
import { ResultsStrip } from "./spotlight/ResultsStrip";

export function ShmoReviewSpotlight() {
  return (
    <section id="review" className="hsection">
      <SpotlightHeader />
      <div className="hsection__body">
        <HowItWorks />
        <BulkMath />
        <ThreeFormats />
        <ResultsStrip />

        <div className="spotlight__cta">
          <Link className="btn btn--primary btn--lg" href="/shmo-review">
            Shop Shmo Review <Icon.Arrow style={{ width: 16, height: 16 }} />
          </Link>
        </div>
      </div>
    </section>
  );
}
