import { Metadata } from "next";
import { getDictionary } from '@/components/layout/Translator';
import SocialDisplay from '@/components/portfolio/SocialDisplay';
import "../../../globals.css";

import { getLanguageAlternates, getBaseMetadata, SITE_URL, getBreadcrumbSchema, getPersonSchema } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','navbar','social','seo']);
  const baseMetadata = getBaseMetadata();

  return {
    ...baseMetadata,
    title: `${dict.Social} | Faran Aiki`,
    description: dict.SEO_Social_Description || "Connect with Muhammad Faran Aiki across various platforms. Discover his official social media links, professional profiles on LinkedIn, GitHub, DEV.to, and more.",
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${dict.Social} | Faran Aiki`,
      description: dict.SEO_Social_Description || "Connect with Muhammad Faran Aiki across various platforms. Discover his official social media links, professional profiles on LinkedIn, GitHub, DEV.to, and more.",
      url: `${SITE_URL}/${lang}/social`,
    },
    alternates: {
      canonical: `/${lang}/social`,
      languages: getLanguageAlternates('/social'),
    },
  };
}

export default async function SocialPage({params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','navbar','social','seo']);
  

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: dict.Home, item: `/${lang}` },
    { name: dict.Social, item: `/${lang}/social` },
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
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">{dict.Social}</h1>
        {dict.SEO_Social_Description && (
          <p className="text-base opacity-80 leading-relaxed">{dict.SEO_Social_Description}</p>
        )}
      </header>
      <div className="w-full px-4 md:px-0">
        <SocialDisplay dict={dict} hidePresentation={true} />
      </div>
    </main>
  );
}
