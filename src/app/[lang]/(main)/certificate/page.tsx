import type { Metadata } from "next";
import "../../../globals.css";

import React, { cache } from 'react';

import CertificateLoader from './certificate-loader';
import type { CertificateData } from '@/components/CertificatesDisplay';

import { getDictionary } from '@/components/Translator';

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Wrap in cache and pass `lang`
export const getCertificatesData = cache(async (lang: string) => {
  const dict = getDictionary(lang);
  const certificatesDir = path.join(process.cwd(), 'public', 'documents', 'certificate');
  
  if (!existsSync(certificatesDir)) return {};

  const categoryFolders = await fs.readdir(certificatesDir);
  const allCertificatesData: CertificateData = {};

  for (const category of categoryFolders) {
    const categoryPath = path.join(certificatesDir, category);
    const stat = await fs.stat(categoryPath);
    
    if (stat.isDirectory()) {
      const categoryName = dict[category] || category;
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
});

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return {
    metadataBase: new URL('https://faranaiki.id'),
    title: `${dict.Certificate} | Faran Aiki`,
    description: "Faran Aiki's personal certificates",
    openGraph: {
      title: `${dict.Certificate} | Faran Aiki`,
      description: "Faran Aiki's personal certificates",
      url: `https://faranaiki.id/${lang}/certificate`,
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
      canonical: `/${lang}/certificate`,
      languages: {
        'id': '/id/certificate',
        'en': '/en/certificate',
        'zh': '/zh/certificate',
        'ja': '/jp/certificate',
      }
    },
  };
}

export default async function CertificatePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  
  // getCertificatesData relies on asynchronous file reading logic and remains async, but dictionaries load synchronously now.
  const certificates = await getCertificatesData(lang);

  return (
    <main className="min-h-screen py-12">
      <div className="text-center mb-12"></div>
      <React.Suspense fallback={<h2 className="text-center">{dict.Loading_Certificate}</h2>}>
        <CertificateLoader certificates={certificates} allTranslation={dict.All} lang={lang} />
      </React.Suspense>
    </main>
  );
}
