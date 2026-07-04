"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { raeume } from "@/config/rooms";

/**
 * Dezente Fallback-Navigation zusätzlich zur Haus-Interaktion –
 * für Screenreader, Tastaturnutzung und alle, die es eilig haben.
 */
export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-40">
      <nav
        aria-label="Hauptnavigation"
        className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6"
      >
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-wide text-tinte-900"
        >
          {siteConfig.familienname}
        </Link>
        <ul className="hidden items-center gap-1 rounded-full border border-creme-300/70 bg-creme-50/80 px-2 py-1 shadow-karte backdrop-blur-sm md:flex">
          <li>
            <NavLink href="/" aktiv={pathname === "/"}>
              Haus
            </NavLink>
          </li>
          {raeume
            .filter((raum) => raum.inNavigation)
            .map((raum) => (
              <li key={raum.id}>
                <NavLink
                  href={raum.slug}
                  aktiv={pathname.startsWith(raum.slug)}
                >
                  {raum.id === "stammbaum" ? "Stammbaum" : raum.name}
                </NavLink>
              </li>
            ))}
        </ul>
        <MobileMenu pathname={pathname} />
      </nav>
    </header>
  );
}

function NavLink({
  href,
  aktiv,
  children,
}: {
  href: string;
  aktiv: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={aktiv ? "page" : undefined}
      className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
        aktiv
          ? "bg-tinte-900 text-creme-100"
          : "text-tinte-700 hover:bg-creme-200 hover:text-tinte-900"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileMenu({ pathname }: { pathname: string }) {
  return (
    <details className="relative md:hidden">
      <summary
        className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-creme-300/70 bg-creme-50/80 shadow-karte backdrop-blur-sm [&::-webkit-details-marker]:hidden"
        aria-label="Menü öffnen"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="h-5 w-5 fill-none stroke-tinte-800 stroke-[1.6]"
        >
          <path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="round" />
        </svg>
      </summary>
      <ul className="absolute right-0 mt-2 w-48 rounded-xl border border-creme-300/70 bg-creme-50/95 p-2 shadow-karte-hover backdrop-blur-sm">
        <li>
          <MobileNavLink href="/" aktiv={pathname === "/"}>
            Haus
          </MobileNavLink>
        </li>
        {raeume
          .filter((raum) => raum.inNavigation)
          .map((raum) => (
            <li key={raum.id}>
              <MobileNavLink
                href={raum.slug}
                aktiv={pathname.startsWith(raum.slug)}
              >
                {raum.id === "stammbaum" ? "Stammbaum" : raum.name}
              </MobileNavLink>
            </li>
          ))}
      </ul>
    </details>
  );
}

function MobileNavLink({
  href,
  aktiv,
  children,
}: {
  href: string;
  aktiv: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={aktiv ? "page" : undefined}
      className={`block rounded-lg px-3 py-2 text-sm ${
        aktiv
          ? "bg-tinte-900 text-creme-100"
          : "text-tinte-700 hover:bg-creme-200"
      }`}
    >
      {children}
    </Link>
  );
}
