"use client";

import { useState } from "react";
import { CA, CA_SHORT } from "@/content";

export default function CopyCA({ center = false, short = false }: { center?: boolean; short?: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CA);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };
  return (
    <button
      type="button"
      onClick={copy}
      title="Copy contract address"
      className={`group inline-flex max-w-full items-center gap-4 border border-[var(--line-d)] py-2.5 pl-4 pr-3 text-left transition-colors hover:border-[var(--lime)] ${center ? "mx-auto" : ""}`}
    >
      <span className="meta text-[var(--lime)]">CA</span>
      <code className="mono truncate text-[13px] text-[var(--bone)]/75">
        <span className={short ? "hidden" : "hidden md:inline"}>{CA}</span>
        <span className={short ? "" : "md:hidden"}>{CA_SHORT}</span>
      </code>
      <span className={`meta shrink-0 border-l border-[var(--line-d)] pl-3 ${copied ? "text-[var(--lime)]" : "text-[var(--bone)]/45 group-hover:text-[var(--bone)]"}`}>
        {copied ? "Copied" : "Copy"}
      </span>
    </button>
  );
}
