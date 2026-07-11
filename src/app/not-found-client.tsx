"use client";

import { Search } from "lucide-react";
import { useSettings } from "@/components/providers/SettingsContext";
import LogoIcon from "@/components/ui/LogoIcon";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export function NotFoundLogo() {
  const settings = useSettings();
  return (
    <div className="absolute inset-0 flex items-center justify-center">
       <div className="w-24 h-24 md:w-32 md:h-32 relative rounded-full overflow-hidden border-4 border-theme-500/50 shadow-2xl bg-theme-surface flex items-center justify-center p-4">
          <LogoIcon
            size={80}
            className="object-contain"
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

const validRoutes = [
  "portfolio", "news", "work", "project", "music", "literature",
  "academic-transcript", "timeline", "organization", "award",
  "hire-me", "social", "website", "certificate", "all", "identity",
  "feedback", "login", "register", "edit-profile", "latest"
];

function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(0));

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }
  return matrix[b.length][a.length];
}

const didYouMeanDict: Record<string, string> = {
  en: "Did you mean:",
  id: "Apakah maksud Anda:",
  zh: "您是说：",
  jp: "もしかして:",
  ru: "Возможно, вы имели в виду:",
  fr: "Vouliez-vous dire :",
  ar: "هل تقصد:",
  es: "¿Quisiste decir:",
  ko: "다음을 찾으시나요:",
  de: "Meinten Sie:",
  nl: "Bedoelde u:",
  ha: "Kuna nufin:",
  he: "האם התכוונת ל:",
  el: "Μήπως εννοούσατε:",
  hi: "क्या आपका मतलब है:",
  pt: "Você quis dizer:",
  bn: "আপনি কি বোঝাতে চেয়েছেন:",
  vi: "Có phải ý bạn là:",
};

export function NotFoundSuggester({ lang, label }: { lang: string, label: string }) {
  const pathname = usePathname();
  const [suggestion, setSuggestion] = useState<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    
    const segments = pathname.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1] || "";
    
    if (lastSegment.length > 2) {
      let bestMatch = null;
      let minDistance = Infinity;

      for (const route of validRoutes) {
        const dist = levenshtein(lastSegment.toLowerCase(), route.toLowerCase());
        if (dist < minDistance) {
          minDistance = dist;
          bestMatch = route;
        }
      }

      const threshold = lastSegment.length > 5 ? 3 : 2;
      if (bestMatch && minDistance <= threshold && minDistance > 0) {
        setSuggestion(bestMatch);
      }
    }
  }, [pathname]);

  if (!suggestion) return null;

  const currentLang = pathname?.split('/')[1] || lang;
  const actualLang = didYouMeanDict[currentLang] ? currentLang : lang;
  
  // Use localized label if available, otherwise fallback to the provided label
  const localizedLabel = didYouMeanDict[actualLang] || label;
  
  // Full domain URL format: https://faranaiki.id/id/work
  const displayUrl = `https://faranaiki.id/${actualLang}/${suggestion}`;

  return (
    <div className="mt-2 mb-8 p-4 bg-theme-500/10 border border-theme-500/20 rounded-xl text-theme-500 animate-in fade-in slide-in-from-bottom-2">
      {localizedLabel}{" "}
      <Link href={`/${actualLang}/${suggestion}`} className="font-bold underline underline-offset-4 hover:text-theme-600 transition-colors">
        {displayUrl}
      </Link>
    </div>
  );
}
