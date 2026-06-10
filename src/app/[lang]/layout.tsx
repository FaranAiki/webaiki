import { Inter, Geist_Mono } from "next/font/google";
import "../globals.css";
import { headers } from 'next/headers';
import Script from 'next/script'

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Keep font configurations for nested specificity if needed, 
// though they are currently provided by RootLayout.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

import { ProvidersConfigurator } from "@/components/providers/Providers";
import { getDictionary } from "@/components/layout/Translator";
import { LOCALES } from "@/lib/seo";
import { getBackgrounds } from "@/lib/data";
import ClientOnlyWidgets from "@/components/providers/ClientOnlyWidgets";
import { CookieInitializer } from "@/components/providers/CookieInitialize";

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

  const sultanLabels = {
    Creating: dict.Sultan_PDF_Creating,
    Ready: dict.Sultan_PDF_Ready,
    Failed: dict.Sultan_PDF_Failed,
    Description: dict.Sultan_PDF_Description,
    Download: dict.Sultan_PDF_Download,
    Estimating: dict.Estimating,
    Dismiss: dict.Dismiss,
    Cancel: dict.Cancel
  };

  return (
    <div className={`${inter.variable} ${geistMono.variable}`}>
      <ProvidersConfigurator 
        loadingLabel={dict.Preparing_Portfolio}
        sultanLabels={sultanLabels}
      />
      <CookieInitializer />
      <ClientOnlyWidgets backgrounds={backgrounds} />
      {children}
      <Script
        strategy="lazyOnload"
        src="https://cloud.umami.is/script.js"
        data-website-id="a418298f-fdca-4df0-a3bf-be453b48eeaf"
        nonce={nonce}
      />
    </div>
  );
}
