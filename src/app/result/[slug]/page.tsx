"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Mascot from "@/components/Mascot";
import PrimaryButton from "@/components/PrimaryButton";
import ShareSheet from "@/components/ShareSheet";
import { ARCHETYPES, ArchetypeId } from "@/lib/quiz-data";

function isArchetypeId(value: string): value is ArchetypeId {
  return value in ARCHETYPES;
}

export default function ResultPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [shareOpen, setShareOpen] = useState(false);

  const slug = params.slug;
  const archetype = isArchetypeId(slug) ? ARCHETYPES[slug] : null;

  if (!archetype) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-[16px] text-ink-soft">
          We couldn&rsquo;t find that result.
        </p>
        <PrimaryButton href="/">Back to Home</PrimaryButton>
      </main>
    );
  }

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/result/${archetype.id}`
      : `/result/${archetype.id}`;

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
          {archetype.stat}
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
