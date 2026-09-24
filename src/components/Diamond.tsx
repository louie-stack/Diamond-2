export function Diamond({ className = "", glow = false }: { className?: string; glow?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" style={glow ? { filter: "drop-shadow(0 0 14px rgba(98,225,242,0.8))" } : undefined}>
      <g fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round">
        <path d="M14 10h36l10 16L32 58 4 26z" fill={glow ? "var(--cyan)" : "var(--mustard)"} />
        <path d="M4 26h56M14 10l8 16 10-16 10 16 8-16M22 26l10 32 10-32" />
      </g>
    </svg>
  );
}
