"use client";

import { useEffect, useState } from "react";
import { LINKS, NAV } from "@/content";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const ids = NAV.filter((n) => n.href.startsWith("#")).map((n) => n.href.slice(1));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
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
  }, [open]);

  return (
    <>
      <header className={`nav ${solid || open ? "is-solid" : ""}`}>
        <div className="wrap flex h-[72px] items-center justify-between gap-6">
          <a href="#top" className="flex items-center gap-3" onClick={() => setOpen(false)} aria-label="Diamond Hands, back to top">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/art/case/logo.png" alt="" className="h-9 w-9" />
            <span className="display hidden whitespace-nowrap text-[22px] leading-none tracking-[0.01em] min-[400px]:inline">Diamond Hands</span>
          </a>

          <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary">
            {NAV.map((n) => (
              <a
                key={n.label}
                href={n.href}
                target={n.external ? "_blank" : undefined}
                rel={n.external ? "noreferrer" : undefined}
                className={`nav__link meta ${active && n.href === `#${active}` ? "is-active" : ""}`}
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href={LINKS.buy} className="btn btn--lime btn--sm hidden sm:inline-flex">
              Buy $DIAMOND
            </a>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className={`burger lg:hidden ${open ? "is-open" : ""}`}
            >
              <span className="flex flex-col">
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className={`drawer lg:hidden ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="wrap flex h-full flex-col pb-10 pt-28">
          <p className="meta text-[var(--bone)]/50">Case #1027. Index.</p>
          <nav className="mt-6 flex flex-col" aria-label="Mobile">
            {NAV.map((n, i) => (
              <a
                key={n.label}
                href={n.href}
                target={n.external ? "_blank" : undefined}
                rel={n.external ? "noreferrer" : undefined}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-5 border-b border-[var(--line-d)] py-4"
              >
                <span className="meta w-6 text-[var(--lime)]">{String(i + 1).padStart(2, "0")}</span>
                <span className="display text-[44px]">{n.label}</span>
              </a>
            ))}
          </nav>
          <div className="mt-auto flex flex-wrap gap-3">
            <a href={LINKS.buy} className="btn btn--lime" onClick={() => setOpen(false)}>
              Buy $DIAMOND <span className="btn__arrow" aria-hidden="true" />
            </a>
            <a href={LINKS.contract} className="btn btn--line" onClick={() => setOpen(false)}>
              View contract
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
