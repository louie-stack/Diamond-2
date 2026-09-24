"use client";

import { useCallback, useEffect, useState } from "react";
import { MEMES } from "@/content";

const rots = [-3, 2, -1.5, 2.5, -2, 1, -2.5, 3, -1];

export default function MemeWall() {
  const [idx, setIdx] = useState<number | null>(null);
  const close = useCallback(() => setIdx(null), []);
  const step = useCallback((d: number) => setIdx((i) => (i === null ? null : (i + d + MEMES.length) % MEMES.length)), []);

  useEffect(() => {
    if (idx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [idx, close, step]);

  const m = idx === null ? null : MEMES[idx];
  const shareText = encodeURIComponent("You can sell. You just can't jeet. $DIAMOND, the world's first anti-jeet memecoin.");

  return (
    <>
      <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
        {MEMES.map((mm, i) => (
          <button
            type="button"
            key={mm.src}
            onClick={() => setIdx(i)}
            className="polaroid relative block text-left"
            style={{ transform: `rotate(${rots[i]}deg)` }}
            data-fx="flash"
            data-fx-delay={(i % 3) * 0.1}
            aria-label={`Open ${mm.cap}`}
          >
            <span className="tape -top-3 left-1/2" style={{ transform: `translateX(-50%) rotate(${-rots[i] * 1.5}deg)` }} />
            <img src={mm.src} alt={mm.cap} width={1600} height={1200} className="photo block aspect-[4/3] w-full object-cover" loading="lazy" />
            <div className="flex items-center justify-between px-1 pt-4">
              <span className="f-type text-[14px]">{mm.cap}</span>
              <span className="label !text-[10px] opacity-50">Open</span>
            </div>
          </button>
        ))}
      </div>

      {m && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={m.cap} onClick={close}>
          <div className="relative w-full max-w-[1100px]" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox__frame mx-auto">
              <img src={m.src} alt={m.cap} className="block max-h-[70vh] w-full object-contain" />
              <div className="mt-4 flex flex-wrap items-center justify-between gap-4 px-1">
                <div>
                  <p className="f-type text-[15px] text-[var(--ink)]">{m.cap}</p>
                  <p className="label mt-1 text-[var(--ink)]/50">
                    {String((idx ?? 0) + 1).padStart(2, "0")} / {String(MEMES.length).padStart(2, "0")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a href={m.src} download className="btn !px-4 !py-2.5 !text-[13px]">
                    Download
                  </a>
                  <a
                    href={`https://x.com/intent/post?text=${shareText}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn--orange !px-4 !py-2.5 !text-[13px]"
                  >
                    Post to X
                  </a>
                  <button type="button" onClick={close} className="btn !px-4 !py-2.5 !text-[13px]">
                    Close
                  </button>
                </div>
              </div>
            </div>
            <button type="button" className="lightbox__nav -left-2 sm:-left-8" onClick={() => step(-1)} aria-label="Previous">
              ‹
            </button>
            <button type="button" className="lightbox__nav -right-2 sm:-right-8" onClick={() => step(1)} aria-label="Next">
              ›
            </button>
          </div>
        </div>
      )}
    </>
  );
}
