"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";

/** Cold open: a typed case-file slate, a flashbulb, then the curtain lifts. Once per session. */
export default function Loader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("dh-open") === "1";
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) return;
    setShow(true);
    try {
      sessionStorage.setItem("dh-open", "1");
    } catch {}
  }, []);

  useEffect(() => {
    if (!show) return;
    document.documentElement.style.overflow = "hidden";
    const lines = gsap.utils.toArray<HTMLElement>(".loader__line");
    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.style.overflow = "";
        setShow(false);
      },
    });
    lines.forEach((el) => {
      const text = el.dataset.text || "";
      el.textContent = "";
      const chars = Array.from(text).map((c) => {
        const s = document.createElement("span");
        s.textContent = c;
        s.style.opacity = "0";
        el.appendChild(s);
        return s;
      });
      tl.to(chars, { opacity: 1, duration: 0.01, stagger: 0.022 }, "<+0.1");
    });
    tl.to(".loader__stamp", { opacity: 1, scale: 1, duration: 0.18, ease: "power4.in" }, "+=0.15")
      .to(".loader__flash", { opacity: 1, duration: 0.05 }, "+=0.25")
      .to(".loader__flash", { opacity: 0, duration: 0.5 })
      .to(".loader__slate", { opacity: 0, duration: 0.3 }, "<")
      .to(".loader", { yPercent: -100, duration: 0.7, ease: "power4.inOut" }, "<+0.1");
    return () => {
      tl.kill();
      document.documentElement.style.overflow = "";
    };
  }, [show]);

  if (!show) return null;
  return (
    <div className="loader" aria-hidden="true">
      <div className="loader__slate px-6 text-center">
        <p className="loader__line label text-[var(--mustard)]" data-text="Department of Diamond Hands" />
        <p className="loader__line f-type mt-4 text-[22px] uppercase tracking-[0.14em] sm:text-[30px]" data-text="Case file No. 001" />
        <p className="loader__line f-type mt-2 text-[15px] uppercase tracking-[0.14em] opacity-70 sm:text-[18px]" data-text="Subject: the anti-jeet memecoin" />
        <div className="mt-8 flex justify-center">
          <span className="loader__stamp stamp stamp--dark stamp--double !text-[22px] opacity-0 sm:!text-[30px]" style={{ transform: "rotate(-8deg) scale(2.2)" }}>
            Opened
          </span>
        </div>
      </div>
      <div className="loader__flash" />
    </div>
  );
}
