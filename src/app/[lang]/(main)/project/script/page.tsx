import type { Metadata } from "next";
import PythonCLI from "@/components/PythonCLI"; 
import "../../../../globals.css"; 

import { getDictionary } from '@/components/Translator';

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
  icons: { icon: "/icon.ico", shortcut: "/icon.ico", apple: "/icon.ico" },
  alternates: { canonical: "/" },
};

type ProjectPageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ProjectPage({ params, searchParams }: ProjectPageProps) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const resolvedParams = await searchParams;

  const serializedParams = {
    type: typeof resolvedParams?.type === 'string' ? resolvedParams.type : undefined,
    source: typeof resolvedParams?.source === 'string' ? resolvedParams.source : undefined,
  };

  return <PythonCLI searchParams={serializedParams} terminalTitle={dict.Python_Web_Title} loadingText={dict.Loading_Python} lang={lang}/>;
}
