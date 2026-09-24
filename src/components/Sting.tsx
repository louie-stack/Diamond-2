"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { sfx } from "@/lib/sfx";

const START = 1_000_000;
const HOURS = 24;
const SPEED = 2.4; // simulated hours per real second
const fmt = (n: number) => n.toLocaleString("en-US");

type Line = { t: string; kind: "ok" | "deny" | "info" };

/** A wallet, a sell button, the rule. Try to jeet. */
export default function Sting() {
  const [balance, setBalance] = useState(START);
  const [elapsed, setElapsed] = useState<number | null>(null);
  const [log, setLog] = useState<Line[]>([
    { t: "Wallet loaded. 1,000,000 $DIAMOND. No cooldown. First outbound available now.", kind: "info" },
  ]);
  const [stamp, setStamp] = useState<{ text: string; kind: "deny" | "ok"; id: number } | null>(null);
  const [sells, setSells] = useState(0);
  const elapsedRef = useRef<number | null>(null);
  const balanceRef = useRef(START);
  const console_ = useRef<HTMLDivElement>(null);
  const logBox = useRef<HTMLDivElement>(null);
  const active = elapsed !== null;

  const max = Math.floor(balance / 100);
  const push = (l: Line) => setLog((prev) => [...prev.slice(-7), l]);

  useEffect(() => {
    if (!active) return;
    let id = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const e = Math.min(HOURS, (elapsedRef.current ?? 0) + dt * SPEED);
      elapsedRef.current = e;
      setElapsed(e);
      if (e >= HOURS) {
        elapsedRef.current = null;
        setElapsed(null);
        const b = balanceRef.current;
        push({ t: `24h elapsed. CLEAR. Limit recalculated from current balance: 1% of ${fmt(b)} = ${fmt(Math.floor(b / 100))}. Unused allowance did not carry over.`, kind: "ok" });
        sfx.ching();
        return;
      }
      id = requestAnimationFrame(step);
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [active]);

  useEffect(() => {
    if (logBox.current) logBox.current.scrollTop = logBox.current.scrollHeight;
  }, [log]);

  const shake = () => {
    if (console_.current) gsap.fromTo(console_.current, { x: 0 }, { x: 6, duration: 0.05, repeat: 6, yoyo: true, ease: "none", clearProps: "x" });
  };
  const deny = (why: string) => {
    setStamp({ text: "Denied", kind: "deny", id: Date.now() });
    push({ t: `DENIED. ${why}`, kind: "deny" });
    shake();
    sfx.buzz();
    sfx.thud();
  };
  const remaining = () => {
    const left = HOURS - (elapsedRef.current ?? 0);
    const h = Math.floor(left);
    const m = Math.floor((left - h) * 60);
    return `${h}h ${String(m).padStart(2, "0")}m`;
  };

  const sell = (amount: number, label: string) => {
    if (elapsedRef.current !== null) return deny(`Cooldown running. ${remaining()} remaining.`);
    if (amount > max) return deny(`That's a jeet. ${label} is ${fmt(amount)}. Max outbound is 1% = ${fmt(max)}.`);
    const next = balance - amount;
    balanceRef.current = next;
    setBalance(next);
    setSells((s) => s + 1);
    setStamp({ text: "Sold", kind: "ok", id: Date.now() });
    push({ t: `Sold ${fmt(amount)} (${label}). Balance ${fmt(next)}. Rolling 24h cooldown started.`, kind: "ok" });
    elapsedRef.current = 0;
    setElapsed(0);
    sfx.ching();
    sfx.thud();
  };
  const buy = (amount: number) => {
    const next = balance + amount;
    balanceRef.current = next;
    setBalance(next);
    push({
      t: `Received ${fmt(amount)}. Balance ${fmt(next)}. ${elapsedRef.current !== null ? "Cooldown unaffected." : "No cooldown started. Buying never starts one."}`,
      kind: "info",
    });
    sfx.ching();
  };
  const reset = () => {
    balanceRef.current = START;
    elapsedRef.current = null;
    setBalance(START);
    setElapsed(null);
    setSells(0);
    setStamp(null);
    setLog([{ t: "Wallet reset. 1,000,000 $DIAMOND. No cooldown.", kind: "info" }]);
    sfx.flip();
  };

  const angle = ((elapsed ?? 0) / HOURS) * 360;
  const left = HOURS - (elapsed ?? 0);
  const lh = Math.floor(left);
  const lm = Math.floor((left - lh) * 60);

  return (
    <section id="sting" className="relative overflow-hidden bg-[#1b1411] py-24 text-[var(--cream)] lg:py-32">
      <div className="scan pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="caption" data-fx="rise">Interlude. The sting.</span>
            <h2 className="poster poster--dark mt-6 text-[52px] sm:text-[72px] lg:text-[96px]" data-fx="slam">
              Try to jeet.
            </h2>
          </div>
          <p className="body max-w-[380px] text-[var(--paper)]/75" data-fx="rise">
            A wallet. A sell button. The rule. Go on. The demo clock runs at 24 hours in ten seconds.
          </p>
        </div>

        <div ref={console_} className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_1fr]" data-fx="rise">
          {/* Wallet console */}
          <div className="panel panel--dark relative overflow-visible p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="label text-[var(--paper)]/60">Wallet 0xD1A...0ND</p>
                <p className="f-slab mt-2 text-[40px] leading-none sm:text-[56px]">{fmt(balance)}</p>
                <p className="label mt-1 text-[var(--mustard)]">$DIAMOND held</p>
              </div>
              <div className="text-right">
                <p className="label text-[var(--paper)]/60">Max next outbound</p>
                <p className="f-slab mt-2 text-[40px] leading-none text-[var(--cyan)] sm:text-[56px]">{fmt(max)}</p>
                <p className="label mt-1 text-[var(--paper)]/60">1% of current bag</p>
              </div>
            </div>

            <div className="mt-8 border-t-[3px] border-dashed border-[var(--cream)]/30 pt-8">
              <p className="label text-[var(--paper)]/60">Outbound</p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <button type="button" onClick={() => sell(Math.floor(balance / 500), "0.2%")} className="btn btn--ghost">
                  Sell 0.2%
                </button>
                <button type="button" onClick={() => sell(max, "1%")} className="btn btn--orange">
                  Sell 1% (max)
                </button>
                <button type="button" onClick={() => sell(balance, "your whole bag")} className="arcade" aria-label="Sell everything">
                  <span>Sell<br />all</span>
                </button>
              </div>
              <p className="label mt-6 text-[var(--paper)]/60">Inbound</p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <button type="button" onClick={() => buy(250_000)} className="btn">
                  Buy 250,000
                </button>
                <button type="button" onClick={reset} className="f-type text-[13px] uppercase tracking-[0.14em] text-[var(--paper)]/60 underline-offset-4 hover:text-[var(--cyan)] hover:underline">
                  Reset wallet
                </button>
              </div>
            </div>

            {stamp && (
              <span
                key={stamp.id}
                className={`sting-stamp stamp stamp--double ${stamp.kind === "deny" ? "stamp--dark" : "stamp--cyan"} !text-[40px] sm:!text-[64px]`}
              >
                {stamp.text}
              </span>
            )}
          </div>

          {/* Clock and transcript */}
          <div className="grid gap-8 sm:grid-cols-[auto_1fr] lg:grid-cols-1">
            <div className="flex items-center gap-6 sm:flex-col sm:items-start lg:flex-row lg:items-center">
              <svg viewBox="0 0 200 200" className="h-[150px] w-[150px] shrink-0 sm:h-[170px] sm:w-[170px]" aria-hidden="true">
                <circle cx="100" cy="100" r="92" fill="var(--cream)" stroke="var(--ink)" strokeWidth="6" />
                {Array.from({ length: 24 }).map((_, i) => {
                  const a = (i / 24) * Math.PI * 2 - Math.PI / 2;
                  const r1 = i % 6 === 0 ? 72 : 80;
                  return (
                    <line
                      key={i}
                      x1={100 + Math.cos(a) * r1}
                      y1={100 + Math.sin(a) * r1}
                      x2={100 + Math.cos(a) * 86}
                      y2={100 + Math.sin(a) * 86}
                      stroke="var(--ink)"
                      strokeWidth={i % 6 === 0 ? 4 : 2}
                    />
                  );
                })}
                {active && (
                  <path
                    d={describeArc(100, 100, 60, 0, angle)}
                    fill="none"
                    stroke="var(--orange)"
                    strokeWidth="14"
                    opacity="0.85"
                  />
                )}
                <line x1="100" y1="100" x2="100" y2="30" stroke="var(--red)" strokeWidth="5" strokeLinecap="round" transform={`rotate(${angle} 100 100)`} />
                <circle cx="100" cy="100" r="7" fill="var(--ink)" />
              </svg>
              <div>
                <p className="label text-[var(--paper)]/60">Cooldown clock</p>
                <p className={`f-slab mt-2 text-[36px] leading-none sm:text-[44px] ${active ? "text-[var(--orange)]" : "text-[var(--cyan)]"}`}>
                  {active ? `${lh}h ${String(lm).padStart(2, "0")}m` : "Clear"}
                </p>
                <p className="type mt-2 text-[14px] text-[var(--paper)]/70">
                  {active ? "One outbound already used. Wait it out." : "Next outbound available now."}
                </p>
                <p className="label mt-3 text-[var(--paper)]/40">Sells this session: {sells}</p>
              </div>
            </div>

            <div className="lined relative border-[3px] border-[var(--ink)] bg-[var(--cream)] text-[var(--ink)] shadow-[8px_8px_0_var(--orange)]">
              <div className="flex items-center justify-between border-b-[3px] border-[var(--ink)] px-4 py-2">
                <span className="label">Transcript</span>
                <span className="label opacity-50">Recorded live</span>
              </div>
              <div ref={logBox} className="h-[224px] overflow-y-auto px-4 py-3">
                {log.map((l, i) => (
                  <p
                    key={i}
                    className={`f-type text-[14px] leading-[28px] ${l.kind === "deny" ? "text-[var(--red)]" : l.kind === "ok" ? "text-[var(--ink)]" : "text-[var(--ink)]/65"}`}
                  >
                    <span className="mr-2 opacity-50">{String(i + 1).padStart(2, "0")}</span>
                    {l.t}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function describeArc(cx: number, cy: number, r: number, start: number, end: number) {
  const s = ((start - 90) * Math.PI) / 180;
  const e = ((Math.min(end, 359.99) - 90) * Math.PI) / 180;
  const large = end - start > 180 ? 1 : 0;
  return `M ${cx + r * Math.cos(s)} ${cy + r * Math.sin(s)} A ${r} ${r} 0 ${large} 1 ${cx + r * Math.cos(e)} ${cy + r * Math.sin(e)}`;
}
