import type { Metadata } from "next";
import "../globals.css";

import { CollectionsData } from '@/components/InteractiveCollections';

import LiteratureLoader from './literature-loader'

import { t } from '@/components/Translator';

import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  metadataBase: new URL('https://faranaiki.id/literature'),

  title: "Faran Aiki in Literature",
  description: "Faran Aiki's short stories or poems",
  
  openGraph: {
    title: "Faran Aiki in Literature",
    description: "Faran Aiki's short stories or poems",
    url: 'https://faranaiki.id/literature',
    siteName: 'Faran Aiki in Literature', 
    type: 'website',
  },

  icons: {
    icon: '/icon.ico',
    shortcut: '/icon.ico',
    apple: '/icon.ico',
  },
  
  alternates: {
    canonical: '/',
  },
};

export async function getCollectionsData() {
  const literatureDir = path.join(process.cwd(), 'public', 'documents', 'literature');
  const typeLiteratureFolders = fs.readdirSync(literatureDir);
  const allCollectionsData: CollectionsData = {};

  for (const typeLiterature of typeLiteratureFolders) {
    const typeLiteraturePath = path.join(literatureDir, typeLiterature);
    const literatureName = await t(typeLiterature);

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
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const literature_data = await getCollectionsData();

  return (
    <main className="container mx-auto px-6 pb-16 pt-24">
      {children} 
      <LiteratureLoader data={literature_data} force_click={true} />
    </main>
  );
}
