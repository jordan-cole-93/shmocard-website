"use client";

// components/modals/VideoLightbox.tsx
//
// Full-screen video lightbox triggered from VideoTestimonials tile click.
// Uses native <video controls> — no third-party player.
//
// Pending tiles (no videoUrl) render a "video coming soon" placeholder
// inside the same lightbox shell so the open/close motion stays consistent.

import { useEffect, useRef } from "react";

type Props = {
  videoUrl?: string;
  videoTitle?: string;
  posterUrl?: string;
  onClose: () => void;
};

export default function VideoLightbox({ videoUrl, videoTitle, posterUrl, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Autoplay if a URL is provided (user-initiated since they clicked the tile).
  useEffect(() => {
    if (videoRef.current && videoUrl) {
      videoRef.current.play().catch(() => {
        /* autoplay blocked is fine — controls are visible */
      });
    }
  }, [videoUrl]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={videoTitle ?? "Video testimonial"}
      className="shm-modal shm-modal--video shm-card shm-card--hard"
    >
      <button
        type="button"
        aria-label="Close video"
        className="shm-modal__close"
        onClick={onClose}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6 18 18 M18 6 6 18" />
        </svg>
      </button>

      <div className="shm-modal__video-frame">
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            poster={posterUrl}
            controls
            preload="metadata"
            playsInline
          />
        ) : (
          <div className="shm-modal__video-pending">
            <p className="shm-lede">Video coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
