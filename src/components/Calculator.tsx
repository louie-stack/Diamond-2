"use client";

import { useState } from "react";

const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

/** Type a bag, get the max next outbound. */
export default function Calculator() {
  const [raw, setRaw] = useState("1,000,000");
  const n = Number(raw.replace(/[^0-9.]/g, "")) || 0;
  const max = Math.floor(n / 100);
  const supply = 1_000_000_000;
  const pct = n > 0 ? (max / supply) * 100 : 0;

  return (
    <div className="vf grid border border-[var(--line-d)] lg:grid-cols-2">
      <span className="vf__b" />
      <div className="border-b border-[var(--line-d)] p-8 sm:p-12 lg:border-b-0 lg:border-r">
        <p className="meta opacity-50">Worked example. Try your own bag.</p>
        <label htmlFor="bag" className="display mt-5 block text-[clamp(40px,4vw,64px)] leading-[1]">
          Hold how much $DIAMOND?
        </label>
        <input
          id="bag"
          className="field mt-10 text-[var(--bone)]"
          inputMode="numeric"
          value={raw}
          onChange={(e) => {
            const v = Number(e.target.value.replace(/[^0-9]/g, ""));
            setRaw(v ? fmt(Math.min(v, supply)) : "");
          }}
          placeholder="1,000,000"
        />
      </div>
      <div className="flex flex-col justify-between p-8 sm:p-12">
        <p className="meta opacity-50">Maximum next outbound:</p>
        <p className="display mt-6 break-all text-[clamp(64px,8vw,128px)] leading-[0.85] text-[var(--lime)] tabular-nums" aria-live="polite">
          {fmt(max)}
        </p>
        <p className="meta mt-6 opacity-60">
          $DIAMOND. {pct > 0 ? `${pct.toFixed(pct < 0.001 ? 5 : 3)}% of supply.` : "Type a number."} Then the clock starts.
        </p>
      </div>
    </div>
  );
}
