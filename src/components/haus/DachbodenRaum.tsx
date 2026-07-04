/**
 * Dachboden im Querschnitt – „hier wird noch renoviert“:
 * Kisten, abgedeckter Sessel, Leiter, Farbeimer und ein rundes
 * Ochsenauge-Fenster (Œil-de-bœuf) in der Rückwand.
 */
export function DachbodenRaum() {
  return (
    <g id="raum-dachboden">
      {/* Innenraum unter dem Dach */}
      <path d="M700,430 L740,312 L1000,312 L1040,430 Z" fill="#4a3726" />

      {/* Sparren */}
      <g stroke="#5f4732" strokeWidth="5" opacity="0.8">
        <path d="M712,430 L748,320" />
        <path d="M1028,430 L992,320" />
      </g>
      <path d="M740,318 H1000" stroke="#5f4732" strokeWidth="4" opacity="0.6" />

      {/* Rundes Fenster mit warmem Licht */}
      <g>
        <circle cx="870" cy="366" r="24" fill="#8a6f3c" />
        <circle cx="870" cy="366" r="19" fill="#e8d9b4" />
        <path d="M851,366 h38 M870,347 v38" stroke="#8a6f3c" strokeWidth="2.5" />
      </g>

      {/* Kistenstapel */}
      <g>
        <rect x="732" y="394" width="46" height="34" rx="1" fill="#7a5c42" />
        <path d="M732,404 h46" stroke="#5f4732" strokeWidth="1.6" />
        <rect x="740" y="366" width="34" height="28" rx="1" fill="#9c7a55" />
        <path d="M757,366 v28" stroke="#7a5c42" strokeWidth="1.6" />
      </g>

      {/* Abgedeckter Sessel (Staubtuch) */}
      <path
        d="M846,428 C842,404 850,388 862,384 C866,374 890,372 896,382 C910,384 918,400 914,428 Z"
        fill="#f3ecdc"
        opacity="0.92"
      />
      <path d="M858,398 q10,6 20,0" stroke="#d9cba9" strokeWidth="1.5" fill="none" />

      {/* Leiter – lehnt an der Deckenkante der Dachöffnung */}
      <g stroke="#9c7a55" strokeWidth="4.5" strokeLinecap="round">
        <path d="M940,428 L972,316" />
        <path d="M962,428 L994,316" />
      </g>
      <g stroke="#9c7a55" strokeWidth="3.5" strokeLinecap="round">
        <path d="M946,408 l22,0" />
        <path d="M953,384 l22,0" />
        <path d="M959,360 l22,0" />
        <path d="M966,336 l22,0" />
      </g>

      {/* Farbeimer und Pinsel – die Renovierung läuft */}
      <g>
        <path d="M806,410 h20 l-2,18 h-16 Z" fill="#5c7085" />
        <path d="M806,410 a10,4 0 0 1 20,0" fill="#7d8fa3" />
        <path d="M810,406 q6,-10 14,-4" stroke="#c9b98f" strokeWidth="2" fill="none" />
        {/* Latte lehnt an der rechten Dachschräge */}
        <rect x="1004" y="376" width="6" height="52" rx="2" fill="#d9cba9" transform="rotate(22 1007 402)" />
      </g>
    </g>
  );
}
