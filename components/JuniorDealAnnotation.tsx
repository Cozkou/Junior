"use client";

import type { DealAnalysis, RiskSeverity } from "@/types/deal";
import { cn } from "@/lib/cn";

const sevDot: Record<RiskSeverity, string> = {
  high: "bg-red-500",
  medium: "bg-zinc-500",
  low: "bg-zinc-300"
};

const sevLabel: Record<RiskSeverity, string> = {
  high: "HIGH",
  medium: "MED",
  low: "LOW"
};

function AnnotationSkeleton() {
  return (
    <section className="rounded-md border border-zinc-200 bg-white">
      <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-2.5">
        <div className="h-3 w-32 animate-pulse rounded bg-zinc-200" />
        <div className="h-3 w-16 animate-pulse rounded bg-zinc-200" />
      </header>
      <div className="grid grid-cols-2 gap-px bg-zinc-200 sm:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((k) => (
          <div key={k} className="bg-white p-3">
            <div className="h-2 w-12 animate-pulse rounded bg-zinc-200" />
            <div className="mt-2 h-3 w-20 animate-pulse rounded bg-zinc-200" />
          </div>
        ))}
      </div>
      <div className="space-y-2 p-4">
        <div className="h-3 w-2/3 animate-pulse rounded bg-zinc-200" />
        <div className="h-3 w-full animate-pulse rounded bg-zinc-200" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-zinc-200" />
      </div>
    </section>
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
      <section className="rounded-md border border-zinc-300 bg-white px-4 py-3">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-red-600">
          Analysis unavailable
        </p>
        <p className="mt-1 text-[12px] leading-relaxed text-zinc-600">{error}</p>
      </section>
    );
  }

  if (!analysis) return null;

  const items: Array<[string, string]> = [
    ["Loan size", analysis.loanSize],
    ["LTV", analysis.ltv],
    ["Sponsor", analysis.sponsor],
    ["Sector", analysis.sector],
    ["Exit", analysis.exitStrategy],
    ["Term", analysis.term]
  ];

  return (
    <section
      className="overflow-hidden rounded-md border border-zinc-200 bg-white"
      aria-label="Junior deal analysis"
    >
      {/* Header band */}
      <header className="flex items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50/60 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-pulse rounded-full bg-red-500" />
          </span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-zinc-900">
            Junior · Analysis
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[9.5px] uppercase tracking-[0.28em] text-zinc-400">
          <span>
            CONF{" "}
            <strong className="tabular-nums text-zinc-900">{analysis.confidence}%</strong>
          </span>
          <span aria-hidden>·</span>
          <span
            className={cn(
              "rounded-sm border px-1 py-px tracking-[0.22em]",
              analysis.mandateFit.pass
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-red-400 bg-white text-red-600"
            )}
          >
            {analysis.mandateFit.pass ? "PASS" : "FAIL"}
          </span>
        </div>
      </header>

      {/* Data grid (hairline lines) */}
      <dl className="grid grid-cols-2 gap-px bg-zinc-200 sm:grid-cols-3">
        {items.map(([k, v]) => (
          <div key={k} className="flex flex-col bg-white px-4 py-2.5">
            <dt className="font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-zinc-400">
              {k}
            </dt>
            <dd className="mt-0.5 text-[12.5px] font-semibold leading-snug text-zinc-900">
              {v}
            </dd>
          </div>
        ))}
      </dl>

      {/* Mandate reason */}
      <div className="border-t border-zinc-200 px-4 py-3">
        <p className="font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-zinc-400">
          Mandate fit
        </p>
        <p className="mt-1 text-[12.5px] leading-relaxed text-zinc-700">
          {analysis.mandateFit.reason}
        </p>
      </div>

      {/* Risk flags */}
      <div className="border-t border-zinc-200 px-4 py-3">
        <p className="font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-zinc-400">
          Risk flags · {analysis.riskFlags.length}
        </p>
        <ul className="mt-2 divide-y divide-zinc-100">
          {analysis.riskFlags.slice(0, 6).map((r, i) => (
            <li
              key={i}
              className="grid grid-cols-[10px_36px_1fr] items-start gap-2.5 py-1.5"
            >
              <span
                className={cn("mt-1.5 h-1.5 w-1.5 rounded-full", sevDot[r.severity])}
                aria-hidden
              />
              <span className="font-mono text-[9px] font-bold tracking-[0.22em] text-zinc-500">
                {sevLabel[r.severity]}
              </span>
              <span className="text-[12px] leading-snug text-zinc-700">{r.flag}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Pattern observations (collapsible) */}
      <details className="group border-t border-zinc-200">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-2 text-[11px] font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 marker:content-none [&::-webkit-details-marker]:hidden">
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.32em] text-zinc-500">
            Pattern memory · 247 cases · 31 post-mortems
          </span>
          <span className="font-mono text-[10px] text-zinc-400 transition-transform group-open:rotate-180">
            ▾
          </span>
        </summary>
        <div className="border-t border-zinc-200 bg-zinc-50/40 px-4 py-3">
          <ul className="list-disc space-y-1 pl-4 text-[12px] leading-relaxed text-zinc-700">
            {analysis.patternObservations.map((o, i) => (
              <li key={i}>{o}</li>
            ))}
          </ul>
        </div>
      </details>

      {/* Footer meta */}
      <footer className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50/60 px-4 py-2 font-mono text-[9.5px] uppercase tracking-[0.28em] text-zinc-400">
        <span>Junior 1.4 · sterile/light</span>
        <span>{analyzedLabel ?? "—"}</span>
      </footer>
    </section>
  );
}
