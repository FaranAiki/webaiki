"use client";

import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image'
import { useSettings } from './SettingsContext';

const SLIDE_DURATION = 10000;

interface GeometricPatternProps {
  isDark: boolean;
}

function GeometricPattern({isDark}: GeometricPatternProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, isActive: false });
  // Ref to track theme inside animation loop without restarting effect
  const isDarkRef = useRef(isDark);
  const { colorRGB } = useSettings();
  const colorRGBRef = useRef(colorRGB);

  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  useEffect(() => {
    colorRGBRef.current = colorRGB;
  }, [colorRGB]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const PARTICLE_COUNT = 80;
    const CONNECTION_DISTANCE = 150; 
    const MOUSE_RADIUS = 100;

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseX: number;
      baseY: number;

      constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.5; 
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
      }

      update(w: number, h: number, isMobile: boolean = false) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;

        if (!isMobile && mouseRef.current.isActive) {
          const dx = mouseRef.current.x - this.x;
          const dy = mouseRef.current.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < MOUSE_RADIUS) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;
            const directionX = forceDirectionX * force * 2; 
            const directionY = forceDirectionY * force * 2;

            this.x -= directionX;
            this.y -= directionY;
          }
        }
      }

      draw(currentColor: {r: number, g: number, b: number}) {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, 0.6)`;
        ctx.fill();
      }
    }

    const init = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap DPR for performance
        const rect = container.getBoundingClientRect();
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        ctx.scale(dpr, dpr);
        
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        particles = [];
        // Significant reduction for mobile performance
        let particleCount = PARTICLE_COUNT;
        if (rect.width < 480) particleCount = 12; // Lowered from 20
        else if (rect.width < 768) particleCount = 25; // Lowered from 40
        
        for (let i = 0; i < particleCount; i++) {
          particles.push(new Particle(rect.width, rect.height));
        }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      
      if (document.visibilityState === 'visible') {
        const width = canvas.width / (window.devicePixelRatio || 1);
        const height = canvas.height / (window.devicePixelRatio || 1);

        // Determine color based on current theme ref and selected color variant
        // In dark mode, we make it slightly more vibrant/lighter
        const BASE_COLOR = isDarkRef.current 
          ? { 
              r: Math.min(255, colorRGBRef.current.r + 50), 
              g: Math.min(255, colorRGBRef.current.g + 50), 
              b: Math.min(255, colorRGBRef.current.b + 50) 
            } 
          : colorRGBRef.current;

        ctx.clearRect(0, 0, width, height);
        
        const isMobile = width < 768;
        
        particles.forEach((particle) => {
          // Disable mouse interaction on mobile to save CPU
          particle.update(width, height, isMobile);
          particle.draw(BASE_COLOR);
        });

        connectParticles(width, height, BASE_COLOR);
        
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    const connectParticles = (w: number, h: number, color: {r: number, g: number, b: number}) => {
      // Reduce connection distance on mobile to further reduce drawing overhead
      const isMobile = w < 768;
      const maxDistance = isMobile ? CONNECTION_DISTANCE * 0.8 : CONNECTION_DISTANCE;
      const maxDistanceSq = maxDistance * maxDistance;
      
      ctx.lineWidth = 1.5;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistanceSq) {
            const distance = Math.sqrt(distSq);
            const opacity = 1 - distance / maxDistance;
            ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.3})`;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        isActive: true
      };
    };
    
    const handleResize = () => {
        init();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true }); 
    
    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // Run once, but use Ref for isDark updates

  return (
    <div ref={containerRef} className="absolute inset-0 z-[-1] pointer-events-none overflow-hidden contain-strict">
      {/* Added transition for canvas opacity to help smooth theme switches */}
      <canvas
        ref={canvasRef}
        className="block w-full h-full opacity-65 transition-opacity duration-1000 transform-gpu"
        style={{ backfaceVisibility: 'hidden' }}
      />
    </div>
  );
};

export type BackgroundProps = {
  carousel: string[]
};

export default function Background({ carousel }: BackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  // Preload first few images for smoother initial experience
  const [loadedIndices, setLoadedIndices] = useState<Set<number>>(new Set([0, 1]));
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!carousel || carousel.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % carousel.length;
        
        // Add the new index to our loaded set so it gets rendered and fetched
        setLoadedIndices((prev) => {
          if (prev.has(nextIndex)) return prev;
          const newSet = new Set(prev);
          newSet.add(nextIndex);
          return newSet;
        });

        return nextIndex;
      });
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [carousel]);

  return (
    <div className={`presentation-background sticky top-0 left-0 w-full h-screen -mb-[100vh] z-[-1] pointer-events-none transition-colors duration-[1500ms] ease-in-out bg-theme-bg dark:bg-theme-bg-dark transform-gpu contain-strict overflow-hidden`}>

      <div className={`transition-opacity duration-[1500ms] ease-in-out w-full h-full absolute inset-0 opacity-100 transform-gpu`} style={{ backfaceVisibility: 'hidden' }}>
        {carousel.map((src, index) => (
            <div
                key={index}
                className={`blur-sm md:blur-md absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out scale-110 transform-gpu will-change-[opacity,transform] ${
                    index === currentIndex ? 'opacity-60 z-0' : 'opacity-0 -z-10'
                }`}
                style={{ backfaceVisibility: 'hidden' }}
            >
                {/* Only render the Image if it's in our loadedIndices set */}
                {loadedIndices.has(index) && (
                  <Image
                      fill={true}
                      src={`/images/background/${src}`}
                      alt={`Background image ${index + 1}`}
                      className="w-full h-full object-cover"
                      sizes="100vw"
                      quality={75}
                      priority={index === 0}
                  />
                )}
            </div>
        ))}
        
        {/* Adjusted Gradient to improve text readability on all backgrounds with SLOW transition for epilepsy prevention */}
        <div 
          className="absolute inset-0 transition-[colors,opacity] duration-[1500ms] ease-in-out transform-gpu bg-gradient-to-b from-theme-surface/95 via-theme-surface/90 to-theme-surface" 
          style={{ backfaceVisibility: 'hidden' }}
        />
        
        {mounted && <GeometricPattern isDark={resolvedTheme === 'dark'}/>}
      </div>
    </div>
  );
}
