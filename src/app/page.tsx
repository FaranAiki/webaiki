'use server';

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

// TODO make this more good
// efficient and effective 
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className={`${inter.className} container mx-auto px-8 pt-24 pb-16`}>
        {children}
    <AboutMe carouselPhotos={getFaranAikiPhoto()} faran_photo={await t('Faran_Photo')}
    about_philosophy_title={await t('Faran_Philosophy_Title')} about_philosophy={await t('Faran_Philosophy')}
    about_principle_title={await t('Faran_Principle_Title')} about_principle={await t('Faran_Principle')}
    about_vision_mission_title={await t('Faran_Vision_Mission_Title')} about_vision_mission={await t('Faran_Vision_Mission')}
    about_title={await t('About_Me')} about_text={await t('Faran_About')} /> {/* I don't know why I don't the about me here */}
    </main>
  );
}


