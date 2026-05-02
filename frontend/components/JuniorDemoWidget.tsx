"use client";

import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";

const DEMO_CSS = `
.junior-dem-thought-enter { animation: junior-dem-thought 0.4s ease-out forwards; }
@keyframes junior-dem-thought {
  from { opacity: 0; transform: translateX(8px); }
  to { opacity: 1; transform: translateX(0); }
}
.junior-dem-stage-enter { animation: junior-dem-stage 0.4s ease-out forwards; }
@keyframes junior-dem-stage {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
.junior-dem-read-band {
  will-change: top, opacity;
}
.junior-dem-read-band.animate {
  animation: junior-dem-read-band 2.85s cubic-bezier(0.33, 0, 0.22, 1) forwards;
}
@keyframes junior-dem-read-band {
  0% { top: 4px; opacity: 0; }
  6% { opacity: 1; }
  18% { opacity: 1; }
  50% { opacity: 0.9; }
  88% { opacity: 0.55; }
  100% { top: calc(100% - 40px); opacity: 0; }
}
.junior-dem-read-shine {
  will-change: top, opacity;
}
.junior-dem-read-shine.animate {
  animation: junior-dem-read-shine 2.85s cubic-bezier(0.33, 0, 0.22, 1) forwards;
}
@keyframes junior-dem-read-shine {
  0% { top: 2px; opacity: 0; left: 50%; transform: translate(-50%, 0) scaleX(0.88); }
  10% { opacity: 1; }
  88% { opacity: 0.75; }
  100% { top: calc(100% - 10px); opacity: 0; left: 50%; transform: translate(-50%, 0) scaleX(1); }
}
.junior-dem-b2-surface-a { transition: opacity 0.45s cubic-bezier(0.33, 0, 0.2, 1), transform 0.45s cubic-bezier(0.33, 0, 0.2, 1), filter 0.45s ease; }
.junior-dem-b2-surface-b { transition: opacity 0.5s cubic-bezier(0.22, 0, 0.2, 1), transform 0.5s cubic-bezier(0.22, 0, 0.2, 1); }
.junior-dem-brain-ring.pulsing {
  animation: junior-dem-ring 1.4s ease-out infinite;
}
@keyframes junior-dem-ring {
  from { transform: scale(1); opacity: 0.6; }
  to { transform: scale(1.6); opacity: 0; }
}
.junior-dem-fade-in { animation: junior-dem-fade 0.4s ease forwards; }
@keyframes junior-dem-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
.junior-dem-source-in { animation: junior-dem-source-in 0.65s cubic-bezier(0.22, 0.6, 0.2, 1) forwards; }
@keyframes junior-dem-source-in {
  0% { opacity: 0; transform: translateX(-10px); filter: blur(2px); }
  60% { opacity: 1; filter: blur(0); }
  100% { opacity: 1; transform: translateX(0); filter: blur(0); }
}
.junior-dem-source-icon { animation: junior-dem-source-icon 0.7s cubic-bezier(0.22, 0.8, 0.2, 1) forwards; }
@keyframes junior-dem-source-icon {
  0% { transform: scale(0.6); opacity: 0; }
  60% { transform: scale(1.08); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
.junior-dem-caret {
  display: inline-block;
  width: 1px;
  height: 1em;
  margin-left: 1px;
  vertical-align: -2px;
  background: #242424;
  animation: junior-dem-caret 1s steps(1) infinite;
}
@keyframes junior-dem-caret {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
.junior-dem-shell-in { animation: junior-dem-shell-in 0.45s cubic-bezier(0.22, 0.6, 0.2, 1) forwards; }
@keyframes junior-dem-shell-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
.junior-dem-attach-in { animation: junior-dem-attach-in 0.5s cubic-bezier(0.22, 0.6, 0.2, 1) forwards; }
@keyframes junior-dem-attach-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
.junior-dem-time-saved { animation: junior-dem-timesaved 0.4s ease forwards; }
@keyframes junior-dem-timesaved {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
.junior-dem-sheet-in { animation: junior-dem-sheet-in 0.5s cubic-bezier(0.22, 0, 0.2, 1) forwards; transform-origin: 90% 0%; }
@keyframes junior-dem-sheet-in {
  from { opacity: 0; transform: scale(0.965) translateY(6px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.junior-dem-cell-pop { animation: junior-dem-cell-pop 1.05s ease-out forwards; }
@keyframes junior-dem-cell-pop {
  0% { background-color: #fff5b8; box-shadow: inset 0 0 0 1px rgba(218, 165, 32, 0.7); }
  60% { background-color: #fff5b8; box-shadow: inset 0 0 0 1px rgba(218, 165, 32, 0.7); }
  100% { background-color: transparent; box-shadow: inset 0 0 0 1px transparent; }
}
.junior-dem-row-pop { animation: junior-dem-row-pop 0.45s ease-out forwards; opacity: 0; }
@keyframes junior-dem-row-pop {
  from { opacity: 0; transform: translateY(2px); }
  to { opacity: 1; transform: translateY(0); }
}
.junior-dem-recalc-progress { animation: junior-dem-recalc-progress 1.3s ease-in-out forwards; }
@keyframes junior-dem-recalc-progress {
  from { width: 0%; }
  to { width: 100%; }
}
.junior-dem-flow { animation: junior-dem-flow 1.4s linear infinite; }
@keyframes junior-dem-flow {
  from { stroke-dashoffset: 0; }
  to { stroke-dashoffset: -16; }
}
.junior-dem-orb-pulse { animation: junior-dem-orb-pulse 1.6s ease-out infinite; }
@keyframes junior-dem-orb-pulse {
  0% { box-shadow: 0 0 0 0 rgba(107, 79, 187, 0.55); }
  70% { box-shadow: 0 0 0 14px rgba(107, 79, 187, 0); }
  100% { box-shadow: 0 0 0 0 rgba(107, 79, 187, 0); }
}
@media (prefers-reduced-motion: reduce) {
  .junior-dem-read-band.animate,
  .junior-dem-read-shine.animate { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
  .junior-dem-b2-surface-a,
  .junior-dem-b2-surface-b,
  .junior-dem-sheet-in,
  .junior-dem-cell-pop,
  .junior-dem-row-pop,
  .junior-dem-recalc-progress,
  .junior-dem-flow,
  .junior-dem-orb-pulse,
  .junior-dem-source-in,
  .junior-dem-source-icon,
  .junior-dem-shell-in,
  .junior-dem-attach-in { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  .junior-dem-caret { animation: none !important; opacity: 0 !important; }
}
`;

function cn(...parts: (string | false | undefined | null)[]) {
  return parts.filter(Boolean).join(" ");
}

const HL = {
  green: cn(
    "rounded-[6px] px-0.5 transition-all duration-[400ms] ease-in-out",
    "[text-decoration-thickness:2px]"
  ),
  amber: cn(
    "rounded-[6px] px-0.5 transition-all duration-[400ms] ease-in-out",
    "[text-decoration-thickness:2px]"
  ),
  red: cn(
    "rounded-[6px] px-0.5 transition-all duration-[400ms] ease-in-out",
    "[text-decoration-thickness:2px]"
  )
};

const hlActive = {
  green: cn(
    HL.green,
    "bg-[#EAF3DE] text-[#27500A] underline decoration-[#1D9E75]"
  ),
  amber: cn(
    HL.amber,
    "bg-[#FAEEDA] text-[#633806] underline decoration-[#BA7517]"
  ),
  red: cn(HL.red, "bg-[#FCEBEB] text-[#791F1F] underline decoration-[#A32D2D]")
};

const hlIdle = {
  green: cn(HL.green, "bg-transparent text-inherit no-underline decoration-transparent"),
  amber: cn(HL.amber, "bg-transparent text-inherit no-underline decoration-transparent"),
  red: cn(HL.red, "bg-transparent text-inherit no-underline decoration-transparent")
};

const BEAT1_THOUGHTS: { color: keyof typeof hlActive; text: string }[] = [
  {
    color: "green",
    text: "Acme Developments: I remember them from 2024, that Manchester PBSA deal. Performed well. Good sign."
  },
  {
    color: "red",
    text: "GDV £18.5m for a 24-unit conversion in NW1? Feels punchy. Need to check Land Registry comps."
  },
  {
    color: "amber",
    text: "71% peak LTV, at the edge of our mandate. Need to verify the cost stack."
  },
  {
    color: "red",
    text: "5% contingency? That is thin for a conversion. Build risk concern."
  },
  {
    color: "amber",
    text: "Dec 18 close, that is a Q4 rush. Wasn\u2019t there a post-mortem about this?"
  }
];

type Beat1Task = {
  color: keyof typeof hlActive;
  task: string;
  meta: string;
  minutes: number;
};

const BEAT1_TASKS: Beat1Task[] = [
  {
    color: "green",
    task: "Pull Acme\u2019s 2024 Manchester PBSA file from SharePoint history",
    meta: "Refresh memory on covenant performance and exit timing",
    minutes: 25
  },
  {
    color: "red",
    task: "Run NW1 comparable transactions on Land Registry",
    meta: "Cross-check stated GDV against agent files and recent trades",
    minutes: 50
  },
  {
    color: "amber",
    task: "Sense-check mandate fit with a senior associate",
    meta: "Peak LTV brushing the upper band \u2014 want a second pair of eyes",
    minutes: 30
  },
  {
    color: "red",
    task: "Pull the cost stack from James and benchmark contingency",
    meta: "Compare against portfolio average for resi conversions",
    minutes: 45
  },
  {
    color: "amber",
    task: "Surface the Reading Bridge Q4 post-mortem from IC archive",
    meta: "Flag the rules likely to bite a Q4 rush close",
    minutes: 35
  }
];

function formatMinutes(total: number) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

const borderSoft = "border border-[rgba(0,0,0,0.08)]";
const sectionTint = "bg-[#EFEDE7] rounded-[12px] border border-[rgba(0,0,0,0.08)]";
const btnPrimary =
  "inline-flex items-center justify-center rounded-[6px] bg-[#1A1A1A] px-4 py-1.5 text-[12px] text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50";
const btnSecondary =
  "inline-flex items-center justify-center rounded-[6px] border border-[rgba(0,0,0,0.08)] bg-white px-4 py-1.5 text-[12px] text-[#1A1A1A] opacity-60 transition-opacity hover:opacity-100";

type StepMark = "check" | "warn" | "arrow";

const monoFont = {
  fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace"
} as const;

/** Fluent / Microsoft 365 web stack (Segoe first, then fallbacks) */
const msFont =
  "'Segoe UI', 'Segoe UI Web (West European)', 'Helvetica Neue', Helvetica, system-ui, -apple-system, sans-serif";

const outlookCard =
  "overflow-hidden rounded-[2px] border border-[#edebe9] bg-white shadow-[0_1.6px_3.6px_rgba(0,0,0,0.132),0_0.3px_0.9px_rgba(0,0,0,0.108)]";

type RadarSource = {
  title: string;
  body: string;
  glyph: string;
  bg: string;
};

const RADAR_SOURCES: RadarSource[] = [
  {
    title: "Press \u00b7 People signal",
    body: "Acme Developments: COO Sarah Lin departure announced",
    glyph: "P",
    bg: "#a4262c"
  },
  {
    title: "Land Registry",
    body: "NW1 comp transacted at \u00a31,180/sqft (\u22128% vs assumption)",
    glyph: "L",
    bg: "#005a9e"
  },
  {
    title: "BoE \u00b7 Monetary policy",
    body: "+25bps base rate hike; ONS build cost inflation +3.5%",
    glyph: "\u00a3",
    bg: "#1a1a1a"
  },
  {
    title: "Companies House",
    body: "Acme: quarterly accounts overdue 8 days",
    glyph: "C",
    bg: "#107c41"
  }
];

type AlertToken = { text: string; bold?: boolean };
type AlertParagraph = { tokens: AlertToken[]; muted?: boolean };

const ALERT_PARAGRAPHS: AlertParagraph[] = [
  {
    tokens: [
      { text: "Macro update: " },
      { text: "BoE +25bps", bold: true },
      { text: " base rate hike and " },
      { text: "ONS build cost inflation +3.5%", bold: true },
      { text: ". Re-running risk-adjusted models against current portfolio exposure." }
    ]
  },
  {
    muted: true,
    tokens: [
      {
        text: "Two active facilities cross the high-risk threshold. Risk-adjusted workbooks attached for review before the next IC."
      }
    ]
  }
];

