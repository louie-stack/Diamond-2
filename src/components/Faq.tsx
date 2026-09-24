"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FAQ, LINKS } from "@/content";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const bodies = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    bodies.current.forEach((el, i) => {
      if (!el) return;
      const inner = el.firstElementChild as HTMLElement | null;
      const h = inner ? inner.offsetHeight : 0;
      gsap.to(el, { height: open === i ? h : 0, duration: 0.45, ease: "power3.inOut" });
    });
  }, [open]);

  return (
    <div className="redline border-[3px] border-[var(--ink)] bg-[var(--cream)] shadow-[8px_8px_0_var(--ink)]">
      {FAQ.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className={`faq-item border-b-[3px] border-[var(--ink)] last:border-b-0 ${isOpen ? "is-open" : ""}`}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-start gap-5 px-5 py-6 pl-12 text-left hover:bg-[var(--paper)] sm:px-8 sm:pl-14"
            >
              <span className="f-type mt-1 w-12 shrink-0 text-[13px] uppercase tracking-[0.1em] text-[var(--red)]">
                Q.{String(i + 1).padStart(2, "0")}
              </span>
              <span className="headline flex-1 text-[22px] sm:text-[28px]">{f.q}</span>
              <span className="faq-mark f-cond mt-[-2px] text-[34px] font-black leading-none">+</span>
            </button>
            <div ref={(el) => { bodies.current[i] = el; }} className="faq-body" style={{ height: i === 0 ? "auto" : 0 }}>
              <div className="px-5 pb-8 pl-12 sm:px-8 sm:pl-14">
                <div className="flex gap-5">
                  <span className="f-type mt-1 w-12 shrink-0 text-[13px] uppercase tracking-[0.1em] opacity-60">A.</span>
                  <div className="flex-1">
                    <p className="type max-w-[720px] text-[17px]">{f.a}</p>
                    {f.cta && (
                      <a href={LINKS.contract} className="btn btn--orange mt-6">
                        View contract
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
