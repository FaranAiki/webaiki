import { headers } from "next/headers";
import { getDictionary } from '@/components/layout/Translator';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import BusinessRequestsClient from './BusinessRequestsClient';
import { Metadata } from 'next';
import { unstable_cache } from 'next/cache';

export const metadata: Metadata = {
  title: 'Business Requests | Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function BusinessRequestsPage({ params }: { params: Promise<{ lang: string }> }) {
  const nonce = (await headers()).get("x-nonce") || "";
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== 'faran.aiki.business@gmail.com') {
    redirect(`/${lang}`);
  }

  const getRequests = unstable_cache(
    async () => {
      return await db.query.hireRequests.findMany({
        with: {
          user: true,
        },
        orderBy: (hireRequests, { desc }) => [desc(hireRequests.createdAt)],
      });
    },
    ['business-requests'],
    { revalidate: 60, tags: ['business-requests'] }
  );
  
  const requests = await getRequests();

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">{dict.Business_Requests || 'Business Requests'}</h1>
      <BusinessRequestsClient requests={requests} dict={dict} />
    </div>
  );
}
