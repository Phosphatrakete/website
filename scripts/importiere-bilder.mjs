#!/usr/bin/env node
/**
 * Privatsphäre-Pipeline für die Garage-Galerie.
 *
 * Liest alle Bilder aus dem Ordner `_eingang/` (Projektwurzel) und
 *   1. entfernt SÄMTLICHE Metadaten (EXIF, GPS, IPTC, XMP) – sharp lässt
 *      Metadaten beim Re-Encoding standardmäßig weg; `.withMetadata()`
 *      wird hier deshalb bewusst NICHT verwendet,
 *   2. wendet vorab `.rotate()` an, damit die EXIF-Orientierung erhalten
 *      bleibt, obwohl das Orientierungs-Tag anschließend fehlt,
 *   3. skaliert auf maximal 2400 px lange Kante (ohne Vergrößerung),
 *   4. speichert als WebP (Qualität 84) unter `public/galerie/<slug>.webp`,
 *   5. gibt pro Bild die Maße und einen fertigen Snippet-Block für
 *      `src/content/garage.ts` aus.
 *
 * Aufruf: npm run bilder:import
 *
 * Der Ordner `_eingang/` gehört NICHT ins Repository (enthält
 * Original-Aufnahmen samt Metadaten) – siehe README/.gitignore.
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir, readdir, stat, access } from "node:fs/promises";
import sharp from "sharp";

const projektWurzel = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const eingangsOrdner = path.join(projektWurzel, "_eingang");
const zielOrdner = path.join(projektWurzel, "public", "galerie");

/** Lange Kante des Zielbilds in Pixeln. */
const MAX_KANTE = 2400;
/** WebP-Qualität. */
const QUALITAET = 84;
/** Dateiendungen, die die Pipeline annimmt (sofern sharp sie lesen kann). */
const ENDUNGEN = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".heic",
  ".heif",
  ".avif",
  ".tif",
  ".tiff",
]);

/** Dateinamen in einen URL-tauglichen Slug verwandeln (ohne Umlaute). */
function zuSlug(dateiname) {
  const basis = path.parse(dateiname).name;
  return (
    basis
      .toLowerCase()
      .replaceAll("ä", "ae")
      .replaceAll("ö", "oe")
      .replaceAll("ü", "ue")
      .replaceAll("ß", "ss")
      .normalize("NFKD")
      // diakritische Zeichen (é → e usw.) entfernen
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "bild"
  );
}

/** Existiert der Pfad bereits? */
async function existiert(pfad) {
  try {
    await access(pfad);
    return true;
  } catch {
    return false;
  }
}

/** Freien Zielpfad finden (slug.webp, slug-2.webp, …). */
async function freierZielpfad(slug) {
  let kandidat = path.join(zielOrdner, `${slug}.webp`);
  let laufnummer = 2;
  while (await existiert(kandidat)) {
    kandidat = path.join(zielOrdner, `${slug}-${laufnummer}.webp`);
    laufnummer += 1;
  }
  return kandidat;
}

/** Snippet-Block für src/content/garage.ts erzeugen. */
function snippet(slug, breite, hoehe) {
  return `  {
    id: "${slug}",
    typ: "bild",
    quelle: "/galerie/${slug}.webp",
    alt: "TODO: Beschreiben, was zu sehen ist (ohne Personen, Orte, Kennzeichen)",
    titel: "TODO: Kurzer Titel",
    geschichte: "TODO: 1–2 Sätze – Geschichten statt Personen (oder Zeile entfernen)",
    breite: ${breite},
    hoehe: ${hoehe},
  },`;
}

