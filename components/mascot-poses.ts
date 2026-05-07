// Mascot pose registry — every PNG file in /public/mascot/, keyed by
// the part after "mascot-" with .png stripped. Add a new pose here when
// a new mascot art file lands in public/mascot/.

export const MASCOT_POSES = [
  "celebrating",
  "charge",
  "confused",
  "heart-hands",
  "holding-card",
  "megaphone",
  "money-gesture",
  "pointing",
  "star-burst",
  "tap-moment",
  "thinking",
  "thumbs-up",
  "waving",
] as const;

export type MascotPose = (typeof MASCOT_POSES)[number];

export type MascotTilt = "l" | "r" | "sm-l" | "sm-r";

export function mascotSrc(pose: MascotPose): string {
  return `/mascot/mascot-${pose}.png`;
}
