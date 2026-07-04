"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { TodoHinweis } from "@/components/ui/TodoHinweis";

/**
 * PLATZHALTER-STATIONEN DER FLUCHTROUTE.
 *
 * Die Koordinaten beziehen sich auf die ViewBox der stilisierten Karte
 * (0 0 420 320) – NICHT auf echte Geografie. Sobald die tatsächliche Route
 * der Familie bekannt ist, hier die echten Ortsnamen eintragen und die
 * Punkte passend auf der Karte verschieben; der Routenpfad wird automatisch
 * durch alle Stationen gelegt.
 */
export const FLUCHT_STATIONEN = [
  {
    id: "ausgangsort",
    name: "Ausgangsort",
    zusatz: "(Platzhalter)",
    x: 88,
    y: 226,
    /** Ausrichtung des Labels relativ zum Punkt. */
    labelLage: "unten" as const,
  },
  {
    id: "zwischenstation-1",
    name: "Zwischenstation",
    zusatz: "(Platzhalter)",
    x: 152,
    y: 138,
    labelLage: "links" as const,
  },
  {
    id: "zwischenstation-2",
    name: "Zwischenstation",
    zusatz: "(Platzhalter)",
    x: 226,
    y: 96,
    labelLage: "oben" as const,
  },
  {
    id: "ankunftsort",
    name: "Ankunftsort",
    zusatz: "(Platzhalter)",
    x: 326,
    y: 118,
    labelLage: "unten" as const,
  },
] as const;

type Station = (typeof FLUCHT_STATIONEN)[number];

/** Farbwerte der Design-Tokens für Inline-SVG. */
const FARBEN = {
  meer: "#7d8fa3", // schiefer-400 (stark aufgehellt via opacity)
  land: "#f3ecdc", // creme-200
  landDunkel: "#e9dfc8", // creme-300
  kontur: "#475767", // tinte-600
  route: "#a85b4b", // apfel-500
  label: "#364350", // tinte-700
  labelLeise: "#5d7082", // tinte-500
  punktRand: "#fdfbf5", // creme-50
} as const;

/**
 * Erzeugt aus den Stationen einen weichen Kurvenzug (Catmull-Rom → Bézier),
 * sodass die Route immer exakt durch alle Punkte läuft.
 */
