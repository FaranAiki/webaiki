import type { Metadata } from "next";
import PythonCLI from "@/components/interactive/PythonCLI"; 
import "../../../../globals.css"; 

import { getDictionary } from '@/components/layout/Translator';
import { getLanguageAlternates, getBaseMetadata, SITE_URL } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const baseMetadata = getBaseMetadata();

  return {
    ...baseMetadata,
    title: "Faran Aiki's Project",
    description: "Faran Aiki's project history and others",
    openGraph: {
      ...baseMetadata.openGraph,
      title: "Faran Aiki's Project",
      description: "Faran Aiki's project history and others",
      url: `${SITE_URL}/${lang}/project/script`,
    },
    alternates: { 
      canonical: `/${lang}/project/script`,
      languages: getLanguageAlternates('/project/script'),
    },
  };
}

import { Suspense } from "react";

export default async function ProjectPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','navbar','script']);

  return (
    <Suspense fallback={<div className="min-h-screen p-4 flex items-center justify-center text-theme-300">{dict.Loading_Python || "Loading..."}</div>}>
      <PythonCLI 
        terminalTitle={dict.Python_Web_Title} 
        loadingText={dict.Loading_Python} 
        terminalError={dict.Python_Terminal_Error}
        terminalFinished={dict.Python_Terminal_Finished}
        terminalWelcome={dict.Python_Terminal_Welcome}
        terminalInputTooLong={dict.Python_Terminal_Input_Too_Long}
        lang={lang}
      />
    </Suspense>
  );
}
