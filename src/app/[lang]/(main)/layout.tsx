import Header from "@/components/Header";
import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
// Replace React's per-request cache with Next.js's global cross-request cache
import { unstable_cache } from 'next/cache';

// Import Providers
import { Providers } from "@/components/Providers";
import { CookieInitializer } from '@/components/CookieInitialize';
import { headers } from 'next/headers';

// For Umami (GA-like provider) using Script instead of <script>
import Script from 'next/script'

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { getDictionary } from '@/components/Translator';

import fs from 'fs';
import path from 'path';

// Import Lucide Icons
import { 
  Home, 
  User, 
  Share2, 
  FileCheck, 
  Briefcase, 
  Users, 
  Trophy, 
  Palette, 
  Music, 
  BookOpen, 
  GraduationCap,
  Compass,
  Code
} from 'lucide-react';

import ClientOnlyWidgets from "@/components/ClientOnlyWidgets";

// Cache the background fetching globally across ALL requests!
export const getBackgrounds = unstable_cache(
  async () => {
    const photosDir = path.join(process.cwd(), 'public', 'images', 'background');
    if (!fs.existsSync(photosDir)) return [];
    return fs.readdirSync(photosDir);
  },
  ['background-images-cache'], // unique key for this cache
  { revalidate: false } // cache indefinitely until the next build or server restart
);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  // Retrieve the security nonce from headers
  const nonce = (await headers()).get('x-nonce') || undefined;

  // Use the url parameter directly and load dictionary synchronously
  const { lang } = await params;
  const dict = getDictionary(lang);
  
  // Await our globally cached backgrounds list
  const backgrounds = await getBackgrounds();

  // Navigation Links with Icons
  const navLinks = [
    { 
      name: dict.Home, 
      href: '/',
      icon: <Home size={18} />
    },
    
    { 
      name: dict.Profile, 
      href: '#',
      icon: <User size={18} />,
      subLinks: [
        { name: dict.Social, href: '/social', icon: <Share2 size={16} /> },
        { name: dict.Certificate, href:'/certificate', icon: <FileCheck size={16} /> },
      ]
    },

    { 
      name: dict.Experience, 
      href: '#',
      icon: <Compass size={18} />, 
      subLinks: [
        { name: dict.Work, href: '/work', icon: <Briefcase size={16} /> },
        { name: dict.Project, href: '/project', icon: <Code size={16} /> },
        { name: dict.Organization, href: '/organization', icon: <Users size={16} /> },
        { name: dict.Award, href: '/award', icon: <Trophy size={16} /> },
      ]
    },

    { 
      name: dict.Artwork, 
      href: '#',
      icon: <Palette size={18} />,
      subLinks: [
        { name: dict.Music, href: '/music', icon: <Music size={16} /> },
        { name: dict.Literature, href:'/literature', icon: <BookOpen size={16} /> },
      ]
    },

    { 
      name: dict.College, 
      href: '/college',
      icon: <GraduationCap size={18} />
    },
  ];

  return (
    <>
      <Header 
        navLinks={navLinks} 
        current_lang={lang} 
        en_lang={dict.English} 
        zh_lang={dict.Mandarin} 
        id_lang={dict.Indonesian} 
        jp_lang={dict.Japanese} 
        ru_lang={dict.Russian} 
        fr_lang={dict.French} 
        ar_lang={dict.Arabic} 
        select_lang={dict.Select_Language}
        presentation_mode={dict.Presentation_Mode}
      />
      {children}
      <ClientOnlyWidgets dict={dict} backgrounds={backgrounds} />
    </>
  );
}
