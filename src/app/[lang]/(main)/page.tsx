import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AboutMe from '@/components/AboutMe';
import { getDictionary } from '@/components/Translator';
import fs from 'fs';
import path from 'path';

const inter = Inter({ subsets: ["latin"] });

export function getFaranAikiPhoto() {
  const photosDir = path.join(process.cwd(), 'public', 'images', 'photo_faran_aiki');
  if (!fs.existsSync(photosDir)) return [];
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

export default async function HomePage({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <main className={`${inter.className} container mx-auto px-4 md:px-8 pt-24 pb-16`}>
      <AboutMe 
        carouselPhotos={getFaranAikiPhoto()} 
        faran_photo={dict.Faran_Photo}
        about_philosophy_title={dict.Faran_Philosophy_Title} 
        about_philosophy={dict.Faran_Philosophy}
        about_principle_title={dict.Faran_Principle_Title} 
        about_principle_1={dict.Faran_Principle_1}
        about_principle_2={dict.Faran_Principle_2}
        about_principle_3={dict.Faran_Principle_3} 
        about_vision_mission_title={dict.Faran_Vision_Mission_Title} 
        about_vision_mission_1={dict.Faran_Vision_Mission_1}
        about_vision_mission_2={dict.Faran_Vision_Mission_2}
        about_vision_mission_3={dict.Faran_Vision_Mission_3}
        about_title={dict.About_Me} 
        about_text_1={dict.Faran_About_1} 
        about_text_2={dict.Faran_About_2} 
      />
    </main>
  );
}
