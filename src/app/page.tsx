import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import AskMePopup from "@/components/AskMePopup";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} relative min-h-screen bg-gray-900 text-gray-100`}>
        <Header />
        <main className="container mx-auto px-8 pt-24 pb-16">
          {children}
        </main>
        <AskMePopup />
      </body>
    </html>
  );
}


