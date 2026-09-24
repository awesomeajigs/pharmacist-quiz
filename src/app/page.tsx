import PrimaryButton from "@/components/PrimaryButton";
import MascotCluster from "@/components/MascotCluster";

export default function HomePage() {
  return (
    <main className="relative flex flex-1 flex-col overflow-hidden bg-white px-6 pb-8 pt-12">
      <div className="relative z-10 flex flex-col gap-4">
        <p className="text-[11px] font-medium tracking-[0.08em] text-accent">
          WORLD PHARMACIST DAY · SEPT 25
        </p>
        <h1 className="text-[32px] font-bold leading-[1.08] tracking-[-0.01em] text-ink">
          What Kind of Pharmacist Are You?
        </h1>
        <p className="text-[16px] leading-[1.45] text-ink-soft">
          10 quick questions. One honest answer about how you show up at
          work.
        </p>
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center">
        <MascotCluster />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-3">
        <PrimaryButton href="/quiz">Start the Quiz</PrimaryButton>
        <p className="text-center text-[12px] leading-[1.45] text-ink-soft">
          Takes about 2 minutes · Share your result at the end
        </p>
      </div>
    </main>
  );
}
