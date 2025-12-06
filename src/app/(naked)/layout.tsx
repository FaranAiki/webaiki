import { Geist, Geist_Mono } from "next/font/google";

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { t, currentLanguage } from '@/components/Translator';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const current_lang = await currentLanguage();

  return (
    <html lang={current_lang} suppressHydrationWarning={true}>
      <head>
        <meta name="google-site-verification" content="xZMulZsvn0xj7TrxhEN8O9KLWSmNIfx6tqFtOpbgOV4" />
      </head>
      <body
      >
        {children}
      </body>
    </html>
  );
}
