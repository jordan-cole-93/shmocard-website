"use client";

// components/home/VideoTile.tsx
//
// Client-side leaf for VideoTestimonials. Plays the video inline inside
// the tile (not in a modal). Pending tiles are disabled and show a
// placeholder.

import { useRef, useState } from "react";
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = (): void => {
    if (tile.pending) return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.play();
    setIsPlaying(true);
  };

  return (
    <article
      className={`shm-card video-card video-card--${tile.bgVariant} ${tile.pending ? "video-card--pending" : ""} ${isPlaying ? "video-card--playing" : ""}`}
    >
      <div className="video-card__media">
        {tile.videoUrl ? (
          <video
            ref={videoRef}
            className="video-card__media-bg video-card__media-bg--video"
            // When a posterUrl is provided the browser shows it until play, and
            // the video starts from 0:00. Without a poster, fall back to a
            // seek-based thumbnail (#t=) so the tile doesn't show a black frame.
            src={
              tile.posterUrl
                ? tile.videoUrl
                : `${tile.videoUrl}#t=${tile.thumbnailTime ?? 0.5}`
            }
            poster={tile.posterUrl}
            preload="metadata"
            muted={!isPlaying}
            controls={isPlaying}
            playsInline
            aria-hidden={!isPlaying}
            onEnded={() => setIsPlaying(false)}
          />
        ) : tile.posterUrl ? (
          <img
            className="video-card__media-bg video-card__media-bg--poster"
            src={tile.posterUrl}
            alt=""
            aria-hidden="true"
          />
        ) : (
          <div className={`video-card__media-bg video-card__media-bg--${tile.bgVariant}`} />
        )}
        {/* Gradient overlay: transparent at top, solid bgVariant color at the bottom,
            so the quote text reads cleanly without resizing the video. Hidden during playback. */}
        {tile.videoUrl && <div className="video-card__media-overlay" aria-hidden="true" />}
        <button
          type="button"
          className="video-card__play"
          aria-label={
            tile.pending ? "Video coming soon" : `Play testimonial from ${tile.person}`
          }
          data-video-tile={index}
          disabled={tile.pending || isPlaying}
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
