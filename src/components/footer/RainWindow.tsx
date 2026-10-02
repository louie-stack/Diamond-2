"use client";

import { useEffect, useRef, useState } from "react";
import { createGlass, type Glass } from "../hero/glass";
import { sfx } from "@/lib/sfx";
import { createStreet, ex, EXT, LIFE, WINDOWS } from "./street";
import { createLife } from "./life";

/**
 * The page ends where it started: rain on a window, the detective's office
 * this time. Across the street (street.ts, on Louie's painted plate) a neon
 * $DMND sign buzzes on the first time the window is seen, and the street lives
 * (life.ts, plus steam, rain, ripples and beacons in the shader). Wipe the
 * condensation (mouse, or a sideways swipe on a phone) to see it clearly; the
 * fog creeps back. The same glass shader as the hero.
 */
export default function RainWindow() {
  const box = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const flat = useRef<HTMLImageElement>(null);
  const [shut, setShut] = useState(false);
  const [tug, setTug] = useState(0);

  // the pull cord: a tug, a rattle of slats, and the blinds drop or rise
  const pull = () => {
    setShut((v) => !v);
    setTug((n) => n + 1);
    for (let i = 0; i < 9; i++) setTimeout(() => sfx.tick(), 60 + i * 55 + Math.random() * 20);
  };

  useEffect(() => {
    const el = box.current;
    const canvas = cv.current;
    if (!el || !canvas) return;
    let dead = false;
    let cleanup = () => {};

    (async () => {
      const display = getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim();
      const sil = new Image();
      sil.src = "/art/case/silhouette.png";
      const plate = new Image();
      plate.src = "/art/case/street.webp";
      await Promise.all([
        sil.decode().catch(() => null),
        plate.decode().catch(() => null),
        document.fonts?.load(`800 100px ${display}`).catch(() => null),
      ]);
      if (dead) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!plate.naturalWidth) return;
      const man = sil.complete && sil.naturalWidth ? sil : null;
      // phones get a lighter texture; the plate is cover-fit either way
      const street = createStreet(plate, man, el.clientWidth < 700 ? 1600 : 2560);
      const lit = Array.from({ length: street.letters }, () => 0);
      if (reduce) lit.fill(1);
      const paint = (fog = false) => {
        glass?.setImage(street.render(lit), fog);
        glass?.setNeon(street.neon);
      };

      const glass: Glass | null = createGlass(canvas, street.render(lit), { fogDetail: 3, rain: 0.8, life: true });
      if (!glass) {
        lit.fill(1);
        if (flat.current) flat.current.src = street.render(lit).toDataURL("image/webp", 0.85);
        el.classList.add("is-flat");
        return;
      }
      glass.setNeon(street.neon);
      const [tx0, ty0, tx1, ty1] = WINDOWS.tv;
      glass.setLife({
        steam: LIFE.steam.map(([sx, sy, sw, sh]) => [ex(sx), sy, sw / EXT, sh]) as typeof LIFE.steam,
        beacons: LIFE.beacons.map(([bx, by]) => [ex(bx), by]),
        street: LIFE.street,
        tv: [ex(tx0), ty0, ex(tx1), ty1],
      });
      const life = createLife(glass, street.plate);

      // framing: the painting is cover-fit. Centre it on the sign, keep the
      // top-floor windows just under the blinds, and tell the street where
      // the window ledge cuts it so a passing car's wheels hide behind it
      const frameUp = { focusY: 0.15 };
      const fit = () => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        const A = street.width / street.height;
        const blinds = h * 0.09 + 10;
        const sill = (el.querySelector(".rw-sill") as HTMLElement | null)?.offsetHeight ?? 24;
        if (w / h >= A) {
          const imgH = w / A;
          const v = h / imgH;
          const top = Math.min(1 - v, Math.max(0, 0.125 - blinds / imgH));
          frameUp.focusY = v < 1 ? top / (1 - v) : 0.5;
          life.setFloor(top + v * (1 - sill / h));
        } else {
          frameUp.focusY = 0.5;
          life.setFloor(1 - sill / h);
        }
      };
      fit();

      const timers: number[] = [];
      const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));

      // switch-on: letter by letter, each with a stutter, then the small line
      let on = reduce;
      const switchOn = () => {
        on = true;
        sfx.hum();
        let t = 0;
        lit.forEach((_, i) => {
          t += 140 + Math.random() * 120;
          at(t, () => ((lit[i] = 0.7), paint()));
          at(t + 50, () => ((lit[i] = 0), paint()));
          at(t + 110, () => ((lit[i] = 1), paint()));
        });
        // once it's all lit, refresh the fogged copy too
        at(t + 380, () => paint(true));
        at(t + 900, flicker);
      };
      // now and then one tube (the M) loses contact for a moment
      const flicker = () => {
        if (!seen) return void at(4000, flicker);
        const i = 2;
        const seq = [0.15, 1, 0, 0.8, 1];
        seq.forEach((v, k) => at(k * 60, () => ((lit[i] = v), paint())));
        at(3500 + Math.random() * 6500, flicker);
      };

      // the camera holds still; the rain, the street's small events and the light move
      const state = { flash: 0 };
      let raf = 0;
      let seen = false;
      let nextBolt = performance.now() + 5000;
      const t0 = performance.now();
      const loop = (now: number) => {
        const t = (now - t0) / 1000;
        if (!reduce && now > nextBolt) {
          state.flash = 0.4;
          nextBolt = now + 14000 + Math.random() * 14000;
        }
        state.flash *= 0.9;
        if (!reduce) life.tick(t);
        // the plate is cover-fit: keep the top-floor windows clear of the blinds
        glass.frame({ time: reduce ? 0 : t, clear: 0, flash: state.flash, zoom: 1, par: [0, 0], focus: 0.5, focusY: frameUp.focusY });
        raf = seen ? requestAnimationFrame(loop) : 0;
      };

      const io = new IntersectionObserver(
        ([e]) => {
          seen = e.isIntersecting;
          if (seen && !on && e.intersectionRatio > 0.3) switchOn();
          if (seen && !raf) raf = requestAnimationFrame(loop);
        },
        { threshold: [0, 0.35] },
      );
      io.observe(el);

      let last = { x: -1, y: -1 };
      const move = (e: PointerEvent) => {
        const steps = last.x < 0 ? 1 : Math.min(8, Math.ceil(Math.hypot(e.clientX - last.x, e.clientY - last.y) / 10));
        for (let i = 1; i <= steps; i++) {
          const x = last.x < 0 ? e.clientX : last.x + ((e.clientX - last.x) * i) / steps;
          const y = last.y < 0 ? e.clientY : last.y + ((e.clientY - last.y) * i) / steps;
          glass.wipeAt(x, y);
        }
        last = { x: e.clientX, y: e.clientY };
      };
      const leave = () => {
        last = { x: -1, y: -1 };
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      el.addEventListener("pointercancel", leave);

      const ro = new ResizeObserver(() => {
        glass.resize();
        fit();
      });
      ro.observe(el);

      cleanup = () => {
        cancelAnimationFrame(raf);
        timers.forEach(clearTimeout);
        io.disconnect();
        ro.disconnect();
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
        el.removeEventListener("pointercancel", leave);
        glass.destroy();
      };
    })();

    return () => {
      dead = true;
      cleanup();
    };
  }, []);

  return (
    <div ref={box} className="rain-window" aria-hidden="true">
      <canvas ref={cv} className="absolute inset-0 h-full w-full" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={flat} alt="" className="rain-window__flat" />
      <div className="rain-window__blend" />
      {/* the near side of the glass: always sharp, never fogged */}
      <div className="rw-frame">
        <div className={`rw-blinds ${shut ? "is-shut" : ""}`} />
        <button
          type="button"
          className="rw-cord"
          onClick={pull}
          aria-label={shut ? "Open the blinds" : "Close the blinds"}
          aria-pressed={shut}
        >
          <span key={tug} className={`rw-cord__line ${tug ? "is-tugged" : ""}`} />
        </button>
        <svg className="rw-hat" viewBox="0 0 200 84">
          <path className="rw-hat__crown" d="M48 60 C46 38 52 16 72 10 C84 6 92 14 100 14 C108 14 116 6 128 10 C148 16 154 38 152 60 Z" />
          <path className="rw-hat__band" d="M47 50 C80 56 120 56 153 50 L152 61 C120 66 80 66 48 61 Z" />
          <path className="rw-hat__brim" d="M4 66 C20 54 52 56 100 58 C148 56 180 54 196 66 C180 78 140 80 100 80 C60 80 20 78 4 66 Z" />
        </svg>
        <div className="rw-sill" />
      </div>
    </div>
  );
}
