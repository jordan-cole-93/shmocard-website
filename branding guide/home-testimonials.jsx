/* home-testimonials.jsx — 3 video testimonial cards */

const TESTIMONIALS = [
  {
    name: "Maya Ortiz",
    role: "Owner, Cortado Coffee · 4 locations",
    logo: "Cortado",
    duration: "1:42",
    quote: "Our weekly reviews went from 11 to 68. I stopped asking people to leave one.",
    posterClass: "",
  },
  {
    name: "Derek Hollis",
    role: "GM, Apex Auto Detail",
    logo: "Apex Auto",
    duration: "2:18",
    quote: "Every tech has a card on their keyring. Customer tips the tech, taps the card. Done.",
    posterClass: "video__poster--b",
  },
  {
    name: "Priya Nair",
    role: "Co-founder, Lash Room MPLS",
    logo: "Lash Room",
    duration: "0:58",
    quote: "I paid off the whole order in eleven days of reviews. No regrets.",
    posterClass: "video__poster--c",
  },
];

function VideoCard({ t }) {
  return (
    <article className="video">
      <div className={`video__poster ${t.posterClass}`}>
        <div className="video__poster-texture"/>
        <span className="video__duration">{t.duration}</span>
        <div className="video__play">
          <button className="video__play-btn" aria-label={`Play ${t.name}'s story`}>
            <Icon.Play/>
          </button>
        </div>
        <p className="video__quote">"{t.quote}"</p>
      </div>
      <div className="video__meta">
        <div className="video__person">
          <span className="video__name">{t.name}</span>
          <span className="video__role">{t.role}</span>
        </div>
        <span className="video__logo">{t.logo}</span>
      </div>
    </article>
  );
}

function Testimonials() {
  return (
    <section className="hsection hsection--alt">
      <div className="hsection__head">
        <div>
          <div className="hsection__eyebrow">What crews say</div>
          <h2 className="hsection__title">
            Real crews, real <em>five-star</em> moments.
          </h2>
        </div>
        <p className="hsection__lede">
          Three short stories from owner-operators who put Shmocards on their
          teams. No script, no vague metrics — just what changed.
        </p>
      </div>
      <div className="hsection__body">
        <div className="videos">
          {TESTIMONIALS.map((t, i) => <VideoCard key={i} t={t}/>)}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Testimonials });
