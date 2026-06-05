// app/shmo-review/l-sign-black/page.tsx — Black L-Sign counter standee PDP.
//
// Phase 8+: live Shopify data via getProductByHandle.
// Handle: 'google-review-nfc-tap-card-l-sign-black'
// Options: Units [1, 2, 5, 10 L Sign] × Size [Medium, Large] — 8 variants.

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
  title: 'Black L-Sign Counter Standee — Shmo Review',
  description:
    'Black acrylic NFC counter standee in two sizes. Sits by the register — guests tap on their way out. Pre-programmed to your Google review link before shipping, QR fallback included.',
};

const BLACK_L_SIGN_SUB =
  'Black acrylic counter standee — now in two sizes. Sits by the register; guests tap on their way out, no staff prompt.';

export default async function BlackLSignPage() {
  const product = await getProductByHandle('google-review-nfc-tap-card-l-sign-black');
  const mapped = product ? mapProductToBuyboxProps(product) : {};
  const buyboxProps =
    mapped.product
      ? { ...mapped, product: { ...mapped.product, sub: BLACK_L_SIGN_SUB } }
      : mapped;

  const defaultPrice = product?.priceRange?.minVariantPrice?.amount
    ? Number(product.priceRange.minVariantPrice.amount)
    : null;
  const defaultVariantId = product?.variants?.nodes?.[0]?.id ?? null;

  return (
    <main>
      <Buybox {...buyboxProps} ariaLabel='Buy the Black L-Sign standee' nextBg='cream' />
      <Proof />
      <CrewStrip nextBg='cream' afterGrid={<ProofTiles />} />
      <HowItWorks />
      <FormatCompare currentHandle='google-review-nfc-tap-card-l-sign-black' />
      <VideoTestimonials bg='cream' nextBg='ember' />
      <FinalCta />
      {product && defaultPrice !== null && defaultVariantId && (
        <ViewContentTracker
          productId={product.id}
          defaultVariantId={defaultVariantId}
          price={defaultPrice}
          handle='google-review-nfc-tap-card-l-sign-black'
        />
      )}
    </main>
  );
}
