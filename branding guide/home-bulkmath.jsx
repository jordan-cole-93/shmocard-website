/* home-bulkmath.jsx — animated "1 card per shop vs 12 per crew" argument */

function useCountUp(target, trigger, duration = 1400) {
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    if (!trigger) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trigger, target, duration]);
  return val;
}

function useInView(ref, threshold = 0.4) {
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current || seen) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { setSeen(true); obs.disconnect(); }
      });
    }, { threshold });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold, seen]);
  return seen;
}

function BulkMath() {
  const ref = React.useRef(null);
  const seen = useInView(ref);
  const shopCount = useCountUp(1, seen, 600);
  const crewCount = useCountUp(12, seen, 1600);

  return (
    <section id="how" className="hsection hsection--hot">
      <div className="hsection__head">
        <div>
          <div className="hsection__eyebrow">How it works · The bulk math</div>
          <h2 className="hsection__title">
            One card per shop is a <em>missed</em> review.<br/>
            One card per crew member is a habit.
          </h2>
        </div>
        <p className="hsection__lede">
          If the card lives on the counter, a third of your customers walk past it.
          If it lives with the person handing them their coffee, lashes, or keys —
          they tap. Equip the crew, not the countertop.
        </p>
      </div>

      <div className="bulkmath" ref={ref}>
        <div className="bulkmath__side bulkmath__side--bad">
          <div className="bulkmath__label">The old way</div>
          <h3 className="bulkmath__kicker">One card, one shop</h3>
          <div className="bulkmath__num bulkmath__num--bad">{shopCount}</div>
          <p className="bulkmath__caption">
            Sits on the counter. Customer pays, customer leaves.
            Missed moment. <strong>~12% tap rate.</strong>
          </p>
        </div>

        <div className="bulkmath__side bulkmath__side--good">
          <div className="bulkmath__label">The Shmocard way</div>
          <h3 className="bulkmath__kicker">One card per crew member</h3>
          <div className="bulkmath__num bulkmath__num--good">{crewCount}</div>
          <p className="bulkmath__caption">
            Lives on the apron, the lanyard, the clipboard.
            Tapped as part of goodbye. <strong>~63% tap rate.</strong>
          </p>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { BulkMath });
