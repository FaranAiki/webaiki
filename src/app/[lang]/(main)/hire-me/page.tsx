import { getDictionary } from '@/components/layout/Translator';
import HireMeForm from '@/components/interactive/HireMeForm';
import ClientAuthWrapper from '@/components/layout/ClientAuthWrapper';

export default async function HireMePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','navbar','hire-me']);

  return (
    <ClientAuthWrapper requireAuth>
      <div className="container mx-auto px-4 py-20">
        <HireMeForm dict={dict} />
      </div>
    </ClientAuthWrapper>
  );
}
