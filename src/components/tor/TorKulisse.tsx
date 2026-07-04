/**
 * Kulisse der Tor-Szene: Links und rechts fassen hohe, formal geschnittene
 * Hecken das Tor ein; durch das Tor blickt man eine Baumallee mit Kiesweg
 * entlang – ganz hinten, dunstig-verschwommen, steht das Haus. Erst beim
 * Öffnen des Tors tritt die Kamera die Allee entlang aufs Haus zu.
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
        {/* Dunst über der Ferne – lässt Allee und Haus verschwimmen */}
        <linearGradient id={`${p}-dunst`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f2ecd9" stopOpacity="0.85" />
          <stop offset="55%" stopColor="#f2ecd9" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#f2ecd9" stopOpacity="0" />
        </linearGradient>
        <filter id={`${p}-unschaerfe`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>

      {/* Himmel mit warmem Lichtschein */}
      <rect x="0" y="0" width="1600" height="620" fill={`url(#${p}-himmel)`} />
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

      {/* Rasen – zieht sich bis zum Dunst-Horizont hinter dem Tor */}
      <rect x="0" y="520" width="1600" height="480" fill="#8ca07a" />
      <rect x="0" y="516" width="1600" height="8" fill="#a9ba97" opacity="0.7" />
      <ellipse cx="380" cy="1000" rx="520" ry="90" fill="#82966f" opacity="0.6" />
      <ellipse cx="1300" cy="1010" rx="560" ry="100" fill="#82966f" opacity="0.5" />

      {/* Der Blick durch das Tor: Haus in der Ferne, Allee, Kiesweg */}
      <g>
        {/* Das Haus – klein und verschwommen am Ende der Allee */}
        <g filter={`url(#${p}-unschaerfe)`} opacity="0.9">
          <FernesHaus />
        </g>

        {/* Kiesweg: vom Tor schnurgerade auf das Haus zu */}
        <path
          d="M640,1000 L780,560 L820,560 L960,1000 Z"
          fill="#e7ddc4"
          opacity="0.95"
        />
        <path
          d="M783,560 L800,516 L817,560 Z"
          fill="#e7ddc4"
          opacity="0.8"
        />
        <g fill="#d9cba9" opacity="0.8">
          <ellipse cx="800" cy="930" rx="7" ry="3" />
          <ellipse cx="838" cy="860" rx="6" ry="3" />
          <ellipse cx="772" cy="790" rx="6" ry="2.5" />
          <ellipse cx="818" cy="700" rx="5" ry="2" />
          <ellipse cx="790" cy="640" rx="4" ry="1.8" />
        </g>

        {/* Baumallee – je näher, desto größer; alle Bäume stehen HINTER
            der Torebene (Torsockel liegt bei etwa y=800) */}
        <AlleeBaum x={758} y={556} groesse={0.32} hell />
        <AlleeBaum x={842} y={556} groesse={0.32} hell />
        <AlleeBaum x={732} y={584} groesse={0.45} hell />
        <AlleeBaum x={868} y={584} groesse={0.45} hell />
        <AlleeBaum x={694} y={632} groesse={0.62} />
        <AlleeBaum x={906} y={632} groesse={0.62} />
        <AlleeBaum x={636} y={700} groesse={0.82} />
        <AlleeBaum x={964} y={700} groesse={0.82} />
        <AlleeBaum x={556} y={786} groesse={1.05} />
        <AlleeBaum x={1044} y={786} groesse={1.05} />

        {/* Dunstschleier über der Ferne */}
        <rect x="430" y="420" width="740" height="240" fill={`url(#${p}-dunst)`} />

        {/* Schattenband am Boden der Toröffnung – erdet Tor und Pfeiler */}
        <ellipse cx="800" cy="806" rx="330" ry="10" fill="#171d24" opacity="0.1" />
      </g>

      {/* Hecken links und rechts – enden an den Torpfeilern */}
      <Hecke seite="links" />
      <Hecke seite="rechts" />

      {/* Formschnitt-Kugeln auf Podesten vor den Hecken */}
      <Formschnitt x={300} />
      <Formschnitt x={1300} />

      {/* Lavendel am Heckenfuß */}
      <Lavendel x={180} />
      <Lavendel x={468} />
      <Lavendel x={1130} />
      <Lavendel x={1420} />
    </svg>
  );
}

/**
 * Das Haus am Ende der Allee – bewusst vereinfachte, ferne Silhouette
 * (die Details gibt es erst nach dem Eintreten).
 */
