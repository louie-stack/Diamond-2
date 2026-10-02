"use client";

import { useEffect, useRef } from "react";
import { Idx } from "./SecHead";
import Rip from "./Rip";

/* ---------------------------------------------------------------- */
/* The chart                                                          */
/* ---------------------------------------------------------------- */
type Candle = { x: number; o: number; c: number; h: number; l: number; v: number };
const TOP = 70;
const BOT = 590;
function chart(seed: number, n: number, from: number, to: number, x0: number, step: number): Candle[] {
  let s = seed;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const rise = Math.abs(to - from) / n;
  const out: Candle[] = [];
  let price = from;
  for (let i = 0; i < n; i++) {
    const o = price;
    const down = rnd() < 0.24;
    const c = down ? o + 8 + rnd() * 20 : o - rise * (0.95 + rnd() * 0.9);
    out.push({ x: x0 + i * step, o, c, h: Math.min(o, c) - 5 - rnd() * 14, l: Math.max(o, c) + 5 + rnd() * 14, v: 0.25 + rnd() * 0.75 });
    price = c;
  }
  return out;
}
const A = chart(7, 24, 560, 150, 90, 48);
const B = chart(23, 24, 560, 80, 90, 48); // climbs as high as the first
const yToPrice = (y: number) => 0.0002 + ((BOT - y) / (BOT - TOP)) * 0.0098;

