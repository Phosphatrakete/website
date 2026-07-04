import type { Metadata } from "next";
import { RaumSeite } from "@/components/layout/RaumSeite";
import { Galerie } from "@/components/garage/Galerie";
import { TodoHinweis } from "@/components/ui/TodoHinweis";
import { galerieEintraege } from "@/content/garage";

export const metadata: Metadata = {
  title: "Garage – Die Leidenschaft",
  description:
    "Die Garage der Familie – eine ruhige Galerie aus Werkstatt und Landstraße: Projekte, Schrauberstunden und die Geschichten dahinter.",
};

export default function GarageSeite() {
  return (
    <RaumSeite raumId="garage">
      <div className="mx-auto max-w-6xl px-4 pt-10 pb-20 sm:px-6">
        {/* Seitenkopf */}
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm tracking-[0.18em] text-messing-700 uppercase">
            Garage
          </p>
          <h1 className="mt-2 text-5xl text-tinte-900">Die Leidenschaft</h1>
          <p className="mt-6 leading-relaxed text-tinte-700">
            Zwischen Werkbank und Landstraße entstehen die schönsten Stunden:
            Projekte, die nie ganz fertig werden, und Ausfahrten, die viel zu
            schnell vorbei sind. Diese Galerie erzählt Geschichten von Blech,
            Chrom und Schrauberglück – nicht von Personen.
          </p>
          <p className="mt-5">
            <TodoHinweis>
              TODO – Platzhalterbilder durch eigene Aufnahmen ersetzen
              (npm run bilder:import)
            </TodoHinweis>
          </p>
        </header>

        {/* Galerie */}
        <section aria-label="Bildergalerie der Garage" className="mt-12">
          <Galerie eintraege={galerieEintraege} />
        </section>

        {/* Hinweis zur Privatsphäre-Pipeline */}
        <aside
          aria-label="Hinweis zur Bild-Pipeline"
          className="mx-auto mt-14 flex max-w-2xl items-start gap-3 rounded-2xl border border-creme-300/70 bg-creme-50/70 px-5 py-4 text-sm leading-relaxed text-tinte-600"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="mt-0.5 h-4 w-4 shrink-0 fill-none stroke-messing-600 stroke-[1.4]"
          >
            <path
              d="M8 1.5 13.5 3.6v3.6c0 3.2-2.2 5.7-5.5 7.3-3.3-1.6-5.5-4.1-5.5-7.3V3.6L8 1.5Z"
              strokeLinejoin="round"
            />
            <path d="m5.6 7.8 1.7 1.7 3.1-3.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p>
            Alle Bilder dieser Galerie durchlaufen vor der Veröffentlichung
            eine Prüfung: Sämtliche Metadaten – etwa GPS-Daten der Kamera –
            werden entfernt, und es ist darauf geachtet, dass weder
            Kennzeichen noch Personen oder Orte zu erkennen sind.
          </p>
        </aside>
      </div>
    </RaumSeite>
  );
}
