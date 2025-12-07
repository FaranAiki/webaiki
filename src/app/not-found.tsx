import Background from "@/components/Background"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Import Providers
import { Providers } from "@/components/Providers";
import { CookieInitializer } from '@/components/CookieInitialize';

import { t, currentLanguage } from '@/components/Translator';

import fs from 'fs';
import path from 'path';

import { 
  Home, 
} from 'lucide-react';

// Helper to get backgrounds
function getBackgrounds() {
  const photosDir = path.join(process.cwd(), 'public', 'images', 'background');
  if (!fs.existsSync(photosDir)) return [];
  return fs.readdirSync(photosDir);
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function NotFound() {
  const not_found_text = await t('Not_Found');

  const current_lang = await currentLanguage();
  const home_text = await t('Home');

  return (
    <Providers>
      <CookieInitializer />
      <main className="container mx-auto px-8 pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className='flex text-center text-lg justify-center cursor-pointer'>
            <h1 className="text-4xl hover:scale-105 transition-all duration-200 hover:text-cyan-400 hover:font-bold hover:opacity-75 cursor-pointer">
            {not_found_text}
            </h1>
          <a href="/" className="flex items-center space-x-2 text-xl font-semibold hover:text-cyan-500 hover:scale-105 transition-all duration-200">
             <Home size={24} />
             <span>{home_text}</span>
          </a>
        </div>
      </main>

      <Background carousel={getBackgrounds()}/>
    </Providers>
  );
}
