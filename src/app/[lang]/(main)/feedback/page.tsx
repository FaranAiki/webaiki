import type { Metadata } from "next";
import { getDictionary } from '@/components/layout/Translator';
import FeedbackDisplay from '@/components/interactive/FeedbackDisplay';
import { getBaseMetadata, getLanguageAlternates } from '@/lib/seo';
import ClientAuthWrapper from '@/components/layout/ClientAuthWrapper';
import { Suspense } from 'react';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','navbar','feedback']);
  
  const title = `${dict.Feedback} - Muhammad Faran Aiki`;
  const description = dict.No_Feedback || "Share your feedback with us.";
  
  const baseMetadata = getBaseMetadata();
  
  return {
    ...baseMetadata,
    title,
    description,
    alternates: getLanguageAlternates('/feedback'),
  };
}

export default async function FeedbackPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','navbar','feedback']);

  return (
    <ClientAuthWrapper>
      <main className="container mx-auto px-4 md:px-8 pt-32 pb-16 min-h-screen">
        <Suspense fallback={<div>Loading feedback...</div>}>
          <FeedbackDisplay dict={dict} lang={lang} />
        </Suspense>
      </main>
    </ClientAuthWrapper>
  );
}
