import { LINKS, TOKENOMICS } from "@/content";
import CopyCA from "./CopyCA";
import Faq from "./Faq";
import MemeWall from "./MemeWall";
import SceneBg from "./SceneBg";
import SecHead, { Idx } from "./SecHead";
import Rip from "./Rip";

/* ---------------------------------------------------------------- */
/* 05. No tricks. A declassified dossier.                             */
/* ---------------------------------------------------------------- */
const NOS = [
  "No hidden mint.",
  "No blacklist.",
  "No adjustable sell limit.",
  "No adjustable cooldown.",
  "No privileged holder whitelist.",
  "No owner switch that can change the rules later.",
  "No permanent exemption for the deployer.",
];

const Cross = () => (
  <svg viewBox="0 0 12 12" className="mt-[7px] h-3 w-3 shrink-0" aria-hidden="true">
    <path d="M1 1l10 10M11 1L1 11" stroke="var(--red)" strokeWidth="2" />
  </svg>
);

export function Declassified() {
  return (
    <section id="contract" className="sec sec--paper scroll-mt-16">
      <Rip color="var(--paper)" seed={3} />
      <div className="wrap">
        <Idx n="05" label="No tricks" />

        <div className="relative mx-auto mt-14 max-w-[1180px] bg-[var(--bone)] shadow-[0_1px_0_var(--line-l),0_40px_80px_-30px_rgba(20,17,10,0.35)]">
          {/* the dossier photo */}
          <div className="vf relative overflow-hidden bg-black" data-fx="img">
            <span className="vf__b" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/art/case/banner.webp" alt="A redacted case file beside a glowing lime diamond." className="block aspect-[3/1] w-full object-cover" loading="lazy" />
          </div>

          <div className="px-6 pb-12 pt-10 sm:px-14 sm:pb-16">
            <div className="flex flex-wrap items-start justify-between gap-6 border-b border-[var(--line-l)] pb-7">
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/art/case/logo.png" alt="" className="h-12 w-12" />
                <div>
                  <p className="display text-[22px] leading-none">Department of Diamond Hands</p>
                  <p className="meta mt-1.5 opacity-50">Office of the contract</p>
                </div>
              </div>
              <div className="meta space-y-1 opacity-60 sm:text-right">
                <p>File: 001 / No tricks</p>
                <p>Re: Supply, allocation, controls</p>
                <p>Status: Fixed at deploy</p>
              </div>
            </div>

            <div className="relative">
              <span className="stamp pointer-events-none absolute right-0 top-8 !text-[18px] sm:!text-[26px]" data-fx="stamp" data-rot="-10" data-fx-delay="0.3">
                Declassified
              </span>
              <h2 className="display h-m mt-12 max-w-[780px] pr-24" data-fx="lines">The rules apply to everyone.</h2>
              <p className="body-l mt-6 max-w-[640px] opacity-75" data-fx="rise">
                A transfer restriction is only interesting if nobody can secretly change it. So $DIAMOND keeps it simple.
              </p>
            </div>

            <div className="mt-12 grid gap-px border border-[var(--line-l)] bg-[var(--line-l)] sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
              {[
                ["1,000,000,000", "$DIAMOND, fixed supply"],
                ["100%", "genesis liquidity"],
                ["0%", "team allocation"],
                ["0%", "presale"],
                ["0%", "transfer tax"],
              ].map(([v, k], i) => (
                <div key={k} className={`bg-[var(--bone)] px-5 py-6 ${i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}`} data-fx="rise" data-fx-delay={i * 0.06}>
                  <p className="display text-[clamp(36px,3.4vw,52px)] leading-none tabular-nums">
                    {i === 0 ? <span data-count="1000000000">{v}</span> : v}
                  </p>
                  <p className="meta mt-3 opacity-55">{k}</p>
                </div>
              ))}
            </div>

            <ul className="mt-12 grid gap-x-12 gap-y-4 sm:grid-cols-2">
              {NOS.map((t, i) => (
                <li key={t} className="flex items-start gap-4 border-b border-[var(--line-l)] pb-4" data-fx="rise" data-fx-delay={i * 0.04}>
                  <Cross />
                  <span className="text-[17px]">{t}</span>
                </li>
              ))}
            </ul>

            <div className="mt-12 border border-dashed border-[var(--ink)]/30 p-6" data-fx="rise">
              <p className="meta opacity-50">Owner privileges on file. Hover to unredact.</p>
              <dl className="mono mt-4 grid gap-3 text-[14px] sm:grid-cols-2">
                {[
                  ["Adjustable sell limit", "None. Fixed at 1%."],
                  ["Adjustable cooldown", "None. Fixed at 24h."],
                  ["Holder whitelist", "None."],
                  ["Owner switch", "None. Nothing to flip."],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-wrap items-baseline gap-x-3">
                    <dt className="opacity-60">{k}:</dt>
                    <dd className="redact m-0" tabIndex={0}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <p className="mono mt-12 text-[15px] uppercase tracking-[0.12em]" data-fx="rise">Once live, the mechanism is the mechanism.</p>

            <div className="mt-12 flex flex-wrap items-end justify-between gap-8 border-t border-[var(--line-l)] pt-10">
              <p className="display h-s" data-fx="lines">
                Don&apos;t trust us.
                <br />
                <span className="text-[var(--red)]">Read the contract.</span>
              </p>
              <div className="flex flex-wrap gap-3" data-fx="rise">
                <a href={LINKS.contract} className="btn btn--ink">Verified contract <span className="btn__arrow" aria-hidden="true" /></a>
                <a href={LINKS.lpLock} className="btn btn--line-ink">LP lock</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* 06. A very important distinction.                                  */
/* ---------------------------------------------------------------- */
export function Memo() {
  return (
    <section className="sec bg-[var(--night)]">
      <Rip color="var(--paper)" seed={17} inside />
      <div className="wrap">
        <Idx n="06" label="A very important distinction" />
        <h2 className="display h-l mt-12 max-w-[1400px]" data-fx="lines">
          Anti-jeet doesn&apos;t mean <span className="text-[var(--lime)]">anti-sell.</span>
        </h2>

        <div className="mt-14 grid items-center gap-10 lg:mt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <figure className="relative m-0 rotate-[-1.5deg] bg-[var(--bone)] p-2.5 pb-3.5 shadow-[0_30px_60px_rgba(0,0,0,0.5)]" data-fx="rise">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/art/case/autopsy.webp" alt="The autopsy: cause of death, rug pull." className="block aspect-[16/10] w-full object-cover" loading="lazy" />
            <figcaption className="meta mt-3 flex justify-between px-1 !text-[10px] text-[var(--ink)]/60">
              <span>Exhibit: autopsy</span>
              <span>Chart R.I.P.</span>
            </figcaption>
          </figure>

          <div className="relative bg-[var(--paper)] p-8 text-[var(--ink)] sm:p-11" data-fx="rise" data-fx-delay="0.1">
            <div className="flex items-center justify-between border-b border-[var(--line-l)] pb-4">
              <p className="meta opacity-60">Memo. For the record.</p>
              <span className="meta opacity-40">Ref. 1027</span>
            </div>
            <div className="term mt-6 space-y-3 text-[16px] leading-relaxed">
              <p>$DIAMOND does not guarantee the price goes up.</p>
              <p>It does not mean the market can only fall 1% per day.</p>
              <p>It does not prevent many different holders from selling.</p>
              <p>What it does is much simpler:</p>
            </div>
            <p className="display mt-7 text-[clamp(32px,2.8vw,44px)] leading-[1] text-[var(--red)]">One wallet cannot dump a large bag all at once.</p>
            <p className="term mt-6 text-[15px] uppercase tracking-[0.08em]">&gt; That&apos;s it. That&apos;s the experiment.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* 07. FAQ, as a transcript.                                          */
/* ---------------------------------------------------------------- */
export function Transcript() {
  return (
    <section className="sec sec--light">
      <Rip color="var(--bone)" seed={5} />
      <div className="wrap">
        <SecHead
          n="07"
          label="Interrogation transcript"
          title="Got questions?"
          aside={<>Recorded. Verbatim.<br />Subject: $DIAMOND</>}
        />
        <div className="mt-16 lg:mt-20" data-fx="rise">
          <Faq />
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* 08. Tokenomics. The evidence locker.                               */
/* ---------------------------------------------------------------- */
export function Locker() {
  return (
    <section id="tokenomics" className="sec sec--night2 scroll-mt-16 overflow-hidden">
      <Rip color="var(--bone)" seed={21} inside />
      <SceneBg src="/art/case/lineup.webp" tone="var(--night-2)" height="min(80vh, 780px)" opacity={0.42} position="center 30%" />
      <div className="wrap relative">
        <SecHead n="08" label="Evidence locker" title="Simple on purpose." aside="Eight tags. Nothing hidden behind any of them." />

        <div className="mt-16 grid border-l border-t border-[var(--line-d)] sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {TOKENOMICS.map((t, i) => (
            <div
              key={t.k}
              className="group flex min-h-[230px] flex-col justify-between border-b border-r border-[var(--line-d)] p-7 transition-colors duration-500 hover:bg-[var(--lime)] hover:text-[var(--ink)] sm:p-8"
              data-fx="rise"
              data-fx-delay={(i % 4) * 0.06}
            >
              <div className="flex items-start justify-between">
                <p className="meta opacity-60">{t.k}</p>
                <span className="meta opacity-30">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div>
                <p className={`display mt-8 leading-none tabular-nums ${t.v.length > 8 ? "text-[clamp(36px,3vw,46px)]" : "text-[clamp(64px,6vw,96px)]"}`}>
                  {i === 0 ? <span data-count="1000000000">{t.v}</span> : t.v}
                </p>
                <p className="body-s mt-3 opacity-60">{t.s}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* 09. Verdict.                                                       */
/* ---------------------------------------------------------------- */
export function CaseClosed() {
  return (
    <section className="relative overflow-hidden bg-black py-[clamp(110px,12vw,180px)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/art/case/crime-scene.webp" alt="" data-parallax="10" className="absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover object-[center_40%] opacity-[0.38]" loading="lazy" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_50%,rgba(0,0,0,0.25),rgba(0,0,0,0.95)_85%)]" />
      </div>

      <div className="wrap relative text-center">
        <div className="mx-auto max-w-[420px]">
          <div className="idx meta justify-center" data-fx="rise">
            <span className="idx__rule" />
            <span className="idx__n">09</span>
            <span>Verdict</span>
            <span className="idx__rule" />
          </div>
        </div>
        <h2 className="display mx-auto mt-10 max-w-[1300px] text-[clamp(36px,4.6vw,80px)] leading-[1]" data-fx="lines">
          <span className="block lg:whitespace-nowrap">Paper hands were always a choice.</span>
          <span className="mt-2 block text-[var(--lime)]">Not anymore.</span>
        </h2>

        <p className="term mt-7 text-[clamp(18px,1.7vw,24px)] uppercase tracking-[0.08em] text-[var(--lime)]" data-fx="type">&gt; Diamond hands. Enforced by code.</p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4" data-fx="rise">
          <a href={LINKS.buy} className="btn btn--lime">Buy $DIAMOND <span className="btn__arrow" aria-hidden="true" /></a>
          <span className="meta flex gap-6 text-[var(--bone)]/60">
            <a href={LINKS.dexscreener} className="link-u hover:text-[var(--bone)]">DexScreener</a>
            <a href={LINKS.x} className="link-u hover:text-[var(--bone)]">X</a>
            <a href={LINKS.telegram} className="link-u hover:text-[var(--bone)]">Telegram</a>
            <a href={LINKS.contract} className="link-u hover:text-[var(--bone)]">Contract</a>
          </span>
        </div>
        <div className="mt-8 flex justify-center" data-fx="rise">
          <CopyCA center />
        </div>
        <div className="mt-12 flex justify-center">
          <span className="stamp stamp--lime !border-[3px] !text-[22px] sm:!text-[30px]" data-fx="stamp" data-rot="-5" data-fx-delay="0.2">
            Case closed
          </span>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* 10. Memes, as surveillance photos.                                 */
/* ---------------------------------------------------------------- */
export function Surveillance() {
  return (
    <section className="sec sec--paper !py-[clamp(80px,8vw,120px)]">
      <Rip color="var(--paper)" seed={9} />
      <div className="wrap">
        <SecHead
          n="10"
          label="Surveillance photos"
          title="Built for the timeline."
          size="h-m"
          aside="Use them. Post them. Remix them. The $DIAMOND meme library is free for the community to use across socials."
        />
        <MemeWall />
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Footer.                                                             */
/* ---------------------------------------------------------------- */
export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[var(--night)] pt-24">
      <div className="wrap">
        <div className="grid gap-14 border-b border-[var(--line-d)] pb-16 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/art/case/logo.png" alt="" className="h-14 w-14" />
              <span className="display text-[40px] leading-none">$DIAMOND</span>
            </div>
            <p className="term mt-6 text-[clamp(17px,1.5vw,21px)] text-[var(--bone)]/85"><span className="text-[var(--lime)]">&gt;</span> You can sell. You just can&apos;t jeet.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="meta opacity-40">The file</p>
              <ul className="mt-4 space-y-2.5 text-[15px]">
                <li><a href="#rule" className="link-u">The 1% rule</a></li>
                <li><a href="#why" className="link-u">Why Diamond</a></li>
                <li><a href="#tokenomics" className="link-u">Tokenomics</a></li>
              </ul>
            </div>
            <div>
              <p className="meta opacity-40">On chain</p>
              <ul className="mt-4 space-y-2.5 text-[15px]">
                <li><a href={LINKS.contract} className="link-u">Contract</a></li>
                <li><a href={LINKS.dexscreener} className="link-u">DexScreener</a></li>
                <li><a href={LINKS.lpLock} className="link-u">LP lock</a></li>
              </ul>
            </div>
            <div>
              <p className="meta opacity-40">Socials</p>
              <ul className="mt-4 space-y-2.5 text-[15px]">
                <li><a href={LINKS.x} className="link-u">X</a></li>
                <li><a href={LINKS.telegram} className="link-u">Telegram</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="grid gap-8 py-10 lg:grid-cols-[1.2fr_1fr]">
          <p className="max-w-[640px] text-[13px] leading-relaxed text-[var(--bone)]/45">
            $DIAMOND is a memecoin and experimental token mechanism. Cryptocurrency is volatile and involves substantial risk.
            The anti-jeet mechanism restricts the rate at which individual addresses can move $DIAMOND; it does not guarantee
            price stability, liquidity, profitability, or protection against market losses.
          </p>
          <div className="meta flex flex-col gap-2 text-[var(--bone)]/40 lg:items-end">
            <span>© 2026 Diamond Hands. Case file No. 001.</span>
            <span>End of file. Hold the line.</span>
          </div>
        </div>
      </div>
      <p
        className="display pointer-events-none select-none whitespace-nowrap text-center text-[23vw] leading-[0.78] text-transparent [-webkit-text-stroke:1px_rgba(204,255,0,0.22)]"
        aria-hidden="true"
      >
        $DIAMOND
      </p>
    </footer>
  );
}
