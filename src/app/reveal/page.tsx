"use client";

import { useCallback, useEffect, useRef, useState, ViewTransition } from "react";
import { useRouter } from "next/navigation";
import GlowPulseCircle from "@/components/GlowPulseCircle";
import { ANSWERS_STORAGE_KEY, ARCHETYPES, scoreQuiz } from "@/lib/quiz-data";

// Reveal motion from the Figma prototype (Flow 1):
//   Tap Target --tap--> "Frame" (43:285): Smart Animate, linear, 500ms — the
//   140px circle grows into an 847x962 ellipse centred on the 375x812 screen,
//   everything else fades out.
//   "Frame" --after 800ms--> Result: instant.
const EXPAND_MS = 500;
const HOLD_MS = 800;
const DESIGN_W = 375;
const DESIGN_H = 812;
const FILL_W = 847;
const FILL_H = 962;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function RevealPage() {
  const router = useRouter();
  const [revealing, setRevealing] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
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

  // Warm every result page so the cut after the hold is instant.
  useEffect(() => {
    for (const id of Object.keys(ARCHETYPES)) router.prefetch(`/result/${id}`);
  }, [router]);

  const expandCircle = useCallback((target: HTMLButtonElement): Promise<void> => {
    const overlay = overlayRef.current;
    if (!overlay) return Promise.resolve();

    // Start exactly on top of the tapped circle...
    const from = target.getBoundingClientRect();
    Object.assign(overlay.style, {
      left: `${from.left}px`,
      top: `${from.top}px`,
      width: `${from.width}px`,
      height: `${from.height}px`,
      visibility: "visible",
    });

    // ...and end as the design's full-screen ellipse, scaled to this viewport.
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scaleX = (vw * (FILL_W / DESIGN_W)) / from.width;
    const scaleY = (vh * (FILL_H / DESIGN_H)) / from.height;
    const dx = vw / 2 - (from.left + from.width / 2);
    const dy = vh / 2 - (from.top + from.height / 2);
    const end = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;

    if (prefersReducedMotion()) {
      overlay.style.transform = end;
      return Promise.resolve();
    }
    const animation = overlay.animate(
      [{ transform: "translate(0, 0) scale(1, 1)" }, { transform: end }],
      { duration: EXPAND_MS, easing: "linear", fill: "forwards" },
    );
    return animation.finished.then(() => undefined);
  }, []);

  const handleTap = useCallback(
    async (target: HTMLButtonElement) => {
      if (navigated.current) return;
      navigated.current = true;
      setRevealing(true);

      let answerIds: string[] = [];
      try {
        const raw = sessionStorage.getItem(ANSWERS_STORAGE_KEY);
        answerIds = raw ? JSON.parse(raw) : [];
      } catch {
        // sessionStorage unavailable — scoring falls back to the default archetype
      }

      // Score + record on the server while the reveal plays; if the request
      // fails, score locally so the reveal still works offline.
      const submitted = fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: answerIds }),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data: { archetype?: string } | null) => data?.archetype)
        .catch(() => undefined);

      const reveal = expandCircle(target).then(
        () => new Promise((resolve) => setTimeout(resolve, HOLD_MS)),
      );

      const [, serverArchetype] = await Promise.all([reveal, submitted]);
      const archetype = serverArchetype ?? scoreQuiz(answerIds);

      try {
        sessionStorage.removeItem(ANSWERS_STORAGE_KEY);
      } catch {
        // ignore
      }
      router.push(`/result/${archetype}`);
    },
    [expandCircle, router],
  );

  return (
    <ViewTransition enter={{ "quiz-submit": "page-fade", default: "none" }} default="none">
      <main className="flex flex-1 flex-col items-center justify-center gap-5 bg-white px-6 py-12 text-center">
        <div
          className={[
            "flex flex-col items-center gap-5 transition-opacity duration-500 ease-linear motion-reduce:transition-none",
            revealing ? "opacity-0" : "opacity-100",
          ].join(" ")}
        >
          {/* Present in the design for layout but fully transparent there. */}
          <p className="text-[11px] font-medium tracking-[0.08em] text-transparent" aria-hidden>
            QUIZ COMPLETE
          </p>

          <GlowPulseCircle hidden={revealing} onTap={handleTap} />

          <h2 className="text-[22px] font-semibold leading-[1.28] tracking-[-0.01em] text-ink">
            Tap to reveal your
            <br />
            pharmacist type
          </h2>
          <p className="text-[16px] leading-[1.45] text-ink-soft">
            Based on your 10 answers
          </p>
        </div>

        {/* The tap target, promoted to a fixed layer so it can grow past the page. */}
        <div
          ref={overlayRef}
          aria-hidden
          className="invisible fixed z-50 rounded-full bg-accent will-change-transform"
        />
      </main>
    </ViewTransition>
  );
}
