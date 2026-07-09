import { getDictionary } from '@/components/layout/Translator';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const SitemapGraphClient = dynamic(() => import('@/components/interactive/SitemapGraphClient'));

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','navbar','sitemap-graph']);

  return {
    title: `${dict.Sitemap_Graph || 'Sitemap Graph'} | FaranAiki`,
    description: "Visual relationship graph of FaranAiki's personal website.",
  };
}

export default async function SitemapGraphPage({
  params
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','navbar','sitemap-graph']);

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 bg-theme-base pt-24 overflow-hidden relative">
      <div className="w-full max-w-6xl min-h-[600px] md:h-[600px] flex flex-col md:flex-row border border-theme-border rounded-2xl overflow-hidden bg-theme-surface shadow-2xl relative z-10">
        <Suspense fallback={<div className="w-full min-h-[600px] md:h-[600px] flex items-center justify-center text-theme-300 animate-pulse bg-theme-surface">{dict.Loading || 'Loading'} {dict.Sitemap_Graph || 'Sitemap Graph'}...</div>}>
          <SitemapGraphClient dict={dict as import('@/components/layout/Translator').TranslationDict} lang={lang} />
        </Suspense>
      </div>
    </main>
  );
}
