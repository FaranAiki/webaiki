import Background from "@/components/Background"
import "./globals.css";
import Link from "next/link";

// Import Providers
import { Providers } from "@/components/Providers";
import { CookieInitializer } from '@/components/CookieInitialize';

import { t } from '@/components/Translator';

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

export default async function NotFound() {
  const not_found_text = await t('Not_Found');

  const home_text = await t('Home');

  return (
    <>
    <CookieInitializer />
    <Providers>
      <main className="container mx-auto px-8 pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className='flex text-center text-lg justify-center cursor-pointer'>
            <h1 className="text-4xl transition-all duration-200 hover:opacity-75 cursor-pointer">
            {not_found_text}
            </h1>
        </div>
          <Link href="/" className="flex items-center space-x-2 text-xl font-semibold hover:text-cyan-500 hover:scale-105 transition-all duration-200">
            <span> </span>
             <Home size={24} />
             <span>{home_text}</span>
          </Link>
      </main>

      <Background carousel={getBackgrounds()}/>
    </Providers>
    </>
  );
}
