/** Crime-scene tape across a section seam. Drifts slowly. */
export default function Tape({ tilt = -2.5, reverse = false, text = "Crime scene. Do not cross." }: { tilt?: number; reverse?: boolean; text?: string }) {
  const row = Array.from({ length: 10 }, () => text);
  return (
    <div className="tape" style={{ rotate: `${tilt}deg` }} aria-hidden="true">
      <div className={`tape__track ${reverse ? "tape__track--rev" : ""}`}>
        {[...row, ...row].map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>
    </div>
  );
}
