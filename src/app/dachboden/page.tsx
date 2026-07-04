import type { Metadata } from "next";
import { RaumSeite } from "@/components/layout/RaumSeite";
import { HausStandbild } from "@/components/haus/HausIllustration";
import { raumZuId } from "@/config/rooms";

export const metadata: Metadata = {
  title: "Dachboden",
  description:
    "Der Dachboden der Familien-Website – hier wird noch renoviert.",
};

export default function DachbodenSeite() {
  const raum = raumZuId("dachboden");

  return (
    <RaumSeite raumId="dachboden">
      <div className="mx-auto max-w-2xl px-4 py-14 text-center sm:px-6">
        <p className="text-sm tracking-[0.18em] text-messing-700 uppercase">
          Dachboden
        </p>
        <h1 className="mt-2 text-5xl text-tinte-900">
          Hier wird noch renoviert
        </h1>
        <p className="mx-auto mt-6 max-w-md leading-relaxed text-tinte-700">
          Zwischen Kisten, Staubtüchern und einer Leiter entsteht hier in
          aller Ruhe etwas Neues. Schauen Sie bald wieder vorbei – der
          Farbeimer steht schon bereit.
        </p>
        {raum ? (
          <div className="mx-auto mt-10 max-w-md overflow-hidden rounded-2xl border border-creme-300/70 shadow-karte">
            <HausStandbild
              p="dachboden-detail"
              ausschnitt={raum.ausschnitt}
              className="w-full"
              beschreibung="Illustration des Dachbodens: Kisten, eine Leiter und ein abgedeckter Sessel unter dem Mansarddach"
            />
          </div>
        ) : null}
        <p className="mt-10 text-xs text-tinte-600">
          Ideen für diesen Raum? Erzählen Sie sie beim nächsten
          Familienessen.
        </p>
      </div>
    </RaumSeite>
  );
}
