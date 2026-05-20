// app/shmo-review/l-sign/page.tsx — L-Sign counter standee PDP.
//
// Composes the same below-the-fold sections as the CR-80 PDP in the same order.
// L-Sign-specific data is passed as props to <Buybox>; reused section components
// receive no L-Sign-specific props — their layouts are locked.

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
import VideoTestimonials from '@/components/home/VideoTestimonials';
import FinalCta from '@/components/home/FinalCta';
import { ProofTiles } from '@/components/shmo-review/ProofMarquee';

export const metadata = {
  title: 'L-Sign Counter Standee — Shmo Review',
  description:
    'Acrylic NFC counter standee for your register. Customers tap on their way out. Pre-programmed before shipping, with QR fallback.',
};

// TODO(shopify): replace with Storefront API product query for the L-Sign handle.
const L_SIGN_PRODUCT: BuyboxProduct = {
  handle: 'shmo-review-l-sign', // TODO(shopify): confirm exact handle in Shopify Admin
  title: 'Google Review NFC Tap Sign (L-Sign)',
  sub: 'Lives next to the register. Guests tap on their way out — no staff prompt needed.',
};

// TODO(shopify): swap gallery to Shopify product.images.nodes[].url.
const L_SIGN_GALLERY: BuyboxGalleryImage[] = [
  { src: '/products/l-sign/transparent/magnific_2884477047.png', alt: 'L-Sign counter standee, front view' },
  { src: '/products/l-sign/transparent/magnific_2884490360.png', alt: 'L-Sign counter standee, angled' },
  { src: '/products/l-sign/transparent/magnific_2884500886.png', alt: 'L-Sign counter standee, close-up' },
];

// TODO(shopify): pack pricing tiers come from Shopify variants + metafields.
// Structure mirrors CR-80 (1/2/5/10 tiers); price values are placeholders until Phase 8 wires Storefront API.
const L_SIGN_PACKS: BuyboxPack[] = [
  { qty: 1,  price: 49.99,  perCard: 49.99, save: null,  note: null,                     compare: null,   pop: false },
  { qty: 2,  price: 89.99,  perCard: 45.00, save: null,  note: null,                     compare: 99.98,  pop: false },
  { qty: 5,  price: 199.99, perCard: 40.00, save: '20%', note: 'Free shipping included', compare: 249.95, pop: false },
  { qty: 10, price: 359.99, perCard: 36.00, save: '28%', note: 'Free shipping included', compare: 499.90, pop: true  },
];

const L_SIGN_CHECKLIST = [
  '4×6 acrylic tabletop standee — sits next to any register',
  'Pre-programmed to your Google review link before shipping',
  'Works on every modern phone — no app, no download',
  '60-day reprogramming + return guarantee',
];

const L_SIGN_FAQ_ROWS: BuyboxFaqRow[] = [
  { q: 'What is the L-Sign?', a: 'A 4×6 acrylic tabletop standee. Set it next to the register. Customers tap on their way out and land straight on your Google review page.' },
  { q: 'Shipping', a: 'Order by Tuesday 5pm CT, ships Friday. 3-day standard. Free expedited on 5+ packs.' },
  { q: '60-day return + reprogramming guarantee', a: "Don't love it? Return for full refund within 60 days. Reprogram destination URL anytime." },
  { q: 'Product details', a: '4×6 acrylic standee with embedded NTAG 215 NFC chip. QR fallback printed on back. Hand-finished in Minneapolis.' },
];

export default function LSignPage() {
  return (
    <main>
      <Buybox
        product={L_SIGN_PRODUCT}
        gallery={L_SIGN_GALLERY}
        packs={L_SIGN_PACKS}
        checklist={L_SIGN_CHECKLIST}
        faqRows={L_SIGN_FAQ_ROWS}
        ariaLabel='Buy the L-Sign standee'
        nextBg='cream'
      />
      <Proof />
      <CrewStrip nextBg='cream' afterGrid={<ProofTiles />} />
      <HowItWorks />
      <VideoTestimonials bg='cream' nextBg='ember' />
      <FinalCta />
    </main>
  );
}
