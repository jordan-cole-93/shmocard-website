"use client";

// components/modals/ModalRoot.tsx
//
// Single mount point for all modals. Mounted once in app/layout.tsx.
// Reads the active modal from the Zustand store and dispatches to the
// right modal component. Uses createPortal so modals stack above any
// section's transform/overflow context.
//
// Motion: scrim fade 220ms + dialog scale 0.95 → 1 + opacity. Matches
// design-system motion tokens (--motion-base, --ease-standard).
//
// Body scroll lock + Escape key handling live here — every modal gets
// the behavior for free.

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./modal.css";
import { useModalStore } from "./modal-store";
import WaitlistModal from "./WaitlistModal";
import VideoLightbox from "./VideoLightbox";

const EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

export default function ModalRoot() {
  const kind = useModalStore((s) => s.kind);
  const props = useModalStore((s) => s.props);
  const close = useModalStore((s) => s.close);

  // SSR guard — only render the portal after client mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Body scroll lock while any modal is open.
  useEffect(() => {
    if (!kind) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [kind]);

  // Escape key closes the modal.
  useEffect(() => {
    if (!kind) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [kind, close]);

  if (!mounted) return null;

  const node = (
    <AnimatePresence>
      {kind && (
        <>
          {/* Scrim — backdrop, click closes */}
          <motion.div
            key="scrim"
            className="shm-scrim is-open"
            onClick={close}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE }}
          />

          {/* Modal stack — root holds positioning, child holds surface */}
          <motion.div
            key="dialog"
            className="shm-modal-root"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.22, ease: EASE }}
          >
            {kind === "waitlist" && props.product && (
              <WaitlistModal product={props.product} onClose={close} />
            )}
            {kind === "video" && (
              <VideoLightbox
                videoUrl={props.videoUrl}
                videoTitle={props.videoTitle}
                posterUrl={props.posterUrl}
                onClose={close}
              />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(node, document.body);
}
