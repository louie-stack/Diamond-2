import { LINKS } from "@/content";
import CopyCA from "./CopyCA";
import { Tear } from "./Tear";

export default function Hero() {
  return (
    <section id="top" className="relative isolate min-h-[100svh] overflow-hidden bg-[#0f0c0a] text-[var(--cream)]">
      {/* The office. Mascot at the desk, blinds across the wall. */}
      <div className="absolute inset-0">
        <div
          className="hero-art absolute inset-x-0 bottom-0 top-16 bg-cover bg-[position:70%_top] lg:left-[10%] lg:bg-[position:left_top]"
          style={{ backgroundImage: "url(/art/briefcase.webp)" }}
        />
        <div className="hero-blinds blinds" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,12,10,0.98)_0%,rgba(15,12,10,0.92)_34%,rgba(15,12,10,0.35)_60%,rgba(15,12,10,0.05)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,12,10,0.7)_0%,transparent_25%,transparent_70%,rgba(15,12,10,0.95)_100%)]" />
        <div className="halftone absolute inset-0 opacity-70" />
        <div className="pointer-events-none absolute -right-[10%] top-0 h-[140%] w-[55%] rotate-[18deg] bg-[linear-gradient(90deg,transparent,rgba(232,181,59,0.10),transparent)] blur-2xl" />
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={`d${i}`}
            className="dust absolute h-[3px] w-[3px] rounded-full bg-[var(--mustard)]/70"
            style={{ left: `${45 + ((i * 37) % 50)}%`, top: `${10 + ((i * 53) % 80)}%`, opacity: 0.35 + (i % 4) * 0.12 }}
          />
        ))}
        {/* cigarette smoke */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="smoke absolute h-24 w-24 rounded-full bg-white/10 blur-2xl"
            style={{ left: `${58 + i * 3}%`, top: `${48 + i * 4}%` }}
          />
        ))}
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-end px-4 pb-14 pt-28 sm:px-6 lg:justify-center lg:px-10 lg:pb-24 lg:pt-28">
        <div className="hero-copy max-w-[760px]">
          <div className="mb-6 flex flex-wrap items-center gap-3" data-fx="rise">
            <span className="caption">Case file No. 001</span>
            <span className="label text-[var(--mustard)]">The world&apos;s first anti-jeet memecoin</span>
          </div>

          <h1 className="poster poster--dark text-[17vw] leading-[0.86] sm:text-[96px] lg:text-[124px]" data-fx="letters" data-fx-delay="0.1">
            <span className="word">Diamond</span>
            <br />
            <span className="word">Hands</span>
          </h1>

          <p className="f-comic mt-5 text-[30px] leading-none text-[var(--cyan)] sm:text-[38px]" data-fx="rise" data-fx-delay="0.15">
            What happens when jeeting is prohibited by smart contract?
          </p>

          <p className="body mt-5 max-w-[560px] text-[var(--paper)]/85" data-fx="rise" data-fx-delay="0.25">
            Buy freely. Sell from day one. But every wallet gets just one successful non-zero outbound transaction per
            rolling 24 hours, capped at 1% of its current holdings.
          </p>

          <div className="relative mt-7 inline-block" data-fx="rise" data-fx-delay="0.3">
            <div className="bubble !rounded-[6px] !bg-[var(--mustard)] !text-[32px] sm:!text-[40px]">
              You can sell.
              <br />
              You just can&apos;t jeet.
            </div>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-4" data-fx="rise" data-fx-delay="0.4">
            <a href={LINKS.buy} className="btn btn--orange">
              Buy $DIAMOND
            </a>
            <a href={LINKS.contract} className="btn btn--ghost">
              View contract
            </a>
          </div>

          <div className="mt-6" data-fx="rise" data-fx-delay="0.5">
            <CopyCA />
          </div>
        </div>

        {/* The stamp lands last. In the flow on phones, over the desk on desktop. */}
        <div className="mt-10 lg:hidden">
          <span className="stamp stamp--dark stamp--double !text-[18px] sm:!text-[24px]" data-fx="stamp" data-rot="-4" data-fx-delay="0.75">
            Diamond hands. Enforced by code.
          </span>
        </div>
        <div className="pointer-events-none absolute bottom-24 right-16 hidden lg:block">
          <span className="stamp stamp--dark stamp--double !text-[26px]" data-fx="stamp" data-rot="-9" data-fx-delay="0.75">
            Diamond hands. Enforced by code.
          </span>
        </div>
      </div>
      <div className="scroll-cue hidden lg:flex">
        <span className="label text-[var(--mustard)]">Scroll to open the file</span>
        <span className="scroll-cue__arrow" />
      </div>
      <Tear color="var(--mustard)" className="absolute bottom-0 left-0 z-[2]" />
    </section>
  );
}

export function Ticker() {
  const items = [
    "Buy freely",
    "Sell from day one",
    "Max 1% per outbound",
    "Rolling 24h cooldown",
    "No whale exceptions",
    "0% tax",
    "0% team",
    "100% genesis liquidity",
    "Read the contract",
  ];
  const row = [...items, ...items];
  return (
    <div className="ticker border-y-[3px] border-[var(--ink)] bg-[var(--mustard)] py-3">
      <div className="ticker__track">
        {row.map((t, i) => (
          <span key={i} className="f-cond flex items-center gap-5 pr-5 text-[16px] font-bold uppercase tracking-[0.14em]">
            {t}
            <span className="inline-block h-2.5 w-2.5 rotate-45 bg-[var(--ink)]" />
          </span>
        ))}
      </div>
    </div>
  );
}
