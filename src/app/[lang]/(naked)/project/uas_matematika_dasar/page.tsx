// This is the Flutter project

import { getDictionary } from '@/components/Translator';
import UasHeader from "./UasHeader";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return {
    metadataBase: new URL('https://faranaiki.id'),
    title: `${dict.Make_Interactive_UAS} | Faran Aiki`,
    description: dict.Make_Interactive_UAS_Description || "Faran Aiki's project to develop interactive widgets and AI explanations",
    openGraph: {
      title: `${dict.Make_Interactive_UAS} | Faran Aiki`,
      description: dict.Make_Interactive_UAS_Description || "Faran Aiki's project to develop interactive widgets and AI explanations",
      url: `https://faranaiki.id/${lang}/project/uas_matematika_dasar`,
      siteName: "faranaiki.id",
      type: "website",
      images: [
        {
          url: '/images/photo_faran_aiki/1_fa_photo_linkedin.webp',
          width: 1200,
          height: 630,
          alt: 'Faran Aiki',
        },
      ],
    },
    icons: { icon: '/icon.ico', shortcut: '/icon.ico', apple: '/icon.ico' },
    alternates: { 
      canonical: `/${lang}/project/uas_matematika_dasar`,
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
