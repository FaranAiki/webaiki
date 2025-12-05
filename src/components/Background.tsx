"use client";

import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

const SLIDE_DURATION = 10000;

/**
 * A professional geometric pattern visualization.
 */
interface GeometricPatternProps {
  isDark: boolean;
}

function GeometricPattern({isDark}: GeometricPatternProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, isActive: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const PARTICLE_COUNT = 225;
    const CONNECTION_DISTANCE = 150; 
    const MOUSE_RADIUS = 100;
    const BASE_COLOR = isDark ? { r: 100, g: 200, b: 255 } : {r: 25, g: 125, b: 200}; 

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

      update(w: number, h: number) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;

        if (mouseRef.current.isActive) {
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

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${BASE_COLOR.r}, ${BASE_COLOR.g}, ${BASE_COLOR.b}, 0.6)`;
        ctx.fill();
      }
    }

    const init = () => {
        const dpr = window.devicePixelRatio || 1;
        const rect = container.getBoundingClientRect();
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        ctx.scale(dpr, dpr);
        
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          particles.push(new Particle(rect.width, rect.height));
        }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, width, height);
      
      particles.forEach((particle) => {
        particle.update(width, height);
        particle.draw();
      });

      connectParticles(width, height);
      
      animationFrameId = requestAnimationFrame(animate);
    };

    const connectParticles = (w: number, h: number) => {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < CONNECTION_DISTANCE) {
            const opacity = 1 - distance / CONNECTION_DISTANCE;
            ctx.strokeStyle = `rgba(${BASE_COLOR.r}, ${BASE_COLOR.g}, ${BASE_COLOR.b}, ${opacity * 0.3})`;
            ctx.lineWidth = 2;
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
    window.addEventListener('mousemove', handleMouseMove); 
    
    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed top-0 left-0 w-full h-full z-[-1] pointer-events-none">
      <canvas
        ref={canvasRef}
        className="block w-full h-full opacity-65"
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
  const { resolvedTheme } = useTheme(); // Use the hook to get the true theme state

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!carousel || carousel.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carousel.length);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [carousel]);

  if (!mounted) return null;

  const isDark = resolvedTheme === 'dark';

  return (
    <div className={`fixed inset-0 w-full h-full z-[-1] transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-white'}`}>
      
      <div className={`transition-opacity duration-500 w-full h-full absolute inset-0 ${isDark ? 'opacity-100' : 'opacity-20'}`}>
        {carousel.map((src, index) => (
            <div
                key={index}
                className={`blur-md absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                    index === currentIndex ? 'opacity-60' : 'opacity-0'
                }`}
            >
                <img
                    src={`/images/background/${src}`}
                    alt={`Background image ${index + 1}`}
                    className="w-full h-full object-cover"
                />
            </div>
        ))}
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
        <GeometricPattern isDark={isDark}/>
      </div>
    </div>
  );
}
