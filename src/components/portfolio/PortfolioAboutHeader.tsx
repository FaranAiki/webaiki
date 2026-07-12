import Image from 'next/image';
import { formatCJK } from '@/lib/utils';
import dynamic from 'next/dynamic';

const HeroImageCarousel = dynamic(() => import('./HeroImageCarousel').then(m => m.HeroImageCarousel));

export type PortfolioAboutHeaderProps = {
  carouselPhotos: string[];
  faran_photo: string;
  about_philosophy_title: string;
  about_philosophy: string;
  about_principle_title: string;
  about_principle_1: string;
  about_principle_2: string;
  about_principle_3: string;
  about_vision_mission_title: string;
  about_vision_mission_1: string;
  about_vision_mission_2: string;
  about_vision_mission_3: string;
  about_title: string;
  about_text_1: string;
  about_text_2: string;
  lang?: string;
};

export function PortfolioAboutHeader(props: PortfolioAboutHeaderProps) {
  const textClass = "text-foreground/90 dark:text-foreground/80";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
      {/* Visual Identity */}
      <div className="lg:col-span-4 flex justify-center lg:justify-start">
        <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-full lg:aspect-square group transform-gpu">
          <div className="absolute inset-0 bg-theme-500/20 blur-[60px] rounded-full opacity-50 group-hover:opacity-80 transition-opacity" />
          <div className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-theme-500/20 dark:border-theme-500/30 bg-theme-surface/50 backdrop-blur-sm shadow-theme-shadow">
            
            {/* LCP Image Server Rendered */}
            {props.carouselPhotos && props.carouselPhotos.length > 0 && (
              <Image
                src={`/images/photo_faran_aiki/${props.carouselPhotos[0]}`}
                alt={props.faran_photo}
                fill
                className="object-cover absolute inset-0 z-0"
                sizes="(max-width: 768px) 120px, (max-width: 1024px) 256px, 384px"
                priority
                quality={70}
                fetchPriority="high"
              />
            )}
            
            {/* Client-side carousel that mounts on top */}
            {props.carouselPhotos && props.carouselPhotos.length > 1 && (
               <HeroImageCarousel photos={props.carouselPhotos} alt={props.faran_photo} />
            )}

          </div>
        </div>
      </div>

      {/* Narrative Identity */}
      <div className="lg:col-span-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter nav-active-gacor leading-none cursor-default hover:opacity-80 transition-opacity">
            {props.about_title}
          </h1>
          <p className="text-theme-700 dark:text-theme-300 font-bold tracking-tight text-xs md:text-sm flex gap-2 flex-wrap">
            <span className="hover:text-theme-600 dark:hover:text-theme-200 transition-colors cursor-default">{props.about_philosophy_title}</span>
            <span className="text-theme-muted">•</span>
            <span className="hover:text-theme-600 dark:hover:text-theme-200 transition-colors cursor-default">{props.about_vision_mission_title}</span>
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className={`text-sm md:text-base leading-relaxed ${textClass}`}>
              <span dangerouslySetInnerHTML={{ __html: formatCJK(props.about_text_1, props.lang) }} />
            </div>
            <div className="p-4 rounded-xl bg-theme-surface-strong border border-theme-border hover:scale-[1.02] transition-transform duration-300 group">
              <p className={`text-xs font-bold text-theme-700 dark:text-theme-300 mb-2 group-hover:text-theme-600 dark:group-hover:text-theme-200 transition-colors`}>{props.about_philosophy_title}</p>
              <div className={`text-sm italic ${textClass} opacity-80 group-hover:opacity-100 transition-opacity`}>
                <span dangerouslySetInnerHTML={{ __html: formatCJK(props.about_philosophy, props.lang) }} />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className={`text-sm md:text-base leading-relaxed ${textClass}`}>
              <span dangerouslySetInnerHTML={{ __html: formatCJK(props.about_text_2, props.lang) }} />
            </div>
            <div className="space-y-3">
               {[props.about_principle_1, props.about_principle_2, props.about_principle_3].filter(p => p && p.trim() !== "").map((p, i) => (
                 <div 
                    key={i} 
                    className="flex gap-3 items-start group cursor-default hover:translate-x-1 transition-transform"
                 >
                   <span className="w-1.5 h-1.5 rounded-full bg-theme-500 mt-1.5 shrink-0 group-hover:bg-theme-400 group-hover:scale-125 transition-all" />
                   <div className={`text-xs md:text-sm ${textClass} opacity-90 group-hover:opacity-100 transition-all`}>
                      <span dangerouslySetInnerHTML={{ __html: formatCJK(p, props.lang) }} />
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
