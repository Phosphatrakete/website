/**
 * Typen für die Stammbaum-Daten (`src/data/family-tree.json`).
 *
 * Die JSON-Datei wird ausschließlich serverseitig gelesen und erst nach
 * erfolgreichem Login an die Client-Visualisierung übergeben – sie darf
 * niemals in `public/` liegen oder clientseitig nachgeladen werden.
 */

export interface Person {
  /** Eindeutige ID, z. B. "p1". */
  id: string;
  vorname: string;
  nachname: string;
  geburtsjahr: number;
  /** `null` = lebt bzw. unbekannt. */
  sterbejahr: number | null;
  geburtsort: string;
  /** Freitext-Anmerkung zur Person. */
  anmerkung: string;
  /** Generationsebene: 0 = älteste Generation (an den Wurzeln). */
  generation: number;
}

export interface Partnerschaft {
  /** Eindeutige ID, z. B. "pa1". */
  id: string;
  /** Genau zwei Personen-IDs. */
  partner: [string, string];
  /** Personen-IDs der gemeinsamen Kinder (darf leer sein). */
  kinder: string[];
}

export interface FamilienBaum {
  /** Anzahl der Generationsebenen. */
  generationen: number;
  personen: Person[];
  partnerschaften: Partnerschaft[];
}

/** Lebensdaten kompakt formatiert, z. B. „1898–1972“ oder „* 1958“. */
export function lebensdaten(person: Person): string {
  return person.sterbejahr === null
    ? `* ${person.geburtsjahr}`
    : `${person.geburtsjahr}–${person.sterbejahr}`;
}
