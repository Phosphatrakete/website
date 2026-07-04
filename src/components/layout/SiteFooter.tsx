import Link from "next/link";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-creme-300/60 bg-creme-200/50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-tinte-600 sm:flex-row sm:px-6">
        <p>
          <span className="font-display text-sm">
            {siteConfig.familienname}
          </span>{" "}
          · eine Familie, ein Haus, eine Geschichte
        </p>
        <nav aria-label="Rechtliches">
          <ul className="flex items-center gap-4">
            <li>
              <Link
                href="/impressum"
                className="transition-colors hover:text-tinte-900"
              >
                Impressum
              </Link>
            </li>
            <li>
              <Link
                href="/datenschutz"
                className="transition-colors hover:text-tinte-900"
              >
                Datenschutz
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
