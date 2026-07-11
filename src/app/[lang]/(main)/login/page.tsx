import { getDictionary } from '@/components/layout/Translator';
import LoginForm from '@/components/interactive/LoginForm';
import ClientAuthWrapper from '@/components/layout/ClientAuthWrapper';

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
