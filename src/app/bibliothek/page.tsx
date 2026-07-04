import type { Metadata } from "next";
import { RaumSeite } from "@/components/layout/RaumSeite";
import { BibliothekScrolly } from "@/components/bibliothek/BibliothekScrolly";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Bibliothek – Die Geschichte eines Namens",
  description:
    `Die Geschichte des Namens ${siteConfig.familienname} als Zeitreise: ` +
    `von den Hugenotten in Frankreich über die Flucht von 1685 bis zum ` +
    `Neuanfang in Deutschland – mit Fluchtkarte und Zeitleiste.`,
};

/**
 * Die Bibliothek: Scrollytelling-Seite über die Hugenotten und die
 * Geschichte des Familiennamens. Inhalte in `src/content/bibliothek.ts`,
 * interaktive Darstellung in `src/components/bibliothek/`.
 */
export default function BibliothekSeite() {
  return (
    <RaumSeite raumId="bibliothek">
      <BibliothekScrolly />
    </RaumSeite>
  );
}
