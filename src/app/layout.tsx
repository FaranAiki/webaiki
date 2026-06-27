
import { Inter, Roboto_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
  preload: false,
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false,
});

import { getBaseMetadata, getFaqSchema } from "@/lib/seo";

export const metadata = getBaseMetadata();


import { headers } from 'next/headers';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = "id";
  const headersList = await headers();
  const nonce = headersList.get('x-nonce') || undefined;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://www.google.com" />
        <link rel="preconnect" href="https://cloud.umami.is" crossOrigin="anonymous" nonce={nonce} />
      </head>
      <body className={`${inter.variable} ${robotoMono.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getFaqSchema([
              {
                question: "Who is Muhammad Faran Aiki?",
                answer: "Muhammad Faran Aiki is a Software Engineer, Mathematics Enthusiast, ONMIPA Medalist, and Computer Science Student at Institut Teknologi Bandung (ITB)."
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
