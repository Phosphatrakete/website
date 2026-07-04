/**
 * Deutlich sichtbare Markierung für Platzhalter-Inhalte, die vom Betreiber
 * geprüft bzw. befüllt werden müssen. Erscheint nur dort, wo Inhalte noch
 * nicht final sind – vor dem Livegang alle Vorkommen ersetzen.
 */
export function TodoHinweis({
  children = "TODO: Inhalt prüfen/ergänzen",
}: {
  children?: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-messing-500/60 bg-messing-200/40 px-2 py-0.5 font-sans text-xs font-medium tracking-wide text-messing-700 uppercase">
      <svg
        aria-hidden="true"
        viewBox="0 0 12 12"
        className="h-3 w-3 fill-messing-600"
      >
        <path d="M6 1 11 10H1L6 1Zm-.6 3.2v3h1.2v-3H5.4Zm0 4v1.2h1.2V8.2H5.4Z" />
      </svg>
      {children}
    </span>
  );
}
