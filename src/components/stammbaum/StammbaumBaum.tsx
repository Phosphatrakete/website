"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { FamilienBaum, Person } from "./typen";
import { lebensdaten } from "./typen";

/**
 * Interaktiver Stammbaum in der Apfelbaum-Metapher.
 *
 * Die älteste Generation (0) steht unten an den Wurzeln, jüngere
 * Generationen wachsen darüber Richtung Krone. Ein SVG zeichnet Stamm,
 * Äste und Dekor; die Personen liegen als echte HTML-Buttons darüber –
 * so bleiben Tastaturbedienung und Screenreader-Zugang einfach.
 *
 * Das Detail-Panel ist ein nicht-modaler `<dialog open>`: Solange er
 * offen ist, ignoriert `RaumSeite` die ESC-Taste (keine ungewollte
 * Navigation); ESC schließt stattdessen zuerst das Panel.
 */

/* ── Layout-Konstanten (Pixel) ─────────────────────────────────────── */

const KARTE_B = 152; // Breite eines Personen-Kärtchens
const KARTE_H = 58; // Höhe eines Personen-Kärtchens
const PAAR_LUECKE = 14; // Lücke zwischen zwei Partner-Kärtchen
const EINHEIT_LUECKE = 56; // Lücke zwischen Einheiten einer Ebene
const EBENEN_HOEHE = 170; // vertikaler Abstand der Generationen
const RAND_OBEN = 118; // Platz für die Krone
const RAND_UNTEN = 138; // Platz für Wurzeln und Boden
const RAND_X = 56;

/* ── Layout-Berechnung ─────────────────────────────────────────────── */

interface Punkt {
  x: number;
  y: number;
}

interface Layout {
  breite: number;
  hoehe: number;
  /** Kartenmittelpunkte je Personen-ID. */
  positionen: Map<string, Punkt>;
  /** x-Position des Stamms (Mitte der Wurzelgeneration). */
  stammX: number;
}

/**
 * Einfaches Ebenen-Layout: Pro Generation werden „Einheiten“ gebildet
 * (Partnerschaften als Doppelkarte, übrige Personen einzeln) und
 * gleichmäßig zentriert verteilt. Für die kleine Datenmenge genügt das.
 */
function berechneLayout(daten: FamilienBaum): Layout {
  const generationen = Math.max(
    daten.generationen,
    ...daten.personen.map((p) => p.generation + 1),
  );

  type Einheit = { breite: number; personen: string[] };
  const paarBreite = 2 * KARTE_B + PAAR_LUECKE;

  const ebenen: Einheit[][] = [];
  for (let g = 0; g < generationen; g += 1) {
    const inPaar = new Set<string>();
    const einheiten: Einheit[] = [];

    // Partnerschaften, deren beide Partner in dieser Generation stehen.
    for (const pa of daten.partnerschaften) {
      const [a, b] = pa.partner.map((id) =>
        daten.personen.find((p) => p.id === id),
      );
      if (a && b && a.generation === g && b.generation === g) {
        einheiten.push({ breite: paarBreite, personen: [a.id, b.id] });
        inPaar.add(a.id);
        inPaar.add(b.id);
      }
    }
    // Übrige Personen der Generation als Einzelkarten.
    for (const person of daten.personen) {
      if (person.generation === g && !inPaar.has(person.id)) {
        einheiten.push({ breite: KARTE_B, personen: [person.id] });
      }
    }
    ebenen.push(einheiten);
  }

  const zeilenBreite = (einheiten: Einheit[]) =>
    einheiten.reduce((summe, e) => summe + e.breite, 0) +
    Math.max(0, einheiten.length - 1) * EINHEIT_LUECKE;

  const innenBreite = Math.max(...ebenen.map(zeilenBreite), 360);
  const breite = innenBreite + 2 * RAND_X;
  const hoehe = RAND_OBEN + (generationen - 1) * EBENEN_HOEHE + RAND_UNTEN;

  const positionen = new Map<string, Punkt>();
  let stammX = breite / 2;

  ebenen.forEach((einheiten, g) => {
    const y = hoehe - RAND_UNTEN - g * EBENEN_HOEHE;
    let cursor = (breite - zeilenBreite(einheiten)) / 2;
    einheiten.forEach((einheit) => {
      const mitte = cursor + einheit.breite / 2;
      if (einheit.personen.length === 2) {
        const versatz = (KARTE_B + PAAR_LUECKE) / 2;
        positionen.set(einheit.personen[0], { x: mitte - versatz, y });
        positionen.set(einheit.personen[1], { x: mitte + versatz, y });
        if (g === 0) stammX = mitte;
      } else {
        positionen.set(einheit.personen[0], { x: mitte, y });
      }
      cursor += einheit.breite + EINHEIT_LUECKE;
    });
  });

  return { breite, hoehe, positionen, stammX };
}

