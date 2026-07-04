/**
 * Inhalte der Garage-Galerie („Die Leidenschaft“).
 *
 * Grundsatz „Geschichten statt Personen“: Titel und Begleittexte erzählen
 * von Projekten, Werkstattstunden und Ausfahrten – niemals von erkennbaren
 * Personen, konkreten Orten oder Kennzeichen.
 *
 * Neue Einträge entstehen über die Privatsphäre-Pipeline:
 *   1. Bilder in den Ordner `_eingang/` legen (wird nicht committet),
 *   2. `npm run bilder:import` ausführen – entfernt alle Metadaten
 *      (EXIF/GPS/IPTC/XMP), skaliert und speichert nach `public/galerie/`,
 *   3. den ausgegebenen Snippet-Block hier einfügen und Texte ergänzen.
 *
 * Die aktuellen Platzhalterbilder stammen aus `npm run bilder:platzhalter`
 * und werden vor dem Livegang durch echte Aufnahmen ersetzt.
 */

export interface GalerieEintrag {
  /** Eindeutige ID (entspricht i. d. R. dem Dateinamen ohne Endung). */
  id: string;
  /** Medientyp des Eintrags. */
  typ: "bild" | "video";
  /** Pfad unter `public/`, z. B. "/galerie/platzhalter-01.webp". */
  quelle: string;
  /** Vorschaubild – nur für Videos (Pfad unter `public/`). */
  poster?: string;
  /** Alternativtext: beschreibt das Sichtbare, ohne Personen zu nennen. */
  alt: string;
  /** Kurzer Titel, erscheint unter dem Bild und in der Großansicht. */
  titel: string;
  /** Optionaler Begleittext (1–2 Sätze) – Geschichten statt Personen. */
  geschichte?: string;
  /** Intrinsische Breite in Pixeln (für next/image, gegen Layout-Springen). */
  breite: number;
  /** Intrinsische Höhe in Pixeln. */
  hoehe: number;
}

export const galerieEintraege: readonly GalerieEintrag[] = [
  {
    id: "platzhalter-01",
    typ: "bild",
    quelle: "/galerie/platzhalter-01.webp",
    alt: "Abstrakte Illustration: dunkle Silhouette eines klassischen Coupés vor tiefstehender Abendsonne",
    titel: "Abendrunde",
    geschichte:
      "Wenn der Tag leiser wird, klingt der Motor am schönsten – die letzte Runde gehört immer dem Licht.",
    breite: 1600,
    hoehe: 1067,
  },
  {
    id: "platzhalter-02",
    typ: "bild",
    quelle: "/galerie/platzhalter-02.webp",
    alt: "Abstrakte Illustration einer Werkbank mit Lochwand, hängendem Werkzeug, Blechdose und Ölkanne",
    titel: "Werkbank-Stillleben",
    geschichte:
      "Jeder Schlüssel hat seinen Haken, jeder Griff seine Geschichte – Ordnung ist die halbe Reparatur.",
    breite: 1600,
    hoehe: 1200,
  },
  {
    id: "platzhalter-03",
    typ: "bild",
    quelle: "/galerie/platzhalter-03.webp",
    alt: "Abstrakte Illustration: Landstraße durch sanfte Hügel, in der Ferne ein kleines Auto",
    titel: "Landstraße",
    geschichte:
      "Kein Ziel, keine Eile – nur eine Straße, die sich durch die Hügel zieht, und ein voller Tank.",
    breite: 1600,
    hoehe: 900,
  },
  {
    id: "platzhalter-04",
    typ: "bild",
    quelle: "/galerie/platzhalter-04.webp",
    alt: "Abstrakte Illustration eines runden Armaturenbrett-Instruments mit Messingzeiger und Skalenstrichen",
    titel: "Blick aufs Rundinstrument",
    geschichte:
      "Zeiger, Skala, ein leises Ticken – manche Geschichten erzählt das Armaturenbrett ganz von selbst.",
    breite: 1600,
    hoehe: 1600,
  },
  {
    id: "platzhalter-05",
    typ: "bild",
    quelle: "/galerie/platzhalter-05.webp",
    alt: "Abstrakte Illustration einer Werkzeugwand im Hochformat: Ringschlüssel, Schraubendreher und Hammer an einer Holzleiste",
    titel: "Die Werkzeugwand",
    geschichte:
      "Vom Ringschlüssel bis zum Hammer: Gutes Werkzeug kauft man selten – meistens erbt man es.",
    breite: 1067,
    hoehe: 1600,
  },
  {
    id: "platzhalter-06",
    typ: "bild",
    quelle: "/galerie/platzhalter-06.webp",
    alt: "Abstrakte Illustration eines geschlossenen Garagentors mit Messinggriff und warmem Lichtspalt darunter",
    titel: "Vor dem Tor",
    geschichte:
      "Hinter diesem Tor riecht es nach Öl und Kaffee – hier beginnen die besten Samstage.",
    breite: 1600,
    hoehe: 900,
  },
  {
    id: "platzhalter-07",
    typ: "bild",
    quelle: "/galerie/platzhalter-07.webp",
    alt: "Abstrakte Illustration eines runden Scheinwerfers mit Messingring auf einem geschwungenen Kotflügel",
    titel: "Im Scheinwerferlicht",
    geschichte: "Chrom will gepflegt werden. Und wer poliert, hat Zeit zum Erzählen.",
    breite: 1600,
    hoehe: 1200,
  },

  /*
   * Beispiel für einen Video-Eintrag (auskommentiert, bis ein echtes Video
   * vorliegt – Videodateien werden nicht mit Platzhaltern committet):
   *
   * 1. Video (z. B. MP4/H.264, gut komprimiert) manuell prüfen: keine
   *    Kennzeichen, keine Gesichter oder Spiegelungen, kein Ton mit Namen
   *    oder Ortsangaben. Videos durchlaufen NICHT die Import-Pipeline –
   *    Metadaten daher vorab entfernen (z. B. beim Re-Encoding).
   * 2. Datei nach `public/galerie/` legen, Posterbild (erster schöner
   *    Frame) über `npm run bilder:import` erzeugen lassen.
   * 3. `breite`/`hoehe` sind die Pixelmaße des Videos – sie bestimmen das
   *    Seitenverhältnis der Kachel in der Galerie.
   *
   * {
   *   id: "erste-ausfahrt",
   *   typ: "video",
   *   quelle: "/galerie/erste-ausfahrt.mp4",
   *   poster: "/galerie/erste-ausfahrt-poster.webp",
   *   alt: "Video: ruhige Fahraufnahme auf einer Landstraße im Abendlicht",
   *   titel: "Die erste Ausfahrt",
   *   geschichte:
   *     "Nach einem langen Winter in der Werkstatt: der Moment, in dem alles läuft.",
   *   breite: 1920,
   *   hoehe: 1080,
   * },
   */
] as const;
