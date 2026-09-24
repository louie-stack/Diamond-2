import { Burst } from "./Burst";
import { Diamond } from "./Diamond";
import Calculator from "./Calculator";
import { Tear } from "./Tear";

/* ---------------------------------------------------------------- */
/* Section 2. The idea, told as a three-panel strip.                  */
/* ---------------------------------------------------------------- */
export function TheCase() {
  return (
    <section className="halftone halftone--fade relative overflow-hidden bg-[var(--paper)] py-24 lg:py-32">
      <Tear color="#3b2414" className="absolute bottom-0 left-0 z-[2]" />
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="caption" data-fx="rise">Chapter one. The crime.</span>
            <h2 className="headline mt-6 max-w-[900px] text-[40px] sm:text-[56px] lg:text-[72px]" data-fx="rise" data-fx-delay="0.1">
              Diamond hands aren&apos;t just a promise anymore.
            </h2>
          </div>
          <p className="label max-w-[240px] opacity-70" data-fx="rise" data-fx-delay="0.2">
            Same story. Every chart. Every cycle. Until now.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
          {/* Panel 1 */}
          <div className="panel panel-hover lined relative flex min-h-[380px] flex-col justify-between p-6" data-fx="card" data-rot="-1.2">
            <span className="caption absolute -top-4 left-5 !text-[13px]">Panel 1</span>
            <p className="body pt-6">Every memecoin tells holders the same thing:</p>
            <div className="bubble mt-6 mb-6">
              Don&apos;t jeet.
              <br />
              Don&apos;t dump.
              <br />
              Hold the line.
            </div>
            <p className="label opacity-60">Narrator: they did not hold the line.</p>
          </div>

          {/* Panel 2 */}
          <div className="panel panel-hover panel--dark relative flex min-h-[380px] flex-col justify-between overflow-hidden p-6" data-fx="card" data-rot="1.4">
            <span className="caption absolute -top-4 left-5 !text-[13px]">Panel 2</span>
            <p className="body pt-6 text-[var(--paper)]">Then one whale hits sell and nukes the chart.</p>
            <svg viewBox="0 0 600 260" className="absolute inset-x-0 bottom-0 h-[62%] w-full" aria-hidden="true">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M40 0H0V40" fill="none" stroke="rgba(251,244,226,0.12)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="600" height="260" fill="url(#grid)" />
              <path
                data-fx="draw"
                d="M0 200 L60 170 L110 185 L160 120 L210 135 L260 80 L310 95 L360 40 L400 55 L430 50 L436 225 L470 232 L520 226 L600 240"
                fill="none"
                stroke="var(--cyan)"
                strokeWidth="5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
            <div className="pointer-events-none absolute left-6 top-24 rotate-[-12deg]" data-fx="slam" data-fx-delay="0.5">
              <span className="f-cond inline-block rounded-full border-[3px] border-[var(--ink)] bg-[var(--red)] px-4 py-2 text-[15px] font-black uppercase tracking-[0.1em] text-[var(--cream)] shadow-[0_5px_0_#5a0a0c]">
                Sell
              </span>
            </div>
            <span className="label absolute right-6 top-[46%] text-[var(--cyan)]/70">the whale</span>
            <div className="relative flex justify-end pr-2">
              <Burst size={46} fill="var(--red)">Nuked!</Burst>
            </div>
          </div>

          {/* Panel 3 */}
          <div className="panel panel-hover relative flex min-h-[380px] flex-col justify-between !bg-[var(--mustard)] p-6" data-fx="card" data-rot="-0.8">
            <span className="caption absolute -top-4 left-5 !bg-[var(--cream)] !text-[13px]">Panel 3</span>
            <div className="pt-6">
              <p className="f-comic text-[44px] leading-none">$DIAMOND changes the rules.</p>
              <p className="body mt-5">
                Instead of asking people to have diamond hands, the mechanism is built directly into the token.
              </p>
            </div>
            <div className="flex items-end justify-between">
              <span className="label opacity-70">Mechanism, not manners.</span>
              <Diamond className="h-20 w-20 text-[var(--ink)]" />
            </div>
          </div>
        </div>

        <div className="mt-24 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <p className="headline text-[34px] sm:text-[48px] lg:text-[60px]" data-fx="rise">
              Buy as much as you want.
              <br />
              Sell from day one.
              <br />
              <span className="text-[var(--orange)]">But no wallet can dump its entire bag at once.</span>
            </p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3" data-fx="rise" data-fx-delay="0.1">
              {["No promises.", "No pinky swears.", "No “trust the whales.”"].map((t) => (
                <span key={t} className="strike f-type text-[20px] opacity-80">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-center lg:justify-end" data-fx="slam" data-fx-delay="0.2">
            <Burst size={80} fill="var(--mustard)" color="var(--ink)">
              Just
              <br />
              code.
            </Burst>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Section 3. The 1% rule as an evidence board.                       */
/* ---------------------------------------------------------------- */
const EXHIBITS = [
  {
    tag: "Exhibit A",
    title: "Buy freely",
    lines: [
      "There is no buy cooldown.",
      "Buy 1 DIAMOND. Buy 1,000,000 DIAMOND. Buy 100,000,000 DIAMOND.",
      "Receiving $DIAMOND does not start or reset your cooldown.",
    ],
    rot: -2.5,
  },
  {
    tag: "Exhibit B",
    title: "Sell immediately",
    lines: ["Your first outbound transaction is available straight away.", "There is no initial 24-hour lock."],
    rot: 1.8,
  },
  {
    tag: "Exhibit C",
    title: "Max 1%",
    lines: ["Each successful non-zero outbound transaction can move a maximum of:", "1% of your current bag."],
    rot: -1.2,
    big: "1%",
  },
  {
    tag: "Exhibit D",
    title: "Then 24 hours",
    lines: [
      "Once you make a successful non-zero outbound transaction, a rolling 24-hour cooldown begins.",
      "Sell less than your maximum? The unused amount does not accumulate.",
      "After 24 hours, your limit is recalculated from your current balance.",
    ],
    rot: 2.2,
    big: "24h",
  },
];

export function EvidenceBoard() {
  return (
    <section id="rule" className="scroll-mt-16 bg-[#3b2414] py-6 lg:py-10">
      <div className="cork relative mx-3 border-[12px] border-[#4a2c14] shadow-[inset_0_0_80px_rgba(0,0,0,0.55)] sm:mx-6 lg:mx-10">
        <div className="relative mx-auto max-w-[1360px] px-4 py-20 sm:px-8 lg:px-12 lg:py-28">
          {/* Suspect photo, pinned top left */}
          <div className="absolute left-6 top-8 hidden w-[200px] lg:block xl:w-[230px]" data-fx="card" data-rot="-7">
            <span className="pin left-1/2 -top-2 -translate-x-1/2" />
            <div className="polaroid !pb-9">
              <img src="/art/precious.webp" alt="The suspect, holding a diamond." width={1600} height={900} className="photo block aspect-[4/3] w-full object-cover object-[20%_center]" loading="lazy" />
              <p className="scrawl mt-3 text-[26px]">the suspect</p>
            </div>
          </div>

          {/* Sticky note, top right */}
          <div className="absolute right-8 top-14 hidden w-[210px] lg:block" data-fx="card" data-rot="5">
            <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-[-3deg]" />
            <div className="sticky px-5 pb-6 pt-7">
              <p className="f-hand text-[26px] font-bold leading-[1.05]">1% per 24h.<br />No exceptions.<br />Not even whales!!</p>
              <p className="f-hand mt-3 text-[18px] opacity-70">(check the contract)</p>
            </div>
          </div>

          {/* Header card, pinned */}
          <div className="relative mx-auto mb-20 max-w-[820px] lg:mb-28" data-fx="card" data-rot="-1">
            <span className="pin left-1/2 -top-2 -translate-x-1/2" />
            <div className="panel !shadow-[10px_10px_0_rgba(0,0,0,0.45)] px-8 pb-8 pt-9 text-center">
              <span className="caption">Section 3. The 1% rule.</span>
              <h2 className="headline mt-5 text-[40px] sm:text-[60px] lg:text-[76px]">One rule changes the game.</h2>
              <p className="type mt-4 opacity-70">Four exhibits. One mechanism. No exceptions.</p>
            </div>
          </div>

          {/* String between the four pins (desktop) */}
          <div className="relative">
            <svg
              viewBox="0 0 1000 60"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-x-0 -top-2 z-[2] hidden h-[60px] w-full lg:block"
              aria-hidden="true"
            >
              <path
                data-fx="draw"
                d="M125 4 C 200 34, 300 34, 375 4 C 450 34, 550 34, 625 4 C 700 34, 800 34, 875 4"
                fill="none"
                stroke="var(--red)"
                strokeWidth="3"
              />
            </svg>

            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {EXHIBITS.map((e, i) => (
                <div key={e.tag} className="relative" data-fx="card" data-rot={e.rot} data-fx-delay={i * 0.08}>
                  <span className="pin left-1/2 -top-2 -translate-x-1/2" />
                  <div className="lined flex flex-col bg-[var(--cream)] lg:min-h-[420px] px-6 pb-6 pt-8 shadow-[6px_8px_0_rgba(0,0,0,0.45)]">
                    <span className="label text-[var(--red)]">{e.tag}</span>
                    <h3 className="headline mt-3 text-[34px] leading-[1]">{e.title}</h3>
                    {e.big && (
                      <div className="poster poster--flat mt-5 text-[84px] leading-none">{e.big}</div>
                    )}
                    <div className="mt-5 space-y-3">
                      {e.lines.map((l) => (
                        <p key={l} className="type text-[15px]">
                          {l}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* A worked example, on a polaroid-style note */}
          <div className="mt-20 flex justify-center lg:mt-28">
            <div className="relative w-full max-w-[640px]" data-fx="card" data-rot="1.5">
              <span className="tape -top-3 left-1/2 z-[2] -translate-x-1/2 rotate-[-4deg]" />
              <Calculator />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Section 4. Whales, as a mugshot and a lineup.                      */
/* ---------------------------------------------------------------- */
export function Wanted() {
  const rows = ["7'", "6'", "5'", "4'", "3'"];
  return (
    <section className="relative overflow-hidden bg-[#14110f] py-24 text-[var(--cream)] lg:py-32">
      <div className="scan pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid max-w-[1440px] gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20 lg:px-10">
        {/* Mugshot */}
        <div className="relative mx-auto w-full max-w-[560px]" data-fx="flash">
          <span className="label absolute -top-7 left-0 text-[var(--paper)]/50">Booking photo. Do not release.</span>
          <div className="relative border-[3px] border-[var(--cream)] bg-[#2a2622] p-3 shadow-[10px_10px_0_var(--orange)]">
            <div className="relative overflow-hidden">
              {/* height chart */}
              <div className="pointer-events-none absolute inset-0 z-[1] flex flex-col justify-between py-4">
                {rows.map((r) => (
                  <div key={r} className="flex items-center gap-3 px-3">
                    <span className="f-type text-[12px] text-[var(--cream)]/70">{r}</span>
                    <span className="h-px flex-1 bg-[var(--cream)]/35" />
                  </div>
                ))}
              </div>
              <img
                src="/art/aristocrat.webp"
                alt="The whale, in a tuxedo, being told no."
                className="photo relative block aspect-[4/3] w-full object-cover object-[35%_center] grayscale-[0.35] contrast-[1.1]"
                loading="lazy"
              />
            </div>
            <div className="mt-3 flex items-center justify-between border-[3px] border-[var(--cream)] bg-[var(--cream)] px-4 py-3 text-[var(--ink)]">
              <div>
                <p className="label">Holder No. 0005</p>
                <p className="f-slab text-[26px] uppercase leading-none">The whale</p>
              </div>
              <div className="text-right">
                <p className="label">Bag size</p>
                <p className="f-slab text-[26px] leading-none">5% of supply</p>
              </div>
            </div>
          </div>
          <span className="stamp stamp--dark stamp--double absolute -right-5 -top-5 !bg-[#14110f] !text-[22px]" data-fx="stamp" data-rot="9" data-fx-delay="0.5">
            Can&apos;t dump
          </span>
        </div>

        {/* Copy */}
        <div>
          <span className="caption" data-fx="rise">Section 4. Whales.</span>
          <h2 className="poster poster--dark mt-6 text-[44px] sm:text-[64px] lg:text-[80px]" data-fx="slam">
            Whales can buy.
            <br />
            Whales can&apos;t dump.
          </h2>
          <p className="body mt-7 max-w-[560px] text-[var(--paper)]/85" data-fx="rise">
            A whale owning 5% of the supply does not get to dump 5% into the pool. Its maximum next outbound is:
          </p>

          <div className="mt-6 grid max-w-[600px] grid-cols-[1fr_auto_1fr] items-center gap-3 border-y-[3px] border-[var(--cream)]/30 py-6" data-fx="rise">
            <div>
              <p className="label text-[var(--mustard)]">1% of its 5% bag</p>
              <p className="f-slab mt-1 text-[40px] leading-none sm:text-[56px]">1% × 5%</p>
            </div>
            <span className="f-comic text-[40px] text-[var(--cyan)]">=</span>
            <div className="text-right">
              <p className="label text-[var(--mustard)]">of total supply</p>
              <p className="f-slab mt-1 text-[40px] leading-none text-[var(--cyan)] sm:text-[56px]">0.05%</p>
            </div>
          </div>

          <p className="body mt-6 max-w-[560px] text-[var(--paper)]/85" data-fx="rise">
            Then it waits 24 hours. The same rule applies again based on whatever balance remains.
          </p>

          <p className="f-comic mt-10 text-[40px] leading-none text-[var(--mustard)] sm:text-[52px]" data-fx="rise">
            Big bag? Same rules.
          </p>
          <ul className="mt-6 flex flex-wrap gap-4" data-fx="rise">
            {["No special whale rules", "No VIP wallets", "No exceptions for insiders"].map((t, i) => (
              <li key={t} className="flex items-center gap-3 border-[3px] border-[var(--cream)]/80 px-4 py-3">
                <span className="f-type text-[15px] uppercase tracking-[0.06em]">{t}</span>
                <span className="stamp stamp--dark !border-[3px] !px-2 !py-1 !text-[12px]" data-fx="stamp" data-rot={i % 2 ? 8 : -8} data-fx-delay={0.3 + i * 0.15}>
                  Denied
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Section 5. The anti-jeet meta, under a single lamp.                */
/* ---------------------------------------------------------------- */
export function Interrogation() {
  return (
    <section id="why" className="spot relative scroll-mt-16 overflow-hidden bg-[#070605] py-28 text-[var(--cream)] lg:py-40">
      {/* the lamp */}
      <div className="lamp-wire pointer-events-none absolute left-1/2 top-0 h-[70vh] w-[2px] -translate-x-1/2 bg-gradient-to-b from-[var(--cream)]/40 to-transparent" />
      <div className="lamp-cone pointer-events-none absolute left-1/2 top-0 -translate-x-1/2">
        <div className="h-0 w-0 border-l-[220px] border-r-[220px] border-t-[520px] border-l-transparent border-r-transparent border-t-[rgba(232,181,59,0.10)] blur-[2px] sm:border-l-[360px] sm:border-r-[360px] sm:border-t-[720px]" />
      </div>

      <div className="relative mx-auto max-w-[1000px] px-4 text-center sm:px-6">
        <span className="caption" data-fx="rise">Section 5. The interrogation.</span>

        <p className="f-type mt-10 text-[17px] uppercase tracking-[0.12em] text-[var(--mustard)] sm:text-[20px]" data-fx="type">
          Memecoins have always rewarded diamond hands. $DIAMOND makes them the mechanism.
        </p>

        <p className="body mx-auto mt-8 max-w-[640px] text-[var(--paper)]/75" data-fx="rise">
          Traditional memecoins depend on holders voluntarily choosing not to dump. $DIAMOND asks a different question:
        </p>

        <h2 className="poster poster--dark mx-auto mt-10 max-w-[900px] text-[38px] sm:text-[62px] lg:text-[84px]" data-fx="slam">
          What if the contract made <span className="whitespace-nowrap">mass-dumping</span> impossible?
        </h2>

        <div className="mx-auto mt-14 grid max-w-[760px] gap-3 text-left sm:grid-cols-3" data-fx="rise">
          {["You can still take profit.", "You can still leave.", "You can still sell from the moment you buy."].map((t) => (
            <div key={t} className="border-[3px] border-[var(--cream)]/25 px-5 py-4">
              <span className="f-type text-[11px] uppercase tracking-[0.2em] text-[var(--cyan)]">Permitted</span>
              <p className="body mt-2 text-[var(--paper)]">{t}</p>
            </div>
          ))}
        </div>

        <p className="body mx-auto mt-8 max-w-[560px] text-[var(--paper)]/75" data-fx="rise">
          You just can&apos;t unload your entire position into everyone else at once.
        </p>

        <p className="f-comic mt-14 text-[44px] leading-[0.95] sm:text-[72px]" data-fx="slam">
          Selling is allowed.
          <br />
          <span className="text-[var(--orange)]">Dumping isn&apos;t.</span>
        </p>

        <div className="mt-16 flex flex-col items-center gap-4">
          <span className="label text-[var(--paper)]/60" data-fx="rise">Welcome to:</span>
          <span className="stamp stamp--cyan stamp--double !text-[26px] sm:!text-[40px]" data-fx="stamp" data-rot="-6" data-fx-delay="0.2">
            The <span className="whitespace-nowrap">anti-jeet</span> meta
          </span>
        </div>
      </div>
    </section>
  );
}
