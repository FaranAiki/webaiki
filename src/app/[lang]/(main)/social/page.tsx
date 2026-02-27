import { Metadata } from "next";
import { getDictionary } from '@/components/Translator';
import SocialDisplay from '@/components/SocialDisplay';
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://faranaiki.id/social'),
  title: "Faran Aiki's Social Media",
  description: "Faran Aiki's social media links and profiles",
  openGraph: {
    title: "Faran Aiki's Social Media",
    description: "Faran Aiki's Social Media",
    url: 'https://faranaiki.id/social',
    siteName: 'Faran Aiki\'s Social Media', 
    type: 'website',
  },
  icons: { icon: '/icon.ico', shortcut: '/icon.ico', apple: '/icon.ico' },
  alternates: { canonical: '/' },
};

export default async function SocialPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return (
    <main className="min-h-screen">
      <SocialDisplay pageTitle={dict.Social || "Social Media"} />
    </main>
  );
}
