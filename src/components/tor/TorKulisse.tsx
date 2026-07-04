/**
 * Kulisse der Tor-Szene: eine hohe, formal geschnittene Hecke unter warmem
 * Himmel – das Haus dahinter bleibt verborgen, bis das Tor sich öffnet.
 * Rein dekorativ, deckt den gesamten Viewport ab.
 */
export function TorKulisse({ p }: { p: string }) {
  return (
    <svg
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden="true"
      focusable="false"
    >
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
      <rect x="0" y="0" width="1600" height="820" fill={`url(#${p}-himmel)`} />
      <circle cx="1250" cy="180" r="270" fill={`url(#${p}-sonne)`} />

      {/* Wolken */}
      <g fill="#fdfbf5" opacity="0.65">
        <ellipse cx="280" cy="150" rx="88" ry="22" />
        <ellipse cx="342" cy="128" rx="60" ry="18" />
        <ellipse cx="960" cy="100" rx="72" ry="17" />
        <ellipse cx="1016" cy="116" rx="48" ry="13" />
        <ellipse cx="1380" cy="300" rx="64" ry="15" opacity="0.8" />
      </g>

      {/* Vögel in der Ferne */}
      <g
        fill="none"
        stroke="#475767"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.3"
      >
        <path d="M440,320 q10,-9 20,0 M460,320 q10,-9 20,0" />
        <path d="M1090,260 q8,-7 16,0 M1106,260 q8,-7 16,0" />
      </g>

      {/* Baumwipfel, die knapp über die Hecke lugen – Ahnung eines Gartens */}
      <g opacity="0.5">
        <ellipse cx="240" cy="452" rx="110" ry="46" fill="#a9ba97" />
        <ellipse cx="1330" cy="440" rx="130" ry="52" fill="#a9ba97" />
        <ellipse cx="1420" cy="466" rx="90" ry="38" fill="#8ca07a" />
      </g>

      {/* Die hohe, formal geschnittene Hecke */}
      <g>
        <rect x="0" y="470" width="1600" height="340" fill="#4c5d3c" />
        {/* Drei Ebenen als Formschnitt-Absätze */}
        <rect x="0" y="470" width="1600" height="26" rx="13" fill="#64784f" />
        <rect x="0" y="560" width="1600" height="12" fill="#3b4a2f" opacity="0.55" />
        <rect x="0" y="676" width="1600" height="12" fill="#3b4a2f" opacity="0.55" />
        {/* Lichtkante oben, Sonnenseite */}
        <rect x="0" y="472" width="1600" height="10" rx="5" fill="#8ca07a" opacity="0.8" />
        {/* Feine Blattstruktur */}
        <g fill="#64784f" opacity="0.5">
          <ellipse cx="150" cy="520" rx="26" ry="12" />
          <ellipse cx="420" cy="610" rx="30" ry="13" />
          <ellipse cx="700" cy="530" rx="24" ry="11" />
          <ellipse cx="980" cy="640" rx="30" ry="12" />
          <ellipse cx="1240" cy="540" rx="26" ry="12" />
          <ellipse cx="1480" cy="620" rx="28" ry="12" />
          <ellipse cx="260" cy="720" rx="30" ry="12" />
          <ellipse cx="840" cy="740" rx="26" ry="11" />
          <ellipse cx="1380" cy="730" rx="30" ry="12" />
        </g>
        <g fill="#3b4a2f" opacity="0.4">
          <ellipse cx="330" cy="560" rx="24" ry="10" />
          <ellipse cx="600" cy="700" rx="28" ry="11" />
          <ellipse cx="1100" cy="580" rx="24" ry="10" />
          <ellipse cx="1320" cy="680" rx="26" ry="10" />
        </g>
      </g>

      {/* Wiese davor */}
      <rect x="0" y="800" width="1600" height="200" fill="#8ca07a" />
      <rect x="0" y="800" width="1600" height="7" fill="#64784f" opacity="0.45" />
      <ellipse cx="380" cy="1000" rx="520" ry="90" fill="#82966f" opacity="0.6" />
      <ellipse cx="1300" cy="1010" rx="560" ry="100" fill="#82966f" opacity="0.5" />

      {/* Kiesweg zum Tor */}
      <path
        d="M700,1000 Q775,900 792,806 L858,806 Q868,902 950,1000 Z"
        fill="#e7ddc4"
        opacity="0.95"
      />
      <g fill="#d9cba9" opacity="0.8">
        <ellipse cx="800" cy="930" rx="7" ry="3" />
        <ellipse cx="838" cy="965" rx="6" ry="3" />
        <ellipse cx="782" cy="878" rx="6" ry="2.5" />
        <ellipse cx="852" cy="855" rx="5.5" ry="2.5" />
      </g>

      {/* Formschnitt-Kugeln auf Podesten, links und rechts des Tors */}
      <g>
        <Formschnitt x={320} />
        <Formschnitt x={1280} />
      </g>

      {/* Lavendel am Heckenfuß */}
      <g>
        <Lavendel x={520} />
        <Lavendel x={1090} />
        <Lavendel x={1180} />
      </g>
    </svg>
  );
}

/** Kugelförmig geschnittenes Bäumchen im Kübel. */
function Formschnitt({ x }: { x: number }) {
  return (
    <g>
      <ellipse cx={x} cy="880" rx="60" ry="8" fill="#171d24" opacity="0.12" />
      <path
        d={`M${x - 26},826 h52 l-7,50 h-38 Z`}
        fill="#e2d6ba"
        stroke="#c9b98f"
        strokeWidth="1.5"
      />
      <rect x={x - 4} y="790" width="8" height="40" fill="#5f4732" />
      <circle cx={x} cy="758" r="44" fill="#64784f" />
      <circle cx={x - 14} cy="744" r="26" fill="#8ca07a" opacity="0.75" />
    </g>
  );
}

/** Kleine Lavendel-Gruppe. */
function Lavendel({ x }: { x: number }) {
  return (
    <g>
      <g stroke="#64784f" strokeWidth="2" opacity="0.9" fill="none">
        <path d={`M${x - 8},832 l4,-24 M${x},832 l0,-28 M${x + 8},832 l-4,-24`} />
      </g>
      <g fill="#9797b8">
        <ellipse cx={x - 4} cy="804" rx="3.4" ry="8" />
        <ellipse cx={x} cy="798" rx="3.4" ry="9" />
        <ellipse cx={x + 4} cy="804" rx="3.4" ry="8" />
      </g>
    </g>
  );
}
