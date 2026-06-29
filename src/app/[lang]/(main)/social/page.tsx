import { Metadata } from "next";
import { headers } from "next/headers";
import { getDictionary } from '@/components/layout/Translator';
import SocialDisplay from '@/components/portfolio/SocialDisplay';
import "../../../globals.css";

import { getLanguageAlternates, getBaseMetadata, SITE_URL, getBreadcrumbSchema } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const baseMetadata = getBaseMetadata();

  return {
    ...baseMetadata,
    title: `${dict.Social} | Faran Aiki`,
    description: "Faran Aiki's social media links and profiles",
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${dict.Social} | Faran Aiki`,
      description: "Faran Aiki's social media links and profiles",
      url: `${SITE_URL}/${lang}/social`,
    },
    alternates: {
      canonical: `/${lang}/social`,
      languages: getLanguageAlternates('/social'),
    },
  };
}

export default async function SocialPage({params }: { params: Promise<{ lang: string }> }) {
  const nonce = (await headers()).get("x-nonce") || "";
  const { lang } = await params;
  const dict = await getDictionary(lang);
  

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: dict.Home, item: `/${lang}` },
    { name: dict.Social, item: `/${lang}/social` },
  ]);

  return (
    <main className="min-h-screen">
      <script nonce={nonce}         type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="pt-8 md:pt-0">
        <SocialDisplay dict={dict} />
      </div>
    </main>
  );
}
