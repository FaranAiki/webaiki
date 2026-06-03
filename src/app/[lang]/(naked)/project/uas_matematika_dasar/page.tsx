// This is the Flutter project

import { getDictionary } from '@/components/layout/Translator';
import UasHeader from "./UasHeader";
import { Metadata } from 'next';

import { getLanguageAlternates, getBaseMetadata, SITE_URL } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const baseMetadata = getBaseMetadata();

  return {
    ...baseMetadata,
    title: `${dict.Make_Interactive_UAS} | Faran Aiki`,
    description: dict.Make_Interactive_UAS_Description || "Faran Aiki's project to develop interactive widgets and AI explanations",
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${dict.Make_Interactive_UAS} | Faran Aiki`,
      description: dict.Make_Interactive_UAS_Description || "Faran Aiki's project to develop interactive widgets and AI explanations",
      url: `${SITE_URL}/${lang}/project/uas_matematika_dasar`,
    },
    alternates: { 
      canonical: `/${lang}/project/uas_matematika_dasar`,
      languages: getLanguageAlternates('/project/uas_matematika_dasar'),
    },
  };
}

export default function UasMTK() {
  return (
    <main className="w-screen h-[100dvh] flex flex-col overflow-hidden">
        <UasHeader />
        <div className="flex-1 w-full relative bg-gray-100">
            <iframe
              credentialless="true"
              src="https://analitica-graph.web.app/"
              className="w-full h-full border-none"
              title="UAS Matematika Dasar"
            />
        </div>
    </main>
  );
}
