"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useScroll } from "framer-motion";
import {
  bibliothekEinleitung,
  bibliothekKapitel,
  kapitelAnkerId,
} from "@/content/bibliothek";
import { FluchtKarte } from "./FluchtKarte";
import { KapitelAbschnitt } from "./KapitelAbschnitt";
import { Zeitleiste } from "./Zeitleiste";

/** Anker-IDs aller Kapitel-Sections in Lesereihenfolge. */
const ANKER_IDS = bibliothekKapitel.map((kapitel) => kapitelAnkerId(kapitel));

/** Index, nach dem die Fluchtkarte auf kleinen Screens eingeschoben wird
 *  (0-basiert: nach Kapitel 3, also zwischen Kapitel III und IV). */
const KARTE_NACH_KAPITEL_INDEX = 2;

/**
 * Ermittelt per IntersectionObserver das gerade gelesene Kapitel:
 * Beobachtet wird ein schmales Band im oberen Drittel des Viewports;
 * aktiv ist das erste Kapitel (in Dokumentreihenfolge), das es schneidet.
 */
function useAktivesKapitelId(): string | null {
  const [aktivId, setAktivId] = useState<string | null>(
    bibliothekKapitel[0]?.id ?? null,
  );

  useEffect(() => {
    const sichtbare = new Set<string>();
    const beobachter = new IntersectionObserver(
      (eintraege) => {
        for (const eintrag of eintraege) {
          if (eintrag.isIntersecting) sichtbare.add(eintrag.target.id);
          else sichtbare.delete(eintrag.target.id);
        }
        for (const [index, ankerId] of ANKER_IDS.entries()) {
          if (sichtbare.has(ankerId)) {
            setAktivId(bibliothekKapitel[index]?.id ?? null);
            return;
          }
        }
        // Kein Kapitel im Band (z. B. zwischen zwei Abschnitten):
        // die letzte Hervorhebung bleibt bestehen.
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );
    for (const ankerId of ANKER_IDS) {
      const element = document.getElementById(ankerId);
      if (element) beobachter.observe(element);
    }
    return () => beobachter.disconnect();
  }, []);

  return aktivId;
}

/**
 * Scrollytelling-Inhalt der Bibliothek: Seitenkopf, Kapitel (links) und
 * sticky Begleitspalte mit Fluchtkarte + Zeitleiste (rechts, ab lg).
 * Auf kleinen Screens: Zeitleiste horizontal unter dem Seitenkopf, Karte
 * zwischen Kapitel III und IV. Der Scroll-Fortschritt des Kapitel-Containers
 * treibt das Nachzeichnen der Fluchtroute an.
 */
export function BibliothekScrolly() {
  const kapitelContainerRef = useRef<HTMLDivElement>(null);
  // Fortschritt 0 → 1, während die Kapitel durch den Viewport wandern.
  const { scrollYProgress } = useScroll({
    target: kapitelContainerRef,
    offset: ["start 0.75", "end 0.85"],
  });
  const aktivesKapitelId = useAktivesKapitelId();

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      {/* Seitenkopf */}
      <header className="max-w-2xl pt-10 sm:pt-14">
        <p className="font-sans text-sm font-medium tracking-[0.18em] text-messing-700 uppercase">
          Bibliothek
        </p>
        <h1 className="mt-2 text-4xl leading-tight text-tinte-900 sm:text-5xl">
          Die Geschichte eines Namens
        </h1>
        <p className="mt-5 leading-relaxed text-tinte-700">
          {bibliothekEinleitung}
        </p>
      </header>

      {/* Kompakte Zeitleiste auf kleinen Screens */}
      <Zeitleiste
        ausrichtung="horizontal"
        aktivesKapitelId={aktivesKapitelId}
        className="mt-8 lg:hidden"
      />

      <div className="mt-10 sm:mt-14 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)] lg:gap-14 xl:gap-20">
        {/* Linke Spalte: die scrollenden Kapitel */}
        <div ref={kapitelContainerRef} className="min-w-0">
          {bibliothekKapitel.map((kapitel, index) => (
            <Fragment key={kapitel.id}>
              <KapitelAbschnitt kapitel={kapitel} mitTrenner={index > 0} />
              {index === KARTE_NACH_KAPITEL_INDEX ? (
                // Auf kleinen Screens erscheint die Karte mitten in der
                // Erzählung – zwischen Flucht (III) und Aufnahme (IV).
                <div className="border-t border-creme-300/70 py-10 lg:hidden">
                  <FluchtKarte
                    idPraefix="fluchtkarte-mobil"
                    fortschritt={scrollYProgress}
                  />
                </div>
              ) : null}
            </Fragment>
          ))}
        </div>

        {/* Rechte Spalte: sticky Begleitmaterial (nur ab lg) */}
        <aside
          aria-label="Begleitmaterial: Fluchtkarte und Zeitleiste"
          className="hidden lg:block"
        >
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] space-y-9 overflow-y-auto pr-1 pb-2">
            <FluchtKarte
              idPraefix="fluchtkarte-seite"
              fortschritt={scrollYProgress}
            />
            <Zeitleiste
              ausrichtung="vertikal"
              aktivesKapitelId={aktivesKapitelId}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
