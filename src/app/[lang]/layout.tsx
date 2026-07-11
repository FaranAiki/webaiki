import Script from "next/script";
import "../globals.css";
import { Suspense } from 'react';

import { Providers } from "@/components/providers/Providers";
import { getBaseMetadata, getFaqSchema } from "@/lib/seo";

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

        {/* LCP Preloads */}
        <link rel="preload" as="image" href="/images/background/pattern_01.avif" type="image/avif" fetchPriority="high" />
        <link rel="preload" as="image" href="/images/background/pattern_02.avif" type="image/avif" fetchPriority="high" />
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

        <Script
          id="faq-schema"
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getFaqSchema([
              {
                question: "Who is Muhammad Faran Aiki?",
                answer: "Muhammad Faran Aiki is a Software Engineer, Mathematics Enthusiast, ONMIPA Medalist, and Computer Science Student at Institut Teknologi Bandung (ITB)."
              },
              {
                question: "Who is Faran Aiki?",
                answer: "Faran Aiki (Muhammad Faran Aiki) is an Indonesian Software Engineer, ITB student, and competitive mathematician known for his full-stack development portfolio and SAT tutoring."
              },
              {
                question: "Who is Faran?",
                answer: "In the context of technology and mathematics in Indonesia, 'Faran' usually refers to Muhammad Faran Aiki, a Software Engineer and Mathematics Enthusiast at ITB."
              },
              {
                question: "What does Muhammad Faran Aiki do?",
                answer: "He specializes in full-stack web development, mobile app development using Flutter, and Data Analysis. He is also a Mathematics Tutor and problem writer."
              },
              {
                question: "Where does Muhammad Faran Aiki study?",
                answer: "Muhammad Faran Aiki studies Computer Science / Informatics at Bandung Institute of Technology (ITB) in Indonesia."
              }
            ]))
          }}
        />
      </body>
    </html>
  );
}
