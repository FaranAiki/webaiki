import type { Metadata } from "next";
import "../globals.css";
import { Inter } from "next/font/google";

import InteractiveCollections from '@/components/InteractiveCollections';

import college_data from '@/../public/json/college.json';

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
    <main className="container mx-auto pt-8 pb-16 pt-24">
      {children}
    <InteractiveCollections data={college_data} force_click={false} />
    </main>
  );
}
