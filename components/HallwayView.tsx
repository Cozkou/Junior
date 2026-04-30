"use client";

import { type CSSProperties } from "react";
import { cn } from "@/lib/cn";

/**
 * "entering" → scale 1.5 to 1 (camera decelerates as it steps inside)
 * "in"       → fully settled, doors are clickable
 */
export type HallwayPhase = "idle" | "entering" | "in" | "approach" | "open" | "exit";
export type OfficeNum = 1 | 2 | 3 | 4 | 5;

const ROOM_NAMES: Record<OfficeNum, string> = {
  1: "Cursor",
  2: "White Circle",
  3: "Spectre",
  4: "Halkin",
  5: "B5"
};

/** Perspective corridor layout ─ 2 doors on each side + 1 at the end.
 *  cx/cy = centre of door as % of viewport; h = door height in vh.
 *  rotY = CSS rotateY degrees (positive = face left, negative = face right, 0 = facing us) */
type DoorSpec = {
  num: OfficeNum;
  cx: number;
  cy: number;
  h: number;
  side: "left" | "right" | "back";
  rotY: number;
};

const DOORS: DoorSpec[] = [
  // close pair — steep angle (they're almost parallel to the viewer's line of sight)
  { num: 1, cx: 15,  cy: 55, h: 66, side: "left",  rotY:  58 }, // Cursor
  { num: 2, cx: 85,  cy: 55, h: 66, side: "right", rotY: -58 }, // White Circle
  // far pair — shallower angle (further down the corridor)
  { num: 3, cx: 32,  cy: 52, h: 40, side: "left",  rotY:  46 }, // Spectre
  { num: 4, cx: 68,  cy: 52, h: 40, side: "right", rotY: -46 }, // Halkin
  // end — facing us directly
  { num: 5, cx: 50,  cy: 50, h: 25, side: "back",  rotY:   0 }, // B5
];

// Render order: farthest first (end), then far pair, then close pair
const RENDER_ORDER: OfficeNum[] = [5, 3, 4, 1, 2];

type Props = {
  phase: HallwayPhase;
  selected: OfficeNum;
  onSelect: (n: OfficeNum) => void;
  onExit: () => void;
};

