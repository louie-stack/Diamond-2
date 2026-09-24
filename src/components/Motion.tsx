"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { sfx } from "@/lib/sfx";

gsap.registerPlugin(ScrollTrigger);

/**
 * One motion layer for the whole page. Elements opt in with data-fx:
 *   rise   - lifts in from below
 *   slam   - drops in from above, oversized, like a lobby card being thrown on the table
 *   stamp  - rubber stamp thump: big, transparent, then hits the paper
 *   card   - pinned card swings in (rotation held from inline style)
 *   draw   - SVG path draws itself (stroke-dasharray driven)
 *   type   - typewriter: reveals character by character
 *   flash  - camera flash burst, then settle
 * data-fx-delay="0.2" adds a delay in seconds.
 */
function burstConfetti(section: HTMLElement, origin: HTMLElement) {
  const r = origin.getBoundingClientRect();
  const sr = section.getBoundingClientRect();
  const cx = r.left - sr.left + r.width / 2;
  const cy = r.top - sr.top + r.height / 2;
  for (let i = 0; i < 26; i++) {
    const d = document.createElement("div");
    d.className = "confetti";
    const c = ["var(--cyan)", "var(--mustard)", "var(--orange)", "var(--cream)"][i % 4];
    d.innerHTML = `<svg viewBox="0 0 64 64" width="18" height="18"><path d="M14 10h36l10 16L32 58 4 26z" fill="${c}" stroke="#1a1410" stroke-width="4" stroke-linejoin="round"/></svg>`;
    d.style.left = `${cx}px`;
    d.style.top = `${cy}px`;
    section.appendChild(d);
    const a = (Math.PI * 2 * i) / 26 + Math.random() * 0.4;
    const v = 220 + Math.random() * 260;
    gsap.fromTo(d, { opacity: 1, scale: 0.6, rotation: 0 }, {
      x: Math.cos(a) * v, y: Math.sin(a) * v * 0.7 + 260, rotation: 360 + Math.random() * 360, scale: 1.2, opacity: 0,
      duration: 1.5 + Math.random() * 0.6, ease: "power2.out", onComplete: () => d.remove(),
    });
  }
}

