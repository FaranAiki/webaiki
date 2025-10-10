import type { Metadata } from "next";
import "../globals.css";

import { CollectionsData } from '@/components/InteractiveCollections';

// import literature_data from '@/../public/json/literature.json';
import LiteratureLoader from './literature-loader'

import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: "Faran Aiki in Literature",
  description: "Faran Aiki's short stories or poems",
};

// TODO implement this
export function getCollectionsData() {
  const literatureDir = path.join(process.cwd(), 'public', 'documents', 'literature');
  const typeLiteratureFolders = fs.readdirSync(literatureDir);
  const allCollectionsData: CollectionsData = {};

  for (const typeLiterature of typeLiteratureFolders) {
    const typeLiteraturePath = path.join(literatureDir, typeLiterature);
    
    if (fs.statSync(typeLiteraturePath).isDirectory()) {
      allCollectionsData[typeLiterature] = {};
      
      const yearFolders = fs.readdirSync(typeLiteraturePath);

      for (const year of yearFolders) {
        const yearPath = path.join(typeLiteraturePath, year);

        if (fs.statSync(yearPath).isDirectory()) {
          allCollectionsData[typeLiterature][year] = {};
          
          const files = fs.readdirSync(yearPath);

          for (const file of files) {
            const fileName = path.parse(file).name;
            let openPath: string = '';

            if (file.endsWith('.link') || file.endsWith('.lnk')) { 
              openPath = fs.readFileSync(path.join(process.cwd(), 'public', 'documents', 'literature', typeLiterature, year, file), 'utf-8');
            } else {
              openPath = `/documents/literature/${typeLiterature}/${year}/${file}`;
            }

            allCollectionsData[typeLiterature][year][fileName] = openPath;
          }
        }
      }
    }
  }

  return allCollectionsData;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const literature_data = getCollectionsData();

  return (
    <main className="container mx-auto px-6 pb-16 pt-24">
      {children} 
      <LiteratureLoader data={literature_data} force_click={true} />
    </main>
  );
}
