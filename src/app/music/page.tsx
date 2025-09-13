import type { Metadata } from "next";
import "../globals.css";
import { Inter } from "next/font/google";
import Link from 'next/link';
// import YouTube from '@/components/MusicLister'
// import PlaylistViewer from '@/components/YouTubePlaylistPlayer'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Faran Aiki's Music",
  description: "Faran Aiki's music made using either LMMS or other DAW",
};

// boo typescript 
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

const YOUTUBE_PLAYLIST_ITEMS_API = "https://www.googleapis.com/youtube/v3/playlistItems";
const SPOTIFY_PLAYLIST_ITEMS_API = ""
const SOUNDCLOUD_PLAYLIST_ITEMS_API = ""

// TODO HOW TO MAKE THIS INTO COMPONENTSSS
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 
  // Fetch component 
  const res = await fetch(`${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&playlistId=PLh4mbEw6q2QncQrgz5uaLYAcTA0MolCTe&key=${process.env.YOUTUBE_API_KEY}&maxResults=50`);
  
  if (!res.ok) {
    return <main className="text-white p-8">Cannot load playlist (is his account deleted?)</main>
  }

  const data = await res.json();

  return (
    <html lang="en">
      <body className={`${inter.className} relative min-h-screen bg-gray-900 text-gray-100`}>
        <main className="container mx-auto px-8 pt-12 pb-16">
          {children}
        </main>
      <div className="flex flex-col md:flex-row pt-2 gap-4 md:gap-4 max-w-4xl mx-auto">    
        <div className="text-center md:text-justify">
          <Link className="transition-all hover:text-green-500 duration-300 md:text-center text-4xl pt-4 md:text-5xl pt-4 font-bold text-white" href="https://open.spotify.com/artist/1PPAtm7YfRKghHpCqR3QZZ">
            Spotify
          </Link>
          <br></br>
          <br></br>

          <br></br>
          <br></br>
          <Link className="transition-all hover:text-orange-400 duration-300 md:text-center text-4xl pt-4 md:text-5xl pt-4 font-bold text-white" href="https://soundcloud.com/muhammadfaranaiki">
            SoundCloud
          </Link>
          <br></br>
          <br></br>

          <br></br>
          <br></br>
          <Link className="transition-all hover:text-red-500 duration-300 md:text-center text-4xl pt-4 md:text-5xl pt-4 font-bold text-white" href="https://www.youtube.com/playlist?list=PLh4mbEw6q2QncQrgz5uaLYAcTA0MolCTe">
            YouTube
          </Link>
          <br></br>
          <br></br>
          <ul className="grid grid-cols-1 sm:grid-cols-2 text-center md:grid-cols-3 lg:grid-cols-4 gap-6 opacity-100">
            {data.items.map(({ id, snippet = {} }) => {
            const { title, thumbnails = {}, resourceId = {} } = snippet;
            const { medium = {} } = thumbnails;
            return (
              <li key={id} className="opacity-80 bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 hover:opacity-100 transition-transform duration-300">
              <a href={`https://www.youtube.com/watch?v=${resourceId.videoId}`} target="_blank" rel="noopener noreferrer">
                <img 
                  width={medium.width} 
                  height={medium.height} 
                  src={medium.url} 
                  alt={title}
                  className="w-full h-auto object-cover"
                />
                  <div className="p-4">
                    <h3 className="font-semibold text-base h-16">{title}</h3>
                  </div>
                </a>
              </li>
             )
           })}
          </ul>
         </div>
      </div>
      </body>
    </html>
  );
}
