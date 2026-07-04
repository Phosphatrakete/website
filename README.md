# peteaux.de – Das Haus der Familie Peteaux

Eine private Familien-Website, inszeniert als **begehbares Haus**: Der Besucher
öffnet ein schmiedeeisernes Hoftor, sieht das Haus im Querschnitt und betritt
einzelne Räume – die **Bibliothek** (Geschichte des Namens und der Hugenotten),
die **Garage** (Auto-Galerie), den **Apfelbaum im Garten** (passwortgeschützter
Stammbaum) und den **Dachboden** (wird noch renoviert).

**Leitmotiv:** Persönlich, aber nicht privat – keine schützenswerten Daten über
lebende Personen im öffentlichen Bereich, kein Tracking, keine Font-/Video-CDNs.

## Tech-Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS v4 (Design-Tokens in `src/app/globals.css`)
- Framer Motion (Tor-Animation, Zoom-Übergänge, Scrollytelling)
- Inline-SVG-Illustrationen als React-Komponenten (`src/components/haus/`)
- `jose` für signierte Session-Cookies, `sharp` für die Bild-Pipeline
- Fonts (Cormorant Garamond, Inter) self-hosted via `next/font`

## Setup

```bash
npm install
cp .env.example .env.local   # dann Werte eintragen, siehe unten
npm run dev                  # http://localhost:3000
```

Produktion lokal testen: `npm run build && npm run start`.

## Familienname ändern

Der Name wird zentral in `src/config/site.ts` gepflegt (`familienname`,
`domain`, `url`) – alle Komponenten, Texte und Metadaten leiten ihn ab.

## Räume & Erweiterbarkeit

Jeder Raum ist in `src/config/rooms.ts` registriert (Name, Slug, Status,
Bild-`ausschnitt` in SVG-Koordinaten). Ein neuer Raum braucht:

1. einen Eintrag in `src/config/rooms.ts`,
2. eine SVG-Gruppe in der Haus-Illustration (`src/components/haus/…`,
   eingehängt in `HausIllustration.tsx`),
3. eine Route `src/app/<slug>/page.tsx`, deren Inhalt in
   `<RaumSeite raumId="…">` gehüllt ist (liefert „Zurück zum Haus“, ESC und
   die Eintrittsanimation).

Zoom-Ziel und mobiler Karten-Ausschnitt ergeben sich automatisch aus dem
`ausschnitt`.

## Bilder hinzufügen (Garage) – Privatsphäre-Pipeline

Neue Fotos **niemals direkt** nach `public/galerie/` kopieren. Stattdessen:

1. Bilder in den (unversionierten) Ordner `_eingang/` legen.
2. `npm run bilder:import` ausführen. Das Skript
   - entfernt **alle Metadaten** (EXIF, GPS, IPTC/XMP) durch Neukodierung,
   - korrigiert die Bildorientierung, skaliert auf max. 2400 px,
   - schreibt optimierte WebP-Dateien nach `public/galerie/`,
   - gibt fertige Einträge für `src/content/garage.ts` aus.
3. Die ausgegebenen Einträge in `src/content/garage.ts` übernehmen
   (Titel/Geschichte ergänzen – Geschichten statt Personen).

**Checkliste vor jedem Import (das Skript erinnert daran):**

- [ ] keine Kennzeichen lesbar (auch in Spiegelungen)
- [ ] keine Gesichter – auch nicht in Lack, Scheiben oder Chrom gespiegelt
- [ ] keine erkennbaren Orte, Straßenschilder oder Hausnummern
- [ ] Dateiname ohne Personen- oder Ortsbezug

Videos: selbst gehostete MP4-Dateien (H.264 + AAC) mit Poster-Bild nach
`public/galerie/` legen und in `src/content/garage.ts` als `typ: "video"`
eintragen (Beispiel im Datei-Kommentar). Keine YouTube-/Vimeo-Embeds.

Die sieben Platzhalterbilder lassen sich mit `npm run bilder:platzhalter`
neu erzeugen.

## Familienpasswort & geschützter Bereich

Der Stammbaum unter `/stammbaum` ist durch ein gemeinsames Familienpasswort
geschützt (Proxy-Prüfung + serverseitige Session-Prüfung, HttpOnly-Cookie,
14 Tage gültig). Die Daten liegen in `src/data/family-tree.json` und werden
**ausschließlich serverseitig nach erfolgreichem Login** ausgeliefert – nie im
öffentlichen Bundle. Der Bereich ist für Suchmaschinen gesperrt (robots,
noindex, X-Robots-Tag).

Konfiguration über Umgebungsvariablen (`.env.local`, niemals ins Repo!):

| Variable | Bedeutung |
| --- | --- |
| `FAMILY_PASSWORD` | das gemeinsame Familienpasswort |
| `SESSION_SECRET` | Zufallsgeheimnis (≥ 32 Zeichen) zum Signieren der Session |

Zufallsgeheimnis erzeugen: `openssl rand -base64 48`

**Passwort ändern:** Wert von `FAMILY_PASSWORD` in `.env.local` bzw. in den
Vercel-Umgebungsvariablen ändern und neu deployen. Bestehende Sessions bleiben
bis zu ihrem Ablauf gültig; soll das sofort gelten, zusätzlich
`SESSION_SECRET` rotieren (macht alle bestehenden Sessions ungültig).

**Echte Stammbaumdaten:** `src/data/family-tree.json` ersetzen (Schema siehe
Datei-Kommentar bzw. die fiktiven Beispieldaten). Die Datei enthält bewusst
nur erkennbar fiktive Beispielpersonen.

## Deployment (Vercel)

1. Repository bei Vercel importieren – Framework „Next.js“, keine
   Sonderkonfiguration nötig.
2. Unter *Settings → Environment Variables* `FAMILY_PASSWORD` und
   `SESSION_SECRET` (Production + Preview) setzen.
3. Domain `peteaux.de` verbinden.

## Historische Inhalte

Alle historischen Texte der Bibliothek sind als Platzhalter markiert
(`TODO: Inhalt prüfen/ergänzen`) – Jahreszahlen, Orte und Familiendetails
werden vom Betreiber recherchiert und ersetzt, ebenso die
Platzhalter-Koordinaten der Fluchtroute in
`src/components/bibliothek/FluchtKarte.tsx`. Impressum und
Datenschutzerklärung sind ebenfalls zu befüllende Platzhalter.

## Datenschutz-Grundsätze

- kein Tracking, keine Analytics, keine externen CDNs/Embeds
- einziges Cookie: die Session des geschützten Bereichs;
  dazu ein `localStorage`-Flag für die Tor-Szene
- Bild-Pipeline entfernt Metadaten vor der Veröffentlichung
