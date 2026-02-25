import type { Metadata } from "next";
import "../globals.css";

import { CollectionsData } from '@/components/InteractiveCollections';
import React from 'react';
import CollegeLoader from './college-loader';
import { getDictionary } from '@/components/Translator';

import fs from 'fs';
import path from 'path';

import { cache } from 'react';

export const getCollectionsData = cache(async (dict: Record<string, string>) => {
  const certificatesDir = path.join(process.cwd(), 'public', 'documents', 'college');
  const semesterFolders = fs.readdirSync(certificatesDir);
  const allCollectionsData: CollectionsData = {};

  for (const semester of semesterFolders) {
    const semesterPath = path.join(certificatesDir, semester);
    const semesterName = dict[semester] || semester;

    if (fs.statSync(semesterPath).isDirectory()) {
      allCollectionsData[semesterName] = {};
      const subjectFolders = fs.readdirSync(semesterPath);

      for (const subject of subjectFolders) {
        const subjectPath = path.join(semesterPath, subject);

        if (fs.statSync(subjectPath).isDirectory()) {
          const subject_name = dict[subject] || subject; 
          allCollectionsData[semesterName][subject_name] = {};
          const files = fs.readdirSync(subjectPath);

          for (const file of files) {
            const fileName = path.parse(file).name;
            let openPath: string = '';

            if (file.endsWith('.link') || file.endsWith('.lnk')) { 
              openPath = fs.readFileSync(path.join(process.cwd(), 'public', 'documents', 'college', semester, subject, file), 'utf-8');
            } else if (file.endsWith('py') || file.endsWith('python')) {
              openPath= `https://faranaiki.id/project/script?type=python&source=/documents/college/${semester}/${subject}/${file}`;
            } else {
              openPath = `/documents/college/${semester}/${subject}/${file}`;
            }

            allCollectionsData[semesterName][subject_name][fileName] = openPath;
          }
        }
      }
    }
  }
  return allCollectionsData;
});

export const metadata: Metadata = {
  metadataBase: new URL('https://faranaiki.id/college'),
  title: "Faran Aiki's Personal College Collection",
  description: "Faran Aiki's personal college collection",
};

export default async function CollegePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const college_data = await getCollectionsData(dict);

  return (
    <main className="container mx-auto pt-8 pb-16 pt-24">
      <React.Suspense fallback={<h2 className="text-center">{dict.Loading_College}</h2>}>
        <CollegeLoader data={college_data} force_click={false} />
     </React.Suspense>
    </main>
  );
}
