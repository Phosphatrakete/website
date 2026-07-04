/**
 * Seitlich angebaute Garage im Querschnitt: zwei angedeutete
 * Fahrzeugsilhouetten (ein Klassiker unter der Plane, ein flaches Coupé),
 * Werkzeugwand und Werkstattlampe.
 */
export function GarageFluegel({ p }: { p: string }) {
  return (
    <g id="raum-garage">
      <defs>
        <radialGradient id={`${p}-werkstattlicht`}>
          <stop offset="0%" stopColor="#e8d9b4" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#e8d9b4" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Schlagschatten */}
      <ellipse cx="1270" cy="856" rx="160" ry="10" fill="#171d24" opacity="0.1" />

      {/* Innenraum */}
      <path d="M1120,690 L1392,712 L1392,850 L1120,850 Z" fill="#28323e" />

      {/* Werkstattlampe */}
      <path d="M1256,694 V716" stroke="#171d24" strokeWidth="2.5" />
      <ellipse cx="1256" cy="756" rx="52" ry="42" fill={`url(#${p}-werkstattlicht)`} />
      <path d="M1244,716 h24 l-5,12 h-14 Z" fill="#d6bf8d" />

      {/* Werkzeugwand */}
      <g>
        <rect x="1130" y="716" width="54" height="62" rx="3" fill="#364350" />
        <g stroke="#d9cba9" strokeWidth="2.2" opacity="0.85" fill="none">
          <path d="M1140,724 v18" />
          <circle cx="1140" cy="746" r="3.4" />
          <path d="M1154,726 v20 M1150,726 h8" />
          <path d="M1168,724 l8,10 M1176,724 l-8,10" />
          <path d="M1166,748 h14 v6 h-14 Z" />
        </g>
      </g>

      {/* Regal mit Kanistern und Dosen */}
      <g>
        <rect x="1322" y="726" width="60" height="5" fill="#7a5c42" />
        <rect x="1328" y="710" width="12" height="16" rx="1.5" fill="#a85b4b" />
        <rect x="1346" y="714" width="10" height="12" rx="1.5" fill="#64784f" />
        <rect x="1362" y="712" width="11" height="14" rx="1.5" fill="#5c7085" />
      </g>

      {/* Klassiker unter der Staubplane (hinten) – die Plane zeichnet
          Motorhaube, Kabine und Radläufe nach; die Räder stehen sichtbar
          auf dem Garagenboden */}
      <g>
        <g>
          <circle cx="1168" cy="834" r="12" fill="#171d24" />
          <circle cx="1168" cy="834" r="4" fill="#9aa1a6" opacity="0.6" />
          <circle cx="1280" cy="834" r="12" fill="#171d24" />
          <circle cx="1280" cy="834" r="4" fill="#9aa1a6" opacity="0.6" />
        </g>
        <path
          d="M1134,842 L1134,826 C1134,810 1142,800 1154,796 C1160,794 1164,790 1168,784 C1174,774 1188,766 1204,764 C1226,762 1248,764 1258,772 C1266,778 1276,782 1286,786 C1300,792 1310,804 1312,818 L1314,842 L1300,842 C1298,830 1290,822 1280,822 C1270,822 1262,830 1260,842 L1188,842 C1186,830 1178,822 1168,822 C1158,822 1150,830 1148,842 Z"
          fill="#e9dfc8"
          opacity="0.45"
        />
        <path
          d="M1204,766 C1208,788 1208,816 1204,838 M1160,798 q12,8 26,4 M1240,800 q14,6 28,0"
          stroke="#f3ecdc"
          strokeWidth="1.6"
          fill="none"
          opacity="0.45"
        />
      </g>

      {/* Flaches Coupé (vorn) */}
      <g>
        <path
          d="M1176,836 C1178,814 1190,806 1210,804 L1236,786 C1252,774 1286,774 1304,784 L1330,800 C1354,802 1366,812 1368,826 L1368,836 Z"
          fill="#46586b"
        />
        <path
          d="M1244,788 L1262,788 L1262,802 L1230,802 Z"
          fill="#7d8fa3"
          opacity="0.75"
        />
        <path d="M1188,816 H1360" stroke="#c2a565" strokeWidth="2" opacity="0.8" />
        <circle cx="1222" cy="836" r="15" fill="#171d24" />
        <circle cx="1222" cy="836" r="5.5" fill="#9aa1a6" />
        <circle cx="1330" cy="836" r="15" fill="#171d24" />
        <circle cx="1330" cy="836" r="5.5" fill="#9aa1a6" />
      </g>

      {/* Boden */}
      <rect x="1120" y="842" width="272" height="8" fill="#8f979e" />

      {/* Aufgeschnittene Außenwand und Pultdach */}
      <rect x="1392" y="702" width="16" height="148" fill="#e2d6ba" />
      <rect x="1392" y="702" width="16" height="148" fill="none" stroke="#c9b98f" strokeWidth="1.5" />
      <path d="M1112,668 L1414,692 L1414,708 L1112,684 Z" fill="#47586a" />
      <path d="M1112,682 L1414,706" stroke="#394857" strokeWidth="3" />
    </g>
  );
}
