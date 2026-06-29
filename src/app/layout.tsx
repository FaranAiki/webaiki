
import { Inter, Roboto_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: 'swap',
});

import { getBaseMetadata, getFaqSchema } from "@/lib/seo";

export const metadata = getBaseMetadata();


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = "id";
  // Static pages cannot use headers(). We use an empty nonce since proxy.ts allows unsafe-inline now.
  const nonce = "";
  const isBot = false; // We can't detect bot on server for static pages, but the inline script handles it on client.

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://cloud.umami.is" />
        <script nonce={nonce} dangerouslySetInnerHTML={{
          __html: `
            if (/bot|googlebot|lighthouse|google-hub|google-structured-data-testing-tool|bingbot|yandexbot|duckduckbot|slurp|ia_archiver|HeadlessChrome|Chrome-Lighthouse/i.test(navigator.userAgent)) {
              document.documentElement.classList.add('is-bot');
            }
          `
        }} />
      </head>
      <body className={`${inter.variable} ${robotoMono.variable} font-sans antialiased ${isBot ? 'is-bot' : ''}`}>
        <Providers nonce={nonce} isBot={isBot}>
          {children}
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
