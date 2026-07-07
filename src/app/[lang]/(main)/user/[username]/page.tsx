import { notFound } from "next/navigation";
import { getDictionary } from '@/components/layout/Translator';
import { getLanguageAlternates, getBaseMetadata, SITE_URL } from '@/lib/seo';
import type { Metadata } from "next";
import { db } from '@/lib/db';
import { users, feedbacks } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import Image from "next/image";
import { User as UserIcon, Calendar, MessageSquare } from "lucide-react";
import PageEntrance from "@/components/shared/PageEntrance";
import { Star } from 'lucide-react';

type GenerateMetadataProps = {
  params: Promise<{ lang: string; username: string }>;
};

export async function generateMetadata({ params }: GenerateMetadataProps): Promise<Metadata> {
  const { lang, username } = await params;
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','user']);
  const baseMetadata = getBaseMetadata(dict);

  const decodedUsername = decodeURIComponent(username);
  
  const userList = await db.select().from(users).where(eq(users.username, decodedUsername));
  const user = userList[0];
  
  if (!user) {
    return {
      title: 'User Not Found | Faran Aiki',
    };
  }

  return {
    ...baseMetadata,
    title: `${user.name || user.username}'s Profile | Faran Aiki`,
    description: `View the profile of ${user.name || user.username} on Faran Aiki's Portfolio`,
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${user.name || user.username}'s Profile | Faran Aiki`,
      url: `${SITE_URL}/${lang}/user/${username}`,
    },
    alternates: { 
      canonical: `/${lang}/user/${username}`,
      languages: getLanguageAlternates(`/user/${username}`),
    },
  };
}

export default async function UserProfilePage({ params }: GenerateMetadataProps) {
  const { lang, username } = await params;
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','user']);
  
  const decodedUsername = decodeURIComponent(username);
  
  const userList = await db.select().from(users).where(eq(users.username, decodedUsername));
  const user = userList[0];

  if (!user) {
    notFound();
  }
  
  const userFeedbacks = await db.select().from(feedbacks).where(eq(feedbacks.userId, user.id));

  return (
    <main className="container mx-auto px-4 sm:px-8 py-16 md:py-24 min-h-[80vh]">
      <PageEntrance className="max-w-4xl mx-auto space-y-12">
        
        {/* Profile Header */}
        <div className="bg-theme-surface/50 border border-theme-border rounded-3xl p-8 md:p-12 shadow-xl backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-theme-500/10 to-transparent pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-theme-500/20 shadow-2xl flex-shrink-0 bg-theme-surface-strong">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={`${user.name || user.username} Profile Picture`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-theme-muted">
                  <UserIcon size={64} />
                </div>
              )}
            </div>
            
            <div className="text-center md:text-left space-y-3">
              <h1 className="text-4xl md:text-5xl font-black text-gacor-smooth tracking-tighter">
                {user.name || user.username}
              </h1>
              <p className="text-theme-muted font-medium text-lg flex items-center justify-center md:justify-start gap-2">
                <span className="text-theme-500 font-bold">@</span>{user.username}
              </p>
              
              <div className="flex items-center justify-center md:justify-start gap-4 pt-4 border-t border-theme-border/50">
                <div className="flex items-center gap-2 text-sm text-theme-muted bg-theme-surface-strong px-4 py-2 rounded-full border border-theme-border/50">
                  <Calendar size={16} />
                  <span>{dict.Joined} {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Activity */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-gacor-smooth tracking-tighter flex items-center gap-3">
            <MessageSquare className="text-theme-500" />
            {dict.Public_Feedbacks}
          </h2>
          
          {userFeedbacks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userFeedbacks.map((fb) => (
                <div key={fb.id} className="bg-theme-surface/50 border border-theme-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex text-yellow-500">{Array.from({length: fb.rating || 5}).map((_, i) => <Star key={i} size={16} className="fill-current" />)}</div>
                    <p className="mt-4 italic text-lg leading-relaxed text-theme-muted line-clamp-4">&quot;{fb.content}&quot;</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between text-xs text-theme-muted">
                    <span>{new Date(fb.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 bg-theme-surface/30 border border-theme-border rounded-2xl border-dashed">
              <p className="text-theme-muted font-medium">{dict.No_Public_Feedbacks}</p>
            </div>
          )}
        </div>
        
      </PageEntrance>
    </main>
  );
}
