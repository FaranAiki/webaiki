import type { Metadata } from "next";
import "../../../globals.css";

import { CollectionsData } from '@/components/InteractiveCollections';
import LiteratureLoader from './literature-loader'
import { getDictionary } from '@/components/Translator';
import { cache } from 'react';
import fs from 'fs';
import path from 'path';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return {
    metadataBase: new URL('https://faranaiki.id'),
    title: `${dict.Literature} | Faran Aiki`,
    description: "Faran Aiki's short stories, poems, and other literary works",
    openGraph: {
      title: `${dict.Literature} | Faran Aiki`,
      description: "Faran Aiki's short stories, poems, and other literary works",
      url: `https://faranaiki.id/${lang}/literature`,
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
      canonical: `/${lang}/literature`,
      languages: {
        'id': '/id/literature',
        'en': '/en/literature',
        'zh': '/zh/literature',
        'ja': '/jp/literature',
      }
    },
  };
}

// Now completely synchronous utilizing purely fs.*Sync
export const getCollectionsData = cache((lang: string) => {
  const dict = getDictionary(lang);
  const literatureDir = path.join(process.cwd(), 'public', 'documents', 'literature');
  
  if (!fs.existsSync(literatureDir)) return {};

  const typeLiteratureFolders = fs.readdirSync(literatureDir);
  const allCollectionsData: CollectionsData = {};

  for (const typeLiterature of typeLiteratureFolders) {
    const typeLiteraturePath = path.join(literatureDir, typeLiterature);
    const literatureName = dict[typeLiterature] || typeLiterature;

    if (fs.statSync(typeLiteraturePath).isDirectory()) {
      allCollectionsData[literatureName] = {};
      const yearFolders = fs.readdirSync(typeLiteraturePath);

      for (const year of yearFolders) {
        const yearPath = path.join(typeLiteraturePath, year);

        if (fs.statSync(yearPath).isDirectory()) {
          allCollectionsData[literatureName][year] = {};
          const files = fs.readdirSync(yearPath);

          for (const file of files) {
            const fileName = path.parse(file).name;
            let openPath: string = '';

            if (file.endsWith('.link') || file.endsWith('.lnk')) { 
              openPath = fs.readFileSync(path.join(process.cwd(), 'public', 'documents', 'literature', typeLiterature, year, file), 'utf-8');
            } else {
              openPath = `/documents/literature/${typeLiterature}/${year}/${file}`;
            }

            allCollectionsData[literatureName][year][fileName] = openPath;
          }
        }
      }
    }
  }
  return allCollectionsData;
});

export default async function LiteraturePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const literature_data = getCollectionsData(lang);

  return (
    <main className="container mx-auto px-6 pb-16 pt-24">
      <LiteratureLoader data={literature_data} force_click={true} lang={lang} />
    </main>
  );
}
