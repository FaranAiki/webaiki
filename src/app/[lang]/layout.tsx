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

export default async function BaseLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const nonce = (await headers()).get('x-nonce') || undefined;
  const { lang } = await params;

  // We can fetch dictionary here if needed, but sub-layouts also do it.
  // For now, let's just provide the basic structure.

  return (
    <html lang={lang} suppressHydrationWarning={true} nonce={nonce}>
      <head>
        <meta name="google-site-verification" content="xZMulZsvn0xj7TrxhEN8O9KLWSmNIfx6tqFtOpbgOV4" />
      </head>
      <body className={`${geistSans.className} ${geistMono.variable} antialiased`}>
        <Providers>
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
