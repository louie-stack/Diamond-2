"use client";

import { useEffect, useState } from "react";
import { sfx } from "@/lib/sfx";

export default function SoundToggle() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const off = sfx.subscribe(setOn);
    return () => {
      off();
    };
  }, []);
  return (
    <button
      type="button"
      onClick={() => {
        const v = sfx.toggle();
        if (v) setTimeout(() => sfx.thud(), 30);
      }}
      aria-pressed={on}
      className={`sound-toggle meta ${on ? "is-on" : ""}`}
      title="Toggle sound effects"
    >
      <span className="sound-bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      Sound {on ? "on" : "off"}
    </button>
  );
}
