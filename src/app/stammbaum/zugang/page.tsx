import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { sessionGueltig } from "@/lib/auth";
import { raumZuId } from "@/config/rooms";
import { HausStandbild } from "@/components/haus/HausIllustration";
import { aufschliessen } from "../actions";

export const metadata: Metadata = {
  title: "Der Apfelbaum",
  robots: { index: false, follow: false },
};

// Sitzungsprüfung per Cookie – die Seite ist grundsätzlich dynamisch.
export const dynamic = "force-dynamic";

/**
 * Zugangsseite zum geschützten Familienbereich: Man steht vor dem
 * Apfelbaum, ein Schloss will geöffnet werden. Bereits angemeldete
 * Besucher werden direkt zum Stammbaum weitergeleitet.
 */
export default async function ZugangSeite({
  searchParams,
}: {
  // In Next 16 sind searchParams ein Promise.
  searchParams: Promise<{ fehler?: string }>;
}) {
  if (await sessionGueltig()) {
    redirect("/stammbaum");
  }

  const { fehler } = await searchParams;
  const raum = raumZuId("stammbaum")!;

  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pt-24 pb-24 sm:px-6">
      {/* Stimmungsbild: der Apfelbaum in einer ovalen Maske */}
      <div
        className="relative aspect-4/5 w-56 overflow-hidden rounded-[50%] shadow-karte ring-1 ring-messing-300/70 sm:w-64"
        aria-hidden="true"
      >
        <HausStandbild
          p="zugang"
          ausschnitt={raum.ausschnitt}
          className="h-full w-full"
        />
        {/* Warmer Schleier, damit das Bild hinter dem Schloss zurücktritt */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-creme-100/60" />
      </div>

      <header className="mt-8 text-center">
        <p className="text-sm tracking-[0.18em] text-messing-700 uppercase">
          {raum.name}
        </p>
        <h1 className="mt-2 text-5xl text-tinte-900">{raum.untertitel}</h1>
        <p className="mt-3 font-display text-xl text-tinte-600 italic">
          Ein Schloss, ein Familienpasswort.
        </p>
      </header>

      {/* Das Schloss: schlichtes Formular */}
      <form
        action={aufschliessen}
        className="mt-10 w-full max-w-sm rounded-2xl border border-creme-300/70 bg-creme-50/80 p-6 shadow-karte sm:p-8"
      >
        {fehler ? (
          <p
            id="passwort-fehler"
            role="alert"
            className="mb-5 rounded-lg border border-apfel-500/30 bg-apfel-500/10 px-4 py-3 text-sm leading-relaxed text-tinte-800"
          >
            Das war leider nicht das richtige Passwort.
          </p>
        ) : null}

        <label
          htmlFor="passwort"
          className="block text-sm font-medium text-tinte-800"
        >
          Familienpasswort
        </label>
        <input
          type="password"
          id="passwort"
          name="passwort"
          required
          autoComplete="current-password"
          aria-describedby={fehler ? "passwort-fehler" : undefined}
          className="mt-2 block w-full rounded-lg border border-creme-400/80 bg-creme-50 px-3.5 py-2.5 text-tinte-900 shadow-inner placeholder:text-tinte-500/60"
          placeholder="••••••••"
        />

        <button
          type="submit"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-messing-600 px-4 py-2.5 text-sm font-medium tracking-wide text-creme-50 shadow-karte transition-colors hover:bg-messing-700"
        >
          {/* Schloss-Symbol */}
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="h-4 w-4 fill-none stroke-current stroke-[1.5]"
          >
            <rect x="3" y="7" width="10" height="7" rx="1.5" />
            <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" strokeLinecap="round" />
          </svg>
          Aufschließen
        </button>

        <p className="mt-5 text-center text-xs leading-relaxed text-tinte-600">
          Dieser Bereich ist der Familie vorbehalten.
        </p>
      </form>

      <Link
        href="/"
        className="mt-8 text-sm text-tinte-600 underline decoration-messing-400 underline-offset-4 transition-colors hover:text-tinte-900"
      >
        Zurück zum Haus
      </Link>
    </div>
  );
}
