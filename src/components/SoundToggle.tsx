"use client";

import { useEffect, useState } from "react";
import { sfx } from "@/lib/sfx";

export default function SoundToggle() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const off = sfx.subscribe(setOn);
    return () => { off(); };
  }, []);
  return (
    <button
      type="button"
      onClick={() => {
        const v = sfx.toggle();
        if (v) setTimeout(() => sfx.thud(), 30);
      }}
      aria-pressed={on}
      className="sound-toggle f-type"
      title="Toggle sound effects"
    >
      <span className={`sound-dot ${on ? "is-on" : ""}`} />
      Sound {on ? "on" : "off"}
    </button>
  );
}
