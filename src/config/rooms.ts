/**
 * Zentrale Raum-Registry.
 *
 * Jeder „Raum“ des Hauses (klickbarer Bereich der Illustration) wird hier
 * registriert. Ein neuer Raum benötigt:
 *   1. einen Eintrag in dieser Datei,
 *   2. eine SVG-Gruppe in der Haus-Illustration (`components/haus/`),
 *   3. eine Route unter `src/app/<slug>/page.tsx`.
 *
 * Die `ausschnitt`-Koordinaten beziehen sich auf die ViewBox der
 * Haus-Illustration (0 0 1600 1000) und steuern sowohl die Zoom-Animation
 * beim Betreten als auch die Bild-Ausschnitte der mobilen Raumkarten.
 */

/** ViewBox der Haus-Illustration – Referenz für alle Ausschnitte. */
export const HAUS_VIEWBOX = { breite: 1600, hoehe: 1000 } as const;

export type RaumStatus = "offen" | "geschuetzt" | "renovierung";

export interface Raum {
  /** Eindeutige ID, entspricht der SVG-Gruppen-ID. */
  id: string;
  /** URL-Pfad des Raums, z. B. "/bibliothek". */
  slug: string;
  /** Anzeigename im Label und auf Karten. */
  name: string;
  /** Abweichender, kürzerer Name für die Navigationsleiste (optional). */
  navName?: string;
  /** Kurze Unterzeile für Hover-Label und mobile Karten. */
  untertitel: string;
  /** Beschreibung für Metadaten und Kartentexte. */
  beschreibung: string;
  /** Ausführliches ARIA-Label für den klickbaren SVG-Bereich. */
  ariaLabel: string;
  /** Zugänglichkeit des Raums. */
  status: RaumStatus;
  /** Bild-Ausschnitt in ViewBox-Koordinaten (Zoomziel + mobile Karte). */
  ausschnitt: { x: number; y: number; b: number; h: number };
  /** In der Fallback-Navigation anzeigen? */
  inNavigation: boolean;
}

export const raeume: readonly Raum[] = [
  {
    id: "bibliothek",
    slug: "/bibliothek",
    name: "Bibliothek",
    untertitel: "Die Geschichte eines Namens",
    beschreibung:
      "Eine Zeitreise von Frankreich nach Deutschland – die Geschichte der Hugenotten und der Familie.",
    ariaLabel:
      "Bibliothek betreten – die Geschichte des Namens und der Hugenotten",
    status: "offen",
    ausschnitt: { x: 600, y: 590, b: 520, h: 280 },
    inNavigation: true,
  },
  {
    id: "garage",
    slug: "/garage",
    name: "Garage",
    untertitel: "Die Leidenschaft",
    beschreibung:
      "Automobile Projekte und Geschichten – eine Galerie aus Werkstatt und Landstraße.",
    ariaLabel: "Garage betreten – Autos, Projekte und Geschichten",
    status: "offen",
    ausschnitt: { x: 1100, y: 620, b: 340, h: 260 },
    inNavigation: true,
  },
  {
    id: "stammbaum",
    slug: "/stammbaum",
    name: "Der Apfelbaum",
    navName: "Stammbaum",
    untertitel: "Der Stammbaum",
    beschreibung:
      "Der Stammbaum der Familie – geschützt, nur mit dem Familienpasswort zugänglich.",
    ariaLabel:
      "Apfelbaum im Garten – zum passwortgeschützten Stammbaum der Familie",
    status: "geschuetzt",
    ausschnitt: { x: 170, y: 340, b: 420, h: 530 },
    inNavigation: true,
  },
  {
    id: "dachboden",
    slug: "/dachboden",
    name: "Dachboden",
    untertitel: "Hier wird noch renoviert",
    beschreibung:
      "Unter dem Dach wird noch gehämmert und gestrichen – dieser Raum öffnet später.",
    ariaLabel: "Dachboden – hier wird noch renoviert",
    status: "renovierung",
    ausschnitt: { x: 640, y: 260, b: 440, h: 200 },
    inNavigation: true,
  },
] as const;

export function raumZuSlug(slug: string): Raum | undefined {
  return raeume.find((raum) => raum.slug === slug);
}

export function raumZuId(id: string): Raum | undefined {
  return raeume.find((raum) => raum.id === id);
}
