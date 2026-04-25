import { SubBrandSpotlight } from "./SubBrandSpotlight";

export function SubBrandSpotlights() {
  return (
    <>
      <SubBrandSpotlight
        id="review"
        eyebrow="Live now"
        headline={
          <>
            One tap. One <em>five-star</em> review.
          </>
        }
        lede="NFC review cards, signs and discs that send happy customers straight to your Google profile. No app, no login, no QR-code gymnastics — just tap."
        cta={{ label: "Shop now", href: "/shmo-review", type: "live" }}
        visualLabel="Shmo Review · CR-80 card photo"
        surface="cream"
      />

      <SubBrandSpotlight
        id="biz"
        eyebrow="Coming soon"
        headline={
          <>
            Your business card. <em>Finally</em> worth handing out.
          </>
        }
        lede="Paper business cards get lost. Shmo Biz lives on the customer's phone the moment you tap. Name, title, phone, website, socials — always up to date."
        cta={{ label: "Get notified", href: "#", type: "soon" }}
        visualLabel="Shmo Biz · Phone + business card mock"
        surface="snow"
        flip
      />

      <SubBrandSpotlight
        id="link"
        eyebrow="Coming soon"
        headline={
          <>
            One link. <em>Every</em> destination.
          </>
        }
        lede="When a customer asks where to find you, one link sends them to your Google page, your booking, your menu, your socials. A branded hub built for Main Street."
        cta={{ label: "Get notified", href: "#", type: "soon" }}
        visualLabel="Shmo Link · Phone showing link hub"
        surface="cream"
      />

      <SubBrandSpotlight
        id="reputation"
        eyebrow="Coming soon"
        headline={
          <>
            Every review, <em>answered</em>. While you&apos;re busy working.
          </>
        }
        lede="Responding to reviews builds trust and improves local ranking. Shmo Reputation answers every review automatically, in your brand's voice."
        cta={{ label: "Get notified", href: "#", type: "soon" }}
        visualLabel="Shmo Reputation · Review + auto-reply mock"
        surface="snow"
        flip
      />
    </>
  );
}
