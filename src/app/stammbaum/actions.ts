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
 * Prüft das Familienpasswort und öffnet bei Erfolg die Sitzung.
 *
 * Bei einem Fehlversuch antwortet die Zugangsseite bewusst neutral
 * (`?fehler=1`, kein Passwort-Echo, kein Hinweis auf Inhalte) und mit
 * einer kleinen künstlichen Verzögerung gegen schnelles Durchprobieren.
 */
export async function aufschliessen(formData: FormData): Promise<void> {
  const eingabe = formData.get("passwort");
  const korrekt =
    typeof eingabe === "string" &&
    eingabe.length > 0 &&
    passwortKorrekt(eingabe);

  if (korrekt && (await sessionErstellen())) {
    redirect("/stammbaum");
  }

  // Fehlversuch (falsches Passwort oder fehlende Server-Konfiguration):
  // kurz warten, dann neutral zurück zur Zugangsseite.
  await new Promise((fertig) => setTimeout(fertig, 400));
  redirect("/stammbaum/zugang?fehler=1");
}

/** Beendet die Sitzung („Wieder abschließen“) und führt zurück zum Haus. */
export async function abschliessen(): Promise<void> {
  await sessionBeenden();
  redirect("/");
}
