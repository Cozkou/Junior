"use client";

import type { BrokerEmail, EmailStatus } from "@/types/deal";
import { cn } from "@/lib/cn";

const statusLabel: Record<EmailStatus, string> = {
  strong: "STRONG",
  review: "REVIEW",
  miss: "MISS",
  skip: "SKIP"
};

const statusClass: Record<EmailStatus, string> = {
  strong: "border-zinc-300 text-zinc-900",
  review: "border-zinc-300 text-zinc-700",
  miss: "border-zinc-200 text-zinc-400",
  skip: "border-zinc-200 text-zinc-400"
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase().slice(0, 2);
}

function previewLine(body: string): string {
  const cleaned = body.replace(/\s+/g, " ").trim();
  return cleaned.length > 110 ? `${cleaned.slice(0, 110)}…` : cleaned;
}

export function JuniorEmailSidebar(props: {
  emails: BrokerEmail[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const { emails, selectedId, onSelect } = props;

  return (
    <aside className="flex h-full w-[320px] shrink-0 flex-col border-r border-zinc-200 bg-white">
      {/* Sub-header / filters */}
      <header className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-zinc-900">
            Inbox
          </h2>
          <span className="font-mono text-[10px] tabular-nums text-zinc-400">
            {emails.length} threads
          </span>
        </div>
        <div className="flex items-center gap-1">
          <FilterPill label="All" active />
          <FilterPill label="Strong" />
          <FilterPill label="Review" />
        </div>
      </header>

      <nav className="min-h-0 flex-1 overflow-y-auto" aria-label="Broker emails">
        <ul className="flex flex-col">
          {emails.map((e) => {
            const active = e.id === selectedId;
            const muted = e.status === "miss" || e.status === "skip";
            return (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => onSelect(e.id)}
                  className={cn(
                    "group relative grid w-full grid-cols-[28px_1fr_auto] gap-x-2.5 gap-y-1 border-b border-zinc-100 px-3.5 py-3 text-left transition-colors",
                    active
                      ? "bg-zinc-900/[0.04]"
                      : "bg-transparent hover:bg-zinc-50"
                  )}
                >
                  {/* selection bar */}
                  <span
                    className={cn(
                      "absolute inset-y-0 left-0 w-[3px] transition-colors",
                      active ? "bg-red-500" : "bg-transparent"
                    )}
                  />

                  {/* avatar */}
                  <div className="row-span-2 mt-0.5 grid h-7 w-7 place-items-center rounded-full border border-zinc-200 bg-zinc-50 font-mono text-[10px] font-bold tracking-wider text-zinc-700">
                    {initials(e.from)}
                  </div>

                  {/* sender + company */}
                  <div className="min-w-0">
                    <p
                      className={cn(
                        "truncate text-[12.5px]",
                        muted ? "text-zinc-500" : "text-zinc-900",
                        active ? "font-bold" : "font-semibold"
                      )}
                    >
                      {e.from}
                    </p>
                    <p className="truncate text-[10.5px] text-zinc-500">
                      {e.company}
                    </p>
                  </div>

                  {/* time + status */}
                  <div className="flex flex-col items-end gap-1 text-right">
                    <time
                      className="font-mono text-[10px] tabular-nums text-zinc-500"
                      dateTime={e.time}
                    >
                      {e.time}
                    </time>
                    <span
                      className={cn(
                        "rounded-sm border px-1 py-px font-mono text-[8.5px] font-bold tracking-[0.18em]",
                        statusClass[e.status]
                      )}
                    >
                      {statusLabel[e.status]}
                    </span>
                  </div>

                  {/* subject + preview span 2 cols */}
                  <div className="col-span-2 col-start-2 min-w-0">
                    <p
                      className={cn(
                        "line-clamp-1 text-[12px]",
                        muted ? "text-zinc-400" : "text-zinc-800"
                      )}
                    >
                      {e.subject}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-[11px] leading-relaxed text-zinc-500">
                      {previewLine(e.body)}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="rounded-sm border border-zinc-200 px-1 py-px font-mono text-[8.5px] uppercase tracking-[0.22em] text-zinc-500">
                        {e.sector}
                      </span>
                      {e.status === "strong" ? (
                        <span className="font-mono text-[9px] tracking-[0.22em] text-red-500/85">
                          ● new
                        </span>
                      ) : null}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <footer className="flex shrink-0 items-center justify-between border-t border-zinc-200 bg-zinc-50/60 px-4 py-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.32em] text-zinc-400">
          Auto-triaged · Junior 1.4
        </span>
        <span className="font-mono text-[9px] tabular-nums text-zinc-400">
          ⟳ 14s ago
        </span>
      </footer>
    </aside>
  );
}

function FilterPill({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-sm border px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] transition-colors",
        active
          ? "border-zinc-900 bg-zinc-900 text-white"
          : "border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-800"
      )}
    >
      {label}
    </button>
  );
}
