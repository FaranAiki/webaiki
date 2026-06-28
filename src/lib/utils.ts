import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const shimmer = (w: number, h: number) => {
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * 0.2; // 20% of the shortest side
  const strokeWidth = Math.max(2, Math.min(w, h) * 0.04);

  return `
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <rect width="${w}" height="${h}" fill="transparent" />
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(150, 150, 150, 0.15)" stroke-width="${strokeWidth}" />
  <path d="M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx + r} ${cy}" fill="none" stroke="rgba(150, 150, 150, 0.7)" stroke-width="${strokeWidth}" stroke-linecap="round">
    <animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="0.5s" repeatCount="indefinite" />
  </path>
</svg>`;
};

export const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

/**
 * Adds hair spaces (\u200A) between CJK characters.
 * Hair space is the thinnest space available in Unicode.
 */
export const formatCJK = (text: string, lang?: string) => {
  if (!text || (lang !== 'zh' && lang !== 'jp' && lang !== 'ko')) return text;
  
  // \u200A is Hair Space - virtually invisible but helps justification
  // For Korean: \uAC00-\uD7AF (Hangul Syllables)
  return text.replace(/([\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF])(?!\s|$)/g, '$1\u200A');
};
