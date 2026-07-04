/**
 * Session-Verwaltung für den geschützten Familienbereich („Der Apfelbaum“).
 *
 * Grundprinzipien:
 * – Ein einziges, signiertes HttpOnly-Cookie (`familien_sitzung`) mit einem
 *   HS256-JWT (jose). Kein weiteres Cookie, keine Datenbank.
 * – `SESSION_SECRET` und `FAMILY_PASSWORD` kommen ausschließlich aus der
 *   Umgebung (`.env.local` bzw. Hosting-Umgebung, Vorlage: `.env.example`)
 *   und stehen niemals im Code.
 * – Fehlende Umgebungsvariablen führen zu einem kontrollierten Fehlschlag
 *   mit Server-Log-Hinweis – niemals zu einem Crash beim Build.
 *
 * Diese Datei nutzt `next/headers` und `node:crypto` und ist damit für
 * Server Components, Server Actions und Route Handler gedacht – NICHT für
 * `src/proxy.ts` (dort läuft eine eigene, Edge-kompatible Prüfung nur mit
 * jose).
 */

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { createHash, timingSafeEqual } from "node:crypto";

/** Name des Session-Cookies – muss mit `src/proxy.ts` übereinstimmen. */
export const SITZUNGS_COOKIE = "familien_sitzung";

/** Lebensdauer der Sitzung: 14 Tage (in Sekunden). */
const SITZUNGS_DAUER_SEKUNDEN = 60 * 60 * 24 * 14;

/**
 * Liest das Signier-Geheimnis aus der Umgebung.
 * Gibt `null` zurück (mit Log-Hinweis), wenn es fehlt oder zu kurz ist –
 * Aufrufer behandeln das als „Anmeldung derzeit nicht möglich“.
 */
function signierGeheimnis(): Uint8Array | null {
  const wert = process.env.SESSION_SECRET;
  if (!wert || wert.length < 32) {
    console.error(
      "[auth] SESSION_SECRET fehlt oder ist kürzer als 32 Zeichen. " +
        "Bitte in .env.local bzw. in der Server-Umgebung setzen " +
        "(Vorlage und Anleitung: .env.example).",
    );
    return null;
  }
  return new TextEncoder().encode(wert);
}

/**
 * Prüft das eingegebene Familienpasswort zeitkonstant.
 *
 * Beide Werte werden zuerst per SHA-256 gehasht, damit `timingSafeEqual`
 * stets Puffer gleicher Länge vergleicht – so verrät auch die Passwortlänge
 * nichts über das Geheimnis.
 */
export function passwortKorrekt(eingabe: string): boolean {
  const erwartet = process.env.FAMILY_PASSWORD;
  if (!erwartet) {
    console.error(
      "[auth] FAMILY_PASSWORD ist nicht gesetzt – Anmeldung nicht möglich. " +
        "Bitte in .env.local bzw. in der Server-Umgebung setzen " +
        "(Vorlage: .env.example).",
    );
    return false;
  }
  const hashEingabe = createHash("sha256").update(eingabe, "utf8").digest();
  const hashErwartet = createHash("sha256").update(erwartet, "utf8").digest();
  return timingSafeEqual(hashEingabe, hashErwartet);
}

/**
 * Erstellt nach erfolgreicher Passwortprüfung eine Sitzung: signiert ein
 * HS256-JWT und legt es als HttpOnly-Cookie ab.
 *
 * @returns `true` bei Erfolg, `false` wenn kein Geheimnis konfiguriert ist.
 */
export async function sessionErstellen(): Promise<boolean> {
  const geheimnis = signierGeheimnis();
  if (!geheimnis) return false;

  const token = await new SignJWT({ bereich: "stammbaum" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SITZUNGS_DAUER_SEKUNDEN}s`)
    .sign(geheimnis);

  // cookies() ist in Next 16 asynchron.
  const cookieSpeicher = await cookies();
  cookieSpeicher.set(SITZUNGS_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: SITZUNGS_DAUER_SEKUNDEN,
  });
  return true;
}

/**
 * Prüft, ob die aktuelle Anfrage eine gültige Sitzung mitbringt
 * (Cookie vorhanden, Signatur korrekt, nicht abgelaufen).
 */
export async function sessionGueltig(): Promise<boolean> {
  const geheimnis = signierGeheimnis();
  if (!geheimnis) return false;

  const cookieSpeicher = await cookies();
  const token = cookieSpeicher.get(SITZUNGS_COOKIE)?.value;
  if (!token) return false;

  try {
    await jwtVerify(token, geheimnis, { algorithms: ["HS256"] });
    return true;
  } catch {
    // Ungültige Signatur, abgelaufen oder manipuliert – gleichbedeutend
    // mit „nicht angemeldet“.
    return false;
  }
}

/** Beendet die Sitzung: entfernt das Session-Cookie. */
export async function sessionBeenden(): Promise<void> {
  const cookieSpeicher = await cookies();
  cookieSpeicher.delete(SITZUNGS_COOKIE);
}
