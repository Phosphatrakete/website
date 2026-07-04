/**
 * Der Apfelbaum im Garten – Zugang zum geschützten Stammbaum.
 * Ausgewachsener Baum mit Äpfeln, Schaukel und dezentem Schloss-Symbol
 * am Stamm.
 */

const APFEL_POSITIONEN: ReadonlyArray<readonly [number, number]> = [
  [300, 470],
  [352, 522],
  [412, 556],
  [452, 468],
  [390, 412],
  [338, 530],
  [442, 532],
  [286, 518],
  [362, 458],
  [472, 502],
  [418, 478],
];

export function ApfelbaumGarten() {
  return (
    <g id="raum-stammbaum">
      {/* Baumschatten */}
      <ellipse cx="386" cy="856" rx="175" ry="13" fill="#171d24" opacity="0.12" />

      {/* Stamm und Äste */}
      <g stroke="#5f4732" strokeWidth="12" strokeLinecap="round" fill="none">
        <path d="M372,614 C344,582 322,564 302,550" />
        <path d="M396,612 C428,578 450,562 470,548" />
      </g>
      <path
        d="M356,852 C362,780 352,720 366,660 C371,637 373,618 371,598 L399,598 C398,630 403,662 407,702 C413,762 408,810 413,852 Z"
        fill="#5f4732"
      />
      <path d="M369,700 q8,10 0,22" stroke="#4a3726" strokeWidth="2" fill="none" opacity="0.6" />

      {/* Krone */}
      <circle cx="368" cy="478" r="148" fill="#64784f" />
      <circle cx="412" cy="512" r="108" fill="#4c5d3c" opacity="0.5" />
      <circle cx="318" cy="430" r="92" fill="#8ca07a" opacity="0.9" />
      <circle cx="432" cy="420" r="70" fill="#8ca07a" opacity="0.65" />

      {/* Äpfel */}
      <g>
        {APFEL_POSITIONEN.map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="7.5" fill="#a85b4b" />
            <circle cx={x - 2.4} cy={y - 2.4} r="2" fill="#f3ecdc" opacity="0.45" />
          </g>
        ))}
      </g>

      {/* Fallobst */}
      <circle cx="298" cy="860" r="6" fill="#a85b4b" />
      <circle cx="478" cy="856" r="5.5" fill="#a85b4b" opacity="0.9" />

      {/* Schaukel – hängt an einem sichtbaren Aststück in der Krone */}
      <g>
        <path
          d="M276,562 Q304,550 332,558"
          stroke="#5f4732"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M290,558 V756 M318,556 V756" stroke="#9c7a55" strokeWidth="2.5" />
        <rect x="282" y="756" width="44" height="6" rx="2" fill="#7a5c42" />
      </g>

      {/* Dezentes Schloss-Symbol am Stamm */}
      <g id="stammbaum-schloss">
        <circle cx="384" cy="742" r="21" fill="#fdfbf5" stroke="#a98a4e" strokeWidth="1.8" />
        <path
          d="M377,740 v-7 a7,7 0 0 1 14,0 v7"
          fill="none"
          stroke="#8a6f3c"
          strokeWidth="2.6"
        />
        <rect x="374" y="740" width="20" height="15" rx="3" fill="#a98a4e" />
        <circle cx="384" cy="746" r="2.2" fill="#fdfbf5" />
      </g>
    </g>
  );
}
