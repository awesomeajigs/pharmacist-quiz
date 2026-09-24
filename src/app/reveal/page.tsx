"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import GlowPulseCircle from "@/components/GlowPulseCircle";
import { burstConfetti } from "@/components/burstConfetti";
import { ANSWERS_STORAGE_KEY, scoreQuiz } from "@/lib/quiz-data";

export default function RevealPage() {
  const router = useRouter();
  const [pressed, setPressed] = useState(false);
  const circleWrapRef = useRef<HTMLDivElement>(null);
  const navigated = useRef(false);

  // If someone lands here directly with no answers on record, send them
  // back to start rather than showing a broken reveal state.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(ANSWERS_STORAGE_KEY);
      if (!raw) {
        router.replace("/");
      }
    } catch {
      // sessionStorage unavailable — let them proceed, tap() will fall back
    }
  }, [router]);

  const handleTap = useCallback(async () => {
    if (navigated.current) return;
    navigated.current = true;
    setPressed(true);

    const originEl = circleWrapRef.current;
    if (originEl) burstConfetti(originEl);

    let answerIds: string[] = [];
    try {
      const raw = sessionStorage.getItem(ANSWERS_STORAGE_KEY);
      answerIds = raw ? JSON.parse(raw) : [];
    } catch {
      // sessionStorage unavailable — scoring falls back to the default archetype
    }

    // Score + record on the server while the confetti plays; if the request
    // fails, score locally so the reveal still works offline.
    const confetti = new Promise((resolve) => setTimeout(resolve, 650));
    const submitted = fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: answerIds }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { archetype?: string } | null) => data?.archetype)
      .catch(() => undefined);

    const [, serverArchetype] = await Promise.all([confetti, submitted]);
    const archetype = serverArchetype ?? scoreQuiz(answerIds);

    try {
      sessionStorage.removeItem(ANSWERS_STORAGE_KEY);
    } catch {
      // ignore
    }
    router.push(`/result/${archetype}`);
  }, [router]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-5 bg-white px-6 py-12 text-center">
      <p className="text-[11px] font-medium tracking-[0.08em] text-accent">
        QUIZ COMPLETE
      </p>

      <div ref={circleWrapRef}>
        <GlowPulseCircle pressed={pressed} onTap={handleTap} />
      </div>

      <h2 className="text-[22px] font-semibold leading-[1.28] tracking-[-0.01em] text-ink">
        Tap to reveal your
        <br />
        pharmacist type
      </h2>
      <p className="text-[16px] leading-[1.45] text-ink-soft">
        Based on your 10 answers
      </p>
    </main>
  );
}
