'use client';

import { memo, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Use the local worker for better stability and to avoid external dependency issues.
// NOTE: Ensure this version matches the worker in /public
const PDFJS_VERSION = '5.3.93';
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const CMAP_URL = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/cmaps/`;
const STANDARD_FONTS_URL = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/standard_fonts/`;

type PdfPreviewProps = {
  fileUrl: string;
  width?: number;
};

function PdfPreview({ fileUrl, width = 300 }: PdfPreviewProps) {
  // Memoize options to ensure a stable reference.
  const options = useMemo(() => ({
    cMapUrl: CMAP_URL,
    cMapPacked: true,
    standardFontDataUrl: STANDARD_FONTS_URL,
  }), []);

  return (
    <div className="w-full h-full overflow-hidden flex justify-center items-center bg-gray-700">
      {/* 
        The key={fileUrl} forces a complete re-mount of the Document when the source changes.
        This is a known fix for the "Node.removeChild" error in react-pdf/Next.js 
        where the DOM and React internal tree get out of sync during fast transitions.
      */}
      <Document
        key={fileUrl}
        file={fileUrl}
        className="flex justify-center"
        options={options}
        loading={<div className="text-white text-xs">Loading...</div>}
      >
        <Page 
          pageNumber={1} 
          width={width} 
          renderTextLayer={false} 
          renderAnnotationLayer={false}
        />
      </Document>
    </div>
  );
}

export default memo(PdfPreview);
