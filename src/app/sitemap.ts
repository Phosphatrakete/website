import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/** Sitemap nur für die öffentlichen Bereiche der Website. */
export default function sitemap(): MetadataRoute.Sitemap {
  const oeffentlicheSeiten = ["", "/bibliothek", "/garage", "/dachboden"];
  return oeffentlicheSeiten.map((pfad) => ({
    url: `${siteConfig.url}${pfad}`,
    changeFrequency: "monthly",
    priority: pfad === "" ? 1 : 0.7,
  }));
}
