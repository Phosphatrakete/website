import { SzeneHintergrund } from "./SzeneHintergrund";
import { HausRumpf } from "./HausRumpf";
import { BibliothekRaum } from "./BibliothekRaum";
import { DachbodenRaum } from "./DachbodenRaum";
import { GarageFluegel } from "./GarageFluegel";
import { ApfelbaumGarten } from "./ApfelbaumGarten";
import { HAUS_VIEWBOX } from "@/config/rooms";

/**
 * Die komplette Haus-Szenerie als SVG-Gruppe.
 *
 * Die Zeichenreihenfolge ist bewusst gewählt: Hintergrund → Garten/Baum →
 * Garage → Innenräume → Hausrumpf (Fassade, Dach, Schnittkanten).
 * Neue Räume werden hier als eigene Komponente eingehängt und in
 * `src/config/rooms.ts` registriert.
 *
 * @param p Präfix für Gradient-IDs, damit mehrere Instanzen auf einer
 *          Seite keine kollidierenden `<defs>` erzeugen.
 */
export function HausSzenerie({ p }: { p: string }) {
  return (
    <g id={`${p}-haus-szenerie`}>
      <SzeneHintergrund p={p} />
      <ApfelbaumGarten />
      <GarageFluegel p={p} />
      <BibliothekRaum p={p} />
      <DachbodenRaum />
      <HausRumpf />
    </g>
  );
}

/**
 * Statisches Standbild der Szene – für die Tor-Kulisse und die mobilen
 * Raumkarten. Über `ausschnitt` lässt sich ein Bildausschnitt wählen.
 */
export function HausStandbild({
  p,
  ausschnitt,
  className,
  beschreibung,
}: {
  p: string;
  ausschnitt?: { x: number; y: number; b: number; h: number };
  className?: string;
  /** Ohne Beschreibung gilt das Bild als dekorativ (aria-hidden). */
  beschreibung?: string;
}) {
  const viewBox = ausschnitt
    ? `${ausschnitt.x} ${ausschnitt.y} ${ausschnitt.b} ${ausschnitt.h}`
    : `0 0 ${HAUS_VIEWBOX.breite} ${HAUS_VIEWBOX.hoehe}`;
  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role={beschreibung ? "img" : undefined}
      aria-label={beschreibung}
      aria-hidden={beschreibung ? undefined : true}
      focusable="false"
    >
      <HausSzenerie p={p} />
    </svg>
  );
}
