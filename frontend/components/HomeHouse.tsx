/**
 * Minimal house illustration for the home hero; vector for crisp zoom/interaction later.
 */
export function HomeHouse({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 440 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="houseRoof" x1="220" y1="40" x2="220" y2="220" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2a3540" stopOpacity={0.12} />
          <stop offset="1" stopColor="#2a3540" stopOpacity={0.04} />
        </linearGradient>
        <linearGradient id="houseBody" x1="220" y1="140" x2="220" y2="360" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#eef2f6" />
        </linearGradient>
        <linearGradient id="houseWindow" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#e8eef4" />
          <stop offset="1" stopColor="#d4dde7" />
        </linearGradient>
      </defs>
      {/* Ground plane */}
      <ellipse cx="220" cy="332" rx="168" ry="14" fill="#1a1f24" fillOpacity={0.06} />
      {/* House body */}
      <path
        d="M132 318V180h176v138H132z"
        fill="url(#houseBody)"
        stroke="#1a1f24"
        strokeOpacity={0.12}
        strokeWidth={2}
      />
      {/* Roof */}
      <path
        d="M96 178L220 58l124 120H96z"
        fill="url(#houseRoof)"
        stroke="#1a1f24"
        strokeOpacity={0.14}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {/* Door */}
      <rect
        x="196"
        y="232"
        width="48"
        height="86"
        rx="3"
        fill="#f9fafb"
        stroke="#1a1f24"
        strokeOpacity={0.14}
        strokeWidth={2}
      />
      <circle cx="232" cy="276" r="3" fill="#5b6672" fillOpacity={0.45} />
      {/* Windows */}
      <rect x="152" y="198" width="44" height="44" rx="3" fill="url(#houseWindow)" stroke="#1a1f24" strokeOpacity={0.1} strokeWidth={1.5} />
      <rect x="244" y="198" width="44" height="44" rx="3" fill="url(#houseWindow)" stroke="#1a1f24" strokeOpacity={0.1} strokeWidth={1.5} />
      <path d="M174 198v44M152 220h44M266 198v44M244 220h44" stroke="#1a1f24" strokeOpacity={0.08} strokeWidth={1} />
      {/* Chimney */}
      <rect x="288" y="92" width="36" height="72" rx="2" fill="#eef2f6" stroke="#1a1f24" strokeOpacity={0.12} strokeWidth={1.75} />
    </svg>
  );
}
