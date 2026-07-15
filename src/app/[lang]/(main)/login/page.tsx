import { getDictionary } from '@/components/layout/Translator';
import LoginForm from '@/components/interactive/LoginForm';
import ClientAuthWrapper from '@/components/layout/ClientAuthWrapper';
import type { Metadata } from "next";
import { getLanguageAlternates, getBaseMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','navbar','login']);
  const baseMetadata = getBaseMetadata();

  return {
    ...baseMetadata,
    title: `${dict.Login || 'Login'} | Faran Aiki`,
    alternates: {
      canonical: `/${lang}/login`,
      languages: getLanguageAlternates('/login'),
    },
    robots: {
      index: false,
      follow: false,
    }
  };
}

export default async function LoginPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','navbar','login']);

  return (
    <ClientAuthWrapper requireGuest>
      <div className="container mx-auto px-4 py-20">
        <LoginForm dict={dict} lang={lang} />
      </div>
    </ClientAuthWrapper>
  );
}
