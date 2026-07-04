import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * Suchmaschinen-Regeln: Der geschützte Familienbereich (Stammbaum samt
 * Login) wird nicht indexiert – zusätzlich zu noindex-Metadaten und
 * X-Robots-Tag-Headern.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/stammbaum"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
