/**
 * Inhalte der Bibliothek – „Die Geschichte eines Namens“.
 *
 * Alle Kapitel der Scrollytelling-Seite werden hier als Daten gepflegt.
 * WICHTIG: Absätze mit `todo: true` enthalten historische bzw.
 * familienspezifische Angaben, die noch geprüft oder ergänzt werden müssen –
 * die Seite markiert sie sichtbar mit einem <TodoHinweis>. Vor dem Livegang
 * alle Platzhalter durch geprüfte Inhalte ersetzen.
 */

import { siteConfig } from "@/config/site";

/** Zeitlicher Rahmen der begleitenden Zeitleiste (ca. 1550–1750). */
export const ZEITLEISTE_BEREICH = { start: 1550, ende: 1750 } as const;

export interface KapitelAbsatz {
  /** Fließtext des Absatzes. */
  text: string;
  /** true = Absatz enthält zu prüfende/zu ergänzende Angaben (Platzhalter). */
  todo: boolean;
}

export interface BibliothekKapitel {
  /** Eindeutige, URL-taugliche Kennung (Basis der Anker-IDs). */
  id: string;
  /** Laufende Kapitelnummer (1-basiert), wird römisch dargestellt. */
  nummer: number;
  /** Kapitelüberschrift. */
  titel: string;
  /**
   * Jahresspanne für die Zeitleiste. `von`/`bis` beschreiben die zeitliche
   * Einordnung, `label` ist die angezeigte Kurzform am Marker.
   */
  jahrSpanne: { von: number; bis: number; label: string };
  /** Absätze des Kapitels in Lesereihenfolge. */
  absaetze: readonly KapitelAbsatz[];
}

/** Einleitungstext unter dem Seitentitel. */
export const bibliothekEinleitung =
  `Jede Familie trägt ein Stück Geschichte in ihrem Namen – die Familie ` +
  `${siteConfig.familienname} ein besonders weit gereistes. Diese Seite lädt ` +
  `Sie zu einer Zeitreise ein: von Frankreich im 16. Jahrhundert über die ` +
  `große Flucht der Hugenotten bis in das Deutschland von heute. Lesen Sie ` +
  `die Kapitel in Ruhe – die Karte an Ihrer Seite zeichnet den Weg Schritt ` +
  `für Schritt nach.`;

