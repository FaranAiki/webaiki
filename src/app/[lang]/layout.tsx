import Script from "next/script";
import "../globals.css";
import { getBaseMetadata } from "@/lib/seo";
import { Suspense } from 'react';
import { Providers } from "@/components/providers/Providers";

import { ProvidersConfigurator } from "@/components/providers/Providers";
import { getDictionary } from "@/components/layout/Translator";
import { LOCALES } from "@/lib/seo";
import { CookieInitializer } from "@/components/providers/CookieInitialize";
import PageTransitionLoader from "@/components/layout/PageTransitionLoader";

export const metadata = getBaseMetadata();

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

  const nonce = "";
  const isBot = false; // We can't detect bot on server for static pages, but the inline script handles it on client.

  return (
    <html lang={lang} suppressHydrationWarning className={isBot ? 'is-bot' : ''}>
      <head>
        <meta name="strix-verification" content="strix-verify-c06f1485383fb06c8ff307fe69f30458" />

        <script nonce={nonce} dangerouslySetInnerHTML={{
          __html: `
            if (/bot|googlebot|lighthouse|google-hub|google-structured-data-testing-tool|bingbot|yandexbot|duckduckbot|slurp|ia_archiver|HeadlessChrome|Chrome-Lighthouse/i.test(navigator.userAgent)) {
              document.documentElement.classList.add('is-bot');
            }
          `
        }} />

        {/* AI Discovery Link */}
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="LLM-friendly text representation of this website" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="Core AI instruction set" />

        {/* Preconnect to third-party origins used at runtime (analytics + database) */}
        <link rel="preconnect" href="https://cloud.umami.is" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://ndutyvnkhavzchhjmzfm.supabase.co" crossOrigin="anonymous" />

        {/* Fallback for JS Disabled Users (Prevent Blank Canvas from FadeInSection) */}
        <noscript>
          <style>{`
            .opacity-0 { opacity: 1 !important; }
            .translate-y-8 { transform: translateY(0) !important; }
          `}</style>
        </noscript>
      </head>
      <body className="font-serif antialiased">
        <Providers nonce={nonce} isBot={isBot}>
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
            <PageTransitionLoader label={dict.Loading} />
          </Suspense>
          <div id="main-content">
            {children}
          </div>

          {/* Static Pattern Background (Zero JS bloat) */}
          <div
            className="fixed inset-0 z-[-10] pointer-events-none opacity-[0.16] dark:opacity-[0.09]"
            style={{
              backgroundImage: "url('/images/background/pattern_01.avif')",
              backgroundRepeat: 'repeat',
              backgroundSize: '740px 493px'
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
