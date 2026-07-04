import Link from "next/link";

export default function NichtGefunden() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
      <p className="text-sm tracking-[0.18em] text-messing-600 uppercase">
        404
      </p>
      <h1 className="mt-2 text-5xl text-tinte-900">
        Diesen Raum gibt es nicht
      </h1>
      <p className="mt-6 leading-relaxed text-tinte-700">
        Sie haben an eine Tür geklopft, die in diesem Haus nicht existiert –
        vielleicht wurde hier umgebaut.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full border border-messing-400/70 bg-creme-50 px-6 py-2.5 text-sm text-tinte-800 shadow-karte transition-colors hover:bg-creme-200"
      >
        Zurück zum Haus
      </Link>
    </div>
  );
}
