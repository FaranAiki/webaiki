import type { Metadata } from "next";
import { headers } from "next/headers";
import FAQ from '@/components/portfolio/FAQ';
import { getDictionary } from '@/components/layout/Translator';
import { getLanguageAlternates, getBaseMetadata, getWebsiteSchema, SITE_URL, getFaqSchema } from '@/lib/seo';
import FadeInSection from "@/components/shared/FadeInSection";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const baseMetadata = getBaseMetadata();

  return {
    ...baseMetadata,
    title: `${dict.Website || 'Website'} | Faran Aiki`,
    description: dict.Website_Summary || "Information about the technologies, performance, and purpose of this site.",
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${dict.Website || 'Website'} | Faran Aiki`,
      description: dict.Website_Summary || "Information about the technologies, performance, and purpose of this site.",
      url: `${SITE_URL}/${lang}/website`,
    },
    alternates: {
      canonical: `/${lang}/website`,
      languages: getLanguageAlternates('/website'),
    },
  };
}

export default async function WebsitePage({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const nonce = (await headers()).get('x-nonce') || undefined;

  const websiteFaqs = [
    { question: dict.FAQ_Website_Q1, answer: dict.FAQ_Website_A1 },
    { question: dict.FAQ_Website_Q2, answer: dict.FAQ_Website_A2 },
    { question: dict.FAQ_Website_Q3, answer: dict.FAQ_Website_A3 },
    { question: dict.FAQ_Website_Q4, answer: dict.FAQ_Website_A4 },
    { question: dict.FAQ_Website_Q5, answer: dict.FAQ_Website_A5 },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      getWebsiteSchema(lang),
      getFaqSchema(websiteFaqs),
    ]
  };

  return (
    <main className="container mx-auto px-4 md:px-8 pt-32 pb-16 max-w-4xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        nonce={nonce}
      />
      
      <FadeInSection>
        <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl font-black nav-active-gacor tracking-tighter">
                {dict.Website}
            </h1>
            <p className="text-xl md:text-2xl text-[var(--text-muted)] font-medium leading-relaxed">
                {dict.Website_Summary}
            </p>
        </div>
      </FadeInSection>

      <div className="mt-24 md:mt-32">
        <FadeInSection>
            <FAQ id="faq-website" title={dict.FAQ_Website_Title} items={websiteFaqs} />
        </FadeInSection>
      </div>
    </main>
  );
}
