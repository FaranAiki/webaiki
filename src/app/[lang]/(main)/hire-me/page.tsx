import { headers } from "next/headers";
import { getDictionary } from '@/components/layout/Translator';
import HireMeForm from '@/components/interactive/HireMeForm';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function HireMePage({ params }: { params: Promise<{ lang: string }> }) {
  const nonce = (await headers()).get("x-nonce") || "";
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${lang}/login`);
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <HireMeForm dict={dict} />
    </div>
  );
}
