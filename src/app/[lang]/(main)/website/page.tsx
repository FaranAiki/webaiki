import type { Metadata } from "next";
import FAQ from '@/components/portfolio/FAQ';
import { getDictionary } from '@/components/layout/Translator';
import { getLanguageAlternates, getBaseMetadata, getWebsiteSchema, SITE_URL, getFaqSchema } from '@/lib/seo';
import FadeInSection from "@/components/shared/FadeInSection";
import { Cpu, Palette, Database, Languages, Activity } from 'lucide-react';

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

      <div className="mt-24">
        <FadeInSection>
          <div className="space-y-12">
            <div className="flex items-center gap-4">
              <div className="h-10 w-2 bg-theme-500 rounded-full" />
              <h2 className="text-3xl font-black tracking-tight">{dict.Tech_Reference || "Architectural Reference"}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Framework */}
              <div className="p-8 bg-theme-surface border border-theme-border rounded-3xl shadow-sm hover:shadow-xl transition-all group">
                <div className="mb-6 p-3 bg-theme-500/10 text-theme-500 w-fit rounded-2xl group-hover:scale-110 transition-transform">
                  <Cpu size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">Next.js 15 Framework</h3>
                <p className="text-theme-muted leading-relaxed">
                  {dict.Framework_Desc}
                </p>
              </div>

              {/* Styling */}
              <div className="p-8 bg-theme-surface border border-theme-border rounded-3xl shadow-sm hover:shadow-xl transition-all group">
                <div className="mb-6 p-3 bg-theme-500/10 text-theme-500 w-fit rounded-2xl group-hover:scale-110 transition-transform">
                  <Palette size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">Custom UI/UX Styling</h3>
                <p className="text-theme-muted leading-relaxed">
                  {dict.Styling_Desc}
                </p>
              </div>

              {/* Database */}
              <div className="p-8 bg-theme-surface border border-theme-border rounded-3xl shadow-sm hover:shadow-xl transition-all group">
                <div className="mb-6 p-3 bg-theme-500/10 text-theme-500 w-fit rounded-2xl group-hover:scale-110 transition-transform">
                  <Database size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">PostgreSQL & Drizzle</h3>
                <p className="text-theme-muted leading-relaxed">
                  {dict.Database_Desc}
                </p>
              </div>

              {/* Localization */}
              <div className="p-8 bg-theme-surface border border-theme-border rounded-3xl shadow-sm hover:shadow-xl transition-all group">
                <div className="mb-6 p-3 bg-theme-500/10 text-theme-500 w-fit rounded-2xl group-hover:scale-110 transition-transform">
                  <Languages size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">Global Localization (i18n)</h3>
                <p className="text-theme-muted leading-relaxed">
                  {dict.Localization_Desc}
                </p>
              </div>

              {/* Holistic */}
              <div className="md:col-span-2 p-8 bg-theme-surface border border-theme-border rounded-3xl shadow-sm hover:shadow-xl transition-all group border-l-4 border-l-theme-500">
                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                  <div className="p-4 bg-theme-500 text-white w-fit rounded-3xl shadow-lg group-hover:rotate-12 transition-transform">
                    <Activity size={40} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black mb-3">Holistic Engineering</h3>
                    <p className="text-theme-muted leading-relaxed text-lg max-w-3xl">
                      {dict.Holistic_Approach_Desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>
      </div>

      <div className="mt-24 md:mt-32">
        <FadeInSection>
            <FAQ id="faq-website" title={dict.FAQ_Website_Title} items={websiteFaqs} />
        </FadeInSection>
      </div>
    </main>
  );
}
