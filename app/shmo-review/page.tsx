// app/shmo-review/page.tsx — Shmo Review category page.
//
// Phase 0: scaffold only. Sections land in Phase 1+ per
// context/brainstorming/shmo-review.md.
//
// Reference page (1:1 replication target):
//   .claude/skills/shmocard-design-system/ui_kits/website/homepage-shmoreview/
//
// Server component. Client interactivity is opted-in inside leaf components.

import "./shmo-review.css";
import Hero from "@/components/shmo-review/Hero";
import BulletStrip from "@/components/shmo-review/BulletStrip";
import Buybox from "@/components/shmo-review/Buybox";
import FormatPicker from "@/components/shmo-review/FormatPicker";
import HowItWorks from "@/components/shmo-review/HowItWorks";
import StandoutMoments from "@/components/shmo-review/StandoutMoments";

export const metadata = {
  title: "Shmo Review — NFC tap cards built for crews",
  description:
    "NFC tap cards for crews. One card per person, fifteen reviews per week. Built for local shop crews.",
};

export default function ShmoReviewPage() {
  return (
    <main>
      <Hero />
      <BulletStrip />
      <Buybox />
      <FormatPicker />
      <HowItWorks />
      <StandoutMoments />
    </main>
  );
}
