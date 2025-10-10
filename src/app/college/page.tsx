import type { Metadata } from "next";
import "../globals.css";


import { CollectionsData } from '@/components/InteractiveCollections';

import React from 'react';

import CollegeLoader from './college-loader';

import { t } from '@/components/Translator';

// import college_data from '@/../public/json/college.json';

import fs from 'fs';
import path from 'path';

// TODO implement this
export function getCollectionsData() {
  const certificatesDir = path.join(process.cwd(), 'public', 'documents', 'college');
  const semesterFolders = fs.readdirSync(certificatesDir);
  const allCollectionsData: CollectionsData = {};

  for (const semester of semesterFolders) {
    const semesterPath = path.join(certificatesDir, semester);
    
    if (fs.statSync(semesterPath).isDirectory()) {
      allCollectionsData[semester] = {};
      
      const subjectFolders = fs.readdirSync(semesterPath);

      for (const subject of subjectFolders) {
        const subjectPath = path.join(semesterPath, subject);

        if (fs.statSync(subjectPath).isDirectory()) {
          allCollectionsData[semester][subject] = {};
          
          const files = fs.readdirSync(subjectPath);

          for (const file of files) {
            const fileName = path.parse(file).name;
            let openPath: string = '';

            if (file.endsWith('.link') || file.endsWith('.lnk')) { 
              openPath = fs.readFileSync(path.join(process.cwd(), 'public', 'documents', 'college', semester, subject, file), 'utf-8');
            } else {
              openPath = `/documents/college/${semester}/${subject}/${file}`;
            }

            allCollectionsData[semester][subject][fileName] = openPath;
          }
        }
      }
    }
  }

  return allCollectionsData;
}

export const metadata: Metadata = {
  title: "Faran Aiki's Personal College Collection",
  description: "Faran Aiki's personal college collection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const college_data = getCollectionsData();

  return (
    <main className="container mx-auto pt-8 pb-16 pt-24">
      {children}
      <React.Suspense fallback={<h2 className="text-center">{t('Loading_College')}</h2>}>
        <CollegeLoader data={college_data} force_click={false} />;
     </React.Suspense>
    </main>
  );
}
