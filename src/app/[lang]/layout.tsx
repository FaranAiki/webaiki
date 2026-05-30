import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { headers } from 'next/headers';
import Script from 'next/script'

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Providers } from "@/components/Providers";
import { getDictionary } from "@/components/Translator";
import { LOCALES } from "@/lib/seo";

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
  const dict = getDictionary(lang);

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
    <html lang={lang} suppressHydrationWarning={true} nonce={nonce}>
      <head>
        <meta name="google-site-verification" content="xZMulZsvn0xj7TrxhEN8O9KLWSmNIfx6tqFtOpbgOV4" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <Providers sultanLabels={sultanLabels}>
          {children}
        </Providers>
        <Script
          strategy="lazyOnload"
          src="https://cloud.umami.is/script.js"
          data-website-id="a418298f-fdca-4df0-a3bf-be453b48eeaf"
        />
      </body>
    </html>
  );
}
