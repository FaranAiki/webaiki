import type { Metadata } from "next";
import "../globals.css";

import React from 'react';

import CertificateLoader from './certificate-loader';
import type { CertificateData } from '@/components/CertificatesDisplay';

import { t } from '@/components/Translator';

import fs from 'fs';
import path from 'path';

export async function getCertificatesData() {
  const certificatesDir = path.join(process.cwd(), 'public', 'documents', 'certificate');
  const categoryFolders = fs.readdirSync(certificatesDir);
  const allCertificatesData: CertificateData = {};

  for (const category of categoryFolders) {
    const categoryPath = path.join(certificatesDir, category);
    
    if (fs.statSync(categoryPath).isDirectory()) {
      const categoryName = await t(category);
      console.log(categoryName);
      allCertificatesData[categoryName] = {};
      
      const yearFolders = fs.readdirSync(categoryPath);

      for (const year of yearFolders) {
        const yearPath = path.join(categoryPath, year);

        if (fs.statSync(yearPath).isDirectory()) {
          allCertificatesData[categoryName][year] = {};
          
          const files = fs.readdirSync(yearPath);

          for (const file of files) {
            const fileName = path.parse(file).name;
            const filePath = `/documents/certificate/${category}/${year}/${file}`;
            
            allCertificatesData[categoryName][year][fileName] = filePath;
          }
        }
      }
    }
  }

  return allCertificatesData;
}

export const metadata: Metadata = {
  metadataBase: new URL('https://faranaiki.id/certificate'),

  title: "Faran Aiki's Certificate",
  description: "Faran Aiki's personal certificates",
  
  openGraph: {
    title: "Faran Aiki's Certificate",
    description: "Faran Aiki's personal certificates",
    url: 'https://faranaiki.id/certificate',
    siteName: 'Faran Aiki\'s Certificate', 
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

export default async function CertificatePage() {
  const certificates = await getCertificatesData();
  const allTranslation = await t('All');

  return (
    <main className="min-h-screen py-12">
      <div className="text-center mb-12">

      </div>
    <React.Suspense fallback={<h2 className="text-center">{t('Loading_Certificate')}</h2>}>
      <CertificateLoader certificates={certificates} allTranslation={allTranslation} />
    </React.Suspense>
    </main>
  );
}
