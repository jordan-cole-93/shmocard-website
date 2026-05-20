// app/shmo-review/square-card/page.tsx — Square Card adhesive disc PDP.
//
// Composes the same below-the-fold sections as the CR-80 and L-Sign PDPs in the same order.
// Square-Card-specific data is passed as props to <Buybox>; reused section components
// receive no Square-Card-specific props — their layouts are locked.

import '../shmo-review.css';
import Buybox, {
  type BuyboxProduct,
  type BuyboxGalleryImage,
  type BuyboxPack,
  type BuyboxFaqRow,
} from '@/components/shmo-review/Buybox';
import Proof from '@/components/shmo-review/cr-80/Proof';
import CrewStrip from '@/components/home/CrewStrip';
import HowItWorks from '@/components/shmo-review/HowItWorks';
import FormatCompare from '@/components/shmo-review/FormatCompare';
import VideoTestimonials from '@/components/home/VideoTestimonials';
import FinalCta from '@/components/home/FinalCta';
import { ProofTiles } from '@/components/shmo-review/ProofMarquee';

export const metadata = {
  title: 'Square Card NFC Disc — Shmo Review',
  description:
    'Adhesive-backed NFC disc for any surface. Sticks to doors, windows, dashboards. Pre-programmed before shipping, with QR fallback.',
};

// TODO(shopify): replace with Storefront API product query for the Square Card handle.
const SQUARE_PRODUCT: BuyboxProduct = {
  handle: 'google-review-plaque', // TODO(shopify): confirm exact handle in Shopify Admin
  title: 'Google Review NFC Disc (Square Card)',
  sub: 'Sticks to anything — door, window, dashboard. Ideal for mobile crews and service vans.',
};

// TODO(shopify): swap gallery to Shopify product.images.nodes[].url.
const SQUARE_GALLERY: BuyboxGalleryImage[] = [
  { src: '/products/plate/transparent/magnific_2885042834.png', alt: 'Square Card NFC disc, front view' },
  { src: '/products/plate/transparent/magnific_2885058687.png', alt: 'Square Card disc, angled' },
  { src: '/products/plate/transparent/magnific_2885065402.png', alt: 'Square Card disc, close-up' },
  { src: '/products/plate/transparent/magnific_2885073898.png', alt: 'Square Card disc, stuck to surface' },
  { src: '/products/plate/transparent/magnific_2885081184.png', alt: 'Square Card disc, back detail' },
];

// TODO(shopify): pack pricing tiers come from Shopify variants + metafields.
// Structure mirrors CR-80 / L-Sign (1/2/5/10 tiers); prices are placeholders until Phase 8.
const SQUARE_PACKS: BuyboxPack[] = [
  { qty: 1,  price: 39.99,  perCard: 39.99, save: null,  note: null,                     compare: null,   pop: false },
  { qty: 2,  price: 69.99,  perCard: 35.00, save: null,  note: null,                     compare: 79.98,  pop: false },
  { qty: 5,  price: 169.99, perCard: 34.00, save: '15%', note: 'Free shipping included', compare: 199.95, pop: false },
  { qty: 10, price: 299.99, perCard: 30.00, save: '25%', note: 'Free shipping included', compare: 399.90, pop: true  },
];

const SQUARE_CHECKLIST = [
  '2.25" adhesive-backed disc — sticks to any clean surface',
  'Pre-programmed to your Google review link before shipping',
  'Works on every modern phone — no app, no download',
  '60-day reprogramming + return guarantee',
];

const SQUARE_FAQ_ROWS: BuyboxFaqRow[] = [
  { q: 'What is the Square Card?', a: 'A 2.25" adhesive-backed NFC disc. Stick it to a door, window, dashboard, or laptop. Customers tap and land straight on your Google review page.' },
  { q: 'Shipping', a: 'Order by Tuesday 5pm CT, ships Friday. 3-day standard. Free expedited on 5+ packs.' },
  { q: '60-day return + reprogramming guarantee', a: "Don't love it? Return for full refund within 60 days. Reprogram destination URL anytime." },
  { q: 'Product details', a: '2.25" disc with embedded NTAG 215 NFC chip. Adhesive-backed. QR fallback printed on back. Pre-programmed before shipping.' },
];

export default function SquareCardPage() {
  return (
    <main>
      <Buybox
        product={SQUARE_PRODUCT}
        gallery={SQUARE_GALLERY}
        packs={SQUARE_PACKS}
        checklist={SQUARE_CHECKLIST}
        faqRows={SQUARE_FAQ_ROWS}
        ariaLabel='Buy the Square Card disc'
        nextBg='cream'
      />
      <Proof />
      <CrewStrip nextBg='cream' afterGrid={<ProofTiles />} />
      <HowItWorks />
      <FormatCompare currentHandle='google-review-plaque' />
      <VideoTestimonials bg='cream' nextBg='ember' />
      <FinalCta />
    </main>
  );
}
