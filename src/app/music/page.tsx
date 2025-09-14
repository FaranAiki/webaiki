import type { Metadata } from "next";
import "../globals.css";
import { Inter } from "next/font/google";
import Link from 'next/link';
import Image from 'next/image';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Faran Aiki's Music",
  description: "Faran Aiki's music made using either LMMS or other DAW",
};

// Boo typescripts
interface PlaylistItem {
  id: string;
  snippet: {
    title: string;
    thumbnails: {
      medium: {
        url: string;
        width: number;
        height: number;
      };
    };
    resourceId: {
      videoId: string;
    };
  };
}

// We don't use iframe for YouTube, but shows playlist
const YOUTUBE_PLAYLIST_ITEMS_API = "https://www.googleapis.com/youtube/v3/playlistItems";

// TODO HOW TO MAKE THIS INTO COMPONENTSSS
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 
  // Fetch component from YouTube playlist 
  const res = await fetch(`${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&playlistId=PLh4mbEw6q2QncQrgz5uaLYAcTA0MolCTe&key=${process.env.YOUTUBE_API_KEY}&maxResults=50`);
  
  if (!res.ok) {
    return <main className="text-white p-8">Cannot load playlist (is his account deleted?)</main>
  }

  const youtubeData = await res.json();

  return (
    <html lang="en">
      <body className={`${inter.className} relative min-h-screen bg-gray-900 text-gray-100`}>
        <main className="container mx-auto pt-12 pb-16">
          {children}
        </main>
      <div className="flex flex-col md:flex-row pt-2 gap-4 md:gap-4 max-w-4xl mx-auto">    
        <div className="text-center md:text-justify">
          <Link className="transition-all hover:text-green-500 duration-300 md:text-center text-5xl pt-4 font-bold text-white" href="https://open.spotify.com/artist/1PPAtm7YfRKghHpCqR3QZZ">
            Spotify
          </Link>
          <br></br>
          <br></br>
            <iframe
              className="animate-fade-in"
              title="Spotify Artist Player"
              data-testid="embed-iframe"
              style={{ borderRadius: '12px' }}
              src="https://open.spotify.com/embed/artist/1PPAtm7YfRKghHpCqR3QZZ?utm_source=generator"
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>
          <br></br>
          <br></br>
          <Link className="transition-all hover:text-orange-400 duration-300 md:text-center text-5xl pt-4 font-bold text-white" href="https://soundcloud.com/muhammadfaranaiki">
            SoundCloud
          </Link>
          <br></br>
          <br></br>
          <iframe
            className="animate-fade-in"
            width="100%" 
            height="300" 
            scrolling="no" 
            frameBorder="no" 
            allow="autoplay"  
            src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/users/667105430&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=false&visual=false&show_artwork=false"   ></iframe>
          <br></br>
          <br></br>
          <Link className="transition-all hover:text-red-500 duration-300 md:text-center text-5xl pt-4 font-bold text-white" href="https://www.youtube.com/playlist?list=PLh4mbEw6q2QncQrgz5uaLYAcTA0MolCTe">
            YouTube
          </Link>
          <br></br>
          <br></br>
        <section>
          {youtubeData.items.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
              {youtubeData.items.map((item: PlaylistItem) => (
                <li key={item.id} className="bg-gray-800 rounded-lg overflow-visible shadow-lg transform hover:scale-105 transition-all hover:text-cyan-300 duration-300">
                  <a href={`https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`} target="_blank" rel="noopener noreferrer">
                    <Image 
                      width={item.snippet.thumbnails.medium.width} 
                      height={item.snippet.thumbnails.medium.height} 
                      src={item.snippet.thumbnails.medium.url} 
                      alt={item.snippet.title}
                      className="w-full h-auto object-cover"
                    />
                    <div className="p-3">
                      <h3 className="text-center font-semibold text-base h-16 overflow-auto no-scrollbar">{item.snippet.title}</h3>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">Cannot load video.</p>
          )}
        </section>
        </div>
      </div>
      </body>
    </html>
  );
}
