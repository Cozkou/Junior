"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BROKER_EMAILS } from "@/data/emails";
import { JuniorActionPanel } from "@/components/JuniorActionPanel";
import { JuniorDealAnnotation } from "@/components/JuniorDealAnnotation";
import { JuniorEmailSidebar } from "@/components/JuniorEmailSidebar";
import { JuniorFolderRail } from "@/components/JuniorFolderRail";
import { JuniorTopBar } from "@/components/JuniorTopBar";
import type { ActionType, BrokerEmail, DealAnalysis } from "@/types/deal";

function formatAnalyzedAt(d: Date): string {
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase().slice(0, 2);
}

function senderEmailGuess(email: BrokerEmail): string {
  const slug = email.from
    .toLowerCase()
    .split(/\s+/)
    .map((p) => p.replace(/[^a-z]/g, ""))
    .filter(Boolean)
    .join(".");
  const domain = email.company
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 14);
  return `${slug}@${domain || "broker"}.co.uk`;
}

export function JuniorInbox() {
  const emails = BROKER_EMAILS;
  const [selectedId, setSelectedId] = useState<string | null>(emails[0]?.id ?? null);

  const analysisByIdRef = useRef<Record<string, DealAnalysis>>({});
  const [, bump] = useState(0);
  const force = useCallback(() => bump((n) => n + 1), []);

  const analyzedAtByIdRef = useRef<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  const [actionPanelOpen, setActionPanelOpen] = useState(false);
  const [actionType, setActionType] = useState<ActionType | null>(null);
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [hitlLabel, setHitlLabel] = useState<string | null>(null);

  const selectedEmail: BrokerEmail | null = useMemo(
    () => emails.find((e) => e.id === selectedId) ?? null,
    [emails, selectedId]
  );

  const cachedAnalysis = selectedId ? analysisByIdRef.current[selectedId] ?? null : null;

  useEffect(() => {
    if (!selectedEmail) return;
    const id = selectedEmail.id;
    if (analysisByIdRef.current[id]) {
      setAnalyzeError(null);
      setIsAnalyzing(false);
      return;
    }

    let cancelled = false;
    setIsAnalyzing(true);
    setAnalyzeError(null);

    void (async () => {
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body: selectedEmail.body })
        });
        const data = (await res.json()) as { error?: string } & Partial<DealAnalysis>;
        if (!res.ok) {
          throw new Error(data.error ?? `Analysis failed (${res.status})`);
        }
        if (
          !data.loanSize ||
          !data.mandateFit ||
          !Array.isArray(data.riskFlags) ||
          !Array.isArray(data.patternObservations)
        ) {
          throw new Error("Invalid analysis response");
        }
        if (cancelled) return;
        const analysis = data as DealAnalysis;
        analysisByIdRef.current[id] = analysis;
        analyzedAtByIdRef.current[id] = formatAnalyzedAt(new Date());
        force();
      } catch (e) {
        if (!cancelled) {
          setAnalyzeError(e instanceof Error ? e.message : "Analysis failed");
        }
      } finally {
        if (!cancelled) setIsAnalyzing(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedEmail, force]);

  const openGenerate = useCallback(
    async (type: ActionType) => {
      if (!selectedEmail || !cachedAnalysis) return;

      setHitlLabel(null);
      setGenerateError(null);
      setGeneratedContent("");
      setActionType(type);
      setActionPanelOpen(true);
      setIsGenerating(true);

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actionType: type,
            dealData: cachedAnalysis,
            emailBody: selectedEmail.body
          })
        });

        if (!res.ok) {
          const t = await res.text();
          throw new Error(t.slice(0, 200) || `Generate failed (${res.status})`);
        }

        const reader = res.body?.getReader();
        if (!reader) {
          throw new Error("No response body");
        }

        const dec = new TextDecoder();
        let acc = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += dec.decode(value, { stream: true });
          setGeneratedContent(acc);
        }
        acc += dec.decode();
        setGeneratedContent(acc);
      } catch (e) {
        setGenerateError(e instanceof Error ? e.message : "Generation failed");
      } finally {
        setIsGenerating(false);
      }
    },
    [cachedAnalysis, selectedEmail]
  );

  const closePanel = useCallback(() => {
    setActionPanelOpen(false);
    setActionType(null);
    setGenerateError(null);
    setGeneratedContent("");
    setHitlLabel(null);
  }, []);

  const onConfirmHitl = useCallback(() => {
    if (!actionType || isGenerating || !generatedContent.trim()) return;
    const msg =
      actionType === "reply"
        ? "Queued to send (demo — no outbound mail)."
        : actionType === "memo"
          ? "Marked for SharePoint upload (demo)."
          : "Recorded as skipped (demo).";
    setHitlLabel(msg);
  }, [actionType, generatedContent, isGenerating]);

  const analyzedLabel = selectedId ? analyzedAtByIdRef.current[selectedId] ?? null : null;

  return (
    <div className="flex h-dvh flex-col bg-[#fbfbfd] text-zinc-900">
      <JuniorTopBar />

      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
        <JuniorFolderRail />

        <JuniorEmailSidebar
          emails={emails}
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id);
            setAnalyzeError(null);
          }}
        />

        <main className="flex min-w-0 flex-1 flex-col bg-white">
          {selectedEmail ? (
            <ReadingPane
              email={selectedEmail}
              analysis={cachedAnalysis}
              isAnalyzing={isAnalyzing}
              analyzeError={analyzeError}
              analyzedLabel={analyzedLabel}
              openGenerate={openGenerate}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center text-zinc-500">
              <p className="font-mono text-[11px] tracking-[0.32em] uppercase">
                Select a thread
              </p>
            </div>
          )}
        </main>

        <JuniorActionPanel
          open={actionPanelOpen}
          actionType={actionType}
          content={generatedContent}
          isGenerating={isGenerating}
          error={generateError}
          onClose={closePanel}
          onConfirm={onConfirmHitl}
          hitlLabel={hitlLabel}
        />
      </div>
    </div>
  );
}

