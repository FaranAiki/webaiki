// This is the main page

import type { Metadata } from "next";
import "../../globals.css";
import { Inter } from "next/font/google";
import AboutMe from '@/components/AboutMe';

import { t } from '@/components/Translator';

const inter = Inter({ subsets: ["latin"] });

import fs from 'fs';
import path from 'path';

export function getFaranAikiPhoto() {
  const photosDir = path.join(process.cwd(), 'public', 'images', 'photo_faran_aiki');

  return fs.readdirSync(photosDir);
};

export const metadata: Metadata = {
  metadataBase: new URL('https://faranaiki.id'),

  title: 'About Faran Aiki',
  description: 'Muhammad Faran Aiki\'s personal files, portfolio, and others',
  
  openGraph: {
    title: 'About Faran Aiki',
    description: 'Muhammad Faran Aiki\'s personal files, portfolio, and others',
    url: 'https://faranaiki.id',
    siteName: 'About Faran Aiki', 
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

export default function UasMTK() {
  return (
    <main className="w-full h-screen flex flex-col items-center justify-center pt-24 bg-gray-900 text-white">
      <div className="w-full max-w-4xl h-[600px] border-2 rounded-lg overflow-hidden shadow-2xl">
        <iframe
          credentialless="true"
          src="/projects/uas_matematika_dasar/index.html"
          className="w-full h-full border-none"
          title="UAS Matematika Dasar"
        />
      </div>
    </main>
  );
}



