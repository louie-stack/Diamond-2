"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sfx } from "@/lib/sfx";

gsap.registerPlugin(ScrollTrigger);

const fmt = (s: number) => `0:${String(Math.floor(s)).padStart(2, "0")}`;

/**
 * The teaser. Plays muted on loop while on screen; "Play with sound" restarts it
 * with audio. The frame opens out to full bleed as it scrolls in.
 */
export default function Teaser() {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(23);

  // open out on scroll
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        frame.current,
        { clipPath: "inset(0% 6% 0% 6%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)", ease: "none",
          scrollTrigger: { trigger: frame.current, start: "top bottom", end: "top top", scrub: true },
        }
      );
      gsap.fromTo(video.current, { scale: 1.18 }, {
        scale: 1, ease: "none",
        scrollTrigger: { trigger: frame.current, start: "top bottom", end: "top top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // autoplay muted while in view; pause when it leaves
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.12 }
    );
    io.observe(v);
    const onTime = () => {
      setTime(v.currentTime);
      if (bar.current) bar.current.style.transform = `scaleX(${v.duration ? v.currentTime / v.duration : 0})`;
    };
    const onMeta = () => setDur(v.duration || 23);
    const onPlay = () => {
      setPlaying(true);
      sfx.duck(!v.muted);
    };
    const onPause = () => {
      setPlaying(false);
      sfx.duck(false);
    };
    const onVol = () => sfx.duck(!v.muted && !v.paused);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("volumechange", onVol);
    return () => {
      v.removeEventListener("volumechange", onVol);
      io.disconnect();
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, []);

  const withSound = useCallback(() => {
    const v = video.current;
    if (!v) return;
    v.currentTime = 0;
    v.muted = false;
    setMuted(false);
    v.play().catch(() => {});
  }, []);

  // the hero's "Watch the teaser" lands here and plays with sound
  useEffect(() => {
    const onGo = () => withSound();
    window.addEventListener("dh:teaser", onGo);
    return () => window.removeEventListener("dh:teaser", onGo);
  }, [withSound]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };
  const scrub = (e: React.PointerEvent<HTMLDivElement>) => {
    const v = video.current;
    if (!v || !v.duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    v.currentTime = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * v.duration;
  };
  const toggleMute = () => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };
  const full = () => {
    const v = video.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (!v) return;
    if (v.requestFullscreen) v.requestFullscreen().catch(() => {});
    else v.webkitEnterFullscreen?.();
  };

  return (
    <section id="teaser" ref={root} className="relative bg-[var(--night)]">
      <div ref={frame} className="teaser group relative overflow-hidden bg-black">
        <video
          ref={video}
          className="block aspect-video w-full object-cover md:aspect-auto md:h-[100svh]"
          poster="/video/teaser-poster.jpg"
          muted
          loop
          playsInline
          preload="auto"
          autoPlay
          aria-label="Diamond Hands teaser"
        >
          <source src="/video/teaser-720.mp4" type="video/mp4" media="(max-width: 900px)" />
          <source src="/video/teaser-1080.mp4" type="video/mp4" />
        </video>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_60%,rgba(0,0,0,0.65)_100%)]" />

        {muted && (
          <button type="button" onClick={withSound} className="teaser__cta" aria-label="Play the teaser with sound">
            <span className="play__icon !h-[72px] !w-[72px]" aria-hidden="true" />
            <span className="flex flex-col items-start leading-tight">
              <span className="text-[14px] font-semibold uppercase tracking-[0.14em]">Play with sound</span>
              <span className="meta mt-1 !text-[10px] text-[var(--bone)]/55">Teaser / 0:23</span>
            </span>
          </button>
        )}

        <div className="teaser__bar">
          <button type="button" onClick={toggle} className="trailer__btn" aria-label={playing ? "Pause" : "Play"}>
            {playing ? (
              <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M5 3v10M11 3v10" stroke="currentColor" strokeWidth="2" /></svg>
            ) : (
              <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M4 2.5l9 5.5-9 5.5z" fill="currentColor" /></svg>
            )}
          </button>
          <div className="teaser__track" onPointerDown={scrub} role="presentation">
            <span ref={bar} className="teaser__fill" />
          </div>
          <span className="meta tabular-nums text-[var(--bone)]/80">
            {fmt(time)} / {fmt(dur)}
          </span>
          <button type="button" onClick={toggleMute} className="trailer__btn" aria-label={muted ? "Unmute" : "Mute"}>
            {muted ? (
              <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M2 6h3l4-3v10l-4-3H2z" fill="currentColor" /><path d="M11 6l4 4M15 6l-4 4" stroke="currentColor" strokeWidth="1.4" /></svg>
            ) : (
              <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M2 6h3l4-3v10l-4-3H2z" fill="currentColor" /><path d="M11 5.5c1.2 1.2 1.2 3.8 0 5M12.8 3.8c2.2 2.2 2.2 6.2 0 8.4" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>
            )}
          </button>
          <button type="button" onClick={full} className="trailer__btn hidden sm:grid" aria-label="Fullscreen">
            <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
          </button>
        </div>
      </div>

    </section>
  );
}
