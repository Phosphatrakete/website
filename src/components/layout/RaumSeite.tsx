"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { raumZuId } from "@/config/rooms";

/** sessionStorage-Schlüssel: von welchem Raum aus zurückgezoomt wird. */
export const ZOOM_VON_SCHLUESSEL = "haus:zoom-von";

/**
 * Gemeinsame Hülle aller Raum-Seiten:
 * – sanfter Eintritt (Fortsetzung des Zooms aus der Hausansicht),
 * – „Zurück zum Haus“-Button und ESC-Taste mit umgekehrter Zoom-Animation.
 */
export function RaumSeite({
  raumId,
  children,
}: {
  raumId: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const reduzierteBewegung = useReducedMotion();
  const raum = raumZuId(raumId);

  const zurueckZumHaus = useCallback(() => {
    try {
      sessionStorage.setItem(ZOOM_VON_SCHLUESSEL, raumId);
    } catch {
      // sessionStorage nicht verfügbar – dann ohne Rückwärts-Zoom.
    }
    router.push("/");
  }, [raumId, router]);

  useEffect(() => {
    function beiTaste(ereignis: KeyboardEvent) {
      if (ereignis.key !== "Escape" || ereignis.defaultPrevented) return;
      // Offene Dialoge (z. B. Lightbox) haben Vorrang vor der Navigation.
      if (document.querySelector("dialog[open]")) return;
      zurueckZumHaus();
    }
    window.addEventListener("keydown", beiTaste);
    return () => window.removeEventListener("keydown", beiTaste);
  }, [zurueckZumHaus]);

  return (
    <motion.div
      initial={
        reduzierteBewegung ? { opacity: 1 } : { opacity: 0, scale: 1.02 }
      }
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.32, 0.72, 0.24, 1] }}
    >
      <div className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
        <button
          type="button"
          onClick={zurueckZumHaus}
          className="group inline-flex items-center gap-2 rounded-full border border-creme-300/70 bg-creme-50/80 py-1.5 pr-4 pl-2.5 text-sm text-tinte-700 shadow-karte backdrop-blur-sm transition-colors hover:bg-creme-200 hover:text-tinte-900"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="h-4 w-4 fill-none stroke-current stroke-[1.6] transition-transform group-hover:-translate-x-0.5"
          >
            <path d="M10 3 5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Zurück zum Haus
          <kbd className="ml-1 hidden rounded border border-creme-400/60 bg-creme-200/70 px-1.5 py-0.5 text-[10px] text-tinte-600 sm:inline">
            Esc
          </kbd>
        </button>
      </div>
      {raum ? <span className="sr-only">{raum.untertitel}</span> : null}
      {children}
    </motion.div>
  );
}
