/* home-app.jsx — homepage app shell + tweaks panel */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroLayout": "split",
  "showStatStrip": true,
  "showUGC": true,
  "showMascotMoments": true,
  "accent": "ember"
}/*EDITMODE-END*/;

// All accent options stay on-brand — sampled from the s'more itself + one honey pop.
// Pushed HOT (Zapier-style ember orange) so the page reads alive, not muted.
const ACCENT_MAP = {
  ember:    "#FF5B1F",   // primary — hot ember (default)
  honey:    "#FFB833",   // toasted marshmallow — golden pop
  chocolate:"#3B1F14",   // chocolate ink — most serious
  tomato:   "#E74C2E",   // classic tomato red — punchier alt
};

function HomeApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply accent as a CSS variable override on the .home scope
  React.useEffect(() => {
    const hex = ACCENT_MAP[t.accent] || ACCENT_MAP.ember;
    const home = document.querySelector('.home');
    if (home) home.style.setProperty('--tomato', hex);
  }, [t.accent]);

  return (
    <div className="home">
      <HomeNav/>
      <HomeHero layout={t.heroLayout}/>
      <TrustBar/>
      {t.showStatStrip && <StatStrip/>}

      <ReviewSpotlight/>

      {t.showMascotMoments && (
        <div className="hsection__quiet">
          <div className="hsection__inner">
            <MascotMoment
              pose="pointing"
              copy="One card per crew member, not one per shop. That's the math."
            />
          </div>
        </div>
      )}

      <Bundles/>

      <BulkMath/>

      {t.showUGC && <UGCStrip/>}

      <Testimonials/>

      <SoftStrip/>

      <FinalCTA/>
      <HomeFooter/>

      <TweaksPanel>
        <TweakSection label="Layout"/>
        <TweakRadio
          label="Hero"
          value={t.heroLayout}
          options={[
            {value: "split",   label: "Split"},
            {value: "center",  label: "Center"},
            {value: "collage", label: "Collage"},
          ]}
          onChange={(v) => setTweak('heroLayout', v)}
        />
        <TweakToggle
          label="Stat strip"
          value={t.showStatStrip}
          onChange={(v) => setTweak('showStatStrip', v)}
        />
        <TweakToggle
          label="UGC photo strip"
          value={t.showUGC}
          onChange={(v) => setTweak('showUGC', v)}
        />
        <TweakToggle
          label="Mascot moments"
          value={t.showMascotMoments}
          onChange={(v) => setTweak('showMascotMoments', v)}
        />

        <TweakSection label="Brand"/>
        <TweakRadio
          label="Accent"
          value={t.accent}
          options={[
            {value: "ember",     label: "Ember (default)"},
            {value: "honey",     label: "Honey pop"},
            {value: "chocolate", label: "Chocolate"},
            {value: "tomato",    label: "Tomato red"},
          ]}
          onChange={(v) => setTweak('accent', v)}
        />
      </TweaksPanel>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<HomeApp/>);
