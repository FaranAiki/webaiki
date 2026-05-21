import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AboutMe from '@/components/AboutMe';
import { getDictionary } from '@/components/Translator';
import { cache } from 'react';
import fs from 'fs';
import path from 'path';

const inter = Inter({ subsets: ["latin"] });

export const getFaranAikiPhoto = cache(() => {
  const photosDir = path.join(process.cwd(), 'public', 'images', 'photo_faran_aiki');
  if (!fs.existsSync(photosDir)) return [];
  return fs.readdirSync(photosDir);
});

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return {
    metadataBase: new URL('https://faranaiki.id'),
    title: `${dict.About_Me} | Faran Aiki`,
    description: dict.Faran_About_1?.replace(/<[^>]*>/g, '') || "Muhammad Faran Aiki's personal files, portfolio, and others",
    openGraph: {
      title: `${dict.About_Me} | Faran Aiki`,
      description: dict.Faran_About_1?.replace(/<[^>]*>/g, '') || "Muhammad Faran Aiki's personal files, portfolio, and others",
      url: `https://faranaiki.id/${lang}`,
      siteName: "faranaiki.id",
      type: "website",
      images: [
        {
          url: '/images/photo_faran_aiki/1_fa_photo_linkedin.jpg',
          width: 1200,
          height: 630,
          alt: 'Faran Aiki',
        },
      ],
    },
    icons: {
      icon: '/icon.ico',
      shortcut: '/icon.ico',
      apple: '/icon.ico',
    },
    alternates: {
      canonical: `/${lang}`,
      languages: {
        'id': '/id',
        'en': '/en',
        'zh': '/zh',
        'jp': '/jp',
        'ru': '/ru',
        'fr': '/fr',
        'ar': '/ar',
      }
    },
  };
}

export default async function HomePage({ 
 
  params 
}: { 
  params: Promise<{ lang: string }> 
}) {
  const { lang } = await params;
  const dict = getDictionary(lang);
return (
  <main className={`${inter.className} container mx-auto px-4 md:px-8 pt-24 pb-16`}>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Muhammad Faran Aiki",
          "url": "https://faranaiki.id",
          "image": "https://faranaiki.id/images/photo_faran_aiki/1_fa_photo_linkedin.jpg",
          "sameAs": [
            "https://github.com/faranaiki",
            "https://linkedin.com/in/faranaiki"
          ],
          "jobTitle": "Software Engineer",
          "description": dict.Faran_About_1?.replace(/<[^>]*>/g, '')
        })
      }}
    />
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
        lang={lang}
      />
    </main>
  );
}
