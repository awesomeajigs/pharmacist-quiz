"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Mascot from "@/components/Mascot";
import PrimaryButton from "@/components/PrimaryButton";
import ShareSheet from "@/components/ShareSheet";
import type { Archetype } from "@/lib/quiz-data";
import type { StatsResponse } from "@/app/api/stats/route";

// How often an open result page re-checks the live counts.
const STATS_POLL_MS = 8000;

type Counts = { count: number; total: number };

/** Live stat in the design's "1 in 6 pharmacists test as ..." phrasing. */
function formatStat({ count, total }: Counts, name: string) {
  if (total === 0) return `No pharmacists have tested as ${name} yet`;
  if (total === 1) return `${count} in 1 pharmacist tests as ${name}`;
  return `${count} in ${total} pharmacists test as ${name}`;
}

interface ResultViewProps {
  archetype: Archetype;
}

export default function ResultView({ archetype }: ResultViewProps) {
  const router = useRouter();
  const [shareOpen, setShareOpen] = useState(false);
  const [counts, setCounts] = useState<Counts | null>(null);

  // Live stat chip: load now, then keep polling while the page is visible so
  // it ticks up as other people finish the quiz.
  useEffect(() => {
    let cancelled = false;
    const load = () => {
      if (document.visibilityState !== "visible") return;
      fetch("/api/stats", { cache: "no-store" })
        .then((res) => (res.ok ? (res.json() as Promise<StatsResponse>) : null))
        .then((stats) => {
          if (cancelled || !stats) return;
          setCounts({ count: stats.byArchetype[archetype.id].count, total: stats.total });
        })
        .catch(() => {
          // keep the last counts; the next poll retries
        });
    };
    load();
    const timer = setInterval(load, STATS_POLL_MS);
    document.addEventListener("visibilitychange", load);
    return () => {
      cancelled = true;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", load);
    };
  }, [archetype.id]);

  const statText = counts ? formatStat(counts, archetype.name) : null;

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (typeof window !== "undefined" ? window.location.origin : "");
  const shareUrl = `${siteUrl}/result/${archetype.id}`;

  return (
    <main className="relative flex flex-1 flex-col justify-between bg-white px-6 pt-6 short:pt-4">
      {/* Celebration confetti overlay (animated GIF from the Figma result frames) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/confetti.gif"
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-10 h-[min(365px,45vh)] w-full object-cover"
      />

      <div className="flex flex-col items-center gap-[14px] pb-6 text-center short:gap-2.5 short:pb-4">
        {/* Same gentle float as the home screen stickers. */}
        <div className="animate-float flex">
          <Mascot archetypeId={archetype.id} size={256} className="result-mascot" priority />
        </div>

        <p className="text-[11px] font-medium leading-[1.2] tracking-[0.08em] text-ink-soft">
          YOUR RESULT
        </p>
        <h1 className="text-[clamp(32px,10.7vw,40px)] font-bold leading-[1.06] tracking-[-0.6px] text-ink">
          {archetype.name}
        </h1>
        <p className="text-[18px] font-medium leading-normal text-[#484e5b]">
          {archetype.tagline}
        </p>

        <div className="h-[10px] short:h-1" aria-hidden />
        <p className="text-[16px] leading-[1.45] text-ink-soft">
          {archetype.description}
        </p>

        <div className="h-[6px] short:h-0" aria-hidden />
        <span
          aria-live="polite"
          className="inline-flex items-center rounded-full bg-surface px-4 py-2 text-[13px] font-medium text-ink"
        >
          {statText ? (
            // Re-keyed on change so each update fades in.
            <span key={statText} className="animate-fade-up">
              {statText}
            </span>
          ) : (
            <span className="text-ink-soft">Counting pharmacists…</span>
          )}
        </span>
      </div>

      {/* Pinned to the bottom edge when the result scrolls on short screens. */}
      <div className="sticky bottom-0 -mx-6 flex flex-col items-center gap-6 bg-white px-6 pb-8 pt-3 short:gap-3 short:pb-4 before:pointer-events-none before:absolute before:inset-x-0 before:-top-6 before:h-6 before:bg-linear-to-t before:from-white before:to-transparent">
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
