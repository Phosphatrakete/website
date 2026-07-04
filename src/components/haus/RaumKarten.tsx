import Link from "next/link";
import { HausStandbild } from "./HausIllustration";
import { raeume, type Raum } from "@/config/rooms";
import { siteConfig } from "@/config/site";

/**
 * Mobile Raumauswahl: kartenbasierte Liste mit echten Ausschnitten der
 * Haus-Illustration. Auf kleinen Bildschirmen ersetzt sie die
 * Querschnitts-Interaktion.
 */
export function RaumKarten({ onTorErneut }: { onTorErneut?: () => void }) {
  return (
    <section className="mx-auto max-w-2xl px-4 pt-24 pb-12 sm:px-6">
      <div className="overflow-hidden rounded-2xl border border-creme-300/70 shadow-karte">
        <HausStandbild
          p="uebersicht"
          className="h-44 w-full"
          beschreibung={`Illustration: das Haus der Familie ${siteConfig.familienname} im Querschnitt`}
        />
      </div>
      <h1 className="mt-8 text-4xl text-tinte-900">
        Das Haus der Familie {siteConfig.familienname}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-tinte-600">
        Treten Sie ein und sehen Sie sich um – jeder Raum erzählt einen Teil
        unserer Geschichte.
      </p>
      <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {raeume.map((raum) => (
          <li key={raum.id}>
            <RaumKarte raum={raum} />
          </li>
        ))}
      </ul>
      {onTorErneut ? (
        <button
          type="button"
          onClick={onTorErneut}
          className="mt-10 text-xs text-tinte-600 underline decoration-messing-400 underline-offset-4 hover:text-tinte-900"
        >
          Tor-Szene erneut ansehen
        </button>
      ) : null}
    </section>
  );
}

function RaumKarte({ raum }: { raum: Raum }) {
  return (
    <Link
      href={raum.slug}
      className="group block overflow-hidden rounded-2xl border border-creme-300/70 bg-creme-50 shadow-karte transition-shadow hover:shadow-karte-hover"
    >
      <div className="overflow-hidden">
        <HausStandbild
          p={`karte-${raum.id}`}
          ausschnitt={raum.ausschnitt}
          className="h-40 w-full motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex items-start justify-between gap-2 p-4">
        <div>
          <h2 className="font-display text-2xl leading-tight text-tinte-900">
            {raum.name}
          </h2>
          <p className="mt-0.5 text-xs text-tinte-600">{raum.untertitel}</p>
        </div>
        <StatusChip raum={raum} />
      </div>
    </Link>
  );
}

function StatusChip({ raum }: { raum: Raum }) {
  if (raum.status === "geschuetzt") {
    return (
      <span className="mt-1 inline-flex shrink-0 items-center gap-1 rounded-full border border-messing-400/60 bg-messing-200/40 px-2 py-0.5 text-[10px] font-medium tracking-wide text-messing-700">
        <svg aria-hidden="true" viewBox="0 0 10 12" className="h-2.5 w-2.5 fill-messing-600">
          <path d="M5 0a3 3 0 0 1 3 3v2h.5A1.5 1.5 0 0 1 10 6.5v4A1.5 1.5 0 0 1 8.5 12h-7A1.5 1.5 0 0 1 0 10.5v-4A1.5 1.5 0 0 1 1.5 5H2V3a3 3 0 0 1 3-3Zm0 1.6A1.4 1.4 0 0 0 3.6 3v2h2.8V3A1.4 1.4 0 0 0 5 1.6Z" />
        </svg>
        geschützt
      </span>
    );
  }
  if (raum.status === "renovierung") {
    return (
      <span className="mt-1 inline-flex shrink-0 items-center rounded-full border border-creme-400/70 bg-creme-200/70 px-2 py-0.5 text-[10px] font-medium tracking-wide text-tinte-600">
        wird renoviert
      </span>
    );
  }
  return null;
}
