"use client";

import { cn } from "@/lib/cn";

type FolderKey = "inbox" | "flagged" | "drafts" | "done" | "archive";

const FOLDERS: Array<{
  key: FolderKey;
  label: string;
  count: number;
  hint?: string;
  active?: boolean;
}> = [
  { key: "inbox", label: "Inbox", count: 9, active: true },
  { key: "flagged", label: "Flagged", count: 3 },
  { key: "drafts", label: "Drafts", count: 2 },
  { key: "done", label: "Done", count: 47 },
  { key: "archive", label: "Archive", count: 0 }
];

const SECTORS: Array<{ key: string; label: string }> = [
  { key: "industrial", label: "Industrial" },
  { key: "resi", label: "Resi" },
  { key: "retail", label: "Retail" },
  { key: "office", label: "Office" },
  { key: "hotel", label: "Hotel" }
];

const VIEWS: Array<{ key: string; label: string; count?: number }> = [
  { key: "auto", label: "Auto-skipped", count: 12 },
  { key: "needs", label: "Needs review", count: 4 }
];

export function JuniorFolderRail() {
  return (
    <aside className="hidden h-full w-[212px] shrink-0 flex-col gap-5 overflow-y-auto border-r border-zinc-200 bg-zinc-50/40 px-3 py-4 lg:flex">
      <Group label="Folders">
        {FOLDERS.map((f) => (
          <RailRow
            key={f.key}
            label={f.label}
            count={f.count}
            active={f.active}
          />
        ))}
      </Group>

      <Group label="Junior views">
        {VIEWS.map((v) => (
          <RailRow key={v.key} label={v.label} count={v.count} muted />
        ))}
      </Group>

      <Group label="Sectors">
        {SECTORS.map((s) => (
          <RailRow key={s.key} label={s.label} count={undefined} muted />
        ))}
      </Group>

      {/* Footer mini-stat */}
      <div className="mt-auto rounded-md border border-zinc-200 bg-white p-3">
        <p className="font-mono text-[9px] font-bold uppercase tracking-[0.32em] text-zinc-400">
          today · l13/01
        </p>
        <p className="mt-1.5 text-[12px] font-semibold tabular-nums text-zinc-900">
          12 deals · 4 review
        </p>
        <p className="mt-1 text-[10.5px] leading-snug text-zinc-500">
          Average close-out time 4m 12s
        </p>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-zinc-100">
          <div className="h-full w-3/4 bg-zinc-900" />
        </div>
      </div>
    </aside>
  );
}

function Group({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-0.5">
      <p className="px-2 pb-1 font-mono text-[9px] font-bold uppercase tracking-[0.32em] text-zinc-400">
        {label}
      </p>
      {children}
    </section>
  );
}

function RailRow({
  label,
  count,
  active = false,
  muted = false
}: {
  label: string;
  count?: number;
  active?: boolean;
  muted?: boolean;
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex items-center justify-between rounded-md px-2 py-1.5 text-left transition-colors",
        active
          ? "bg-zinc-900 text-white"
          : muted
            ? "text-zinc-500 hover:bg-zinc-100/70 hover:text-zinc-800"
            : "text-zinc-700 hover:bg-zinc-100/70 hover:text-zinc-900"
      )}
    >
      <span className="text-[12px] font-medium">{label}</span>
      {typeof count === "number" ? (
        <span
          className={cn(
            "font-mono text-[10px] tabular-nums",
            active ? "text-zinc-300" : "text-zinc-400"
          )}
        >
          {count > 0 ? count : ""}
        </span>
      ) : null}
    </button>
  );
}