function ReadingPane(props: {
  email: BrokerEmail;
  analysis: DealAnalysis | null;
  isAnalyzing: boolean;
  analyzeError: string | null;
  analyzedLabel: string | null;
  openGenerate: (t: ActionType) => void;
}) {
  const { email, analysis, isAnalyzing, analyzeError, analyzedLabel, openGenerate } = props;
  const senderEmail = senderEmailGuess(email);

  return (
    <>
      {/* Reading pane header */}
      <header className="shrink-0 border-b border-zinc-200 bg-white px-7 pt-5 pb-4">
        {/* Top action toolbar */}
        <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-400">
          <div className="flex items-center gap-1">
            <ToolbarButton label="Archive" />
            <ToolbarButton label="Flag" />
            <ToolbarButton label="Snooze" />
            <ToolbarButton label="Trash" />
          </div>
          <div className="flex items-center gap-2 tabular-nums">
            <span>Thread {email.id.replace("email-", "#")}</span>
            <span aria-hidden>·</span>
            <span>1 of {12}</span>
            <button
              type="button"
              className="ml-2 rounded border border-zinc-200 bg-white px-1.5 py-1 text-zinc-500 hover:border-zinc-400 hover:text-zinc-900"
              aria-label="Previous"
            >
              ◀
            </button>
            <button
              type="button"
              className="rounded border border-zinc-200 bg-white px-1.5 py-1 text-zinc-500 hover:border-zinc-400 hover:text-zinc-900"
              aria-label="Next"
            >
              ▶
            </button>
          </div>
        </div>

        {/* Subject as h1 */}
        <h1 className="text-[18px] font-semibold leading-snug tracking-tight text-zinc-900">
          {email.subject}
        </h1>

        {/* Sender row */}
        <div className="mt-3 flex items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-zinc-200 bg-zinc-50 font-mono text-[11px] font-bold tracking-wider text-zinc-700">
            {initials(email.from)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-zinc-900">{email.from}</p>
            <p className="truncate text-[11px] text-zinc-500">
              <span className="font-mono">{senderEmail}</span>
              <span className="mx-1.5 text-zinc-300">·</span>
              <span>{email.company}</span>
            </p>
          </div>
          <div className="flex flex-col items-end font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-400 tabular-nums">
            <span>Today</span>
            <span className="text-zinc-700">{email.time}</span>
          </div>
        </div>

        {/* Meta strip */}
        <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.28em] text-zinc-500">
          <span className="rounded-sm border border-zinc-300 bg-white px-1.5 py-0.5 font-bold tracking-[0.22em] text-zinc-700">
            {email.sector.toUpperCase()}
          </span>
          <span className="rounded-sm border border-zinc-200 px-1.5 py-0.5">
            {email.id.replace("email-", "DEAL/")}
          </span>
          {analysis ? (
            <span
              className={
                analysis.mandateFit.pass
                  ? "rounded-sm border border-zinc-900 bg-zinc-900 px-1.5 py-0.5 font-bold text-white"
                  : "rounded-sm border border-red-400 px-1.5 py-0.5 font-bold text-red-600"
              }
            >
              MANDATE · {analysis.mandateFit.pass ? "PASS" : "FAIL"}
            </span>
          ) : null}
          {analysis ? (
            <span className="rounded-sm border border-zinc-200 px-1.5 py-0.5 tabular-nums">
              CONF · {analysis.confidence}%
            </span>
          ) : null}
          {analyzedLabel ? (
            <span className="ml-auto text-zinc-400 normal-case tracking-[0.18em]">
              ⟳ {analyzedLabel}
            </span>
          ) : null}
        </div>
      </header>

      {/* Body & analysis */}
      <div className="min-h-0 flex-1 overflow-y-auto bg-[#fbfbfd]">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-7 py-6">
          {/* Email body */}
          <article className="rounded-md border border-zinc-200 bg-white shadow-[0_1px_0_rgba(255,255,255,1)_inset]">
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.28em] text-zinc-400">
              <span>Body · text/plain</span>
              <span>{email.body.length} chars</span>
            </div>
            <div className="whitespace-pre-wrap px-5 py-5 text-[13px] leading-[1.7] text-zinc-800">
              {email.body}
            </div>
          </article>

          {/* Junior analysis */}
          <JuniorDealAnnotation
            analysis={analysis}
            isAnalyzing={isAnalyzing && !analysis}
            error={analyzeError}
            analyzedLabel={analyzedLabel}
          />
        </div>

        {/* Sticky reply / action bar */}
        <div className="sticky bottom-0 z-10 border-t border-zinc-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-2 px-7 py-3">
            <div className="flex items-center gap-1.5">
              <ActionButton
                label="Reply"
                primary
                onClick={() => openGenerate("reply")}
                disabled={!analysis || isAnalyzing}
              />
              <ActionButton
                label="Forward"
                onClick={() => openGenerate("reply")}
                disabled={!analysis || isAnalyzing}
              />
              <span className="mx-1 h-4 w-px bg-zinc-200" />
              <ActionButton
                label="Draft IC memo"
                onClick={() => openGenerate("memo")}
                disabled={!analysis || isAnalyzing}
              />
              <ActionButton
                label="Skip"
                onClick={() => openGenerate("skip")}
                danger
                disabled={!analysis || isAnalyzing}
              />
            </div>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.28em] text-zinc-400">
              ⌘↩ to send · ⌘\ to skip
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

function ToolbarButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="rounded border border-transparent px-2 py-1 transition-colors hover:border-zinc-200 hover:bg-white hover:text-zinc-700"
    >
      {label}
    </button>
  );
}

function ActionButton(props: {
  label: string;
  onClick?: () => void;
  primary?: boolean;
  danger?: boolean;
  disabled?: boolean;
}) {
  const { label, onClick, primary, danger, disabled } = props;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        primary
          ? "rounded bg-zinc-900 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.4)] transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-30"
          : danger
            ? "rounded border border-zinc-200 bg-white px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500 transition-colors hover:border-red-400 hover:bg-red-50/50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
            : "rounded border border-zinc-200 bg-white px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-30"
      }
    >
      {label}
    </button>
  );
}