async function hauptprogramm() {
  // 1. Eingangsordner prüfen (fehlt er, anlegen und verständlich abbrechen).
  if (!(await existiert(eingangsOrdner))) {
    await mkdir(eingangsOrdner, { recursive: true });
    console.error(
      [
        "Der Ordner _eingang/ existierte noch nicht – er wurde soeben angelegt.",
        "",
        "So funktioniert der Import:",
        "  1. Zu veröffentlichende Bilder nach _eingang/ kopieren",
        "     (jpg, jpeg, png, webp, heic/heif, avif, tif).",
        "  2. Erneut ausführen: npm run bilder:import",
        "",
        "Hinweis: _eingang/ enthält Originale mit Metadaten und gehört",
        "nicht ins Repository (siehe README/.gitignore).",
      ].join("\n"),
    );
    process.exitCode = 1;
    return;
  }

  const alleEintraege = await readdir(eingangsOrdner);
  const bildDateien = [];
  for (const name of alleEintraege) {
    if (name.startsWith(".")) continue; // versteckte Dateien (.gitkeep, .DS_Store)
    const pfad = path.join(eingangsOrdner, name);
    const status = await stat(pfad);
    if (!status.isFile()) continue;
    if (ENDUNGEN.has(path.extname(name).toLowerCase())) {
      bildDateien.push(name);
    }
  }
  bildDateien.sort((a, b) => a.localeCompare(b, "de"));

  if (bildDateien.length === 0) {
    console.error(
      [
        "In _eingang/ liegen keine importierbaren Bilder.",
        "",
        `Unterstützte Endungen: ${[...ENDUNGEN].join(", ")}`,
        "Bilder hineinkopieren und erneut ausführen: npm run bilder:import",
      ].join("\n"),
    );
    process.exitCode = 1;
    return;
  }

  await mkdir(zielOrdner, { recursive: true });

  console.log(
    `${bildDateien.length} Bild(er) in _eingang/ gefunden – starte Import …\n`,
  );

  const snippets = [];
  const fehler = [];

  for (const dateiname of bildDateien) {
    const quellPfad = path.join(eingangsOrdner, dateiname);
    const slug = zuSlug(dateiname);
    try {
      const zielPfad = await freierZielpfad(slug);
      const endgueltigerSlug = path.parse(zielPfad).name;

      // .rotate() ohne Argument dreht anhand des EXIF-Orientierungs-Tags,
      // BEVOR die Metadaten beim Re-Encoding verworfen werden.
      // KEIN .withMetadata(): so bleiben EXIF/GPS/IPTC/XMP außen vor.
      const info = await sharp(quellPfad)
        .rotate()
        .resize({
          width: MAX_KANTE,
          height: MAX_KANTE,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: QUALITAET })
        .toFile(zielPfad);

      console.log(
        `✓ ${dateiname} → public/galerie/${endgueltigerSlug}.webp  (${info.width}×${info.height}px, ohne Metadaten)`,
      );
      snippets.push(snippet(endgueltigerSlug, info.width, info.height));
    } catch (grund) {
      const meldung = grund instanceof Error ? grund.message : String(grund);
      console.error(`✗ ${dateiname} konnte nicht verarbeitet werden: ${meldung}`);
      if (/heif|heic/i.test(path.extname(dateiname))) {
        console.error(
          "  (HEIC/HEIF benötigt eine sharp-Installation mit libheif –",
          "notfalls das Bild vorher als JPEG exportieren.)",
        );
      }
      fehler.push(dateiname);
    }
  }

  if (snippets.length > 0) {
    console.log(
      [
        "",
        "────────────────────────────────────────────────────────────",
        "Snippets für src/content/garage.ts",
        "(in das Array `galerieEintraege` einfügen, TODO-Texte ersetzen):",
        "────────────────────────────────────────────────────────────",
        "",
        ...snippets,
      ].join("\n"),
    );
  }

  console.log(
    [
      "",
      "════════════════════════════════════════════════════════════",
      "Checkliste vor dem Veröffentlichen – jedes Bild einzeln prüfen:",
      "  [ ] Keine Kennzeichen lesbar (auch teilweise oder unscharf).",
      "  [ ] Keine Gesichter – auch nicht als Spiegelung in Lack,",
      "      Scheiben oder Chrom!",
      "  [ ] Keine erkennbaren Orte, Straßenschilder oder Hausnummern.",
      "  [ ] Dateiname/Slug ohne Personen- oder Ortsbezug.",
      "  [ ] alt/titel/geschichte in garage.ts ausgefüllt –",
      "      Geschichten statt Personen.",
      "════════════════════════════════════════════════════════════",
    ].join("\n"),
  );

  if (fehler.length > 0) {
    console.error(
      `\n${fehler.length} Datei(en) mit Fehlern: ${fehler.join(", ")}`,
    );
    process.exitCode = 1;
  } else {
    console.log(
      `\nFertig – ${snippets.length} Bild(er) importiert. Die Originale in _eingang/ können danach gelöscht werden.`,
    );
  }
}

hauptprogramm().catch((grund) => {
  console.error("Unerwarteter Fehler beim Import:", grund);
  process.exitCode = 1;
});
