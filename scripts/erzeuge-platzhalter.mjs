#!/usr/bin/env node
/**
 * Erzeugt sieben neutrale, hochwertig wirkende Platzhalterbilder für die
 * Garage-Galerie: flächige, abstrakte Auto- und Werkstatt-Motive aus
 * einfachen SVG-Formen in der Farbpalette der Website.
 *
 * Ausgabe: public/galerie/platzhalter-01.webp … platzhalter-07.webp
 * Aufruf:  npm run bilder:platzhalter
 *
 * Die Bilder sind bewusst als Platzhalter erkennbar (kleiner Schriftzug
 * in der Ecke) und werden später über die Import-Pipeline
 * (scripts/importiere-bilder.mjs) durch echte Aufnahmen ersetzt.
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const projektWurzel = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const zielOrdner = path.join(projektWurzel, "public", "galerie");

/** Farb-Tokens der Website (siehe globals.css) – für Inline-SVG als Hex. */
const F = {
  creme50: "#fdfbf5",
  creme100: "#faf6ec",
  creme200: "#f3ecdc",
  creme300: "#e9dfc8",
  creme400: "#d9cba9",
  tinte950: "#171d24",
  tinte900: "#1e2630",
  tinte800: "#28323e",
  tinte700: "#364350",
  tinte600: "#475767",
  schiefer400: "#7d8fa3",
  schiefer500: "#5c7085",
  schiefer600: "#47586a",
  schiefer700: "#394857",
  messing300: "#d6bf8d",
  messing400: "#c2a565",
  messing500: "#a98a4e",
  messing600: "#8a6f3c",
  garten500: "#64784f",
  garten600: "#4c5d3c",
  holz500: "#7a5c42",
  holz600: "#5f4732",
  holz700: "#4a3726",
  apfel500: "#a85b4b",
  terrakotta500: "#a8695a",
};

/** Dezenter „Platzhalter“-Schriftzug unten rechts (auf dunklem Grund). */
function schriftzug(breite, hoehe) {
  return `<text x="${breite - 36}" y="${hoehe - 32}" text-anchor="end"
    font-family="ui-sans-serif, system-ui, 'DejaVu Sans', sans-serif"
    font-size="24" letter-spacing="3.5"
    fill="${F.creme200}" fill-opacity="0.42">Platzhalter</text>`;
}

