"use client";

import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../providers/SettingsContext';

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
    let lastTime = 0;
    let lastMouseMoveTime = Date.now();
    const FULL_FPS_INTERVAL = 1000 / 20; 
    const IDLE_FPS_INTERVAL = 1000 / 5; // Drop to 5 FPS when idle

    const PARTICLE_COUNT = 40; 
    const CONNECTION_DISTANCE = 100; 
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
        const dpr = 1; // Cap DPR to 1 to save GPU
        const rect = container.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        ctx.scale(dpr, dpr);

        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        particles = [];
        // Significant reduction for mobile performance
        let particleCount = PARTICLE_COUNT;
        if (rect.width < 480) particleCount = 8; 
        else if (rect.width < 768) particleCount = 15; 

        for (let i = 0; i < particleCount; i++) {
          particles.push(new Particle(rect.width, rect.height));
        }
    };

    const animate = (currentTime: number) => {
      if (!ctx || !canvas) return;

      animationFrameId = requestAnimationFrame(animate);

      // Determine if we are idle (no mouse movement for 5 seconds)
      const isIdle = Date.now() - lastMouseMoveTime > 5000;
      const currentInterval = isIdle ? IDLE_FPS_INTERVAL : FULL_FPS_INTERVAL;

      // Throttle FPS
      const deltaTime = currentTime - lastTime;
      if (deltaTime < currentInterval) return;
      lastTime = currentTime - (deltaTime % currentInterval);

      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

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
        particle.update(width, height, isMobile);
      });

      // Batch drawing particles
      ctx.beginPath();
      ctx.fillStyle = `rgba(${BASE_COLOR.r}, ${BASE_COLOR.g}, ${BASE_COLOR.b}, 0.6)`;
      particles.forEach(p => {
        ctx.moveTo(p.x + p.size, p.y);
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      });
      ctx.fill();

      connectParticles(width, height, BASE_COLOR);
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
            const opacity = (1 - distance / maxDistance) * 0.3;
            ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      lastMouseMoveTime = Date.now();
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

    const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
            lastTime = performance.now();
            animationFrameId = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(animationFrameId);
        }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    init();
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // Run once, but use Ref for isDark updates

  return (
    <div ref={containerRef} className="absolute inset-0 z-[-1] pointer-events-none overflow-hidden contain-strict">
      <canvas
        ref={canvasRef}
        className="block w-full h-full opacity-65 transform-gpu"
        style={{ backfaceVisibility: 'hidden' }}
      />
    </div>
  );
};

export type BackgroundProps = {
  carousel: string[];
  showOverlay?: boolean;
};

export default function Background({ carousel, showOverlay = true }: BackgroundProps) {
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

  const isDark = mounted && resolvedTheme === 'dark';
  const overlayClass = !mounted
    ? "from-theme-surface/90 via-theme-surface/75 to-theme-surface/95" // Default for SSR
    : isDark
      ? "from-theme-surface/93 via-theme-surface/85 to-theme-surface/93"
      : "from-theme-surface/85 via-theme-surface/85 to-theme-surface/85";

  return (
    <div className={`presentation-background sticky top-0 left-0 w-full h-screen -mb-[100vh] z-[-1] pointer-events-none transform-gpu contain-strict overflow-hidden bg-theme-bg dark:bg-theme-bg-dark transition-colors duration-1000`}>

      <div className={`w-full h-full absolute inset-0 transform-gpu`} style={{ backfaceVisibility: 'hidden' }}>
        <AnimatePresence mode="wait">
            <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className={`blur-[4px] absolute inset-0 w-full h-full scale-105 transform-gpu will-change-[opacity]`}
                style={{ backfaceVisibility: 'hidden' }}
            >
                {loadedIndices.has(currentIndex) && (
                  <Image
                      fill={true}
                      src={`/images/background/${carousel[currentIndex]}`}
                      alt={`Background image ${currentIndex + 1}`}
                      className="w-full h-full object-cover"
                      sizes="100vw"
                      quality={75}
                      priority={currentIndex === 0}
                      loading={currentIndex === 0 ? "eager" : "lazy"}
                  />
                )}
            </motion.div>
        </AnimatePresence>

        {/* Adjusted Gradient to improve text readability on all backgrounds with SLOW transition for epilepsy prevention */}
        {showOverlay && (
          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            className={`absolute inset-0 transform-gpu bg-gradient-to-b ${overlayClass}`}
            style={{ backfaceVisibility: 'hidden' }}
            transition={{ duration: 1 }}
          />
        )}

        {mounted && <GeometricPattern isDark={isDark}/>}
      </div>
    </div>
  );
}
