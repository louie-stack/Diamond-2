"use client";

import { useEffect, useRef, useState } from "react";
import { LINKS, NAV } from "@/content";
import { Diamond } from "./Diamond";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState("");
  const bar = useRef<HTMLDivElement>(null);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.width = `${Math.min(100, (y / Math.max(1, max)) * 100)}%`;
      setHidden(y > 120 && y > lastY.current);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const ids = NAV.filter((n) => n.href.startsWith("#")).map((n) => n.href.slice(1));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className={`nav-bar fixed inset-x-0 top-0 z-[70] ${hidden && !open ? "is-hidden" : ""}`}>
        <div className="relative mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 border-b-[3px] border-[var(--ink)] bg-[var(--paper)] px-4 sm:px-6 lg:px-10">
          <a href="#top" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <Diamond className="h-7 w-7" />
            <span className="f-slab whitespace-nowrap text-[17px] uppercase leading-none tracking-tight sm:text-[20px]">Diamond Hands</span>
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV.map((n, i) => (
              <a
                key={n.label}
                href={n.href}
                target={n.external ? "_blank" : undefined}
                rel={n.external ? "noreferrer" : undefined}
                className={`nav-link f-cond flex items-baseline gap-1.5 text-[15px] font-bold uppercase tracking-[0.12em] hover:text-[var(--orange)] ${
                  active && n.href === `#${active}` ? "is-active" : ""
                }`}
              >
                <span className="nav-num f-type text-[10px] tracking-[0.1em] opacity-60">0{i + 1}</span>
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <a href={LINKS.buy} className="btn btn--orange !px-4 !py-2.5 !text-[14px]">
                Buy $DIAMOND
              </a>
            </div>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className={`burger flex h-11 w-11 flex-col items-center justify-center gap-[5px] border-[3px] border-[var(--ink)] bg-[var(--cream)] lg:hidden ${open ? "is-open" : ""}`}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
          <div ref={bar} className="nav-progress" />
        </div>
      </header>

      {/* Mobile drawer: a manila folder that drops down. */}
      <div className={`drawer lined lg:hidden ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="flex h-full flex-col px-6 pb-10 pt-24">
          <span className="caption self-start">Case file No. 001. Index.</span>
          <nav className="mt-8 flex flex-col">
            {NAV.map((n, i) => (
              <a
                key={n.label}
                href={n.href}
                target={n.external ? "_blank" : undefined}
                rel={n.external ? "noreferrer" : undefined}
                onClick={() => setOpen(false)}
                className="headline flex items-baseline gap-4 border-b-[3px] border-[var(--ink)] py-4 text-[34px]"
              >
                <span className="f-type text-[13px] text-[var(--red)]">0{i + 1}</span>
                {n.label}
              </a>
            ))}
          </nav>
          <div className="mt-auto flex flex-wrap gap-4">
            <a href={LINKS.buy} className="btn btn--orange" onClick={() => setOpen(false)}>
              Buy $DIAMOND
            </a>
            <a href={LINKS.contract} className="btn" onClick={() => setOpen(false)}>
              View contract
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