/** Hülle: komplettes SVG-Dokument mit fester Pixelgröße. */
function dokument(breite, hoehe, inhalt) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${breite}" height="${hoehe}" viewBox="0 0 ${breite} ${hoehe}">
    ${inhalt}
    ${schriftzug(breite, hoehe)}
  </svg>`;
}

/* ---------------------------------------------------------------------- */
/* Motiv 1 – „Abendrunde“: Coupé-Silhouette vor tiefstehender Sonne (3:2) */
/* ---------------------------------------------------------------------- */
function motivCoupe() {
  const b = 1600;
  const h = 1067;
  const inhalt = `
    <defs>
      <linearGradient id="himmel1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${F.schiefer500}"/>
        <stop offset="1" stop-color="${F.schiefer700}"/>
      </linearGradient>
    </defs>
    <rect width="${b}" height="${h}" fill="url(#himmel1)"/>
    <!-- Abendsonne mit weichem Hof -->
    <circle cx="1210" cy="330" r="215" fill="${F.creme100}" opacity="0.13"/>
    <circle cx="1210" cy="330" r="122" fill="${F.creme100}" opacity="0.92"/>
    <!-- Fahrbahn -->
    <rect y="820" width="${b}" height="${h - 820}" fill="${F.tinte950}" opacity="0.82"/>
    <!-- Karosserie eines klassischen Coupés -->
    <path d="M280 822 L280 756 Q292 706 396 694 L540 682 Q622 566 800 558
             L964 558 Q1092 570 1150 680 L1268 694 Q1318 706 1320 760
             L1320 822 Z" fill="${F.tinte950}"/>
    <!-- Fensterband -->
    <path d="M640 676 Q702 592 800 588 L940 588 Q1028 598 1072 668 Z"
      fill="${F.creme200}" opacity="0.16"/>
    <!-- Zierlinie in Messing -->
    <path d="M330 708 H1252" stroke="${F.messing400}" stroke-width="5"
      stroke-linecap="round" opacity="0.85"/>
    <!-- Räder -->
    <g>
      <circle cx="540" cy="822" r="92" fill="${F.tinte950}"/>
      <circle cx="540" cy="822" r="44" fill="none" stroke="${F.creme300}" stroke-width="10" opacity="0.85"/>
      <circle cx="540" cy="822" r="13" fill="${F.messing400}"/>
      <circle cx="1080" cy="822" r="92" fill="${F.tinte950}"/>
      <circle cx="1080" cy="822" r="44" fill="none" stroke="${F.creme300}" stroke-width="10" opacity="0.85"/>
      <circle cx="1080" cy="822" r="13" fill="${F.messing400}"/>
    </g>`;
  return { breite: b, hoehe: h, svg: dokument(b, h, inhalt) };
}

/* ------------------------------------------------------------------ */
/* Motiv 2 – „Werkbank-Stillleben“: Lochwand, Werkzeug und Kanne (4:3) */
/* ------------------------------------------------------------------ */
function motivWerkbank() {
  const b = 1600;
  const h = 1200;
  // Lochwand-Punkte als Raster erzeugen
  let punkte = "";
  for (let x = 260; x <= 1340; x += 80) {
    for (let y = 200; y <= 600; y += 80) {
      punkte += `<circle cx="${x}" cy="${y}" r="5" fill="${F.tinte600}" opacity="0.55"/>`;
    }
  }
  const inhalt = `
    <rect width="${b}" height="${h}" fill="${F.tinte900}"/>
    <!-- Lochwand -->
    <rect x="180" y="130" width="1240" height="520" rx="28" fill="${F.schiefer700}"/>
    ${punkte}
    <!-- Ringschlüssel -->
    <g>
      <circle cx="420" cy="252" r="46" fill="none" stroke="${F.creme200}" stroke-width="20"/>
      <rect x="406" y="300" width="28" height="252" rx="14" fill="${F.creme200}"/>
      <circle cx="420" cy="588" r="40" fill="none" stroke="${F.creme200}" stroke-width="18"/>
    </g>
    <!-- Schraubendreher -->
    <g>
      <rect x="676" y="216" width="48" height="142" rx="22" fill="${F.messing400}"/>
      <rect x="676" y="252" width="48" height="10" fill="${F.messing600}" opacity="0.7"/>
      <rect x="676" y="292" width="48" height="10" fill="${F.messing600}" opacity="0.7"/>
      <rect x="692" y="358" width="16" height="228" fill="${F.schiefer400}"/>
    </g>
    <!-- Hammer -->
    <g>
      <rect x="890" y="238" width="122" height="56" rx="10" fill="${F.schiefer400}"/>
      <rect x="936" y="294" width="28" height="278" rx="14" fill="${F.holz500}"/>
    </g>
    <!-- Maulschlüssel (angedeutet) -->
    <g>
      <circle cx="1180" cy="258" r="44" fill="none" stroke="${F.messing300}" stroke-width="20"/>
      <rect x="1158" y="192" width="44" height="42" fill="${F.schiefer700}"/>
      <rect x="1166" y="300" width="28" height="262" rx="14" fill="${F.messing300}"/>
    </g>
    <!-- Werkbankplatte und Beine -->
    <rect x="0" y="780" width="${b}" height="70" fill="${F.holz600}"/>
    <rect x="0" y="836" width="${b}" height="14" fill="${F.holz700}"/>
    <rect x="150" y="850" width="54" height="350" fill="${F.holz700}"/>
    <rect x="1396" y="850" width="54" height="350" fill="${F.holz700}"/>
    <!-- Blechdose -->
    <ellipse cx="525" cy="782" rx="76" ry="10" fill="${F.tinte950}" opacity="0.35"/>
    <rect x="470" y="678" width="110" height="102" rx="10" fill="${F.creme300}"/>
    <rect x="486" y="704" width="78" height="50" rx="6" fill="${F.tinte800}" opacity="0.14"/>
    <!-- Ölkanne -->
    <ellipse cx="1112" cy="782" rx="86" ry="10" fill="${F.tinte950}" opacity="0.35"/>
    <path d="M1040 780 L1180 780 L1160 668 L1060 668 Z" fill="${F.messing500}"/>
    <circle cx="1110" cy="662" r="18" fill="${F.messing600}"/>
    <path d="M1160 700 L1252 638" stroke="${F.messing500}" stroke-width="16" stroke-linecap="round"/>`;
  return { breite: b, hoehe: h, svg: dokument(b, h, inhalt) };
}

/* -------------------------------------------------------------------- */
/* Motiv 3 – „Landstraße“: Straße durch Hügel, kleines Auto fern (16:9) */
/* -------------------------------------------------------------------- */
function motivLandstrasse() {
  const b = 1600;
  const h = 900;
  const inhalt = `
    <defs>
      <linearGradient id="himmel3" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${F.schiefer500}"/>
        <stop offset="0.75" stop-color="${F.schiefer400}"/>
        <stop offset="1" stop-color="${F.creme300}"/>
      </linearGradient>
    </defs>
    <rect width="${b}" height="540" fill="url(#himmel3)"/>
    <!-- Sonne am Horizont -->
    <circle cx="600" cy="470" r="150" fill="${F.creme100}" opacity="0.16"/>
    <circle cx="600" cy="470" r="86" fill="${F.creme100}" opacity="0.9"/>
    <!-- Hügelketten -->
    <path d="M0 540 Q260 420 560 500 T1080 480 Q1360 440 1600 520 L1600 540 Z"
      fill="${F.garten500}"/>
    <path d="M0 900 L0 560 Q300 480 700 545 T1600 540 L1600 900 Z"
      fill="${F.garten600}"/>
    <!-- Straße -->
    <path d="M430 900 L845 545 L895 545 L1170 900 Z" fill="${F.tinte800}"/>
    <!-- Mittelstreifen -->
    <path d="M862 590 L874 590 L872 620 L861 620 Z" fill="${F.creme200}" opacity="0.9"/>
    <path d="M852 665 L870 665 L866 715 L845 715 Z" fill="${F.creme200}" opacity="0.9"/>
    <path d="M832 775 L860 775 L852 850 L818 850 Z" fill="${F.creme200}" opacity="0.9"/>
    <!-- Kleines Auto in der Ferne -->
    <g>
      <path d="M842 668 Q844 656 856 654 L864 646 Q870 640 882 640 L896 640
               Q906 640 910 648 L916 654 Q926 657 927 668 L927 676 L842 676 Z"
        fill="${F.tinte950}"/>
      <circle cx="858" cy="676" r="8" fill="${F.tinte950}"/>
      <circle cx="912" cy="676" r="8" fill="${F.tinte950}"/>
    </g>`;
  return { breite: b, hoehe: h, svg: dokument(b, h, inhalt) };
}

/* ------------------------------------------------------------------- */
/* Motiv 4 – „Rundinstrument“: großes Zifferblatt mit Zeiger (1:1)     */
/* ------------------------------------------------------------------- */
function motivArmaturen() {
  const b = 1600;
  const h = 1600;
  const cx = 800;
  const cy = 760;
  // Skalenstriche des großen Instruments: Bogen von 220° bis -40° (Uhrzeigersinn)
  let striche = "";
  const gesamt = 12;
  for (let i = 0; i <= gesamt; i += 1) {
    const winkel = ((220 - (260 / gesamt) * i) * Math.PI) / 180;
    const gross = i % 3 === 0;
    const r1 = 372;
    const r2 = gross ? 322 : 344;
    const x1 = cx + Math.cos(winkel) * r1;
    const y1 = cy - Math.sin(winkel) * r1;
    const x2 = cx + Math.cos(winkel) * r2;
    const y2 = cy - Math.sin(winkel) * r2;
    const farbe = i >= 11 ? F.apfel500 : F.creme200;
    striche += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"
      stroke="${farbe}" stroke-width="${gross ? 10 : 5}" stroke-linecap="round"/>`;
  }
  const inhalt = `
    <rect width="${b}" height="${h}" fill="${F.tinte950}"/>
    <circle cx="${cx}" cy="${cy}" r="560" fill="${F.tinte900}" opacity="0.55"/>
    <!-- Großes Instrument -->
    <circle cx="${cx}" cy="${cy}" r="430" fill="${F.tinte900}"
      stroke="${F.messing400}" stroke-width="14"/>
    <circle cx="${cx}" cy="${cy}" r="398" fill="none"
      stroke="${F.tinte700}" stroke-width="3"/>
    ${striche}
    <!-- Zeiger -->
    <g transform="rotate(52 ${cx} ${cy})">
      <rect x="${cx - 9}" y="${cy - 356}" width="18" height="380" rx="9" fill="${F.messing400}"/>
    </g>
    <circle cx="${cx}" cy="${cy}" r="36" fill="${F.creme300}"/>
    <circle cx="${cx}" cy="${cy}" r="13" fill="${F.messing600}"/>
    <!-- Zwei Nebeninstrumente -->
    <g>
      <circle cx="430" cy="1300" r="148" fill="${F.tinte900}" stroke="${F.schiefer500}" stroke-width="8"/>
      <line x1="430" y1="1300" x2="342" y2="1224" stroke="${F.schiefer400}" stroke-width="10" stroke-linecap="round"/>
      <circle cx="430" cy="1300" r="14" fill="${F.creme300}"/>
    </g>
    <g>
      <circle cx="1170" cy="1300" r="148" fill="${F.tinte900}" stroke="${F.schiefer500}" stroke-width="8"/>
      <line x1="1170" y1="1300" x2="1252" y2="1216" stroke="${F.schiefer400}" stroke-width="10" stroke-linecap="round"/>
      <circle cx="1170" cy="1300" r="14" fill="${F.creme300}"/>
    </g>`;
  return { breite: b, hoehe: h, svg: dokument(b, h, inhalt) };
}

