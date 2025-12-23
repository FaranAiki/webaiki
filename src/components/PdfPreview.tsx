'use client';

// import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// don't use others
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

type PdfPreviewProps = {
  fileUrl: string;
};

export default function PdfPreview({ fileUrl }: PdfPreviewProps) {
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
      >
        {/* We only show the first page as a preview */}
        <Page pageNumber={1} width={300} renderTextLayer={false} renderAnnotationLayer={false} />
      </Document>
    </div>
  );
}
