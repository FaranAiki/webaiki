"use client";

import Link from "next/link";
import { Home, Star, Search } from "lucide-react";
import { useSettings } from "@/components/providers/SettingsContext";
import { getThemeLogoFilter } from "@/lib/utils";
import Image from "next/image";

interface NotFoundClientProps {
  dict: import('@/components/layout/Translator').TranslationDict;
  lang: string;
}

export default function NotFoundClient({ dict, lang }: NotFoundClientProps) {
  const settings = useSettings();
  return (
    <div
      className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="relative mb-8">
        <div
          className="text-4xl md:text-5xl font-black opacity-10 leading-none select-none pointer-events-none"
        >
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-24 h-24 md:w-32 md:h-32 relative rounded-full overflow-hidden border-4 border-theme-500/50 shadow-2xl bg-theme-surface flex items-center justify-center p-4">
              <Image
                src="/icon.ico"
                alt="404 Not Found Faran Aiki Portfolio"
                width={80}
                height={80}
                unoptimized
                className="object-contain"
                style={{ 
                  filter: getThemeLogoFilter(settings?.color || ''),
                  transition: 'filter 0.3s ease-in-out'
                }}
              />
           </div>
        </div>

      </div>

      <h1 className="text-3xl md:text-5xl font-black mb-4 nav-active-gacor">
        {dict.Not_Found}
      </h1>

      <p className="text-lg text-theme-muted mb-12 max-w-md mx-auto">
        {dict.Not_Found_Description || "Ups! Halaman yang Anda cari sepertinya sedang tersesat di dimensi lain."}
      </p>

      <div className="w-full max-w-md mb-12">
        <button 
          onClick={() => window.dispatchEvent(new Event('open-command-palette'))}
          className="w-full flex items-center justify-between px-4 py-4 bg-theme-surface-strong border border-theme-border rounded-2xl hover:border-theme-500 hover:shadow-theme-shadow transition-all text-theme-muted group"
        >
          <div className="flex items-center gap-3">
            <Search size={20} className="group-hover:text-theme-500 transition-colors" />
            <span className="font-medium">{dict.Command_Palette_Search_Placeholder || "Type a command or search portfolio..."}</span>
          </div>
          <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
            <kbd className="px-2 py-1 bg-theme-surface border border-theme-border rounded text-xs font-mono font-bold">⌘</kbd>
            <kbd className="px-2 py-1 bg-theme-surface border border-theme-border rounded text-xs font-mono font-bold">K</kbd>
          </div>
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href={`/${lang}`}
          className="flex items-center space-x-2 px-6 py-3 rounded-full bg-theme-500 text-white font-bold hover:bg-theme-400 hover:scale-105 transition-all duration-200"
        >
          <Home size={20} />
          <span>{dict.Home}</span>
        </Link>
        <Link
          href={`/${lang}/portfolio`}
          className="flex items-center space-x-2 px-6 py-3 rounded-full bg-theme-surface border border-theme-border font-bold hover:bg-theme-surface-strong hover:scale-105 transition-all duration-200"
        >
          <Star size={20} className="text-theme-500" />
          <span>{dict.Portfolio}</span>
        </Link>
      </div>
    </div>
  );
}
