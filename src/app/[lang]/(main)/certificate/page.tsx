import type { Metadata } from "next";
import "../globals.css";

import React from 'react';

import CertificateLoader from './certificate-loader';
import type { CertificateData } from '@/components/CertificatesDisplay';

import { getDictionary } from '@/components/Translator';

import fs from 'fs/promises';
import path from 'path';

// Pass dictionary context here
export async function getCertificatesData(dict: Record<string, string>) {
  const certificatesDir = path.join(process.cwd(), 'public', 'documents', 'certificate');
  const categoryFolders = await fs.readdir(certificatesDir);
  const allCertificatesData: CertificateData = {};

  for (const category of categoryFolders) {
    const categoryPath = path.join(certificatesDir, category);
    const stat = await fs.stat(categoryPath);
    
    if (stat.isDirectory()) {
      const categoryName = dict[category] || category; // Look up directly
      allCertificatesData[categoryName] = {};
      
      const yearFolders = await fs.readdir(categoryPath);

      for (const year of yearFolders) {
        const yearPath = path.join(categoryPath, year);
        const yearStat = await fs.stat(yearPath);

        if (yearStat.isDirectory()) {
          allCertificatesData[categoryName][year] = {};
          
          const files = await fs.readdir(yearPath);

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
    url: 'https://faranaiki.id/certificate',
    siteName: 'Faran Aiki\'s Certificate', 
    type: 'website',
  },
};

export default async function CertificatePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  const certificates = await getCertificatesData(dict);

  return (
    <main className="min-h-screen py-12">
      <div className="text-center mb-12"></div>
      <React.Suspense fallback={<h2 className="text-center">{dict.Loading_Certificate}</h2>}>
        <CertificateLoader certificates={certificates} allTranslation={dict.All} />
      </React.Suspense>
    </main>
  );
}
