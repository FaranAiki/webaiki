import AskMePopup from "@/components/AskMePopup"
import Header from "@/components/Header";
import Background from "@/components/Background"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Import Providers
import { Providers } from "@/components/Providers";
import { CookieInitializer } from '@/components/CookieInitialize';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { t, currentLanguage } from '@/components/Translator';

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
export function getBackgrounds() {
  const photosDir = path.join(process.cwd(), 'public', 'images', 'background');
  // Check if directory exists to avoid build errors
  if (!fs.existsSync(photosDir)) return [];
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Navigation Links with Icons
  const navLinks = [
    { 
      name: await t('Home'), 
      href: '/',
      icon: <Home size={18} />
    },
    
    { 
      name: await t('Profile'), 
      href: '#',
      icon: <User size={18} />,
      subLinks: [
        { name: await t('Social'), href: '/social', icon: <Share2 size={16} /> },
        { name: await t('Certificate'), href:'/certificate', icon: <FileCheck size={16} /> },
      ]
    },

    { 
      name: await t('Experience'), 
      href: '#',
      // Changed to Compass to represent "Journey" and avoid duplicate Briefcase
      icon: <Compass size={18} />, 
      subLinks: [
        { name: await t('Work'), href: '/work', icon: <Briefcase size={16} /> },
        { name: await t('Project'), href: '/project', icon: <Code size={16} /> },
        { name: await t('Organization'), href: '/organization', icon: <Users size={16} /> },
        { name: await t('Award'), href: '/award', icon: <Trophy size={16} /> },
      ]
    },

    { 
      name: await t('Artwork'), 
      href: '#',
      icon: <Palette size={18} />,
      subLinks: [
        { name: await t('Music'), href: '/music', icon: <Music size={16} /> },
        { name: await t('Literature'), href:'/literature', icon: <BookOpen size={16} /> },
      ]
    },

    { 
      name: await t('College'), 
      href: '/college',
      icon: <GraduationCap size={18} />
    },
  ];

  // AskMePopup Data
  const typeOfWaitingAnswer = [
    await t('gemini_wait1'),
    await t('gemini_wait2'),
    await t('gemini_wait3'),
    await t('gemini_wait4'),
    await t('gemini_wait5'),
    await t('gemini_wait6'),
    await t('gemini_wait7'),
    await t('gemini_wait8')
  ];

  const ask_title = await t('Ask_About');
  const question_answer = await t('Question_Answer');
  const question_title = await t('Question_Title');
  const submit_q = await t('Submit');
  const waiting = await t('Waiting');
  const provide_question = await t('Provide_Question');
  
  // Header Translations
  const en_lang = await t('English');
  const id_lang = await t('Indonesian');
  const jp_lang = await t('Japanese');
  const ru_lang = await t('Russian');
  const fr_lang = await t('French');
  const ar_lang = await t('Arabic');
  const zh_lang = await t('Mandarin');
  const current_lang = await currentLanguage();
  const select_lang = await t('Select_Language');

  return (
    <html lang={current_lang} suppressHydrationWarning={true}>
      <head>
        <meta name="google-site-verification" content="xZMulZsvn0xj7TrxhEN8O9KLWSmNIfx6tqFtOpbgOV4" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <CookieInitializer />
          <Header 
            navLinks={navLinks} 
            current_lang={current_lang} 
            en_lang={en_lang} 
            zh_lang={zh_lang} 
            id_lang={id_lang} 
            jp_lang={jp_lang} 
            ru_lang={ru_lang} 
            fr_lang={fr_lang} 
            ar_lang={ar_lang} 
            select_lang={select_lang}
          />
          {children}
          <AskMePopup 
            typeOfWaitingAnswer={typeOfWaitingAnswer} 
            ask_title={ask_title} 
            question_title={question_title} 
            question_answer={question_answer} 
            submit={submit_q} 
            waiting={waiting} 
            provide_question={provide_question}
          />
          <Background carousel={getBackgrounds()}/>
        </Providers>
      </body>
    </html>
  );
}
