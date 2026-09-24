interface ProgressBarProps {
  current: number; // 1-indexed
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, current / total)) * 100;
  return (
    <div className="flex w-full flex-col items-start gap-[10px]">
      <p className="text-[11px] font-medium tracking-[0.08em] text-ink-soft">
        QUESTION {current} OF {total}
      </p>
      <div className="h-1 w-full overflow-hidden rounded-full bg-line">
        <div
          className="h-1 rounded-full bg-accent transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
