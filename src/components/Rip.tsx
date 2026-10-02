/**
 * A ripped paper edge. Sits on top of a section and tears into the one above:
 * the section's own colour with a jagged top, and a pale line of torn fibres.
 */
function edge(seed: number, amp: number) {
  let s = seed * 7919 + 13;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const pts: string[] = ["0% 100%"];
  let x = 0;
  while (x < 100) {
    pts.push(`${x.toFixed(2)}% ${(r() * amp).toFixed(1)}%`);
    x += 0.6 + r() * 1.6;
  }
  pts.push(`100% ${(r() * amp).toFixed(1)}%`, "100% 100%");
  return `polygon(${pts.join(", ")})`;
}

export default function Rip({ color, seed = 1, flip = false, inside = false, fiber, className = "" }: { color: string; seed?: number; flip?: boolean; inside?: boolean; fiber?: string; className?: string }) {
  return (
    <div className={`rip ${flip ? "rip--flip" : ""} ${inside ? "rip--in" : ""} ${className}`} aria-hidden="true">
      <div className="rip__fiber" style={{ clipPath: edge(seed + 101, 70), ...(fiber ? { background: fiber } : {}) }} />
      <div className="rip__paper" style={{ background: color, clipPath: edge(seed, 62) }} />
    </div>
  );
}

/** clip-path for a whole section whose top edge is torn (jag depth in px, lift raises it) */
export function tornTop(seed: number, lift: number, amp = 34) {
  let s = seed * 7919 + 13;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const pts: string[] = [];
  let x = 0;
  while (x < 100) {
    pts.push(`${x.toFixed(2)}% ${Math.max(0, r() * amp - lift + (r() < 0.12 ? 10 : 0)).toFixed(1)}px`);
    x += 0.5 + r() * 1.4;
  }
  pts.push(`100% ${Math.max(0, r() * amp - lift).toFixed(1)}px`, "100% 100%", "0% 100%");
  return `polygon(${pts.join(", ")})`;
}

/** clip-path for a whole section whose bottom edge is torn (drop lowers the edge) */
export function tornBottom(seed: number, drop: number, amp = 34) {
  let s = seed * 7919 + 29;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const pts: string[] = ["0% 0%", "100% 0%"];
  let x = 100;
  while (x > 0) {
    pts.push(`${x.toFixed(2)}% calc(100% - ${Math.max(0, r() * amp - drop + (r() < 0.12 ? 10 : 0)).toFixed(1)}px)`);
    x -= 0.5 + r() * 1.4;
  }
  pts.push(`0% calc(100% - ${Math.max(0, r() * amp - drop).toFixed(1)}px)`);
  return `polygon(${pts.join(", ")})`;
}
