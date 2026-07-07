import { getDictionary } from '@/components/layout/Translator';
import LoginForm from '@/components/interactive/LoginForm';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function LoginPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const supabase = await createClient();
  const [dict, { data: { user } }] = await Promise.all([
    getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','login']),
    supabase.auth.getUser()
  ]);

  if (user) {
    redirect(`/${lang}`);
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <LoginForm dict={dict} lang={lang} />
    </div>
  );
}
