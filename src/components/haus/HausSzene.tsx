"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HausSzenerie } from "./HausIllustration";
import { ZOOM_VON_SCHLUESSEL } from "@/components/layout/RaumSeite";
import { HAUS_VIEWBOX, raeume, raumZuId, type Raum } from "@/config/rooms";
import { siteConfig } from "@/config/site";

const EASE_HAUS: [number, number, number, number] = [0.32, 0.72, 0.24, 1];
const ZOOM_DAUER = 0.75;

/** Transformation, die den gewünschten Ausschnitt bildschirmfüllend zoomt. */
function zoomTransformation(raum: Raum) {
  const { x, y, b, h } = raum.ausschnitt;
  const mitteX = x + b / 2;
  const mitteY = y + h / 2;
  const faktor =
    Math.min(HAUS_VIEWBOX.breite / b, HAUS_VIEWBOX.hoehe / h, 2.8) * 0.94;
  return {
    scale: faktor,
    x: faktor * (HAUS_VIEWBOX.breite / 2 - mitteX),
    y: faktor * (HAUS_VIEWBOX.hoehe / 2 - mitteY),
  };
}

const KEINE_TRANSFORMATION = { scale: 1, x: 0, y: 0 };

/**
 * Die interaktive Hausansicht (Desktop): Querschnitt mit klickbaren
 * Räumen, Hover-Labels und Zoom-Übergängen in die Raum-Seiten.
 *
 * Wird nur clientseitig gerendert – liest beim Einhängen, ob gerade aus
 * einem Raum zurückgekehrt wird, und spielt dann den umgekehrten Zoom.
 */
