"use client";

import {
  ZEITLEISTE_BEREICH,
  bibliothekKapitel,
  kapitelAnkerId,
  roemischeZiffer,
  type BibliothekKapitel,
} from "@/content/bibliothek";

/**
 * Begleitende Zeitleiste (ca. 1550–1750) als Navigationselement.
 *
 * Zwei Darstellungen:
 * – „vertikal“: Leiste mit Markern neben dem Inhalt (große Screens),
 * – „horizontal“: kompakte, scrollbare Pillen-Reihe (kleine Screens).
 *
 * Ein Klick springt per Anker-Link zum Kapitel; das aktive Kapitel wird
 * vom Elternteil (IntersectionObserver) übergeben und hervorgehoben.
 */
export function Zeitleiste({
  kapitel = bibliothekKapitel,
  aktivesKapitelId,
  ausrichtung,
  className,
}: {
  kapitel?: readonly BibliothekKapitel[];
  /** ID des aktuell sichtbaren Kapitels (nicht die Anker-ID). */
  aktivesKapitelId: string | null;
  ausrichtung: "vertikal" | "horizontal";
  className?: string;
}) {
  if (ausrichtung === "horizontal") {
    return (
      <nav
        aria-label="Zeitleiste der Kapitel, etwa 1550 bis 1750"
        className={className}
      >
        <ol className="flex gap-2 overflow-x-auto pb-1.5">
          {kapitel.map((eintrag) => {
            const aktiv = eintrag.id === aktivesKapitelId;
            return (
              <li key={eintrag.id} className="shrink-0">
                <a
                  href={`#${kapitelAnkerId(eintrag)}`}
                  aria-current={aktiv ? "true" : undefined}
                  className={`flex flex-col gap-0.5 rounded-lg border px-3 py-1.5 whitespace-nowrap transition-colors ${
                    aktiv
                      ? "border-messing-500/70 bg-creme-50 shadow-karte"
                      : "border-creme-300/80 bg-creme-50/40 hover:border-messing-400/60 hover:bg-creme-50"
                  }`}
                >
                  <span
                    className={`text-[10px] font-semibold tracking-[0.16em] uppercase ${
                      aktiv ? "text-messing-600" : "text-tinte-500"
                    }`}
                  >
                    {roemischeZiffer(eintrag.nummer)} ·{" "}
                    {eintrag.jahrSpanne.label}
                  </span>
                  <span
                    className={`text-xs ${
                      aktiv ? "text-tinte-900" : "text-tinte-600"
                    }`}
                  >
                    {eintrag.titel}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }

  return (
    <nav
      aria-label="Zeitleiste der Kapitel, etwa 1550 bis 1750"
      className={className}
    >
      <p
        aria-hidden="true"
        className="ml-6 font-sans text-[11px] font-semibold tracking-[0.14em] text-tinte-500"
      >
        {ZEITLEISTE_BEREICH.start}
      </p>
      <ol className="mt-2 ml-1.5 space-y-3 border-l border-creme-400/90 pl-5">
        {kapitel.map((eintrag) => {
          const aktiv = eintrag.id === aktivesKapitelId;
          return (
            <li key={eintrag.id} className="relative">
              {/* Marker auf der Leiste */}
              <span
                aria-hidden="true"
                className={`absolute top-[7px] -left-[25.5px] h-2.5 w-2.5 rounded-full border-2 transition-colors ${
                  aktiv
                    ? "border-messing-500 bg-messing-400"
                    : "border-creme-400 bg-creme-100"
                }`}
              />
              <a
                href={`#${kapitelAnkerId(eintrag)}`}
                aria-current={aktiv ? "true" : undefined}
                className="group block rounded-md py-0.5"
              >
                <span
                  className={`block text-[10px] font-semibold tracking-[0.16em] uppercase transition-colors ${
                    aktiv ? "text-messing-600" : "text-tinte-500"
                  }`}
                >
                  {eintrag.jahrSpanne.label}
                </span>
                <span
                  className={`block text-sm leading-snug transition-colors ${
                    aktiv
                      ? "font-medium text-tinte-900"
                      : "text-tinte-600 group-hover:text-tinte-900"
                  }`}
                >
                  <span className="sr-only">
                    Kapitel {eintrag.nummer}:{" "}
                  </span>
                  {eintrag.titel}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
      <p
        aria-hidden="true"
        className="mt-2 ml-6 font-sans text-[11px] font-semibold tracking-[0.14em] text-tinte-500"
      >
        {ZEITLEISTE_BEREICH.ende}
      </p>
    </nav>
  );
}
