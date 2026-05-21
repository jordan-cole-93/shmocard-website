// app/shmo-review/l-sign/page.tsx — L-Sign counter standee PDP.
//
// Phase 8: live Shopify data via getProductByHandle.
// L-Sign handle: 'google-review-nfc-tap-card-l-sign' (was 'shmo-review-l-sign' — bug fixed in Phase 8).

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
  title: 'L-Sign Counter Standee — Shmo Review',
  description:
    'Acrylic NFC counter standee for your register. Customers tap on their way out. Pre-programmed before shipping, with QR fallback.',
};

const L_SIGN_SUB =
  'Lives next to the register. Guests tap on their way out — no staff prompt needed.';

export default async function LSignPage() {
  const product = await getProductByHandle('google-review-nfc-tap-card-l-sign');
  const mapped = product ? mapProductToBuyboxProps(product) : {};
  const buyboxProps =
    mapped.product
      ? { ...mapped, product: { ...mapped.product, sub: L_SIGN_SUB } }
      : mapped;

  const defaultPrice = product?.priceRange?.minVariantPrice?.amount
    ? Number(product.priceRange.minVariantPrice.amount)
    : null;
  const defaultVariantId = product?.variants?.nodes?.[0]?.id ?? null;

  return (
    <main>
      <Buybox {...buyboxProps} ariaLabel='Buy the L-Sign standee' nextBg='cream' />
      <Proof />
      <CrewStrip nextBg='cream' afterGrid={<ProofTiles />} />
      <HowItWorks />
      <FormatCompare currentHandle='google-review-nfc-tap-card-l-sign' />
      <VideoTestimonials bg='cream' nextBg='ember' />
      <FinalCta />
      {product && defaultPrice !== null && defaultVariantId && (
        <ViewContentTracker
          productId={product.id}
          defaultVariantId={defaultVariantId}
          price={defaultPrice}
          handle='google-review-nfc-tap-card-l-sign'
        />
      )}
    </main>
  );
}
