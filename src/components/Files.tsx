import { LINKS, TOKENOMICS } from "@/content";
import { Diamond } from "./Diamond";
import CopyCA from "./CopyCA";
import Faq from "./Faq";
import MemeWall from "./MemeWall";
import { Tear } from "./Tear";

/* ---------------------------------------------------------------- */
/* Section 6. No tricks, as a declassified memo.                      */
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

export function Declassified() {
  return (
    <section id="contract" className="halftone scroll-mt-16 bg-[var(--paper-2)] py-24 lg:py-32">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
        <div className="relative" data-fx="rise">
          <span className="tape -top-4 left-10 rotate-[-6deg]" />
          <span className="tape -top-4 right-10 rotate-[5deg]" />
          <div className="panel relative px-6 py-10 sm:px-12 sm:py-14">
            {/* letterhead */}
            <div className="flex flex-wrap items-start justify-between gap-6 border-b-[3px] border-[var(--ink)] pb-6">
              <div className="flex items-center gap-4">
                <Diamond className="h-12 w-12" />
                <div>
                  <p className="f-slab text-[18px] uppercase leading-none">Department of Diamond Hands</p>
                  <p className="label mt-1 opacity-70">Office of the contract</p>
                </div>
              </div>
              <div className="f-type text-[13px] leading-relaxed opacity-80">
                <p>FILE: 001 / NO TRICKS</p>
                <p>RE: SUPPLY, ALLOCATION, CONTROLS</p>
                <p>STATUS: FIXED AT DEPLOY</p>
              </div>
            </div>

            <div className="pointer-events-none absolute right-6 top-24 sm:right-14 sm:top-28">
              <span className="stamp stamp--paper stamp--double !text-[24px] sm:!text-[34px]" data-fx="stamp" data-rot="-14" data-fx-delay="0.3">
                Declassified
              </span>
            </div>

            <span className="caption mt-10">Section 6. No tricks.</span>
            <h2 className="headline mt-5 text-[40px] sm:text-[56px] lg:text-[68px]">The rules apply to everyone.</h2>
            <p className="body mt-5 max-w-[680px]">
              A transfer restriction is only interesting if nobody can secretly change it. So $DIAMOND keeps it simple.
            </p>

            {/* the numbers */}
            <div className="mt-10 grid gap-[3px] border-[3px] border-[var(--ink)] bg-[var(--ink)] sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
              {[
                ["1,000,000,000", "$DIAMOND, fixed supply"],
                ["100%", "genesis liquidity"],
                ["0%", "team allocation"],
                ["0%", "presale"],
                ["0%", "transfer tax"],
              ].map(([v, k], i) => (
                <div key={k} className={`bg-[var(--cream)] px-5 py-6 ${i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}`} data-fx="rise" data-fx-delay={i * 0.06}>
                  <p className={`f-slab leading-none ${i === 0 ? "text-[34px] sm:text-[40px]" : "text-[44px]"}`}>
                    {i === 0 ? <span data-count="1000000000">0</span> : v}
                  </p>
                  <p className="label mt-2 opacity-70">{k}</p>
                </div>
              ))}
            </div>

            {/* the checklist */}
            <ul className="mt-10 grid gap-x-10 gap-y-3 sm:grid-cols-2">
              {NOS.map((t, i) => (
                <li key={t} className="flex items-start gap-3" data-fx="rise" data-fx-delay={i * 0.05}>
                  <span className="f-comic mt-[-2px] text-[28px] leading-none text-[var(--red)]">✗</span>
                  <span className="type text-[17px]">{t}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 border-[3px] border-dashed border-[var(--ink)]/50 px-5 py-5" data-fx="rise">
              <p className="label opacity-60">Owner privileges on file. Hover to unredact.</p>
              <dl className="type mt-3 grid gap-2 text-[16px] sm:grid-cols-2">
                {[
                  ["Adjustable sell limit", "None. Fixed at 1%."],
                  ["Adjustable cooldown", "None. Fixed at 24h."],
                  ["Holder whitelist", "None."],
                  ["Owner switch", "None. Nothing to flip."],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-wrap items-baseline gap-x-3">
                    <dt className="opacity-70">{k}:</dt>
                    <dd className="redact m-0" tabIndex={0}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <p className="f-type mt-10 text-[18px] uppercase tracking-[0.06em]" data-fx="type">
              Once live, the mechanism is the mechanism.
            </p>

            <div className="mt-12 flex flex-wrap items-end justify-between gap-8 border-t-[3px] border-dashed border-[var(--ink)] pt-10">
              <p className="headline text-[34px] sm:text-[46px]" data-fx="rise">
                Don&apos;t trust us.
                <br />
                <span className="text-[var(--orange)]">Read the contract.</span>
              </p>
              <div className="flex flex-wrap gap-4" data-fx="rise">
                <a href={LINKS.contract} className="btn btn--orange">Verified contract</a>
                <a href={LINKS.lpLock} className="btn">LP lock</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Section 7. A note from the detective.                              */
/* ---------------------------------------------------------------- */
export function Memo() {
  return (
    <section className="bg-[var(--ink)] py-24 text-[var(--cream)] lg:py-32">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-10">
        <div>
          <span className="caption" data-fx="rise">Section 7. A very important distinction.</span>
          <h2 className="poster poster--dark mt-6 text-[44px] sm:text-[64px] lg:text-[80px]" data-fx="slam">
            <span className="whitespace-nowrap">Anti-jeet</span> doesn&apos;t mean <span className="whitespace-nowrap">anti-sell.</span>
          </h2>
        </div>

        <div className="relative mx-auto w-full max-w-[560px]" data-fx="card" data-rot="1.5">
          {/* paper clip */}
          <svg viewBox="0 0 40 90" className="absolute -top-6 left-10 z-[2] h-[90px] w-[40px]" aria-hidden="true">
            <path d="M12 20v52a8 8 0 0 0 16 0V16a6 6 0 0 0-12 0v50a3 3 0 0 0 6 0V24" fill="none" stroke="#8a8a8a" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="lined bg-[var(--cream)] px-8 py-10 text-[var(--ink)] shadow-[10px_10px_0_var(--orange)] sm:px-10">
            <p className="f-type text-[13px] uppercase tracking-[0.18em] opacity-60">Memo. For the record.</p>
            <div className="type mt-6 space-y-[28px] text-[16px] leading-[28px]">
              <p>$DIAMOND does not guarantee the price goes up.</p>
              <p>It does not mean the market can only fall 1% per day.</p>
              <p>It does not prevent many different holders from selling.</p>
              <p>What it does is much simpler:</p>
            </div>
            <p className="headline mt-8 text-[30px] text-[var(--orange)] sm:text-[36px]">
              One wallet cannot dump a large bag all at once.
            </p>
            <p className="f-type mt-8 text-[18px]" data-fx="type">
              That&apos;s it. That&apos;s the experiment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Section 8. FAQ as an interrogation transcript.                     */
/* ---------------------------------------------------------------- */
export function Transcript() {
  return (
    <section className="halftone halftone--fade bg-[var(--paper)] py-24 lg:py-32">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="caption" data-fx="rise">Section 8. Interrogation transcript.</span>
            <h2 className="headline mt-6 text-[40px] sm:text-[56px] lg:text-[68px]" data-fx="rise">Questions for the suspect.</h2>
          </div>
          <p className="f-type text-[13px] uppercase leading-relaxed tracking-[0.12em] opacity-70" data-fx="rise">
            Recorded. Verbatim.
            <br />
            Subject: $DIAMOND
          </p>
        </div>

        <div className="mt-12" data-fx="rise">
          <Faq />
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Section 9. Tokenomics as tagged evidence.                          */
/* ---------------------------------------------------------------- */
export function Locker() {
  return (
    <section id="tokenomics" className="scroll-mt-16 bg-[#2a1a10] py-24 text-[var(--cream)] lg:py-32">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="caption" data-fx="rise">Section 9. Evidence locker.</span>
            <h2 className="poster poster--dark mt-6 text-[44px] sm:text-[64px] lg:text-[80px]" data-fx="slam">Simple on purpose.</h2>
          </div>
          <p className="label max-w-[260px] text-[var(--paper)]/60" data-fx="rise">
            Eight tags. Nothing hidden behind any of them.
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {TOKENOMICS.map((t, i) => (
            <div key={t.k} className="relative pt-6" data-fx="card" data-rot={(i % 3) - 1 + (i % 2 ? 0.6 : -0.4)} data-fx-delay={i * 0.06}>
              {/* string */}
              <span className="absolute left-1/2 top-0 h-6 w-px -translate-x-1/2 bg-[var(--paper)]/60" />
              <div className="tag-sway relative bg-[var(--manila)] px-6 pb-7 pt-8 text-[var(--ink)] shadow-[6px_8px_0_rgba(0,0,0,0.5)]">
                <span className="absolute left-1/2 top-3 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-[var(--ink)]/50 bg-[#2a1a10]" />
                <p className="label mt-2 opacity-70">{t.k}</p>
                <p className={`f-slab mt-3 leading-none ${t.v.length > 8 ? "text-[30px] lg:text-[32px]" : "text-[56px]"}`}>
                  {i === 0 ? <span data-count="1000000000">0</span> : t.v}
                </p>
                <p className="type mt-3 text-[14px] opacity-80">{t.s}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Section 10. Case closed.                                           */
/* ---------------------------------------------------------------- */
export function CaseClosed() {
  return (
    <section className="relative overflow-hidden bg-[#0f0c0a] py-28 text-[var(--cream)] lg:py-44">
      <div className="pointer-events-none absolute inset-0">
        <img
          src="/art/matrix.webp"
          alt=""
          data-parallax
          className="h-[120%] w-full object-cover object-[center_30%] opacity-[0.42] grayscale-[0.3]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_50%,rgba(15,12,10,0.2),rgba(15,12,10,0.95)_80%)]" />
        <div className="blinds opacity-60" />
      </div>

      <div className="relative mx-auto max-w-[1100px] px-4 text-center sm:px-6">
        <span className="caption" data-fx="rise">Section 10. Verdict.</span>
        <h2 className="poster poster--dark mt-8 text-[44px] sm:text-[72px] lg:text-[104px]" data-fx="slam">
          Paper hands were always a choice.
          <br />
          <span className="text-[var(--cyan)]">Not anymore.</span>
        </h2>
        <p className="body mx-auto mt-8 max-w-[600px] text-[var(--paper)]/80" data-fx="rise">
          The world&apos;s first anti-jeet memecoin. Built for an experiment crypto has spent years talking about but
          never enforcing:
        </p>
        <p className="f-comic mt-6 text-[36px] leading-none text-[var(--mustard)] sm:text-[52px]" data-fx="rise">
          Diamond hands. Enforced by code.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-4" data-fx="rise">
          <a href={LINKS.buy} className="btn btn--orange">Buy $DIAMOND</a>
          <a href={LINKS.dexscreener} className="btn btn--ghost">DexScreener</a>
          <a href={LINKS.x} className="btn btn--ghost">X</a>
          <a href={LINKS.telegram} className="btn btn--ghost">Telegram</a>
          <a href={LINKS.contract} className="btn btn--ghost">Verified contract</a>
        </div>
        <div className="mt-8 flex justify-center" data-fx="rise">
          <CopyCA center />
        </div>

        <div className="mt-16 flex justify-center">
          <span className="stamp stamp--dark stamp--double !text-[36px] sm:!text-[64px]" data-fx="stamp" data-rot="-7" data-fx-delay="0.3" data-confetti="1">
            Case closed
          </span>
        </div>
      </div>
      <Tear color="var(--paper)" className="absolute bottom-0 left-0 z-[2]" />
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Section 11. Memes, as surveillance photos.                         */
/* ---------------------------------------------------------------- */
export function Surveillance() {
  return (
    <section className="halftone halftone--fade overflow-hidden bg-[var(--paper)] py-24 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="caption" data-fx="rise">Section 11. Surveillance photos.</span>
            <h2 className="headline mt-6 text-[40px] sm:text-[56px] lg:text-[68px]" data-fx="rise">Built for the timeline.</h2>
          </div>
          <p className="body max-w-[360px]" data-fx="rise">
            Use them. Post them. Remix them. The $DIAMOND meme library is free for the community to use across socials.
          </p>
        </div>

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
    <footer className="relative overflow-hidden border-t-[3px] border-[var(--ink)] bg-[var(--ink)] pb-10 pt-14 text-[var(--cream)]">
      <div className="watermark pointer-events-none absolute -bottom-6 left-0 whitespace-nowrap text-[26vw] lg:text-[22vw]">$DIAMOND</div>
      <div className="relative mx-auto grid max-w-[1440px] gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:px-10">
        <div>
          <div className="flex items-center gap-3">
            <Diamond className="h-8 w-8" />
            <span className="f-slab text-[28px] uppercase leading-none">$DIAMOND</span>
          </div>
          <p className="f-comic mt-4 text-[26px] leading-none text-[var(--mustard)]">You can sell. You just can&apos;t jeet.</p>
          <div className="label mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[var(--paper)]/70">
            <a href={LINKS.contract} className="hover:text-[var(--cyan)]">Contract</a>
            <a href={LINKS.dexscreener} className="hover:text-[var(--cyan)]">DexScreener</a>
            <a href={LINKS.x} className="hover:text-[var(--cyan)]">X</a>
            <a href={LINKS.telegram} className="hover:text-[var(--cyan)]">Telegram</a>
          </div>
        </div>
        <div>
          <p className="type text-[13px] leading-relaxed text-[var(--paper)]/55">
            $DIAMOND is a memecoin and experimental token mechanism. Cryptocurrency is volatile and involves substantial
            risk. The anti-jeet mechanism restricts the rate at which individual addresses can move $DIAMOND; it does
            not guarantee price stability, liquidity, profitability, or protection against market losses.
          </p>
          <p className="label mt-6 text-[var(--paper)]/50">© 2026 Diamond Hands. Case file No. 001.</p>
        </div>
      </div>
      <p className="f-type relative mx-auto mt-16 max-w-[1440px] px-4 text-[12px] uppercase tracking-[0.2em] text-[var(--paper)]/35 sm:px-6 lg:px-10" data-fx="type">
        End of file. Hold the line.
      </p>
    </footer>
  );
}
