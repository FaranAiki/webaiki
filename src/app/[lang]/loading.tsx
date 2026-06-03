import { headers } from "next/headers";
import { getDictionary } from "@/components/layout/Translator";
import Image from "next/image";

/**
 * Loading component for localized routes.
 * Designed to provide a beautiful, branded experience during serverless cold starts.
 */
export default async function Loading() {
  const locale = (await headers()).get("x-locale") || "id";
  const dict = await getDictionary(locale);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        body { overflow: hidden !important; }
      `}} />
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
            <h2 className="text-3xl md:text-4xl font-black text-gacor-smooth tracking-tighter animate-fade-in leading-tight drop-shadow-sm">
              {dict.Preparing_Portfolio || "Preparing the best portfolio site"}
            </h2>
            <p className="text-sm md:text-base font-bold text-theme-muted tracking-[0.3em] animate-pulse opacity-70">
              {dict.Waiting || "Wait ...."}
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
    </>
  );
}
