/**
 * Hintergrund der Haus-Szene: Himmel, Wiese, Weg, Hecken und Wolken.
 * Rein dekorativ – enthält keine klickbaren Bereiche.
 */
export function SzeneHintergrund({ p }: { p: string }) {
  return (
    <g id="szene-hintergrund" aria-hidden="true">
      <defs>
        <linearGradient id={`${p}-himmel`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d9e0e0" />
          <stop offset="62%" stopColor="#efe8d4" />
          <stop offset="100%" stopColor="#f7f0dc" />
        </linearGradient>
        <radialGradient id={`${p}-sonne`}>
          <stop offset="0%" stopColor="#e8d9b4" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#e8d9b4" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Himmel mit warmem Lichtschein */}
      <rect x="0" y="0" width="1600" height="860" fill={`url(#${p}-himmel)`} />
      <circle cx="1270" cy="170" r="260" fill={`url(#${p}-sonne)`} />

      {/* Wolken */}
      <g fill="#fdfbf5" opacity="0.65">
        <ellipse cx="270" cy="140" rx="86" ry="22" />
        <ellipse cx="330" cy="120" rx="60" ry="18" />
        <ellipse cx="930" cy="92" rx="70" ry="17" />
        <ellipse cx="985" cy="108" rx="48" ry="13" />
        <ellipse cx="1400" cy="250" rx="64" ry="15" opacity="0.8" />
      </g>

      {/* Wiese */}
      <rect x="0" y="850" width="1600" height="150" fill="#8ca07a" />
      <rect x="0" y="850" width="1600" height="7" fill="#64784f" opacity="0.45" />
      <ellipse cx="240" cy="1000" rx="420" ry="70" fill="#7e936c" opacity="0" />
      <ellipse cx="380" cy="990" rx="520" ry="90" fill="#82966f" opacity="0.6" />
      <ellipse cx="1300" cy="1010" rx="560" ry="100" fill="#82966f" opacity="0.5" />

      {/* Kiesweg zum Haus */}
      <path
        d="M720,1000 Q790,915 828,856 L900,856 Q872,918 930,1000 Z"
        fill="#e7ddc4"
        opacity="0.95"
      />
      <g fill="#d9cba9" opacity="0.8">
        <ellipse cx="810" cy="930" rx="7" ry="3" />
        <ellipse cx="845" cy="960" rx="6" ry="3" />
        <ellipse cx="790" cy="975" rx="8" ry="3" />
        <ellipse cx="850" cy="890" rx="6" ry="2.5" />
      </g>

      {/* Hecke am linken Rand */}
      <g fill="#4c5d3c">
        <rect x="-20" y="806" width="180" height="48" rx="22" />
        <rect x="60" y="792" width="110" height="40" rx="20" opacity="0.85" />
      </g>

      {/* Büsche und Lavendel am Haus */}
      <g>
        <circle cx="598" cy="838" r="22" fill="#64784f" />
        <circle cx="575" cy="846" r="16" fill="#4c5d3c" />
        <circle cx="1128" cy="842" r="18" fill="#64784f" />
        <g stroke="#64784f" strokeWidth="2" opacity="0.9">
          <path d="M960,852 l4,-26 M968,852 l0,-30 M976,852 l-4,-26" fill="none" />
        </g>
        <g fill="#9797b8">
          <ellipse cx="964" cy="822" rx="3.4" ry="8" />
          <ellipse cx="968" cy="818" rx="3.4" ry="9" />
          <ellipse cx="972" cy="822" rx="3.4" ry="8" />
        </g>
      </g>
    </g>
  );
}
