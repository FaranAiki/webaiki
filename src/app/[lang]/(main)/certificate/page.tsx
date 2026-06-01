import type { Metadata } from "next";
import "../../../globals.css";

import CertificatesDisplay from '@/components/CertificatesDisplay';
import { getDictionary } from '@/components/Translator';
import { getCertificatesData } from '@/lib/data';
import { getLanguageAlternates } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    metadataBase: new URL('https://faranaiki.id'),
    title: `${dict.Certificate} | Faran Aiki`,
    description: dict.SEO_Certificate_Description || "Faran Aiki's professional certificates and achievements",
    openGraph: {
      title: `${dict.Certificate} | Faran Aiki`,
      description: dict.SEO_Certificate_Description || "Faran Aiki's professional certificates and achievements",
      url: `https://faranaiki.id/${lang}/certificate`,
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
      canonical: `/${lang}/certificate`,
      languages: getLanguageAlternates('/certificate'),
    },
  };
}

export default async function CertificatePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const certificates_data = await getCertificatesData(lang);

  return (
    <main className="container mx-auto px-4 sm:px-8 pb-16 pt-16">
      <CertificatesDisplay 
        certificates={certificates_data} 
        lang={lang} 
        allTranslation={dict.All} 
        click_to_close_text={dict.Click_To_Close} 
      />
    </main>
  );
}
