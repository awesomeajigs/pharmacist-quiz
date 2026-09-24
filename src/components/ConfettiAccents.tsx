const DOTS: { x: string; y: string; size: number; color: string; rotate?: number }[] = [
  { x: "10%", y: "16%", size: 8, color: "#3462c4" },
  { x: "88%", y: "20%", size: 6, color: "#8a5cb3" },
  { x: "80%", y: "29%", size: 10, color: "#3462c4", rotate: -30 },
  { x: "7%", y: "33%", size: 9, color: "#8a5cb3", rotate: 20 },
  { x: "90%", y: "37%", size: 7, color: "#ef962b" },
  { x: "5%", y: "39%", size: 9, color: "#ef962b" },
  { x: "92%", y: "45%", size: 6, color: "#0e8c7f", rotate: -15 },
  { x: "3%", y: "49%", size: 8, color: "#3462c4", rotate: 35 },
  { x: "83%", y: "55%", size: 6, color: "#ef962b" },
  { x: "12%", y: "58%", size: 8, color: "#ef962b" },
  { x: "95%", y: "22%", size: 6, color: "#287e44" },
  { x: "2%", y: "21%", size: 6, color: "#287e44" },
];

export default function ConfettiAccents() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {DOTS.map((dot, i) => (
        <span
          key={i}
          className="absolute rounded-[2px] opacity-55"
          style={{
            left: dot.x,
            top: dot.y,
            width: dot.size,
            height: dot.size,
            background: dot.color,
            transform: dot.rotate ? `rotate(${dot.rotate}deg)` : undefined,
          }}
        />
      ))}
    </div>
  );
}
