// app/shmo-review/square-card/page.tsx — Square Card adhesive disc PDP.
//
// Phase 8: live Shopify data via getProductByHandle.
// Square Card handle: 'google-review-plaque' (correct since file was authored).

import '../shmo-review.css';
import Buybox from '@/components/shmo-review/Buybox';
import Proof from '@/components/shmo-review/cr-80/Proof';
import CrewStrip from '@/components/home/CrewStrip';
import HowItWorks from '@/components/shmo-review/HowItWorks';
import FormatCompare from '@/components/shmo-review/FormatCompare';
import VideoTestimonials from '@/components/home/VideoTestimonials';
import FinalCta from '@/components/home/FinalCta';
import { ProofTiles } from '@/components/shmo-review/ProofMarquee';
import { getProductByHandle } from '@/lib/shopify/queries';
import { mapProductToBuyboxProps } from '@/lib/shopify/buybox-mapping';
import ViewContentTracker from '@/components/analytics/ViewContentTracker';

export const metadata = {
  title: 'Square Card NFC Disc — Shmo Review',
  description:
    'Adhesive-backed NFC disc for any surface. Sticks to doors, windows, dashboards. Pre-programmed before shipping, with QR fallback.',
};

const SQUARE_SUB =
  'Sticks to anything — door, window, dashboard. Ideal for mobile crews and service vans.';

export default async function SquareCardPage() {
  const product = await getProductByHandle('google-review-plaque');
  const mapped = product ? mapProductToBuyboxProps(product) : {};
  const buyboxProps =
    mapped.product
      ? { ...mapped, product: { ...mapped.product, sub: SQUARE_SUB } }
      : mapped;

  const defaultPrice = product?.priceRange?.minVariantPrice?.amount
    ? Number(product.priceRange.minVariantPrice.amount)
    : null;
  const defaultVariantId = product?.variants?.nodes?.[0]?.id ?? null;

  return (
    <main>
      <Buybox {...buyboxProps} ariaLabel='Buy the Square Card disc' nextBg='cream' />
      <Proof />
      <CrewStrip nextBg='cream' afterGrid={<ProofTiles />} />
      <HowItWorks />
      <FormatCompare currentHandle='google-review-plaque' />
      <VideoTestimonials bg='cream' nextBg='ember' />
      <FinalCta />
      {product && defaultPrice !== null && defaultVariantId && (
        <ViewContentTracker
          productId={product.id}
          defaultVariantId={defaultVariantId}
          price={defaultPrice}
          handle='google-review-plaque'
        />
      )}
    </main>
  );
}
