// This is the main page

import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import AboutMe from '@/components/AboutMe'

const inter = Inter({ subsets: ["latin"] });

import fs from 'fs';
import path from 'path';

export function getFaranAikiPhoto() {
  const photosDir = path.join(process.cwd(), 'public', 'images', 'photo_faran_aiki');

  return fs.readdirSync(photosDir);
}

export const metadata: Metadata = {
  title: "About Faran Aiki",
  description: "Faran Aiki's personal files, portfolio, and others",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className={`${inter.className} container mx-auto px-8 pt-24 pb-16`}>
        {children}
    <AboutMe carouselPhotos={getFaranAikiPhoto()} /> {/* I don't know why I don't the about me here */}
    </main>
  );
}


