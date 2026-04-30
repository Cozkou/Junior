"use client";

import { type CSSProperties } from "react";
import { cn } from "@/lib/cn";

export type OfficePhase = "idle" | "in" | "pick" | "exit";

export type PersonNum = 1 | 2 | 3;

type Props = {
  phase: OfficePhase;
  officeNum: number;
  selected: PersonNum;
  onPick: (n: PersonNum) => void;
  onExit: () => void;
};

const PEOPLE: Array<{ num: PersonNum; name: string; role: string; cx: number }> = [
  { num: 1, name: "M. KIRBY", role: "ANALYST", cx: 22 },
  { num: 2, name: "S. RIO", role: "ASSOCIATE", cx: 50 },
  { num: 3, name: "T. AVRAM", role: "ANALYST", cx: 78 }
];

export function OfficeView({ phase, officeNum, selected, onPick, onExit }: Props) {
  const visible = phase !== "idle";
  const target = PEOPLE.find((p) => p.num === selected) ?? PEOPLE[0];

  // camera dolly to chosen person before route push
  const stageStyle: CSSProperties = {
    transformOrigin: `${target.cx}% 60%`,
    transform:
      phase === "pick"
        ? "scale(2.2)"
        : phase === "exit"
          ? "scale(3.6)"
          : "scale(1)",
    transition: "transform 0.62s cubic-bezier(0.55, 0, 0.32, 1)"
  };

  const containerStyle: CSSProperties = {
    opacity: visible ? 1 : 0,
    transition: "opacity 0.32s ease-out",
    pointerEvents: visible ? "auto" : "none"
  };

  return (
    <div
      className="fixed inset-0 z-[220] overflow-hidden bg-white"
      style={containerStyle}
      aria-hidden={!visible}
    >
      {/* Office shell — perspective walls */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="of-floor" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#e7edf3" />
            <stop offset="1" stopColor="#f6f9fc" />
          </linearGradient>
          <linearGradient id="of-back" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#f4f7fb" />
            <stop offset="1" stopColor="#e2e8f0" />
          </linearGradient>
          <linearGradient id="of-side-l" x1="1" y1="0" x2="0" y2="0">
            <stop stopColor="#eef2f7" />
            <stop offset="1" stopColor="#dbe2eb" />
          </linearGradient>
          <linearGradient id="of-side-r" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#eef2f7" />
            <stop offset="1" stopColor="#dbe2eb" />
          </linearGradient>
        </defs>
        {/* ceiling */}
        <polygon points="0,0 100,0 70,28 30,28" fill="#f8fafc" />
        {/* left wall */}
        <polygon points="0,0 30,28 30,72 0,100" fill="url(#of-side-l)" />
        {/* right wall */}
        <polygon points="100,0 70,28 70,72 100,100" fill="url(#of-side-r)" />
        {/* back wall */}
        <rect x="30" y="28" width="40" height="44" fill="url(#of-back)" />
        {/* floor */}
        <polygon points="0,100 100,100 70,72 30,72" fill="url(#of-floor)" />

        {/* Tile lines on floor */}
        {[0.78, 0.86, 0.93].map((t, i) => (
          <line
            key={`f-${i}`}
            x1={(1 - t) * 30}
            y1={t * 100 + (1 - t) * 72}
            x2={100 - (1 - t) * 30}
            y2={t * 100 + (1 - t) * 72}
            stroke="#cdd7e1"
            strokeWidth="0.16"
          />
        ))}

        {/* wall-floor seam */}
        <line x1="0" y1="100" x2="30" y2="72" stroke="#c4cdd7" strokeWidth="0.18" />
        <line x1="100" y1="100" x2="70" y2="72" stroke="#c4cdd7" strokeWidth="0.18" />
        <line x1="30" y1="72" x2="70" y2="72" stroke="#c4cdd7" strokeWidth="0.18" />
        {/* ceiling seam */}
        <line x1="0" y1="0" x2="30" y2="28" stroke="#dde6ee" strokeWidth="0.16" />
        <line x1="100" y1="0" x2="70" y2="28" stroke="#dde6ee" strokeWidth="0.16" />
        <line x1="30" y1="28" x2="70" y2="28" stroke="#dde6ee" strokeWidth="0.16" />

        {/* skirting board */}
        <rect x="30" y="71" width="40" height="0.7" fill="#cbd5e1" />

        {/* back wall window strip */}
        <rect x="36" y="34" width="28" height="14" fill="#f0f6fc" stroke="#cbd5e1" strokeWidth="0.18" />
        <line x1="50" y1="34" x2="50" y2="48" stroke="#cbd5e1" strokeWidth="0.18" />
        <line x1="36" y1="41" x2="64" y2="41" stroke="#cbd5e1" strokeWidth="0.12" />

        {/* ceiling fluorescent strips */}
        <polygon points="32,18 68,18 67,20 33,20" fill="#fffefb" stroke="#e6ecf2" strokeWidth="0.1" />
        <polygon points="36,8 64,8 63.5,10 36.5,10" fill="#fffefb" stroke="#e6ecf2" strokeWidth="0.1" />

        {/* wall placard with office number */}
        <rect x="58" y="50" width="6" height="2.2" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.14" />
        <text
          x="61"
          y="51.7"
          textAnchor="middle"
          fill="#475569"
          fontSize="1.3"
          fontFamily="ui-monospace, monospace"
          letterSpacing="0.3"
        >
          0{officeNum}
        </text>
      </svg>

      {/* HUD chrome */}
      <div className="pointer-events-none absolute inset-0 z-[5]">
        <div className="absolute left-6 top-6 font-mono text-[10px] tracking-[0.3em] text-zinc-400">
          HALKIN ▸ FLOOR 13 ▸ SUITE 0{officeNum}
        </div>
        <div className="absolute right-6 top-6 font-mono text-[10px] tracking-[0.3em] text-zinc-400">
          {PEOPLE.length} PERSONNEL · ALL ON-DUTY
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[9.5px] tracking-[0.4em] text-zinc-400">
          ◤ SELECT AN ANALYST TO OPEN INBOX ◥
        </div>
        <div className="absolute left-6 top-6 h-2 w-2 -translate-x-3 -translate-y-3 border-l border-t border-zinc-300" />
        <div className="absolute right-6 top-6 h-2 w-2 translate-x-3 -translate-y-3 border-r border-t border-zinc-300" />
        <div className="absolute left-6 bottom-6 h-2 w-2 -translate-x-3 translate-y-3 border-l border-b border-zinc-300" />
        <div className="absolute right-6 bottom-6 h-2 w-2 translate-x-3 translate-y-3 border-r border-b border-zinc-300" />
      </div>

      {/* Exit-to-hallway button */}
      <button
        type="button"
        onClick={onExit}
        className="absolute right-6 bottom-14 z-[6] rounded-md border border-zinc-300 bg-white/90 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-600 backdrop-blur transition hover:border-zinc-500 hover:text-zinc-900"
      >
        ← Hallway
      </button>

      {/* Stage: 3 desks + people */}
      <div className="absolute inset-0" style={stageStyle}>
        {PEOPLE.map((p) => {
          const isTarget = p.num === selected;
          const dim = (phase === "pick" || phase === "exit") && !isTarget;
          return (
            <button
              key={p.num}
              type="button"
              className={cn(
                "office-person absolute -translate-x-1/2 transition-opacity duration-300",
                dim && "opacity-30"
              )}
              style={{
                left: `${p.cx}%`,
                top: "62%",
                width: "20vw",
                maxWidth: "240px",
                minWidth: "150px"
              }}
              disabled={phase !== "in"}
              onClick={() => onPick(p.num)}
              aria-label={`Open inbox for ${p.name}`}
            >
              <Person number={p.num} name={p.name} role={p.role} highlighted={isTarget && phase === "in"} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Person({
  number,
  name,
  role,
  highlighted
}: {
  number: number;
  name: string;
  role: string;
  highlighted: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Person + desk */}
      <div className="relative aspect-[3/4] w-full">
        <svg viewBox="0 0 120 160" className="h-full w-full" aria-hidden>
          <defs>
            <linearGradient id={`shirt-${number}`} x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#cbd5e1" />
              <stop offset="1" stopColor="#94a3b8" />
            </linearGradient>
            <linearGradient id={`desk-${number}`} x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#e2e8f0" />
              <stop offset="1" stopColor="#94a3b8" />
            </linearGradient>
          </defs>

          {/* chair back hint */}
          <rect x="36" y="48" width="48" height="50" rx="6" fill="#1f2937" opacity="0.18" />

          {/* torso */}
          <path
            d="M30 100 Q30 70 60 70 Q90 70 90 100 L90 130 L30 130 Z"
            fill={`url(#shirt-${number})`}
          />
          {/* collar / open neck */}
          <path d="M52 70 L60 84 L68 70 Z" fill="#0f172a" opacity="0.4" />
          {/* head */}
          <circle cx="60" cy="50" r="18" fill="#cbb89c" />
          {/* hair cap */}
          {number === 1 && (
            <path d="M44 46 Q44 32 60 32 Q76 32 76 46 Q70 38 60 38 Q50 38 44 46 Z" fill="#3f2e21" />
          )}
          {number === 2 && (
            <path d="M42 46 Q44 30 60 30 Q78 30 78 50 Q72 38 60 38 Q48 38 42 46 Z" fill="#1f2937" />
          )}
          {number === 3 && (
            <path d="M44 44 Q44 30 60 30 Q76 30 76 44 Q72 36 60 36 Q48 36 44 44 Z" fill="#7d4a23" />
          )}
          {/* face shadow */}
          <ellipse cx="60" cy="56" rx="11" ry="6" fill="#000" opacity="0.06" />

          {/* desk */}
          <rect x="6" y="128" width="108" height="6" fill={`url(#desk-${number})`} stroke="#64748b" strokeWidth="0.6" />
          <rect x="6" y="134" width="108" height="2" fill="#64748b" opacity="0.4" />
          {/* laptop */}
          <rect x="36" y="118" width="40" height="12" fill="#1f2937" />
          <rect x="38" y="120" width="36" height="8" fill="#0b1320" />
          <rect x="36" y="128" width="40" height="2" fill="#0b1320" />
          {/* monitor light */}
          <rect x="40" y="122" width="32" height="4" fill="#94a3b8" opacity="0.45" />

          {/* desk lamp */}
          <line x1="92" y1="128" x2="92" y2="115" stroke="#475569" strokeWidth="1.2" />
          <line x1="92" y1="115" x2="100" y2="110" stroke="#475569" strokeWidth="1.2" />
          <ellipse cx="100" cy="111" rx="5" ry="2" fill="#1f2937" />
          {/* desk plant or coffee */}
          {number === 1 && (
            <>
              <rect x="14" y="121" width="6" height="9" fill="#0f172a" />
              <rect x="13" y="119" width="8" height="2" fill="#1f2937" />
            </>
          )}
          {number === 2 && (
            <>
              <rect x="14" y="119" width="8" height="11" fill="#fff" stroke="#94a3b8" strokeWidth="0.4" />
              <ellipse cx="18" cy="119" rx="4" ry="1.2" fill="#fff" stroke="#94a3b8" strokeWidth="0.3" />
              <ellipse cx="18" cy="119.4" rx="3" ry="0.8" fill="#92400e" />
            </>
          )}
          {number === 3 && (
            <>
              <rect x="12" y="121" width="10" height="9" fill="#22323d" />
              <ellipse cx="17" cy="121" rx="5" ry="1.2" fill="#10b981" opacity="0.7" />
              <ellipse cx="17" cy="120" rx="5" ry="2" fill="#16a34a" opacity="0.65" />
            </>
          )}
        </svg>

        {/* highlight ring */}
        <div
          className={cn(
            "pointer-events-none absolute -inset-2 rounded-xl border transition-colors",
            highlighted ? "border-red-400/70" : "border-transparent"
          )}
        />
        {highlighted && (
          <span className="pointer-events-none absolute inset-0 rounded-xl shadow-[0_0_60px_-10px_rgba(239,68,68,0.45)]" />
        )}
      </div>

      {/* Nameplate */}
      <div className="rounded-md border border-zinc-200 bg-white/90 px-2.5 py-1 text-center backdrop-blur-sm">
        <div className="font-mono text-[10px] font-bold tracking-[0.22em] text-zinc-900">
          {name}
        </div>
        <div className="font-mono text-[9px] tracking-[0.32em] text-zinc-500">
          {role}
        </div>
      </div>
    </div>
  );
}
