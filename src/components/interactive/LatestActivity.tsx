import React from 'react';
import { Newspaper, ArrowRight, User, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { NewsItem } from '@/lib/types';

interface LatestActivityProps {
  lang: string;
  dict: Record<string, string>;
  initialNews: NewsItem[];
}

export default function LatestActivity({ lang, dict, initialNews }: LatestActivityProps) {
  return (
    <section className="mt-8 md:mt-20 w-full no-print">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-theme-500/10 text-theme-500 shadow-sm border border-theme-500/20">
            <Newspaper size={24} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black nav-active-gacor tracking-tight">
            {dict.Latest_Activity || "Latest Activity"}
          </h2>
        </div>
        <Link
          href={`/${lang}/news`}
          aria-label="View all latest activity and news"
          className="flex items-center gap-2 text-sm font-bold text-theme-500 hover:text-theme-400 transition-colors group"
        >
          {dict.All || "All"}
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {initialNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          {initialNews.slice(0, 3).map((item, idx) => (
            <div
              key={item.id}
              className="group flex flex-col bg-theme-surface border border-theme-border rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1 h-full"
            >
              {item.image ? (
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={`${item.title} - Highlight Muhammad Faran Aiki Portfolio`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={idx === 0}
                    loading={idx === 0 ? "eager" : "lazy"}
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-theme-bg/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              ) : (
                <div className="h-48 bg-theme-surface-strong flex items-center justify-center text-theme-muted/30">
                  <Newspaper size={48} />
                </div>
              )}

              <div className="p-5 md:p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3 text-sm font-bold tracking-widest text-theme-muted">
                  <Calendar size={12} />
                  {new Date(item.createdAt).toLocaleDateString(lang, {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </div>

                <h3 className="text-xl font-black text-foreground group-hover:text-theme-500 transition-colors mb-3 line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-theme-muted text-sm line-clamp-3 mb-6 flex-1">
                  {item.content}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-theme-border/50">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-theme-border bg-theme-surface-strong flex items-center justify-center">
                      {item.author.avatarUrl ? (
                        <Image src={item.author.avatarUrl} alt="Author Faran Aiki Portfolio" width={24} height={24} />
                      ) : (
                        <User size={12} className="text-theme-muted" />
                      )}
                    </div>
                    <span className="text-sm font-bold text-theme-500">{item.author.name || "Admin"}</span>
                  </div>

                  <Link
                    href={`/${lang}/news`}
                    aria-label={`Read more about ${item.title}`}
                    className="text-sm font-black tracking-widest text-theme-muted group-hover:text-theme-500 transition-colors"
                  >
                    {dict.Read_More || "Read More"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-3xl border border-dashed border-theme-border flex flex-col items-center justify-center text-center">
          <Newspaper size={40} className="text-theme-muted/20 mb-4" />
          <p className="text-theme-muted font-bold">{dict.No_News || "No news yet."}</p>
        </div>
      )}
    </section>
  );
}
