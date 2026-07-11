import { getDictionary } from '@/components/layout/Translator';
import { Metadata } from 'next';
import { getLanguageAlternates, getBaseMetadata, SITE_URL } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','navbar','latest']);
  const baseMetadata = getBaseMetadata();

  return {
    ...baseMetadata,
    title: `${dict.Latest} | Faran Aiki`,
    description: dict.SEO_Latest_Description || "Stay up-to-date with the latest information, recent activities, and new announcements regarding Muhammad Faran Aiki's career, projects, and insights.",
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${dict.Latest} | Faran Aiki`,
      description: dict.SEO_Latest_Description || "Stay up-to-date with the latest information, recent activities, and new announcements regarding Muhammad Faran Aiki's career, projects, and insights.",
      url: `${SITE_URL}/${lang}/latest`,
    },
    alternates: {
      canonical: `/${lang}/latest`,
      languages: getLanguageAlternates('/latest'),
    },
  };
}

export default async function LatestPage() {
  return (
    <main className="container mx-auto px-8 pt-24 pb-16">
    </main>
  );
}
