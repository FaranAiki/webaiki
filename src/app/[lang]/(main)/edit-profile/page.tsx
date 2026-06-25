import type { Metadata } from "next";
import { getDictionary } from '@/components/layout/Translator';
import EditProfileForm from '@/components/interactive/EditProfileForm';
import { getBaseMetadata, getLanguageAlternates } from '@/lib/seo';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  const title = `${dict.Edit_Profile} - Muhammad Faran Aiki`;
  const description = "Update your profile settings.";
  
  const baseMetadata = getBaseMetadata();

  return {
    ...baseMetadata,
    title,
    description,
    alternates: getLanguageAlternates('/edit-profile'),
  };
}

export default async function EditProfilePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) {
    redirect(`/${lang}/login?next=/${lang}/edit-profile`);
  }

  return (
    <main className="container mx-auto px-4 md:px-8 pt-32 pb-16 min-h-screen">
      <EditProfileForm dict={dict} user={user} />
    </main>
  );
}