/* ── Dekor (Blätter der Krone, Äpfel) – bewusst dezent ─────────────── */

const KRONEN_BLAETTER = [
  { fx: 0.17, y: 66, r: 30, farbe: "#a9ba97", neigung: -18 },
  { fx: 0.31, y: 46, r: 37, farbe: "#8ca07a", neigung: 10 },
  { fx: 0.48, y: 38, r: 43, farbe: "#a9ba97", neigung: -6 },
  { fx: 0.65, y: 44, r: 38, farbe: "#8ca07a", neigung: 14 },
  { fx: 0.81, y: 60, r: 31, farbe: "#cdd8bd", neigung: -12 },
] as const;

const KRONEN_AEPFEL = [
  { fx: 0.27, y: 84 },
  { fx: 0.57, y: 70 },
  { fx: 0.75, y: 94 },
] as const;

const MotionDialog = motion.create("dialog");

/* ── Komponente ────────────────────────────────────────────────────── */

export function StammbaumBaum({ daten }: { daten: FamilienBaum }) {
  const reduzierteBewegung = useReducedMotion();
  const layout = useMemo(() => berechneLayout(daten), [daten]);

  const [aktiveId, setAktiveId] = useState<string | null>(null);

  // Spiegel des States für den einmalig registrierten ESC-Listener.
  const aktiveIdRef = useRef<string | null>(null);
  useEffect(() => {
    aktiveIdRef.current = aktiveId;
  }, [aktiveId]);

  /** Zuletzt benutzter Knoten – erhält den Fokus zurück beim Schließen. */
  const letzterKnopf = useRef<HTMLButtonElement | null>(null);
  const schliessenKnopf = useRef<HTMLButtonElement | null>(null);

  const personZuId = useMemo(
    () => new Map(daten.personen.map((p) => [p.id, p])),
    [daten],
  );
  const aktivePerson = aktiveId ? (personZuId.get(aktiveId) ?? null) : null;

  const panelSchliessen = useCallback(() => {
    setAktiveId(null);
    letzterKnopf.current?.focus();
  }, []);

  // ESC schließt zuerst das Detail-Panel. Der Listener wird beim Mount
  // registriert (Kind-Effekte laufen vor denen von RaumSeite) und ruft
  // preventDefault auf, damit RaumSeite nicht zusätzlich navigiert –
  // zudem ignoriert RaumSeite ESC ohnehin, solange der Dialog offen ist.
  useEffect(() => {
    function beiTaste(ereignis: KeyboardEvent) {
      if (ereignis.key !== "Escape" || !aktiveIdRef.current) return;
      ereignis.preventDefault();
      panelSchliessen();
    }
    window.addEventListener("keydown", beiTaste);
    return () => window.removeEventListener("keydown", beiTaste);
  }, [panelSchliessen]);

  // Beim Öffnen bzw. Personenwechsel den Fokus ins Panel holen.
  useEffect(() => {
    if (aktiveId) schliessenKnopf.current?.focus();
  }, [aktiveId]);

  /* Beziehungen der aktiven Person für das Panel ableiten. */
  const beziehungen = useMemo(() => {
    if (!aktivePerson) return null;
    const namen = (ids: readonly string[]) =>
      ids
        .map((id) => personZuId.get(id))
        .filter((p): p is Person => Boolean(p))
        .map((p) => `${p.vorname} ${p.nachname}`);

    const partner: string[] = [];
    const kinder: string[] = [];
    const eltern: string[] = [];
    for (const pa of daten.partnerschaften) {
      if (pa.partner.includes(aktivePerson.id)) {
        partner.push(
          ...namen(pa.partner.filter((id) => id !== aktivePerson.id)),
        );
        kinder.push(...namen(pa.kinder));
      }
      if (pa.kinder.includes(aktivePerson.id)) {
        eltern.push(...namen(pa.partner));
      }
    }
    return { partner, kinder, eltern };
  }, [aktivePerson, daten, personZuId]);

  const { breite, hoehe, positionen, stammX } = layout;
  const bodenY = hoehe - 40;

  /* Äste: von jeder Partnerschaft zu ihren Kindern (Bezier-Kurven). */
  const aeste: { d: string; staerke: number }[] = [];
  for (const pa of daten.partnerschaften) {
    const p1 = positionen.get(pa.partner[0]);
    const p2 = positionen.get(pa.partner[1]);
    if (!p1 || !p2) continue;
    const mx = (p1.x + p2.x) / 2;
    const my = Math.min(p1.y, p2.y);
    const generation =
      personZuId.get(pa.partner[0])?.generation ?? 0;
    const start = { x: mx, y: my - KARTE_H / 2 - 6 };
    for (const kindId of pa.kinder) {
      const kind = positionen.get(kindId);
      if (!kind) continue;
      const ende = { x: kind.x, y: kind.y + KARTE_H / 2 + 6 };
      const mittelY = (start.y + ende.y) / 2;
      aeste.push({
        d: `M ${start.x} ${start.y} C ${start.x} ${mittelY}, ${ende.x} ${mittelY}, ${ende.x} ${ende.y}`,
        staerke: Math.max(3, 7 - generation * 2.5),
      });
    }
  }

  /* Partner-Verbindungen (kleine Brücke zwischen den Kärtchen). */
  const paarLinien: { x1: number; x2: number; y: number }[] = [];
  for (const pa of daten.partnerschaften) {
    const p1 = positionen.get(pa.partner[0]);
    const p2 = positionen.get(pa.partner[1]);
    if (!p1 || !p2 || p1.y !== p2.y) continue;
    const [links, rechts] = p1.x < p2.x ? [p1, p2] : [p2, p1];
    paarLinien.push({
      x1: links.x + KARTE_B / 2,
      x2: rechts.x - KARTE_B / 2,
      y: p1.y,
    });
  }

  return (
    <div>
      {/* Scroll-Container: auf schmalen Bildschirmen horizontal scrollbar */}
      <div
        className="overflow-x-auto rounded-3xl border border-creme-300/70 bg-linear-to-b from-creme-50/60 to-creme-200/50 pb-2 shadow-karte"
        role="group"
        aria-label="Stammbaum als Apfelbaum – älteste Generation unten an den Wurzeln, jüngste oben in der Krone. Bei Bedarf horizontal scrollbar."
        tabIndex={0}
      >
        <motion.div
          className="relative mx-auto"
          style={{ width: breite, height: hoehe }}
          initial={reduzierteBewegung ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Zeichenebene: Boden, Wurzeln, Stamm, Äste, Blätter, Äpfel */}
          <svg
            className="absolute inset-0"
            width={breite}
            height={hoehe}
            viewBox={`0 0 ${breite} ${hoehe}`}
            aria-hidden="true"
            focusable="false"
          >
            {/* Boden */}
            <ellipse
              cx={stammX}
              cy={bodenY + 14}
              rx={breite * 0.3}
              ry={22}
              fill="#cdd8bd"
              opacity={0.55}
            />
            <ellipse
              cx={stammX}
              cy={bodenY + 10}
              rx={breite * 0.18}
              ry={13}
              fill="#a9ba97"
              opacity={0.4}
            />

            {/* Wurzeln */}
            <g
              stroke="#4a3726"
              strokeLinecap="round"
              fill="none"
              opacity={0.85}
            >
              <path
                d={`M ${stammX} ${bodenY - 6} C ${stammX - 24} ${bodenY + 10}, ${stammX - 60} ${bodenY + 12}, ${stammX - 96} ${bodenY + 20}`}
                strokeWidth={7}
              />
              <path
                d={`M ${stammX} ${bodenY - 6} C ${stammX + 26} ${bodenY + 8}, ${stammX + 62} ${bodenY + 14}, ${stammX + 98} ${bodenY + 18}`}
                strokeWidth={7}
              />
              <path
                d={`M ${stammX - 4} ${bodenY - 2} C ${stammX - 12} ${bodenY + 14}, ${stammX - 28} ${bodenY + 22}, ${stammX - 44} ${bodenY + 30}`}
                strokeWidth={4}
              />
              <path
                d={`M ${stammX + 4} ${bodenY - 2} C ${stammX + 14} ${bodenY + 16}, ${stammX + 30} ${bodenY + 24}, ${stammX + 48} ${bodenY + 28}`}
                strokeWidth={4}
              />
            </g>

            {/* Stamm: vom Boden zur Wurzelgeneration */}
            <path
              d={`M ${stammX} ${bodenY} C ${stammX - 6} ${bodenY - 60}, ${stammX + 6} ${hoehe - RAND_UNTEN + 50}, ${stammX} ${hoehe - RAND_UNTEN}`}
              stroke="#5f4732"
              strokeWidth={20}
              strokeLinecap="round"
              fill="none"
            />
            <path
              d={`M ${stammX} ${bodenY} C ${stammX - 6} ${bodenY - 60}, ${stammX + 6} ${hoehe - RAND_UNTEN + 50}, ${stammX} ${hoehe - RAND_UNTEN}`}
              stroke="#7a5c42"
              strokeWidth={11}
              strokeLinecap="round"
              fill="none"
            />

            {/* Äste: Partnerschaften → Kinder */}
            <g stroke="#5f4732" strokeLinecap="round" fill="none">
              {aeste.map((ast, index) => (
                <path key={index} d={ast.d} strokeWidth={ast.staerke} />
              ))}
            </g>

            {/* Partner-Verbindungen */}
            <g>
              {paarLinien.map((linie, index) => (
                <g key={index}>
                  <line
                    x1={linie.x1}
                    y1={linie.y}
                    x2={linie.x2}
                    y2={linie.y}
                    stroke="#c2a565"
                    strokeWidth={2}
                  />
                  {/* kleiner Stiel von der Brücke hinauf zum Ast */}
                  <line
                    x1={(linie.x1 + linie.x2) / 2}
                    y1={linie.y}
                    x2={(linie.x1 + linie.x2) / 2}
                    y2={linie.y - KARTE_H / 2 - 6}
                    stroke="#7a5c42"
                    strokeWidth={3}
                  />
                  <circle
                    cx={(linie.x1 + linie.x2) / 2}
                    cy={linie.y}
                    r={3.5}
                    fill="#a98a4e"
                  />
                </g>
              ))}
            </g>

            {/* Krone: Blätter */}
            <g>
              {KRONEN_BLAETTER.map((blatt, index) => (
                <ellipse
                  key={index}
                  cx={blatt.fx * breite}
                  cy={blatt.y}
                  rx={blatt.r}
                  ry={blatt.r * 0.62}
                  fill={blatt.farbe}
                  opacity={0.55}
                  transform={`rotate(${blatt.neigung} ${blatt.fx * breite} ${blatt.y})`}
                />
              ))}
            </g>

            {/* Krone: wenige Äpfel */}
            <g>
              {KRONEN_AEPFEL.map((apfel, index) => {
                const x = apfel.fx * breite;
                return (
                  <g key={index}>
                    <path
                      d={`M ${x} ${apfel.y - 7} q 2 -6 7 -8`}
                      stroke="#5f4732"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      fill="none"
                    />
                    <circle cx={x} cy={apfel.y} r={7} fill="#a85b4b" />
                    <ellipse
                      cx={x + 8}
                      cy={apfel.y - 12}
                      rx={5}
                      ry={2.6}
                      fill="#64784f"
                      transform={`rotate(-24 ${x + 8} ${apfel.y - 12})`}
                    />
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Personen-Knoten als Buttons über dem SVG */}
          {daten.personen.map((person) => {
            const position = positionen.get(person.id);
            if (!position) return null;
            const aktiv = aktiveId === person.id;
            return (
              <button
                key={person.id}
                type="button"
                aria-expanded={aktiv}
                aria-controls="stammbaum-detail"
                aria-label={`${person.vorname} ${person.nachname}, ${lebensdaten(person)} – Details anzeigen`}
                onClick={(ereignis) => {
                  letzterKnopf.current = ereignis.currentTarget;
                  setAktiveId(aktiv ? null : person.id);
                }}
                className={`absolute flex flex-col items-center justify-center rounded-xl border bg-creme-50 px-2 text-center shadow-karte transition-all ${
                  aktiv
                    ? "border-messing-500 shadow-karte-hover ring-2 ring-messing-400/60"
                    : "border-messing-300/70 hover:border-messing-400 hover:shadow-karte-hover"
                }`}
                style={{
                  left: position.x - KARTE_B / 2,
                  top: position.y - KARTE_H / 2,
                  width: KARTE_B,
                  height: KARTE_H,
                }}
              >
                <span className="font-display text-[15px] leading-tight text-tinte-900">
                  {person.vorname} {person.nachname}
                </span>
                <span className="mt-0.5 text-[11px] text-tinte-600">
                  {lebensdaten(person)}
                </span>
              </button>
            );
          })}
        </motion.div>
      </div>

      <p className="mt-3 text-center text-xs text-tinte-600">
        Älteste Generation unten an den Wurzeln, jüngste oben in der Krone.
      </p>

      {/* Detail-Panel: nicht-modaler Dialog – unten auf Mobile, seitlich ab lg */}
      {aktivePerson && beziehungen ? (
        <MotionDialog
          open
          id="stammbaum-detail"
          aria-label={`Details zu ${aktivePerson.vorname} ${aktivePerson.nachname}`}
          className="fixed inset-x-0 bottom-0 z-50 m-0 max-h-[70vh] w-full max-w-none overflow-y-auto rounded-t-2xl border border-messing-300/60 bg-creme-50 p-6 text-tinte-900 shadow-karte-hover lg:top-32 lg:right-6 lg:bottom-auto lg:left-auto lg:w-96 lg:max-w-sm lg:rounded-2xl"
          initial={
            reduzierteBewegung ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }
          }
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.32, 0.72, 0.24, 1] }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.16em] text-messing-700 uppercase">
                {aktivePerson.generation === 0
                  ? "Wurzelgeneration"
                  : `Generation ${aktivePerson.generation + 1}`}
              </p>
              <h2 className="mt-1 text-2xl text-tinte-900">
                {aktivePerson.vorname} {aktivePerson.nachname}
              </h2>
            </div>
            <button
              ref={schliessenKnopf}
              type="button"
              onClick={panelSchliessen}
              aria-label="Details schließen"
              className="rounded-full border border-creme-300/70 bg-creme-100 p-2 text-tinte-700 transition-colors hover:bg-creme-200 hover:text-tinte-900"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="h-4 w-4 fill-none stroke-current stroke-[1.6]"
              >
                <path d="m4 4 8 8M12 4l-8 8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <dl className="mt-5 space-y-3 text-sm leading-relaxed">
            <div>
              <dt className="font-medium text-tinte-800">Geboren</dt>
              <dd className="text-tinte-600">
                {aktivePerson.geburtsjahr}, {aktivePerson.geburtsort}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-tinte-800">Gestorben</dt>
              <dd className="text-tinte-600">
                {aktivePerson.sterbejahr ?? "– (lebt oder unbekannt)"}
              </dd>
            </div>
            {beziehungen.eltern.length > 0 ? (
              <div>
                <dt className="font-medium text-tinte-800">Eltern</dt>
                <dd className="text-tinte-600">
                  {beziehungen.eltern.join(" und ")}
                </dd>
              </div>
            ) : null}
            {beziehungen.partner.length > 0 ? (
              <div>
                <dt className="font-medium text-tinte-800">Partnerschaft</dt>
                <dd className="text-tinte-600">
                  {beziehungen.partner.join(", ")}
                </dd>
              </div>
            ) : null}
            {beziehungen.kinder.length > 0 ? (
              <div>
                <dt className="font-medium text-tinte-800">Kinder</dt>
                <dd className="text-tinte-600">
                  {beziehungen.kinder.join(", ")}
                </dd>
              </div>
            ) : null}
            <div>
              <dt className="font-medium text-tinte-800">Anmerkung</dt>
              <dd className="text-tinte-600">{aktivePerson.anmerkung}</dd>
            </div>
          </dl>
        </MotionDialog>
      ) : null}
    </div>
  );
}
