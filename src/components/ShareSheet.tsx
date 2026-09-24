"use client";

import { useState } from "react";
import type { Archetype } from "@/lib/quiz-data";

interface ShareSheetProps {
  archetype: Archetype;
  shareUrl: string;
  onClose: () => void;
}

export default function ShareSheet({ archetype, shareUrl, onClose }: ShareSheetProps) {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

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
    setSaving(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: `I'm ${archetype.name}!`,
          text: `${archetype.tagline} What kind of pharmacist are you?`,
          url: shareUrl,
        });
      } else {
        const canvas = await renderShareCard(archetype);
        const link = document.createElement("a");
        link.download = `${archetype.id}-pharmacist-type.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    } catch {
      // user cancelled share sheet or save failed — no-op
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-[480px] rounded-t-[28px] bg-white p-6 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-line" />
        <h3 className="mb-1 text-[18px] font-semibold text-ink">Share your result</h3>
        <p className="mb-6 text-[14px] text-ink-soft">
          Let people know you&rsquo;re {archetype.name}.
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleSaveImage}
            disabled={saving}
            className="flex w-full items-center justify-center rounded-full bg-accent py-4 text-[15px] font-semibold text-on-accent shadow-edge-accent transition-transform active:translate-y-[2px] active:shadow-none disabled:opacity-70"
          >
            {saving ? "Preparing…" : "Save Image"}
          </button>
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex w-full items-center justify-center rounded-full border-2 border-line py-[14px] text-[15px] font-semibold text-ink transition-transform active:translate-y-[2px]"
          >
            {copied ? "Link copied!" : "Copy Link"}
          </button>
        </div>
      </div>
    </div>
  );
}

async function renderShareCard(archetype: Archetype): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext("2d")!;

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Accent circle behind headline
  ctx.fillStyle = archetype.color;
  ctx.beginPath();
  ctx.arc(canvas.width / 2, 620, 260, 0, Math.PI * 2);
  ctx.fill();

  // Eyebrow
  ctx.fillStyle = archetype.color;
  ctx.font = "600 32px Arial";
  ctx.textAlign = "center";
  ctx.fillText("YOUR RESULT", canvas.width / 2, 1020);

  // Headline
  ctx.fillStyle = "#111111";
  ctx.font = "800 96px Arial";
  ctx.fillText(archetype.name, canvas.width / 2, 1140);

  // Tagline
  ctx.fillStyle = archetype.color;
  ctx.font = "600 44px Arial";
  wrapText(ctx, archetype.tagline, canvas.width / 2, 1230, 880, 58);

  // Footer
  ctx.fillStyle = "#6b7280";
  ctx.font = "400 36px Arial";
  ctx.fillText("What Kind of Pharmacist Are You?", canvas.width / 2, canvas.height - 100);

  return canvas;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";
  let cursorY = y;
  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, cursorY);
      line = word;
      cursorY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) ctx.fillText(line, x, cursorY);
}
