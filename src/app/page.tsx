// This is the main page

import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import AboutMe from '@/components/AboutMe'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "About Faran Aiki",
  description: "Faran Aiki's personal files, portfolio, and others",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className={`${inter.className} container mx-auto px-8 pt-24 pb-16`}>
        {children}
    <AboutMe /> {/* I don't know why I don't the about me here */}
    </main>
  );
}


