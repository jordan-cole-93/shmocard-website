import type { CSSProperties } from "react";
import { mascotSrc, type MascotPose, type MascotTilt } from "./mascot-poses";

type StickerSize = "xs" | "sm" | "md";

type StickerProps = {
  pose: MascotPose;
  size?: StickerSize;
  tilt?: MascotTilt;
  fitRatio?: number;
  alt?: string;
  className?: string;
};

export default function Sticker({
  pose,
  size = "md",
  tilt,
  fitRatio,
  alt = "",
  className = "",
}: StickerProps) {
  const classes = [
    "shm-sticker",
    `shm-sticker--${size}`,
    tilt ? `shm-tilt-${tilt}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const style: CSSProperties | undefined =
    fitRatio !== undefined
      ? ({ ["--mascot-fit-ratio" as string]: String(fitRatio) } as CSSProperties)
      : undefined;

  return <img src={mascotSrc(pose)} alt={alt} className={classes} style={style} />;
}
