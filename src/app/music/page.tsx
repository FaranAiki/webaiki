import type { Metadata } from "next";
import "../globals.css";
import { Inter } from "next/font/google";
import AboutMe from '@/components/AboutMe'
import Spotify from '@/components/MusicFinder'
import Link from 'next/link';

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
        <main className="container mx-auto px-8 pt-12 pb-16">
          {children}
        </main>
      <div className="flex flex-col md:flex-row pt-2 gap-4 md:gap-4 max-w-4xl mx-auto">    
        <div className="text-justify md:text-justify">
          <Link className="transition-all hover:text-green-500 duration-300 text-4xl pt-4 md:text-5xl pt-4 font-bold text-white" href="https://open.spotify.com/artist/1PPAtm7YfRKghHpCqR3QZZ">
            Spotify
          </Link>
          <br></br>
          <br></br>
          <Link className="transition-all hover:text-orange-400 duration-300  text-4xl pt-4 md:text-5xl pt-4 font-bold text-white" href="https://soundcloud.com/muhammadfaranaiki">
            SoundCloud
          </Link>
          <br></br>
          <br></br>
          <Link className="transition-all hover:text-red-500 duration-300 text-4xl pt-4 md:text-5xl pt-4 font-bold text-white" href="https://www.youtube.com/playlist?list=PLh4mbEw6q2QncQrgz5uaLYAcTA0MolCTe">
            YouTube
          </Link>
         </div>
      </div>
      </body>
    </html>
  );
}
