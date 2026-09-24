import type { Archetype } from "@/lib/quiz-data";

// Renders the 1080x1920 story card from the Figma "08 — Share Card" frames.
// Layout: a centered column (pt 160, pb 120, px 80, gap 40) with a flexible
// filler pushing the CTA block to the bottom.

export const CARD_WIDTH = 1080;
export const CARD_HEIGHT = 1920;

const ACCENT = "#0e8c7f";
const INK = "#111111";
const INK_SOFT = "#6b7280";
const CX = CARD_WIDTH / 2;
const GAP = 40;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function renderShareCard(
  archetype: Archetype,
  siteHost: string,
): Promise<HTMLCanvasElement> {
  const family = getComputedStyle(document.body).fontFamily;
  await Promise.all(
    [500, 600, 700].map((w) => document.fonts.load(`${w} 40px ${family}`).catch(() => [])),
  );
  const mascot = await loadImage(`/mascots/${archetype.id}.png`);

  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const ctx = canvas.getContext("2d")!;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  const setFont = (weight: number, size: number, color: string, tracking = 0) => {
    ctx.font = `${weight} ${size}px ${family}`;
    ctx.fillStyle = color;
    if ("letterSpacing" in ctx) ctx.letterSpacing = `${tracking}px`;
  };

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  let y = 160;

  setFont(500, 28, ACCENT, 2.5);
  ctx.fillText("WORLD PHARMACIST DAY · SEPT 25", CX, y);
  y += 34 + GAP;

  ctx.drawImage(mascot, CX - 280, y, 560, 560);
  y += 560 + GAP;

  setFont(500, 26, INK_SOFT, 2);
  ctx.fillText("I TESTED AS", CX, y);
  y += 31 + GAP;

  setFont(700, 96, INK, -1.5);
  y = wrapText(ctx, archetype.name, y, 880, 102) + GAP;

  setFont(500, 40, ACCENT);
  wrapText(ctx, archetype.tagline, y, 760, 48);

  // CTA block, anchored to the bottom padding (1920 - 120).
  setFont(600, 30, "#ffffff");
  const chipH = 36 + 32;
  const chipW = ctx.measureText(siteHost).width + 64;
  const chipTop = CARD_HEIGHT - 120 - chipH;
  ctx.fillStyle = ACCENT;
  ctx.beginPath();
  ctx.roundRect(CX - chipW / 2, chipTop, chipW, chipH, chipH / 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.fillText(siteHost, CX, chipTop + 16);

  setFont(600, 34, INK);
  ctx.fillText("What kind of pharmacist are you?", CX, chipTop - 16 - 41);

  return canvas;
}

/** Draws centered, word-wrapped text; returns the y just below the last line. */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const words = text.split(" ");
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, CX, y);
      line = word;
      y += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) {
    ctx.fillText(line, CX, y);
    y += lineHeight;
  }
  return y;
}
