import type { Metadata } from "next";
import PythonCLI from "@/components/PythonCLI"; 
import "../../../../globals.css"; 

import { getDictionary } from '@/components/Translator';
import { getLanguageAlternates } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    metadataBase: new URL("https://faranaiki.id"),
    title: "Faran Aiki's Project",
    description: "Faran Aiki's project history and others",
    openGraph: {
      title: "Faran Aiki's Project",
      description: "Faran Aiki's project history and others",
      url: `https://faranaiki.id/${lang}/project/script`,
      siteName: "Faran Aiki's Project",
      type: "website",
    },
    icons: { icon: "/icon.ico", shortcut: "/icon.ico", apple: "/icon.ico" },
    alternates: { 
      canonical: `/${lang}/project/script`,
      languages: getLanguageAlternates('/project/script'),
    },
  };
}

type ProjectPageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ProjectPage({ params, searchParams }: ProjectPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const resolvedParams = await searchParams;

  const serializedParams = {
    type: typeof resolvedParams?.type === 'string' ? resolvedParams.type : undefined,
    source: typeof resolvedParams?.source === 'string' ? resolvedParams.source : undefined,
  };

  return <PythonCLI 
    searchParams={serializedParams} 
    terminalTitle={dict.Python_Web_Title} 
    loadingText={dict.Loading_Python} 
    terminalError={dict.Python_Terminal_Error}
    terminalFinished={dict.Python_Terminal_Finished}
    terminalWelcome={dict.Python_Terminal_Welcome}
    terminalInputTooLong={dict.Python_Terminal_Input_Too_Long}
    lang={lang}
  />;
}
