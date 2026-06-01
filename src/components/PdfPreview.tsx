'use client';

import { memo, useMemo, useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Use the local worker for better stability and to avoid external dependency issues.
const PDFJS_VERSION = '5.3.93';
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const CMAP_URL = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/cmaps/`;
const STANDARD_FONTS_URL = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/standard_fonts/`;

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
    <div ref={containerRef} className="w-full h-full overflow-hidden flex justify-center items-center bg-gray-700/50">
      {!isInView ? (
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
          <span className="text-[10px] text-white/40 uppercase font-black">PDF</span>
        </div>
      ) : (
        <Document
          key={fileUrl}
          file={fileUrl}
          className="flex justify-center"
          options={options}
          loading={<div className="text-white text-[10px] font-bold">...</div>}
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
