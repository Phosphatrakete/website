/**
 * Erdgeschoss im Querschnitt: die Bibliothek.
 * Bücherregal, Lesesessel mit Messing-Stehlampe, alte Karte an der Wand.
 */

const BUCH_FARBEN = [
  "#5c7085",
  "#64784f",
  "#a98a4e",
  "#a85b4b",
  "#364350",
  "#a8695a",
  "#47586a",
  "#8a6f3c",
];

export function BibliothekRaum({ p }: { p: string }) {
  return (
    <g id="raum-bibliothek">
      <defs>
        <radialGradient id={`${p}-lampenschein`}>
          <stop offset="0%" stopColor="#e8d9b4" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#e8d9b4" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Rückwand und Boden */}
      <rect x="638" y="620" width="464" height="230" fill="#f3ead2" />
      <rect x="638" y="818" width="464" height="8" fill="#decfa9" />
      <rect x="638" y="826" width="464" height="24" fill="#9c7a55" />
      <g stroke="#82603f" strokeWidth="1.5" opacity="0.6">
        {[696, 754, 812, 870, 928, 986, 1044].map((x) => (
          <path key={x} d={`M${x},826 V850`} />
        ))}
      </g>

      {/* Teppich */}
      <ellipse cx="900" cy="840" rx="150" ry="9" fill="#a8695a" opacity="0.9" />
      <ellipse cx="900" cy="840" rx="120" ry="6.5" fill="none" stroke="#f3ead2" strokeWidth="1.5" opacity="0.7" />

      {/* Bücherregal */}
      <g>
        <rect x="656" y="636" width="174" height="192" fill="#5f4732" />
        {[
          { y: 648, hoehe: 36 },
          { y: 694, hoehe: 36 },
          { y: 740, hoehe: 36 },
          { y: 786, hoehe: 34 },
        ].map((regal, reihe) => (
          <g key={regal.y}>
            <rect x="664" y={regal.y} width="158" height={regal.hoehe} fill="#4a3726" />
            <Buchreihe
              x={668}
              boden={regal.y + regal.hoehe}
              reihe={reihe}
            />
            <rect x="660" y={regal.y + regal.hoehe} width="166" height="5" fill="#7a5c42" />
          </g>
        ))}
        {/* Globus auf dem Regal */}
        <g>
          <path d="M700,634 h20 l-4,-6 h-12 Z" fill="#7a5c42" />
          <circle cx="710" cy="618" r="11" fill="#7d8fa3" />
          <path d="M703,610 q9,6 3,16 M713,608 q6,10 -1,20" stroke="#f3ead2" strokeWidth="1.2" fill="none" opacity="0.8" />
        </g>
      </g>

      {/* Alte Karte an der Wand */}
      <g>
        <rect x="854" y="646" width="114" height="88" rx="2" fill="#a98a4e" />
        <rect x="861" y="653" width="100" height="74" fill="#efe3c0" />
        <path
          d="M868,700 C880,686 886,704 898,694 C908,686 912,672 924,676 C934,680 940,668 950,672"
          fill="none"
          stroke="#5c7085"
          strokeWidth="1.6"
        />
        <path
          d="M872,714 C892,706 912,692 946,668"
          fill="none"
          stroke="#a85b4b"
          strokeWidth="1.6"
          strokeDasharray="3 4"
        />
        <circle cx="872" cy="714" r="2.6" fill="#a85b4b" />
        <circle cx="946" cy="668" r="2.6" fill="#a85b4b" />
        <path d="M948,712 l3,6 -7,-1 6,-4 -1,7" stroke="#8a6f3c" strokeWidth="1" fill="none" />
      </g>

      {/* Lesesessel mit Beistelltisch und Stehlampe */}
      <g>
        {/* Lampenschein zuerst, damit er hinter den Möbeln liegt */}
        <ellipse cx="1052" cy="716" rx="44" ry="40" fill={`url(#${p}-lampenschein)`} />

        {/* Beistelltisch mit Bücherstapel */}
        <rect x="872" y="774" width="46" height="6" rx="2" fill="#5f4732" />
        <rect x="891" y="780" width="8" height="48" fill="#5f4732" />
        <rect x="878" y="766" width="30" height="8" rx="1.5" fill="#a85b4b" />
        <rect x="882" y="758" width="26" height="8" rx="1.5" fill="#5c7085" />

        {/* Sessel */}
        <rect x="996" y="690" width="26" height="112" rx="13" fill="#4c5d3c" />
        <rect x="938" y="756" width="80" height="26" rx="10" fill="#64784f" />
        <rect x="928" y="730" width="20" height="56" rx="9" fill="#4c5d3c" />
        <rect x="942" y="782" width="8" height="46" fill="#5f4732" />
        <rect x="1004" y="782" width="8" height="46" fill="#5f4732" />

        {/* Stehlampe */}
        <rect x="1050" y="700" width="4" height="126" fill="#28323e" />
        <ellipse cx="1052" cy="826" rx="14" ry="4" fill="#28323e" />
        <path d="M1036,678 h32 l-6,24 h-20 Z" fill="#d6bf8d" />
      </g>
    </g>
  );
}

/** Eine Reihe unterschiedlicher Buchrücken, deterministisch „zufällig“. */
function Buchreihe({
  x,
  boden,
  reihe,
}: {
  x: number;
  boden: number;
  reihe: number;
}) {
  const buecher: React.ReactNode[] = [];
  let cursorX = x;
  let index = 0;
  while (cursorX < x + 140) {
    const breite = 8 + ((index * 7 + reihe * 5) % 8);
    const hoehe = 22 + ((index * 11 + reihe * 3) % 10);
    const farbe = BUCH_FARBEN[(index + reihe * 3) % BUCH_FARBEN.length];
    const geneigt = (index + reihe) % 9 === 7;
    buecher.push(
      <rect
        key={index}
        x={cursorX}
        y={boden - hoehe}
        width={breite}
        height={hoehe}
        rx="1"
        fill={farbe}
        transform={
          geneigt ? `rotate(-8 ${cursorX + breite / 2} ${boden})` : undefined
        }
      />,
    );
    cursorX += breite + 2;
    index += 1;
  }
  return <g>{buecher}</g>;
}
