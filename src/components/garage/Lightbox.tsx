"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { GalerieEintrag } from "@/content/garage";

/** MIME-Typ eines Videos anhand der Dateiendung bestimmen. */
function videoMimeTyp(quelle: string): string | undefined {
  if (quelle.endsWith(".mp4")) return "video/mp4";
  if (quelle.endsWith(".webm")) return "video/webm";
  if (quelle.endsWith(".mov")) return "video/quicktime";
  return undefined;
}

/**
 * Großansicht der Galerie als natives `<dialog>`-Element.
 *
 * `showModal()` liefert Fokusfalle und ESC-Verhalten des Browsers frei
 * Haus; das globale ESC-Handling der RaumSeite pausiert automatisch,
 * solange ein offener Dialog im DOM steht. Navigation per Pfeiltasten
 * und sichtbaren Vor-/Zurück-Buttons, Klick auf den Hintergrund schließt.
 */
export function Lightbox({
  eintraege,
  index,
  onWechseln,
  onSchliessen,
}: {
  eintraege: readonly GalerieEintrag[];
  index: number;
  /** Wird mit dem neuen Index aufgerufen (Pfeiltasten/Buttons). */
  onWechseln: (neuerIndex: number) => void;
  /** Wird nach dem Schließen des Dialogs aufgerufen (State-Abgleich). */
  onSchliessen: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const schliessenRef = useRef<HTMLButtonElement>(null);
  const reduzierteBewegung = useReducedMotion();

  const eintrag = eintraege[index];
  const anzahl = eintraege.length;

  const zurueck = useCallback(() => {
    onWechseln((index - 1 + anzahl) % anzahl);
  }, [anzahl, index, onWechseln]);

  const weiter = useCallback(() => {
    onWechseln((index + 1) % anzahl);
  }, [anzahl, index, onWechseln]);

  // Dialog modal öffnen und Seiten-Scroll währenddessen sperren.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    // Ersten Fokus deterministisch auf den Schließen-Button legen.
    schliessenRef.current?.focus();
    const vorherigerOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = vorherigerOverflow;
    };
  }, []);

  // Pfeiltasten blättern durch die Einträge.
  useEffect(() => {
    function beiTaste(ereignis: KeyboardEvent) {
      // Pfeiltasten gehören dem fokussierten Video-Player (Spulen,
      // Lautstärke) bzw. Eingabefeldern – dort nicht blättern.
      if (
        ereignis.target instanceof HTMLMediaElement ||
        ereignis.target instanceof HTMLInputElement ||
        ereignis.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (ereignis.key === "ArrowLeft") {
        ereignis.preventDefault();
        zurueck();
      } else if (ereignis.key === "ArrowRight") {
        ereignis.preventDefault();
        weiter();
      }
    }
    window.addEventListener("keydown", beiTaste);
    return () => window.removeEventListener("keydown", beiTaste);
  }, [zurueck, weiter]);

  if (!eintrag) return null;

  const pfeilKlasse =
    "pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-creme-200/20 bg-tinte-800/80 text-creme-100 backdrop-blur-sm transition-colors hover:bg-tinte-700 hover:text-creme-50";

  return (
    <dialog
      ref={dialogRef}
      // Das native close-Ereignis (ESC, dialog.close()) gleicht den State ab.
      onClose={onSchliessen}
      onClick={(ereignis) => {
        // Klick auf den Backdrop (= das Dialog-Element selbst) schließt.
        if (ereignis.target === ereignis.currentTarget) {
          dialogRef.current?.close();
        }
      }}
      aria-label={`Großansicht: ${eintrag.titel} (${index + 1} von ${anzahl})`}
      className="m-auto h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-tinte-950/85 backdrop:backdrop-blur-sm"
    >
      <div
        className="flex h-full w-full items-center justify-center p-4 sm:p-8"
        onClick={(ereignis) => {
          // Klicks neben der Bildkarte schließen ebenfalls.
          if (ereignis.target === ereignis.currentTarget) {
            dialogRef.current?.close();
          }
        }}
      >
        {/* Nur die Medienfläche wird beim Wechsel neu aufgebaut – Buttons,
            Bildunterschrift und Live-Region bleiben stabil im DOM, damit
            der Tastaturfokus erhalten bleibt und Screenreader den Wechsel
            über die dauerhafte Live-Region ansagen. */}
        <figure className="relative flex max-h-full w-full max-w-6xl flex-col items-center">
          {/* Medienfläche */}
          <motion.div
            key={eintrag.id}
            initial={
              reduzierteBewegung ? { opacity: 1 } : { opacity: 0, scale: 0.985 }
            }
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0.24, 1] }}
            className="relative h-[min(70svh,52rem)] w-full"
          >
            {eintrag.typ === "bild" ? (
              <Image
                src={eintrag.quelle}
                alt={eintrag.alt}
                fill
                sizes="(min-width: 1280px) 72rem, 100vw"
                className="object-contain"
                priority
              />
            ) : (
              <video
                controls
                playsInline
                preload="metadata"
                poster={eintrag.poster}
                aria-label={eintrag.alt}
                className="mx-auto h-full w-auto max-w-full rounded-xl"
              >
                <source src={eintrag.quelle} type={videoMimeTyp(eintrag.quelle)} />
                Ihr Browser kann dieses Videoformat leider nicht abspielen.
              </video>
            )}
          </motion.div>

          {/* Titel, Geschichte und Zähler */}
          <figcaption className="mt-5 max-w-2xl text-center">
            <span className="block font-display text-2xl text-creme-100">
              {eintrag.titel}
            </span>
            {eintrag.geschichte ? (
              <span className="mt-1.5 block text-sm leading-relaxed text-creme-300/85">
                {eintrag.geschichte}
              </span>
            ) : null}
            <span
              aria-live="polite"
              className="mt-3 block text-xs tracking-[0.18em] text-creme-400/70 uppercase"
            >
              <span className="sr-only">{eintrag.titel}, </span>
              {index + 1} von {anzahl}
            </span>
          </figcaption>

          {/* Vor/Zurück – sichtbar an den Seiten (nur bei mehreren Einträgen) */}
          {anzahl > 1 ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between">
            <button
              type="button"
              onClick={zurueck}
              aria-label="Vorheriges Motiv anzeigen"
              className={`${pfeilKlasse} -translate-x-1 sm:-translate-x-3`}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="h-5 w-5 fill-none stroke-current stroke-[1.8]"
              >
                <path d="M10 3 5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={weiter}
              aria-label="Nächstes Motiv anzeigen"
              className={`${pfeilKlasse} translate-x-1 sm:translate-x-3`}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="h-5 w-5 fill-none stroke-current stroke-[1.8]"
              >
                <path d="m6 3 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          ) : null}
        </figure>

        {/* Schließen – oben rechts, erhält beim Öffnen den Fokus */}
        <button
          type="button"
          ref={schliessenRef}
          onClick={() => dialogRef.current?.close()}
          aria-label="Großansicht schließen"
          className="absolute top-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-creme-200/20 bg-tinte-800/80 text-creme-100 backdrop-blur-sm transition-colors hover:bg-tinte-700 hover:text-creme-50 sm:top-6 sm:right-6"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="h-5 w-5 fill-none stroke-current stroke-[1.8]"
          >
            <path d="m4 4 8 8M12 4l-8 8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </dialog>
  );
}
