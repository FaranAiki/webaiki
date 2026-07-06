import { getDictionary } from '@/components/layout/Translator';
import { NotFoundLogo, NotFoundSearchButton, NotFoundSuggester } from "../not-found-client";
import Link from "next/link";
import { Home, Star } from "lucide-react";

/**
 * Localized Not Found page.
 * Wrapped by localized layout (src/app/[lang]/layout.tsx), 
 * which is wrapped by RootLayout (src/app/layout.tsx).
 */
export default async function NotFound() {
  const lang = 'en';
  const dict = await getDictionary(lang);

  return (
    <main className="container mx-auto px-4 md:px-8 pt-32 pb-16 min-h-[80vh] flex flex-col items-center justify-center text-center">
      <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="relative mb-8">
          <div className="text-4xl md:text-5xl font-black opacity-10 leading-none select-none pointer-events-none">
            404
          </div>
          <NotFoundLogo />
        </div>

        <h1 className="text-3xl md:text-5xl font-black mb-4 nav-active-gacor">
          {dict.Not_Found}
        </h1>

        <p className="text-lg text-theme-muted mb-4 max-w-md mx-auto">
          {dict.Not_Found_Description || "Ups! Halaman yang Anda cari sepertinya sedang tersesat di dimensi lain."}
        </p>
        
        <NotFoundSuggester lang={lang} label={dict.Did_You_Mean || "Apakah maksud Anda:"} />

        <NotFoundSearchButton placeholder={dict.Command_Palette_Search_Placeholder || "Type a command or search portfolio..."} />

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href={`/${lang}`}
            prefetch={false}
            className="flex items-center space-x-2 px-6 py-3 rounded-full bg-theme-500 text-white font-bold hover:bg-theme-400 hover:scale-105 transition-all duration-200"
          >
            <Home size={20} />
            <span>{dict.Home}</span>
          </Link>
          <Link
            href={`/${lang}/portfolio`}
            prefetch={false}
            className="flex items-center space-x-2 px-6 py-3 rounded-full bg-theme-surface border border-theme-border font-bold hover:bg-theme-surface-strong hover:scale-105 transition-all duration-200"
          >
            <Star size={20} className="text-theme-500" />
            <span>{dict.Portfolio}</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
