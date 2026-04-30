"use client";

import type { ActionType } from "@/types/deal";
import { cn } from "@/lib/cn";

function confirmLabel(action: ActionType): string {
  switch (action) {
    case "reply":
      return "Send";
    case "memo":
      return "Save to SharePoint";
    case "skip":
      return "Confirm";
    default:
      return "Confirm";
  }
}

export function JuniorActionPanel(props: {
  open: boolean;
  actionType: ActionType | null;
  content: string;
  isGenerating: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
  hitlLabel: string | null;
}) {
  const { open, actionType, content, isGenerating, error, onClose, onConfirm, hitlLabel } =
    props;

  const title =
    actionType === "memo"
      ? "Draft IC memo"
      : actionType === "reply"
        ? "Reply to broker"
        : actionType === "skip"
          ? "Skip deal"
          : "Action";

  return (
    <aside
      className={cn(
        "flex h-full min-w-0 flex-col border-l border-zinc-800 bg-zinc-900",
        !open && "pointer-events-none"
      )}
      style={{
        width: open ? 320 : 0,
        minWidth: open ? 280 : 0,
        maxWidth: open ? 320 : 0,
        opacity: open ? 1 : 0,
        transition: "width 0.25s ease, min-width 0.25s ease, max-width 0.25s ease, opacity 0.2s ease",
        overflow: "hidden"
      }}
      aria-hidden={!open}
    >
      <div className="flex w-[320px] shrink-0 flex-col border-l border-transparent">
        <header className="flex items-center justify-between border-b border-zinc-800 px-3 py-2.5">
          <h2 className="text-[12px] font-semibold tracking-tight text-zinc-100">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
            aria-label="Close panel"
          >
            ✕
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
          {error ? (
            <p className="text-[12px] text-red-300">{error}</p>
          ) : (
            <pre className="font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-zinc-300 break-words">
              {content || (isGenerating ? "…" : "—")}
            </pre>
          )}
        </div>

        <footer className="border-t border-zinc-800 p-3">
          {hitlLabel ? (
            <p className="mb-2 text-center text-[10px] text-emerald-400/90">{hitlLabel}</p>
          ) : null}
          <button
            type="button"
            disabled={isGenerating || !content.trim()}
            onClick={onConfirm}
            className="w-full rounded-md bg-indigo-600 py-2 text-[12px] font-semibold text-white shadow-inner shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {actionType ? confirmLabel(actionType) : "Confirm"}
          </button>
        </footer>
      </div>
    </aside>
  );
}
