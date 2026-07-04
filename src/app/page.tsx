import type { Metadata } from "next";
import { Eingang } from "@/components/eingang/Eingang";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Familie ${siteConfig.familienname} – Willkommen`,
  description: siteConfig.beschreibung,
};

export default function Startseite() {
  return <Eingang />;
}
