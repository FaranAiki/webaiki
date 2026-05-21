export const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

export const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

/**
 * Adds hair spaces (\u200A) between CJK characters.
 * Hair space is the thinnest space available in Unicode.
 */
export const formatCJK = (text: string, lang?: string) => {
  if (!text || (lang !== 'zh' && lang !== 'jp')) return text;
  
  // \u200A is Hair Space - virtually invisible but helps justification
  return text.replace(/([\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF])(?!\s|$)/g, '$1\u200A');
};
