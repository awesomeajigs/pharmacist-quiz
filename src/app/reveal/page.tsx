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

  const handleTap = useCallback(() => {
    if (navigated.current) return;
    navigated.current = true;
    setPressed(true);

    const originEl = circleWrapRef.current;
    if (originEl) burstConfetti(originEl);

    let archetype = "counselor";
    try {
      const raw = sessionStorage.getItem(ANSWERS_STORAGE_KEY);
      const answerIds: string[] = raw ? JSON.parse(raw) : [];
      archetype = scoreQuiz(answerIds);
    } catch {
      // fall back to default archetype above
    }

    setTimeout(() => {
      router.push(`/result/${archetype}`);
    }, 650);
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
