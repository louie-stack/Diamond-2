/** A comic-book starburst. Text sits on a 16-point star with a hard ink outline. */
export function Burst({
  children,
  className = "",
  fill = "var(--orange)",
  color = "var(--cream)",
  size = 64,
}: {
  children: React.ReactNode;
  className?: string;
  fill?: string;
  color?: string;
  size?: number;
}) {
  const pts: string[] = [];
  const n = 18;
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? 100 : 78;
    const a = (Math.PI * i) / n - Math.PI / 2;
    pts.push(`${100 + r * Math.cos(a)},${100 + r * Math.sin(a)}`);
  }
  return (
    <span className={`relative inline-grid place-items-center ${className}`} style={{ width: size * 3.4, height: size * 3.4 }}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <polygon points={pts.join(" ")} fill="var(--ink)" transform="translate(6 7)" />
        <polygon points={pts.join(" ")} fill={fill} stroke="var(--ink)" strokeWidth="4" strokeLinejoin="round" />
      </svg>
      <span
        className="f-comic relative -rotate-6 text-center leading-[0.85]"
        style={{ color, fontSize: size, textShadow: "3px 3px 0 var(--ink)", WebkitTextStroke: "1px var(--ink)" }}
      >
        {children}
      </span>
    </span>
  );
}
