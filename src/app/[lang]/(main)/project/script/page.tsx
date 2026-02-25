import type { Metadata } from "next";
import PythonCLI from "@/components/PythonCLI"; 
import "../../globals.css"; 

import { t } from '@/components/Translator';

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

type ProjectPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ProjectPage({ searchParams }: ProjectPageProps) {
  const resolvedParams = await searchParams;

  // conversion for typescript shit
  const serializedParams = {
    type: typeof resolvedParams?.type === 'string' ? resolvedParams.type : undefined,
    source: typeof resolvedParams?.source === 'string' ? resolvedParams.source : undefined,
  };

  const terminalTitle = await t('Python_Web_Title');
  const loadingText = await t('Loading_Python');

  // render the python CLI
  return <PythonCLI searchParams={serializedParams} terminalTitle={terminalTitle} loadingText={loadingText}/>;
}
