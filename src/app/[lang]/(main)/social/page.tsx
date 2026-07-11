import { Metadata } from "next";
import { getDictionary } from '@/components/layout/Translator';
import SocialDisplay from '@/components/portfolio/SocialDisplay';
import "../../../globals.css";

import { getLanguageAlternates, getBaseMetadata, SITE_URL, getBreadcrumbSchema } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','navbar','social']);
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
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','navbar','social']);
  

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: dict.Home, item: `/${lang}` },
    { name: dict.Social, item: `/${lang}/social` },
  ]);

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="pt-8 md:pt-0">
        <SocialDisplay dict={dict} hidePresentation={true} />
      </div>
    </main>
  );
}
