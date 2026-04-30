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
  { num: 1, name: "M. KIRBY",  role: "ANALYST",   cx: 22 },
  { num: 2, name: "S. RIO",    role: "ASSOCIATE",  cx: 50 },
  { num: 3, name: "T. AVRAM",  role: "ANALYST",    cx: 78 }
];

// Wig palette per person
const WIGS = {
  1: { base: "#dc2626", mid: "#ef4444", light: "#fca5a5", dark: "#991b1b", shine: "#fecaca" },
  2: { base: "#15803d", mid: "#22c55e", light: "#86efac", dark: "#14532d", shine: "#bbf7d0" },
  3: { base: "#db2777", mid: "#f472b6", light: "#fbcfe8", dark: "#9d174d", shine: "#fce7f3" },
};

export function OfficeView({ phase, officeNum, selected, onPick, onExit }: Props) {
  const visible = phase !== "idle";
  const target = PEOPLE.find((p) => p.num === selected) ?? PEOPLE[0];

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
      className="fixed inset-0 z-[220] overflow-hidden bg-[#e8eef5]"
      style={containerStyle}
      aria-hidden={!visible}
    >
      {/* ── Office room shell ── */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="of-floor" x1="0" y1="1" x2="0" y2="0">
            <stop stopColor="#b8c6d4" />
            <stop offset="0.5" stopColor="#c8d4e0" />
            <stop offset="1" stopColor="#dde6ef" />
          </linearGradient>
          <linearGradient id="of-back" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#ecf1f7" />
            <stop offset="1" stopColor="#dde6ef" />
          </linearGradient>
          <linearGradient id="of-side-l" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#a8b8c8" />
            <stop offset="0.6" stopColor="#c0ccd8" />
            <stop offset="1" stopColor="#dde6ef" />
          </linearGradient>
          <linearGradient id="of-side-r" x1="1" y1="0" x2="0" y2="0">
            <stop stopColor="#a8b8c8" />
            <stop offset="0.6" stopColor="#c0ccd8" />
            <stop offset="1" stopColor="#dde6ef" />
          </linearGradient>
          <linearGradient id="of-ceil" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#c8d4de" />
            <stop offset="1" stopColor="#dde6ef" />
          </linearGradient>
          <radialGradient id="of-vignette" cx="50%" cy="50%" r="70%" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#000000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.32" />
          </radialGradient>
        </defs>

        {/* ceiling */}
        <polygon points="0,0 100,0 70,28 30,28" fill="url(#of-ceil)" />
        {/* left wall */}
        <polygon points="0,0 30,28 30,72 0,100" fill="url(#of-side-l)" />
        {/* right wall */}
        <polygon points="100,0 70,28 70,72 100,100" fill="url(#of-side-r)" />
        {/* back wall */}
        <rect x="30" y="28" width="40" height="44" fill="url(#of-back)" />
        {/* floor */}
        <polygon points="0,100 100,100 70,72 30,72" fill="url(#of-floor)" />

        {/* Floor tiles */}
        {[0.74, 0.82, 0.9, 0.96].map((t, i) => (
          <line key={`f-${i}`}
            x1={(1 - t) * 30} y1={t * 100 + (1 - t) * 72}
            x2={100 - (1 - t) * 30} y2={t * 100 + (1 - t) * 72}
            stroke="#aabac8" strokeWidth="0.14" />
        ))}
        {/* floor verticals */}
        {[35, 50, 65].map((x, i) => (
          <line key={`fv-${i}`} x1={x} y1={100} x2={30 + (x - 30) * 40 / 70} y2={72}
            stroke="#aabac8" strokeWidth="0.1" />
        ))}

        {/* wall-floor seam */}
        <line x1="0" y1="100" x2="30" y2="72" stroke="#9aaab8" strokeWidth="0.2" />
        <line x1="100" y1="100" x2="70" y2="72" stroke="#9aaab8" strokeWidth="0.2" />
        <line x1="30" y1="72" x2="70" y2="72" stroke="#9aaab8" strokeWidth="0.2" />
        {/* ceiling seam */}
        <line x1="0" y1="0" x2="30" y2="28" stroke="#b0bcca" strokeWidth="0.18" />
        <line x1="100" y1="0" x2="70" y2="28" stroke="#b0bcca" strokeWidth="0.18" />
        <line x1="30" y1="28" x2="70" y2="28" stroke="#b0bcca" strokeWidth="0.18" />

        {/* skirting board */}
        <rect x="30" y="71.4" width="40" height="0.8" fill="#9aaab8" />

        {/* back wall window strip */}
        <rect x="36" y="33" width="28" height="16" rx="0.5" fill="#deeaf5" stroke="#b0bece" strokeWidth="0.2" />
        <line x1="50" y1="33" x2="50" y2="49" stroke="#b0bece" strokeWidth="0.18" />
        <line x1="36" y1="41" x2="64" y2="41" stroke="#b0bece" strokeWidth="0.12" />
        {/* window light shaft */}
        <polygon points="36,49 64,49 72,72 28,72" fill="#ffffff" opacity="0.06" />

        {/* ceiling LED strips */}
        <polygon points="33,14 67,14 66,16 34,16" fill="#fffef8" stroke="#dde6ee" strokeWidth="0.1" />
        <polygon points="36,6 64,6 63.5,8 36.5,8" fill="#fffef8" stroke="#dde6ee" strokeWidth="0.1" />
        {/* LED glow underneath */}
        <polygon points="33,16 67,16 72,28 28,28" fill="#fffff0" opacity="0.14" />

        {/* wall placard */}
        <rect x="58" y="50" width="7" height="2.5" rx="0.3" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.14" />
        <text x="61.5" y="51.8" textAnchor="middle" fill="#475569"
          fontSize="1.3" fontFamily="ui-monospace, monospace" letterSpacing="0.3">
          0{officeNum}
        </text>

        {/* near-edge vignette */}
        <rect width="100" height="100" fill="url(#of-vignette)" />
      </svg>

      {/* ── HUD chrome ── */}
      <div className="pointer-events-none absolute inset-0 z-[5]">
        <div className="absolute left-6 top-6 font-mono text-[10px] tracking-[0.3em] text-zinc-400">
          HALKIN ▸ FLOOR 13 ▸ SUITE 0{officeNum}
        </div>
        <div className="absolute right-6 top-6 font-mono text-[10px] tracking-[0.3em] text-zinc-400">
          {PEOPLE.length} PERSONNEL
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[9.5px] tracking-[0.4em] text-zinc-400">
          ◤ SELECT AN ANALYST TO OPEN INBOX ◥
        </div>
      </div>

      {/* ── Back to hallway ── */}
      <button
        type="button"
        onClick={onExit}
        className="absolute left-6 bottom-6 z-[6] rounded-md border border-zinc-300 bg-white/90 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-600 backdrop-blur transition hover:border-zinc-500 hover:text-zinc-900"
      >
        ← Hallway
      </button>

      {/* ── Stage: 3 desks + people ── */}
      <div className="absolute inset-0" style={stageStyle}>
        {PEOPLE.map((p) => {
          const isTarget = p.num === selected;
          const dim = (phase === "pick" || phase === "exit") && !isTarget;
          return (
            <button
              key={p.num}
              type="button"
              className={cn(
                "office-person group absolute -translate-x-1/2 transition-opacity duration-300",
                dim && "opacity-30"
              )}
              style={{
                left: `${p.cx}%`,
                top: "62%",
                width: "20vw",
                maxWidth: "250px",
                minWidth: "160px"
              }}
              disabled={phase !== "in"}
              onClick={() => onPick(p.num)}
              aria-label={`Open inbox for ${p.name}`}
            >
              <Person
                number={p.num as PersonNum}
                name={p.name}
                role={p.role}
                highlighted={isTarget && phase === "in"}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/*  Person card                                                          */
/* ─────────────────────────────────────────────────────────────────── */

function Person({
  number,
  name,
  role,
  highlighted
}: {
  number: PersonNum;
  name: string;
  role: string;
  highlighted: boolean;
}) {
  const wig = WIGS[number];

  return (
    <div className="flex flex-col items-center gap-2">
      {/* "→ INBOX" hover badge */}
      <div className="pointer-events-none rounded-full border border-red-300 bg-red-50 px-2.5 py-[3px] font-mono text-[9px] font-bold tracking-[0.22em] text-red-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
        → OPEN INBOX
      </div>

      {/* Person illustration */}
      <div
        className={cn(
          "relative aspect-[3/4] w-full transition-transform duration-200",
          "group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
        )}
      >
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

          {/* ── Chair back ── */}
          <rect x="36" y="50" width="48" height="48" rx="6" fill="#1f2937" opacity="0.15" />

          {/* ── Torso / shoulders ── */}
          <path
            d="M28 106 Q28 74 60 74 Q92 74 92 106 L92 132 L28 132 Z"
            fill={`url(#shirt-${number})`}
          />
          {/* collar */}
          <path d="M52 74 L60 88 L68 74 Z" fill="#0f172a" opacity="0.35" />

          {/* ── Head ── */}
          <circle cx="60" cy="52" r="19" fill="#e8c49a" />

          {/* ── Wig (on top of head, behind face features) ── */}
          <WigShape number={number} wig={wig} />

          {/* ── Face ── */}
          <Face />
          <Lipstick />
        </svg>

        {/* glow ring */}
        <div
          className={cn(
            "pointer-events-none absolute -inset-2 rounded-xl border transition-colors duration-200",
            highlighted
              ? "border-red-400/70 shadow-[0_0_50px_-10px_rgba(239,68,68,0.4)]"
              : "border-transparent"
          )}
        />
        {/* hover ring */}
        <div className="pointer-events-none absolute -inset-2 rounded-xl border border-red-300/0 transition-colors duration-200 group-hover:border-red-300/50" />
      </div>

      {/* Nameplate */}
      <div
        className={cn(
          "rounded-md border bg-white/90 px-2.5 py-1 text-center backdrop-blur-sm transition-all duration-200",
          highlighted
            ? "border-red-300 shadow-[0_0_20px_-4px_rgba(239,68,68,0.35)]"
            : "border-zinc-200",
          "group-hover:border-red-200"
        )}
      >
        <div className="font-mono text-[10px] font-bold tracking-[0.22em] text-zinc-900">{name}</div>
        <div className="font-mono text-[9px] tracking-[0.32em] text-zinc-500">{role}</div>
      </div>
    </div>
  );
}

/* ── Wig shapes ──────────────────────────────────────────────────── */

function WigShape({ number, wig }: { number: PersonNum; wig: typeof WIGS[1] }) {
  /* Head: cx=60, cy=52, r=19 → top at y=33, sides x=41–79 */

  if (number === 1) {
    /* Curly red wig — big, voluminous, lots of loose curls */
    return (
      <g>
        {/* Cap base (covers head top + sides) */}
        <path
          d="M38 58 Q37 42 44 32 Q52 20 60 19 Q68 20 76 32 Q83 42 82 58 Q76 46 66 42 Q60 40 54 42 Q44 46 38 58 Z"
          fill={wig.dark}
        />
        {/* Curl clusters on top */}
        <ellipse cx="46" cy="28" rx="11" ry="12" fill={wig.mid} />
        <ellipse cx="60" cy="20" rx="13" ry="13" fill={wig.mid} />
        <ellipse cx="74" cy="28" rx="11" ry="12" fill={wig.mid} />
        {/* Side volume (hanging down beside face) */}
        <ellipse cx="35" cy="44" rx="9" ry="14" fill={wig.base} />
        <ellipse cx="85" cy="44" rx="9" ry="14" fill={wig.base} />
        {/* Top highlights */}
        <ellipse cx="53" cy="20" rx="5" ry="7" fill={wig.light} opacity="0.5" />
        <ellipse cx="60" cy="16" rx="6" ry="6" fill={wig.light} opacity="0.4" />
        <ellipse cx="67" cy="20" rx="5" ry="7" fill={wig.light} opacity="0.5" />
        {/* Shine streak */}
        <path d="M50 20 Q60 15 70 20" stroke={wig.shine} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.55" />
        {/* hairline fade over forehead */}
        <path d="M43 42 Q48 36 54 40 Q60 36 66 40 Q72 36 77 42 Q70 38 60 38 Q50 38 43 42 Z" fill={wig.dark} opacity="0.8" />
      </g>
    );
  }

  if (number === 2) {
    /* Wavy green wig — sleek on top, big flips at the sides */
    return (
      <g>
        {/* Cap base */}
        <path
          d="M40 57 Q38 41 46 31 Q54 19 60 18 Q66 19 74 31 Q82 41 80 57 Q74 44 66 41 Q60 39 54 41 Q46 44 40 57 Z"
          fill={wig.dark}
        />
        {/* Main top mass */}
        <ellipse cx="60" cy="22" rx="18" ry="15" fill={wig.base} />
        {/* Side volume — big outward flips */}
        <ellipse cx="34" cy="42" rx="10" ry="16" fill={wig.base} />
        <ellipse cx="86" cy="42" rx="10" ry="16" fill={wig.base} />
        {/* Side flip tip highlights */}
        <ellipse cx="30" cy="50" rx="7" ry="10" fill={wig.mid} opacity="0.7" />
        <ellipse cx="90" cy="50" rx="7" ry="10" fill={wig.mid} opacity="0.7" />
        {/* Top sheen */}
        <ellipse cx="54" cy="19" rx="8" ry="7" fill={wig.light} opacity="0.45" />
        <ellipse cx="66" cy="19" rx="8" ry="7" fill={wig.light} opacity="0.45" />
        {/* Wave highlight lines */}
        <path d="M44 25 Q52 20 60 22 Q68 20 76 25" stroke={wig.shine} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
        <path d="M44 30 Q52 26 60 28 Q68 26 76 30" stroke={wig.shine} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.3" />
        {/* Hairline */}
        <path d="M44 41 Q50 35 56 39 Q60 35 64 39 Q70 35 76 41 Q68 37 60 37 Q52 37 44 41 Z" fill={wig.dark} opacity="0.85" />
      </g>
    );
  }

  /* Person 3: Big fluffy pink wig — maximum volume, soft & round */
  return (
    <g>
      {/* Cap base */}
      <path
        d="M39 58 Q37 42 44 31 Q52 19 60 18 Q68 19 76 31 Q83 42 81 58 Q75 45 66 41 Q60 39 54 41 Q45 45 39 58 Z"
        fill={wig.dark}
      />
      {/* Main poof — very round and large */}
      <ellipse cx="60" cy="20" rx="20" ry="18" fill={wig.base} />
      {/* Extra poof bumps */}
      <ellipse cx="44" cy="24" rx="13" ry="14" fill={wig.mid} />
      <ellipse cx="76" cy="24" rx="13" ry="14" fill={wig.mid} />
      {/* Side volume */}
      <ellipse cx="32" cy="42" rx="11" ry="16" fill={wig.base} />
      <ellipse cx="88" cy="42" rx="11" ry="16" fill={wig.base} />
      {/* Soft highlights — center top and bumps */}
      <ellipse cx="50" cy="16" rx="8" ry="8" fill={wig.light} opacity="0.5" />
      <ellipse cx="60" cy="12" rx="9" ry="9" fill={wig.light} opacity="0.45" />
      <ellipse cx="70" cy="16" rx="8" ry="8" fill={wig.light} opacity="0.5" />
      {/* Shine streak */}
      <path d="M48 14 Q60 9 72 14" stroke={wig.shine} strokeWidth="2.8" fill="none" strokeLinecap="round" opacity="0.55" />
      <path d="M44 20 Q60 14 76 20" stroke={wig.shine} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.3" />
      {/* Hairline */}
      <path d="M43 41 Q49 34 55 39 Q60 34 65 39 Q71 34 77 41 Q69 37 60 37 Q51 37 43 41 Z" fill={wig.dark} opacity="0.85" />
    </g>
  );
}

/* ── Face features (shared) ──────────────────────────────────────── */
/* Head: cx=60 cy=52 r=19 */

function Face() {
  return (
    <>
      {/* Forehead / cheek shading */}
      <ellipse cx="60" cy="58" rx="13" ry="7" fill="#000" opacity="0.05" />

      {/* Cheek blush */}
      <ellipse cx="48" cy="56" rx="5" ry="3" fill="#f9a8d4" opacity="0.35" />
      <ellipse cx="72" cy="56" rx="5" ry="3" fill="#f9a8d4" opacity="0.35" />

      {/* Eyebrows */}
      <path d="M48.5 44 Q52.5 41.5 56.5 43.5" stroke="#5a3a28" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M63.5 43.5 Q67.5 41.5 71.5 44" stroke="#5a3a28" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Left eye */}
      <ellipse cx="53" cy="48" rx="4.5" ry="3.5" fill="white" />
      <ellipse cx="53.4" cy="48.4" rx="3" ry="3" fill="#3d2812" />
      <circle cx="53.4" cy="48.4" r="1.8" fill="#1a0f08" />
      <circle cx="54.5" cy="47.2" r="1" fill="white" opacity="0.9" />
      {/* lashes */}
      <path d="M49.5 46.5 L48.2 44.8 M51 45.5 L50.2 43.8 M53 45 L52.8 43.2 M55 45.5 L55.4 43.8 M56.5 46.5 L57.4 44.8"
        stroke="#2d1a10" strokeWidth="0.7" strokeLinecap="round" />

      {/* Right eye */}
      <ellipse cx="67" cy="48" rx="4.5" ry="3.5" fill="white" />
      <ellipse cx="66.6" cy="48.4" rx="3" ry="3" fill="#3d2812" />
      <circle cx="66.6" cy="48.4" r="1.8" fill="#1a0f08" />
      <circle cx="67.7" cy="47.2" r="1" fill="white" opacity="0.9" />
      {/* lashes */}
      <path d="M63.5 46.5 L62.6 44.8 M65 45.5 L64.6 43.8 M67 45 L67.2 43.2 M69 45.5 L69.8 43.8 M70.5 46.5 L71.8 44.8"
        stroke="#2d1a10" strokeWidth="0.7" strokeLinecap="round" />

      {/* Nose */}
      <ellipse cx="57.5" cy="54.5" rx="1.4" ry="1" fill="#c49a78" opacity="0.5" />
      <ellipse cx="62.5" cy="54.5" rx="1.4" ry="1" fill="#c49a78" opacity="0.5" />
      <path d="M60 50 Q59.5 53 57.5 54.5" stroke="#c49a78" strokeWidth="0.5" fill="none" opacity="0.4" />
    </>
  );
}

function Lipstick() {
  return (
    <>
      {/* Upper lip — Cupid's bow */}
      <path
        d="M53.5 58 Q56.5 56 59 57 Q60 55.8 61 57 Q63.5 56 66.5 58"
        stroke="#e91e8c"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />
      {/* Lower lip — full and pink */}
      <path
        d="M53.5 58 Q56 61.5 60 62 Q64 61.5 66.5 58 Q63 59.5 60 59.5 Q57 59.5 53.5 58 Z"
        fill="#f472b6"
        opacity="0.9"
      />
      {/* Lip gloss highlight */}
      <ellipse cx="60" cy="60" rx="3.5" ry="1" fill="white" opacity="0.35" />
      {/* Centre split line */}
      <path
        d="M53.5 58 Q60 58.6 66.5 58"
        stroke="#db2777"
        strokeWidth="0.5"
        fill="none"
        opacity="0.5"
      />
    </>
  );
}
