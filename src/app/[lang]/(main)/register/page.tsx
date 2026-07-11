import { getDictionary } from '@/components/layout/Translator';
import RegisterForm from '@/components/interactive/RegisterForm';
import ClientAuthWrapper from '@/components/layout/ClientAuthWrapper';

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
