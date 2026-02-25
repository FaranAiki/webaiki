import AskMePopup from "@/components/AskMePopup"
import Header from "@/components/Header";
import Background from "@/components/Background"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Import Providers
import { Providers } from "@/components/Providers";
import { CookieInitializer } from '@/components/CookieInitialize';
import { headers } from 'next/headers';

// For Umami (GA-like provider) using Script instead of <script>
import Script from 'next/script'

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { getDictionary } from '@/components/Translator';

import { cache } from 'react';

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
  Compass, // Imported Compass for Experience/Journey
  Code // Imported Code for Project
} from 'lucide-react';

// Helper to get backgrounds
export const getBackgrounds = cache( () => {
  const photosDir = path.join(process.cwd(), 'public', 'images', 'background');
  // Check if directory exists to avoid build errors
  if (!fs.existsSync(photosDir)) return [];
  return fs.readdirSync(photosDir);
});

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
  // Nonce shit 
  const nonce = (await headers()).get('x-nonce') || undefined;

  // Use the url parameter directly and load dictionary
  const { lang } = await params;
  const dict = await getDictionary(lang);

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
      // Changed to Compass to represent "Journey" and avoid duplicate Briefcase
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

  // AskMePopup Data
  const typeOfWaitingAnswer = [
    dict.gemini_wait1,
    dict.gemini_wait2,
    dict.gemini_wait3,
    dict.gemini_wait4,
    dict.gemini_wait5,
    dict.gemini_wait6,
    dict.gemini_wait7,
    dict.gemini_wait8
  ];

  return (
    <html lang={lang} suppressHydrationWarning={true} nonce={nonce}>
      <CookieInitializer />
      <head>
        <meta name="google-site-verification" content="xZMulZsvn0xj7TrxhEN8O9KLWSmNIfx6tqFtOpbgOV4" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
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
          />
          {children}
          <AskMePopup 
            typeOfWaitingAnswer={typeOfWaitingAnswer} 
            ask_title={dict.Ask_About} 
            question_title={dict.Question_Title} 
            question_answer={dict.Question_Answer} 
            submit={dict.Submit} 
            waiting={dict.Waiting} 
            provide_question={dict.Provide_Question}
          />
          <Background carousel={getBackgrounds()}/>
        </Providers>
        <Script
          defer
          src="https://cloud.umami.is/script.js" 
          data-website-id="a418298f-fdca-4df0-a3bf-be453b48eeaf"
        />
      </body>
    </html>
  );
}
