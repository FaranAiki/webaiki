import { getDictionary } from '@/components/layout/Translator';
import SitemapGraphClient from '@/components/interactive/SitemapGraphClient';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

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
  const dict = await getDictionary(lang);

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 bg-theme-base pt-24 overflow-hidden relative">
      <div className="w-full max-w-6xl h-[600px] border border-theme-border rounded-2xl overflow-hidden bg-theme-surface shadow-2xl relative z-10">
        <SitemapGraphClient dict={dict as Record<string, string>} lang={lang} />
      </div>
    </main>
  );
}
