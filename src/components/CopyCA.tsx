"use client";

import { useState } from "react";
import { CA, CA_SHORT } from "@/content";

export default function CopyCA({ dark = true, center = false }: { dark?: boolean; center?: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CA);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };
  const text = dark ? "text-[var(--paper)]/80" : "text-[var(--ink)]";
  return (
    <button
      type="button"
      onClick={copy}
      title="Copy contract address"
      className={`group relative inline-flex flex-wrap items-center gap-x-4 gap-y-2 text-left ${center ? "justify-center" : ""}`}
    >
      <span className={`label ${dark ? "text-[var(--paper)]/60" : "opacity-60"}`}>CA</span>
      <code className={`f-type text-[14px] ${text} transition-colors group-hover:text-[var(--cyan)]`}>
        <span className="hidden sm:inline">{CA}</span>
        <span className="sm:hidden">{CA_SHORT}</span>
      </code>
      <span className={`label ${dark ? "text-[var(--paper)]/40" : "opacity-40"} group-hover:text-[var(--cyan)]`}>{copied ? "" : "click to copy"}</span>
      <span
        className={`stamp stamp--dark stamp--double pointer-events-none absolute -right-6 -top-4 !px-3 !py-1.5 !text-[14px] transition-all duration-150 ${
          copied ? "scale-100 opacity-100" : "scale-[2] opacity-0"
        }`}
        style={{ transform: copied ? "rotate(-8deg)" : "rotate(-2deg) scale(2)" }}
      >
        Copied
      </span>
    </button>
  );
}
