"use client";

import { useRef } from "react";
import { MEMES } from "@/content";

/** The meme library as a compact carousel. Each one downloads or posts. */
export default function MemeWall() {
  const track = useRef<HTMLDivElement>(null);
  const shareText = encodeURIComponent("You can sell. You just can't jeet. $DIAMOND, the world's first anti-jeet memecoin.");

  return (
    <div className="mt-10 -mx-[var(--gut)]">
      <div ref={track} className="memes">
        <div className="memes__track">
        {[...MEMES, ...MEMES].map((m, i) => (
          <figure key={i} className="meme group" aria-hidden={i >= MEMES.length}>
            <div className="relative overflow-hidden bg-[var(--ink)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.src} alt={m.cap} className="block aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
              <div className="absolute inset-x-0 bottom-0 flex gap-2 p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 max-md:opacity-100">
                <a href={m.src} download className="btn btn--lime btn--sm">Download</a>
                <a href={`https://x.com/intent/post?text=${shareText}`} target="_blank" rel="noreferrer" className="btn btn--sm bg-[var(--ink)] text-[var(--bone)]">Post</a>
              </div>
            </div>
            <figcaption className="term mt-3 text-[13px] uppercase tracking-[0.04em]">{m.cap}</figcaption>
          </figure>
        ))}
        </div>
      </div>
    </div>
  );
}
