import { getDictionary } from '@/components/layout/Translator';
import RegisterForm from '@/components/interactive/RegisterForm';
import ClientAuthWrapper from '@/components/layout/ClientAuthWrapper';
import type { Metadata } from "next";
import { getLanguageAlternates, getBaseMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','navbar','register']);
  const baseMetadata = getBaseMetadata();

  return {
    ...baseMetadata,
    title: `${dict.Register || 'Register'} | Faran Aiki`,
    alternates: {
      canonical: `/${lang}/register`,
      languages: getLanguageAlternates('/register'),
    },
    robots: {
      index: false,
      follow: false,
    }
  };
}

export default async function RegisterPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','navbar','register']);

  return (
    <ClientAuthWrapper requireGuest>
      <div className="container mx-auto px-4 py-20">
        <RegisterForm dict={dict} lang={lang} />
      </div>
    </ClientAuthWrapper>
  );
}
