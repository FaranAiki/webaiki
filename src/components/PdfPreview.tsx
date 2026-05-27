'use client';

// import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Fix: Use the Unpkg CDN that exactly matches your installed pdfjs version.
// This prevents 404 errors, stops the "fake worker", and restores website speed.
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const CMAP_URL = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`;

type PdfPreviewProps = {
  fileUrl: string;
  width?: number;
};

export default function PdfPreview({ fileUrl, width = 300 }: PdfPreviewProps) {
  /*
  const [numPages, setNumPages] = useState<number | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }*/

  return (
    <div className="w-full h-full overflow-hidden flex justify-center items-center bg-gray-700">
      {/* if needed, add this line */}
      {/* onLoadSuccess={onDocumentLoadSuccess} */}
      <Document
        file={fileUrl}
        className="flex justify-center"
        options={{
          cMapUrl: CMAP_URL,
          cMapPacked: true,
        }}
      >
        {/* We only show the first page as a preview */}
        <Page pageNumber={1} width={width} renderTextLayer={false} renderAnnotationLayer={false} />
      </Document>
    </div>
  );
}
