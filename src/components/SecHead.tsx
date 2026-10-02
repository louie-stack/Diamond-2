/** Section header: index rule, then a display headline with an optional aside. */
export function Idx({ n, label }: { n: string; label: string }) {
  return (
    <div className="idx meta" data-fx="rise">
      <span className="idx__n">{n}</span>
      <span>{label}</span>
      <span className="idx__rule" />
    </div>
  );
}

export default function SecHead({
  n, label, title, aside, size = "h-l", className = "",
}: { n: string; label: string; title: React.ReactNode; aside?: React.ReactNode; size?: string; className?: string }) {
  return (
    <div className={className}>
      <Idx n={n} label={label} />
      <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-[1fr_auto] lg:items-end">
        <h2 className={`display ${size} max-w-[1100px]`} data-fx="lines">
          {title}
        </h2>
        {aside && (
          <div className="meta max-w-[260px] leading-relaxed opacity-60 lg:pb-3 lg:text-right" data-fx="rise" data-fx-delay="0.2">
            {aside}
          </div>
        )}
      </div>
    </div>
  );
}