/* -------------------------------------------------------------------- */
/* Motiv 5 – „Werkzeugwand“: hängendes Werkzeug, Hochformat (2:3)       */
/* -------------------------------------------------------------------- */
function motivWerkzeugwand() {
  const b = 1067;
  const h = 1600;
  const inhalt = `
    <defs>
      <linearGradient id="wand5" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${F.tinte800}"/>
        <stop offset="1" stop-color="${F.tinte950}"/>
      </linearGradient>
    </defs>
    <rect width="${b}" height="${h}" fill="url(#wand5)"/>
    <!-- Holzleiste mit Messinghaken -->
    <rect x="110" y="206" width="847" height="28" rx="14" fill="${F.holz600}"/>
    <circle cx="280" cy="220" r="12" fill="${F.messing400}"/>
    <circle cx="560" cy="220" r="12" fill="${F.messing400}"/>
    <circle cx="840" cy="220" r="12" fill="${F.messing400}"/>
    <!-- Ringschlüssel -->
    <g>
      <circle cx="280" cy="322" r="52" fill="none" stroke="${F.creme200}" stroke-width="22"/>
      <rect x="266" y="376" width="28" height="416" rx="14" fill="${F.creme200}"/>
      <circle cx="280" cy="838" r="44" fill="none" stroke="${F.creme200}" stroke-width="18"/>
    </g>
    <!-- Schraubendreher -->
    <g>
      <rect x="532" y="278" width="56" height="172" rx="24" fill="${F.messing400}"/>
      <rect x="532" y="322" width="56" height="12" fill="${F.messing600}" opacity="0.7"/>
      <rect x="532" y="366" width="56" height="12" fill="${F.messing600}" opacity="0.7"/>
      <rect x="550" y="450" width="20" height="330" fill="${F.schiefer400}"/>
    </g>
    <!-- Hammer -->
    <g>
      <rect x="770" y="268" width="140" height="62" rx="10" fill="${F.schiefer400}"/>
      <rect x="826" y="330" width="28" height="404" rx="14" fill="${F.holz500}"/>
    </g>
    <!-- Ablagebord mit Flasche und Dose -->
    <rect x="110" y="1178" width="847" height="26" rx="8" fill="${F.holz600}"/>
    <ellipse cx="665" cy="1180" rx="66" ry="9" fill="${F.tinte950}" opacity="0.4"/>
    <rect x="620" y="1048" width="90" height="132" rx="12" fill="${F.terrakotta500}"/>
    <rect x="644" y="1018" width="42" height="36" rx="8" fill="${F.messing400}"/>
    <ellipse cx="355" cy="1180" rx="76" ry="9" fill="${F.tinte950}" opacity="0.4"/>
    <rect x="300" y="1074" width="110" height="106" rx="10" fill="${F.creme300}"/>
    <rect x="318" y="1102" width="74" height="46" rx="6" fill="${F.tinte800}" opacity="0.14"/>`;
  return { breite: b, hoehe: h, svg: dokument(b, h, inhalt) };
}

