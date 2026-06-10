"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * Client-side component for the loading screen.
 * Avoids useParams() and other potential SSR-suspending hooks to prevent Error #419.
 */
export default function LoadingClient() {
  const [text, setText] = useState("Preparing the best portfolio site");
  const [waitingText, setWaitingText] = useState("Wait ....");

  useEffect(() => {
    // Lock scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Determine language from URL path safely on client
    const pathParts = window.location.pathname.split('/');
    const lang = pathParts[1] || "id";

    const loadingTexts: Record<string, string> = {
      en: "Preparing the best portfolio site",
      id: "Menyiapkan situs portofolio terbaik",
      zh: "正在准备最佳作品集网站",
      jp: "最高のポートフォリオサイトを準備中",
      ru: "Подготовка лучшего сайта-портфолио",
      fr: "Préparation du meilleur site de portfolio",
      ar: "جاري تحضير أفضل موقع بورتفوليو",
      es: "Preparando el mejor sitio de portafolio",
      ko: "최고의 포트폴リオ 사이트 준비 중",
      de: "Vorbereitung der besten Portfolio-Website",
    };

    const waitingTexts: Record<string, string> = {
      en: "Wait ....",
      id: "Tunggu ....",
      zh: "请稍候 ....",
      jp: "お待ちください ....",
      ru: "Подождите ....",
      fr: "Attendez ....",
      ar: "انتظر ....",
      es: "Espere ....",
      ko: "잠시만 기다려주세요 ....",
      de: "Warten ....",
    };

    setText(loadingTexts[lang] || loadingTexts.en);
    setWaitingText(waitingTexts[lang] || waitingTexts.en);

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background theme-transition overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gacor blur-[150px] opacity-15 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gacor blur-[150px] opacity-15 animate-pulse delay-1000" />

      <div className="relative mb-12 flex flex-col items-center">
        {/* Radiant Glow behind the logo */}
        <div className="absolute inset-0 blur-3xl opacity-40 bg-gacor rounded-full scale-150 animate-pulse" />

        {/* Floating Logo Container */}
        <div className="relative p-6 bg-theme-surface/80 rounded-full shadow-2xl border border-theme-border animate-float backdrop-blur-xl ring-4 ring-white/5">
          <Image
            src="/icon.ico"
            alt="Faran Aiki"
            width={110}
            height={110}
            className="rounded-full shadow-lg"
            priority
          />
        </div>
      </div>

      {/* Branded Loading Content */}
      <div className="flex flex-col items-center gap-8 px-6 text-center max-w-lg">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-black text-gacor-smooth tracking-tighter animate-fade-in leading-tight drop-shadow-sm min-h-[3rem]">
            {text}
          </h2>
          <p className="text-sm md:text-base font-bold text-theme-muted tracking-[0.3em] animate-pulse opacity-70">
             {waitingText}
          </p>
        </div>

        {/* Sleek Progress Indicator */}
        <div className="relative w-80 h-3 bg-theme-surface-strong/50 rounded-full overflow-hidden border border-theme-border shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] backdrop-blur-sm">
          <div
            className="absolute inset-y-0 left-0 bg-gacor animate-gradient-x shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all duration-500"
            style={{ width: '100%' }}
          />
        </div>

        {/* Sub-Technical Indicator */}
        <div className="mt-2 flex items-center justify-center">
            <div className="relative">
                <div className="w-10 h-10 rounded-full border-2 border-theme-muted/20" />
                <div className="absolute top-0 left-0 w-10 h-10 rounded-full border-t-2 border-theme-500 animate-spin" />
            </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center opacity-30 animate-fade-in delay-500">
         <span className="text-xs font-bold tracking-[0.5em] text-theme-muted">
            Faran Aiki &copy; 2026
         </span>
      </div>
    </div>
  );
}
