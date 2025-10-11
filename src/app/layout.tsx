import AskMePopup from "@/components/AskMePopup"
import Header from "@/components/Header";
import Background from "@/components/Background"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { CookieInitializer }  from '@/components/CookieInitialize';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { t } from '@/components/Translator';

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navLinks = [
    { name: await t('Home'), href: '/' },
    { name: await t('Social'), href: '/social' },
    { name: await t('Certificate'), href:'/certificate' },
    { name: await t('Music'), href: '/music' },
    // { name: t('Project'), href: '/project' },
    { name: await t('College'), href: '/college' },
    { name: await t('Literature'), href: '/literature' },
    // { name: t('Latest'), href: '/latest' },
  ];

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
 
  const en_lang = await t('English');
  const id_lang = await t('Indonesian');
  const jp_lang = await t('Japanese');

  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="xZMulZsvn0xj7TrxhEN8O9KLWSmNIfx6tqFtOpbgOV4" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CookieInitializer />
        <Header navLinks={navLinks} en_lang={en_lang} id_lang={id_lang} jp_lang={jp_lang} />
        {children}
        <AskMePopup typeOfWaitingAnswer={typeOfWaitingAnswer} ask_title={ask_title} question_title={question_title} question_answer={question_answer} submit={submit_q} waiting={waiting} provide_question={provide_question}/>
        <Background carousel={getBackgrounds()}/>
      </body>
    </html>
  );
}
