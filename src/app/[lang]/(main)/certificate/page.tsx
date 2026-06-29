import type { Metadata } from "next";
import "../../../globals.css";

import CertificatesDisplay from '@/components/portfolio/CertificatesDisplay';
import { getDictionary } from '@/components/layout/Translator';
import { getCertificatesData } from '@/lib/data';
import { getLanguageAlternates, getBaseMetadata, SITE_URL, getBreadcrumbSchema } from '@/lib/seo';
import { createClient } from '@/utils/supabase/server';
import { getBookmarks } from '@/app/bookmark-actions';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const baseMetadata = getBaseMetadata(dict);

  return {
    ...baseMetadata,
    title: `${dict.Certificate} | Faran Aiki`,
    description: dict.SEO_Certificate_Description || "Faran Aiki's professional certificates and achievements",
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${dict.Certificate} | Faran Aiki`,
      description: dict.SEO_Certificate_Description || "Faran Aiki's professional certificates and achievements",
      url: `${SITE_URL}/${lang}/certificate`,
    },
    alternates: { 
      canonical: `/${lang}/certificate`,
      languages: getLanguageAlternates('/certificate'),
    },
  };
}

export default async function CertificatePage({params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  const certificates_data = await getCertificatesData(lang);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;
  const bookmarks = isLoggedIn ? await getBookmarks(user.id) : [];
  const bookmarkedItemIds = bookmarks.filter(b => b.itemType === 'certificate').map(b => b.itemId);

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: dict.Home, item: `/${lang}` },
    { name: dict.Certificate, item: `/${lang}/certificate` },
  ]);

  return (
    <main className="container mx-auto px-4 sm:px-8 pb-16 pt-16">
      <h1 className="sr-only">{dict.Certificate}</h1>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CertificatesDisplay 
        certificates={certificates_data} 
        lang={lang} 
        allTranslation={dict.All} 
        click_to_close_text={dict.Click_To_Close}
        isLoggedIn={isLoggedIn}
        bookmarkedItemIds={bookmarkedItemIds}
      />
    </main>
  );
}
