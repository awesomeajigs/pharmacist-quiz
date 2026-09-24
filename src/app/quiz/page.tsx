"use client";

import { useCallback, useEffect, useRef, useState, ViewTransition } from "react";
import { useRouter } from "next/navigation";
import AnswerOption from "@/components/AnswerOption";
import BackButton from "@/components/BackButton";
import ProgressBar from "@/components/ProgressBar";
import PrimaryButton from "@/components/PrimaryButton";
import { ANSWERS_STORAGE_KEY, QUESTIONS, TOTAL_QUESTIONS } from "@/lib/quiz-data";

const AUTO_ADVANCE_DELAY = 350;

export default function QuizPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(
    () => Array(TOTAL_QUESTIONS).fill(null),
  );
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question = QUESTIONS[index];
  const isLast = index === TOTAL_QUESTIONS - 1;
  const selectedAnswerId = answers[index];

  // On short screens the answers can scroll; start each question at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [index]);

  const goBack = useCallback(() => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    if (index === 0) {
      router.push("/");
    } else {
      setIndex((i) => i - 1);
    }
  }, [index, router]);

  const selectAnswer = useCallback(
    (answerId: string) => {
      setAnswers((prev) => {
        const next = [...prev];
        next[index] = answerId;
        return next;
      });

      if (!isLast) {
        if (advanceTimer.current) clearTimeout(advanceTimer.current);
        advanceTimer.current = setTimeout(() => {
          setIndex((i) => Math.min(i + 1, TOTAL_QUESTIONS - 1));
        }, AUTO_ADVANCE_DELAY);
      }
    },
    [index, isLast],
  );

  const submit = useCallback(() => {
    const finalAnswers = answers.map((a) => a ?? "");
    try {
      sessionStorage.setItem(ANSWERS_STORAGE_KEY, JSON.stringify(finalAnswers));
    } catch {
      // sessionStorage unavailable — reveal page will fall back gracefully
    }
    // Figma prototype: Submit -> Tap to Reveal is a 400ms linear crossfade.
    router.push("/reveal", { transitionTypes: ["quiz-submit"] });
  }, [answers, router]);

  return (
    <ViewTransition exit={{ "quiz-submit": "page-fade", default: "none" }} default="none">
      <main className="flex flex-1 flex-col gap-7 bg-white px-6 pb-8 pt-12 short:gap-5 short:pt-6">
        <BackButton onClick={goBack} />
        <ProgressBar current={index + 1} total={TOTAL_QUESTIONS} />

        <h2 className="text-[22px] font-semibold leading-[1.28] tracking-[-0.01em] text-ink">
          {question.prompt}
        </h2>

        <div className="flex flex-col gap-3">
          {question.answers.map((answer) => (
            <AnswerOption
              key={answer.id}
              text={answer.text}
              selected={selectedAnswerId === answer.id}
              onSelect={() => selectAnswer(answer.id)}
            />
          ))}
        </div>

        {isLast && (
          // Pinned to the bottom edge when the answers scroll on short screens.
          <div className="sticky bottom-0 -mx-6 mt-auto bg-white px-6 pb-16 pt-3 short:pb-4 before:pointer-events-none before:absolute before:inset-x-0 before:-top-6 before:h-6 before:bg-linear-to-t before:from-white before:to-transparent">
            <PrimaryButton onClick={submit} disabled={!selectedAnswerId}>
              Submit
            </PrimaryButton>
          </div>
        )}
      </main>
    </ViewTransition>
  );
}
