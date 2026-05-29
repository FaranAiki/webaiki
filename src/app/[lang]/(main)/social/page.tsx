import { Metadata } from "next";
import { getDictionary } from '@/components/Translator';
import SocialDisplay from '@/components/SocialDisplay';
import "../../../globals.css";

import { getLanguageAlternates } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return {
    metadataBase: new URL('https://faranaiki.id'),
    title: `${dict.Social} | Faran Aiki`,
    description: "Faran Aiki's social media links and profiles",
    openGraph: {
      title: `${dict.Social} | Faran Aiki`,
      description: "Faran Aiki's social media links and profiles",
      url: `https://faranaiki.id/${lang}/social`,
      siteName: "faranaiki.id",
      type: "website",
      images: [
        {
          url: '/images/photo_faran_aiki/1_fa_photo_linkedin.webp',
          width: 1200,
          height: 630,
          alt: 'Faran Aiki',
        },
      ],
    },
    icons: { icon: '/icon.ico', shortcut: '/icon.ico', apple: '/icon.ico' },
    alternates: { 
      canonical: `/${lang}/social`,
      languages: getLanguageAlternates('/social'),
    },
  };
}

export default async function SocialPage({ params }: { params: Promise<{ lang: string }> }) {
  await params;

  return (
    <main className="min-h-screen">
      <SocialDisplay />
    </main>
  );
}