export const bibliothekKapitel: readonly BibliothekKapitel[] = [
  {
    id: "herkunft-des-namens",
    nummer: 1,
    titel: "Der Name und seine französische Herkunft",
    jahrSpanne: { von: 1550, bis: 1560, label: "Ursprünge" },
    absaetze: [
      {
        text:
          `Am Anfang steht ein Klang: ${siteConfig.familienname}. Ein Name, ` +
          `der sich von seinen Nachbarn im Adressbuch unterscheidet – weicher ` +
          `am Ende, französisch im Ursprung. Wer ihn trägt, wird immer wieder ` +
          `nach seiner Herkunft gefragt. Diese Seiten versuchen eine Antwort ` +
          `und erzählen, wie ein französischer Name in Deutschland zu Hause ` +
          `wurde.`,
        todo: false,
      },
      {
        text:
          `Über die genaue Etymologie des Namens – seine ursprüngliche ` +
          `Bedeutung, die Region, in der er zuerst belegt ist, und die ` +
          `Schreibweisen, die er im Lauf der Jahrhunderte angenommen hat – ` +
          `wird an dieser Stelle die Familienforschung Auskunft geben. ` +
          `[Platzhalter: Herleitung, älteste Schreibformen und ` +
          `Namensvarianten ergänzen.]`,
        todo: true,
      },
      {
        text:
          `Auch die Frage, ob die Endung „-eaux“ auf eine Landschaft, ein ` +
          `altes Wort oder einen Beruf zurückgeht, ist noch zu klären. ` +
          `[Platzhalter: sprachgeschichtliche Einordnung durch eine ` +
          `verlässliche Quelle belegen.]`,
        todo: true,
      },
    ],
  },
  {
    id: "reformation-und-verfolgung",
    nummer: 2,
    titel: "Frankreich im 16. und 17. Jahrhundert",
    jahrSpanne: { von: 1550, bis: 1685, label: "16.–17. Jh." },
    absaetze: [
      {
        text:
          `Im 16. Jahrhundert erreichte die Reformation Frankreich. Die ` +
          `Anhängerinnen und Anhänger der Lehre Johannes Calvins – bald ` +
          `„Hugenotten“ genannt – bildeten wachsende Gemeinden in vielen ` +
          `Landesteilen, vom Handwerk in den Städten bis zu Teilen des ` +
          `Adels. [Platzhalter: historische Darstellung prüfen und mit ` +
          `Quellen belegen.]`,
        todo: true,
      },
      {
        text:
          `Auf die Ausbreitung des neuen Glaubens folgten Jahrzehnte der ` +
          `Bedrängnis: Religionskriege, Gewalt wie in der Bartholomäusnacht ` +
          `des Jahres 1572 und ein ständiges Ringen um Duldung. Das Edikt ` +
          `von Nantes von 1598 sicherte den Protestanten schließlich eine ` +
          `begrenzte Glaubensfreiheit zu – ein zerbrechlicher Frieden, der ` +
          `Schritt für Schritt wieder ausgehöhlt wurde. [Platzhalter: ` +
          `Daten und Zusammenhänge prüfen.]`,
        todo: true,
      },
      {
        text:
          `Wie es sich anfühlt, im eigenen Land nach und nach zum Fremden ` +
          `erklärt zu werden, lässt sich aus Akten und Erlassen nur erahnen. ` +
          `Für viele Familien wurde in diesen Jahrzehnten aus einer Frage ` +
          `des Glaubens eine Frage der Zukunft – und irgendwann eine Frage ` +
          `des Aufbruchs.`,
        todo: false,
      },
    ],
  },
  {
    id: "edikt-von-nantes",
    nummer: 3,
    titel: "1685: Die Aufhebung des Edikts von Nantes",
    jahrSpanne: { von: 1685, bis: 1685, label: "1685" },
    absaetze: [
      {
        text:
          `Im Oktober 1685 widerrief König Ludwig XIV. mit dem Edikt von ` +
          `Fontainebleau die Zusagen von Nantes. Der protestantische ` +
          `Gottesdienst wurde verboten, Kirchen wurden niedergelegt, Pfarrer ` +
          `des Landes verwiesen – der reformierte Glaube sollte aus ` +
          `Frankreich verschwinden. [Platzhalter: historische Darstellung ` +
          `prüfen und mit Quellen belegen.]`,
        todo: true,
      },
      {
        text:
          `Obwohl die Auswanderung bei Strafe verboten war, verließen in ` +
          `den folgenden Jahren schätzungsweise 150.000 bis 200.000 ` +
          `Hugenotten ihre Heimat – oft heimlich, nachts, auf verschlungenen ` +
          `Wegen. Ihre Ziele waren die Niederlande, England, die Schweiz und ` +
          `die protestantischen Territorien des Heiligen Römischen Reiches. ` +
          `Man nannte sie Réfugiés – Geflüchtete. [Platzhalter: Zahlen und ` +
          `Zielländer prüfen.]`,
        todo: true,
      },
      {
        text:
          `Wer ging, nahm mit, was sich tragen ließ: ein Bündel, ein ` +
          `Handwerk, ein Gebetbuch – und einen Namen. Vieles blieb zurück; ` +
          `der Name aber reiste mit und wurde zum stillen Gedächtnis der ` +
          `alten Heimat.`,
        todo: false,
      },
    ],
  },
  {
    id: "aufnahme-in-deutschland",
    nummer: 4,
    titel: "Die Aufnahme in Deutschland",
    jahrSpanne: { von: 1685, bis: 1700, label: "ab 1685" },
    absaetze: [
      {
        text:
          `Nur wenige Tage nach dem Widerruf lud Kurfürst Friedrich Wilhelm ` +
          `von Brandenburg die Verfolgten mit dem Edikt von Potsdam in seine ` +
          `Lande ein. Er versprach freie Religionsausübung, Steuerfreiheiten ` +
          `und Unterstützung beim Neuanfang – aus Not wurde für viele eine ` +
          `neue Heimat. [Platzhalter: Inhalt und Datierung des Edikts ` +
          `prüfen.]`,
        todo: true,
      },
      {
        text:
          `Zehntausende Réfugiés fanden in Brandenburg-Preußen Aufnahme; in ` +
          `Berlin entstand eine große französische Kolonie mit eigenen ` +
          `Kirchen, Schulen und Gerichten. Auch andere Territorien – etwa ` +
          `Hessen-Kassel, Franken oder die Kurpfalz – nahmen Glaubens` +
          `flüchtlinge auf und gründeten eigene Hugenottensiedlungen. ` +
          `[Platzhalter: Zahlen, Territorien und Einrichtungen prüfen.]`,
        todo: true,
      },
      {
        text:
          `Was als Zuflucht begann, wurde über Generationen zu ` +
          `Zugehörigkeit: Aus Gästen wurden Nachbarn, aus Réfugiés ` +
          `Bürgerinnen und Bürger – die ihre Sprache, ihre Berufe und ihre ` +
          `Namen in die neue Heimat einbrachten.`,
        todo: false,
      },
    ],
  },
  {
    id: "ankunft-der-familie",
    nummer: 5,
    titel: `Ankunft und Neuanfang der Familie ${siteConfig.familienname}`,
    jahrSpanne: { von: 1685, bis: 1750, label: "17./18. Jh." },
    absaetze: [
      {
        text:
          `Wann die ersten Träger des Namens ${siteConfig.familienname} ` +
          `deutschen Boden betraten, aus welcher Gegend Frankreichs sie ` +
          `kamen und wo sie zuerst sesshaft wurden – diese Angaben trägt ` +
          `die Familienforschung derzeit zusammen. [Platzhalter: ` +
          `Herkunftsregion, Reiseweg und ersten Wohnort ergänzen.]`,
        todo: true,
      },
      {
        text:
          `Ebenso offen sind die frühesten Spuren in den Archiven: die ` +
          `erste urkundliche Erwähnung, die Berufe der ersten Generationen, ` +
          `die Gemeinde, in der die Familie heimisch wurde. [Platzhalter: ` +
          `Quellen wie Kirchenbücher und Kolonielisten auswerten und hier ` +
          `ergänzen.]`,
        todo: true,
      },
      {
        text:
          `Sicher ist nur, was bis heute geblieben ist: ein französischer ` +
          `Name in deutscher Umgebung – und eine Geschichte, die mit jeder ` +
          `Generation weitererzählt wird. Genau dafür ist diese Bibliothek ` +
          `da.`,
        todo: false,
      },
    ],
  },
  {
    id: "spuren-heute",
    nummer: 6,
    titel: "Spuren der Hugenotten im heutigen Deutschland",
    jahrSpanne: { von: 1750, bis: 1750, label: "bis heute" },
    absaetze: [
      {
        text:
          `Die Réfugiés brachten mehr mit als ihre Namen: Wörter, die in ` +
          `die deutsche Alltagssprache eingingen, und Fertigkeiten wie ` +
          `Seiden- und Samtweberei, Hut- und Handschuhmacherei oder den ` +
          `Gemüsebau, die ganze Regionen prägten. [Platzhalter: Beispiele ` +
          `prüfen und mit Quellen belegen.]`,
        todo: true,
      },
      {
        text:
          `Sichtbar sind die Spuren bis heute: der Französische Dom am ` +
          `Berliner Gendarmenmarkt, planmäßig angelegte Hugenottenstädte ` +
          `wie Erlangen, französische Straßennamen, reformierte Gemeinden ` +
          `und Museen, die an die Einwanderung erinnern. [Platzhalter: ` +
          `Orte und Einrichtungen prüfen, ggf. um Bezüge der Familie ` +
          `ergänzen.]`,
        todo: true,
      },
      {
        text:
          `Und schließlich die vielleicht leiseste Spur: die französisch ` +
          `klingenden Familiennamen, die man überall in Deutschland trifft. ` +
          `Jeder von ihnen erzählt eine Geschichte von Aufbruch und ` +
          `Ankommen – so wie die, die Sie gerade gelesen haben.`,
        todo: false,
      },
    ],
  },
] as const;

/** Anker-ID der zugehörigen Kapitel-Section (für Links und Beobachter). */
export function kapitelAnkerId(kapitel: Pick<BibliothekKapitel, "id">): string {
  return `kapitel-${kapitel.id}`;
}

/** Wandelt eine Kapitelnummer in eine römische Ziffer um (1 → „I“). */
export function roemischeZiffer(nummer: number): string {
  const stufen: readonly [number, string][] = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let rest = Math.max(0, Math.floor(nummer));
  let ergebnis = "";
  for (const [wert, zeichen] of stufen) {
    while (rest >= wert) {
      ergebnis += zeichen;
      rest -= wert;
    }
  }
  return ergebnis;
}
