import type { CSSProperties } from "react";
import { mascotSrc, type MascotPose, type MascotTilt } from "./mascot-poses";

type MascotSize = "decoration" | "accent" | "supporting" | "hero";

type MascotProps = {
  pose: MascotPose;
  size?: MascotSize;
  tilt?: MascotTilt;
  /**
   * Override --mascot-fit-ratio for poses with wider transparent padding
   * (e.g. megaphone = 1.3). See components.css mascot block.
   */
  fitRatio?: number;
  alt?: string;
  className?: string;
};

export default function Mascot({
  pose,
  size = "supporting",
  tilt,
  fitRatio,
  alt = "",
  className = "",
}: MascotProps) {
  const classes = [
    "shm-mascot",
    `shm-mascot--${size}`,
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
