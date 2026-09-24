const COLORS = ["#0e8c7f", "#3462c4", "#ef962b", "#8a5cb3", "#287e44"];

/**
 * Fires a short-lived DOM confetti burst radiating out from `originEl`'s
 * center. Pure side effect — appends/removes elements on document.body.
 * See the Tap-to-Reveal animation spec for timing rationale.
 */
export function burstConfetti(originEl: HTMLElement, count = 28) {
  if (typeof window === "undefined") return;
  const rect = originEl.getBoundingClientRect();

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.style.position = "fixed";
    piece.style.width = "7px";
    piece.style.height = "7px";
    piece.style.borderRadius = "2px";
    piece.style.pointerEvents = "none";
    piece.style.zIndex = "999";
    piece.style.background = COLORS[i % COLORS.length];
    piece.style.left = `${rect.left + rect.width / 2}px`;
    piece.style.top = `${rect.top + rect.height / 2}px`;

    const angle = Math.random() * Math.PI * 2;
    const distance = 120 + Math.random() * 140;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 40;
    const rotate = (Math.random() - 0.5) * 720;
    const delay = Math.random() * 80;

    document.body.appendChild(piece);

    const animation = piece.animate(
      [
        { transform: "translate(0,0) rotate(0deg) scale(1)", opacity: 1 },
        {
          transform: `translate(${dx}px, ${dy}px) rotate(${rotate}deg) scale(0.6)`,
          opacity: 0,
        },
      ],
      {
        duration: 700 + Math.random() * 300,
        delay,
        easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
        fill: "forwards",
      },
    );

    animation.onfinish = () => piece.remove();
    // Safety net in case onfinish doesn't fire (e.g. tab backgrounded).
    setTimeout(() => piece.remove(), 1400);
  }
}