/** where each candle of the first chart flies when the whale hits (deterministic) */
const SCATTER = A.map((_, i) => {
  const f = (k: number) => Math.abs((Math.sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1);
  return { dx: (f(1) - 0.5) * 140, dy: 160 + f(2) * 220, rot: (f(3) - 0.5) * 160 };
});

function Candles({ data, cls, scatter }: { data: Candle[]; cls: string; scatter?: boolean }) {
  return (
    <g className={cls}>
      {data.map((d, i) => {
        const up = d.c < d.o;
        const col = up ? "var(--lime)" : "var(--red)";
        const sc = scatter ? SCATTER[i] : null;
        return (
          <g
            key={i}
            className="cndl"
            style={{
              ["--i" as string]: i,
              ["--j" as string]: data.length - i,
              ...(sc ? { ["--dx" as string]: `${sc.dx.toFixed(1)}px`, ["--dy" as string]: `${sc.dy.toFixed(1)}px`, ["--rot" as string]: `${sc.rot.toFixed(1)}deg` } : {}),
            }}
          >
            <line x1={d.x} x2={d.x} y1={d.h} y2={d.l} stroke={col} strokeWidth="2" />
            <rect x={d.x - 13} y={Math.min(d.o, d.c)} width="26" height={Math.max(4, Math.abs(d.o - d.c))} fill={col} />
            <rect x={d.x - 13} y={680 - d.v * 60} width="26" height={d.v * 60} fill={col} opacity="0.22" />
          </g>
        );
      })}
    </g>
  );
}

/* price readout per step: [price, the base it is measured from] */
const pA = yToPrice(A[A.length - 1].c);
const pB0 = yToPrice(B[0].o);
const pB = yToPrice(B[B.length - 1].c);
const PRICES: [number, number][] = [
  [yToPrice(A[0].o), yToPrice(A[0].o)],
  [pA, yToPrice(A[0].o)],
  [pA * 0.08, pA],
  [pB * 0.99, pB0],
  [pB * 0.99, pB0],
];

/**
 * Chapter one, staged as a crime scene. A tall track with a sticky stage.
 * Scroll sets data-step (0 to 4); every visual state lives in CSS and the
 * browser transitions between them. Only the typing and the price are JS.
 *   0  the claim            1  the pump
 *   2  the whale            3  the rule, the whale stopped at 1%
 *   4  the verdict
 */
export default function Crime() {
  const track = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const price = useRef<HTMLSpanElement>(null);
  const pct = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const st = stage.current;
    if (!st) return;
    let step = -1;
    let priceRaf = 0;
    let typeTimer = 0;
    let shown = PRICES[0][0];

    const paint = (p: number, base: number) => {
      shown = p;
      if (price.current) price.current.textContent = `$${p.toFixed(4)}`;
      if (pct.current) {
        const ch = (p / base - 1) * 100;
        pct.current.textContent = `${ch >= 0 ? "+" : ""}${ch.toFixed(1)}%`;
        pct.current.style.color = ch >= 0 ? "var(--lime)" : "var(--red)";
      }
    };
    const animatePrice = (n: number) => {
      cancelAnimationFrame(priceRaf);
      const [to, base] = PRICES[n];
      const from = shown;
      const t0 = performance.now();
      const dur = n === 2 ? 700 : 1500;
      const f = (t: number) => {
        const k = Math.min(1, (t - t0) / dur);
        const e = n === 2 ? k * k : 1 - Math.pow(1 - k, 3);
        paint(from + (to - from) * e, base);
        if (k < 1) priceRaf = requestAnimationFrame(f);
      };
      priceRaf = requestAnimationFrame(f);
    };
    const typeAct = (n: number, instant: boolean) => {
      clearInterval(typeTimer);
      const spans = Array.from(st.querySelectorAll<HTMLElement>(`.cr-act${n} .ty`));
      if (instant) {
        spans.forEach((s) => (s.textContent = s.dataset.text || ""));
        return;
      }
      spans.forEach((s) => (s.textContent = ""));
      let si = 0;
      let ci = 0;
      typeTimer = window.setInterval(() => {
        const s = spans[si];
        if (!s) return clearInterval(typeTimer);
        const text = s.dataset.text || "";
        ci += 2;
        s.textContent = text.slice(0, ci);
        if (ci >= text.length) {
          si++;
          ci = 0;
        }
      }, 28);
    };

    const setStep = (n: number) => {
      if (n === step) return;
      const back = n < step;
      step = n;
      st.dataset.step = String(n);
      if (n >= 1 && n <= 3) typeAct(n, back);
      animatePrice(n);
    };

    const check = () => {
      const el = track.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const p = -r.top / Math.max(1, el.offsetHeight - window.innerHeight);
      setStep(Math.min(4, Math.max(0, Math.floor(p * 5 + 0.35))));
    };
    paint(PRICES[0][0], PRICES[0][1]);
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      cancelAnimationFrame(priceRaf);
      clearInterval(typeTimer);
    };
  }, []);

  const lastA = A[A.length - 1];
  const lastB = B[B.length - 1];
  const whaleX = lastA.x + 48;
  const whale2X = lastB.x + 48;
  const FLOOR = lastB.c + 44;
  const whaleH = 610 - (lastA.c - 20);

  return (
    <section ref={track} className="crime" aria-label="Chapter one. The crime.">
      <div ref={stage} className="crime__stage" data-step="0">
        <div className="cr-frame">

          <div className="wrap relative z-[3] pt-[100px]">
            <Idx n="01" label="The crime" />
          </div>
          <div className="cr-steps" aria-hidden="true">
            <span className="meta">Scroll</span>
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className="cr-seg" data-n={i} />
            ))}
          </div>

          {/* the scene */}
          <div className="cr-chartwrap">
            <div className="cr-hud">
              <span className="meta text-[var(--bone)]/45">$CHART / USD</span>
              <span ref={price} className="display cr-price tabular-nums">$0.0000</span>
              <span ref={pct} className="term text-[15px] tabular-nums">+0.0%</span>
            </div>
            <svg className="cr-chart" viewBox="0 0 1600 700" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              <g>
                {[110, 230, 350, 470, 590].map((y) => (
                  <g key={y}>
                    <line x1="40" x2="1440" y1={y} y2={y} stroke="rgba(236,230,214,0.07)" />
                    <text x="1460" y={y + 5} fontSize="15" fill="rgba(236,230,214,0.35)" fontFamily="var(--font-term)">{yToPrice(y).toFixed(4)}</text>
                  </g>
                ))}
                {Array.from({ length: 15 }).map((_, i) => (
                  <line key={i} x1={40 + i * 100} x2={40 + i * 100} y1="60" y2="680" stroke="rgba(236,230,214,0.035)" />
                ))}
                <line x1="40" x2="1440" y1="682" y2="682" stroke="rgba(236,230,214,0.16)" />
              </g>

              <Candles data={A} cls="c1" scatter />
              <rect className="cr-whale" x={whaleX - 16} y={lastA.c - 20} width="32" height={whaleH} fill="var(--red)" />

              <g className="cr-floor">
                <line x1={lastB.x - 300} x2={whale2X + 120} y1={FLOOR} y2={FLOOR} stroke="var(--lime)" strokeWidth="2.5" strokeDasharray="10 7" />
                <text x={whale2X + 132} y={FLOOR + 6} fontSize="17" fill="var(--lime)" fontFamily="var(--font-term)" letterSpacing="2">1% FLOOR</text>
              </g>
              <Candles data={B} cls="c2" />
              <rect className="cr-whale2" x={whale2X - 16} y={lastB.c} width="32" height="380" fill="var(--red)" />
              <g className="cr-denied">
                <g transform={`rotate(-7 ${whale2X} ${FLOOR + 62})`}>
                  <rect x={whale2X - 86} y={FLOOR + 38} width="172" height="48" fill="none" stroke="var(--red)" strokeWidth="4" />
                  <text x={whale2X} y={FLOOR + 72} textAnchor="middle" fontSize="28" fontWeight="900" fill="var(--red)" fontFamily="var(--font-display)" letterSpacing="3">DENIED</text>
                </g>
              </g>
            </svg>
          </div>

          {/* one fixed slot, top left, cycling with the chart */}
          <div className="cr-act cr-act0">
            <h2 className="display cr-title">
              Diamond hands aren&apos;t just a promise <span className="text-[var(--lime)]">anymore.</span>
            </h2>
            <p className="term cr-k">Same story. Every chart. Every cycle. Until now.</p>
          </div>
          <div className="cr-act cr-act1">
            <p className="term cr-k">
              <span className="ty" data-text="Every memecoin tells holders the same thing:" />
            </p>
            <p className="term cr-head">
              <span className="ty" data-text="Don't jeet. Don't dump. " />
              <span className="ty text-[var(--lime)]" data-text="Hold the line." />
              <span className="caret" />
            </p>
          </div>
          <div className="cr-act cr-act2">
            <p className="term cr-head">
              <span className="ty" data-text="Then one whale hits sell and nukes the chart." />
              <span className="caret caret--red" />
            </p>
            <p className="term cr-k !text-[var(--red)]">
              <span className="ty" data-text="Narrator: they did not hold the line." />
            </p>
          </div>
          <div className="cr-act cr-act3">
            <p className="term cr-head">
              <span className="ty text-[var(--lime)]" data-text="$DIAMOND" />
              <span className="ty" data-text=" changes the rules." />
              <span className="caret" />
            </p>
            <p className="term cr-k">
              <span className="ty" data-text="Instead of asking people to have diamond hands, the mechanism is built directly into the token." />
            </p>
          </div>
          <div className="cr-act cr-act4">
            <p className="display cr-final__line">
              Buy as much as you want. Sell from day one.
              <br />
              <span className="text-[var(--red)]">But no wallet can dump its entire bag at once.</span>
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3">
              {["No promises.", "No pinky swears.", "No “trust the whales.”"].map((t) => (
                <span key={t} className="term text-[15px] uppercase tracking-[0.06em] text-[var(--bone)]/55">
                  <span className="strike">{t}</span>
                </span>
              ))}
              <span className="cr-code inline-flex items-center gap-3 bg-[var(--lime)] px-4 py-2 text-[var(--ink)]">
                <span className="term text-[14px]">&gt;</span>
                <span className="display text-[28px] leading-none">Just code.</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* the section's own torn bottom edge, laid over the next section */}
      <Rip color="var(--night)" fiber="#3d4034" seed={29} className="rip--bottom" />
    </section>
  );
}
