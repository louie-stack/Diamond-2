"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/** Cold open: a film leader. Count, flash, the curtain lifts. Once per session. */
export default function Loader() {
  const [show, setShow] = useState(false);
  const num = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("dh-open") === "2";
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      opened();
      return;
    }
    setShow(true);
    try {
      sessionStorage.setItem("dh-open", "2");
    } catch {}
  }, []);

  useEffect(() => {
    if (!show) return;
    document.documentElement.style.overflow = "hidden";
    const o = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.style.overflow = "";
        setShow(false);
      },
    });
    tl.from(".loader__meta", { opacity: 0, y: 8, duration: 0.5, stagger: 0.08, ease: "expo.out" })
      .to(o, {
        v: 100, duration: 1.4, ease: "power2.inOut",
        onUpdate: () => {
          if (num.current) num.current.textContent = String(Math.round(o.v)).padStart(3, "0");
        },
      }, 0.1)
      .to(".loader__bar", { scaleX: 1, duration: 1.4, ease: "power2.inOut" }, 0.1)
      .fromTo(".loader__gem", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" }, 1.25)
      .to(".loader__flash", { opacity: 1, duration: 0.06 }, 1.75)
      .to(".loader__flash", { opacity: 0, duration: 0.6 }, 1.82)
      .to(".loader__inner", { opacity: 0, duration: 0.2 }, 1.8)
      .to(".loader", { yPercent: -100, duration: 0.9, ease: "expo.inOut" }, 1.95)
      .call(opened, [], 2.25);
    return () => {
      tl.kill();
      document.documentElement.style.overflow = "";
    };
  }, [show]);

  if (!show) return null;
  return (
    <div className="loader" aria-hidden="true">
      <div className="loader__inner wrap flex h-full flex-col justify-between py-8">
        <div className="flex justify-between">
          <span className="loader__meta meta text-[var(--bone)]/50">Department of Diamond Hands</span>
          <span className="loader__meta meta text-[var(--bone)]/50">Case #1027</span>
        </div>
        <div className="flex flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/art/case/logo.png" alt="" className="loader__gem h-[84px] w-[84px] opacity-0" />
        </div>
        <div>
          <div className="flex items-end justify-between">
            <span className="loader__meta meta text-[var(--bone)]/50">Opening the file</span>
            <span ref={num} className="loader__meta display text-[64px] leading-none text-[var(--lime)] tabular-nums">000</span>
          </div>
          <div className="mt-4 h-px bg-[var(--line-d)]">
            <div className="loader__bar h-px origin-left scale-x-0 bg-[var(--lime)]" />
          </div>
        </div>
      </div>
      <div className="loader__flash pointer-events-none absolute inset-0 bg-[#fbfff0] opacity-0" />
    </div>
  );
}

function opened() {
  const w = window as unknown as { __dhOpened?: boolean };
  if (w.__dhOpened) return;
  w.__dhOpened = true;
  window.dispatchEvent(new Event("dh:open"));
}
