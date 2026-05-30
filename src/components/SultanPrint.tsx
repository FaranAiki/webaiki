"use client";

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { usePresentation } from './PresentationContext';

/**
 * SULTAN PRINT COORDINATOR
 * 
 * Triggers server-side PDF generation using Puppeteer.
 * Provides high-quality, vector-based, selectable text PDFs.
 */
export default function SultanPrint() {
  const { resolvedTheme } = useTheme();
  const { slideNumberFormat } = usePresentation();

  useEffect(() => {
    const handleSultanPrint = async () => {
      console.log("Initiating Sultan Print (Vector PDF)...");

      try {
        const response = await fetch('/api/pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            url: window.location.href,
            theme: resolvedTheme,
            slideFormat: slideNumberFormat
          })
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `sultan-presentation-${Date.now()}.pdf`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          console.log("Sultan Print successful.");
        } else {
          // Handle cases where the response might not be JSON (like HTML error pages)
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            console.error("Sultan Print failed:", errorData.error);
            alert(`Sultan Print failed: ${errorData.error}`);
          } else {
            const errorText = await response.text();
            console.error("Sultan Print failed with non-JSON response:", errorText.substring(0, 200));
            alert(`Sultan Print failed: Server returned an unexpected error. Please check server logs.`);
          }
        }
      } catch (error) {
        console.error("Network error during Sultan Print:", error);
      }
    };

    window.addEventListener('sultan-print', handleSultanPrint);
    return () => window.removeEventListener('sultan-print', handleSultanPrint);
  }, [resolvedTheme, slideNumberFormat]);

  return null;
}
