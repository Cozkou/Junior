"use client";

import type { DealAnalysis, RiskSeverity } from "@/types/deal";
import { cn } from "@/lib/cn";

function SeverityDot({ severity }: { severity: RiskSeverity }) {
  const color =
    severity === "high"
      ? "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]"
      : severity === "medium"
        ? "bg-amber-400"
        : "bg-emerald-600/80";
  return (
    <span
      className={cn("inline-block h-2 w-2 shrink-0 rounded-full", color)}
      aria-hidden
    />
  );
}

function AnnotationSkeleton() {
  return (
    <div className="rounded-lg border border-indigo-500/25 bg-zinc-950/80 p-4 ring-1 ring-indigo-400/20">
      <div className="mb-3 h-3 w-36 animate-pulse rounded bg-zinc-800" />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((k) => (
          <div key={k} className="h-10 animate-pulse rounded bg-zinc-800/80" />
        ))}
      </div>
      <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-zinc-800" />
      <div className="mt-2 space-y-2">
        {[1, 2, 3].map((k) => (
          <div key={k} className="h-3 w-full animate-pulse rounded bg-zinc-800/60" />
        ))}
      </div>
    </div>
  );
}

export function JuniorDealAnnotation(props: {
  analysis: DealAnalysis | null;
  isAnalyzing: boolean;
  error: string | null;
  analyzedLabel: string | null;
}) {
  const { analysis, isAnalyzing, error, analyzedLabel } = props;

  if (isAnalyzing && !analysis) {
    return <AnnotationSkeleton />;
  }

  if (error && !analysis) {
    return (
      <div className="rounded-lg border border-red-500/35 bg-red-950/20 p-4 text-sm text-red-200 ring-1 ring-red-500/20">
        <p className="font-medium text-red-100">Analysis unavailable</p>
        <p className="mt-1 text-red-200/80">{error}</p>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <>
      <article
        className="rounded-lg border border-indigo-500/40 bg-gradient-to-br from-zinc-950/90 to-indigo-950/20 p-4 ring-1 ring-indigo-400/25"
        aria-label="Junior deal analysis"
      >
        <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {(
            [
              ["Loan size", analysis.loanSize],
              ["LTV", analysis.ltv],
              ["Sponsor", analysis.sponsor],
              ["Sector", analysis.sector],
              ["Exit", analysis.exitStrategy],
              ["Term", analysis.term]
            ] as const
          ).map(([k, v]) => (
            <div
              key={k}
              className="rounded-md border border-zinc-800/80 bg-zinc-900/60 px-2.5 py-2"
            >
              <dt className="text-[9px] font-medium uppercase tracking-wider text-zinc-500">
                {k}
              </dt>
              <dd className="mt-0.5 text-[12px] font-medium leading-snug text-zinc-100">
                {v}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-zinc-800/70 pt-4">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
            Mandate fit
          </span>
          <span
            className={cn(
              "rounded px-2 py-0.5 text-[11px] font-bold tracking-wide",
              analysis.mandateFit.pass
                ? "bg-emerald-500/15 text-emerald-300"
                : "bg-red-500/15 text-red-300"
            )}
          >
            {analysis.mandateFit.pass ? "PASS" : "FAIL"}
          </span>
          <p className="w-full text-[12px] leading-relaxed text-zinc-300">
            {analysis.mandateFit.reason}
          </p>
        </div>

        <div className="mt-4 border-t border-zinc-800/70 pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
            Risk flags
          </p>
          <ul className="mt-2 space-y-1.5">
            {analysis.riskFlags.slice(0, 6).map((r, i) => (
              <li key={i} className="flex gap-2 text-[12px] text-zinc-300">
                <span className="mt-1.5 shrink-0">
                  <SeverityDot severity={r.severity} />
                </span>
                <span className="leading-snug">{r.flag}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800/70 pt-3 text-[11px] text-zinc-500">
          <span>
            Confidence{" "}
            <strong className="tabular-nums text-zinc-300">{analysis.confidence}%</strong>
          </span>
          <span>{analyzedLabel ? `Analysed by Junior · ${analyzedLabel}` : "Analysed by Junior"}</span>
        </div>
      </article>

      <details className="group mt-3 rounded-md border border-blue-500/30 bg-blue-950/10">
        <summary className="cursor-pointer list-none px-3 py-2 text-[11px] font-medium text-blue-200/90 marker:content-none [&::-webkit-details-marker]:hidden">
          <span className="inline-flex items-center gap-2">
            Fund reasoning
            <span className="text-[10px] font-normal text-blue-300/60 group-open:rotate-180">
              ▾
            </span>
          </span>
        </summary>
        <div className="border-t border-blue-500/20 px-3 py-2 pb-3 text-[11px] leading-relaxed text-blue-100/85">
          <p className="text-zinc-400">
            Based on 247 prior decisions and 31 post-mortems.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            {analysis.patternObservations.map((o, i) => (
              <li key={i}>{o}</li>
            ))}
          </ul>
        </div>
      </details>
    </>
  );
}
