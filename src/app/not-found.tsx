"use server";

import { t } from '@/components/Translator';

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  const not_found_text = await t('Not_Found');
  return (
    <main className={`${inter.className} container mx-auto px-8 pt-24 pb-16`}>
        {children}
      <div className='flex text-center h-1/2 v-1/2 text-lg justify-center cursor-pointer'>
        <h1 className="hover:scale-105 transition-all duration-200 hover:text-cyan-400 hover:font-bold hover:opacity-75 cursor-pointer">
          {not_found_text}
        </h1>
      </div>
    </main>
  );
}
