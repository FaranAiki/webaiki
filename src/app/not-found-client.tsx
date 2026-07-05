"use client";
import { m as motion } from "framer-motion";
import Link from "next/link";
import { Home, Star } from "lucide-react";
import SearchBar from "@/components/shared/SearchBar";
import { useSettings } from "@/components/providers/SettingsContext";
import { getThemeLogoFilter } from "@/lib/utils";
import Image from "next/image";

interface NotFoundClientProps {
  dict: Record<string, string>;
  lang: string;
}

export default function NotFoundClient({ dict, lang }: NotFoundClientProps) {
  const settings = useSettings();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex flex-col items-center"
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
        <SearchBar dict={dict} />
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
    </motion.div>
  );
}
