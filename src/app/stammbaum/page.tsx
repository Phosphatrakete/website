import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { promises as fs } from "node:fs";
import path from "node:path";
import { RaumSeite } from "@/components/layout/RaumSeite";
import { TodoHinweis } from "@/components/ui/TodoHinweis";
import { StammbaumBaum } from "@/components/stammbaum/StammbaumBaum";
import type { FamilienBaum } from "@/components/stammbaum/typen";
import { sessionGueltig } from "@/lib/auth";
import { abschliessen } from "./actions";

export const metadata: Metadata = {
  title: "Der Stammbaum",
  robots: { index: false, follow: false },
};

// Nie statisch vorrendern: Der Inhalt hängt an der Sitzung (Cookie).
export const dynamic = "force-dynamic";

/**
 * Liest die Stammbaum-Daten ausschließlich serverseitig aus `src/data/` –
 * bewusst NICHT aus `public/` und ohne clientseitigen Fetch, damit die
 * Daten nie im öffentlichen Bundle landen.
 */
async function ladeFamilienBaum(): Promise<FamilienBaum> {
  const dateipfad = path.join(process.cwd(), "src", "data", "family-tree.json");
  const inhalt = await fs.readFile(dateipfad, "utf8");
  return JSON.parse(inhalt) as FamilienBaum;
}

export default async function StammbaumSeite() {
  // Defense in depth: zusätzlich zur Proxy-Prüfung validiert die Seite
  // die Sitzung selbst, bevor irgendetwas gerendert wird.
  if (!(await sessionGueltig())) {
    redirect("/stammbaum/zugang");
  }

  const daten = await ladeFamilienBaum();

  return (
    <RaumSeite raumId="stammbaum">
      <div className="mx-auto max-w-6xl px-4 pt-10 pb-20 sm:px-6">
        {/* Seitenkopf */}
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm tracking-[0.18em] text-messing-700 uppercase">
            Der Apfelbaum
          </p>
          <h1 className="mt-2 text-5xl text-tinte-900">Der Stammbaum</h1>
          <p className="mt-6 leading-relaxed text-tinte-700">
            Unten die Wurzeln, oben die Krone: Die älteste Generation trägt
            den Baum, die jüngste wächst dem Licht entgegen. Wählen Sie eine
            Person aus, um mehr über sie zu erfahren.
          </p>
          <p className="mt-5">
            <TodoHinweis>
              TODO: echte Familiendaten einpflegen – die gezeigten Personen
              sind frei erfundene Beispieldaten
            </TodoHinweis>
          </p>
        </header>

        {/* Abmelden */}
        <div className="mt-6 flex justify-center">
          <form action={abschliessen}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full border border-creme-300/70 bg-creme-50/80 px-4 py-1.5 text-sm text-tinte-700 shadow-karte transition-colors hover:bg-creme-200 hover:text-tinte-900"
            >
              {/* Offenes Schloss – wird wieder zugesperrt */}
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="h-4 w-4 fill-none stroke-messing-600 stroke-[1.5]"
              >
                <rect x="3" y="7" width="10" height="7" rx="1.5" />
                <path d="M5.5 7V5a2.5 2.5 0 0 1 4.9-.7" strokeLinecap="round" />
              </svg>
              Wieder abschließen
            </button>
          </form>
        </div>

        {/* Interaktive Baum-Visualisierung */}
        <section aria-label="Interaktiver Stammbaum" className="mt-12">
          <StammbaumBaum daten={daten} />
        </section>
      </div>
    </RaumSeite>
  );
}
