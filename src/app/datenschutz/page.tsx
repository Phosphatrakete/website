import type { Metadata } from "next";
import { TodoHinweis } from "@/components/ui/TodoHinweis";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Datenschutzerklärung der Familien-Website.",
  robots: { index: false },
};

export default function DatenschutzSeite() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6">
      <h1 className="text-4xl text-tinte-900">Datenschutzerklärung</h1>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-tinte-700">
        <p>
          <TodoHinweis>
            TODO – vom Betreiber zu prüfen/befüllen (Verantwortlicher,
            Hosting-Anbieter, Rechtsgrundlagen)
          </TodoHinweis>
        </p>
        <section className="space-y-2">
          <h2 className="text-xl text-tinte-900">Grundsätze dieser Website</h2>
          <p>
            Diese private Familien-Website verzichtet bewusst auf Tracking,
            Analyse-Dienste, Werbenetzwerke und eingebettete Inhalte von
            Drittanbietern. Schriften und Medien werden ausschließlich vom
            eigenen Server ausgeliefert.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl text-tinte-900">Cookies und lokale Speicherung</h2>
          <p>
            Es werden nur technisch notwendige Daten gespeichert: ein
            Session-Cookie für den passwortgeschützten Familienbereich (wird
            beim Abmelden bzw. nach Ablauf gelöscht) sowie eine Markierung im
            localStorage des Browsers, die sich merkt, ob die Eingangsszene
            („Tor“) bereits abgespielt wurde. Beides enthält keine
            personenbezogenen Profile und wird nicht an Dritte übermittelt.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl text-tinte-900">Server-Logdateien</h2>
          <p>
            <TodoHinweis>
              TODO – Angaben des Hosting-Anbieters ergänzen (z. B. Vercel:
              Verarbeitung von Zugriffsdaten, Auftragsverarbeitung)
            </TodoHinweis>
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl text-tinte-900">Ihre Rechte</h2>
          <p>
            <TodoHinweis>
              TODO – Betroffenenrechte nach DSGVO sowie Kontakt des
              Verantwortlichen ergänzen
            </TodoHinweis>
          </p>
        </section>
      </div>
    </div>
  );
}
