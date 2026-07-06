"use client";

import { Search } from "lucide-react";
import { useSettings } from "@/components/providers/SettingsContext";
import { getThemeLogoFilter } from "@/lib/utils";
import Image from "next/image";

export function NotFoundLogo() {
  const settings = useSettings();
  return (
    <div className="absolute inset-0 flex items-center justify-center">
       <div className="w-24 h-24 md:w-32 md:h-32 relative rounded-full overflow-hidden border-4 border-theme-500/50 shadow-2xl bg-theme-surface flex items-center justify-center p-4">
          <Image
            src="/icon.ico"
            alt="404 Not Found Faran Aiki Portfolio"
            width={80}
            height={80}
            unoptimized
            priority
            className="object-contain"
            style={{ 
              filter: getThemeLogoFilter(settings?.color || ''),
              transition: 'filter 0.3s ease-in-out'
            }}
          />
       </div>
    </div>
  );
}

export function NotFoundSearchButton({ placeholder }: { placeholder: string }) {
  return (
    <div className="w-full max-w-md mb-12">
      <button 
        onClick={() => window.dispatchEvent(new Event('open-command-palette'))}
        className="w-full flex items-center justify-between px-4 py-4 bg-theme-surface-strong border border-theme-border rounded-2xl hover:border-theme-500 hover:shadow-theme-shadow transition-all text-theme-muted group"
      >
        <div className="flex items-center gap-3">
          <Search size={20} className="group-hover:text-theme-500 transition-colors" />
          <span className="font-medium">{placeholder}</span>
        </div>
        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
          <kbd className="px-2 py-1 bg-theme-surface border border-theme-border rounded text-xs font-mono font-bold">⌘</kbd>
          <kbd className="px-2 py-1 bg-theme-surface border border-theme-border rounded text-xs font-mono font-bold">K</kbd>
        </div>
      </button>
    </div>
  );
}
