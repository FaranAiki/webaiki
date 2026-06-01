import { getDictionary } from '@/components/Translator';

import { getLanguageAlternates } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    metadataBase: new URL('https://faranaiki.id'),
    title: `${dict.Latest} | Faran Aiki`,
    description: "Faran Aiki's Latest Information",
    openGraph: {
      title: `${dict.Latest} | Faran Aiki`,
      description: "Faran Aiki's Latest Information",
      url: `https://faranaiki.id/${lang}/latest`,
      siteName: "faranaiki.id",
      type: "website",
      images: [
        {
          url: '/images/photo_faran_aiki/1_fa_photo_linkedin.webp',
          width: 1200,
          height: 630,
          alt: 'Faran Aiki',
        },
      ],
    },
    icons: {
      icon: '/icon.ico',
      shortcut: '/icon.ico',
      apple: '/icon.ico',
    },
    alternates: {
      canonical: `/${lang}/latest`,
      languages: getLanguageAlternates('/latest'),
    },
  };
}

export default async function LatestPage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="container mx-auto px-8 pt-24 pb-16">
      {children}
    </main>
  );
}
