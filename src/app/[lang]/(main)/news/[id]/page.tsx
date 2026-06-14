import type { Metadata } from "next";
import { getDictionary } from '@/components/layout/Translator';
import { getBaseMetadata, getLanguageAlternates, SITE_URL, getNewsArticleSchema } from '@/lib/seo';
import { getNewsItem } from '@/app/actions';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { User, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ lang: string, id: string }> }): Promise<Metadata> {
  const { lang, id } = await params;
  const news = await getNewsItem(id);
  
  if (!news) return getBaseMetadata();

  const baseMetadata = getBaseMetadata();

  return {
    ...baseMetadata,
    title: news.title,
    description: news.content.substring(0, 160),
    alternates: getLanguageAlternates(`${SITE_URL}/${lang}/news/${id}`),
    openGraph: {
      ...baseMetadata.openGraph,
      title: news.title,
      description: news.content.substring(0, 160),
      type: 'article',
      url: `${SITE_URL}/${lang}/news/${id}`,
      images: news.image ? [{ url: news.image }] : baseMetadata.openGraph?.images,
    },
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ lang: string, id: string }> }) {
  const { lang, id } = await params;
  const dict = await getDictionary(lang);
  const news = await getNewsItem(id);

  if (!news) notFound();

  const jsonLd = getNewsArticleSchema(news);

  return (
    <main className="container mx-auto px-4 md:px-8 pt-32 pb-16 min-h-screen max-w-4xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link 
        href={`/${lang}/news`}
        className="inline-flex items-center gap-2 text-theme-muted hover:text-theme-500 transition-colors mb-8 group"
      >
        <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
        {dict.Back_To_News || 'Back to News'}
      </Link>

      <article className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-foreground leading-tight">
            {news.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-theme-muted">
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-theme-border">
                {news.author.avatarUrl ? (
                  <Image
                    src={news.author.avatarUrl}
                    alt={news.author.name || 'Author'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-theme-surface-strong flex items-center justify-center">
                    <User size={20} />
                  </div>
                )}
              </div>
              <span className="font-bold text-foreground">{news.author.name || 'Admin'}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={20} />
              <span>
                {new Date(news.createdAt).toLocaleDateString(lang, { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>

        {news.image && (
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-theme-border shadow-2xl">
            <Image
              src={news.image}
              alt={news.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl text-theme-muted leading-relaxed whitespace-pre-wrap">
            {news.content}
          </p>
        </div>
      </article>
    </main>
  );
}
