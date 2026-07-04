"use client";

import { useState } from "react";
import Image from "next/image";
import type { GalerieEintrag } from "@/content/garage";
import { Lightbox } from "./Lightbox";

/**
 * Ruhiges Masonry-Layout für die Garage-Galerie.
 *
 * Umsetzung über CSS-Spalten (`columns`) – Einträge behalten dank
 * `break-inside-avoid` ihre Form, `width`/`height` aus den Daten
 * verhindern Layout-Springen beim Laden. Jede Kachel ist ein Button,
 * der die Großansicht (Lightbox) öffnet.
 */
export function Galerie({
  eintraege,
}: {
  eintraege: readonly GalerieEintrag[];
}) {
  const [aktiverIndex, setAktiverIndex] = useState<number | null>(null);

  return (
    <>
      <ul className="columns-1 gap-6 sm:columns-2 lg:columns-3">
        {eintraege.map((eintrag, index) => (
          <li key={eintrag.id} className="mb-6 break-inside-avoid">
            <button
              type="button"
              onClick={() => setAktiverIndex(index)}
              aria-label={`„${eintrag.titel}“ in Großansicht öffnen`}
              className="group block w-full rounded-2xl text-left"
            >
              <figure>
                <div className="relative overflow-hidden rounded-2xl bg-creme-200 shadow-karte transition-shadow duration-300 group-hover:shadow-karte-hover">
                  {eintrag.typ === "bild" ? (
                    <Image
                      src={eintrag.quelle}
                      alt={eintrag.alt}
                      width={eintrag.breite}
                      height={eintrag.hoehe}
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                      // Die ersten Motive sind beim Laden im Sichtfeld –
                      // sie eager zu laden verbessert den LCP deutlich.
                      priority={index < 3}
                      className="h-auto w-full motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.02]"
                    />
                  ) : (
                    // Videos zeigen in der Übersicht ihr Posterbild;
                    // abgespielt wird erst in der Großansicht.
                    <div
                      className="relative w-full bg-tinte-900"
                      style={{
                        aspectRatio: `${eintrag.breite} / ${eintrag.hoehe}`,
                      }}
                    >
                      {eintrag.poster ? (
                        <Image
                          src={eintrag.poster}
                          alt={eintrag.alt}
                          fill
                          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                          className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.02]"
                        />
                      ) : null}
                      {/* Abspiel-Hinweis */}
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-tinte-950/60 backdrop-blur-sm transition-colors group-hover:bg-tinte-950/75">
                          <svg
                            viewBox="0 0 16 16"
                            className="ml-0.5 h-6 w-6 fill-creme-100"
                          >
                            <path d="M4.5 2.8v10.4c0 .7.8 1.2 1.4.8l8-5.2a.95.95 0 0 0 0-1.6l-8-5.2c-.6-.4-1.4.1-1.4.8Z" />
                          </svg>
                        </span>
                      </span>
                    </div>
                  )}
                </div>
                <figcaption className="mt-3 px-1">
                  <span className="block font-display text-lg leading-snug text-tinte-900">
                    {eintrag.titel}
                  </span>
                  {eintrag.geschichte ? (
                    <span className="mt-0.5 line-clamp-2 block text-sm leading-relaxed text-tinte-600">
                      {eintrag.geschichte}
                    </span>
                  ) : null}
                </figcaption>
              </figure>
            </button>
          </li>
        ))}
      </ul>

      {aktiverIndex !== null ? (
        <Lightbox
          eintraege={eintraege}
          index={aktiverIndex}
          onWechseln={setAktiverIndex}
          onSchliessen={() => setAktiverIndex(null)}
        />
      ) : null}
    </>
  );
}
