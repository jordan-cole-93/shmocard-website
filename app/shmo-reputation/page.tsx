import ComingSoon from "@/components/ComingSoon";

export const metadata = { title: "Shmo Reputation — Coming Soon | ShmoCard" };

export default function ShmoReputationPage() {
  return <ComingSoon
    eyebrow="Shmo Reputation"
    title={<>Your reviews. Your <em>dashboard</em>.</>}
    lede="Track, respond, and grow your reputation from one place. No switching tabs, no copy-paste."
    mascotPose="megaphone"
  />;
}
