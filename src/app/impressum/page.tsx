import type { Metadata } from "next";
import { TodoHinweis } from "@/components/ui/TodoHinweis";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum der Familien-Website.",
  robots: { index: false },
};

export default function ImpressumSeite() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6">
      <h1 className="text-4xl text-tinte-900">Impressum</h1>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-tinte-700">
        <p>
          <TodoHinweis>
            TODO – vom Betreiber zu prüfen/befüllen: Angaben gemäß § 5 DDG
          </TodoHinweis>
        </p>
        <section className="space-y-1">
          <h2 className="text-xl text-tinte-900">Angaben zum Betreiber</h2>
          <p>Vorname Nachname</p>
          <p>Straße Hausnummer</p>
          <p>PLZ Ort</p>
        </section>
        <section className="space-y-1">
          <h2 className="text-xl text-tinte-900">Kontakt</h2>
          <p>E-Mail: kontakt@example.org</p>
        </section>
        <section className="space-y-1">
          <h2 className="text-xl text-tinte-900">
            Verantwortlich für den Inhalt
          </h2>
          <p>Vorname Nachname, Anschrift wie oben</p>
        </section>
        <p className="text-xs text-tinte-600">
          Hinweis: Diese Website ist ein privates, nicht-kommerzielles
          Familienprojekt. <TodoHinweis>TODO – Pflichtangaben prüfen</TodoHinweis>
        </p>
      </div>
    </div>
  );
}
