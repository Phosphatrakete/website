"use server";

/**
 * Server Actions für den geschützten Familienbereich:
 * Aufschließen (Login) und Wieder-Abschließen (Logout).
 */

import { redirect } from "next/navigation";
import {
  passwortKorrekt,
  sessionBeenden,
  sessionErstellen,
} from "@/lib/auth";

/**
 * Einfache globale Drosselung gegen parallelisiertes Durchprobieren:
 * Nach mehreren Fehlversuchen in kurzer Zeit werden weitere Versuche für
 * eine wachsende Sperrzeit abgewiesen (ein gemeinsames Passwort → ein
 * gemeinsamer Zähler; pro-IP-Zählung wäre durch IP-Wechsel umgehbar).
 *
 * Grenze des Ansatzes: Der Zähler lebt im Prozessspeicher. Bei
 * Serverless-/Multi-Instanz-Hosting gilt er nur je Instanz – der
 * wirksamste Schutz bleibt daher ein langes, zufälliges FAMILY_PASSWORD
 * (siehe README) plus ggf. Rate-Limiting der Hosting-Plattform.
 */
const drossel = {
  fehlversuche: 0,
  gesperrtBis: 0,
};
const FREIE_VERSUCHE = 5;
const BASIS_SPERRE_MS = 30_000;
const MAX_SPERRE_MS = 15 * 60_000;

function drosselAktiv(): boolean {
  return Date.now() < drossel.gesperrtBis;
}

function fehlversuchVermerken(): void {
  drossel.fehlversuche += 1;
  if (drossel.fehlversuche >= FREIE_VERSUCHE) {
    const stufe = drossel.fehlversuche - FREIE_VERSUCHE;
    const sperre = Math.min(BASIS_SPERRE_MS * 2 ** stufe, MAX_SPERRE_MS);
    drossel.gesperrtBis = Date.now() + sperre;
  }
}

/**
 * Prüft das Familienpasswort und öffnet bei Erfolg die Sitzung.
 *
 * Bei einem Fehlversuch antwortet die Zugangsseite bewusst neutral
 * (`?fehler=1`, kein Passwort-Echo, kein Hinweis auf Inhalte) und mit
 * einer kleinen künstlichen Verzögerung gegen schnelles Durchprobieren.
 */
export async function aufschliessen(formData: FormData): Promise<void> {
  if (drosselAktiv()) {
    await new Promise((fertig) => setTimeout(fertig, 400));
    redirect("/stammbaum/zugang?fehler=1");
  }

  const eingabe = formData.get("passwort");
  const korrekt =
    typeof eingabe === "string" &&
    eingabe.length > 0 &&
    passwortKorrekt(eingabe);

  if (korrekt && (await sessionErstellen())) {
    drossel.fehlversuche = 0;
    drossel.gesperrtBis = 0;
    redirect("/stammbaum");
  }

  // Fehlversuch (falsches Passwort oder fehlende Server-Konfiguration):
  // vermerken, kurz warten, dann neutral zurück zur Zugangsseite.
  fehlversuchVermerken();
  await new Promise((fertig) => setTimeout(fertig, 400));
  redirect("/stammbaum/zugang?fehler=1");
}

/** Beendet die Sitzung („Wieder abschließen“) und führt zurück zum Haus. */
export async function abschliessen(): Promise<void> {
  await sessionBeenden();
  redirect("/");
}
