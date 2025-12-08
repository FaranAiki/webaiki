// This is the Flutter project

import type { Metadata } from "next";
import "../../globals.css";
import { Inter } from "next/font/google";
import UasHeader from "./UasHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://faranaiki.id/project/uas_matematika_dasar'),

  title: "Faran Aiki's Analitica and Math Project",
  description: "Faran Aiki's project to develop interactive widgets and AI explanations",
  
  openGraph: {
    title: "Faran Aiki's Analitica and Math Project",
    description: "Faran Aiki's project to develop interactive widgets and AI explanations",
    url: 'https://faranaiki.id/project/uas_matematika_dasar',
    siteName: 'Faran Aiki\'s Analitica and Math Project', 
    type: 'website',
  },

  icons: {
    icon: '/icon.ico',
    shortcut: '/icon.ico',
    apple: '/icon.ico',
  },
  
  alternates: {
    canonical: '/',
  },
};

export default function UasMTK() {
  return (
    <main className="w-screen h-screen flex flex-col overflow-hidden">
        <UasHeader />
        <div className="flex-1 w-full relative bg-gray-100">
            <iframe
              credentialless="true"
              src="https://analitica-graph.web.app/"
              className="w-full h-full border-none"
              title="UAS Matematika Dasar"
            />
        </div>
    </main>
  );
}
