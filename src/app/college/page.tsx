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
export async function getCollectionsData() {
  const certificatesDir = path.join(process.cwd(), 'public', 'documents', 'college');
  const semesterFolders = fs.readdirSync(certificatesDir);
  const allCollectionsData: CollectionsData = {};

  for (const semester of semesterFolders) {
    const semesterPath = path.join(certificatesDir, semester);
    const semesterName = await t(semester);

    if (fs.statSync(semesterPath).isDirectory()) {
      allCollectionsData[semesterName] = {};
      
      const subjectFolders = fs.readdirSync(semesterPath);

      for (const subject of subjectFolders) {
        const subjectPath = path.join(semesterPath, subject);

        if (fs.statSync(subjectPath).isDirectory()) {
          // change subject name to given await
          const subject_name = await t(subject); 
          allCollectionsData[semesterName][subject_name] = {};
          
          const files = fs.readdirSync(subjectPath);

          for (const file of files) {
            const fileName = path.parse(file).name;
            let openPath: string = '';

            if (file.endsWith('.link') || file.endsWith('.lnk')) { 
              openPath = fs.readFileSync(path.join(process.cwd(), 'public', 'documents', 'college', semester, subject, file), 'utf-8');
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
}

export const metadata: Metadata = {
  metadataBase: new URL('https://faranaiki.id/college'),

  title: "Faran Aiki's Personal College Collection",
  description: "Faran Aiki's personal college collection",
  
  openGraph: {
    title: "Faran Aiki's Personal College Collection",
    description: "Faran Aiki's personal college collection",
    url: 'https://faranaiki.id/college',
    siteName: 'Faran Aiki\'s Personal College Collection', 
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const college_data = await getCollectionsData();

  return (
    <main className="container mx-auto pt-8 pb-16 pt-24">
      {children}
      <React.Suspense fallback={<h2 className="text-center">{t('Loading_College')}</h2>}>
        <CollegeLoader data={college_data} force_click={false} />
     </React.Suspense>
    </main>
  );
}
