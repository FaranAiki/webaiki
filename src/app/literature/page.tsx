import type { Metadata } from "next";
import "../globals.css";
import { Inter } from "next/font/google";

import InteractiveCollections from '@/components/InteractiveCollections';
import CollectionsData from '@/components/InteractiveCollections';

import literature_data from '@/../public/json/literature.json';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Faran Aiki in Literature",
  description: "Faran Aiki's short stories or poems",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="container mx-auto px-6 pb-16 pt-24">
      {children} 
      <InteractiveCollections data={literature_data} force_click={true} />
    </main>
  );
}
