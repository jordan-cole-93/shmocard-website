import ComingSoon from "@/components/ComingSoon";

export const metadata = { title: "Shmo Biz — Coming Soon | ShmoCard" };

export default function ShmoBizPage() {
  return <ComingSoon
    eyebrow="Shmo Biz"
    title={<>Business profile tools for your <em>crew</em>.</>}
    lede="One dashboard to manage your Google Business Profile — reviews, updates, and photos. Coming soon."
    mascotPose="holding-card"
  />;
}
