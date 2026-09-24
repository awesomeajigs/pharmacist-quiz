import Image from "next/image";
import type { ArchetypeId } from "@/lib/quiz-data";

interface MascotProps {
  archetypeId: ArchetypeId;
  size?: number;
  className?: string;
  priority?: boolean;
}

/** Archetype mascot artwork exported from Figma (public/mascots/{id}.png). */
export default function Mascot({
  archetypeId,
  size = 160,
  className,
  priority,
}: MascotProps) {
  return (
    <Image
      src={`/mascots/${archetypeId}.png`}
      alt=""
      width={size}
      height={size}
      className={className}
      priority={priority}
      style={{ objectFit: "cover" }}
    />
  );
}
