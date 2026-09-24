"use client";

import { useState } from "react";

const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

/** The detective's calculator. Type a bag, get the max next outbound. */
export default function Calculator() {
  const [raw, setRaw] = useState("1,000,000");
  const n = Number(raw.replace(/[^0-9.]/g, "")) || 0;
  const max = Math.floor(n / 100);
  const supply = 1_000_000_000;
  const pct = n > 0 ? (max / supply) * 100 : 0;

  return (
    <div className="panel !bg-[var(--manila)] px-6 py-8 text-center sm:px-12">
      <span className="label opacity-70">Worked example. Try your own bag.</span>
      <p className="f-comic mt-3 text-[34px] leading-none sm:text-[42px]">Hold how much $DIAMOND?</p>
      <div className="mx-auto mt-5 max-w-[360px]">
        <input
          className="type-input text-center"
          inputMode="numeric"
          value={raw}
          onChange={(e) => {
            const v = Number(e.target.value.replace(/[^0-9]/g, ""));
            setRaw(v ? fmt(Math.min(v, supply)) : "");
          }}
          placeholder="1,000,000"
          aria-label="Your $DIAMOND balance"
        />
      </div>
      <p className="type mt-6">Maximum next outbound:</p>
      <p className="poster poster--flat mt-2 text-[48px] sm:text-[80px]" aria-live="polite">
        {fmt(max)}
      </p>
      <p className="label mt-3">
        $DIAMOND. {pct > 0 ? `${pct.toFixed(pct < 0.001 ? 5 : 3)}% of supply.` : "Type a number."} Then the clock starts.
      </p>
    </div>
  );
}
