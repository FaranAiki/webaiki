import type { Metadata } from "next";
import "../../../globals.css";

import CertificateLoader from './certificate-loader';
import { getDictionary } from '@/components/layout/Translator';
import { getCertificatesData } from '@/lib/data';
import { getLanguageAlternates, getBaseMetadata, SITE_URL, getBreadcrumbSchema, getPersonSchema } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','navbar','certificate','seo']);
  const baseMetadata = getBaseMetadata(dict);

  return {
    ...baseMetadata,
    title: `${dict.Certificate} | Faran Aiki`,
    description: dict.SEO_Certificate_Description || "Faran Aiki's professional certificates and achievements",
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${dict.Certificate} | Faran Aiki`,
      description: dict.SEO_Certificate_Description || "Faran Aiki's professional certificates and achievements",
      url: `${SITE_URL}/${lang}/certificate`,
    },
    alternates: { 
      canonical: `/${lang}/certificate`,
      languages: getLanguageAlternates('/certificate'),
    },
  };
}

export default async function CertificatePage({params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','navbar','certificate','seo']);
  
  const certificates_data = await getCertificatesData(lang);

  const isLoggedIn = false;
  const bookmarkedItemIds: string[] = [];

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: dict.Home, item: `/${lang}` },
    { name: dict.Certificate, item: `/${lang}/certificate` },
  ]);

  const personSchema = getPersonSchema(lang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      personSchema,
      breadcrumbSchema,
    ],
  };

  return (
    <main className="container mx-auto pb-16 pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="px-4 sm:px-8 mb-8 mt-12 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">{dict.Certificate}</h1>
        {dict.SEO_Certificate_Description && (
          <p className="text-base opacity-80 leading-relaxed">{dict.SEO_Certificate_Description}</p>
        )}
      </header>
      <CertificateLoader 
        certificates={certificates_data} 
        lang={lang} 
        allTranslation={dict.All} 
        click_to_close_text={dict.Click_To_Close}
        isLoggedIn={isLoggedIn}
        bookmarkedItemIds={bookmarkedItemIds}
      />
    </main>
  );
}
