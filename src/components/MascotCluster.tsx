import Mascot from "./Mascot";
import { ARCHETYPES } from "@/lib/quiz-data";

const LAYOUT = [
  { id: "counselor", top: "8%", left: "30%", size: 96, rotate: -6, delay: "0s" },
  { id: "detective", top: "14%", left: "4%", size: 82, rotate: -9, delay: "0.4s" },
  { id: "sprinter", top: "12%", left: "62%", size: 88, rotate: 11, delay: "0.8s" },
  { id: "mentor", top: "46%", left: "14%", size: 84, rotate: -6, delay: "1.2s" },
  { id: "guardian", top: "44%", left: "56%", size: 84, rotate: 5, delay: "1.6s" },
] as const;

export default function MascotCluster() {
  return (
    <div className="relative h-[170px] w-full shrink-0">
      {LAYOUT.map((item) => {
        const archetype = ARCHETYPES[item.id];
        return (
          <div
            key={item.id}
            className="animate-float absolute drop-shadow-[0_10px_20px_rgba(0,0,0,0.14)]"
            style={
              {
                top: item.top,
                left: item.left,
                width: item.size,
                height: item.size,
                animationDelay: item.delay,
                "--float-rot": `${item.rotate}deg`,
              } as React.CSSProperties
            }
          >
            <Mascot archetypeId={item.id} color={archetype.color} size={item.size} />
          </div>
        );
      })}
    </div>
  );
}
