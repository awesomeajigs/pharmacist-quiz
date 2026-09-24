"use client";

import { useEffect, useState } from "react";
import type { Archetype } from "@/lib/quiz-data";
import { renderShareCard } from "@/lib/share-card";

interface ShareSheetProps {
  archetype: Archetype;
  shareUrl: string;
  onClose: () => void;
}

export default function ShareSheet({ archetype, shareUrl, onClose }: ShareSheetProps) {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [card, setCard] = useState<{ url: string; blob: Blob } | null>(null);

  // Render the story card once; the same image backs the preview and Save Image.
  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;
    renderShareCard(archetype, new URL(shareUrl, window.location.origin).host)
      .then(
        (canvas) =>
          new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png")),
      )
      .then((blob) => {
        if (cancelled || !blob) return;
        objectUrl = URL.createObjectURL(blob);
        setCard({ url: objectUrl, blob });
      })
      .catch(() => {
        // preview stays in its loading state; Save Image is disabled
      });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [archetype, shareUrl]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — silently no-op, button still shows normal state
    }
  };

  const handleSaveImage = async () => {
    if (!card) return;
    setSaving(true);
    const fileName = `${archetype.id}-pharmacist-type.png`;
    try {
      const file = new File([card.blob], fileName, { type: "image/png" });
      // On phones, the native share sheet offers "Save Image" / Instagram etc.
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `I'm ${archetype.name}!` });
      } else {
        const link = document.createElement("a");
        link.download = fileName;
        link.href = card.url;
        link.click();
      }
    } catch {
      // user cancelled share sheet or save failed — no-op
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(10,10,15,0.55)]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Share your result"
        className="animate-fade-up flex w-full max-w-[480px] flex-col items-center gap-5 rounded-t-[24px] bg-white px-6 pb-9 pt-3 shadow-[0_-4px_24px_0_rgba(0,0,0,0.12)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 w-9 rounded-[2px] bg-line" />

        <div className="flex flex-col items-center gap-[2px]">
          <h3 className="text-[17px] font-semibold text-ink">Share Your Result</h3>
          <p className="text-[13px] text-ink-soft">{archetype.name}</p>
        </div>

        <div className="h-[373px] w-[210px] overflow-hidden rounded-[16px] border border-line bg-white shadow-[0_8px_20px_0_rgba(0,0,0,0.14)]">
          {card ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={card.url}
              alt={`Story card: I tested as ${archetype.name}`}
              className="size-full object-cover"
            />
          ) : (
            <div className="size-full animate-pulse bg-surface" />
          )}
        </div>

        <button
          type="button"
          onClick={handleSaveImage}
          disabled={saving || !card}
          className="flex w-full items-center justify-center rounded-full bg-accent py-4 text-[15px] font-semibold text-on-accent shadow-edge-accent transition-transform active:translate-y-[2px] active:shadow-none disabled:opacity-70"
        >
          {saving ? "Preparing…" : "Save Image"}
        </button>
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex w-full items-center justify-center rounded-full border-[1.5px] border-line py-4 text-[15px] font-semibold text-ink transition-transform active:translate-y-[2px]"
        >
          {copied ? "Link copied!" : "Copy Link"}
        </button>
      </div>
    </div>
  );
}
