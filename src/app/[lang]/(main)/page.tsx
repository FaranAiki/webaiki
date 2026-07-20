export const dynamic = 'error';
import type { Metadata } from "next";
import { getDictionary } from '@/components/layout/Translator';
import { getLanguageAlternates, getBaseMetadata, SITE_URL, getPersonSchema, getWebsiteSchema, getProfilePageSchema, getOrganizationSchema, getFaqSchema, getProfessionalServiceSchema } from '@/lib/seo';

import { getNews, getFeedbacks } from '@/app/actions';
import { NewsItem } from '@/lib/types';
import nextDynamic from 'next/dynamic';
import { Suspense } from 'react';
const LatestActivity = nextDynamic(() => import('@/components/interactive/LatestActivity'));

import HomeHero from "@/components/home/HomeHero";
import HomeSearchBar from "@/components/home/HomeSearchBar";
import FadeInSection from "@/components/shared/FadeInSection";
import HomeTutorialWrapper from "@/components/home/HomeTutorialWrapper";
import PortfolioAboutHeaderLazy from "@/components/portfolio/PortfolioAboutHeaderLazy";
import { getFaranAikiPhoto } from '@/lib/data';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const baseMetadata = getBaseMetadata(dict);

  const title = `${dict.Software_Engineer || 'Software Engineer'} & ${dict.College || 'ITB Student'}`;
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
  const dict = await getDictionary(lang);
  const faranPhotos = await getFaranAikiPhoto();

  // NOTE: the news/feedbacks query is intentionally NOT awaited here.
  // It runs inside <AsyncLatestActivity> below, wrapped in <Suspense>, so the
  // hero (the LCP text) streams immediately instead of blocking on DB latency.

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      getPersonSchema(lang),
      getWebsiteSchema(lang, ''),
      getOrganizationSchema(),
      getProfessionalServiceSchema(lang),
      getProfilePageSchema(lang),
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/${lang}#webpage`,
        "name": "Muhammad Faran Aiki (Faran Aiki)",
        "url": `${SITE_URL}/${lang}`,
        "description": "Muhammad Faran Aiki, also known as Faran Aiki or Faran, is a Software Engineer, Mathematics Enthusiast, ONMIPA Medalist, and Computer Science Student at ITB.",
        "about": { "@id": `${SITE_URL}/#person` },
        "isPartOf": { "@id": `${SITE_URL}/#website` },
        "inLanguage": lang,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${SITE_URL}/${lang}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      getFaqSchema([
        {
          question: "Who is Muhammad Faran Aiki?",
          answer: "Muhammad Faran Aiki is a Software Engineer, Mathematics Enthusiast, ONMIPA Medalist, and Computer Science Student at Institut Teknologi Bandung (ITB)."
        },
        {
          question: "Who is Faran Aiki?",
          answer: "Faran Aiki (Muhammad Faran Aiki) is an Indonesian Software Engineer, ITB student, and competitive mathematician known for his full-stack development portfolio and SAT tutoring."
        },
        {
          question: "Who is Faran?",
          answer: "In the context of technology and mathematics in Indonesia, 'Faran' usually refers to Muhammad Faran Aiki, a Software Engineer and Mathematics Enthusiast at ITB."
        },
        {
          question: "What does Muhammad Faran Aiki do?",
          answer: "He specializes in full-stack web development, mobile app development using Flutter, and Data Analysis. He is also a Mathematics Tutor and problem writer."
        },
        {
          question: "Where does Muhammad Faran Aiki study?",
          answer: "Muhammad Faran Aiki studies Computer Science / Informatics at Bandung Institute of Technology (ITB) in Indonesia."
        }
      ])
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

  const baseText = dict.What_Do_You_Want_To_Base || "What do you want to {word}";
  const parts = baseText.split("{word}");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-[50vh] flex flex-col items-center justify-center px-4 md:px-8 pt-24 md:pt-12 pb-12">
        <p className="sr-only">{dict.Search_About_Faran || "Search about Muhammad Faran Aiki"}</p>
        <div className="md:pt-0 pt-24 w-full max-w-6xl overflow-visible">
          <HomeHero dict={homeDict} parts={parts} />
          <HomeSearchBar dict={homeDict} />
          <HomeTutorialWrapper />

          {/* Latest Activity Section — streamed so the hero (LCP) paints
              immediately instead of blocking on the news/feedbacks query. */}
          <FadeInSection initialVisible={true}>
            <Suspense fallback={<div className="w-full h-64 animate-pulse rounded-2xl bg-theme-surface-strong/40" />}>
              <AsyncLatestActivity lang={lang} dict={homeDict} />
            </Suspense>
          </FadeInSection>

          <FadeInSection initialVisible={true}>
            <div className="md:mt-16 mt-32 pt-12 w-full pt-8 border-t border-black/10 dark:border-white/10">
              <PortfolioAboutHeaderLazy
                carouselPhotos={faranPhotos}
                faran_photo={dict.Faran_Photo || "Faran Aiki Photo"}
                about_title={dict.About_Me}
                about_text_1={dict.Faran_About_1}
                about_text_2={dict.Faran_About_2}
                about_philosophy_title={dict.Faran_Philosophy_Title}
                about_philosophy={dict.Faran_Philosophy}
                about_principle_title={dict.Faran_Principle_Title}
                about_principle_1={dict.Faran_Principle_1}
                about_principle_2={dict.Faran_Principle_2}
                about_principle_3=""
                about_vision_mission_title={dict.Faran_Vision_Mission_Title}
                about_vision_mission_1={dict.Faran_Vision_Mission_1}
                about_vision_mission_2={dict.Faran_Vision_Mission_2}
                about_vision_mission_3={dict.Faran_Vision_Mission_3}
                lang={lang}
              />
            </div>
          </FadeInSection>
        </div>
      </main>
    </>
  );
}

// Streamed server component: fetches the news/feedbacks data on the
// server (inside a Suspense boundary) so the above-the-fold hero
// is sent to the browser immediately instead of waiting on DB latency.
async function AsyncLatestActivity({
  lang,
  dict,
}: {
  lang: string;
  dict: import('@/components/layout/Translator').TranslationDict;
}) {
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
    console.error("Error fetching activity in AsyncLatestActivity:", error);
  }

  return <LatestActivity lang={lang} dict={dict} initialNews={combinedActivity.slice(0, 3)} />;
}
