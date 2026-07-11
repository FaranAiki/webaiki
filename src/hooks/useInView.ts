import { useState, useEffect, useRef } from 'react';

export function useInView<T extends HTMLElement = HTMLElement>(options = {}) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.disconnect(); // Only trigger once
      }
    }, { rootMargin: '200px', ...options });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return { ref, isInView };
}
