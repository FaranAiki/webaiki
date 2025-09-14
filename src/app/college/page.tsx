import type { Metadata } from "next";
import "../globals.css";
import { Inter } from "next/font/google";

import InteractiveCollections from '@/components/InteractiveCollections';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Faran Aiki's Personal College Collection",
  description: "Faran Aiki's personal college collection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={`${inter.className} relative min-h-screen bg-gray-900 text-gray-100`}>
        <main className="container mx-auto pt-8 pb-16">
          {children}
        </main>
        <InteractiveCollections/>
      </body>
    </html>
  );
}
