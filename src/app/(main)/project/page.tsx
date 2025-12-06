import type { Metadata } from "next";
import PythonCLI from "@/components/PythonCLI"; 
import "../globals.css"; 

import { t, currentLanguage } from '@/components/Translator';

export const metadata: Metadata = {
  metadataBase: new URL("https://faranaiki.id/project"),

  title: "Faran Aiki's Project",
  description: "Faran Aiki's project history and others",

  openGraph: {
    title: "Faran Aiki's Project",
    description: "Faran Aiki's project history and others",
    url: "https://faranaiki.id/project",
    siteName: "Faran Aiki's Project",
    type: "website",
  },

  icons: {
    icon: "/icon.ico",
    shortcut: "/icon.ico",
    apple: "/icon.ico",
  },

  alternates: {
    canonical: "/",
  },
};

export default async function ProjectPage() {
  
}
