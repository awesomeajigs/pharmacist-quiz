"use client";

import Image from "next/image";
import { useState } from "react";

interface MascotProps {
  archetypeId: string;
  color: string;
  size?: number;
  className?: string;
  expression?: "happy" | "wink";
}

/**
 * Renders /public/mascots/{archetypeId}.png if present, otherwise falls
 * back to an original SVG blob-character placeholder in the archetype's
 * color. Drop the real exported mascot PNGs (from Figma) into
 * public/mascots/ named counselor.png, detective.png, sprinter.png,
 * mentor.png, guardian.png — no code changes needed, this swaps
 * automatically.
 */
export default function Mascot({
  archetypeId,
  color,
  size = 160,
  className,
  expression = "happy",
}: MascotProps) {
  const [imgError, setImgError] = useState(false);
  const src = `/mascots/${archetypeId}.png`;

  if (!imgError) {
    return (
      <Image
        src={src}
        alt={`${archetypeId} mascot`}
        width={size}
        height={size}
        className={className}
        style={{ objectFit: "contain" }}
        onError={() => setImgError(true)}
        unoptimized
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M80 12c30 0 52 24 52 60 0 44-18 76-52 76S28 116 28 72c0-36 22-60 52-60Z"
        fill={color}
      />
      <ellipse cx="106" cy="96" rx="16" ry="22" fill="white" fillOpacity="0.18" />
      <circle cx="62" cy="76" r="5" fill="#111111" />
      <circle cx="94" cy="76" r="5" fill="#111111" />
      {expression === "happy" ? (
        <path
          d="M64 98c6 8 26 8 32 0"
          stroke="#111111"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      ) : (
        <path
          d="M64 98c6 6 26 6 32 0"
          stroke="#111111"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      )}
    </svg>
  );
}
