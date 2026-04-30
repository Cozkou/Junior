/**
 * HALKIN tower — detailed front elevation, transparent backdrop.
 *  - 30-floor curtain wall, every window split into two panels w/ mullion
 *  - structural columns + floor lines
 *  - mid-tier maintenance balcony + thin red accent
 *  - HALKIN signage (small, refined)
 *  - crown: stepped setbacks, HVAC plant, helipad H, antenna with guy-wires
 *  - double-height lobby with revolving entrance + signage
 *  - subtle ground-shadow ellipse so the building "floats" on graph paper
 */
export function HalkinSkyscraper({ className }: { className?: string }) {
  // Geometry
  const VB_W = 240;
  const VB_H = 780;

  const TOWER_X = 60; // left edge of main facade
  const TOWER_W = 120; // facade width
  const TOWER_TOP = 130; // top of curtain wall
  const TOWER_BOTTOM = 660; // bottom of curtain wall (lobby starts below)

  // Window grid
  const FLOORS = 30;
  const COLS = 3;
  const colCenters = [
    TOWER_X + TOWER_W * (1 / 6),
    TOWER_X + TOWER_W * (3 / 6),
    TOWER_X + TOWER_W * (5 / 6)
  ];
  const winW = 30;
  const winH = 13;
  const floorH = (TOWER_BOTTOM - TOWER_TOP) / FLOORS;

  // HALKIN signage band sits on floors 14-15
  const bandFloorStart = 14;
  const bandFloorEnd = 15;

  type WinSpec = {
    x: number;
    y: number;
    w: number;
    h: number;
    fill: string;
    stroke: string;
  };
  const windows: WinSpec[] = [];

  for (let row = 0; row < FLOORS; row++) {
    if (row >= bandFloorStart && row <= bandFloorEnd) continue;
    for (let c = 0; c < COLS; c++) {
      const cx = colCenters[c];
      const x = cx - winW / 2;
      const y = TOWER_TOP + row * floorH + (floorH - winH) / 2;
      const seed = (row * 11 + c * 37 + 5) % 17;
      const warm = seed === 0 || seed === 6 || seed === 12;
      const lit = warm || seed === 1 || seed === 4 || seed === 9;
      const fill = warm
        ? "#fde68a"
        : lit
          ? "#dde7f0"
          : "#3f4a59";
      const stroke = warm ? "#f59e0b" : "#1c2531";
      windows.push({ x, y, w: winW, h: winH, fill, stroke });
    }
  }

  return (
    <svg
      className={className}
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="hs-facade" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#fbfdff" />
          <stop offset="0.42" stopColor="#dde6ef" />
          <stop offset="1" stopColor="#b6c1ce" />
        </linearGradient>
        <linearGradient id="hs-side-l" x1="1" y1="0" x2="0" y2="0">
          <stop stopColor="#a4b0bd" />
          <stop offset="1" stopColor="#7d8a98" />
        </linearGradient>
        <linearGradient id="hs-side-r" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#a8b3c0" />
          <stop offset="1" stopColor="#838f9d" />
        </linearGradient>
        <linearGradient id="hs-lobby" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#dee7ef" />
          <stop offset="1" stopColor="#9aa6b3" />
        </linearGradient>
        <linearGradient id="hs-glassReflect" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="0.7" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="hs-shadow" cx="0.5" cy="0.5" r="0.5">
          <stop stopColor="#0b1320" stopOpacity="0.18" />
          <stop offset="1" stopColor="#0b1320" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx={VB_W / 2} cy="755" rx="78" ry="6" fill="url(#hs-shadow)" />

      {/* === CROWN ====================================================== */}
      {/* antenna mast */}
      <line x1={VB_W / 2} y1="14" x2={VB_W / 2} y2="78" stroke="#1f2935" strokeWidth="2.2" />
      {/* antenna sub-tiers */}
      <line x1={VB_W / 2} y1="22" x2={VB_W / 2 + 6} y2="20" stroke="#1f2935" strokeWidth="0.9" />
      <line x1={VB_W / 2} y1="34" x2={VB_W / 2 - 8} y2="31" stroke="#1f2935" strokeWidth="0.9" />
      <line x1={VB_W / 2} y1="46" x2={VB_W / 2 + 9} y2="43" stroke="#1f2935" strokeWidth="0.9" />
      {/* aviation light */}
      <circle cx={VB_W / 2} cy="14" r="1.6" fill="#ef4444">
        <animate attributeName="opacity" values="1;0.35;1" dur="2.4s" repeatCount="indefinite" />
      </circle>
      {/* guy wires */}
      <line x1={VB_W / 2} y1="50" x2={VB_W / 2 - 16} y2="82" stroke="#1f2935" strokeWidth="0.5" opacity="0.55" />
      <line x1={VB_W / 2} y1="50" x2={VB_W / 2 + 16} y2="82" stroke="#1f2935" strokeWidth="0.5" opacity="0.55" />

      {/* upper crown plinth */}
      <rect x={VB_W / 2 - 18} y="78" width="36" height="14" fill="#cdd7e1" stroke="#7d8a98" strokeWidth="0.6" />
      <rect x={VB_W / 2 - 18} y="78" width="36" height="2" fill="#1f2935" opacity="0.4" />

      {/* helipad */}
      <ellipse cx={VB_W / 2 - 28} cy="98" rx="12" ry="3" fill="#cdd7e1" stroke="#1f2935" strokeWidth="0.4" />
      <text
        x={VB_W / 2 - 28}
        y="100.5"
        textAnchor="middle"
        fill="#1f2935"
        style={{ fontFamily: "ui-sans-serif, sans-serif", fontSize: 5, fontWeight: 700 }}
      >
        H
      </text>

      {/* HVAC unit */}
      <rect x={VB_W / 2 + 8} y="92" width="22" height="10" fill="#aab5c1" stroke="#1f2935" strokeWidth="0.4" />
      <line x1={VB_W / 2 + 11} y1="92" x2={VB_W / 2 + 11} y2="102" stroke="#1f2935" strokeWidth="0.3" />
      <line x1={VB_W / 2 + 16} y1="92" x2={VB_W / 2 + 16} y2="102" stroke="#1f2935" strokeWidth="0.3" />
      <line x1={VB_W / 2 + 21} y1="92" x2={VB_W / 2 + 21} y2="102" stroke="#1f2935" strokeWidth="0.3" />
      <line x1={VB_W / 2 + 26} y1="92" x2={VB_W / 2 + 26} y2="102" stroke="#1f2935" strokeWidth="0.3" />

      {/* upper-roof red strip */}
      <rect x={VB_W / 2 - 18} y="92" width="36" height="0.6" fill="#ef4444" />

      {/* === MAIN VOLUME ================================================= */}
      {/* slight setback shelf above tower */}
      <path
        d={`M${TOWER_X - 3} ${TOWER_TOP - 22} L${TOWER_X + TOWER_W + 3} ${TOWER_TOP - 22} L${TOWER_X + TOWER_W + 6} ${TOWER_TOP - 12} L${TOWER_X - 6} ${TOWER_TOP - 12} Z`}
        fill="#bcc6d1"
      />
      <rect x={TOWER_X - 6} y={TOWER_TOP - 12} width={TOWER_W + 12} height="6" fill="#a3aebb" />
      <rect x={TOWER_X - 6} y={TOWER_TOP - 6} width={TOWER_W + 12} height="6" fill="#dbe2ea" stroke="#7d8a98" strokeWidth="0.4" />

      {/* Main facade */}
      <rect
        x={TOWER_X}
        y={TOWER_TOP}
        width={TOWER_W}
        height={TOWER_BOTTOM - TOWER_TOP}
        fill="url(#hs-facade)"
        stroke="#7d8a98"
        strokeWidth="0.8"
      />

      {/* Side fillets to suggest depth without a wing */}
      <rect x={TOWER_X - 4} y={TOWER_TOP} width="4" height={TOWER_BOTTOM - TOWER_TOP} fill="url(#hs-side-l)" />
      <rect x={TOWER_X + TOWER_W} y={TOWER_TOP} width="4" height={TOWER_BOTTOM - TOWER_TOP} fill="url(#hs-side-r)" />

      {/* Vertical structural columns */}
      <line x1={TOWER_X} y1={TOWER_TOP} x2={TOWER_X} y2={TOWER_BOTTOM} stroke="#5a6573" strokeWidth="0.7" />
      <line x1={TOWER_X + TOWER_W} y1={TOWER_TOP} x2={TOWER_X + TOWER_W} y2={TOWER_BOTTOM} stroke="#5a6573" strokeWidth="0.7" />
      {/* Inner mullions between window columns */}
      {[0, 1, 2].map((c) => {
        const x = TOWER_X + (TOWER_W * (c + 1)) / 4;
        return (
          <line
            key={`mullion-${c}`}
            x1={x}
            y1={TOWER_TOP}
            x2={x}
            y2={TOWER_BOTTOM}
            stroke="#7d8a98"
            strokeOpacity="0.5"
            strokeWidth="0.5"
          />
        );
      })}

      {/* Floor lines */}
      {Array.from({ length: FLOORS - 1 }, (_, i) => {
        const y = TOWER_TOP + (i + 1) * floorH;
        return (
          <line
            key={`floor-${i}`}
            x1={TOWER_X}
            y1={y}
            x2={TOWER_X + TOWER_W}
            y2={y}
            stroke="#9aa6b3"
            strokeOpacity="0.55"
            strokeWidth="0.35"
          />
        );
      })}

      {/* Mid-tier maintenance shelf at floor 22 */}
      <rect
        x={TOWER_X - 3}
        y={TOWER_TOP + 22 * floorH - 1}
        width={TOWER_W + 6}
        height="2"
        fill="#9aa6b3"
      />
      <rect
        x={TOWER_X - 3}
        y={TOWER_TOP + 22 * floorH + 1}
        width={TOWER_W + 6}
        height="0.6"
        fill="#ef4444"
        opacity="0.55"
      />
      {/* tiny cleaning rig hint */}
      <rect x={TOWER_X + TOWER_W - 24} y={TOWER_TOP + 22 * floorH - 5} width="8" height="3" fill="#5a6573" />
      <line
        x1={TOWER_X + TOWER_W - 20}
        y1={TOWER_TOP + 22 * floorH - 2}
        x2={TOWER_X + TOWER_W - 20}
        y2={TOWER_TOP + 22 * floorH + 6}
        stroke="#1f2935"
        strokeWidth="0.4"
      />

      {/* Windows */}
      {windows.map((w, i) => (
        <g key={`w-${i}`}>
          <rect
            x={w.x}
            y={w.y}
            width={w.w}
            height={w.h}
            fill={w.fill}
            stroke={w.stroke}
            strokeOpacity="0.5"
            strokeWidth="0.4"
          />
          {/* center mullion split */}
          <line
            x1={w.x + w.w / 2}
            y1={w.y}
            x2={w.x + w.w / 2}
            y2={w.y + w.h}
            stroke={w.stroke}
            strokeOpacity="0.55"
            strokeWidth="0.4"
          />
        </g>
      ))}

      {/* === HALKIN SIGN (small) ======================================= */}
      <rect
        x={TOWER_X}
        y={TOWER_TOP + bandFloorStart * floorH - 1}
        width={TOWER_W}
        height={floorH * 2 + 2}
        fill="#0b1320"
      />
      <rect
        x={TOWER_X}
        y={TOWER_TOP + bandFloorStart * floorH - 1}
        width={TOWER_W}
        height="0.7"
        fill="#ef4444"
        opacity="0.65"
      />
      <rect
        x={TOWER_X}
        y={TOWER_TOP + bandFloorStart * floorH + floorH * 2 + 0.4}
        width={TOWER_W}
        height="0.5"
        fill="#ef4444"
        opacity="0.4"
      />
      <text
        x={TOWER_X + TOWER_W / 2}
        y={TOWER_TOP + bandFloorStart * floorH + floorH + 4.3}
        textAnchor="middle"
        fill="#f1f5f9"
        style={{
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.32em"
        }}
      >
        HALKIN
      </text>

      {/* Reflection sweep on facade */}
      <path
        d={`M${TOWER_X} ${TOWER_TOP} L${TOWER_X + TOWER_W} ${TOWER_TOP} L${TOWER_X + TOWER_W} ${TOWER_TOP + 70} L${TOWER_X} ${TOWER_TOP + 200} Z`}
        fill="url(#hs-glassReflect)"
        opacity="0.5"
      />

      {/* === LOBBY ====================================================== */}
      {/* podium step */}
      <rect x={TOWER_X - 12} y={TOWER_BOTTOM} width={TOWER_W + 24} height="6" fill="#aab5c1" stroke="#7d8a98" strokeWidth="0.4" />
      {/* lobby double-height */}
      <rect
        x={TOWER_X - 12}
        y={TOWER_BOTTOM + 6}
        width={TOWER_W + 24}
        height="58"
        fill="url(#hs-lobby)"
        stroke="#7d8a98"
        strokeWidth="0.6"
      />
      {/* lobby vertical mullions */}
      {Array.from({ length: 11 }, (_, i) => (
        <line
          key={`lobby-m-${i}`}
          x1={TOWER_X - 8 + i * 14}
          y1={TOWER_BOTTOM + 8}
          x2={TOWER_X - 8 + i * 14}
          y2={TOWER_BOTTOM + 60}
          stroke="#46535f"
          strokeWidth="0.55"
          opacity="0.65"
        />
      ))}
      {/* horizontal trim */}
      <line
        x1={TOWER_X - 12}
        y1={TOWER_BOTTOM + 32}
        x2={TOWER_X + TOWER_W + 12}
        y2={TOWER_BOTTOM + 32}
        stroke="#46535f"
        strokeOpacity="0.6"
        strokeWidth="0.4"
      />
      {/* lobby HALKIN etched sign — very small */}
      <text
        x={TOWER_X + 8}
        y={TOWER_BOTTOM + 18}
        fill="#1f2935"
        opacity="0.55"
        style={{
          fontFamily: "ui-monospace, monospace",
          fontSize: 4,
          letterSpacing: "0.36em",
          fontWeight: 700
        }}
      >
        HALKIN ▸ LOBBY
      </text>
      {/* revolving door */}
      <rect x={VB_W / 2 - 14} y={TOWER_BOTTOM + 18} width="28" height="46" fill="#10171f" />
      <line x1={VB_W / 2} y1={TOWER_BOTTOM + 18} x2={VB_W / 2} y2={TOWER_BOTTOM + 64} stroke="#5d6f82" strokeWidth="0.7" />
      <line x1={VB_W / 2 - 14} y1={TOWER_BOTTOM + 41} x2={VB_W / 2 + 14} y2={TOWER_BOTTOM + 41} stroke="#5d6f82" strokeWidth="0.7" />
      <line x1={VB_W / 2 - 5} y1={TOWER_BOTTOM + 41} x2={VB_W / 2 + 5} y2={TOWER_BOTTOM + 41} stroke="#fbbf24" strokeWidth="0.6" opacity="0.7" />
      {/* awning */}
      <rect x={VB_W / 2 - 20} y={TOWER_BOTTOM + 14} width="40" height="3" fill="#0b1320" />
      <rect x={VB_W / 2 - 18} y={TOWER_BOTTOM + 17} width="36" height="1.4" fill="#ef4444" opacity="0.7" />
      {/* foundation step */}
      <rect x={TOWER_X - 22} y={TOWER_BOTTOM + 64} width={TOWER_W + 44} height="4" fill="#94a3b8" />
      <rect x={TOWER_X - 22} y={TOWER_BOTTOM + 68} width={TOWER_W + 44} height="2" fill="#cbd5e1" />
    </svg>
  );
}