export function HallwayView({ phase, selected, onSelect, onExit }: Props) {
  const target = DOORS.find((d) => d.num === selected) ?? DOORS[0];

  const containerStyle: CSSProperties = {
    opacity: phase === "idle" ? 0 : 1,
    transition: "opacity 0.38s ease-out",
    pointerEvents: phase === "idle" || phase === "entering" ? "none" : "auto"
  };

  const stageStyle = (): CSSProperties => {
    switch (phase) {
      case "entering":
        // Instantaneous — browser paints this before we flip to "in"
        return { transform: "scale(1.55)", transformOrigin: "50% 55%" };
      case "in":
        return {
          transform: "scale(1)",
          transformOrigin: "50% 55%",
          transition: "transform 0.62s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
        };
      case "approach":
        return {
          transform: "scale(2.85)",
          transformOrigin: `${target.cx}% ${target.cy}%`,
          transition: "transform 0.72s cubic-bezier(0.55, 0, 0.32, 1)"
        };
      case "open":
        return {
          transform: "scale(5.6)",
          transformOrigin: `${target.cx}% ${target.cy}%`,
          transition: "transform 0.72s cubic-bezier(0.55, 0, 0.32, 1)"
        };
      case "exit":
        return {
          transform: "scale(8.5)",
          transformOrigin: `${target.cx}% ${target.cy}%`,
          transition: "transform 0.72s cubic-bezier(0.55, 0, 0.32, 1)"
        };
      default:
        return { transform: "scale(1)", transformOrigin: "50% 55%" };
    }
  };

  const zooming = phase === "approach" || phase === "open" || phase === "exit";

  return (
    <div
      className="fixed inset-0 z-[210] overflow-hidden bg-[#b8c8d8]"
      style={containerStyle}
      aria-hidden={phase === "idle"}
    >
      {/* ─── Perspective corridor background ─── */}
      <CorridorBg />

      {/* ─── Back button ─── */}
      <button
        type="button"
        onClick={onExit}
        className="absolute left-6 bottom-6 z-[6] rounded-md border border-zinc-300 bg-white/90 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-600 backdrop-blur transition hover:border-zinc-500 hover:text-zinc-900"
      >
        ← Back
      </button>

      {/* ─── Stage (all 5 doors) ─── */}
      <div className="absolute inset-0" style={stageStyle()} aria-busy={phase !== "in"}>
        {RENDER_ORDER.map((num) => {
          const d = DOORS.find((x) => x.num === num)!;
          const isTarget = d.num === selected;
          const opening = isTarget && (phase === "open" || phase === "exit");
          const dim = zooming && !isTarget;

          const h = d.h;
          // Make side doors physically wider — the rotateY compresses the visual width
          const w = d.side === "back" ? h * 0.52 : h * 0.62;

          // Build the per-door 3-D transform:
          // translate(-50%,-50%) centers the element on cx/cy,
          // then perspective(900px) rotateY(rotY) rotates it in-place.
          const rot = d.rotY !== 0 ? ` perspective(900px) rotateY(${d.rotY}deg)` : "";

          return (
            <button
              key={d.num}
              type="button"
              disabled={phase !== "in"}
              onClick={() => onSelect(d.num)}
              aria-label={`Enter ${ROOM_NAMES[d.num]}`}
              style={{
                position: "absolute",
                left: `${d.cx}%`,
                top: `${d.cy}%`,
                width: `${w}vh`,
                height: `${h}vh`,
                transform: `translate(-50%, -50%)${rot}`,
                zIndex: Math.round(h)
              }}
              className={cn(
                "hallway-door group",
                dim && "opacity-20 pointer-events-none"
              )}
            >
              <CorridorDoor
                name={ROOM_NAMES[d.num]}
                side={d.side}
                h={h}
                opening={opening}
                active={isTarget && !zooming}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  Corridor background SVG                                                 */
/* ─────────────────────────────────────────────────────────────────────── */

function CorridorBg() {
  // Geometry constants (in SVG user units, viewBox 0 0 1000 640)
  const VP_X = 500, VP_Y = 320;
  const FW_X1 = 362, FW_Y1 = 192; // far-wall top-left
  const FW_X2 = 638, FW_Y2 = 448; // far-wall bottom-right

  // Horizontal floor tile y positions
  const floorTiles = [FW_Y2, 468, 492, 515, 537, 558, 577, 594, 609, 622, 633, 640];

  function floorTileX(y: number): [number, number] {
    const t = (y - FW_Y2) / (640 - FW_Y2);
    return [FW_X1 * (1 - t), 1000 - FW_X1 * (1 - t)];
  }

  // Wall panel horizontal lines
  const wallPanelYs = [232, 275, 320, 365, 400, 430];

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1000 640"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        {/* Near-edge walls are darker → depth cue, so no page bg shows through */}
        <linearGradient id="hv-ceil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8d4de" />
          <stop offset="60%" stopColor="#dde6ef" />
          <stop offset="100%" stopColor="#edf2f7" />
        </linearGradient>
        <linearGradient id="hv-lwall" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b8c8d8" />
          <stop offset="40%" stopColor="#cdd8e4" />
          <stop offset="100%" stopColor="#e4ecf3" />
        </linearGradient>
        <linearGradient id="hv-rwall" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="#b8c8d8" />
          <stop offset="40%" stopColor="#cdd8e4" />
          <stop offset="100%" stopColor="#e4ecf3" />
        </linearGradient>
        <linearGradient id="hv-floor" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#bac6d4" />
          <stop offset="50%" stopColor="#cdd8e2" />
          <stop offset="100%" stopColor="#e2eaf1" />
        </linearGradient>
        <linearGradient id="hv-backwall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0f4f8" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <linearGradient id="hv-lightstrip" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffef8" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fffef8" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hv-floorref" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        {/* Near-edge vignette — darkens the very edges closest to the viewer */}
        <radialGradient id="hv-vignette" cx="50%" cy="50%" r="75%" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.38" />
        </radialGradient>
      </defs>

      {/* ── Surfaces ── */}
      {/* Ceiling */}
      <polygon points={`0,0 1000,0 ${FW_X2},${FW_Y1} ${FW_X1},${FW_Y1}`} fill="url(#hv-ceil)" />
      {/* Left wall */}
      <polygon points={`0,0 ${FW_X1},${FW_Y1} ${FW_X1},${FW_Y2} 0,640`} fill="url(#hv-lwall)" />
      {/* Right wall */}
      <polygon points={`1000,0 ${FW_X2},${FW_Y1} ${FW_X2},${FW_Y2} 1000,640`} fill="url(#hv-rwall)" />
      {/* Floor */}
      <polygon points={`0,640 1000,640 ${FW_X2},${FW_Y2} ${FW_X1},${FW_Y2}`} fill="url(#hv-floor)" />
      {/* Back wall */}
      <rect x={FW_X1} y={FW_Y1} width={FW_X2 - FW_X1} height={FW_Y2 - FW_Y1} fill="url(#hv-backwall)" />

      {/* ── Ceiling LED strip ── */}
      <polygon
        points={`440,0 560,0 ${VP_X + 18},${FW_Y1} ${VP_X - 18},${FW_Y1}`}
        fill="url(#hv-lightstrip)"
        opacity="0.9"
      />
      {/* Ceiling strip edge lines */}
      <line x1="440" y1="0" x2={VP_X - 18} y2={FW_Y1} stroke="#f5f0e0" strokeWidth="0.5" opacity="0.7" />
      <line x1="560" y1="0" x2={VP_X + 18} y2={FW_Y1} stroke="#f5f0e0" strokeWidth="0.5" opacity="0.7" />

      {/* ── Ceiling secondary strips (left/right) ── */}
      {[[200, 250], [750, 800]].map(([x1, x2], i) => (
        <polygon
          key={`ceil-strip-${i}`}
          points={`${x1},0 ${x2},0 ${VP_X + (i === 0 ? -32 : 32)},${FW_Y1} ${VP_X + (i === 0 ? -42 : 42)},${FW_Y1}`}
          fill="#fffef4"
          opacity="0.45"
        />
      ))}

      {/* ── Ceiling seam / crown molding ── */}
      <line x1="0" y1="0" x2={FW_X1} y2={FW_Y1} stroke="#c8d4de" strokeWidth="1.8" />
      <line x1="1000" y1="0" x2={FW_X2} y2={FW_Y1} stroke="#c8d4de" strokeWidth="1.8" />

      {/* ── Wall-floor baseboard ── */}
      <line x1="0" y1="640" x2={FW_X1} y2={FW_Y2} stroke="#b8c4d0" strokeWidth="2" />
      <line x1="1000" y1="640" x2={FW_X2} y2={FW_Y2} stroke="#b8c4d0" strokeWidth="2" />
      {/* baseboard shading */}
      <line x1="0" y1="630" x2={FW_X1} y2={FW_Y2 - 4} stroke="#ccd5de" strokeWidth="0.8" opacity="0.6" />
      <line x1="1000" y1="630" x2={FW_X2} y2={FW_Y2 - 4} stroke="#ccd5de" strokeWidth="0.8" opacity="0.6" />

      {/* Back wall border */}
      <rect x={FW_X1} y={FW_Y1} width={FW_X2 - FW_X1} height={FW_Y2 - FW_Y1}
        fill="none" stroke="#c8d4de" strokeWidth="1.5" />

      {/* ── Left wall panel lines (wainscoting style) ── */}
      {wallPanelYs.map((fy, i) => {
        // Interpolate x positions along the left wall
        const t = (fy - FW_Y1) / (FW_Y2 - FW_Y1);
        const x0 = 0 + t * 0;          // left edge stays x=0 in perspective
        const xFar = FW_X1;             // far edge x at corresponding height
        const y0 = t * 640;             // y on the outer (left) edge, perspective interpolation
        // Simpler: draw horizontal-ish lines across the left wall
        const nearY = fy * (640 / FW_Y2); // scaled near y
        return (
          <line
            key={`lwall-panel-${i}`}
            x1={0}
            y1={nearY}
            x2={FW_X1}
            y2={fy}
            stroke="#c8d4de"
            strokeWidth="0.55"
            opacity="0.65"
          />
        );
      })}
      {/* Right wall panel lines (mirrored) */}
      {wallPanelYs.map((fy, i) => {
        const nearY = fy * (640 / FW_Y2);
        return (
          <line
            key={`rwall-panel-${i}`}
            x1={1000}
            y1={nearY}
            x2={FW_X2}
            y2={fy}
            stroke="#c8d4de"
            strokeWidth="0.55"
            opacity="0.65"
          />
        );
      })}

      {/* ── Wall sconces (between close/far doors, left and right) ── */}
      {/* Left sconce */}
      <rect x="188" y="240" width="18" height="28" rx="2" fill="#e0e8f0" stroke="#b8c4d0" strokeWidth="0.8" />
      <rect x="192" y="232" width="10" height="10" rx="1" fill="#f0f5fa" stroke="#c8d4de" strokeWidth="0.5" />
      <ellipse cx="197" cy="250" rx="5" ry="3" fill="#fffef4" opacity="0.8" />
      {/* Right sconce */}
      <rect x="794" y="240" width="18" height="28" rx="2" fill="#e0e8f0" stroke="#b8c4d0" strokeWidth="0.8" />
      <rect x="798" y="232" width="10" height="10" rx="1" fill="#f0f5fa" stroke="#c8d4de" strokeWidth="0.5" />
      <ellipse cx="803" cy="250" rx="5" ry="3" fill="#fffef4" opacity="0.8" />

      {/* ── Floor tiles (horizontal) ── */}
      {floorTiles.map((y, i) => {
        const [xl, xr] = floorTileX(y);
        return (
          <line
            key={`tile-h-${i}`}
            x1={xl}
            y1={y}
            x2={xr}
            y2={y}
            stroke="#c8d4de"
            strokeWidth={0.3 + ((y - FW_Y2) / (640 - FW_Y2)) * 0.7}
            opacity={0.45 + ((y - FW_Y2) / (640 - FW_Y2)) * 0.45}
          />
        );
      })}
      {/* Floor vertical convergence lines */}
      {[120, 240, 360, 480, 520, 640, 760, 880].map((xNear, i) => {
        const t = (FW_Y2 - VP_Y) / (640 - VP_Y);
        const xFar = VP_X + (xNear - VP_X) * t;
        return (
          <line
            key={`tile-v-${i}`}
            x1={xNear}
            y1={640}
            x2={xFar}
            y2={FW_Y2}
            stroke="#c8d4de"
            strokeWidth="0.3"
            opacity="0.45"
          />
        );
      })}
      {/* Floor reflection shimmer */}
      <polygon
        points={`${VP_X - 60},${FW_Y2} ${VP_X + 60},${FW_Y2} ${VP_X + 180},640 ${VP_X - 180},640`}
        fill="url(#hv-floorref)"
      />

      {/* ── Back wall baseboard ── */}
      <rect x={FW_X1} y={FW_Y2 - 10} width={FW_X2 - FW_X1} height="10" fill="#d5dde7" opacity="0.7" />

      {/* ── Back wall: floor sign ── */}
      <text
        x={VP_X}
        y={FW_Y1 + 18}
        textAnchor="middle"
        fill="#94a3b8"
        fontSize="9"
        fontFamily="ui-monospace, monospace"
        letterSpacing="4"
        opacity="0.7"
      >
        HALKIN · FLOOR 13
      </text>

      {/* ── Near-edge vignette — makes the corridor feel enclosed ── */}
      <rect width="1000" height="640" fill="url(#hv-vignette)" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  Door component                                                          */
/* ─────────────────────────────────────────────────────────────────────── */

function CorridorDoor({
  name,
  side,
  h,
  opening,
  active
}: {
  name: string;
  side: "left" | "right" | "back";
  h: number;
  opening: boolean;
  active: boolean;
}) {
  // Scale-aware sizes (all proportional to door height in vh)
  const fs = {
    name:     `${h * 0.052}vh`,
    plate:    `${h * 0.028}vh`,
    inner:    `${h * 0.032}vh`,
    panel:    `${h * 0.024}vh`,
  };

  return (
    <div className="relative h-full w-full select-none">
      {/* ── Door casing (thick dark frame) ── */}
      <div
        className={cn(
          "absolute inset-0 rounded-[3px]",
          "bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900",
          "shadow-[0_32px_64px_-28px_rgba(15,23,42,0.45)]",
          "transition-shadow duration-300",
          active && "shadow-[0_0_0_2px_rgba(239,68,68,0.55),0_32px_64px_-28px_rgba(15,23,42,0.45)]"
        )}
      />

      {/* ── Transom window (above door, taller doors only) ── */}
      {h > 35 && (
        <div
          className="absolute left-[7%] right-[7%] rounded-t-[2px] bg-gradient-to-b from-sky-50/90 to-zinc-100/70"
          style={{ top: "6%", height: "12%" }}
        >
          <div className="absolute inset-[1px] border border-zinc-500/40" />
          {/* transom mullion */}
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-px bg-zinc-500/40" />
        </div>
      )}

      {/* ── Door opening / glass panel area ── */}
      <div
        className="absolute left-[7%] right-[7%] overflow-hidden bg-white"
        style={{
          top: h > 35 ? "19%" : "8%",
          bottom: "7%",
          borderRadius: "2px"
        }}
      >
        {/* Interior (visible once door opens) */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-50 via-white to-zinc-50" />
        <div className="absolute inset-0 bg-[radial-gradient(100%_80%_at_50%_100%,#ffffff,#f0f4f8_60%,transparent)]" />
        <span
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-mono font-bold tracking-[0.28em] text-zinc-300 transition-opacity duration-300",
            opening ? "opacity-100" : "opacity-0"
          )}
          style={{ fontSize: fs.inner }}
        >
          ENTERING
        </span>

        {/* Left door leaf */}
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-1/2 overflow-hidden border-r border-zinc-200/70 origin-left",
            "transition-transform duration-[640ms] ease-[cubic-bezier(0.6,0,0.18,1)]",
            opening ? "-translate-x-full" : "translate-x-0"
          )}
          style={{
            background: "linear-gradient(135deg, #f5f7fa 0%, #ffffff 50%, #edf0f5 100%)"
          }}
        >
          {/* Door panels on left leaf */}
          <DoorPanels side="left" h={h} />
          {/* Handle */}
          <div
            className="absolute right-[12%] top-[42%] rounded-sm bg-zinc-500"
            style={{ width: "5%", height: "14%", minWidth: 3 }}
          />
        </div>

        {/* Right door leaf */}
        <div
          className={cn(
            "absolute inset-y-0 right-0 w-1/2 overflow-hidden border-l border-zinc-200/70 origin-right",
            "transition-transform duration-[640ms] ease-[cubic-bezier(0.6,0,0.18,1)]",
            opening ? "translate-x-full" : "translate-x-0"
          )}
          style={{
            background: "linear-gradient(225deg, #f5f7fa 0%, #ffffff 50%, #edf0f5 100%)"
          }}
        >
          <DoorPanels side="right" h={h} />
          <div
            className="absolute left-[12%] top-[42%] rounded-sm bg-zinc-500"
            style={{ width: "5%", height: "14%", minWidth: 3 }}
          />
        </div>
      </div>

      {/* ── Kick plate ── */}
      <div
        className="absolute left-[7%] right-[7%] rounded-b-[2px] bg-gradient-to-b from-zinc-600 to-zinc-700"
        style={{ bottom: "3%", height: "4%" }}
      />

      {/* ── Name plate above door ── */}
      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-sm border bg-white px-[0.6em] py-[0.2em]",
          "font-mono font-bold uppercase tracking-[0.22em] transition-colors duration-200",
          active
            ? "border-red-400/70 text-red-700 shadow-[0_0_14px_rgba(239,68,68,0.3)]"
            : "border-zinc-400/60 text-zinc-700"
        )}
        style={{
          top: "-1.8em",
          fontSize: fs.plate,
          lineHeight: 1.4
        }}
      >
        {name}
      </div>

      {/* ── Hover/active glow ring ── */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[3px] border-2 transition-colors duration-200",
          active ? "border-red-400/50" : "border-transparent",
          "group-hover:border-red-300/30"
        )}
      />
    </div>
  );
}

/** Inset panels on each door leaf */
function DoorPanels({ side, h }: { side: "left" | "right"; h: number }) {
  if (h < 30) return null; // end door is too small for panel detail
  const panels = h > 45 ? [[12, 30], [38, 80]] : [[15, 72]]; // [top%, bottom%]
  return (
    <>
      {panels.map(([top, bottom], i) => (
        <div
          key={i}
          className="absolute border border-zinc-200/60 bg-zinc-50/40"
          style={{
            left: "10%",
            right: "10%",
            top: `${top}%`,
            bottom: `${100 - bottom}%`,
            borderRadius: "1px"
          }}
        />
      ))}
    </>
  );
}
