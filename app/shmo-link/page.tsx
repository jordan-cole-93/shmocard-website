import ComingSoon from "@/components/ComingSoon";

export const metadata = { title: "Shmo Link — Coming Soon | ShmoCard" };

export default function ShmoLinkPage() {
  return <ComingSoon
    eyebrow="Shmo Link"
    title={<>Smart NFC links for anywhere you <em>work</em>.</>}
    lede="Program a card once. Send customers anywhere — menu, booking page, your Instagram. Reprogrammable for life."
    mascotPose="heart-hands"
  />;
}
