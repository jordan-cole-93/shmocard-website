import ComingSoon from "@/components/ComingSoon";

export const metadata = { title: "Shmo Review · L-Sign — Coming Soon | ShmoCard" };

export default function LSignPage() {
  return <ComingSoon
    eyebrow="Shmo Review · L-Sign"
    title={<>Counter standee. Tap, scan, <em>done</em>.</>}
    lede="Lives next to the register. Guests tap on their way out — no staff prompt needed. 4×6 acrylic, ships pre-programmed."
    mascotPose="pointing"
  />;
}
