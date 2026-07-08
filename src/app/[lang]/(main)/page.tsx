export const dynamic = 'error';
import type { Metadata } from "next";
import { getDictionary } from '@/components/layout/Translator';
import { getLanguageAlternates, getBaseMetadata, SITE_URL, getPersonSchema, getWebsiteSchema, getProfilePageSchema } from '@/lib/seo';
import HomeClient from "./HomeClient";
import { getNews, getFeedbacks } from '@/app/actions';
import { NewsItem } from '@/lib/types';
import LatestActivity from '@/components/interactive/LatestActivity';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','navbar','news']);
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
  const { lang } = await params;
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','navbar','news']);
  

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

  const homeDict = {
    Word_See: dict.Word_See,
    Word_Do: dict.Word_Do,
    Word_Know: dict.Word_Know,
    Word_Search: dict.Word_Search,
    What_Do_You_Want_To_Base: dict.What_Do_You_Want_To_Base,
    Search_About_Faran: dict.Search_About_Faran,
    Command_Palette_Search_Placeholder: dict.Command_Palette_Search_Placeholder,
    Latest_Activity: dict.Latest_Activity,
    All: dict.All,
    Read_More: dict.Read_More,
    No_News: dict.No_News,
  } as import('@/components/layout/Translator').TranslationDict;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient dict={homeDict}>
        <LatestActivity lang={lang} dict={homeDict} initialNews={combinedActivity} />
      </HomeClient>
    </>
  );
}
