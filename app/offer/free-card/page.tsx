// app/offer/free-card/page.tsx — Free + shipping funnel landing page.
//
// Hidden landing for paid-ad traffic. NOT linked from anywhere on the main
// site, robots noindex, excluded from sitemap. Mirror of /shmo-review/cr-80
// section-for-section, EXCEPT:
//   - OfferBuybox replaces Buybox (FREE row default, no progress band, etc.).
//   - FormatCompare omitted (escape hatch to /shmo-review/l-sign + /square-card).
//
// See .planning/sidequests/free-shipping-funnel/SPEC.md.

import { notFound } from "next/navigation";
import type { Metadata } from "next";

import "../../shmo-review/shmo-review.css";
import OfferBuybox from "@/components/offer/OfferBuybox";
import Proof from "@/components/shmo-review/cr-80/Proof";
import CrewStrip from "@/components/home/CrewStrip";
import HowItWorks from "@/components/shmo-review/HowItWorks";
import VideoTestimonials from "@/components/home/VideoTestimonials";
import FinalCta from "@/components/home/FinalCta";
import { ProofTiles } from "@/components/shmo-review/ProofMarquee";
import { getProductByHandle } from "@/lib/shopify/queries";
import { mapProductToOfferBuyboxProps } from "@/lib/shopify/offer-mapping";
import ViewContentTracker from "@/components/analytics/ViewContentTracker";

const FREE_CARD_HANDLE = "free-google-review-nfc-tap-card-cr80";

const OFFER_SUB =
  "Get a free Shmo Review NFC card. You only pay $7 shipping.";

export const metadata: Metadata = {
  title: "Free Shmo Review Card — Special Offer",
  description:
    "Claim a free Shmo Review NFC card. You only pay shipping. Limited time.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default async function OfferFreeCardPage() {
  if (process.env.NEXT_PUBLIC_OFFER_ENABLED === "false") {
    notFound();
  }

  const product = await getProductByHandle(FREE_CARD_HANDLE);
  const mapped = product ? mapProductToOfferBuyboxProps(product) : {};
  const buyboxProps = mapped.product
    ? { ...mapped, product: { ...mapped.product, sub: OFFER_SUB } }
    : mapped;

  // ViewContent fires the $0 variant (the FREE offer) as the content_id.
  // Value = $7 (shipping price) since that's what the user actually pays.
  const freeVariantId =
    product?.variants?.nodes?.find((v) => parseFloat(v.price.amount) === 0)?.id ??
    product?.variants?.nodes?.[0]?.id ??
    null;

  return (
    <main>
      <OfferBuybox {...buyboxProps} nextBg="cream" />
      <Proof />
      <CrewStrip nextBg="cream" afterGrid={<ProofTiles />} />
      <HowItWorks />
      <VideoTestimonials bg="cream" nextBg="ember" />
      <FinalCta />
      {product && freeVariantId && (
        <ViewContentTracker
          productId={product.id}
          defaultVariantId={freeVariantId}
          price={7}
          handle={FREE_CARD_HANDLE}
        />
      )}
    </main>
  );
}
