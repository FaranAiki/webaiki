import type { Metadata } from "next";
import { headers } from "next/headers";
import { getDictionary } from '@/components/layout/Translator';
import { getLanguageAlternates, getBaseMetadata, SITE_URL, getPersonSchema, getWebsiteSchema, getProfilePageSchema } from '@/lib/seo';
import HomeClient from "./HomeClient";
import { getNews, getFeedbacks } from '@/app/actions';
import { NewsItem } from '@/lib/types';
import LatestActivity from '@/components/interactive/LatestActivity';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const baseMetadata = getBaseMetadata(dict);

  const title = `Muhammad Faran Aiki (Faran) | ${dict.Software_Engineer || 'Software Engineer'} & ${dict.College || 'ITB Student'}`;
  const description = dict.SEO_Home_Description || `Portfolio of Muhammad Faran Aiki (Faran Aiki), a Software Engineer and student at Bandung Institute of Technology. Explore projects, work experience, and insights from Faran.`;

  return {
    ...baseMetadata,
    title,
    description,
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
      url: `${SITE_URL}/${lang}`,
    },
    alternates: {
      canonical: `/${lang}`,
      languages: getLanguageAlternates(''),
    },
  };
}

export default async function HomePage({
  params 
}: { 
  params: Promise<{ lang: string }> 
}) {
  const nonce = (await headers()).get("x-nonce") || "";
  const { lang } = await params;
  const dict = await getDictionary(lang);
  

  let combinedActivity: NewsItem[] = [];
  try {
    const [fetchedNews, fetchedFeedbacks] = await Promise.all([
      getNews(),
      getFeedbacks()
    ]);
    
    const mappedFeedbacks = (fetchedFeedbacks || []).map((fb: { id: string, content: string, image: string | null, createdAt: Date, user?: { id: string, name: string | null, avatarUrl: string | null } | null }) => ({
      id: fb.id,
      title: dict.Feedback_From ? `${dict.Feedback_From} ${fb.user?.name || 'Anonymous'}` : `Feedback from ${fb.user?.name || 'Anonymous'}`,
      content: fb.content,
      image: fb.image || null,
      createdAt: fb.createdAt,
      author: {
        id: fb.user?.id || 'unknown',
        name: fb.user?.name || 'Anonymous',
        avatarUrl: fb.user?.avatarUrl || null,
      }
    })) as unknown as NewsItem[];

    combinedActivity = [...(fetchedNews as unknown as NewsItem[]), ...mappedFeedbacks]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error("Error fetching activity in HomePage:", error);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      getPersonSchema(lang),
      getWebsiteSchema(lang),
      getProfilePageSchema(lang)
    ]
  };

  return (
    <>
      <script nonce={nonce}         type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient dict={dict}>
        <LatestActivity lang={lang} dict={dict} initialNews={combinedActivity} />
      </HomeClient>
    </>
  );
}