function FernesHaus() {
  return (
    <g>
      {/* Fassade */}
      <rect x="726" y="446" width="148" height="76" fill="#f6efdc" />
      {/* Mansarddach */}
      <path d="M718,446 L744,408 L856,408 L882,446 Z" fill="#47586a" />
      <path d="M744,408 L762,394 L838,394 L856,408 Z" fill="#5c7085" />
      {/* Kamin bewusst entsättigt, damit er in der Tiefenunschärfe bleibt */}
      <rect x="828" y="376" width="12" height="24" fill="#a88b80" opacity="0.85" />
      {/* Fenster als warme Lichter */}
      <g fill="#e8d9b4">
        <rect x="742" y="460" width="14" height="24" rx="1.5" />
        <rect x="770" y="460" width="14" height="24" rx="1.5" />
        <rect x="816" y="460" width="14" height="24" rx="1.5" />
        <rect x="844" y="460" width="14" height="24" rx="1.5" />
      </g>
      {/* Tür */}
      <rect x="793" y="478" width="16" height="44" rx="2" fill="#4a3726" />
      {/* Hausbaum als Andeutung */}
      <circle cx="682" cy="470" r="34" fill="#64784f" />
      <rect x="678" y="490" width="8" height="32" fill="#5f4732" />
    </g>
  );
}

/** Ein Alleebaum – schlanker Stamm, runde Krone; ferne Bäume heller. */
function AlleeBaum({
  x,
  y,
  groesse,
  hell = false,
}: {
  x: number;
  y: number;
  groesse: number;
  hell?: boolean;
}) {
  const stammHoehe = 90 * groesse;
  const kronenRadius = 52 * groesse;
  return (
    <g>
      <ellipse
        cx={x}
        cy={y + 4}
        rx={kronenRadius * 1.1}
        ry={7 * groesse}
        fill="#171d24"
        opacity="0.08"
      />
      <rect
        x={x - 4 * groesse}
        y={y - stammHoehe}
        width={8 * groesse}
        height={stammHoehe}
        fill={hell ? "#8d7256" : "#5f4732"}
      />
      <circle
        cx={x}
        cy={y - stammHoehe - kronenRadius * 0.72}
        r={kronenRadius}
        fill={hell ? "#a9ba97" : "#64784f"}
      />
      <circle
        cx={x - kronenRadius * 0.34}
        cy={y - stammHoehe - kronenRadius * 0.92}
        r={kronenRadius * 0.55}
        fill={hell ? "#cdd8bd" : "#8ca07a"}
        opacity="0.85"
      />
    </g>
  );
}

/**
 * Hohe Formschnitt-Hecke. Sie endet in einem eigenen Steinpfeiler –
 * so hat die Heckenlinie unabhängig vom (responsiv positionierten)
 * HTML-Tor immer einen sauberen Abschluss.
 */
function Hecke({ seite }: { seite: "links" | "rechts" }) {
  const spiegel = seite === "rechts" ? "translate(1600 0) scale(-1 1)" : undefined;
  return (
    <g transform={spiegel}>
      <rect x="-20" y="470" width="500" height="340" fill="#4c5d3c" />
      {/* Lichtkante oben */}
      <rect x="-20" y="470" width="500" height="12" fill="#8ca07a" opacity="0.8" />
      {/* Formschnitt-Absätze */}
      <rect x="-20" y="574" width="500" height="10" fill="#3b4a2f" opacity="0.5" />
      <rect x="-20" y="682" width="500" height="10" fill="#3b4a2f" opacity="0.5" />
      {/* Blattstruktur */}
      <g fill="#64784f" opacity="0.5">
        <ellipse cx="120" cy="524" rx="26" ry="12" />
        <ellipse cx="330" cy="610" rx="30" ry="13" />
        <ellipse cx="440" cy="536" rx="24" ry="11" />
        <ellipse cx="200" cy="726" rx="30" ry="12" />
        <ellipse cx="410" cy="742" rx="26" ry="11" />
      </g>
      <g fill="#3b4a2f" opacity="0.4">
        <ellipse cx="240" cy="562" rx="24" ry="10" />
        <ellipse cx="90" cy="660" rx="28" ry="11" />
        <ellipse cx="380" cy="676" rx="24" ry="10" />
      </g>
      {/* Steinpfeiler als Heckenabschluss */}
      <g>
        <rect x="472" y="452" width="46" height="358" fill="#e9dfc8" />
        <rect x="466" y="440" width="58" height="14" rx="2" fill="#e2d6ba" />
        <circle cx="495" cy="428" r="13" fill="#d9cba9" />
        <g stroke="#d9cba9" strokeWidth="2">
          <path d="M472,520 h46 M472,590 h46 M472,660 h46 M472,730 h46" />
          <path d="M495,454 v66 M483,520 v70 M507,590 v70 M483,660 v70 M495,730 v80" opacity="0.6" />
        </g>
        {/* Schattenseite zum Tor hin */}
        <rect x="510" y="452" width="8" height="358" fill="#c9b98f" opacity="0.5" />
      </g>
    </g>
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
