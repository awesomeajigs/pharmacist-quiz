"use client";

interface GlowPulseCircleProps {
  pressed: boolean;
  onTap: () => void;
}

export default function GlowPulseCircle({ pressed, onTap }: GlowPulseCircleProps) {
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
        onClick={onTap}
        aria-label="Tap to reveal your pharmacist type"
        className={[
          "relative z-10 size-[140px] rounded-full bg-accent shadow-[0_0_30px_0_rgba(14,140,127,0.45)]",
          pressed ? "animate-circle-pop" : "animate-breathe",
        ].join(" ")}
      />
    </div>
  );
}