/* ------------------------------------------------------------------ */
/* Motiv 6 – „Vor dem Tor“: Garagentor mit Lichtspalt (16:9)          */
/* ------------------------------------------------------------------ */
function motivGaragentor() {
  const b = 1600;
  const h = 900;
  // Acht Lamellen des Schwingtors
  let lamellen = "";
  for (let i = 0; i < 8; i += 1) {
    const y = 122 + i * 84;
    const farbe = i % 2 === 0 ? F.schiefer500 : F.schiefer600;
    lamellen += `<rect x="202" y="${y}" width="1196" height="78" rx="6" fill="${farbe}"/>`;
  }
  const inhalt = `
    <rect width="${b}" height="${h}" fill="${F.schiefer700}"/>
    <!-- Laterne über dem Tor -->
    <circle cx="800" cy="52" r="24" fill="${F.messing300}"/>
    <path d="M800 60 L520 800 L1080 800 Z" fill="${F.creme100}" opacity="0.06"/>
    <!-- Torrahmen und Lamellen -->
    <rect x="168" y="88" width="1264" height="744" rx="18" fill="${F.tinte900}"/>
    ${lamellen}
    <!-- Torgriff -->
    <rect x="756" y="690" width="88" height="18" rx="9" fill="${F.messing500}"/>
    <circle cx="800" cy="699" r="27" fill="${F.messing400}"/>
    <circle cx="800" cy="699" r="9" fill="${F.tinte900}"/>
    <!-- Lichtspalt unter dem Tor -->
    <rect x="202" y="788" width="1196" height="30" fill="${F.creme100}" opacity="0.22"/>
    <rect x="202" y="800" width="1196" height="13" fill="${F.creme100}" opacity="0.95"/>
    <!-- Boden -->
    <rect y="832" width="${b}" height="${h - 832}" fill="${F.tinte950}"/>`;
  return { breite: b, hoehe: h, svg: dokument(b, h, inhalt) };
}

