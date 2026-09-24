/** The spinning-newspaper beat. Lands between the hero and chapter one. */
export default function Newspaper() {
  return (
    <section className="relative overflow-hidden bg-[#14110f] py-20 lg:py-28">
      <div className="scan pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-[1100px] px-4 sm:px-6">
        <p className="label text-center text-[var(--mustard)]" data-fx="rise">
          Stop the presses.
        </p>

        <div className="paper relative mx-auto mt-10 max-w-[900px] px-6 pb-10 pt-6 text-[var(--ink)] sm:px-10" data-fx="spin">
          <span className="stamp stamp--paper stamp--double absolute -right-3 -top-4 z-[2] !text-[16px] sm:-right-6 sm:-top-5 sm:!text-[22px]" style={{ transform: "rotate(12deg)" }}>
            Late edition
          </span>

          {/* masthead */}
          <div className="flex items-end justify-between gap-4 border-b-[3px] border-[var(--ink)] pb-3">
            <span className="f-type hidden text-[11px] uppercase tracking-[0.14em] sm:block">Vol. I, No. 1</span>
            <h3 className="f-slab text-center text-[34px] uppercase leading-none tracking-tight sm:text-[54px]">The Daily Chart</h3>
            <span className="f-type hidden text-[11px] uppercase tracking-[0.14em] sm:block">Price: 0% tax</span>
          </div>
          <div className="mt-[3px] flex justify-between border-b border-[var(--ink)] py-1">
            <span className="f-type text-[11px] uppercase tracking-[0.14em]">2026. Morning edition.</span>
            <span className="f-type text-[11px] uppercase tracking-[0.14em]">Weather: volatile</span>
          </div>

          {/* headline */}
          <h4 className="poster poster--flat mt-8 text-center text-[52px] sm:text-[84px] lg:text-[104px]">Jeeting outlawed</h4>
          <p className="f-cond mt-4 text-center text-[19px] font-bold uppercase leading-tight tracking-[0.04em] sm:text-[24px]">
            Smart contract caps every wallet at 1% per day. Whales furious. Everyone else: relieved.
          </p>

          <div className="mt-8 grid gap-6 border-t-[3px] border-double border-[var(--ink)] pt-6 sm:grid-cols-3">
            <p className="f-type text-[14px] leading-[1.55] [text-align:justify]">
              <span className="f-slab float-left mr-2 mt-[2px] text-[52px] leading-[0.8]">I</span>n a move whales are calling
              &ldquo;unfair&rdquo; and everyone else is calling &ldquo;about time&rdquo;, a memecoin has written diamond hands
              directly into its contract. Every wallet gets one successful non-zero outbound transaction per rolling 24
              hours, capped at 1% of its holdings. Buying is unrestricted. The first sell is available immediately.
            </p>
            <figure className="border-[3px] border-[var(--ink)] p-1">
              <img
                src="/art/boxing.webp"
                alt="A bear on the canvas after trying to dump."
                width={1200}
                height={1400}
                className="block aspect-[4/5] w-full object-cover object-top grayscale contrast-[1.15]"
                loading="lazy"
              />
              <figcaption className="f-type mt-2 px-1 pb-1 text-[11px] uppercase leading-snug tracking-[0.08em]">
                A bear, moments after trying to dump. Photo: staff.
              </figcaption>
            </figure>
            <p className="f-type text-[14px] leading-[1.55] [text-align:justify]">
              Selling remains legal. Dumping does not. Asked whether the rule could be changed later, the contract declined
              to comment, on the grounds that it has no owner switch, no whitelist and no adjustable limit. &ldquo;Once
              live, the mechanism is the mechanism,&rdquo; it said. Full story, page 3. Tokenomics, page 9.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
