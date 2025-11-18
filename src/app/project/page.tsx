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

type ProjectPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ProjectPage({ searchParams }: ProjectPageProps) {
  const resolvedParams = await searchParams;

  // Konversi tipe agar aman untuk dikirim ke komponen klien
  const serializedParams = {
    type: typeof resolvedParams?.type === 'string' ? resolvedParams.type : undefined,
    source: typeof resolvedParams?.source === 'string' ? resolvedParams.source : undefined,
  };

  const terminalTitle = await t('Python_Web_Title');
  const loadingText = await t('Loading_Python');

  // Render the Client Component and pass the resolved params to it
  return <PythonCLI searchParams={serializedParams} terminalTitle={terminalTitle} loadingText={loadingText}/>;
}
