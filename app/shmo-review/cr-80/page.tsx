// app/shmo-review/cr-80/page.tsx — CR-80 product detail page.
//
// Phase 8: live Shopify data via getProductByHandle.
// CR-80 handle: 'google-reviews-nfc-tap-card-cr80'
//
// Graceful degradation: if Shopify returns null, Buybox uses its hardcoded
// defaults so the page never 500s on a Shopify outage.

import "../shmo-review.css";
import Buybox from "@/components/shmo-review/Buybox";
import Proof from "@/components/shmo-review/cr-80/Proof";
import CrewStrip from "@/components/home/CrewStrip";
import HowItWorks from "@/components/shmo-review/HowItWorks";
import FormatCompare from "@/components/shmo-review/FormatCompare";
import VideoTestimonials from "@/components/home/VideoTestimonials";
import FinalCta from "@/components/home/FinalCta";
import { ProofTiles } from "@/components/shmo-review/ProofMarquee";
import { getProductByHandle } from "@/lib/shopify/queries";
import { mapProductToBuyboxProps } from "@/lib/shopify/buybox-mapping";
import ViewContentTracker from "@/components/analytics/ViewContentTracker";

export const metadata = {
  title: "CR-80 Review Card — Shmo Review",
  description:
    "Wallet-size NFC Google review card for shop crews. Pre-programmed before shipping, with QR fallback and free reprogramming.",
};

const CR80_SUB =
  "The countertop tap that turns happy crews into five-star reviews.";

export default async function Cr80Page() {
  const product = await getProductByHandle("google-reviews-nfc-tap-card-cr80");
  const mapped = product ? mapProductToBuyboxProps(product) : {};
  const buyboxProps =
    mapped.product
      ? { ...mapped, product: { ...mapped.product, sub: CR80_SUB } }
      : mapped;

  const defaultPrice = product?.priceRange?.minVariantPrice?.amount
    ? Number(product.priceRange.minVariantPrice.amount)
    : null;
  const defaultVariantId = product?.variants?.nodes?.[0]?.id ?? null;

  return (
    <main>
      <Buybox {...buyboxProps} nextBg="cream" />
      <Proof />
      <CrewStrip nextBg="cream" afterGrid={<ProofTiles />} />
      <HowItWorks />
      <FormatCompare currentHandle="google-reviews-nfc-tap-card-cr80" />
      <VideoTestimonials bg="cream" nextBg="ember" />
      <FinalCta />
      {product && defaultPrice !== null && defaultVariantId && (
        <ViewContentTracker
          productId={product.id}
          defaultVariantId={defaultVariantId}
          price={defaultPrice}
          handle="google-reviews-nfc-tap-card-cr80"
        />
      )}
    </main>
  );
}
