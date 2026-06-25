import { getDictionary } from '@/components/layout/Translator';
import LoginForm from '@/components/interactive/LoginForm';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function LoginPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  if (user) {
    redirect(`/${lang}`);
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <LoginForm dict={dict} lang={lang} />
    </div>
  );
}
