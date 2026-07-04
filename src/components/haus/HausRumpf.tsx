/**
 * Rumpf des Haupthauses: Mansarddach (mit Öffnung für den Dachboden-
 * Querschnitt), Obergeschoss-Fassade mit hohen Sprossenfenstern und
 * Fensterläden, Geschossdecken und Schnittkanten des Erdgeschosses.
 *
 * Das Erdgeschoss selbst ist aufgeschnitten – sein Innenraum wird von
 * `BibliothekRaum` gezeichnet, der Dachboden von `DachbodenRaum`.
 */

const SCHNITTKANTE = "#e2d6ba";
const SCHNITTLINIE = "#c9b98f";

export function HausRumpf() {
  return (
    <g id="haus-rumpf">
      {/* Schlagschatten des Hauses */}
      <ellipse cx="880" cy="858" rx="310" ry="14" fill="#171d24" opacity="0.12" />

      {/* Obergeschoss-Fassade */}
      <rect x="620" y="430" width="500" height="178" fill="#f6efdc" />
      <rect x="620" y="598" width="500" height="10" fill="#e9dfc8" />
      {/* Ecklisenen */}
      <g fill="#eee4cb">
        <rect x="620" y="430" width="16" height="178" />
        <rect x="1104" y="430" width="16" height="178" />
      </g>

      {/* Hohe Sprossenfenster mit Fensterläden und Balkongittern */}
      {[720, 870, 1020].map((mitteX) => (
        <Sprossenfenster key={mitteX} mitteX={mitteX} />
      ))}

      {/* Gesims unter der Traufe */}
      <rect x="608" y="420" width="524" height="12" fill="#e9dfc8" />
      <rect x="608" y="430" width="524" height="3" fill="#c9b98f" opacity="0.6" />

      {/* Kamin */}
      <g>
        <rect x="1008" y="196" width="42" height="76" fill="#a8695a" />
        <rect x="1008" y="196" width="42" height="76" fill="none" stroke="#8f574a" strokeWidth="1.5" opacity="0.5" />
        <path d="M1008,214 h42 M1008,232 h42 M1008,250 h42" stroke="#8f574a" strokeWidth="1.5" opacity="0.35" />
        <rect x="1000" y="186" width="58" height="12" rx="2" fill="#394857" />
      </g>

      {/* Mansarddach – seitliche Flächen + oberes Band, Mitte offen */}
      <path d="M596,430 L668,302 L740,312 L700,430 Z" fill="#47586a" />
      <path d="M1144,430 L1072,302 L1000,312 L1040,430 Z" fill="#47586a" />
      <path d="M668,302 L744,258 L996,258 L1072,302 L1000,312 L740,312 Z" fill="#5c7085" />
      {/* Dachnähte */}
      <path d="M632,366 L666,372" stroke="#394857" strokeWidth="2" opacity="0.35" />
      <path d="M1108,366 L1074,372" stroke="#394857" strokeWidth="2" opacity="0.35" />
      {/* First mit Messingzier */}
      <path d="M744,256 H996" stroke="#c2a565" strokeWidth="3" strokeLinecap="round" />
      <circle cx="744" cy="256" r="5" fill="#c2a565" />
      <circle cx="996" cy="256" r="5" fill="#c2a565" />

      {/* Schnittkanten der Dachöffnung */}
      <g stroke={SCHNITTLINIE} strokeWidth="3" fill="none">
        <path d="M700,430 L740,312 L1000,312 L1040,430" />
      </g>

      {/* Traufkasten */}
      <rect x="596" y="424" width="548" height="8" fill="#394857" />

      {/* Geschossdecke zwischen EG und OG */}
      <rect x="614" y="606" width="512" height="16" fill={SCHNITTKANTE} />
      <rect x="614" y="606" width="512" height="16" fill="none" stroke={SCHNITTLINIE} strokeWidth="1.5" />

      {/* Dachbodendecke (Boden des Dachbodens) */}
      <rect x="688" y="424" width="364" height="10" fill={SCHNITTKANTE} />

      {/* Aufgeschnittene Außenwände des Erdgeschosses */}
      <rect x="620" y="620" width="18" height="230" fill={SCHNITTKANTE} />
      <rect x="620" y="620" width="18" height="230" fill="none" stroke={SCHNITTLINIE} strokeWidth="1.5" />
      <rect x="1102" y="620" width="18" height="230" fill={SCHNITTKANTE} />
      <rect x="1102" y="620" width="18" height="230" fill="none" stroke={SCHNITTLINIE} strokeWidth="1.5" />
    </g>
  );
}

/** Hohes französisches Sprossenfenster mit Läden und Balkongitter. */
function Sprossenfenster({ mitteX }: { mitteX: number }) {
  const x = mitteX - 32;
  return (
    <g>
      {/* Fensterläden */}
      <g fill="#64784f">
        <rect x={x - 28} y="456" width="24" height="138" rx="2" />
        <rect x={x + 68} y="456" width="24" height="138" rx="2" />
      </g>
      <g stroke="#4c5d3c" strokeWidth="1.5" opacity="0.7">
        {[468, 482, 496, 510, 524, 538, 552, 566, 580].map((y) => (
          <g key={y}>
            <path d={`M${x - 24},${y} h16`} />
            <path d={`M${x + 72},${y} h16`} />
          </g>
        ))}
      </g>

      {/* Rahmen und Glas */}
      <rect x={x} y="458" width="64" height="136" rx="3" fill="#fdfbf5" />
      <rect x={x + 5} y="463" width="54" height="126" fill="#7d8fa3" opacity="0.6" />
      {/* Lichtreflex */}
      <path
        d={`M${x + 9},${589} L${x + 34},${467} L${x + 46},${467} L${x + 21},${589} Z`}
        fill="#fdfbf5"
        opacity="0.35"
      />
      {/* Sprossen: 2 Spalten × 3 Reihen */}
      <g stroke="#fdfbf5" strokeWidth="3">
        <path d={`M${x + 32},463 V589`} />
        <path d={`M${x + 5},505 H${x + 59}`} />
        <path d={`M${x + 5},547 H${x + 59}`} />
      </g>

      {/* Schmiedeeisernes Balkongitter */}
      <g stroke="#28323e" strokeWidth="2.5" fill="none">
        <path d={`M${x - 4},594 H${x + 68}`} strokeWidth="3.5" />
        {[6, 18, 30, 42, 54].map((abstand) => (
          <path key={abstand} d={`M${x + abstand},594 V608`} />
        ))}
        <path d={`M${x - 4},608 H${x + 68}`} />
      </g>
    </g>
  );
}
