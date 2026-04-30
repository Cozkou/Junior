"use client";

import type { ActionType } from "@/types/deal";
import { cn } from "@/lib/cn";

function confirmLabel(action: ActionType): string {
  switch (action) {
    case "reply":
      return "Send reply";
    case "memo":
      return "Save to SharePoint";
    case "skip":
      return "Confirm skip";
    default:
      return "Confirm";
  }
}

function actionMeta(action: ActionType | null): { title: string; tag: string; sub: string } {
  switch (action) {
    case "memo":
      return { title: "Investment-committee memo", tag: "MEMO", sub: "Drafting · pattern-memory enabled" };
    case "reply":
      return { title: "Reply to broker", tag: "REPLY", sub: "Tone matches recent threads" };
    case "skip":
      return { title: "Skip this deal", tag: "SKIP", sub: "Out-of-mandate · removed from queue" };
    default:
      return { title: "Action", tag: "ACT", sub: "" };
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
  const meta = actionMeta(actionType);

  return (
    <aside
      className={cn(
        "flex h-full min-w-0 flex-col border-l border-zinc-200 bg-white",
        !open && "pointer-events-none"
      )}
      style={{
        width: open ? 380 : 0,
        minWidth: open ? 320 : 0,
        maxWidth: open ? 380 : 0,
        opacity: open ? 1 : 0,
        transition:
          "width 0.28s cubic-bezier(0.22,1,0.36,1), min-width 0.28s cubic-bezier(0.22,1,0.36,1), max-width 0.28s cubic-bezier(0.22,1,0.36,1), opacity 0.18s ease",
        overflow: "hidden"
      }}
      aria-hidden={!open}
    >
      <div className="flex w-[380px] shrink-0 flex-col bg-white">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50/50 px-4 py-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="rounded-sm border border-zinc-300 bg-white px-1 py-px font-mono text-[9px] font-bold tracking-[0.22em] text-zinc-700">
              {meta.tag}
            </span>
            <h2 className="truncate text-[12.5px] font-semibold text-zinc-900">
              {meta.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            aria-label="Close panel"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </header>

        {/* Sub-meta */}
        <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-2 font-mono text-[9.5px] uppercase tracking-[0.28em] text-zinc-400">
          <span>{meta.sub}</span>
          <span>
            {isGenerating ? (
              <span className="inline-flex items-center gap-1 text-zinc-700">
                <span className="jr-ai-dot inline-block h-1 w-1 rounded-full bg-red-500" />
                streaming
              </span>
            ) : content.trim() ? (
              <span className="text-zinc-700">ready</span>
            ) : (
              <span>—</span>
            )}
          </span>
        </div>

        {/* Content body */}
        <div className="min-h-0 flex-1 overflow-y-auto bg-white px-4 py-4">
          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50/40 px-3 py-2">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-red-600">
                Generation failed
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-red-800">{error}</p>
            </div>
          ) : (
            <pre className="whitespace-pre-wrap break-words font-mono text-[11.5px] leading-relaxed text-zinc-800">
              {content || (isGenerating ? "Drafting…" : "—")}
            </pre>
          )}
        </div>

        {/* Footer / confirm */}
        <footer className="border-t border-zinc-200 bg-zinc-50/50 px-4 py-3">
          {hitlLabel ? (
            <div className="mb-2 flex items-center gap-2 rounded-sm border border-zinc-200 bg-white px-2 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-900" />
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-700">
                {hitlLabel}
              </p>
            </div>
          ) : null}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded border border-zinc-300 bg-white py-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-700 transition-colors hover:border-zinc-500 hover:text-zinc-900"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isGenerating || !content.trim()}
              onClick={onConfirm}
              className="flex-[2] rounded bg-zinc-900 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {actionType ? confirmLabel(actionType) : "Confirm"}
            </button>
          </div>
        </footer>
      </div>
    </aside>
  );
}
