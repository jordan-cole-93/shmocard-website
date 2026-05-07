"use client";

// components/home/VideoTile.tsx
//
// Client-side leaf for VideoTestimonials. Wraps the play button click
// to dispatch openVideo() into the modal store. Pending tiles are
// disabled and never open the lightbox.
//
// Plan 03-10 task 2.

import { openVideo } from "@/components/modals/modal-store";
import type { VideoTile as VideoTileData } from "./home-data";

type Props = {
  tile: VideoTileData;
  index: number;
};

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
    </svg>
  );
}

export default function VideoTile({ tile, index }: Props) {
  const handleClick = (): void => {
    if (tile.pending) return;
    // videoUrl is pending in the data layer until real assets land.
    // Open the lightbox shell anyway — VideoLightbox renders the
    // "Video coming soon" placeholder when no URL is provided.
    openVideo(tile.videoUrl ?? "", `${tile.person} — ${tile.shop}`, tile.posterUrl);
  };

  return (
    <article className={`shm-card video-card ${tile.pending ? "video-card--pending" : ""}`}>
      <div className="video-card__media">
        <div className={`video-card__media-bg video-card__media-bg--${tile.bgVariant}`} />
        <button
          type="button"
          className="video-card__play"
          aria-label={
            tile.pending ? "Video coming soon" : `Play testimonial from ${tile.person}`
          }
          data-video-tile={index}
          disabled={tile.pending}
          onClick={handleClick}
        >
          <PlayIcon />
        </button>
        <span className="video-card__duration">{tile.duration}</span>
        <div className="video-card__quote">
          <p className="video-card__quote-text">&ldquo;{tile.quote}&rdquo;</p>
        </div>
      </div>
      <div className="video-card__attr">
        <div className="video-card__person">
          <b>{tile.person}</b>
          <span>{tile.role}</span>
        </div>
        <div className="video-card__shop">{tile.shop}</div>
      </div>
    </article>
  );
}
