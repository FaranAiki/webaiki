import { Inter, Geist_Mono } from "next/font/google";
import "../globals.css";
import { headers } from 'next/headers';
import Script from 'next/script'

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

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

import { Providers } from "@/components/providers/Providers";
import { getDictionary } from "@/components/layout/Translator";
import { LOCALES } from "@/lib/seo";
import { getBackgrounds } from "@/lib/data";
import ClientOnlyWidgets from "@/components/providers/ClientOnlyWidgets";
import { cookies } from 'next/headers';
import { SlideNumberFormat } from "@/components/providers/PresentationContext";
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
  const cookieStore = await cookies();
  
  const initialIsPresentationMode = cookieStore.get('presentation_mode')?.value === 'true';
  const initialSlideNumberFormat = (cookieStore.get('presentation_slide_format')?.value as SlideNumberFormat) || 'binary';

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
    <html lang={lang} dir="ltr" suppressHydrationWarning={true} nonce={nonce}>
      <head>
        <meta name="google-site-verification" content="xZMulZsvn0xj7TrxhEN8O9KLWSmNIfx6tqFtOpbgOV4" />
      </head>
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}>
        <Providers 
          loadingLabel={dict.Preparing_Portfolio}
          sultanLabels={sultanLabels}
          initialIsPresentationMode={initialIsPresentationMode}
          initialSlideNumberFormat={initialSlideNumberFormat}
        >
          <CookieInitializer />
          <ClientOnlyWidgets backgrounds={backgrounds} />
          {children}
        </Providers>
        <Script
          strategy="lazyOnload"
          src="https://cloud.umami.is/script.js"
          data-website-id="a418298f-fdca-4df0-a3bf-be453b48eeaf"
          nonce={nonce}
        />
      </body>
    </html>
  );
}
