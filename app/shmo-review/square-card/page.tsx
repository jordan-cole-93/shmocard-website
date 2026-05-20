import ComingSoon from "@/components/ComingSoon";

export const metadata = { title: "Shmo Review · Square Card — Coming Soon | ShmoCard" };

export default function SquareCardPage() {
  return <ComingSoon
    eyebrow="Shmo Review · Square Card"
    title={<>Sticks to anything. Stays <em>everywhere</em>.</>}
    lede={`An adhesive-backed disc for laptops, tablets, registers, dashboards. Travels with the crew. 2.25" disc, ships pre-programmed.`}
    mascotPose="thumbs-up"
  />;
}
