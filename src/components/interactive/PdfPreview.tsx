'use client';

import { memo, useMemo, useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const CMAP_URL = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`;
const STANDARD_FONTS_URL = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`;

type PdfPreviewProps = {
  fileUrl: string;
  width?: number;
  priority?: boolean; // If true, render immediately. If false, use IntersectionObserver.
};

function PdfPreview({ fileUrl, width = 300, priority = false }: PdfPreviewProps) {
  const [isInView, setIsInView] = useState(priority);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Memoize options to ensure a stable reference.
  const options = useMemo(() => ({
    cMapUrl: CMAP_URL,
    cMapPacked: true,
    standardFontDataUrl: STANDARD_FONTS_URL,
  }), []);

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden flex justify-center items-center bg-theme-surface-strong/50">
      {!isInView ? (
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-theme-surface/20 border-t-theme-500/80 rounded-full animate-spin" />
          <span className="text-sm text-theme-muted font-black">PDF</span>
        </div>
      ) : (
        <Document
          key={fileUrl}
          file={fileUrl}
          className="flex justify-center"
          options={options}
          loading={<div className="text-theme-muted text-sm font-bold">...</div>}
        >
          <Page
            pageNumber={1}
            width={width}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      )}
    </div>
  );
}

export default memo(PdfPreview);
