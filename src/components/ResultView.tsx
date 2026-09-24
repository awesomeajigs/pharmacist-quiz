"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Mascot from "@/components/Mascot";
import PrimaryButton from "@/components/PrimaryButton";
import ShareSheet from "@/components/ShareSheet";
import type { Archetype } from "@/lib/quiz-data";
import type { StatsResponse } from "@/app/api/stats/route";

// Below this many total results the live percentage is too noisy to show,
// so the designed "1 in N" copy is used instead.
const MIN_RESULTS_FOR_LIVE_STAT = 20;

interface ResultViewProps {
  archetype: Archetype;
}

export default function ResultView({ archetype }: ResultViewProps) {
  const router = useRouter();
  const [shareOpen, setShareOpen] = useState(false);
  const [liveStat, setLiveStat] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/stats")
      .then((res) => (res.ok ? (res.json() as Promise<StatsResponse>) : null))
      .then((stats) => {
        if (cancelled || !stats || stats.total < MIN_RESULTS_FOR_LIVE_STAT) return;
        const { pct } = stats.byArchetype[archetype.id];
        setLiveStat(`${pct}% of pharmacists so far got ${archetype.name}`);
      })
      .catch(() => {
        // keep the static stat
      });
    return () => {
      cancelled = true;
    };
  }, [archetype.id, archetype.name]);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (typeof window !== "undefined" ? window.location.origin : "");
  const shareUrl = `${siteUrl}/result/${archetype.id}`;

  return (
    <main className="flex flex-1 flex-col justify-between bg-white px-6 pb-8 pt-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <Mascot archetypeId={archetype.id} color={archetype.color} size={220} />

        <p className="mt-2 text-[11px] font-medium tracking-[0.08em] text-ink-soft">
          YOUR RESULT
        </p>
        <h1 className="text-[40px] font-bold leading-[1.06] tracking-[-0.015em] text-ink">
          {archetype.name}
        </h1>
        <p
          className="text-[16px] font-medium leading-normal"
          style={{ color: archetype.color }}
        >
          {archetype.tagline}
        </p>

        <p className="mt-1 text-[16px] leading-[1.45] text-ink-soft">
          {archetype.description}
        </p>

        <span className="mt-1 inline-flex items-center rounded-full bg-surface px-4 py-2 text-[13px] font-medium text-ink">
          {liveStat ?? archetype.stat}
        </span>
      </div>

      <div className="mt-8 flex flex-col items-center gap-6">
        <PrimaryButton onClick={() => setShareOpen(true)}>
          Share Your Result
        </PrimaryButton>
        <button
          type="button"
          onClick={() => router.push("/quiz")}
          className="text-[13px] text-ink-soft underline-offset-2 hover:underline"
        >
          Retake the quiz
        </button>
      </div>

      {shareOpen && (
        <ShareSheet
          archetype={archetype}
          shareUrl={shareUrl}
          onClose={() => setShareOpen(false)}
        />
      )}
    </main>
  );
}
