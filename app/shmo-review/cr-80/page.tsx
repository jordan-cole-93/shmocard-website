// app/shmo-review/cr-80/page.tsx — CR-80 product detail page.
//
// First pass uses the existing Shmo Review buybox component so the PDP
// stays aligned with the current Shmocard design-system composition.

import "../shmo-review.css";
import Buybox from "@/components/shmo-review/Buybox";
import Proof from "@/components/shmo-review/cr-80/Proof";
import CrewStrip from "@/components/home/CrewStrip";
import HowItWorks from "@/components/shmo-review/HowItWorks";

export const metadata = {
  title: "CR-80 Review Card — Shmo Review",
  description:
    "Wallet-size NFC Google review card for shop crews. Pre-programmed before shipping, with QR fallback and free reprogramming.",
};

export default function Cr80Page() {
  return (
    <main>
      <Buybox nextBg="graham" />
      <Proof />
      <CrewStrip nextBg="marsh" />
      <HowItWorks />
    </main>
  );
}
