// components/pdp/PdpHeading.tsx
// H1 + sub-headline for the PDP. Server component.
// Layout class .pdp-bb__title / .pdp-bb__sub live in pdp.css (LAYOUT only).
// Type tokens come from --font-display / --color-cocoa-deep.

type Props = {
  title: string;
  sub: string;
};

export default function PdpHeading({ title, sub }: Props) {
  return (
    <>
      <h1 className="pdp-bb__title">{title}</h1>
      <p className="pdp-bb__sub">
        <em>{sub}</em>
      </p>
    </>
  );
}
