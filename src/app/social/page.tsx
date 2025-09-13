import type { Metadata } from "next";
import "../globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Faran Aiki Website",
  description: "Faran Aiki's personal files, portfolio, and others",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} relative min-h-screen bg-gray-900 text-gray-100`}>
        <main className="container mx-auto px-8 pt-24 pb-16">
          {children}
        </main>
      </body>
    </html>
  );
}
