"use client";

interface AnswerOptionProps {
  text: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export default function AnswerOption({
  text,
  selected,
  onSelect,
  disabled,
}: AnswerOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      className={[
        "flex w-full items-center gap-3 rounded-[20px] border-2 p-4 text-left transition-transform short:py-3",
        "active:translate-y-[2px] active:shadow-none",
        selected
          ? "border-accent bg-[#ecf6f5] shadow-edge-accent"
          : "border-line bg-white shadow-edge",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
      ].join(" ")}
    >
      <span className="flex-1 text-[16px] leading-[1.45] text-ink">
        {text}
      </span>
      <span
        className={[
          "size-[18px] shrink-0 rounded-full border-[1.5px]",
          selected ? "border-accent bg-accent" : "border-line bg-white",
        ].join(" ")}
      />
    </button>
  );
}
