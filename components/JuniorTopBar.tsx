"use client";

import Link from "next/link";

export function JuniorTopBar() {
  return (
    <header className="jr-topbar flex h-12 shrink-0 items-center gap-3 border-b border-zinc-200 bg-white/95 px-4 backdrop-blur">
      {/* Brand */}
      <Link href="/" className="group flex items-center gap-2 outline-none">
        <span className="relative flex h-2 w-2">
          <span className="absolute inset-0 animate-pulse rounded-full bg-red-500" />
          <span className="absolute inset-0 rounded-full bg-red-500/40 blur-[3px]" />
        </span>
        <span className="font-mono text-[11px] font-bold tracking-[0.34em] text-zinc-900">
          JUNIOR
        </span>
        <span className="font-mono text-[11px] tracking-[0.34em] text-zinc-400">
          ▸ INBOX
        </span>
      </Link>

      {/* Search */}
      <div className="ml-4 flex flex-1 justify-center">
        <label className="relative w-full max-w-[520px]">
          <span className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-zinc-400">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search mail · sponsor, sector, sender, £…"
            className="block w-full rounded-md border border-zinc-200 bg-zinc-50/70 py-1.5 pl-8 pr-12 text-[12px] text-zinc-800 placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-100"
            aria-label="Search inbox"
          />
          <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center gap-1 text-zinc-400">
            <kbd className="rounded border border-zinc-200 bg-white px-1 font-mono text-[9px] tracking-wide">
              ⌘
            </kbd>
            <kbd className="rounded border border-zinc-200 bg-white px-1 font-mono text-[9px] tracking-wide">
              K
            </kbd>
          </span>
        </label>
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          className="rounded border border-zinc-200 bg-white px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-900"
          aria-label="Refresh"
        >
          Sync
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded bg-zinc-900 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-zinc-700"
        >
          <span>+</span>
          <span>Compose</span>
        </button>
        <Link
          href="/"
          className="ml-1 rounded border border-zinc-200 bg-white px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900"
        >
          ← Lobby
        </Link>
      </div>
    </header>
  );
}
