import "../globals.css";
import { headers } from 'next/headers';
import Script from 'next/script'

import { ProvidersConfigurator } from "@/components/providers/Providers";
import { getDictionary } from "@/components/layout/Translator";
import { LOCALES } from "@/lib/seo";
import { getBackgrounds } from "@/lib/data";
import ClientOnlyWidgets from "@/components/providers/ClientOnlyWidgets";
import { CookieInitializer } from "@/components/providers/CookieInitialize";
import PageTransitionLoader from "@/components/layout/PageTransitionLoader";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function BaseLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const nonce = (await headers()).get('x-nonce') || undefined;
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const backgrounds = getBackgrounds();

  return (
    <div>
      <ProvidersConfigurator 
        loadingLabel={dict.Preparing_Portfolio}
      />
      <CookieInitializer />
      <ClientOnlyWidgets backgrounds={backgrounds} />
      <PageTransitionLoader label={dict.Loading} />
      {children}
      <Script
        strategy="lazyOnload"
        src="https://cloud.umami.is/script.js"
        data-website-id="a418298f-fdca-4df0-a3bf-be453b48eeaf"
        nonce={nonce}
      />
      <Script
        strategy="lazyOnload"
        src="https://platform.twitter.com/widgets.js"
        charSet="utf-8"
        nonce={nonce}
      />
    </div>
  );
}
