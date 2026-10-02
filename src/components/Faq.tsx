"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FAQ, LINKS } from "@/content";
import { sfx } from "@/lib/sfx";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const bodies = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    bodies.current.forEach((el, i) => {
      if (!el) return;
      const inner = el.firstElementChild as HTMLElement | null;
      gsap.to(el, { height: open === i ? (inner?.offsetHeight ?? 0) : 0, duration: 0.6, ease: "expo.inOut" });
    });
  }, [open]);

  return (
    <div className="border-t border-[var(--ink)]">
      {FAQ.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className={`faq-item border-b border-[var(--line-l)] ${isOpen ? "is-open" : ""}`}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => {
                sfx.flip();
                setOpen(isOpen ? null : i);
              }}
              className="group grid w-full grid-cols-[56px_1fr_auto] items-center gap-4 py-7 text-left sm:grid-cols-[96px_1fr_auto] sm:py-8"
            >
              <span className="meta opacity-50">Q.{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[clamp(20px,2vw,28px)] font-medium leading-snug tracking-[-0.01em] transition-transform duration-500 group-hover:translate-x-1">
                {f.q}
              </span>
              <span className={`grid h-11 w-11 place-items-center border transition-colors duration-300 ${isOpen ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--lime)]" : "border-[var(--line-l)]"}`}>
                <span className="faq-mark" />
              </span>
            </button>
            <div
              ref={(el) => {
                bodies.current[i] = el;
              }}
              className="faq-body"
              style={{ height: i === 0 ? "auto" : 0 }}
            >
              <div className="grid grid-cols-[56px_1fr] gap-4 pb-9 sm:grid-cols-[96px_1fr]">
                <span className="meta opacity-50">A.</span>
                <div>
                  <p className="body-l max-w-[760px] opacity-80">{f.a}</p>
                  {f.cta && (
                    <a href={LINKS.contract} className="btn btn--ink mt-7">
                      View contract <span className="btn__arrow" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