/* ----------------------------------------------------------------------- */
/* Motiv 7 – „Im Scheinwerferlicht“: Kotflügelbogen mit Scheinwerfer (4:3) */
/* ----------------------------------------------------------------------- */
function motivScheinwerfer() {
  const b = 1600;
  const h = 1200;
  const inhalt = `
    <defs>
      <linearGradient id="grund7" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${F.tinte900}"/>
        <stop offset="1" stop-color="${F.tinte950}"/>
      </linearGradient>
    </defs>
    <rect width="${b}" height="${h}" fill="url(#grund7)"/>
    <!-- Lichtkegel -->
    <path d="M1150 620 L40 380 L40 760 Z" fill="${F.creme100}" opacity="0.05"/>
    <path d="M1150 620 L200 500 L200 700 Z" fill="${F.creme100}" opacity="0.05"/>
    <!-- Kotflügel als großer Bogen -->
    <circle cx="1750" cy="1500" r="1150" fill="${F.tinte800}"/>
    <circle cx="1750" cy="1500" r="1150" fill="none" stroke="${F.schiefer400}" stroke-width="8" opacity="0.55"/>
    <circle cx="1750" cy="1500" r="1090" fill="none" stroke="${F.messing400}" stroke-width="4" opacity="0.4"/>
    <!-- Scheinwerfer -->
    <circle cx="1150" cy="620" r="212" fill="none" stroke="${F.messing300}" stroke-width="22"/>
    <circle cx="1150" cy="620" r="190" fill="${F.creme100}"/>
    <circle cx="1150" cy="620" r="96" fill="${F.creme50}"/>
    <circle cx="1094" cy="560" r="30" fill="${F.creme50}" opacity="0.9"/>
    <!-- Chrom-Reflexe -->
    <path d="M880 980 Q1060 900 1180 920" stroke="${F.creme200}" stroke-width="7"
      stroke-linecap="round" fill="none" opacity="0.35"/>
    <path d="M960 1080 Q1140 1010 1300 1050" stroke="${F.schiefer400}" stroke-width="6"
      stroke-linecap="round" fill="none" opacity="0.5"/>`;
  return { breite: b, hoehe: h, svg: dokument(b, h, inhalt) };
}

/* ---------------------------------------------------------------------- */

const motive = [
  motivCoupe,
  motivWerkbank,
  motivLandstrasse,
  motivArmaturen,
  motivWerkzeugwand,
  motivGaragentor,
  motivScheinwerfer,
];

async function hauptprogramm() {
  await mkdir(zielOrdner, { recursive: true });

  for (let i = 0; i < motive.length; i += 1) {
    const { breite, hoehe, svg } = motive[i]();
    const dateiname = `platzhalter-${String(i + 1).padStart(2, "0")}.webp`;
    const zielPfad = path.join(zielOrdner, dateiname);
    const info = await sharp(Buffer.from(svg))
      .webp({ quality: 84 })
      .toFile(zielPfad);
    console.log(
      `✓ ${dateiname}  ${info.width}×${info.height}px  (erwartet ${breite}×${hoehe})`,
    );
  }

  console.log(`\nFertig – ${motive.length} Platzhalterbilder in public/galerie/.`);
}

hauptprogramm().catch((fehler) => {
  console.error("Fehler beim Erzeugen der Platzhalterbilder:", fehler);
  process.exitCode = 1;
});
