import type { Metadata } from "next";
import "../globals.css";
import { Inter } from "next/font/google";
import dynamic from 'next/dynamic';

import CertificateLoader from './certificate-loader';
import type { CertificateData } from '@/components/CertificatesDisplay';

import fs from 'fs';
import path from 'path';

const inter = Inter({ subsets: ["latin"] });

export function getCertificatesData() {
  const certificatesDir = path.join(process.cwd(), 'public', 'documents', 'certificate');
  const categoryFolders = fs.readdirSync(certificatesDir);
  const allCertificatesData: CertificateData = {};

  for (const category of categoryFolders) {
    const categoryPath = path.join(certificatesDir, category);
    
    if (fs.statSync(categoryPath).isDirectory()) {
      allCertificatesData[category] = {};
      
      const yearFolders = fs.readdirSync(categoryPath);

      for (const year of yearFolders) {
        const yearPath = path.join(categoryPath, year);

        if (fs.statSync(yearPath).isDirectory()) {
          // 2. FIX: Initialize the nested object for the current year
          allCertificatesData[category][year] = {};
          
          const files = fs.readdirSync(yearPath);

          for (const file of files) {
            const fileName = path.parse(file).name;
            const filePath = `/documents/certificate/${category}/${year}/${file}`;
            
            // 3. FIX: Add the file to its correct year inside its category
            allCertificatesData[category][year][fileName] = filePath;
          }
        }
      }
    }
  }

  return allCertificatesData;
}

// This remains a Server Component, which is good for data fetching
export default function CertificatePage() {
  const certificates = getCertificatesData();

  return (
    <main className="min-h-screen py-12">
      <div className="text-center mb-12">

      </div>
      
      <CertificateLoader certificates={certificates} />
    </main>
  );
}
