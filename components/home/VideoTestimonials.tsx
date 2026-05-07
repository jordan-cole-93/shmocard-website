// components/home/VideoTestimonials.tsx
// Server component. 3-up grid of 4:5 video cards. Click → opens lightbox
// modal (full wiring deferred to plan 03-10). For v1 the play button is
// a no-op except on the pending tile (disabled).

import "./home.css";
import Section from "@/components/layout/Section";
import { VIDEO_TILES } from "./home-data";

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
    </svg>
  );
}

export default function VideoTestimonials() {
  return (
    <Section bg="marsh" nextBg="graham" ariaLabel="Video testimonials">
      <div className="video-testimonials__head">
        <span className="video-testimonials__eyebrow">Crews on camera</span>
        <h2 className="shm-h2">Watch shops talk about the bulk math.</h2>
        <p className="video-testimonials__lede">
          Real owners, real shops, no scripts. Watch what changed when every crew member had a card
          in their pocket.
        </p>
      </div>

      <div className="video-grid">
        {VIDEO_TILES.map((t, i) => (
          <article
            key={i}
            className={`shm-card video-card ${t.pending ? "video-card--pending" : ""}`}
          >
            <div className="video-card__media">
              <div className={`video-card__media-bg video-card__media-bg--${t.bgVariant}`} />
              <button
                type="button"
                className="video-card__play"
                aria-label={t.pending ? "Video coming soon" : `Play testimonial from ${t.person}`}
                data-video-tile={i}
                disabled={t.pending}
              >
                <PlayIcon />
              </button>
              <span className="video-card__duration">{t.duration}</span>
              <div className="video-card__quote">
                <p className="video-card__quote-text">&ldquo;{t.quote}&rdquo;</p>
              </div>
            </div>
            <div className="video-card__attr">
              <div className="video-card__person">
                <b>{t.person}</b>
                <span>{t.role}</span>
              </div>
              <div className="video-card__shop">{t.shop}</div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
