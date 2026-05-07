// components/modals/modal-store.ts — Zustand modal store (transient).
//
// One global modal stack at a time (no nesting required for v1).
// No persist middleware — modals must always open fresh per session.
//
// Reference: components/cart/store.ts pattern.

import { create } from "zustand";

export type ModalKind = null | "waitlist" | "video";

export type ModalProduct = "biz" | "link" | "reputation";

export type ModalProps = {
  /** Sub-brand slug for the waitlist modal. */
  product?: ModalProduct;
  /** Video URL for the lightbox. Optional poster image. */
  videoUrl?: string;
  posterUrl?: string;
  /** Optional context label shown in the lightbox header. */
  videoTitle?: string;
};

type ModalState = {
  kind: ModalKind;
  props: ModalProps;
};

type ModalActions = {
  open: (kind: NonNullable<ModalKind>, props?: ModalProps) => void;
  close: () => void;
};

const INITIAL: ModalState = { kind: null, props: {} };

export const useModalStore = create<ModalState & ModalActions>()((set) => ({
  ...INITIAL,
  open: (kind, props = {}) => set({ kind, props }),
  close: () => set(INITIAL),
}));

// Convenience helpers — let callers stay synchronous (no hook needed at click sites).
export const openWaitlist = (product: ModalProduct): void =>
  useModalStore.getState().open("waitlist", { product });

export const openVideo = (videoUrl: string, videoTitle?: string, posterUrl?: string): void =>
  useModalStore.getState().open("video", { videoUrl, videoTitle, posterUrl });

export const closeModal = (): void => useModalStore.getState().close();
