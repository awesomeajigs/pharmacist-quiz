"use client";

interface GlowPulseCircleProps {
  /** Hides the tap target once the reveal overlay has taken its place. */
  hidden: boolean;
  onTap: (target: HTMLButtonElement) => void;
}

export default function GlowPulseCircle({ hidden, onTap }: GlowPulseCircleProps) {
  return (
    <div className="relative flex size-[220px] items-center justify-center">
      {/* soft blurred glow */}
      <div
        className="animate-glow-breathe absolute size-[220px] rounded-full opacity-30 blur-[20px]"
        style={{ background: "var(--accent)" }}
        aria-hidden
      />
      {/* pulse rings */}
      <div
        className="animate-pulse-out absolute size-[172px] rounded-full border-[1.5px]"
        style={{ borderColor: "var(--accent)" }}
        aria-hidden
      />
      <div
        className="animate-pulse-out-delay absolute size-[172px] rounded-full border-[1.5px]"
        style={{ borderColor: "var(--accent)" }}
        aria-hidden
      />
      {/* tap target */}
      <button
        type="button"
        onClick={(e) => onTap(e.currentTarget)}
        aria-label="Tap to reveal your pharmacist type"
        className={[
          "animate-breathe relative z-10 size-[140px] rounded-full bg-accent shadow-[0_0_30px_0_rgba(14,140,127,0.45)]",
          hidden ? "invisible" : "",
        ].join(" ")}
      />
    </div>
  );
}
