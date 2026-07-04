/**
 * Zentrale Website-Konfiguration.
 *
 * Der Familienname wird ausschließlich hier gepflegt – alle Komponenten,
 * Texte und Metadaten leiten ihn von dieser Datei ab.
 */
export const siteConfig = {
  /** Familienname – erscheint im Tor, im Titel, im Header usw. */
  familienname: "Peteaux",
  /** Domain der Website (ohne Protokoll). */
  domain: "peteaux.de",
  /** Vollständige URL für Metadaten (Open Graph, Sitemap). */
  url: "https://peteaux.de",
  /** Kurzbeschreibung für Suchmaschinen (nur öffentliche Bereiche). */
  beschreibung:
    "Die Website der Familie Peteaux – ein begehbares Haus mit Bibliothek, Garage und Garten. Familiengeschichte von den Hugenotten bis heute.",
} as const;
