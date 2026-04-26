/* design-system/app/_reference/page.tsx
   GROUND-TRUTH REFERENCE PAGE.
   Renders every Shmocard component + section recipe in one place.
   Claude Code: read THIS file, copy the JSX, swap data — don't invent.
   ============================================================== */
import {
  Section, Eyebrow, Display, H1, H2, H3, Lede, Body, I,
  Button, ButtonLink, Card, Badge, ImageFrame, FamilyTile,
} from "@/components/shm/Shm";
import { Faq } from "@/components/shm/Faq";

export default function ReferencePage() {
  return (
    <>
      {/* HERO — recipe: snow */}
      <Section recipe="snow">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <Badge variant="live">Live now: Shmo Review</Badge>
            <Display><span style={{ marginTop: 18, display: "block" }}>The toolkit your crew's been <I>missing</I>.</span></Display>
            <Lede className="mt-4" >Four tools built for local shops. Reviews, contacts, links, reputation — every customer interaction your crew was letting slip through the cracks.</Lede>
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <ButtonLink variant="accent" size="lg" href="#family">Meet the tools ↓</ButtonLink>
              <ButtonLink variant="ghost" size="lg" href="#review">Shop Shmo Review →</ButtonLink>
            </div>
          </div>
          <ImageFrame ratio="1/1">{/* 3D mascot/toolkit slot */}</ImageFrame>
        </div>
      </Section>

      {/* FAMILY — recipe: cream-soft */}
      <Section recipe="cream-soft" id="family">
        <Eyebrow>Meet the family</Eyebrow>
        <H2><span style={{ marginTop: 12, display: "block" }}>Pick your <I>tool</I>.</span></H2>
        <Lede className="mt-4">Four sub-brands, one shared platform. Shmo Review is available now; the rest are coming over the next few quarters.</Lede>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginTop: 40 }}>
          <FamilyTile brandKey="review" glyph="R" name="Shmo" italic="Review" desc="One tap. One five-star review." status="live" ctaLabel="Shop now" href="#review" />
          <FamilyTile brandKey="biz"    glyph="B" name="Shmo" italic="Biz"    desc="Your business card, upgraded." status="soon" ctaLabel="Get notified" href="#biz" />
          <FamilyTile brandKey="link"   glyph="L" name="Shmo" italic="Link"   desc="All your links. One place." status="soon" ctaLabel="Get notified" href="#link" />
          <FamilyTile brandKey="rep"    glyph="M" name="Shmo" italic="Reputation" desc="Every review, answered automatically." status="soon" ctaLabel="Get notified" href="#rep" />
        </div>
      </Section>

      {/* COCOA-HOT — climax section (max 1-2 per page) */}
      <Section recipe="cocoa-hot">
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
          <Eyebrow>The Shmocard family</Eyebrow>
          <H2><span style={{ marginTop: 12, display: "block" }}>Four tools. <I>One</I> toolkit.</span></H2>
          <Lede className="mt-4">Shmo Review is shipping. Three more sub-brands roll out through next year — same cards, same dashboard.</Lede>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28 }}>
            <ButtonLink variant="primary" size="lg" href="#review">Shop Shmo Review →</ButtonLink>
            <ButtonLink variant="ghost" size="lg" href="#waitlist">Join the waitlist →</ButtonLink>
          </div>
        </div>
      </Section>

      {/* GENERIC SECTION — recipe: snow */}
      <Section recipe="snow">
        <Eyebrow>Crews using Shmocard</Eyebrow>
        <H2><span style={{ marginTop: 12, display: "block" }}>Real shops, real <I>tap</I> moments.</span></H2>
        <Lede className="mt-4">Six local crews handing Shmocards across the counter today.</Lede>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22, marginTop: 40 }}>
          {[1,2,3].map(i => (
            <Card key={i}>
              <H3>Card title #{i}</H3>
              <Body>Card body copy. Default card on snow uses border-hair.</Body>
            </Card>
          ))}
        </div>
      </Section>

      {/* FAQ — recipe: snow */}
      <Section recipe="snow" id="faq">
        <div style={{ maxWidth: 960 }}>
          <Eyebrow>Common questions</Eyebrow>
          <H2><span style={{ marginTop: 12, display: "block" }}>Common questions, <I>honest</I> answers.</span></H2>
          <div style={{ marginTop: 36 }}>
            <Faq items={[
              { id: "what",  q: "What is Shmocard?", a: "Shmocard is a family of four tools built for local shops crews." },
              { id: "live",  q: "How many tools are live right now?", a: "One. Shmo Review ships today." },
              { id: "subs",  q: "Do I need a subscription?", a: "No. Cards are a one-time purchase." },
            ]}/>
          </div>
        </div>
      </Section>

      {/* COMPONENT GALLERY (for visual QA) */}
      <Section recipe="cream-soft">
        <Eyebrow>Components</Eyebrow>
        <H2 className="mt-3">Component gallery</H2>

        <H3 className="mt-8">Buttons</H3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="accent">Accent (hero)</Button>
          <Button variant="primary" size="lg">Primary lg</Button>
          <Button variant="primary" size="sm">Primary sm</Button>
        </div>

        <H3 className="mt-8">Badges</H3>
        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
          <Badge variant="live">Available now</Badge>
          <Badge variant="soon">Coming soon</Badge>
          <Badge variant="neutral">Neutral</Badge>
        </div>

        <H3 className="mt-8">Type ramp</H3>
        <Display>Display headline</Display>
        <H1>H1 page title</H1>
        <H2>H2 section title</H2>
        <H3>H3 card title</H3>
        <Lede>Lede paragraph — 17/26 ink-3.</Lede>
        <Body>Body — 14/22 ink-2.</Body>
      </Section>
    </>
  );
}