const ALERT_TOTAL_LEN = ALERT_PARAGRAPHS.reduce(
  (sum, p) => sum + p.tokens.reduce((s, t) => s + t.text.length, 0),
  0
);

function TypedAlertBody({ visibleLen, done }: { visibleLen: number; done: boolean }) {
  let remaining = visibleLen;
  let cumulativeBefore = 0;

  const rendered = ALERT_PARAGRAPHS.map((para, pi) => {
    const paraLen = para.tokens.reduce((s, t) => s + t.text.length, 0);
    if (cumulativeBefore >= visibleLen) {
      cumulativeBefore += paraLen;
      return null;
    }

    const paraTaken = Math.min(paraLen, visibleLen - cumulativeBefore);
    cumulativeBefore += paraLen;

    let paraRemaining = paraTaken;
    const nodes: ReactNode[] = [];

    for (let ti = 0; ti < para.tokens.length; ti++) {
      const tok = para.tokens[ti];
      if (paraRemaining <= 0) break;
      const slice = tok.text.slice(0, paraRemaining);
      paraRemaining -= slice.length;
      const node = tok.bold ? (
        <strong key={ti} className="font-semibold">
          {slice}
        </strong>
      ) : (
        <span key={ti}>{slice}</span>
      );
      nodes.push(node);
    }

    const isLastVisible = !done && remaining <= paraTaken;
    remaining -= paraTaken;

    return (
      <p key={pi} className={cn(pi === 0 ? "m-0" : "mt-1.5 m-0", para.muted && "text-[#605e5c]")}>
        {nodes}
        {isLastVisible ? <span className="junior-dem-caret" aria-hidden /> : null}
      </p>
    );
  });

  return <>{rendered}</>;
}

type SheetTone = "negative" | "positive" | "neutral";

type SheetAssumption = {
  label: string;
  base: string;
  adj: string;
  delta: string;
  source: string;
  tone: SheetTone;
};

type SheetOutput = {
  metric: string;
  base: string;
  adj: string;
  flag: string;
  tone: SheetTone;
};

type SheetData = {
  file: string;
  workbook: string;
  deal: string;
  exposure: string;
  cellRef: string;
  formula: string;
  assumptions: SheetAssumption[];
  outputs: SheetOutput[];
  footer: string;
};

const SHEETS: Record<"camden" | "reading", SheetData> = {
  camden: {
    file: "Camden Bridge — Risk-Adjusted.xlsx",
    workbook: "CAMDEN_BRIDGE_RA_v3",
    deal: "Camden Bridge · £12m senior · drawn",
    exposure: "Drawn £8.4m · Peak LTV 71%",
    cellRef: "C9",
    formula: "=RiskAdjustedIRR(Inputs!B3:B12, Macro!Rates_BoE_Apr26, Macro!Build_Inflation)",
    assumptions: [
      {
        label: "Exit GDV",
        base: "£18.5m",
        adj: "£17.0m",
        delta: "−8.1%",
        source: "Land Registry · NW1 comp Apr 26",
        tone: "negative"
      },
      {
        label: "Build cost inflation",
        base: "0.0%",
        adj: "+3.5%",
        delta: "+£133k hard cost",
        source: "ONS / BoE Apr 2026 print",
        tone: "negative"
      },
      {
        label: "Senior cost of debt",
        base: "8.20%",
        adj: "8.95%",
        delta: "+75bps",
        source: "BoE +25bps · spread widening",
        tone: "negative"
      },
      {
        label: "Contingency (modelled)",
        base: "5.0%",
        adj: "7.5%",
        delta: "mandate floor",
        source: "Junior policy rule",
        tone: "neutral"
      },
      {
        label: "Sponsor risk premium",
        base: "0bps",
        adj: "+50bps",
        delta: "key-person",
        source: "Press scrape · COO departure",
        tone: "negative"
      }
    ],
    outputs: [
      { metric: "Junior IRR", base: "14.2%", adj: "9.4%", flag: "covenant-watch", tone: "negative" },
      { metric: "Senior ICR · Y2", base: "1.42x", adj: "1.08x", flag: "headroom 4%", tone: "negative" },
      { metric: "Default probability", base: "4.5%", adj: "12.8%", flag: "high", tone: "negative" },
      { metric: "Equity cushion", base: "29%", adj: "16%", flag: "monitor", tone: "negative" }
    ],
    footer: "Source · Camden Bridge model v3 · Junior recalc 4 cells · 0.42s"
  },
  reading: {
    file: "Reading Bridge — Risk-Adjusted.xlsx",
    workbook: "READING_BRIDGE_RA_v2",
    deal: "Reading Bridge · £24m senior refi",
    exposure: "Drawn £18.7m · Refi window opens Sep 26",
    cellRef: "C7",
    formula: "=RefiDSCR(Inputs!B3:B11, Macro!Rates_BoE_Apr26)",
    assumptions: [
      {
        label: "Refi exit value",
        base: "£42.0m",
        adj: "£40.0m",
        delta: "−4.8%",
        source: "Comparables · Q1 2026",
        tone: "negative"
      },
      {
        label: "Senior cost of debt",
        base: "7.95%",
        adj: "8.70%",
        delta: "+75bps",
        source: "BoE +25bps · refi pricing",
        tone: "negative"
      },
      {
        label: "ICR floor (covenant)",
        base: "1.30x",
        adj: "1.30x",
        delta: "held",
        source: "Facility doc · §6.4",
        tone: "neutral"
      },
      {
        label: "Sponsor liquidity",
        base: "Adequate",
        adj: "Tight",
        delta: "covenant-watch",
        source: "Companies House · accounts late",
        tone: "negative"
      },
      {
        label: "Refi market window",
        base: "240 days",
        adj: "190 days",
        delta: "−50 days",
        source: "Junior · refi calendar",
        tone: "negative"
      }
    ],
    outputs: [
      { metric: "Refi DSCR", base: "1.42x", adj: "1.21x", flag: "thin", tone: "negative" },
      { metric: "ICR vs covenant", base: "+12%", adj: "−7%", flag: "breach risk", tone: "negative" },
      { metric: "Default probability", base: "3.1%", adj: "9.6%", flag: "elevated", tone: "negative" },
      { metric: "Refi headroom", base: "£3.2m", adj: "£0.6m", flag: "monitor", tone: "negative" }
    ],
    footer: "Source · Reading Bridge refi model v2 · Junior recalc 3 cells · 0.38s"
  }
};

