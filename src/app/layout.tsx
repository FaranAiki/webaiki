import type { Metadata } from "next";
import AskMePopup from "@/components/AskMePopup"
import Header from "@/components/Header";
import Background from "@/components/Background"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import fs from 'fs';
import path from 'path';

export function getBackgrounds() {
  const photosDir = path.join(process.cwd(), 'public', 'images', 'background');

  return fs.readdirSync(photosDir);
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <AskMePopup />
        <Background carousel={getBackgrounds()}/>
      </body>
    </html>
  );
}
