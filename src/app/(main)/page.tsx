// This is the main page

import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import AboutMe from '@/components/AboutMe';

import { t } from '@/components/Translator';

const inter = Inter({ subsets: ["latin"] });

import fs from 'fs';
import path from 'path';

export function getFaranAikiPhoto() {
  const photosDir = path.join(process.cwd(), 'public', 'images', 'photo_faran_aiki');

  // Ensure directory exists to prevent build errors
  if (!fs.existsSync(photosDir)) {
    return [];
  }

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

// efficient and effective 
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Adjusted padding: px-4 on mobile (was px-8), md:px-8 on desktop
    <main className={`${inter.className} container mx-auto px-4 md:px-8 pt-24 pb-16`}>
        {children}
    <AboutMe 
      carouselPhotos={getFaranAikiPhoto()} 
      faran_photo={await t('Faran_Photo')}
      about_philosophy_title={await t('Faran_Philosophy_Title')} 
      about_philosophy={await t('Faran_Philosophy')}
      about_principle_title={await t('Faran_Principle_Title')} 
      // Split Principles
      about_principle_1={await t('Faran_Principle_1')}
      about_principle_2={await t('Faran_Principle_2')}
      about_principle_3={await t('Faran_Principle_3')} // Added
      about_vision_mission_title={await t('Faran_Vision_Mission_Title')} 
      // Split Vision Mission
      about_vision_mission_1={await t('Faran_Vision_Mission_1')}
      about_vision_mission_2={await t('Faran_Vision_Mission_2')}
      about_vision_mission_3={await t('Faran_Vision_Mission_3')} // Added
      about_title={await t('About_Me')} 
      // Fetching split paragraphs
      about_text_1={await t('Faran_About_1')} 
      about_text_2={await t('Faran_About_2')} 
    />
    </main>
  );
}
