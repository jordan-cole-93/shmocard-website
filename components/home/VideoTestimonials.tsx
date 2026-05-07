// components/home/VideoTestimonials.tsx
// Server component. 3-up grid of 4:5 video cards. Click → opens VideoLightbox
// modal via the modal store (plan 03-10). Tiles delegate the click handler
// to the client-only `<VideoTile />` leaf so this section stays server-rendered.

import "./home.css";
import Section from "@/components/layout/Section";
import { VIDEO_TILES } from "./home-data";
import VideoTile from "./VideoTile";

export default function VideoTestimonials() {
  return (
    <Section bg="marsh" nextBg="graham" ariaLabel="Video testimonials">
      {/* Rotation: marsh→graham; Compatibility picks up on graham. */}
      <div className="video-testimonials__head">
        <span className="video-testimonials__eyebrow">Crews on camera</span>
        <h2 className="shm-h2">Watch shops talk about the <em>bulk math</em>.</h2>
        <p className="video-testimonials__lede">
          Real owners, real shops, no scripts. Watch what changed when every crew member had a card
          in their pocket.
        </p>
      </div>

      <div className="video-grid">
        {VIDEO_TILES.map((tile, i) => (
          <VideoTile key={i} tile={tile} index={i} />
        ))}
      </div>
    </Section>
  );
}
