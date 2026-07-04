/**
 * Proxy (Next 16, vormals Middleware): optimistische Zugriffskontrolle für
 * den geschützten Familienbereich.
 *
 * – `/stammbaum` ist nur mit gültigem Session-Cookie erreichbar; ohne
 *   Sitzung wird zur Schloss-Seite `/stammbaum/zugang` umgeleitet.
 *   Die Seite selbst prüft die Sitzung zusätzlich (Defense in depth).
 * – `/stammbaum/zugang` bleibt frei erreichbar (dort hängt das Schloss).
 * – Beide Pfade erhalten den Header `X-Robots-Tag: noindex, nofollow`,
 *   zusätzlich zu den noindex-Metadaten der Seiten und `robots.ts`.
 *
 * Bewusst eigenständig gehalten (kein Import aus `src/lib/auth.ts`):
 * Der Proxy läuft Edge-kompatibel und nutzt daher ausschließlich jose –
 * kein `node:crypto`, kein `next/headers`.
 */

import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

/** Muss mit `SITZUNGS_COOKIE` in `src/lib/auth.ts` übereinstimmen. */
const SITZUNGS_COOKIE = "familien_sitzung";

/** Prüft das Session-JWT rein mit jose (Edge-kompatibel). */
async function tokenGueltig(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const geheimnis = process.env.SESSION_SECRET;
  if (!geheimnis || geheimnis.length < 32) {
    console.error(
      "[proxy] SESSION_SECRET fehlt oder ist zu kurz – Zugriff auf " +
        "/stammbaum wird verweigert. Siehe .env.example.",
    );
    return false;
  }
  try {
    await jwtVerify(token, new TextEncoder().encode(geheimnis), {
      algorithms: ["HS256"],
    });
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Zugriffskontrolle nur für den geschützten Raum selbst –
  // die Zugangsseite bleibt frei.
  if (pathname === "/stammbaum") {
    const token = request.cookies.get(SITZUNGS_COOKIE)?.value;
    if (!(await tokenGueltig(token))) {
      const umleitung = NextResponse.redirect(
        new URL("/stammbaum/zugang", request.url),
      );
      umleitung.headers.set("X-Robots-Tag", "noindex, nofollow");
      return umleitung;
    }
  }

  // Familienbereich (inkl. Zugangsseite) nie in Suchmaschinen.
  const antwort = NextResponse.next();
  antwort.headers.set("X-Robots-Tag", "noindex, nofollow");
  return antwort;
}

export const config = {
  matcher: ["/stammbaum", "/stammbaum/zugang"],
};