function ChapterHead({
  index,
  slug,
  title,
  subtitle,
  subtitleAlign = "left"
}: {
  index: string;
  slug: string;
  title: string;
  subtitle?: string;
  subtitleAlign?: "center" | "left";
}) {
  return (
    <header
      className={cn(
        "mb-6 md:mb-8",
        subtitleAlign === "center" ? "mx-auto max-w-[720px] text-center" : "max-w-[720px]"
      )}
    >
      <p className="m-0 font-mono text-[10px] uppercase tracking-[0.12em] text-[#8A8A8A]" style={monoFont}>
        {index} · {slug}
      </p>
      <h2 className="mt-2.5 m-0 text-[clamp(1.35rem,3.8vw,1.875rem)] font-medium leading-[1.2] tracking-[-0.02em] text-[#1A1A1A]">
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "mt-3 m-0 text-[14px] font-normal leading-[1.6] text-[#5C5C5C]",
            subtitleAlign === "center" && "mx-auto max-w-[34rem]"
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}

function StepRow({
  mark,
  color,
  children,
  onClick,
  expanded,
  pressedLabel,
  caption
}: {
  mark: StepMark;
  color: "green" | "amber" | "purple";
  children: React.ReactNode;
  onClick?: () => void;
  expanded?: boolean;
  pressedLabel?: string;
  caption?: string;
}) {
  const circle =
    color === "green"
      ? "bg-[#1D9E75]"
      : color === "amber"
        ? "bg-[#BA7517]"
        : "bg-[#6B4FBB]";
  const sym = mark === "check" ? "✓" : mark === "warn" ? "⚠" : "→";
  const text = (
    <span className="m-0 block text-[11.5px] leading-[1.45] text-[#1A1A1A]">{children}</span>
  );
  const row = (
    <>
      <div
        className={cn(
          "flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full text-[9px] text-white",
          circle
        )}
      >
        {sym}
      </div>
      <span className="min-w-0 flex-1">
        {text}
        {caption ? (
          <span
            className="mt-1 block font-mono text-[9px] uppercase tracking-[0.08em] text-[#6B4FBB]"
            style={monoFont}
          >
            {caption}
          </span>
        ) : null}
      </span>
    </>
  );
  const pad = cn(
    "flex gap-2.5 rounded-[6px] border border-[#E8E3FA] bg-white px-2.5 py-[7px]",
    expanded && onClick ? "ring-2 ring-[#6B4FBB]/35" : ""
  );
  if (onClick) {
    return (
      <button
        type="button"
        aria-expanded={expanded}
        aria-label={pressedLabel}
        className={cn(
          pad,
          "w-full cursor-pointer text-left transition-[background-color,box-shadow] hover:bg-[#fafbff]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B4FBB]/35"
        )}
        onClick={onClick}
      >
        {row}
      </button>
    );
  }
  return <div className={pad}>{row}</div>;
}

function ExcelSheetView({
  data,
  sheetKey,
  onBack,
  onSwitch,
  activeKey
}: {
  data: SheetData;
  sheetKey: number;
  onBack: () => void;
  onSwitch: (key: "camden" | "reading") => void;
  activeKey: "camden" | "reading";
}) {
  const toneText = (tone: SheetTone) =>
    tone === "negative" ? "text-[#a4262c]" : tone === "positive" ? "text-[#107c10]" : "text-[#323130]";

  return (
    <div
      key={sheetKey}
      className="junior-dem-sheet-in absolute inset-0 z-20 flex flex-col overflow-hidden rounded-[2px] border border-[#d2d0ce] bg-white shadow-[0_18px_48px_rgba(0,0,0,0.18)]"
      style={{ fontFamily: msFont }}
      role="region"
      aria-label={`Risk-adjusted spreadsheet for ${data.deal}`}
    >
      <div className="flex items-center gap-1 border-b border-[#0e6b3b] bg-[#107c41] px-2 py-1 text-white">
        <button
          type="button"
          className="flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[11.5px] font-medium hover:bg-white/10 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white"
          onClick={onBack}
          aria-label="Back to Junior alert"
        >
          <span className="text-[14px] leading-none" aria-hidden>
            ←
          </span>
          Back
        </button>
        <span className="text-white/40" aria-hidden>
          |
        </span>
        <span className="flex h-[18px] w-[18px] items-center justify-center rounded-sm bg-white/15 text-[11px] font-bold">
          X
        </span>
        <span className="truncate text-[11px] font-semibold">
          {data.file} · Excel for the web
        </span>
        <span className="ml-auto hidden gap-1 sm:flex">
          {["AutoSave", "Share"].map((lab) => (
            <span key={lab} className="rounded-sm bg-white/10 px-1.5 py-0.5 text-[10px]">
              {lab}
            </span>
          ))}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-1 border-b border-[#d2d0ce] bg-[#f3f2f1] px-2 py-1 text-[11px] text-[#323130]">
        {["File", "Home", "Insert", "Formulas", "Data", "Review"].map((lab, i) => (
          <span
            key={lab}
            className={cn(
              "rounded-sm px-1.5 py-0.5",
              i === 1 ? "bg-white font-semibold text-[#107c41] shadow-[inset_0_-2px_0_#107c41]" : "hover:bg-white"
            )}
          >
            {lab}
          </span>
        ))}
        <span className="text-[#c8c6c4]" aria-hidden>
          |
        </span>
        <span className="rounded-sm bg-white px-1.5 py-0.5 text-[10px] text-[#605e5c]">
          {data.workbook}
        </span>
      </div>
      <div className="flex items-center gap-2 border-b border-[#d2d0ce] bg-white px-2 py-1 text-[11px]">
        <span className="rounded-sm border border-[#c8c6c4] bg-[#faf9f8] px-2 py-0.5 font-mono text-[10px] text-[#323130]" style={monoFont}>
          {data.cellRef}
        </span>
        <span className="text-[#c8c6c4]" aria-hidden>
          fx
        </span>
        <span className="truncate font-mono text-[10.5px] text-[#107c41]" style={monoFont}>
          {data.formula}
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto bg-white">
        <div className="border-b border-[#edebe9] px-3 pb-2 pt-3">
          <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.04em] text-[#605e5c]">
            Workbook · Risk-adjusted scenario
          </p>
          <p className="mt-1 m-0 text-[14px] font-semibold text-[#201f1e]">{data.deal}</p>
          <p className="mt-0.5 m-0 text-[11px] text-[#605e5c]">{data.exposure}</p>
          <div className="relative mt-2 h-[3px] overflow-hidden rounded-full bg-[#edebe9]">
            <div
              key={`progress-${sheetKey}`}
              className="junior-dem-recalc-progress absolute inset-y-0 left-0 rounded-full bg-[#107c41]"
            />
          </div>
          <p className="mt-1 m-0 text-[10px] text-[#605e5c]">
            Recalculating linked cells against latest macro inputs…
          </p>
        </div>

        <div className="px-3 pt-2">
          <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,0.9fr)_minmax(0,0.85fr)_minmax(0,1.4fr)] border border-[#d2d0ce] text-[11px]">
            <div className="border-b border-[#d2d0ce] bg-[#f3f2f1] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.04em] text-[#323130]">
              Assumption
            </div>
            <div className="border-b border-l border-[#d2d0ce] bg-[#f3f2f1] px-2 py-1 text-right text-[10px] font-semibold uppercase tracking-[0.04em] text-[#323130]">
              Base
            </div>
            <div className="border-b border-l border-[#d2d0ce] bg-[#f3f2f1] px-2 py-1 text-right text-[10px] font-semibold uppercase tracking-[0.04em] text-[#323130]">
              Risk-adj
            </div>
            <div className="border-b border-l border-[#d2d0ce] bg-[#f3f2f1] px-2 py-1 text-right text-[10px] font-semibold uppercase tracking-[0.04em] text-[#323130]">
              Δ
            </div>
            <div className="border-b border-l border-[#d2d0ce] bg-[#f3f2f1] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.04em] text-[#323130]">
              Source
            </div>
            {data.assumptions.map((row, idx) => {
              const delay = `${idx * 110 + 100}ms`;
              const cellAnim: React.CSSProperties = {
                animationDelay: delay
              };
              return (
                <div key={row.label} className="contents text-[11.5px]">
                  <div className="border-b border-[#edebe9] bg-[#faf9f8] px-2 py-1 text-[#201f1e]">
                    {row.label}
                  </div>
                  <div className="border-b border-l border-[#edebe9] px-2 py-1 text-right tabular-nums text-[#605e5c]">
                    {row.base}
                  </div>
                  <div
                    className={cn(
                      "junior-dem-cell-pop border-b border-l border-[#edebe9] px-2 py-1 text-right tabular-nums font-semibold",
                      toneText(row.tone)
                    )}
                    style={cellAnim}
                  >
                    {row.adj}
                  </div>
                  <div
                    className={cn(
                      "junior-dem-cell-pop border-b border-l border-[#edebe9] px-2 py-1 text-right tabular-nums",
                      toneText(row.tone)
                    )}
                    style={cellAnim}
                  >
                    {row.delta}
                  </div>
                  <div className="border-b border-l border-[#edebe9] px-2 py-1 text-[10.5px] text-[#605e5c]">
                    {row.source}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-3 px-3">
          <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.04em] text-[#605e5c]">
            Output · Risk-adjusted metrics
          </p>
          <div className="mt-1 grid gap-2 sm:grid-cols-2">
            {data.outputs.map((o, idx) => (
              <div
                key={o.metric}
                className="junior-dem-row-pop rounded-sm border border-[#edebe9] bg-[#faf9f8] px-2.5 py-2"
                style={{ animationDelay: `${550 + idx * 90}ms`, animationFillMode: "forwards" }}
              >
                <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.04em] text-[#605e5c]">
                  {o.metric}
                </p>
                <div className="mt-1 flex items-baseline gap-2 text-[14px] font-semibold tabular-nums">
                  <span className="text-[#605e5c] line-through">{o.base}</span>
                  <span className="text-[#605e5c]" aria-hidden>
                    →
                  </span>
                  <span className={cn(toneText(o.tone))}>{o.adj}</span>
                </div>
                <p className={cn("mt-0.5 m-0 text-[10px] uppercase tracking-[0.04em]", toneText(o.tone))}>
                  {o.flag}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 border-t border-[#edebe9] px-3 py-2 text-[10px] text-[#605e5c]">{data.footer}</div>
      </div>
      <div className="flex items-center gap-1 border-t border-[#d2d0ce] bg-[#f3f2f1] px-2 py-1">
        {(
          [
            ["camden", "Camden Bridge · RA"],
            ["reading", "Reading Bridge · RA"]
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => onSwitch(key)}
            className={cn(
              "rounded-t-sm px-2 py-0.5 text-[10.5px] transition-colors",
              activeKey === key
                ? "bg-white font-semibold text-[#107c41] shadow-[inset_0_-2px_0_#107c41]"
                : "text-[#605e5c] hover:bg-white"
            )}
          >
            {label}
          </button>
        ))}
        <span className="ml-auto text-[10px] text-[#605e5c]">Ready · Calculated</span>
      </div>
    </div>
  );
}

type StackNode = {
  id: "outlook" | "gmail" | "claude" | "sharepoint" | "drive" | "signals";
  side: "left" | "right";
  y: number;
  badge: string;
  badgeTone: "blue" | "purple" | "green" | "amber";
  label: string;
  sub: string;
  detail: string;
};

const STACK_NODES: StackNode[] = [
  {
    id: "outlook",
    side: "left",
    y: 22,
    badge: "Email surface",
    badgeTone: "blue",
    label: "Microsoft Outlook",
    sub: "Plug-in lives in the reading pane.",
    detail:
      "Reads inbound mail and threads, posts replies into Drafts (never sent silently), and surfaces alerts inline next to the message."
  },
  {
    id: "gmail",
    side: "left",
    y: 70,
    badge: "Email surface",
    badgeTone: "blue",
    label: "Google Workspace · Gmail",
    sub: "Same plug-in contract for Workspace funds.",
    detail:
      "Identical Drafts contract on Gmail. Junior never sends external mail without an explicit human Tier-3 approval."
  },
  {
    id: "claude",
    side: "right",
    y: 14,
    badge: "Reasoning",
    badgeTone: "purple",
    label: "Claude API",
    sub: "Reasoning engine.",
    detail:
      "Reads, classifies, extracts, and drafts. Tool-gated and structured-output only — Claude calls tools, Junior runs them, governance tiers gate the result."
  },
  {
    id: "sharepoint",
    side: "right",
    y: 38,
    badge: "Firm corpus",
    badgeTone: "green",
    label: "Microsoft Graph · SharePoint",
    sub: "Permissioned firm retrieval.",
    detail:
      "Sponsor histories, mandate rules, deal libraries, signed memos, prior IC packs. Read with the analyst's own Graph permissions — Junior cannot escalate scope."
  },
  {
    id: "drive",
    side: "right",
    y: 62,
    badge: "Firm corpus",
    badgeTone: "green",
    label: "Google Drive · Docs",
    sub: "Workspace-side bridge.",
    detail:
      "Drive + Docs mirror of the SharePoint surface for funds on Google. Same retrieval contract, same permission model."
  },
  {
    id: "signals",
    side: "right",
    y: 86,
    badge: "Radar",
    badgeTone: "amber",
    label: "External signals",
    sub: "Background macro + filings sweep.",
    detail:
      "Companies House, Land Registry, ONS, BoE, and curated press feeds. Polled on a schedule, cached locally, cross-checked against the active book."
  }
];

const stackBadgeTone: Record<StackNode["badgeTone"], string> = {
  blue: "bg-[#deecf9] text-[#0078d4] border-[#0078d4]/30",
  purple: "bg-[#ece4f7] text-[#5c2d91] border-[#6b4fbb]/35",
  green: "bg-[#dff6e3] text-[#0e6b3b] border-[#107c41]/30",
  amber: "bg-[#fcebd3] text-[#8e562e] border-[#ca5010]/30"
};

function StackDiagram() {
  const [active, setActive] = useState<StackNode["id"] | null>(null);
  const node = active ? STACK_NODES.find((n) => n.id === active) ?? null : null;

  return (
    <div className="space-y-3">
      <div
        className="relative h-[420px] overflow-hidden rounded-[12px] border border-[rgba(0,0,0,0.08)] bg-white p-3 sm:h-[440px]"
        onMouseLeave={() => setActive(null)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setActive(null);
        }}
      >
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          {STACK_NODES.map((n) => {
            const x1 = n.side === "left" ? 32 : 68;
            const y1 = n.y;
            const x2 = 50;
            const y2 = 50;
            const isActive = active === n.id;
            return (
              <g key={n.id}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isActive ? "#6B4FBB" : "#d6cff0"}
                  strokeWidth={isActive ? 0.6 : 0.35}
                  strokeDasharray="1.5 1.5"
                  vectorEffect="non-scaling-stroke"
                />
                {isActive ? (
                  <line
                    className="junior-dem-flow"
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#6B4FBB"
                    strokeWidth={1}
                    strokeDasharray="3 5"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    opacity={0.85}
                  />
                ) : null}
              </g>
            );
          })}
        </svg>

        <div
          className="pointer-events-none absolute z-10 flex flex-col items-center"
          style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
        >
          <div
            className={cn(
              "relative flex h-[88px] w-[88px] items-center justify-center rounded-full border border-[#E8E3FA] bg-[#FAF9FE] transition-transform",
              active && "scale-105"
            )}
          >
            <div
              className={cn(
                "flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#6B4FBB] text-[15px] font-semibold text-white",
                active && "junior-dem-orb-pulse"
              )}
            >
              J
            </div>
          </div>
          <p
            className="mt-2 m-0 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[#3C3489]"
            style={monoFont}
          >
            Junior runtime
          </p>
          <p className="m-0 max-w-[140px] text-center text-[9.5px] leading-snug text-[#605e5c]">
            Orchestrator, governance tiers, audit log
          </p>
        </div>

        {STACK_NODES.map((n) => {
          const isActive = active === n.id;
          return (
            <button
              key={n.id}
              type="button"
              onMouseEnter={() => setActive(n.id)}
              onFocus={() => setActive(n.id)}
              onBlur={() => setActive((cur) => (cur === n.id ? null : cur))}
              onClick={() => setActive((cur) => (cur === n.id ? null : n.id))}
              className={cn(
                "absolute z-20 w-[44%] max-w-[220px] rounded-[10px] border bg-white p-2.5 text-left transition-[border-color,box-shadow,transform] duration-200 sm:w-[40%]",
                isActive
                  ? "border-[#6B4FBB] shadow-[0_8px_22px_-10px_rgba(107,79,187,0.55),0_0_0_1px_rgba(107,79,187,0.25)] -translate-y-[1px]"
                  : "border-[#edebe9] hover:border-[#cfc8ec] hover:shadow-[0_4px_14px_-8px_rgba(60,52,137,0.35)]"
              )}
              style={{
                top: `${n.y}%`,
                left: n.side === "left" ? "2%" : "98%",
                transform: n.side === "left" ? "translate(0, -50%)" : "translate(-100%, -50%)",
                fontFamily: msFont
              }}
              aria-pressed={isActive}
            >
              <span
                className={cn(
                  "inline-block rounded-sm border px-1.5 py-px text-[9px] font-semibold uppercase tracking-[0.04em]",
                  stackBadgeTone[n.badgeTone]
                )}
              >
                {n.badge}
              </span>
              <p className="mt-1 m-0 text-[12px] font-semibold leading-tight text-[#201f1e]">
                {n.label}
              </p>
              <p className="mt-0.5 m-0 text-[10.5px] leading-snug text-[#605e5c]">{n.sub}</p>
            </button>
          );
        })}
      </div>

      <div
        className={cn(outlookCard, "min-h-[64px] px-3 py-2 transition-colors", node ? "border-[#cfc8ec]" : "")}
        style={{ fontFamily: msFont }}
        aria-live="polite"
      >
        {node ? (
          <>
            <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#5c2d91]">
              {node.badge} · {node.label}
            </p>
            <p className="mt-1 m-0 text-[12px] leading-[1.55] text-[#242424]">{node.detail}</p>
          </>
        ) : (
          <p className="m-0 text-[11.5px] italic leading-relaxed text-[#605e5c]">
            Hover or tap any node to trace the wire into Junior.
          </p>
        )}
      </div>
    </div>
  );
}

export function JuniorDemoWidget() {
  const [b1Count, setB1Count] = useState(0);
  const [b2Stage, setB2Stage] = useState(0);
  const [b2DraftComposerOpen, setB2DraftComposerOpen] = useState(false);
  const [scanKey, setScanKey] = useState(0);
  const [b3Tier, setB3Tier] = useState<1 | 2 | 3 | null>(null);
  const [b4Streams, setB4Streams] = useState([false, false, false, false]);
  const [b4BrainPulse, setB4BrainPulse] = useState(false);
  const [b4BrainScale, setB4BrainScale] = useState(false);
  const [b4Alert, setB4Alert] = useState(false);
  const [b4ActiveSheet, setB4ActiveSheet] = useState<null | "camden" | "reading">(null);
  const [b4SheetKey, setB4SheetKey] = useState(0);
  const [b4TypedLen, setB4TypedLen] = useState(0);
  const [b4TypingDone, setB4TypingDone] = useState(false);
  const b4Timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const b4TypeInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const b4Session = useRef(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const [scrollBeat, setScrollBeat] = useState(0);

  const clearB4TimersOnly = useCallback(() => {
    b4Timers.current.forEach(clearTimeout);
    b4Timers.current = [];
    if (b4TypeInterval.current) {
      clearInterval(b4TypeInterval.current);
      b4TypeInterval.current = null;
    }
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const secs = [...root.querySelectorAll<HTMLElement>("[data-junior-beat-ix]")];
    if (!secs.length) return;

    const scrollRoot = root.closest<HTMLElement>("[data-junior-demo-scroll-root]");

    const obs = new IntersectionObserver(
      (entries) => {
        let bestIx = 0;
        let bestRatio = 0;
        for (const e of entries) {
          const el = e.target as HTMLElement;
          const ix = Number(el.dataset.juniorBeatIx);
          if (Number.isNaN(ix)) continue;
          if (e.intersectionRatio >= bestRatio) {
            bestRatio = e.intersectionRatio;
            bestIx = ix;
          }
        }
        if (bestRatio >= 0.11) setScrollBeat(bestIx);
      },
      {
        root: scrollRoot ?? null,
        rootMargin: "-30% 0px -38% 0px",
        threshold: [0.05, 0.11, 0.22, 0.4]
      }
    );

    secs.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const scrollToBeat = (ix: number) => {
    const sel = rootRef.current?.querySelector<HTMLElement>(`[data-junior-beat-ix="${ix}"]`);
    sel?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const runB4Replay = useCallback(() => {
    b4Session.current += 1;
    const sid = b4Session.current;
    clearB4TimersOnly();

    setB4Streams([false, false, false, false]);
    setB4BrainPulse(false);
    setB4BrainScale(false);
    setB4Alert(false);
    setB4ActiveSheet(null);
    setB4TypedLen(0);
    setB4TypingDone(false);

    const wrap = (fn: () => void) => () => {
      if (b4Session.current !== sid) return;
      fn();
    };

    const t = (fn: () => void, ms: number) => {
      b4Timers.current.push(setTimeout(wrap(fn), ms));
    };

    t(() => setB4Streams(() => [true, false, false, false]), 0);
    t(() => setB4Streams(() => [true, true, false, false]), 750);
    t(() => setB4Streams(() => [true, true, true, false]), 1500);
    t(() => setB4Streams(() => [true, true, true, true]), 2250);

    t(() => {
      setB4BrainPulse(true);
      setB4BrainScale(true);
    }, 2400);

    t(() => {
      setB4BrainPulse(false);
      setB4Alert(true);
      setB4TypedLen(0);
      setB4TypingDone(false);

      if (b4TypeInterval.current) {
        clearInterval(b4TypeInterval.current);
        b4TypeInterval.current = null;
      }
      b4TypeInterval.current = setInterval(() => {
        if (b4Session.current !== sid) {
          if (b4TypeInterval.current) {
            clearInterval(b4TypeInterval.current);
            b4TypeInterval.current = null;
          }
          return;
        }
        setB4TypedLen((n) => {
          const next = n + 2;
          if (next >= ALERT_TOTAL_LEN) {
            if (b4TypeInterval.current) {
              clearInterval(b4TypeInterval.current);
              b4TypeInterval.current = null;
            }
            setB4TypingDone(true);
            return ALERT_TOTAL_LEN;
          }
          return next;
        });
      }, 22);
    }, 3700);
  }, [clearB4TimersOnly]);

  useEffect(
    () => () => {
      b4Timers.current.forEach(clearTimeout);
      b4Timers.current = [];
      if (b4TypeInterval.current) {
        clearInterval(b4TypeInterval.current);
        b4TypeInterval.current = null;
      }
    },
    []
  );

  const beat1Next = () => {
    if (b1Count >= BEAT1_THOUGHTS.length) return;
    setB1Count((c) => c + 1);
  };

  const beat1Reset = () => setB1Count(0);

  const beat2Run = () => {
    if (b2Stage >= 3) return;
    const next = b2Stage + 1;
    setB2Stage(next);
    if (next === 1) setScanKey((k) => k + 1);
  };

  const beat2Reset = () => {
    setB2Stage(0);
    setB2DraftComposerOpen(false);
    setScanKey((k) => k + 1);
  };

  const b2Labels = ["▶ Run stage 1: Intake & chase", "▶ Run stage 2: Reasoning", "▶ Run stage 3: Recommendation", "✓ Complete"];

  const b2Timer =
    b2Stage === 0 ? "…" : b2Stage === 1 ? "8s" : b2Stage === 2 ? "24s" : "32s · done";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: DEMO_CSS }} />
      <div
        ref={rootRef}
        className="junior-demo-root mx-auto w-full max-w-[840px] pb-28 text-[13px] leading-normal text-[#1A1A1A] antialiased selection:bg-[#E8E3FA]"
        style={{ fontFamily: "inherit", backgroundColor: "#F7F6F3" }}
      >
        <header className="snap-start snap-always box-border flex min-h-dvh flex-col justify-center border-b border-[rgba(0,0,0,0.08)] px-3 pb-14 pt-12 md:pb-20 md:pt-14">
          <p className="m-0 font-mono text-[10px] uppercase tracking-[0.14em] text-[#8A8A8A]" style={monoFont}>
            Junior · Pitch deck · Made by KLC (Kiara, Lee, Cosmin)
          </p>
          <h1 className="mt-5 m-0 max-w-[36ch] text-[clamp(1.75rem,5.2vw,3.15rem)] font-medium leading-[1.08] tracking-[-0.03em] text-[#1A1A1A]">
            A tool designed to replace junior credit analysts
          </h1>
          <p className="mt-6 max-w-[36rem] text-[clamp(0.95rem,2.1vw,1.0625rem)] font-normal leading-[1.65] text-[#5C5C5C]">
            Junior is an AI junior analyst built for{" "}
            <span className="text-[#1A1A1A]">private credit diligence</span>, absorbing the grunt work across
            every deal thread, enforcing what your mandate already implies, and pausing before anything irreversible.
            Recommends. Never decides.
          </p>

          <div className="mt-10 grid max-w-xl grid-cols-1 gap-6 border-t border-[rgba(0,0,0,0.08)] pt-8 sm:grid-cols-3 sm:gap-4">
            <div>
              <p className="m-0 font-mono text-[9px] uppercase tracking-[0.12em] text-[#8A8A8A]" style={monoFont}>
                Time saved
              </p>
              <p className="mt-1 m-0 text-[clamp(1.25rem,3vw,1.5rem)] font-medium tracking-tight text-[#1A1A1A] tabular-nums">
                ≈12h / wk
              </p>
              <p className="mt-1 m-0 text-[11px] text-[#5C5C5C]">Reclaimed per analyst</p>
            </div>
            <div>
              <p className="m-0 font-mono text-[9px] uppercase tracking-[0.12em] text-[#8A8A8A]" style={monoFont}>
                Market
              </p>
              <p className="mt-1 m-0 text-[clamp(1.25rem,3vw,1.5rem)] font-medium tracking-tight text-[#6B4FBB] tabular-nums">
                $2.1T
              </p>
              <p className="mt-1 m-0 text-[11px] text-[#5C5C5C]">Global private credit AUM</p>
            </div>
            <div>
              <p className="m-0 font-mono text-[9px] uppercase tracking-[0.12em] text-[#8A8A8A]" style={monoFont}>
                In scope
              </p>
              <p className="mt-1 m-0 text-[clamp(1.25rem,3vw,1.5rem)] font-medium tracking-tight text-[#1A1A1A] tabular-nums">
                1,800+
              </p>
              <p className="mt-1 m-0 text-[11px] text-[#5C5C5C]">Active private credit funds</p>
            </div>
          </div>

          <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.14em] text-[#8A8A8A]" style={monoFont}>
            Live demo · Scroll and click. You pace the room
          </p>
        </header>

        {/* PRELUDE A · Reasoning */}
        <section data-junior-beat-ix={0} className="snap-start snap-always box-border flex min-h-dvh flex-col justify-center px-1 py-8">
          <ChapterHead
            index="A"
            slug="Why"
            title="Built from first-hand experience in credit."
            subtitle="Kiara, one of our team members, interned at a real estate private credit fund and identified three core pain points in the workflow."
            subtitleAlign="center"
          />

          <div className={cn(sectionTint, "p-4 md:p-5")}>
            <p
              className="m-0 mb-3 font-mono text-[10px] uppercase tracking-[0.1em] text-[#8A8A8A]"
              style={monoFont}
            >
              Three problems credit funds quietly live with
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              {(
                [
                  {
                    n: "01",
                    title: "Hours lost to admin work.",
                    sub: "Reading broker threads, pulling sponsor history, populating models, chasing missing files. Before the thinking even starts."
                  },
                  {
                    n: "02",
                    title: "Knowledge trapped in senior heads.",
                    sub: "The unwritten mandate rules, the deal post-mortems, the \u201cwe don\u2019t do that anymore\u201d \u2014 they live in three people, not in any system."
                  },
                  {
                    n: "03",
                    title: "Real-time risk signals nobody\u2019s watching.",
                    sub: "Macro prints, filings, comps, key-person moves. They surface at covenant review, when it is already late."
                  }
                ] as const
              ).map((p) => (
                <div
                  key={p.n}
                  className={cn("rounded-[8px] bg-white p-3", borderSoft)}
                >
                  <p
                    className="m-0 font-mono text-[10px] uppercase tracking-[0.12em] text-[#A32D2D]"
                    style={monoFont}
                  >
                    {p.n} · Pain
                  </p>
                  <p className="mt-1.5 m-0 text-[12.5px] font-semibold leading-snug text-[#1A1A1A]">
                    {p.title}
                  </p>
                  <p className="mt-1.5 m-0 text-[11.5px] leading-[1.55] text-[#5C5C5C]">{p.sub}</p>
                </div>
              ))}
            </div>

            <p
              className="m-0 mb-3 mt-6 font-mono text-[10px] uppercase tracking-[0.1em] text-[#8A8A8A]"
              style={monoFont}
            >
              One product. Three problems addressed.
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              {(
                [
                  {
                    n: "01",
                    title: "Does the grunt work for you.",
                    sub: "Populating models, drafting replies, chasing what is outstanding."
                  },
                  {
                    n: "02",
                    title: "Applies your fund\u2019s unwritten rules to every deal.",
                    sub: "Mandate fit, contingency floors, concentration caps, post-mortem rules \u2014 enforced without rewriting the policy doc."
                  },
                  {
                    n: "03",
                    title: "Alerts you about market signals you might have missed.",
                    sub: "Quiet macro moves and filings cross-checked against your live book, surfaced before they become covenant problems."
                  }
                ] as const
              ).map((p) => (
                <div
                  key={p.n}
                  className={cn("rounded-[8px] border border-[#E8E3FA] bg-[#FAF9FE] p-3")}
                >
                  <p
                    className="m-0 font-mono text-[10px] uppercase tracking-[0.12em] text-[#3C3489]"
                    style={monoFont}
                  >
                    {p.n} · Junior
                  </p>
                  <p className="mt-1.5 m-0 text-[12.5px] font-semibold leading-snug text-[#1A1A1A]">
                    {p.title}
                  </p>
                  <p className="mt-1.5 m-0 text-[11.5px] leading-[1.55] text-[#5C5C5C]">{p.sub}</p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-center text-[12.5px] font-medium text-[#1A1A1A]">
              Recommends. Never decides.
            </p>
          </div>
        </section>

        {/* PRELUDE B · Stack */}
        <section data-junior-beat-ix={1} className="snap-start snap-always box-border flex min-h-dvh flex-col justify-center px-1 py-8">
          <ChapterHead
            index="B"
            slug="Stack"
            title="How Junior is wired."
            subtitle="Lives in your inbox. Reasons with Claude. Grounded in your firm’s data, with permissioned retrieval and a background watch on the macro."
            subtitleAlign="center"
          />

          <div className={cn(sectionTint, "p-4 md:p-5")}>
            <StackDiagram />
          </div>
        </section>

        {/* BEAT 1 */}
        <section data-junior-beat-ix={2} className="snap-start snap-always box-border flex min-h-dvh flex-col justify-center px-1 py-8">
          <ChapterHead
            index="01"
            slug="Burden"
            title="Where the analyst's afternoon actually goes."
            subtitle="One broker email, five honest second-thoughts, and the queue of small tasks that follows each one before any model can be trusted."
          />

          <div className={cn(sectionTint, "p-4")}>
          <div className="grid gap-4 md:grid-cols-[1fr_240px]">
            <div className={outlookCard}>
              <div
                className="flex items-center gap-2 border-b border-[#edebe9] bg-[#f3f2f1] px-3 py-1.5"
                style={{ fontFamily: msFont }}
              >
                <span className="text-[10px] font-semibold text-[#323130]">Focused</span>
                <span className="text-[#c8c6c4]" aria-hidden>
                  |
                </span>
                <span className="truncate text-[10px] text-[#605e5c]">Inbox · KLC Credit</span>
              </div>
              <div className="border-b border-[#edebe9] bg-white px-3 pb-2.5 pt-3" style={{ fontFamily: msFont }}>
                <p className="m-0 text-[15px] font-semibold leading-snug text-[#242424]">
                  Camden High St · £12m bridge opportunity
                </p>
                <div className="mt-2 flex flex-wrap gap-x-2 gap-y-0.5 text-[11px] text-[#605e5c]">
                  <span>
                    <span className="font-medium text-[#323130]">From</span> James Holloway · james@halkin-capital.com
                  </span>
                  <span className="hidden text-[#c8c6c4] sm:inline" aria-hidden>
                    ·
                  </span>
                  <span>Received Mon 6:42 AM</span>
                </div>
              </div>
              <div className="px-3 py-3 text-[12px] leading-[1.55] text-[#242424]" style={{ fontFamily: msFont }}>
                <div className="space-y-2 leading-relaxed">
                  <p className="m-0">Hi Kiara,</p>
                  <p className="m-0">
                    Hope you had a good weekend. Sending across a bridge opportunity in Camden,{" "}
                    <span className={b1Count >= 1 ? hlActive.green : hlIdle.green}>
                      £12m, sponsored by Acme Developments
                    </span>
                    .
                  </p>
                  <p className="m-0">
                    Asset is a 24-unit residential conversion at 47 Camden High Street, NW1.{" "}
                    <span className={b1Count >= 2 ? hlActive.red : hlIdle.red}>Stated GDV £18.5m</span>, exit via unit
                    sales. Loan terms{" "}
                    <span className={b1Count >= 3 ? hlActive.amber : hlIdle.amber}>
                      65% LTV at origination, peak 71%
                    </span>
                    , 18-month tenor.
                  </p>
                  <p className="m-0">
                    Site cost £11.2m, build cost £3.8m,{" "}
                    <span className={b1Count >= 4 ? hlActive.red : hlIdle.red}>contingency £190k</span>. Targeting close
                    by <span className={b1Count >= 5 ? hlActive.amber : hlIdle.amber}>18 December</span>.
                  </p>
                  <p className="m-0">
                    Teaser attached. Happy to jump on a call.
                    <br />
                    Best, James
                  </p>
                </div>
                <p className="mt-3 border-t border-[#edebe9] pt-2 text-[11px] text-[#605e5c]">
                  <span className="inline-flex items-center gap-1">
                    <span className="rounded-sm border border-[#8a8886] px-1 py-px text-[10px] font-medium text-[#323130]">
                      1 attachment
                    </span>
                    Teaser_Camden_BRIDGE.pdf
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p
                className="m-0 font-mono text-[10px] uppercase tracking-[0.1em] text-[#8A8A8A]"
                style={{ fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace" }}
              >
                Her internal monologue
              </p>
              <div className="min-h-[200px] space-y-2">
                {b1Count === 0 ? (
                  <p className="m-0 text-[11px] italic leading-relaxed text-[#8A8A8A]">
                    Click &apos;Next thought&apos; to step through.
                  </p>
                ) : (
                  BEAT1_THOUGHTS.slice(0, b1Count).map((thought, idx) => {
                    const bor =
                      thought.color === "green"
                        ? "border-l-[#1D9E75]"
                        : thought.color === "amber"
                          ? "border-l-[#BA7517]"
                          : "border-l-[#A32D2D]";
                    return (
                      <div
                        key={idx}
                        className={cn(
                          "junior-dem-thought-enter rounded-[6px] border border-[rgba(0,0,0,0.08)] bg-white py-2 pl-2.5 pr-2 border-l-[3px]",
                          bor
                        )}
                      >
                        <p className="m-0 text-[11px] italic leading-relaxed text-[#5C5C5C]">
                          “{thought.text}”
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {b1Count >= BEAT1_TASKS.length ? (
            <div
              key="b1-queue"
              className={cn(outlookCard, "junior-dem-stage-enter mt-4 border-l-[3px] border-l-[#0078d4]")}
              style={{ fontFamily: msFont }}
            >
              <div className="flex items-center justify-between gap-2 border-b border-[#edebe9] bg-[#f3f2f1] px-3 py-1.5">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex h-[16px] w-[16px] items-center justify-center rounded-sm bg-[#0078d4] text-[9px] font-bold text-white" aria-hidden>
                    ✓
                  </span>
                  <span className="truncate text-[10.5px] font-semibold text-[#323130]">
                    Kiara&apos;s queue · before she replies to one broker
                  </span>
                </div>
                <span className="shrink-0 rounded bg-white px-1.5 py-px text-[9px] font-medium text-[#605e5c] shadow-sm tabular-nums">
                  {BEAT1_TASKS.length} / {BEAT1_TASKS.length} added
                </span>
              </div>
              <div className="px-3 py-3">
                <ul className="m-0 list-none space-y-1 p-0">
                  {BEAT1_TASKS.map((t, idx) => {
                    const dot =
                      t.color === "green"
                        ? "border-[#1D9E75] bg-[#EAF3DE]"
                        : t.color === "amber"
                          ? "border-[#BA7517] bg-[#FAEEDA]"
                          : "border-[#A32D2D] bg-[#FCEBEB]";
                    return (
                      <li
                        key={idx}
                        className="junior-dem-thought-enter flex items-start gap-2.5 rounded-[4px] border border-[#edebe9] bg-white px-2.5 py-2 hover:bg-[#faf9f8]"
                        style={{ animationDelay: `${idx * 70}ms`, animationFillMode: "both" }}
                      >
                        <span
                          className={cn(
                            "mt-[2px] flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-sm border-2 bg-white",
                            dot
                          )}
                          aria-hidden
                        />
                        <div className="min-w-0 flex-1">
                          <p className="m-0 text-[11.5px] font-semibold leading-snug text-[#201f1e]">
                            {t.task}
                          </p>
                          <p className="mt-0.5 m-0 text-[10.5px] leading-snug text-[#605e5c]">{t.meta}</p>
                        </div>
                        <span className="shrink-0 self-start rounded-sm border border-[#edebe9] bg-[#faf9f8] px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-[#323130]">
                          {t.minutes} min
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="border-t border-[#edebe9] bg-[#faf9f8] px-3 py-2">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="m-0 text-[10.5px] font-semibold uppercase tracking-[0.04em] text-[#605e5c]">
                    Total queued
                  </p>
                  <p className="m-0 text-[14px] font-semibold tabular-nums text-[#201f1e]">
                    {formatMinutes(BEAT1_TASKS.reduce((sum, t) => sum + t.minutes, 0))}
                    <span className="ml-2 text-[10.5px] font-normal text-[#605e5c]">
                      across {BEAT1_TASKS.length} tasks · still seated, hasn&apos;t replied
                    </span>
                  </p>
                </div>
                <p className="mt-2 m-0 text-[11px] leading-[1.55] text-[#5C5C5C]">
                  Three hours and change spent on a single broker thread, before she has even drafted the reply or
                  populated the model. Then the next email lands. This is the grunt work Junior is built to absorb,
                  without losing any of the second-thinking.
                </p>
              </div>
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              className={btnPrimary}
              onClick={beat1Next}
              disabled={b1Count >= BEAT1_THOUGHTS.length}
            >
              {b1Count >= BEAT1_THOUGHTS.length ? "✓ All 5 shown" : "▶ Next thought"}
            </button>
            <button type="button" className={btnSecondary} onClick={beat1Reset}>
              ↺ Reset
            </button>
            <span
              className="font-mono text-[11px] text-[#5C5C5C]"
              style={{ fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace" }}
            >
              {b1Count} / 5
            </span>
          </div>
        </div>
        </section>

        {/* BEAT 2 */}
        <section data-junior-beat-ix={3} className="snap-start snap-always box-border flex min-h-dvh flex-col justify-center px-1 py-8">
          <ChapterHead
            index="02"
            slug="Parity"
            title="A day’s work, in 32 seconds."
            subtitle="The same email, analysed by Junior. Same checks, same recommendation, end to end."
            subtitleAlign="center"
          />

          <div className="mb-5 flex flex-wrap items-center justify-center gap-2 text-[11px]" style={{ fontFamily: msFont }}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(0,0,0,0.08)] bg-white px-3 py-1 text-[#5C5C5C]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8A8A8A]" aria-hidden />
              Human analyst
              <span className="ml-1 font-semibold tabular-nums text-[#1A1A1A]">≈ 4–6h</span>
            </span>
            <span className="font-mono text-[10px] tracking-[0.18em] text-[#8A8A8A]" aria-hidden>
              VS
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1A1A1A] px-3 py-1 text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-[#A78BFA]" aria-hidden />
              Junior
              <span className="ml-1 font-semibold tabular-nums">32s</span>
            </span>
          </div>

          <div className={cn(sectionTint, "p-4")}>
            <div className="relative isolate min-h-[min(520px,78dvh)]">
              <div
                className={cn(
                  "junior-dem-b2-surface-a",
                  b2DraftComposerOpen
                    ? "pointer-events-none blur-[0.5px] [transform:translateX(-8px)_scale(0.985)] opacity-0"
                    : "opacity-100 [transform:translateX(0)_scale(1)]"
                )}
                aria-hidden={b2DraftComposerOpen}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <div className={cn(outlookCard, "relative")}>
                    <div
                      className="flex items-center justify-between gap-2 border-b border-[#edebe9] bg-[#f3f2f1] px-2 py-1"
                      style={{ fontFamily: msFont }}
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="text-[10px] font-semibold text-[#323130]">Focused</span>
                        <span className="text-[#c8c6c4]" aria-hidden>
                          |
                        </span>
                        <span className="truncate text-[10px] text-[#605e5c]">Inbox · KLC Credit</span>
                      </div>
                      <span className="shrink-0 rounded bg-white px-1.5 py-px text-[9px] font-medium text-[#0078d4] shadow-sm">
                        Synced
                      </span>
                    </div>
                    <div className="border-b border-[#edebe9] bg-white px-3 pb-2.5 pt-3" style={{ fontFamily: msFont }}>
                      <p className="m-0 text-[15px] font-semibold leading-snug text-[#242424]">
                        Camden High St · £12m bridge
                      </p>
                      <div className="mt-2 flex flex-wrap gap-x-2 gap-y-0.5 text-[11px] text-[#605e5c]">
                        <span>
                          <span className="font-medium text-[#323130]">From</span> James Holloway
                        </span>
                        <span className="text-[#c8c6c4]" aria-hidden>
                          ·
                        </span>
                        <span>To Kiara Okonkwo</span>
                        <span className="text-[#c8c6c4]" aria-hidden>
                          ·
                        </span>
                        <span>Mon 6:42 AM</span>
                      </div>
                    </div>
                    <div className="relative min-h-[148px] px-3 py-3 pb-4 text-[12.5px] leading-[1.6] text-[#242424]" style={{ fontFamily: msFont }}>
                      <p className="m-0">
                        Hi Kiara, Bridge opportunity in Camden, £12m, sponsored by Acme Developments. 24-unit
                        residential conversion at 47 Camden High Street, NW1. Stated GDV £18.5m. 65% LTV at
                        origination, peak 71%, 18-month tenor. Build cost £3.8m, contingency £190k. Targeting close by
                        18 December.
                      </p>
                      <div
                        key={scanKey}
                        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
                        aria-hidden
                      >
                        <div className="relative h-full w-full">
                          <div
                            className={cn(
                              "junior-dem-read-shine absolute left-1/2 top-0 h-[5px] w-[88%] rounded-full opacity-0",
                              "bg-gradient-to-r from-transparent via-[#0078d4]/45 to-transparent shadow-[0_0_12px_rgba(0,120,212,0.35)]",
                              b2Stage >= 1 && "animate"
                            )}
                          />
                          <div
                            className={cn(
                              "junior-dem-read-band absolute inset-x-4 top-0 h-[40px] rounded-[10px] opacity-0",
                              "bg-gradient-to-b from-[rgba(207,228,250,0)] via-[rgba(0,103,184,0.12)] to-[rgba(207,228,250,0)]",
                              b2Stage >= 1 && "animate"
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={cn(
                      outlookCard,
                      "border-l-[3px] border-l-[#6b4fbb] bg-[#faf9f8]",
                      "flex min-h-0 flex-col p-3"
                    )}
                  >
                    <div className="mb-3 flex items-center justify-between gap-2 border-b border-[#edebe9] pb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-[24px] w-[24px] items-center justify-center rounded-sm text-[11px] font-semibold text-white"
                          style={{ background: "linear-gradient(145deg, #8764c8, #5c3d99)" }}
                        >
                          J
                        </div>
                        <div style={{ fontFamily: msFont }}>
                          <p className="m-0 text-[12px] font-semibold text-[#323130]">Junior for Outlook</p>
                          <p className="m-0 text-[10px] text-[#605e5c]">Read &amp; completeness</p>
                        </div>
                      </div>
                      <span className="tabular-nums rounded border border-[#edebe9] bg-white px-2 py-0.5 text-[10px] font-medium text-[#605e5c]" style={{ fontFamily: msFont }}>
                        {b2Timer}
                      </span>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto">
                      {b2Stage === 0 && (
                        <p className="m-0 text-[11px] leading-relaxed text-[#605e5c]" style={{ fontFamily: msFont }}>
                          Run stage 1 to simulate Graph mail intake and Junior&apos;s staged read.
                        </p>
                      )}
                      {b2Stage === 1 && (
                        <div key="b2-stage-1" className="junior-dem-stage-enter space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className="m-0 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#107c10]"
                              style={{ fontFamily: msFont }}
                            >
                              Stage 1 · Intake &amp; chase
                            </p>
                            <span
                              className="rounded-sm border border-[#edebe9] bg-white px-1.5 py-0.5 text-[9px] font-medium text-[#605e5c]"
                              style={{ fontFamily: msFont }}
                            >
                              1 / 3
                            </span>
                          </div>
                          <StepRow mark="check" color="green">
                            <strong className="font-semibold text-[#1A1A1A]">Read mail + attachment metadata.</strong>{" "}
                            Extracted 14 deal terms, sponsor identity, asset details.
                          </StepRow>
                          <StepRow mark="check" color="green">
                            <strong className="font-semibold text-[#1A1A1A]">Completeness check.</strong> Detailed cost
                            breakdown missing. Latest Red Book valuation missing.
                          </StepRow>
                          <StepRow
                            mark="arrow"
                            color="purple"
                            onClick={() => setB2DraftComposerOpen(true)}
                            expanded={b2DraftComposerOpen}
                            caption="Outlook Drafts · open compose"
                            pressedLabel="Open draft reply to James in compose view"
                          >
                            <strong className="font-semibold text-[#1A1A1A]">Drafted reply to James</strong> requesting
                            the detailed cost breakdown and your latest Red Book valuation. Saved to Drafts pending
                            send.
                          </StepRow>
                        </div>
                      )}
                      {b2Stage === 2 && (
                        <div key="b2-stage-2" className="junior-dem-stage-enter space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className="m-0 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#ca5010]"
                              style={{ fontFamily: msFont }}
                            >
                              Stage 2 · Reasoning
                            </p>
                            <span
                              className="rounded-sm border border-[#edebe9] bg-white px-1.5 py-0.5 text-[9px] font-medium text-[#605e5c]"
                              style={{ fontFamily: msFont }}
                            >
                              2 / 3
                            </span>
                          </div>
                          <StepRow mark="check" color="green">
                            <strong className="font-semibold text-[#1A1A1A]">Sponsor history.</strong> Acme: 1 prior
                            deal (Manchester PBSA, performing). Press flag: COO departed Apr 2026.
                          </StepRow>
                          <StepRow mark="check" color="green">
                            <strong className="font-semibold text-[#1A1A1A]">Mandate fit.</strong> All criteria pass
                            except concentration (38% London resi).
                          </StepRow>
                          <StepRow mark="warn" color="amber">
                            <strong className="font-semibold text-[#1A1A1A]">Sense-checks.</strong> Contingency 5% vs
                            your 7.5% average · GDV +8% vs NW1 comps · Q4 close matches Reading Bridge post-mortem
                            rule.
                          </StepRow>
                        </div>
                      )}
                      {b2Stage === 3 && (
                        <div key="b2-stage-3" className="junior-dem-stage-enter space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className="m-0 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#5c2d91]"
                              style={{ fontFamily: msFont }}
                            >
                              Stage 3 · Recommendation
                            </p>
                            <span
                              className="rounded-sm border border-[#edebe9] bg-white px-1.5 py-0.5 text-[9px] font-medium text-[#605e5c]"
                              style={{ fontFamily: msFont }}
                            >
                              3 / 3
                            </span>
                          </div>
                          <StepRow mark="check" color="green">
                            <strong className="font-semibold text-[#1A1A1A]">Model populated.</strong> Base IRR
                            14.2% · Junior-adjusted (−10% GDV) 12.4% · downside 9.1%.
                          </StepRow>
                          <StepRow mark="arrow" color="purple">
                            <strong className="font-semibold text-[#1A1A1A]">Recommendation:</strong> pursue, but push
                            back on James about contingency, Q4 timing, and COO replacement before IC.
                          </StepRow>
                        </div>
                      )}
                    </div>

                    {b2Stage >= 3 && (
                      <p
                        className="junior-dem-time-saved m-0 mt-3 flex items-center justify-center gap-1.5 border-t border-[#edebe9] pt-2 text-center text-[11px] text-[#107c41]"
                        style={{ fontFamily: msFont }}
                      >
                        <span aria-hidden>✓</span>
                        Recommendation ready in 32s.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  "junior-dem-b2-surface-b absolute inset-0 z-10 flex flex-col overflow-hidden rounded-[2px] border border-[#edebe9] bg-[#f3f2f1]",
                  "shadow-[0_12px_36px_rgba(0,0,0,0.18)]",
                  b2DraftComposerOpen
                    ? "pointer-events-auto opacity-100 [transform:translateX(0)_scale(1)]"
                    : "pointer-events-none opacity-0 [transform:translateX(16px)_scale(0.992)]"
                )}
                style={{ fontFamily: msFont }}
                aria-hidden={!b2DraftComposerOpen}
              >
                <div className="flex items-center gap-1 border-b border-[#edebe9] bg-[#f3f2f1] px-1 py-1">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-sm px-2 py-1 text-[12px] font-medium text-[#0078d4] transition-colors hover:bg-[#edebe9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#0078d4]"
                    onClick={() => setB2DraftComposerOpen(false)}
                  >
                    <span className="text-[14px] leading-none" aria-hidden>
                      ←
                    </span>
                    Back
                  </button>
                  <span className="text-[#c8c6c4]" aria-hidden>
                    |
                  </span>
                  <span className="truncate text-[11px] text-[#605e5c]">Draft · Message</span>
                  <span className="ml-auto shrink-0 rounded-full border border-[#8a8886] bg-white px-2 py-0.5 text-[10px] font-medium text-[#323130]">
                    Unsent draft
                  </span>
                </div>
                <div className="border-b border-[#d2d0ce] bg-white px-2 py-1.5">
                  <div className="flex flex-wrap gap-1 text-[10px] text-[#323130]">
                    {["File", "Message", "Insert", "Options"].map((lab) => (
                      <span key={lab} className="rounded-sm px-2 py-1 hover:bg-[#f3f2f1]">
                        {lab}
                      </span>
                    ))}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {["Send", "Discard", "Sensitivity", "Important"].map((lab) => (
                      <span
                        key={lab}
                        className={cn(
                          "rounded-[2px] px-2 py-0.5 text-[10px]",
                          lab === "Send" ? "border border-[#8a8886] bg-[#f3f2f1]" : "opacity-90"
                        )}
                      >
                        {lab}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto bg-white">
                  <div className="space-y-0 border-b border-[#edebe9] px-3 py-2 text-[12px]">
                    <div className="flex min-h-[32px] items-start border-b border-[#f3f2f1] py-1">
                      <span className="w-[52px] shrink-0 pt-0.5 text-[11px] text-[#605e5c]">To</span>
                      <span className="text-[#242424]">
                        James Holloway &lt;james@halkin-capital.com&gt;
                      </span>
                    </div>
                    <div className="flex min-h-[30px] items-start border-b border-[#f3f2f1] py-1">
                      <span className="w-[52px] shrink-0 pt-0.5 text-[11px] text-[#605e5c]">Cc</span>
                      <span className="text-[#c8c6c4]">Optional</span>
                    </div>
                    <div className="flex min-h-[32px] items-start py-1">
                      <span className="w-[52px] shrink-0 pt-0.5 text-[11px] text-[#605e5c]">Subject</span>
                      <span className="font-medium text-[#242424]">
                        Camden High Street: supplementary materials requested
                      </span>
                    </div>
                  </div>
                  <div className="px-3 pb-3 pt-3 text-[12.5px] leading-[1.6] text-[#242424]">
                    <p className="m-0">James, thanks for forwarding the teaser.</p>
                    <p className="mt-2 m-0 text-[#605e5c]">
                      To move this into proper review, please share (i) your detailed{" "}
                      <strong className="font-medium text-[#242424]">cost stack</strong> / development budget and (ii)
                      the <strong className="font-medium text-[#242424]">latest Red Book</strong> on 47 Camden High Street
                      (or instructed valuer confirmation).
                    </p>
                    <p className="mt-2 m-0">Reply when ready.</p>
                    <p className="mt-6 m-0">Kiara</p>
                  </div>
                  <div className="border-t border-[#edebe9] bg-[#faf9f8] px-3 py-2 text-[10px] text-[#605e5c]">
                    Folder: <span className="font-medium text-[#323130]">Drafts</span> · Brokers · Halkin · Camden Bridge
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              className={btnPrimary}
              onClick={beat2Run}
              disabled={b2Stage >= 3}
            >
              {b2Labels[Math.min(b2Stage, 3)]}
            </button>
            <button type="button" className={btnSecondary} onClick={beat2Reset}>
              ↺ Reset
            </button>
            <span
              className="font-mono text-[11px] text-[#5C5C5C]"
              style={{ fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace" }}
            >
              stage {b2Stage} / 3
            </span>
          </div>
        </section>

        {/* BEAT 3 · Firm data & mandate */}
        <section data-junior-beat-ix={4} className="snap-start snap-always box-border flex min-h-dvh flex-col justify-center px-1 py-8">
          <ChapterHead
            index="03"
            slug="Grounding"
            title="Built on firm memory"
            subtitle="Junior connects to sanctioned SharePoint libraries (Graph API, permissioned scopes), retrieves deck history and models you already stored, then checks every inbound deal against editable mandate rules, not generic benchmarks."
            subtitleAlign="center"
          />

          <div className={cn(sectionTint, "p-4")}>
            <p className="m-0 mb-4 font-mono text-[10px] uppercase tracking-[0.1em] text-[#185FA5]" style={monoFont}>
              Firm corpus
            </p>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(240px,300px)]">
              <div
                className={cn(
                  "flex min-h-[300px] flex-col overflow-hidden rounded-[2px] border border-[#edebe9] bg-white",
                  "shadow-[0_1px_2px_rgba(0,0,0,0.14),0_0_2px_rgba(0,0,0,0.12)]"
                )}
              >
                <div className="flex items-center gap-2 border-b border-[#edebe9] bg-[#faf9f8] px-3 py-2">
                  <div className="flex gap-1" aria-hidden>
                    <span className="h-2 w-2 rounded-full bg-[#ee7a73]" />
                    <span className="h-2 w-2 rounded-full bg-[#f5bf4f]" />
                    <span className="h-2 w-2 rounded-full bg-[#6bb700]" />
                  </div>
                  <p
                    className="m-0 min-w-0 flex-1 truncate text-center text-[10px] text-[#605e5c]"
                    style={{ fontFamily: msFont }}
                  >
                    klc-am.sharepoint.com · DealLibrary · All Documents
                  </p>
                </div>
                <div className="border-b border-[#edebe9] bg-white px-2 py-1">
                  <div className="flex flex-wrap gap-1 text-[11px]" style={{ fontFamily: msFont }}>
                    <span className="rounded-sm px-2 py-0.5 hover:bg-[#f3f2f1]">+ New</span>
                    <span className="rounded-sm px-2 py-0.5 hover:bg-[#f3f2f1]">↑ Upload</span>
                    <span className="rounded-sm px-2 py-0.5 hover:bg-[#f3f2f1]">↻ Sync</span>
                    <span className="rounded-sm px-2 py-0.5 hover:bg-[#f3f2f1]">Filters</span>
                  </div>
                </div>
                <div className="border-b border-[#edebe9] bg-[#faf9f8] px-3 py-1.5">
                  <p className="m-0 text-[11px] text-[#323130]" style={{ fontFamily: msFont }}>
                    <span className="text-[#0078d4]">Home</span>
                    <span className="text-[#c8c6c4]"> › </span>
                    <span className="text-[#0078d4]">Deals</span>
                    <span className="text-[#c8c6c4]"> › </span>
                    <span className="font-semibold text-[#323130]">Active pipeline</span>
                  </p>
                </div>
                <div className="flex min-h-0 flex-1 bg-white text-[12px]" style={{ fontFamily: msFont }}>
                  <div className="w-[42%] max-w-[200px] shrink-0 border-r border-[#edebe9] bg-[#faf9f8] p-2">
                    <p
                      className="m-0 text-[10px] font-semibold uppercase tracking-[0.04em] text-[#605e5c]"
                      style={{ fontFamily: msFont }}
                    >
                      Folder tree
                    </p>
                    <ul className="m-0 mt-2 list-none space-y-0.5 p-0">
                      {[
                        { open: true, label: "Camden Bridge · £12m" },
                        { open: false, label: "Manchester PBSA · 2024" },
                        { open: false, label: "Reading Bridge · refi" },
                        { open: false, label: "Harrow industrial unit" },
                        { open: false, label: "Sponsor diligence · Tier 2" }
                      ].map((f) => (
                        <li key={f.label}>
                          <div
                            className={cn(
                              "rounded-[4px] px-2 py-1 text-[11px] leading-snug text-[#323130]",
                              f.open ? "bg-[#edebe9] font-semibold text-[#201f1e]" : "text-[#605e5c]"
                            )}
                          >
                            <span className="mr-1 opacity-65" aria-hidden>
                              {f.open ? "\u25BE" : "\u25B8"}
                            </span>
                            {f.label}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="min-w-0 flex-1 p-3">
                    <div className="flex items-center gap-2">
                      <p className="m-0 shrink-0 text-[10px] font-semibold uppercase tracking-[0.04em] text-[#605e5c]">
                        Document library · Items
                      </p>
                      <span className="truncate text-[10px] text-[#8a8886]">All Documents •</span>
                    </div>
                    <p className="m-0 mt-3 text-[10px] leading-snug text-[#605e5c]">
                      Site contents <span className="text-[#c8c6c4]">/</span> Deals{" "}
                      <span className="text-[#c8c6c4]">/</span>{" "}
                      <span className="font-medium text-[#323130]">Camden Bridge · £12m</span>
                    </p>
                    <div className="mt-4 space-y-0">
                      {[
                        ["Investment Memo - v4.docx", "#185FA5"],
                        ["Property Details Pack.pdf", "#BA7517"],
                        ["Financial Model - Base case.xlsx", "#1D9E75"],
                        ["Covenant Schedule - draft.pdf", "#6B4FBB"],
                        ["IC Working Notes - internal.docx", "#605e5c"],
                        ["Teaser - REDACTED externally.pdf", "#605e5c"]
                      ].map(([name, col]) => (
                        <div
                          key={name}
                          className="flex items-center gap-2 border-b border-[#f3f2f1] py-2 last:border-b-0"
                        >
                          <span className="h-5 w-[18px] shrink-0 rounded-[3px]" style={{ backgroundColor: col }} aria-hidden />
                          <span className="min-w-0 truncate text-[11px] text-[#323130]" style={{ fontFamily: msFont }}>
                            {name}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 m-0 text-[9px] italic leading-relaxed text-[#8a8a8a]">
                      Synthetic library: illustrative folder layout only.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="flex min-h-[300px] flex-col rounded-[2px] border border-[#edebe9] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.12)]"
                style={{ fontFamily: msFont }}
              >
                <div className="flex items-center gap-2 border-b border-[#edebe9] pb-2">
                  <span className="h-2 w-2 rounded-sm bg-[#0078d4]" aria-hidden />
                  <p className="m-0 text-[11px] font-semibold text-[#323130]">Policy list · Fund mandate (mock)</p>
                </div>
                <p className="mt-2 m-0 text-[11px] leading-relaxed text-[#605e5c]">
                  Rules Junior checks beside SharePoint retrieval: editable policy fields per fund strategy.
                </p>
                <ul className="mt-3 m-0 flex-1 list-none space-y-2.5 p-0 text-[11px] leading-[1.5] text-[#323130]">
                  <li className="flex gap-2 border-l-[3px] border-l-[#0078d4] pl-2">
                    <span className="text-[#605e5c]" aria-hidden>
                      •
                    </span>
                    <span>
                      Strict <strong className="font-semibold text-[#201f1e]">72–75% LTV</strong> at origination; peaks
                      above band require deputy CIO sign-off (mock).
                    </span>
                  </li>
                  <li className="flex gap-2 border-l-[3px] border-l-[#0078d4] pl-2">
                    <span className="text-[#605e5c]" aria-hidden>
                      •
                    </span>
                    <span>
                      <strong className="font-semibold text-[#201f1e]">No new exposure inside Central London</strong>{" "}
                      (CAZ + published postcode exclusions on policy site).
                    </span>
                  </li>
                  <li className="flex gap-2 border-l-[3px] border-l-[#0078d4] pl-2">
                    <span className="text-[#605e5c]" aria-hidden>
                      •
                    </span>
                    <span>
                      Minimum <strong className="font-semibold text-[#201f1e]">8.5% all-in yield</strong> hurdle on senior
                      for residential-conversion sleeves.
                    </span>
                  </li>
                  <li className="flex gap-2 border-l-[3px] border-l-[#0078d4] pl-2">
                    <span className="text-[#605e5c]" aria-hidden>
                      •
                    </span>
                    <span>
                      Build <strong className="font-semibold text-[#201f1e]">contingency ≥ 7.5%</strong> of hard cost;
                      auto-flag if below floor.
                    </span>
                  </li>
                  <li className="flex gap-2 border-l-[3px] border-l-[#0078d4] pl-2">
                    <span className="text-[#605e5c]" aria-hidden>
                      •
                    </span>
                    <span>
                      Single-name concentration cap <strong className="font-semibold text-[#201f1e]">12%</strong> of drawn
                      fund NAV without IC escalation path.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-5 flex justify-center border-t border-[rgba(0,0,0,0.06)] pt-4">
              <p className="m-0 max-w-[480px] text-center font-mono text-[10px] uppercase tracking-[0.08em] text-[#8A8A8A]" style={monoFont}>
                Mandate rules are editable. Mock data shown for demo · syncs retrieval + diligence checks downstream
              </p>
            </div>
          </div>
        </section>

        {/* BEAT 4 · Governance */}
        <section data-junior-beat-ix={5} className="snap-start snap-always box-border flex min-h-dvh flex-col justify-center px-1 py-8">
          <ChapterHead
            index="04"
            slug="Governance"
            title="Knows where silence is safe, and where it is not."
            subtitle="Three confirmation tiers. Silent reads first. Anything external hits Drafts, or waits for your yes."
            subtitleAlign="center"
          />

          <div className={cn(sectionTint, "p-4")}>

          <div className="grid gap-3 md:grid-cols-3">
            {(
              [
                {
                  n: 1 as const,
                  title: "Tier 1 · Auto · silent",
                  sub: "Reading, looking up, populating the model.",
                  dot: "bg-[#1D9E75]"
                },
                {
                  n: 2 as const,
                  title: "Tier 2 · Drafts · you review",
                  sub: "Broker replies and IC memos sit in Drafts.",
                  dot: "bg-[#BA7517]"
                },
                {
                  n: 3 as const,
                  title: "Tier 3 · Asks · you decide",
                  sub: "Decline a deal, send external comms, escalate.",
                  dot: "bg-[#A32D2D]"
                }
              ] as const
            ).map((tier) => (
              <button
                key={tier.n}
                type="button"
                onClick={() => setB3Tier(tier.n)}
                className={cn(
                  "cursor-pointer rounded-[8px] border bg-white p-[14px] text-left transition-colors",
                  b3Tier === tier.n
                    ? "border-[rgba(0,0,0,0.16)] bg-[#EFEDE7]"
                    : "border-[rgba(0,0,0,0.08)] hover:border-[rgba(0,0,0,0.12)]"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 shrink-0 rounded-full", tier.dot)} />
                  <span className="text-[12px] font-medium text-[#1A1A1A]">{tier.title}</span>
                </div>
                <p className="mt-2 m-0 text-[11px] leading-relaxed text-[#5C5C5C]">{tier.sub}</p>
              </button>
            ))}
          </div>

          <div className={cn("mt-4 min-h-[220px] rounded-[8px] bg-white p-[18px]", borderSoft)}>
            {b3Tier === null ? (
              <p className="m-0 text-[12px] italic text-[#8A8A8A]">
                Click a tier above to see what Junior actually does.
              </p>
            ) : b3Tier === 1 ? (
              <div className="space-y-3">
                <p
                  className="m-0 font-mono text-[10px] uppercase tracking-[0.1em] text-[#1D9E75]"
                  style={{ fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace" }}
                >
                  Tier 1 · Auto · silent
                </p>
                <p className="m-0 text-[12px] leading-relaxed text-[#5C5C5C]">
                  Read-only or non-destructive actions Junior runs without asking, because asking would be friction,
                  not safety.
                </p>
                <ul className="m-0 list-none space-y-1.5 p-0 text-[12px] text-[#1A1A1A]">
                  {[
                    "Parsing the broker email, extracting deal terms",
                    "Looking up sponsor history in SharePoint",
                    "Pulling Companies House filings",
                    "Sweeping public press for sponsor / key-person signals",
                    "Running the fund\u2019s mandate-fit checklist",
                    "Populating the credit model template (a copy, not the master)"
                  ].map((line) => (
                    <li key={line} className="relative pl-4 text-[#5C5C5C]">
                      <span className="absolute left-0 text-[#185FA5]">→</span>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            ) : b3Tier === 2 ? (
              <div className="space-y-3">
                <p
                  className="m-0 font-mono text-[10px] uppercase tracking-[0.1em] text-[#BA7517]"
                  style={{ fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace" }}
                >
                  Tier 2 · Drafts · you review
                </p>
                <p className="m-0 text-[12px] leading-relaxed text-[#5C5C5C]">
                  Junior produces work, you review and edit before anything goes out. Sits in your Drafts folder.
                </p>
                <ul className="m-0 list-none space-y-1.5 p-0 text-[12px] text-[#1A1A1A]">
                  {[
                    "Reply email to broker requesting cost breakdown",
                    "IC memo first draft",
                    "Push-back note on contingency / GDV assumptions",
                    "Suggested model adjustments based on fund history"
                  ].map((line) => (
                    <li key={line} className="relative pl-4 text-[#5C5C5C]">
                      <span className="absolute left-0 text-[#185FA5]">→</span>
                      {line}
                    </li>
                  ))}
                </ul>
                <div className="rounded-[6px] border border-[rgba(0,0,0,0.06)] bg-[#FAF9FE] p-3 text-[11px] italic leading-relaxed text-[#5C5C5C]">
                  &quot;Drafted reply to James asking for the cost breakdown. In your Drafts.&quot;
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p
                  className="m-0 font-mono text-[10px] uppercase tracking-[0.1em] text-[#A32D2D]"
                  style={{ fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace" }}
                >
                  Tier 3 · Asks · you decide
                </p>
                <p className="m-0 text-[12px] leading-relaxed text-[#5C5C5C]">
                  Anything irreversible or high-stakes. Junior pauses and asks. Explicitly.
                </p>
                <ul className="m-0 list-none space-y-1.5 p-0 text-[12px] text-[#1A1A1A]">
                  {[
                    'Marking a deal as "not pursuing"',
                    "Sending external communication (broker, sponsor, lawyer)",
                    "Escalating to IC",
                    "Updating the master model",
                    "Anything that creates an audit-trail event"
                  ].map((line) => (
                    <li key={line} className="relative pl-4 text-[#5C5C5C]">
                      <span className="absolute left-0 text-[#185FA5]">→</span>
                      {line}
                    </li>
                  ))}
                </ul>
                <div className="rounded-[6px] border border-[#F09595]/40 bg-[#FCEBEB] p-3 text-[11px] leading-relaxed text-[#1A1A1A]">
                  <strong className="font-medium text-[#791F1F]">Junior:</strong> &quot;Initial review complete.
                  What would you like me to do?&quot;
                  <div className="mt-2 flex flex-wrap gap-1.5 font-mono text-[9px]" style={{ fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace" }}>
                    {["Draft IC memo", "Email broker", "Both", "Skip"].map((lab) => (
                      <span
                        key={lab}
                        className="rounded-[4px] border border-[rgba(0,0,0,0.1)] bg-white px-1.5 py-0.5 text-[9px]"
                      >
                        {lab}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        </section>

        {/* BEAT 5 */}
        <section data-junior-beat-ix={6} className="snap-start snap-always box-border flex min-h-dvh flex-col justify-center px-1 py-8 pb-28">
          <ChapterHead
            index="05"
            slug="Radar"
            title="Catches the signals humans miss between cycles."
            subtitle="Quiet macro moves and filings rarely show up until covenant review. Junior watches them in the background and surfaces what matters before it bites."
            subtitleAlign="center"
          />

          <div className={cn(sectionTint, "p-4")}>

          <div className={cn("relative isolate min-h-[420px] grid gap-4 rounded-[12px] bg-white p-[14px] md:grid-cols-[200px_minmax(0,1fr)_minmax(260px,1fr)]", borderSoft)}>
            <div className={cn(b4ActiveSheet ? "pointer-events-none opacity-30" : "opacity-100", "transition-opacity duration-300")}>
              <p
                className="m-0 mb-3 font-mono text-[10px] uppercase tracking-[0.1em] text-[#8A8A8A]"
                style={{ fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace" }}
              >
                Data streams in
              </p>
              <div className="space-y-2">
                {RADAR_SOURCES.map((s, idx) => (
                  <div
                    key={s.title}
                    className={cn(
                      "rounded-[6px] border border-[rgba(0,0,0,0.08)] bg-[#FFFFFF] px-2.5 py-2",
                      b4Streams[idx] ? "junior-dem-source-in opacity-100" : "opacity-0"
                    )}
                    style={{ fontFamily: msFont }}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={cn(
                          "flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-sm text-[11px] font-bold leading-none text-white",
                          b4Streams[idx] && "junior-dem-source-icon"
                        )}
                        style={{ backgroundColor: s.bg }}
                        aria-hidden
                      >
                        {s.glyph}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="m-0 text-[11px] font-semibold leading-tight text-[#185FA5]">{s.title}</p>
                        <p className="mt-1 m-0 text-[10.5px] leading-snug text-[#5C5C5C]">{s.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={cn("flex flex-col items-center justify-center px-2 transition-opacity duration-300", b4ActiveSheet ? "pointer-events-none opacity-30" : "opacity-100")}>
              <div
                className={cn(
                  "relative flex h-[90px] w-[90px] items-center justify-center rounded-full border border-[#E8E3FA] bg-[#FAF9FE] transition-transform duration-[400ms]",
                  b4BrainScale && "scale-105"
                )}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className={cn(
                      "pointer-events-none h-[76px] w-[76px] rounded-full border-[1.5px] border-[#6B4FBB]",
                      b4BrainPulse ? "junior-dem-brain-ring pulsing opacity-70" : "opacity-0"
                    )}
                  />
                </div>
                <div className="relative z-[1] flex h-8 w-8 items-center justify-center rounded-full bg-[#6B4FBB] text-[14px] font-medium text-white">
                  J
                </div>
              </div>
              <p className="mt-3 max-w-[160px] text-center text-[10px] leading-snug text-[#8A8A8A]">
                Cross-checks against your model assumptions
              </p>
            </div>

            <div className={cn("transition-opacity duration-300", b4ActiveSheet ? "pointer-events-none opacity-30" : "opacity-100")}>
              <p
                className="m-0 mb-3 font-mono text-[10px] uppercase tracking-[0.1em] text-[#8A8A8A]"
                style={{ fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace" }}
              >
                Junior alerts you
              </p>
              <div
                className={cn(
                  outlookCard,
                  "border-l-[3px] border-l-[#a4262c] transition-opacity duration-500 ease-out",
                  !b4Alert && "opacity-0"
                )}
                style={{
                  fontFamily: msFont,
                  ...(b4Alert ? {} : { pointerEvents: "none" })
                }}
                aria-hidden={!b4Alert}
              >
                <div className="flex items-center justify-between gap-2 border-b border-[#edebe9] bg-[#f3f2f1] px-2 py-1">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <span className="flex h-[16px] w-[16px] items-center justify-center rounded-full bg-[#a4262c] text-[9px] font-bold text-white" aria-hidden>
                      !
                    </span>
                    <span className="truncate text-[10px] font-semibold text-[#a4262c]">High importance</span>
                  </div>
                  <span className="shrink-0 rounded bg-white px-1.5 py-px text-[9px] font-medium text-[#605e5c] shadow-sm">
                    Inbox · IC desk
                  </span>
                </div>
                <div className="border-b border-[#edebe9] bg-white px-3 pb-2 pt-2.5">
                  <p className="m-0 text-[12.5px] font-semibold leading-snug text-[#242424]">
                    Risk alert · 2 deals at elevated default risk
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-x-2 gap-y-0.5 text-[10.5px] text-[#605e5c]">
                    <span>
                      <span className="font-semibold text-[#323130]">From</span>{" "}
                      <span className="inline-flex items-center gap-1">
                        <span className="flex h-[14px] w-[14px] items-center justify-center rounded-full bg-[#6b4fbb] text-[8px] font-bold text-white" aria-hidden>
                          J
                        </span>
                        Junior &lt;junior@klc-am.ai&gt;
                      </span>
                    </span>
                    <span className="text-[#c8c6c4]" aria-hidden>·</span>
                    <span>To: Kiara, Tom (PM), risk@klc-am</span>
                    <span className="text-[#c8c6c4]" aria-hidden>·</span>
                    <span>Mon 8:13 AM</span>
                  </div>
                </div>
                <div className="px-3 py-2 text-[11.5px] leading-[1.55] text-[#242424] min-h-[58px]">
                  <TypedAlertBody visibleLen={b4TypedLen} done={b4TypingDone} />
                </div>
                {b4TypingDone ? (
                  <>
                    <div className="junior-dem-attach-in border-t border-[#edebe9] bg-[#faf9f8] px-3 py-2">
                      <div className="flex items-center justify-between">
                        <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.04em] text-[#605e5c]">
                          Attachments · 2 items
                        </p>
                        <span className="text-[10px] text-[#605e5c]">Click to open in Excel</span>
                      </div>
                      <div className="mt-1.5 space-y-1">
                        {(
                          [
                            {
                              key: "camden" as const,
                              label: "Camden Bridge \u2014 Risk-Adjusted.xlsx",
                              size: "184 KB"
                            },
                            {
                              key: "reading" as const,
                              label: "Reading Bridge \u2014 Risk-Adjusted.xlsx",
                              size: "162 KB"
                            }
                          ]
                        ).map((att) => (
                          <button
                            key={att.key}
                            type="button"
                            onClick={() => {
                              setB4ActiveSheet(att.key);
                              setB4SheetKey((k) => k + 1);
                            }}
                            className={cn(
                              "group flex w-full items-center gap-2 rounded-sm border border-[#edebe9] bg-white px-2 py-1.5 text-left transition-[background-color,border-color,box-shadow]",
                              "hover:border-[#107c41] hover:bg-[#f5fbf7] hover:shadow-[0_1px_0_rgba(16,124,65,0.15),0_4px_10px_-6px_rgba(16,124,65,0.45)]",
                              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#107c41]"
                            )}
                            aria-label={`Open ${att.label} in spreadsheet view`}
                          >
                            <span
                              className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-sm bg-[#107c41] text-[11px] font-bold text-white"
                              aria-hidden
                            >
                              X
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[11px] font-medium text-[#242424]">{att.label}</span>
                              <span className="block text-[9.5px] text-[#605e5c]">
                                {att.size} · zoom into key assumptions
                              </span>
                            </span>
                            <span
                              className="shrink-0 text-[12px] text-[#107c41] opacity-0 transition-opacity group-hover:opacity-100"
                              aria-hidden
                            >
                              ↗
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="junior-dem-attach-in border-t border-[#edebe9] bg-white px-3 py-1.5 text-[10px] text-[#605e5c]">
                      Recommend: covenant-watch on both facilities · IC discussion before next monitoring cycle.
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            {b4ActiveSheet ? (
              <ExcelSheetView
                data={SHEETS[b4ActiveSheet]}
                sheetKey={b4SheetKey}
                activeKey={b4ActiveSheet}
                onBack={() => setB4ActiveSheet(null)}
                onSwitch={(k) => {
                  setB4ActiveSheet(k);
                  setB4SheetKey((v) => v + 1);
                }}
              />
            ) : null}
          </div>

          <div className="mt-4 flex justify-center">
            <button type="button" className={btnPrimary} onClick={runB4Replay}>
              ▶ Watch Junior catch a risk in real time
            </button>
          </div>
        </div>
        </section>

        <nav aria-label="Demo sections" className="pointer-events-none fixed bottom-6 left-0 right-0 z-[100]">
          <div className="relative flex justify-center px-4">
          <div
            className="pointer-events-auto flex flex-wrap items-center justify-center gap-1 rounded-[10px] border border-[rgba(0,0,0,0.08)] bg-white/92 px-2 py-2 shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_6px_20px_-8px_rgba(26,26,26,0.12)] backdrop-blur-md"
          >
            {(
              [
                ["A", "Why"],
                ["B", "Stack"],
                ["01", "Burden"],
                ["02", "Parity"],
                ["03", "Firm"],
                ["04", "Gov"],
                ["05", "Radar"]
              ] as const
            ).map(([num, slug], ix) => (
              <button
                key={num}
                type="button"
                onClick={() => scrollToBeat(ix)}
                style={monoFont}
                className={cn(
                  "rounded-[6px] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors",
                  scrollBeat === ix
                    ? "bg-[#1A1A1A] text-white"
                    : "text-[#5C5C5C] hover:bg-[rgba(0,0,0,0.05)] hover:text-[#1A1A1A]"
                )}
              >
                {num}{" "}
                <span className="opacity-70 normal-case tracking-normal">{slug}</span>
              </button>
            ))}
          </div>
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-[-1.65rem] left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.14em] text-[#AEAEAE]"
            style={monoFont}
          >
            {scrollBeat + 1} / 7
          </span>
          </div>
        </nav>
      </div>
    </>
  );
}