function glatterPfad(punkte: readonly { x: number; y: number }[]): string {
  if (punkte.length < 2) return "";
  const r = (wert: number) => Math.round(wert * 10) / 10;
  let d = `M ${r(punkte[0].x)} ${r(punkte[0].y)}`;
  for (let i = 0; i < punkte.length - 1; i++) {
    const p0 = punkte[i - 1] ?? punkte[i];
    const p1 = punkte[i];
    const p2 = punkte[i + 1];
    const p3 = punkte[i + 2] ?? p2;
    const k1x = p1.x + (p2.x - p0.x) / 6;
    const k1y = p1.y + (p2.y - p0.y) / 6;
    const k2x = p2.x - (p3.x - p1.x) / 6;
    const k2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${r(k1x)} ${r(k1y)}, ${r(k2x)} ${r(k2y)}, ${r(p2.x)} ${r(p2.y)}`;
  }
  return d;
}

const ROUTEN_PFAD = glatterPfad(FLUCHT_STATIONEN);

/** Positioniert das zweizeilige Stationslabel relativ zum Punkt. */
function labelPosition(station: Station): {
  x: number;
  y: number;
  anker: "start" | "middle" | "end";
} {
  switch (station.labelLage) {
    case "oben":
      return { x: station.x, y: station.y - 24, anker: "middle" };
    case "unten":
      return { x: station.x, y: station.y + 16, anker: "middle" };
    case "links":
      return { x: station.x - 12, y: station.y - 2, anker: "end" };
  }
}

/**
 * Stilisierte, NICHT geografisch exakte Fluchtkarte Frankreich → Deutschland.
 *
 * Die gestrichelte Route (apfel-500) zeichnet sich mit dem Scroll-Fortschritt
 * der Kapitel: `fortschritt` ist der `scrollYProgress` des Kapitel-Containers;
 * daraus wird per `useTransform` die `pathLength` einer motion.path in einer
 * SVG-Maske gespeist, die die gestrichelte Route freilegt (so bleibt die
 * Strichelung beim Zeichnen erhalten). Bei reduzierter Bewegung ist die
 * Route von Anfang an vollständig sichtbar.
 */
export function FluchtKarte({
  fortschritt,
  idPraefix,
  className,
}: {
  /** Scroll-Fortschritt (0–1) des Kapitel-Containers. */
  fortschritt: MotionValue<number>;
  /** Präfix für SVG-IDs, falls die Karte mehrfach auf einer Seite steht. */
  idPraefix: string;
  className?: string;
}) {
  // Kleine Pufferzonen, damit die Route früh beginnt und sicher vollendet.
  const pfadLaenge = useTransform(fortschritt, [0.02, 0.92], [0, 1]);
  const maskenId = `${idPraefix}-routen-maske`;

  return (
    <figure className={className}>
      <div className="overflow-hidden rounded-2xl border border-creme-300/80 bg-creme-50 shadow-karte">
        <svg
          viewBox="0 0 420 320"
          role="img"
          aria-label={
            "Stilisierte Karte einer Fluchtroute von Frankreich nach " +
            "Deutschland mit vier Platzhalter-Stationen – keine geografisch " +
            "exakte Darstellung."
          }
          className="block w-full"
          focusable="false"
        >
          {/* Helles Schiefer-Meer als Grundfläche */}
          <rect width="420" height="320" fill={FARBEN.meer} opacity="0.16" />
          {/* Dezente Wellenandeutungen */}
          <g
            fill="none"
            stroke={FARBEN.meer}
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.4"
            aria-hidden="true"
          >
            <path d="M 30 66 q 9 -6 18 0 q 9 6 18 0" />
            <path d="M 52 92 q 9 -6 18 0 q 9 6 18 0" />
            <path d="M 348 262 q 9 -6 18 0 q 9 6 18 0" />
          </g>

          {/* Landmasse „Frankreich“ (stilisiert) */}
          <path
            d={
              "M 94 106 C 124 92 162 96 182 118 C 200 138 206 170 198 198 " +
              "C 190 226 170 250 140 258 C 112 266 80 258 60 236 " +
              "C 46 220 40 194 46 172 C 49 158 58 148 60 136 " +
              "C 64 120 78 113 94 106 Z"
            }
            fill={FARBEN.land}
            stroke={FARBEN.kontur}
            strokeWidth="1.3"
            strokeOpacity="0.55"
            strokeLinejoin="round"
          />
          {/* Landmasse „Deutschland“ (stilisiert) */}
          <path
            d={
              "M 256 48 C 278 32 312 26 342 36 C 368 44 388 64 394 92 " +
              "C 398 112 390 130 392 150 C 394 172 384 192 366 202 " +
              "C 346 214 320 216 298 210 C 274 204 254 190 244 166 " +
              "C 236 146 237 120 240 98 C 242 78 246 60 256 48 Z"
            }
            fill={FARBEN.landDunkel}
            stroke={FARBEN.kontur}
            strokeWidth="1.3"
            strokeOpacity="0.55"
            strokeLinejoin="round"
          />
          {/* Angedeuteter Grenzfluss zwischen beiden Ländern */}
          <path
            d="M 216 24 C 226 70 214 122 224 170 C 232 210 226 260 214 296"
            fill="none"
            stroke={FARBEN.meer}
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.35"
            aria-hidden="true"
          />

          {/* Länderbeschriftungen (auf dem „Meer“, wie auf alten Karten) */}
          <text
            x="110"
            y="296"
            textAnchor="middle"
            className="font-display"
            fontSize="17"
            fontStyle="italic"
            letterSpacing="0.08em"
            fill={FARBEN.labelLeise}
          >
            Frankreich
          </text>
          <text
            x="330"
            y="244"
            textAnchor="middle"
            className="font-display"
            fontSize="17"
            fontStyle="italic"
            letterSpacing="0.08em"
            fill={FARBEN.labelLeise}
          >
            Deutschland
          </text>

          {/*
            Fluchtroute: Die gestrichelte Linie liegt vollständig im SVG;
            eine Maske mit animierter pathLength legt sie beim Scrollen frei.
            Bei reduzierter Bewegung zeigt CSS (motion-reduce) stattdessen
            die statische Route – bewusst ohne JS-Verzweigung, damit Server-
            und Client-Markup identisch bleiben (kein Hydration-Mismatch).
          */}
          <mask id={maskenId} maskUnits="userSpaceOnUse">
            <motion.path
              d={ROUTEN_PFAD}
              fill="none"
              stroke="#ffffff"
              strokeWidth="8"
              strokeLinecap="round"
              style={{ pathLength: pfadLaenge }}
            />
          </mask>
          <path
            d={ROUTEN_PFAD}
            fill="none"
            stroke={FARBEN.route}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeDasharray="1.5 7"
            mask={`url(#${maskenId})`}
            className="motion-reduce:hidden"
          />
          <path
            d={ROUTEN_PFAD}
            fill="none"
            stroke={FARBEN.route}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeDasharray="1.5 7"
            className="hidden motion-reduce:block"
          />

          {/* Stationen mit Labels */}
          {FLUCHT_STATIONEN.map((station) => {
            const label = labelPosition(station);
            const endpunkt =
              station.id === "ausgangsort" || station.id === "ankunftsort";
            return (
              <g key={station.id}>
                <circle
                  cx={station.x}
                  cy={station.y}
                  r={endpunkt ? 5 : 4}
                  fill={FARBEN.route}
                  stroke={FARBEN.punktRand}
                  strokeWidth="1.6"
                />
                <text
                  x={label.x}
                  y={label.y}
                  textAnchor={label.anker}
                  fontSize="10"
                  fontWeight="600"
                  fill={FARBEN.label}
                >
                  {station.name}
                  <tspan
                    x={label.x}
                    dy={11}
                    fontWeight="400"
                    fill={FARBEN.labelLeise}
                  >
                    {station.zusatz}
                  </tspan>
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="mt-3 space-y-2">
        <p className="text-xs leading-relaxed text-tinte-600">
          Stilisierte Darstellung – keine geografisch exakte Karte. Die Route
          zeichnet sich beim Lesen der Kapitel nach.
        </p>
        <TodoHinweis>TODO: echte Route eintragen</TodoHinweis>
      </figcaption>
    </figure>
  );
}
