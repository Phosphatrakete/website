"use client";

import { motion, useReducedMotion } from "framer-motion";
import { TodoHinweis } from "@/components/ui/TodoHinweis";
import {
  kapitelAnkerId,
  roemischeZiffer,
  type BibliothekKapitel,
} from "@/content/bibliothek";

/** Dezente Einblendung: kleine Verschiebung + Fade, jeweils nur einmal. */
const einblendVarianten = {
  verborgen: { opacity: 0, y: 24 },
  sichtbar: { opacity: 1, y: 0 },
} as const;

/**
 * Ein Kapitel der Namensgeschichte: römische Nummer, Jahres-Eyebrow,
 * Überschrift und Absätze. Absätze mit `todo: true` erhalten sichtbar
 * einen <TodoHinweis>. Beim Scrollen blendet sich das Kapitel einmalig
 * dezent ein; bei reduzierter Bewegung ist es sofort sichtbar.
 */
export function KapitelAbschnitt({
  kapitel,
  mitTrenner = false,
}: {
  kapitel: BibliothekKapitel;
  /** Feine Trennlinie oberhalb (für alle Kapitel außer dem ersten). */
  mitTrenner?: boolean;
}) {
  const reduzierteBewegung = useReducedMotion();
  const anker = kapitelAnkerId(kapitel);
  const roemisch = roemischeZiffer(kapitel.nummer);

  return (
    <motion.section
      id={anker}
      aria-labelledby={`${anker}-titel`}
      variants={einblendVarianten}
      initial={reduzierteBewegung ? "sichtbar" : "verborgen"}
      whileInView="sichtbar"
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0.24, 1] }}
      className={`scroll-mt-28 ${
        mitTrenner
          ? "border-t border-creme-300/70 py-10 sm:py-12"
          : "pb-10 sm:pb-12"
      }`}
    >
      <header className="flex items-start gap-4 sm:gap-5">
        <span
          aria-hidden="true"
          className="mt-0.5 font-display text-4xl leading-none text-messing-600 select-none sm:text-5xl"
        >
          {roemisch}.
        </span>
        <div className="min-w-0">
          <p className="font-sans text-xs font-semibold tracking-[0.18em] text-messing-700 uppercase">
            {kapitel.jahrSpanne.label}
          </p>
          <h2
            id={`${anker}-titel`}
            className="mt-1.5 text-3xl leading-tight text-tinte-900 sm:text-4xl"
          >
            <span className="sr-only">Kapitel {kapitel.nummer}: </span>
            {kapitel.titel}
          </h2>
        </div>
      </header>

      <div className="mt-6 space-y-5">
        {kapitel.absaetze.map((absatz, index) => (
          <p
            key={index}
            className={`max-w-prose leading-relaxed text-tinte-800 ${
              kapitel.nummer === 1 && index === 0
                ? "first-letter:float-left first-letter:mt-1 first-letter:mr-2.5 first-letter:font-display first-letter:text-5xl first-letter:leading-[0.8] first-letter:text-messing-600"
                : ""
            }`}
          >
            {absatz.text}
            {absatz.todo ? (
              <span className="ml-2 inline-flex align-middle">
                <TodoHinweis />
              </span>
            ) : null}
          </p>
        ))}
      </div>
    </motion.section>
  );
}
