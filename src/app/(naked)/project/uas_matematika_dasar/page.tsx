// This is the main page

import type { Metadata } from "next";
import "../../globals.css";
import { Inter } from "next/font/google";
import AboutMe from '@/components/AboutMe';

import { t } from '@/components/Translator';

const inter = Inter({ subsets: ["latin"] });

export default function UasMTK() {
  return (
    <main className="w-full h-screen flex flex-col">
        <iframe
          credentialless="true"
          src="analitica-graph.web.app"
          className="w-full h-full border-none"
          title="UAS Matematika Dasar"
        />
    </main>
  );
}



