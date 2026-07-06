import "../globals.css";
import { Suspense } from 'react';

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
  
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const backgrounds = getBackgrounds();

  return (
    <div>
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100000] focus:p-4 focus:bg-background focus:text-foreground focus:outline-2 focus:outline-offset-2 focus:outline-theme-500 rounded-br-lg shadow-lg"
      >
        {dict.Skip_To_Content || "Skip to main content"}
      </a>
      <ProvidersConfigurator 
        loadingLabel={dict.Preparing_Portfolio}
      />
      <Suspense fallback={null}>
        <CookieInitializer />
      </Suspense>
      <ClientOnlyWidgets backgrounds={backgrounds} />
      <Suspense fallback={null}>
        <PageTransitionLoader label={dict.Loading} />
      </Suspense>
      <div id="main-content">
        {children}
      </div>

    </div>
  );
}
