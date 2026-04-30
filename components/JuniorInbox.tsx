"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BROKER_EMAILS } from "@/data/emails";
import { JuniorActionPanel } from "@/components/JuniorActionPanel";
import { JuniorDealAnnotation } from "@/components/JuniorDealAnnotation";
import { JuniorEmailSidebar } from "@/components/JuniorEmailSidebar";
import type { ActionType, BrokerEmail, DealAnalysis } from "@/types/deal";

function formatAnalyzedAt(d: Date): string {
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
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
    <div className="flex min-h-dvh flex-col bg-zinc-950 text-zinc-100">
      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
        <JuniorEmailSidebar
          emails={emails}
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id);
            setAnalyzeError(null);
          }}
        />

        <main className="flex min-w-0 flex-1 flex-col">
          {selectedEmail ? (
            <>
              <header className="shrink-0 border-b border-zinc-800 px-6 py-4">
                <p className="text-[13px] font-semibold text-zinc-50">{selectedEmail.from}</p>
                <p className="mt-0.5 text-[11px] text-zinc-500">{selectedEmail.company}</p>
                <h2 className="mt-2 text-[14px] font-medium leading-snug text-zinc-200">
                  {selectedEmail.subject}
                </h2>
                <p className="mt-1 text-[11px] tabular-nums text-zinc-500">{selectedEmail.time}</p>
              </header>

              <div className="flex min-h-0 min-w-0 flex-1">
                <div className="min-h-0 min-w-0 flex-1 overflow-y-auto px-6 py-5">
                  <JuniorDealAnnotation
                    analysis={cachedAnalysis}
                    isAnalyzing={isAnalyzing && !cachedAnalysis}
                    error={analyzeError}
                    analyzedLabel={analyzedLabel}
                  />

                  <article className="mt-6 border-t border-zinc-800 pt-6 font-mono text-[12px] leading-relaxed text-zinc-300 whitespace-pre-wrap">
                    {selectedEmail.body}
                  </article>

                  <div className="sticky bottom-0 z-10 -mx-6 mt-8 border-t border-zinc-800 bg-zinc-950/95 px-6 py-4 backdrop-blur-md">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => void openGenerate("memo")}
                        disabled={!cachedAnalysis || isAnalyzing}
                        className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-[11px] font-semibold text-zinc-200 hover:border-indigo-500/50 hover:bg-zinc-800 disabled:opacity-40"
                      >
                        Draft IC Memo
                      </button>
                      <button
                        type="button"
                        onClick={() => void openGenerate("reply")}
                        disabled={!cachedAnalysis || isAnalyzing}
                        className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-[11px] font-semibold text-zinc-200 hover:border-indigo-500/50 hover:bg-zinc-800 disabled:opacity-40"
                      >
                        Reply to Broker
                      </button>
                      <button
                        type="button"
                        onClick={() => void openGenerate("skip")}
                        disabled={!cachedAnalysis || isAnalyzing}
                        className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-[11px] font-semibold text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800 disabled:opacity-40"
                      >
                        Skip Deal
                      </button>
                    </div>
                  </div>
                </div>

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
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-zinc-500">
              Select an email.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