export default function Motion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const lenis = reduce
      ? null
      : new Lenis({ lerp: 0.11, wheelMultiplier: 1, smoothWheel: true });
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    const onAnchor = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const el = document.querySelector<HTMLElement>(a.getAttribute("href") || "");
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el, { offset: -64, duration: 1.3 });
      else el.scrollIntoView({ behavior: "smooth" });
    };
    document.addEventListener("click", onAnchor);

    // Type "jeet" anywhere. The file objects.
    let buf = "";
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      buf = (buf + e.key.toLowerCase()).slice(-4);
      if (buf !== "jeet") return;
      buf = "";
      const egg = document.createElement("div");
      egg.className = "egg";
      egg.innerHTML = '<span class="stamp stamp--dark stamp--double" style="font-size:clamp(48px,12vw,160px)">Denied</span>';
      document.body.appendChild(egg);
      sfx.buzz(); sfx.thud();
      gsap.fromTo(egg.firstElementChild, { scale: 3, rotation: 4, opacity: 0 }, { scale: 1, rotation: -10, opacity: 1, duration: 0.28, ease: "power4.in" });
      gsap.fromTo(document.body, { x: 0 }, { x: 8, duration: 0.05, repeat: 7, yoyo: true, ease: "none", clearProps: "x", delay: 0.28 });
      gsap.to(egg, { opacity: 0, duration: 0.4, delay: 1.3, onComplete: () => egg.remove() });
    };
    window.addEventListener("keydown", onKey);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    const ctx = gsap.context(() => {
      if (reduce) return;

      const delayOf = (el: Element) => Number((el as HTMLElement).dataset.fxDelay || 0);
      const trig = (el: Element) => ({ trigger: el, start: "top 84%", once: true });

      gsap.utils.toArray<HTMLElement>("[data-fx='rise']").forEach((el) => {
        gsap.from(el, { y: 44, opacity: 0, duration: 0.9, ease: "power3.out", delay: delayOf(el), scrollTrigger: trig(el) });
      });

      gsap.utils.toArray<HTMLElement>("[data-fx='slam']").forEach((el) => {
        gsap.from(el, {
          y: -60, scale: 1.18, opacity: 0, duration: 0.55, ease: "power4.in", delay: delayOf(el),
          scrollTrigger: trig(el),
          onComplete: () => gsap.fromTo(el, { y: 6 }, { y: 0, duration: 0.25, ease: "elastic.out(1, 0.4)" }),
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-fx='stamp']").forEach((el) => {
        const rot = Number(el.dataset.rot || -8);
        gsap.set(el, { rotation: rot });
        const section = el.closest("section") as HTMLElement | null;
        gsap.from(el, {
          scale: 2.4, opacity: 0, rotation: rot + 6, duration: 0.32, ease: "power4.in", delay: delayOf(el),
          scrollTrigger: trig(el),
          onComplete: () => {
            sfx.thud();
            if (!section || el.dataset.shake === "off") return;
            gsap.fromTo(section, { x: 0 }, { x: 4, duration: 0.05, repeat: 5, yoyo: true, ease: "none", clearProps: "x" });
            if (el.dataset.confetti) burstConfetti(section, el);
          },
        });
      });

      // Counters: data-count="1000000000" counts up from 0 with locale commas.
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count || 0);
        const suffix = el.dataset.suffix || "";
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target, duration: 1.6, ease: "power3.out", delay: delayOf(el),
          scrollTrigger: trig(el),
          onUpdate: () => { el.textContent = Math.round(obj.v).toLocaleString("en-US") + suffix; },
        });
      });

      // Lamp: a slow swing.
      gsap.to(".lamp-cone", { rotation: 2.2, duration: 3.6, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 0%" });
      gsap.to(".lamp-wire", { rotation: 2.2, duration: 3.6, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 0%" });

      // Hero: the room leans a little with the pointer.
      const hero = document.querySelector<HTMLElement>("#top");
      if (hero && matchMedia("(pointer: fine)").matches) {
        const artX = gsap.quickTo(".hero-art", "x", { duration: 1.2, ease: "power3" });
        const artY = gsap.quickTo(".hero-art", "y", { duration: 1.2, ease: "power3" });
        const blX = gsap.quickTo(".hero-blinds", "x", { duration: 1.6, ease: "power3" });
        hero.addEventListener("pointermove", (e) => {
          const r = hero.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          artX(nx * -18); artY(ny * -10); blX(nx * 14);
        });
      }

      gsap.utils.toArray<HTMLElement>("[data-fx='card']").forEach((el, i) => {
        const rot = Number(el.dataset.rot || 0);
        gsap.set(el, { rotation: rot, transformOrigin: "50% 0%" });
        gsap.from(el, {
          rotation: rot + (i % 2 ? -14 : 14), y: -30, opacity: 0, duration: 1.1, ease: "elastic.out(1, 0.45)",
          delay: delayOf(el), scrollTrigger: trig(el),
        });
      });

      gsap.utils.toArray<SVGPathElement>("[data-fx='draw']").forEach((el) => {
        const len = el.getTotalLength();
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(el, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut", delay: delayOf(el), scrollTrigger: trig(el) });
      });

      gsap.utils.toArray<HTMLElement>("[data-fx='type']").forEach((el) => {
        const text = el.textContent || "";
        el.textContent = "";
        el.style.visibility = "visible";
        const spans = Array.from(text).map((ch) => {
          const s = document.createElement("span");
          s.textContent = ch;
          s.style.opacity = "0";
          el.appendChild(s);
          return s;
        });
        let shown = 0;
        gsap.to(spans, {
          opacity: 1, duration: 0.01, stagger: 0.028, delay: delayOf(el), scrollTrigger: trig(el),
          onUpdate() {
            const n = Math.floor(this.progress() * spans.length);
            if (n > shown) { shown = n; if (n % 2 === 0) sfx.tick(); }
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-fx='flash']").forEach((el) => {
        gsap.from(el, {
          opacity: 0, filter: "brightness(6) contrast(0.2)", duration: 0.7, ease: "power3.out", delay: delayOf(el),
          scrollTrigger: trig(el),
        });
      });

      // Letters: each character of each .word drops in like a lobby-card letter.
      gsap.utils.toArray<HTMLElement>("[data-fx='letters']").forEach((el) => {
        const chars: HTMLElement[] = [];
        el.querySelectorAll<HTMLElement>(".word").forEach((w) => {
          const text = w.textContent || "";
          w.textContent = "";
          Array.from(text).forEach((c) => {
            const sp = document.createElement("span");
            sp.className = "ch";
            sp.textContent = c;
            w.appendChild(sp);
            chars.push(sp);
          });
        });
        gsap.from(chars, {
          y: -90, rotation: () => gsap.utils.random(-14, 14), scale: 1.25, opacity: 0,
          duration: 0.55, ease: "power4.in", stagger: 0.045, delay: delayOf(el),
          onComplete: () => sfx.thud(),
        });
      });

      // Spin: the newspaper flies in spinning and lands at a slight angle.
      gsap.utils.toArray<HTMLElement>("[data-fx='spin']").forEach((el) => {
        gsap.from(el, {
          rotation: -900, scale: 0.05, opacity: 0, duration: 1.4, ease: "power3.out", delay: delayOf(el),
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onComplete: () => sfx.flip(),
        });
      });

      // Hero: copy drifts up and fades, mascot pushes in, as you scroll away.
      const heroSec = document.querySelector<HTMLElement>("#top");
      if (heroSec) {
        gsap.to(".hero-copy", { y: 140, opacity: 0, ease: "none", scrollTrigger: { trigger: heroSec, start: "top top", end: "bottom top", scrub: true } });
        gsap.to(".hero-art", { scale: 1.14, ease: "none", scrollTrigger: { trigger: heroSec, start: "top top", end: "bottom top", scrub: true } });
        gsap.to(".scroll-cue", { opacity: 0, ease: "none", scrollTrigger: { trigger: heroSec, start: "top top", end: "+=300", scrub: true } });
      }

      // Comic strip: on desktop the three panels scroll sideways while the strip is pinned.
      ScrollTrigger.matchMedia({
        "(min-width: 1024px)": () => {
          const strip = document.querySelector<HTMLElement>(".strip");
          const track = document.querySelector<HTMLElement>(".strip__track");
          if (!strip || !track) return;
          const dist = () => track.scrollWidth - window.innerWidth;
          gsap.to(track, {
            x: () => -dist(), ease: "none",
            scrollTrigger: { trigger: strip, start: "top top", end: () => "+=" + dist(), pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1 },
          });
        },
      });

      // Hero: the blinds shadow drifts, the mascot breathes.
      gsap.to(".hero-blinds", { xPercent: -3, yPercent: 2, duration: 14, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(".hero-art", { scale: 1.06, duration: 18, ease: "sine.inOut", yoyo: true, repeat: -1 });

      // Dust drifting in the light shaft.
      gsap.utils.toArray<HTMLElement>(".dust").forEach((el, i) => {
        gsap.to(el, { y: -30 - (i % 5) * 12, x: (i % 2 ? 1 : -1) * (8 + (i % 3) * 6), duration: 6 + (i % 4) * 2, ease: "sine.inOut", yoyo: true, repeat: -1, delay: i * 0.3 });
      });

      // Smoke wisps in the hero.
      gsap.utils.toArray<HTMLElement>(".smoke").forEach((el, i) => {
        gsap.to(el, {
          y: -140 - i * 40, x: (i % 2 ? 1 : -1) * 30, opacity: 0, scale: 1.8, duration: 7 + i * 1.5, ease: "sine.out",
          repeat: -1, delay: i * 2.1,
        });
      });

      // Interrogation spotlight follows the pointer.
      const spot = document.querySelector<HTMLElement>(".spot");
      if (spot) {
        const move = (e: PointerEvent) => {
          const r = spot.getBoundingClientRect();
          spot.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
          spot.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
        };
        spot.addEventListener("pointermove", move);
      }

      // Section-level parallax on the big dark photos.
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        gsap.fromTo(el, { yPercent: -8 }, {
          yPercent: 8, ease: "none",
          scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    });

    return () => {
      document.removeEventListener("click", onAnchor);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("load", onLoad);
      ctx.revert();
      lenis?.destroy();
    };
  }, []);

  return null;
}
