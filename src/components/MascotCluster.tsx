import Mascot from "./Mascot";

// Sticker positions from the Figma home frame (group spans x 16–359,
// y 255–557 in the 375px frame, i.e. a 343x302 box). `box` is the rotated
// sticker's bounding box, `size` the unrotated image inside it. Everything
// is converted to percentages of the cluster so it scales as one unit.
const CLUSTER_W = 343;
const CLUSTER_H = 302;

const LAYOUT = [
  { id: "detective", left: 0, top: 39.2, box: 141.4, size: 123.6, rotate: -9, delay: "0.4s" },
  { id: "sprinter", left: 198.1, top: 48.8, box: 144.9, size: 123.6, rotate: 11, delay: "0.8s" },
  { id: "mentor", left: 37, top: 155.1, box: 146.6, size: 133.3, rotate: -6, delay: "1.2s" },
  { id: "guardian", left: 148.8, top: 138.8, box: 144.5, size: 133.3, rotate: 5, delay: "1.6s" },
  { id: "counselor", left: 88.7, top: 0, box: 160.9, size: 146.4, rotate: 6, delay: "0s" },
] as const;

const pct = (value: number, of: number) => `${(value / of) * 100}%`;

export default function MascotCluster() {
  return (
    <div className="home-cluster relative shrink-0">
      {LAYOUT.map((item) => (
        <div
          key={item.id}
          className="absolute flex items-center justify-center"
          style={{
            left: pct(item.left, CLUSTER_W),
            top: pct(item.top, CLUSTER_H),
            width: pct(item.box, CLUSTER_W),
            height: pct(item.box, CLUSTER_H),
          }}
        >
          <div
            className="animate-float drop-shadow-[0_9.76px_22.77px_rgba(0,0,0,0.14)]"
            style={
              {
                width: pct(item.size, item.box),
                aspectRatio: "1",
                animationDelay: item.delay,
                "--float-rot": `${item.rotate}deg`,
              } as React.CSSProperties
            }
          >
            <Mascot
              archetypeId={item.id}
              size={Math.round(item.size)}
              className="size-full"
              priority
            />
          </div>
        </div>
      ))}
    </div>
  );
}
