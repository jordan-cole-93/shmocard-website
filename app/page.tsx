// SMOKE TEST — replaced by 03-03 homepage build.
// Demonstrates Section primitive's 4-color rotation (REQ-09) with wave dividers.
// Plan 03-03 overwrites this file with the real homepage composition.

import Section from "@/components/layout/Section";

export default function HomePage() {
  return (
    <main>
      <Section bg="marsh" nextBg="graham" ariaLabel="Smoke test marsh section">
        <span className="shm-eyebrow">03-02 smoke test</span>
        <h2 className="shm-h2">Section: marsh</h2>
        <p className="shm-lede">
          Default section background. The wave below transitions to graham.
        </p>
      </Section>

      <Section bg="graham" nextBg="ember" ariaLabel="Smoke test graham section">
        <span className="shm-eyebrow">03-02 smoke test</span>
        <h2 className="shm-h2">Section: graham</h2>
        <p className="shm-lede">
          Warm secondary background. Wave transitions to ember.
        </p>
      </Section>

      <Section
        bg="ember"
        nextBg="cocoa"
        waveSize="lg"
        ariaLabel="Smoke test ember section"
      >
        <span className="shm-eyebrow">03-02 smoke test</span>
        <h2 className="shm-h2">Section: ember</h2>
        <p className="shm-lede">
          High-emphasis accent. Tall wave transitions to cocoa.
        </p>
      </Section>

      <Section bg="cocoa" ariaLabel="Smoke test cocoa section">
        <span className="shm-eyebrow">03-02 smoke test</span>
        <h2 className="shm-h2">Section: cocoa</h2>
        <p className="shm-lede">
          Deep finisher. No wave — footer follows directly.
        </p>
      </Section>
    </main>
  );
}
