"use client";

import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { TorSzene } from "@/components/tor/TorSzene";
import { HausSzene } from "@/components/haus/HausSzene";
import { RaumKarten } from "@/components/haus/RaumKarten";
import { siteConfig } from "@/config/site";

/** localStorage-Schlüssel: wurde das Tor bereits geöffnet? */
const TOR_SCHLUESSEL = "tor:geoeffnet";

type Ansicht = "laden" | "tor" | "haus";

/**
 * Einstieg der Website: Erstbesucher sehen die Tor-Szene, wiederkehrende
 * Besucher direkt das Haus (mit der Option, das Tor erneut zu erleben).
 * Bei `prefers-reduced-motion` wird die Tor-Szene übersprungen.
 */
export function Eingang() {
  const reduzierteBewegung = useReducedMotion();
  const [ansicht, setAnsicht] = useState<Ansicht>("laden");

  useEffect(() => {
    if (ansicht !== "laden") return;
    let bereitsGeoeffnet = false;
    try {
      bereitsGeoeffnet = localStorage.getItem(TOR_SCHLUESSEL) === "1";
    } catch {
      // ohne localStorage zeigen wir das Tor bei jedem Besuch
    }
    // Bewusst erst nach der Hydration: localStorage ist serverseitig nicht
    // verfügbar, und ein Lesen im useState-Initializer ergäbe einen
    // Hydration-Mismatch. Der Effekt läuft genau einmal.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnsicht(bereitsGeoeffnet || reduzierteBewegung ? "haus" : "tor");
  }, [ansicht, reduzierteBewegung]);

  const torGeoeffnet = useCallback(() => {
    try {
      localStorage.setItem(TOR_SCHLUESSEL, "1");
    } catch {
      // nicht kritisch – das Tor erscheint dann erneut
    }
    setAnsicht("haus");
  }, []);

  const torErneut = useCallback(() => setAnsicht("tor"), []);

  if (ansicht === "tor") {
    return <TorSzene onGeoeffnet={torGeoeffnet} />;
  }

  if (ansicht === "haus") {
    // Der interaktive Querschnitt braucht ein breites Fenster UND ein
    // querformatiges Seitenverhältnis (sonst schneidet die randlose
    // SVG-Darstellung Garage und Apfelbaum ab) – alle anderen Geräte,
    // etwa Tablets im Hochformat, erhalten die Kartenansicht.
    return (
      <>
        <div className="hidden [@media(min-width:768px)_and_(min-aspect-ratio:5/4)]:block">
          <HausSzene onTorErneut={torErneut} />
        </div>
        <div className="[@media(min-width:768px)_and_(min-aspect-ratio:5/4)]:hidden">
          <RaumKarten onTorErneut={torErneut} />
        </div>
      </>
    );
  }

  // Ladezustand: ruhige Fläche mit dem Schriftzug, bis localStorage
  // ausgewertet ist (ein einziger Effekt-Tick).
  return (
    <div className="flex h-dvh items-center justify-center bg-creme-100">
      <p className="font-display text-3xl tracking-[0.22em] text-tinte-500 uppercase opacity-40">
        {siteConfig.familienname}
      </p>
    </div>
  );
}
