"use client";

import { type CSSProperties } from "react";
import { cn } from "@/lib/cn";

export type HallwayPhase = "idle" | "in" | "approach" | "open" | "exit";

export type OfficeNum = 1 | 2 | 3 | 4 | 5;

type DoorPos = {
  /** screen-x percentage of door centre */
  cx: number;
  /** screen-y percentage of door centre */
  cy: number;
  /** door height as % of viewport height */
  h: number;
  side: "left" | "right" | "back";
  /** for filename / aria */
  num: OfficeNum;
};

const DOORS: DoorPos[] = [
  { num: 1, cx: 14, cy: 56, h: 64, side: "left" },
  { num: 2, cx: 86, cy: 56, h: 64, side: "right" },
  { num: 3, cx: 30, cy: 53, h: 40, side: "left" },
  { num: 4, cx: 70, cy: 53, h: 40, side: "right" },
  { num: 5, cx: 50, cy: 51, h: 26, side: "back" }
];

type Props = {
  phase: HallwayPhase;
  selected: OfficeNum;
  onSelect: (n: OfficeNum) => void;
  onExit: () => void;
};

export function HallwayView({ phase, selected, onSelect, onExit }: Props) {
  const target = DOORS.find((d) => d.num === selected) ?? DOORS[0];
  const visible = phase !== "idle";

  // Camera dolly
  const stageStyle: CSSProperties = {
    transformOrigin: `${target.cx}% ${target.cy}%`,
    transform:
      phase === "approach"
        ? "scale(2.7)"
        : phase === "open"
          ? "scale(5.2)"
          : phase === "exit"
            ? "scale(7.6)"
            : "scale(1)",
    transition: "transform 0.7s cubic-bezier(0.55, 0, 0.32, 1)"
  };

  const containerStyle: CSSProperties = {
    opacity: visible ? 1 : 0,
    transition: "opacity 0.32s ease-out",
    pointerEvents: visible ? "auto" : "none"
  };

  return (
    <div
      className="fixed inset-0 z-[210] overflow-hidden bg-white"
      style={containerStyle}
      aria-hidden={!visible}
    >
      {/* Sterile lab-floor backdrop */}
      <div className="corridor-bg pointer-events-none absolute inset-0" />

      {/* Vanishing-point guide lines */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        {/* floor */}
        <line x1="0" y1="100" x2="50" y2="50" stroke="#dde6ee" strokeWidth="0.22" />
        <line x1="100" y1="100" x2="50" y2="50" stroke="#dde6ee" strokeWidth="0.22" />
        <line x1="20" y1="100" x2="50" y2="50" stroke="#e6ecf2" strokeWidth="0.16" />
        <line x1="80" y1="100" x2="50" y2="50" stroke="#e6ecf2" strokeWidth="0.16" />
        <line x1="40" y1="100" x2="50" y2="50" stroke="#eef3f8" strokeWidth="0.12" />
        <line x1="60" y1="100" x2="50" y2="50" stroke="#eef3f8" strokeWidth="0.12" />
        {/* tile lines on floor */}
        {[0.86, 0.78, 0.7, 0.63, 0.58].map((t, i) => (
          <line
            key={`floor-tile-${i}`}
            x1={50 - 50 * (1 - t)}
            y1={100 * t + 50 * (1 - t)}
            x2={50 + 50 * (1 - t)}
            y2={100 * t + 50 * (1 - t)}
            stroke="#cfd8e1"
            strokeWidth="0.13"
          />
        ))}
        {/* ceiling */}
        <line x1="0" y1="0" x2="50" y2="50" stroke="#dde6ee" strokeWidth="0.22" />
        <line x1="100" y1="0" x2="50" y2="50" stroke="#dde6ee" strokeWidth="0.22" />
        <line x1="20" y1="0" x2="50" y2="50" stroke="#e6ecf2" strokeWidth="0.16" />
        <line x1="80" y1="0" x2="50" y2="50" stroke="#e6ecf2" strokeWidth="0.16" />
        {/* ceiling fluorescent strips */}
        {[0.72, 0.6, 0.52].map((t, i) => (
          <rect
            key={`ceil-${i}`}
            x={50 - 7 * (1 - t)}
            y={50 * (1 - t)}
            width={14 * (1 - t)}
            height={0.4 * (1 - t)}
            fill="#f1f5f9"
            stroke="#dbe2ea"
            strokeWidth="0.07"
          />
        ))}
        {/* back wall plate */}
        <rect x="38" y="42" width="24" height="16" fill="#fcfdfe" stroke="#cfd8e1" strokeWidth="0.18" />
        <rect x="46" y="49" width="8" height="2" fill="#f3f6f9" stroke="#cfd8e1" strokeWidth="0.1" />
        <text
          x="50"
          y="50.5"
          textAnchor="middle"
          fill="#94a3b8"
          fontSize="1.1"
          fontFamily="ui-monospace, monospace"
          letterSpacing="0.3"
        >
          HALKIN/L13
        </text>
        {/* back wall floor strip */}
        <line x1="38" y1="58" x2="62" y2="58" stroke="#cbd5e1" strokeWidth="0.2" />
      </svg>

      {/* HUD chrome */}
      <div className="pointer-events-none absolute inset-0 z-[5]">
        <div className="absolute left-6 top-6 font-mono text-[10px] tracking-[0.3em] text-zinc-400">
          HALKIN ▸ FLOOR 13 ▸ CORRIDOR-A
        </div>
        <div className="absolute right-6 top-6 font-mono text-[10px] tracking-[0.3em] text-zinc-400">
          5 SUITES · ALL LOCKED
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[9.5px] tracking-[0.4em] text-zinc-400">
          ◤ SELECT A SUITE TO CONTINUE ◥
        </div>
        <div className="absolute left-6 top-6 h-2 w-2 -translate-x-3 -translate-y-3 border-l border-t border-zinc-300" />
        <div className="absolute right-6 top-6 h-2 w-2 translate-x-3 -translate-y-3 border-r border-t border-zinc-300" />
        <div className="absolute left-6 bottom-6 h-2 w-2 -translate-x-3 translate-y-3 border-l border-b border-zinc-300" />
        <div className="absolute right-6 bottom-6 h-2 w-2 translate-x-3 translate-y-3 border-r border-b border-zinc-300" />
      </div>

      {/* Exit-to-home button */}
      <button
        type="button"
        onClick={onExit}
        className="absolute right-6 bottom-14 z-[6] rounded-md border border-zinc-300 bg-white/90 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-600 backdrop-blur transition hover:border-zinc-500 hover:text-zinc-900"
      >
        ← Lobby
      </button>

      {/* Stage with all doors */}
      <div
        className="absolute inset-0"
        style={stageStyle}
        // when zooming the stage doesn't accept clicks anymore
        aria-busy={phase !== "in"}
      >
        {DOORS.map((d) => {
          const isTarget = d.num === selected;
          const opening = isTarget && (phase === "open" || phase === "exit");
          const dim = phase === "approach" || phase === "open" || phase === "exit";
          const hPx = `${d.h}vh`;
          const wPx = `calc(${d.h}vh * 0.42)`;
          const labelSize = `${d.h * 0.072}vh`;
          const subSize = `${d.h * 0.038}vh`;
          const plateSize = `${d.h * 0.022}vh`;
          const wrapperStyle: CSSProperties = {
            left: `${d.cx}%`,
            top: `${d.cy}%`,
            width: wPx,
            height: hPx,
            transform: `translate(-50%, -50%)`,
            zIndex: Math.round(d.h)
          };
          return (
            <button
              key={d.num}
              type="button"
              className="hallway-door absolute"
              style={wrapperStyle}
              disabled={phase !== "in"}
              onClick={() => onSelect(d.num)}
              aria-label={`Enter office 0${d.num}`}
            >
              <Door
                num={d.num}
                opening={opening}
                dim={dim && !isTarget}
                labelSize={labelSize}
                subSize={subSize}
                plateSize={plateSize}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Door(props: {
  num: OfficeNum;
  opening: boolean;
  dim: boolean;
  labelSize: string;
  subSize: string;
  plateSize: string;
}) {
  const { num, opening, dim, labelSize, subSize, plateSize } = props;
  const labelStr = `0${num}`;

  return (
    <div
      className={cn(
        "relative h-full w-full rounded-[6px] border border-zinc-300 bg-gradient-to-b from-zinc-50 via-white to-zinc-100 shadow-[0_28px_60px_-30px_rgba(15,23,42,0.25)] transition-opacity duration-300",
        dim && "opacity-30"
      )}
    >
      {/* status LED */}
      <span className="hallway-led absolute left-1/2 top-2 h-1.5 w-8 -translate-x-1/2 rounded-full bg-zinc-300 transition-colors" />

      {/* white interior revealed when door splits */}
      <div className="absolute inset-[6%] overflow-hidden rounded-[3px] bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_55%,#ffffff,#eef2f7)]" />
        <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-zinc-200/80" />
        {/* large suite label inside, becomes visible when door opens */}
        <span
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono font-bold tracking-[0.3em] text-zinc-300 transition-opacity duration-300",
            opening ? "opacity-100" : "opacity-0"
          )}
          style={{ fontSize: subSize }}
        >
          SUITE/{labelStr}
        </span>

        {/* glass leaves */}
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-1/2 origin-left transition-transform duration-[620ms] ease-[cubic-bezier(0.6,0,0.2,1)]",
            "border-r border-zinc-300/80 bg-gradient-to-br from-zinc-100/95 via-white/85 to-zinc-200/85",
            opening && "translate-x-[-110%]"
          )}
        >
          <div className="absolute right-1.5 top-1/2 h-7 w-0.5 -translate-y-1/2 rounded bg-zinc-400/70" />
        </div>
        <div
          className={cn(
            "absolute inset-y-0 right-0 w-1/2 origin-right transition-transform duration-[620ms] ease-[cubic-bezier(0.6,0,0.2,1)]",
            "border-l border-zinc-300/80 bg-gradient-to-bl from-zinc-100/95 via-white/85 to-zinc-200/85",
            opening && "translate-x-[110%]"
          )}
        >
          <div className="absolute left-1.5 top-1/2 h-7 w-0.5 -translate-y-1/2 rounded bg-zinc-400/70" />
        </div>

        {/* number on closed glass */}
        <span
          className={cn(
            "absolute left-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2 font-mono font-extrabold tracking-[0.18em] transition-opacity duration-200",
            opening ? "opacity-0" : "text-zinc-400"
          )}
          style={{ fontSize: labelSize }}
        >
          {labelStr}
        </span>
      </div>

      {/* kick plate */}
      <div className="absolute bottom-0 left-0 right-0 h-[6%] rounded-b-[6px] bg-gradient-to-b from-zinc-200 to-zinc-300" />
      {/* number plate above door */}
      <div
        className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-sm border border-zinc-300 bg-white px-1.5 py-[1px] font-mono font-bold tracking-[0.28em] text-zinc-500"
        style={{ fontSize: plateSize }}
      >
        {labelStr}
      </div>
    </div>
  );
}
