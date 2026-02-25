import type { Metadata } from "next";
import "../globals.css";

import { CollectionsData } from '@/components/InteractiveCollections';
import LiteratureLoader from './literature-loader'
import { getDictionary } from '@/components/Translator';

import fs from 'fs';
import path from 'path';
import { cache } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL('https://faranaiki.id/literature'),
  title: "Faran Aiki in Literature",
  description: "Faran Aiki's short stories or poems",
};

export const getCollectionsData = cache ( async (dict: Record<string, string>)) => {
  const literatureDir = path.join(process.cwd(), 'public', 'documents', 'literature');
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
  const dict = await getDictionary(lang);
  const literature_data = await getCollectionsData(dict);

  return (
    <main className="container mx-auto px-6 pb-16 pt-24">
      <LiteratureLoader data={literature_data} force_click={true} />
    </main>
  );
}
