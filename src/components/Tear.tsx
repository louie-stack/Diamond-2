/**
 * A torn paper edge. `color` is the paper that is doing the tearing (the section below,
 * or above when flipped). Sits inside the neighbouring section with a negative margin.
 */
export function Tear({ color = "var(--paper)", flip = false, className = "" }: { color?: string; flip?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 28"
      preserveAspectRatio="none"
      className={`tear ${flip ? "tear--flip" : ""} ${className}`}
      aria-hidden="true"
    >
      <path
        fill={color}
        d="M0 28V14l22-5 18 8 26-11 24 6 30-9 22 12 28-4 26-10 34 8 20-6 30 10 26-12 24 7 32-3 26 9 22-11 30 5 28-8 24 12 30-6 22 4 28-12 30 9 26-5 22 8 30-10 26 12 28-7 22 3 34-9 24 11 26-5 28-8 22 10 30-6 26 4 28-11 24 8 30 3 22-9 26 12 30-7 28-4 22 9 30-11 26 6 24 8 28-12 30 5 22 7 26-9 30 3 24-6 28 11 22-8 30-3 26 10 28-12 24 6 30 4 22-9 26 12 30-7 28 2 22-6 30 9 26-11 24 4 28 8 30-10 22 5V28z"
      />
    </svg>
  );
}
