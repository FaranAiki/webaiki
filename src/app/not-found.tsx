import Background from "@/components/Background"
import "./globals.css";
import Link from "next/link";

// Import Providers
import { Providers } from "@/components/Providers";
import { CookieInitializer } from '@/components/CookieInitialize';

import { getDictionaryFromCookie } from '@/components/Translator';

import fs from 'fs';
import path from 'path';

import { cache } from 'react';

import { 
  Home, 
} from 'lucide-react';

// Helper to get backgrounds
const getBackgrounds = cache( () => {
  const photosDir = path.join(process.cwd(), 'public', 'images', 'background');
  if (!fs.existsSync(photosDir)) return [];
  return fs.readdirSync(photosDir).filter(file => file.toLowerCase().endsWith('.webp'));
});

export default async function NotFound() {
  const dict = await getDictionaryFromCookie();

  return (
    <html lang="en">
      <body>
        <CookieInitializer />
        <Providers>
          <main className="container mx-auto px-8 pt-24 pb-16 min-h-screen flex items-center justify-center">
            <div className='flex text-center text-lg justify-center cursor-pointer'>
                <h1 className="text-4xl transition-opacity duration-200 hover:opacity-75 cursor-pointer">
                {dict.Not_Found}
                </h1>
            </div>
              <Link href="/" className="flex items-center space-x-2 text-xl font-semibold hover:text-cyan-500 hover:scale-105 transition-[opacity,transform] duration-200 ml-6">
                 <Home size={24} />
                 <span>{dict.Home}</span>
              </Link>
          </main>

          <Background carousel={getBackgrounds()}/>
        </Providers>
      </body>
    </html>
  );
}
