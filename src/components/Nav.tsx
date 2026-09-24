import { LINKS, NAV } from "@/content";
import { Diamond } from "./Diamond";

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 border-b-[3px] border-[var(--ink)] bg-[var(--paper)] px-4 sm:px-6 lg:px-10">
        <a href="#top" className="flex items-center gap-3">
          <Diamond className="h-7 w-7" />
          <span className="f-slab whitespace-nowrap text-[17px] uppercase leading-none tracking-tight sm:text-[20px]">Diamond Hands</span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((n, i) => (
            <a
              key={n.label}
              href={n.href}
              target={n.external ? "_blank" : undefined}
              rel={n.external ? "noreferrer" : undefined}
              className="f-cond flex items-baseline gap-1.5 text-[15px] font-bold uppercase tracking-[0.12em] hover:text-[var(--orange)]"
            >
              <span className="f-type text-[10px] tracking-[0.1em] opacity-60">0{i + 1}</span>
              {n.label}
            </a>
          ))}
        </nav>

        <a href={LINKS.buy} className="btn btn--orange !px-4 !py-2.5 !text-[14px]">
          Buy $DIAMOND
        </a>
      </div>
    </header>
  );
}
