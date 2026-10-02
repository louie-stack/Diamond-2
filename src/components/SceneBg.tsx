/**
 * A scene from the case as a full-bleed section backdrop: drifts with scroll and
 * fades into the section colour so text can sit over it.
 */
export default function SceneBg({
  src, tone = "var(--night-2)", height = "100%", opacity = 0.55, position = "center", from = "top",
}: { src: string; tone?: string; height?: string; opacity?: number; position?: string; from?: "top" | "bottom" }) {
  const fade =
    from === "top"
      ? `linear-gradient(180deg, ${tone} 0%, transparent 28%, transparent 40%, ${tone} 94%), linear-gradient(90deg, ${tone} 0%, transparent 30%, transparent 70%, ${tone} 100%)`
      : `linear-gradient(0deg, transparent 0%, ${tone} 92%), linear-gradient(90deg, ${tone} 0%, transparent 30%, transparent 70%, ${tone} 100%)`;
  return (
    <div className={`pointer-events-none absolute inset-x-0 overflow-hidden ${from === "top" ? "top-0" : "bottom-0"}`} style={{ height }} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        data-parallax="6"
        className="absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover"
        style={{ opacity, objectPosition: position }}
        loading="lazy"
      />
      <div className="absolute inset-0" style={{ background: fade }} />
    </div>
  );
}
