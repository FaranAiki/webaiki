import type { Metadata } from "next";
import { getDictionary } from '@/components/layout/Translator';
import FeedbackDisplay from '@/components/interactive/FeedbackDisplay';
import { getBaseMetadata, getLanguageAlternates, SITE_URL } from '@/lib/seo';
import { createClient } from '@/utils/supabase/server';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  const title = `${dict.Feedback} - Muhammad Faran Aiki`;
  const description = dict.No_Feedback || "Share your feedback with us.";
  
  const baseMetadata = getBaseMetadata();
  
  return {
    ...baseMetadata,
    title,
    description,
    alternates: getLanguageAlternates(`${SITE_URL}/${lang}/feedback`),
  };
}

export default async function FeedbackPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="container mx-auto px-4 md:px-8 pt-32 pb-16 min-h-screen">
      <FeedbackDisplay dict={dict} lang={lang} currentUserId={user?.id || null} />
    </main>
  );
}