export function HausSzene({ onTorErneut }: { onTorErneut?: () => void }) {
  const router = useRouter();
  const reduzierteBewegung = useReducedMotion();
  const [aktiverRaum, setAktiverRaum] = useState<string | null>(null);
  const [zoomZiel, setZoomZiel] = useState<Raum | null>(null);
  const [rueckkehrVon] = useState<Raum | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raumId = sessionStorage.getItem(ZOOM_VON_SCHLUESSEL);
      sessionStorage.removeItem(ZOOM_VON_SCHLUESSEL);
      return raumId ? (raumZuId(raumId) ?? null) : null;
    } catch {
      return null;
    }
  });

  const betreteRaum = useCallback(
    (raum: Raum) => {
      if (zoomZiel) return;
      try {
        sessionStorage.setItem(ZOOM_VON_SCHLUESSEL, raum.id);
      } catch {
        // ohne sessionStorage entfällt nur der Rückwärts-Zoom
      }
      if (reduzierteBewegung) {
        router.push(raum.slug);
        return;
      }
      setZoomZiel(raum);
    },
    [reduzierteBewegung, router, zoomZiel],
  );

  const startTransformation =
    rueckkehrVon && !reduzierteBewegung
      ? zoomTransformation(rueckkehrVon)
      : KEINE_TRANSFORMATION;

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-creme-100">
      <svg
        viewBox={`0 0 ${HAUS_VIEWBOX.breite} ${HAUS_VIEWBOX.hoehe}`}
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        aria-label={`Querschnitt des Hauses der Familie ${siteConfig.familienname} mit anklickbaren Räumen`}
      >
        <motion.g
          style={{ transformOrigin: "800px 500px" }}
          initial={startTransformation}
          animate={zoomZiel ? zoomTransformation(zoomZiel) : KEINE_TRANSFORMATION}
          transition={{ duration: ZOOM_DAUER, ease: EASE_HAUS }}
          onAnimationComplete={() => {
            if (zoomZiel) router.push(zoomZiel.slug);
          }}
        >
          <HausSzenerie p="szene" />

          {/* Klickbare Räume */}
          {raeume.map((raum) => (
            <g
              key={raum.id}
              className="haus-raum"
              role="link"
              tabIndex={0}
              aria-label={raum.ariaLabel}
              onClick={() => betreteRaum(raum)}
              onKeyDown={(ereignis) => {
                if (ereignis.key === "Enter" || ereignis.key === " ") {
                  ereignis.preventDefault();
                  betreteRaum(raum);
                }
              }}
              onMouseEnter={() => setAktiverRaum(raum.id)}
              onMouseLeave={() =>
                setAktiverRaum((bisher) => (bisher === raum.id ? null : bisher))
              }
              onFocus={() => setAktiverRaum(raum.id)}
              onBlur={() =>
                setAktiverRaum((bisher) => (bisher === raum.id ? null : bisher))
              }
            >
              <rect
                x={raum.ausschnitt.x}
                y={raum.ausschnitt.y}
                width={raum.ausschnitt.b}
                height={raum.ausschnitt.h}
                rx="20"
                fill="transparent"
              />
              <rect
                className="raum-glanz"
                x={raum.ausschnitt.x}
                y={raum.ausschnitt.y}
                width={raum.ausschnitt.b}
                height={raum.ausschnitt.h}
                rx="20"
                fill="#fdfbf5"
                fillOpacity="0.14"
                stroke="#c2a565"
                strokeWidth="2.5"
              />
              {/* Doppelter Fokusring (hell + dunkel), damit er auf allen
                  Flächen der Illustration ausreichend Kontrast hat */}
              <rect
                className="raum-fokus"
                x={raum.ausschnitt.x - 6}
                y={raum.ausschnitt.y - 6}
                width={raum.ausschnitt.b + 12}
                height={raum.ausschnitt.h + 12}
                rx="24"
                fill="none"
                stroke="#fdfbf5"
                strokeWidth="7"
              />
              <rect
                className="raum-fokus"
                x={raum.ausschnitt.x - 6}
                y={raum.ausschnitt.y - 6}
                width={raum.ausschnitt.b + 12}
                height={raum.ausschnitt.h + 12}
                rx="24"
                fill="none"
                stroke="#1e2630"
                strokeWidth="3"
              />
            </g>
          ))}

          {/* Hover-/Fokus-Label */}
          <AnimatePresence>
            {aktiverRaum && !zoomZiel ? (
              <RaumLabel key={aktiverRaum} raumId={aktiverRaum} />
            ) : null}
          </AnimatePresence>
        </motion.g>
      </svg>

      {/* Überblendung beim Betreten / bei der Rückkehr */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-creme-100"
        initial={{ opacity: rueckkehrVon && !reduzierteBewegung ? 1 : 0 }}
        animate={{ opacity: zoomZiel ? 1 : 0 }}
        transition={
          zoomZiel
            ? { duration: 0.4, delay: ZOOM_DAUER - 0.35 }
            : { duration: 0.45 }
        }
      />

      {/* Dezente Hinweise */}
      <p className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-creme-300/70 bg-creme-50/80 px-4 py-1.5 text-sm text-tinte-600 shadow-karte backdrop-blur-sm">
        Wählen Sie einen Raum – oder nutzen Sie das Menü oben.
      </p>
      {onTorErneut ? (
        <button
          type="button"
          onClick={onTorErneut}
          className="absolute right-4 bottom-6 rounded-full border border-creme-300/70 bg-creme-50/80 px-3 py-1.5 text-xs text-tinte-600 shadow-karte backdrop-blur-sm transition-colors hover:bg-creme-200 hover:text-tinte-900"
        >
          Tor-Szene erneut ansehen
        </button>
      ) : null}
    </div>
  );
}

function RaumLabel({ raumId }: { raumId: string }) {
  const reduzierteBewegung = useReducedMotion();
  const raum = raumZuId(raumId);
  if (!raum) return null;
  const mitteX = raum.ausschnitt.x + raum.ausschnitt.b / 2;
  const basisY = raum.ausschnitt.y - 18;
  const untertitel =
    raum.status === "geschuetzt"
      ? `${raum.untertitel} · geschützt`
      : raum.untertitel;
  return (
    <motion.g
      initial={reduzierteBewegung ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduzierteBewegung ? { opacity: 0, y: 0 } : { opacity: 0, y: 6 }}
      transition={{ duration: reduzierteBewegung ? 0 : 0.25, ease: "easeOut" }}
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    >
      <text
        x={mitteX}
        y={basisY - 26}
        textAnchor="middle"
        fontSize="38"
        fontWeight="600"
        fill="#171d24"
        stroke="#fdfbf5"
        strokeWidth="9"
        style={{ fontFamily: "var(--font-display)", paintOrder: "stroke" }}
      >
        {raum.name}
      </text>
      <text
        x={mitteX}
        y={basisY}
        textAnchor="middle"
        fontSize="17"
        fill="#364350"
        stroke="#fdfbf5"
        strokeWidth="7"
        style={{ fontFamily: "var(--font-sans)", paintOrder: "stroke" }}
      >
        {untertitel}
      </text>
    </motion.g>
  );
}
