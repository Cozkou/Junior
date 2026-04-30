"use client";

import type { BrokerEmail, EmailStatus } from "@/types/deal";
import { cn } from "@/lib/cn";

const statusBorder: Record<EmailStatus, string> = {
  strong: "border-l-emerald-500",
  review: "border-l-amber-500",
  miss: "border-l-red-500",
  skip: "border-l-amber-600"
};

function sectorPillClasses(sector: string) {
  switch (sector) {
    case "Retail":
      return "bg-rose-500/15 text-rose-200 border-rose-500/30";
    case "Industrial":
      return "bg-sky-500/15 text-sky-200 border-sky-500/30";
    case "Resi":
      return "bg-violet-500/15 text-violet-200 border-violet-500/30";
    default:
      return "bg-zinc-500/15 text-zinc-300 border-zinc-500/30";
  }
}

export function JuniorEmailSidebar(props: {
  emails: BrokerEmail[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const { emails, selectedId, onSelect } = props;

  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
      <header className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
        <span className="relative flex h-2 w-2 shrink-0 items-center justify-center">
          <span
            className="jr-ai-dot absolute h-2 w-2 rounded-full bg-emerald-400"
            aria-hidden
          />
        </span>
        <h1 className="text-sm font-semibold tracking-tight text-zinc-50">Junior</h1>
      </header>

      <nav className="min-h-0 flex-1 overflow-y-auto p-2" aria-label="Broker emails">
        <ul className="flex flex-col gap-1">
          {emails.map((e) => {
            const active = e.id === selectedId;
            const faded = e.status === "miss";
            return (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => onSelect(e.id)}
                  className={cn(
                    "w-full rounded-md border-l-4 px-2.5 py-2 text-left transition-colors",
                    statusBorder[e.status],
                    faded ? "opacity-50" : null,
                    active
                      ? "bg-zinc-800/90 ring-1 ring-indigo-500/40"
                      : "bg-zinc-900/40 hover:bg-zinc-800/60"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-zinc-100">
                        {e.from}
                      </p>
                      <p className="truncate text-[11px] text-zinc-500">{e.company}</p>
                    </div>
                    <time
                      className="shrink-0 text-[10px] tabular-nums text-zinc-500"
                      dateTime={e.time}
                    >
                      {e.time}
                    </time>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-zinc-400">
                    {e.subject}
                  </p>
                  <span
                    className={cn(
                      "mt-2 inline-block rounded-full border px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide",
                      sectorPillClasses(e.sector)
                    )}
                  >
                    {e.sector}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
