import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { headers } from "next/headers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false,
});

import { getBaseMetadata, getFaqSchema } from "@/lib/seo";

export const metadata = getBaseMetadata();


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const nonce = headerList.get('x-nonce') || undefined;
  const locale = headerList.get('x-locale') || "id";

  return (
    <html lang={locale} suppressHydrationWarning nonce={nonce}>
      <head>
        <link rel="preconnect" href="https://www.google.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cloud.umami.is" crossOrigin="anonymous" />
        {process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL} crossOrigin="anonymous" />
        )}
        <script
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
          nonce={nonce}
        />
      </head>
      <body className={`${inter.variable} ${robotoMono.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
