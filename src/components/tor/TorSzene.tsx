"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HausStandbild } from "@/components/haus/HausIllustration";
import { siteConfig } from "@/config/site";

const TOR_DAUER_MS = 2050;

/**
 * Eingangsszene: ein zweiflügeliges schmiedeeisernes Hoftor vor dem Haus.
 * Klick, Enter oder Leertaste öffnen die Flügel; anschließend „tritt“ die
 * Kamera durch das Tor ein. Ein Überspringen-Link steht immer bereit.
 */
export function TorSzene({ onGeoeffnet }: { onGeoeffnet: () => void }) {
  const reduzierteBewegung = useReducedMotion();
  const [phase, setPhase] = useState<"zu" | "oeffnet">("zu");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function oeffnen() {
    if (phase !== "zu") return;
    if (reduzierteBewegung) {
      onGeoeffnet();
      return;
    }
    setPhase("oeffnet");
    timerRef.current = setTimeout(onGeoeffnet, TOR_DAUER_MS);
  }

  const oeffnetSich = phase === "oeffnet";

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-creme-100">
      {/* Kulisse: das Haus hinter dem Tor */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 0.94 }}
        animate={{ scale: oeffnetSich ? 1 : 0.94 }}
        transition={{ duration: 1.6, ease: [0.32, 0.72, 0.24, 1] }}
        aria-hidden="true"
      >
        <HausStandbild p="tor-kulisse" className="h-full w-full" />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute inset-0 bg-tinte-900"
        initial={{ opacity: 0.22 }}
        animate={{ opacity: oeffnetSich ? 0 : 0.22 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 42%, transparent 45%, rgba(23,29,36,0.32) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Überspringen */}
      <button
        type="button"
        onClick={() => onGeoeffnet()}
        className="absolute top-16 right-4 z-20 rounded-full border border-creme-300/60 bg-creme-50/70 px-4 py-1.5 text-xs text-tinte-700 shadow-karte backdrop-blur-sm transition-colors hover:bg-creme-100 hover:text-tinte-900"
      >
        Überspringen
      </button>

      {/* Tor mit Pfeilern und Schriftzug */}
      <motion.div
        className="absolute inset-0 z-10 flex items-center justify-center"
        initial={{ scale: 1, opacity: 1 }}
        animate={
          oeffnetSich ? { scale: 2.05, opacity: 0 } : { scale: 1, opacity: 1 }
        }
        transition={{ duration: 1.0, delay: 0.85, ease: [0.5, 0, 0.75, 0.4] }}
        style={{ transformOrigin: "50% 58%" }}
      >
        <div className="flex w-[min(92vw,760px)] flex-col items-center">
          {/* Schriftzug */}
          <p className="font-display text-4xl font-medium tracking-[0.22em] text-tinte-900 uppercase sm:text-6xl">
            {siteConfig.familienname}
          </p>
          <div
            className="mt-3 mb-6 flex w-56 items-center gap-2 text-messing-500 sm:w-72"
            aria-hidden="true"
          >
            <span className="h-px flex-1 bg-messing-400/80" />
            <svg viewBox="0 0 10 10" className="h-2 w-2 fill-messing-400">
              <path d="M5 0 10 5 5 10 0 5Z" />
            </svg>
            <span className="h-px flex-1 bg-messing-400/80" />
          </div>

          {/* Pfeiler + Flügel */}
          <div
            className="flex w-full items-end justify-center"
            onClick={oeffnen}
            aria-hidden="true"
            style={{ cursor: phase === "zu" ? "pointer" : "default" }}
          >
            <TorPfeiler />
            <div
              className="flex flex-1 items-end"
              style={{ perspective: "1500px" }}
            >
              <motion.div
                className="w-1/2"
                initial={{ rotateY: 0 }}
                animate={{ rotateY: oeffnetSich ? 74 : 0 }}
                transition={{ duration: 1.35, ease: [0.42, 0, 0.24, 1] }}
                style={{ transformOrigin: "left center" }}
              >
                <TorFluegel />
              </motion.div>
              <motion.div
                className="w-1/2"
                initial={{ rotateY: 0 }}
                animate={{ rotateY: oeffnetSich ? -74 : 0 }}
                transition={{ duration: 1.35, ease: [0.42, 0, 0.24, 1] }}
                style={{ transformOrigin: "right center" }}
              >
                <TorFluegel gespiegelt />
              </motion.div>
            </div>
            <TorPfeiler />
          </div>

          {/* Einladung */}
          <motion.button
            type="button"
            onClick={oeffnen}
            autoFocus
            animate={{ opacity: oeffnetSich ? 0 : 1 }}
            transition={{ duration: 0.3 }}
            className="mt-8 rounded-full border border-messing-400/70 bg-creme-50/85 px-6 py-2.5 text-sm tracking-wide text-tinte-800 shadow-karte backdrop-blur-sm transition-colors hover:bg-creme-50 hover:text-tinte-950"
          >
            Tor öffnen
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

/** Steinpfeiler mit Deckplatte und Kugelaufsatz. */
function TorPfeiler() {
  return (
    <svg
      viewBox="0 0 80 520"
      className="h-[min(58vh,480px)] w-auto shrink-0 drop-shadow-sm"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="40" cy="26" r="16" fill="#d9cba9" />
      <rect x="6" y="42" width="68" height="14" rx="2" fill="#e2d6ba" />
      <rect x="12" y="56" width="56" height="440" fill="#e9dfc8" />
      <g stroke="#d9cba9" strokeWidth="2">
        <path d="M12,120 h56 M12,190 h56 M12,260 h56 M12,330 h56 M12,400 h56" />
        <path d="M40,56 v64 M26,120 v70 M54,190 v70 M26,260 v70 M54,330 v70 M40,400 v96" opacity="0.6" />
      </g>
      <rect x="8" y="496" width="64" height="24" rx="2" fill="#e2d6ba" />
    </svg>
  );
}

/**
 * Ein schmiedeeiserner Torflügel. Der rechte Flügel entsteht durch
 * Spiegelung, sodass die Zierhälften sich in der Mitte treffen.
 */
function TorFluegel({ gespiegelt = false }: { gespiegelt?: boolean }) {
  const staebe = [10, 50, 90, 130, 170, 210, 250, 290];
  // Oberkante des Flügels steigt zur Mitte hin an (Bogen).
  const obenBei = (x: number) => 128 - (x / 300) * 54 - 8 * Math.sin((x / 300) * Math.PI);

  return (
    <svg
      viewBox="0 0 300 470"
      className="h-auto w-full"
      aria-hidden="true"
      focusable="false"
      style={gespiegelt ? { transform: "scaleX(-1)" } : undefined}
    >
      {/* Stäbe mit vergoldeten Spitzen */}
      <g stroke="#28323e" strokeWidth="6" strokeLinecap="round">
        {staebe.map((x) => (
          <path key={x} d={`M${x},${obenBei(x)} V452`} />
        ))}
      </g>
      {staebe.map((x) => (
        <path
          key={x}
          d={`M${x},${obenBei(x) - 16} l6,12 -6,6 -6,-6 Z`}
          fill="#c2a565"
        />
      ))}

      {/* Ober- und Untergurte */}
      <path
        d={`M6,${obenBei(6) + 22} Q150,${obenBei(150) + 6} 296,${obenBei(296) + 22}`}
        stroke="#28323e"
        strokeWidth="7"
        fill="none"
      />
      <path d="M4,346 H298" stroke="#28323e" strokeWidth="7" />
      <path d="M4,452 H298" stroke="#28323e" strokeWidth="8" />

      {/* Schlagleiste (Mittelkante) */}
      <path d="M295,66 V456" stroke="#1e2630" strokeWidth="10" />

      {/* Volutenwerk im unteren Feld */}
      <g stroke="#364350" strokeWidth="4" fill="none">
        <path d="M30,440 C30,398 82,398 82,432 C82,452 48,452 48,432" />
        <path d="M130,440 C130,398 182,398 182,432 C182,452 148,452 148,432" />
        <path d="M230,440 C230,398 282,398 282,432 C282,452 248,452 248,432" />
        <path d="M56,360 C90,378 120,378 150,360" opacity="0.9" />
        <path d="M156,360 C190,378 220,378 250,360" opacity="0.9" />
      </g>
      <g fill="#c2a565">
        <circle cx="48" cy="430" r="4" />
        <circle cx="148" cy="430" r="4" />
        <circle cx="248" cy="430" r="4" />
      </g>

      {/* Halbe Rosette an der Schlagleiste – schließt sich mit dem
          gegenüberliegenden Flügel zu einem Kreis */}
      <g stroke="#c2a565" fill="none">
        <path d="M295,214 a48,48 0 0 0 0,96" strokeWidth="4" />
        <path d="M295,232 a30,30 0 0 0 0,60" strokeWidth="3" />
        <path d="M295,254 l-9,8 9,8 Z" fill="#c2a565" stroke="none" />
      </g>

      {/* Torgriff */}
      <circle cx="272" cy="300" r="8" fill="none" stroke="#c2a565" strokeWidth="3.5" />
    </svg>
  );
}
