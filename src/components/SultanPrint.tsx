"use client";

import { useEffect, useState, useRef } from 'react';
import { useTheme } from 'next-themes';
import { usePresentation } from './PresentationContext';
import { useSettings, fonts } from './SettingsContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, FileCheck, AlertCircle, X } from 'lucide-react';

interface SultanPrintProps {
  labels?: {
    Creating: string;
    Ready: string;
    Failed: string;
    Description: string;
    Download: string;
    Estimating: string;
    Dismiss: string;
    Cancel: string;
  };
}

/**
 * SULTAN PRINT COORDINATOR
 * 
 * Triggers server-side PDF generation using Puppeteer.
 * Provides high-quality, vector-based, selectable text PDFs.
 */
export default function SultanPrint({ labels }: SultanPrintProps) {
  const { resolvedTheme } = useTheme();
  const { slideNumberFormat } = usePresentation();
  const { font, textAlign, textScale, letterSpacing, lineHeight } = useSettings();
  
  const [status, setStatus] = useState<'idle' | 'printing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  
  const abortControllerRef = useRef<AbortController | null>(null);

  // Default labels if not provided
  const l = labels || {
    Creating: "Sultan PDF is being created...",
    Ready: "Sultan PDF Ready!",
    Failed: "Print Failed",
    Description: "Rendering high-fidelity vector PDF",
    Download: "Download should start automatically",
    Estimating: "Estimating...",
    Dismiss: "Dismiss",
    Cancel: "Cancel"
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setStatus('idle');
      setProgress(0);
      console.log("Sultan Print cancelled by user.");
    }
  };

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    const handleSultanPrint = async () => {
      console.log("Initiating Sultan Print (Vector PDF)...");
      setStatus('printing');
      setProgress(5);
      setErrorMessage('');

      // Create new AbortController for this request
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Simulation of progress based on typical 10-15s wait
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          // Slowly slow down as we get closer
          const increment = prev < 50 ? 5 : prev < 80 ? 2 : 0.5;
          return prev + increment;
        });
      }, 500);

      try {
        const response = await fetch('/api/pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({ 
            url: window.location.href,
            theme: resolvedTheme,
            slideFormat: slideNumberFormat,
            settings: {
              font,
              textAlign,
              textScale,
              letterSpacing,
              lineHeight
            }
          })
        });

        clearInterval(progressInterval);

        if (response.ok) {
          setProgress(100);
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `faran-aiki-sultan-${Date.now()}.pdf`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          setStatus('success');
          
          // Reset after a delay
          setTimeout(() => setStatus('idle'), 3000);
        } else {
          setStatus('error');
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            setErrorMessage(errorData.error);
          } else {
            setErrorMessage("Server returned an unexpected error.");
          }
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
          return; // Ignore intentional cancellations
        }
        clearInterval(progressInterval);
        setStatus('error');
        setErrorMessage("Network error. Please try again.");
        console.error("Network error during Sultan Print:", error);
      } finally {
        abortControllerRef.current = null;
      }
    };

    window.addEventListener('sultan-print', handleSultanPrint);
    return () => {
        window.removeEventListener('sultan-print', handleSultanPrint);
        if (progressInterval) clearInterval(progressInterval);
        if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [resolvedTheme, slideNumberFormat, font, textAlign, textScale, letterSpacing, lineHeight]);

  const isDark = resolvedTheme === 'dark';
  
  // Find active font 
  const activeFont = fonts.find(f => f.name === font);
  
  // Calculate scaled font size for the popup (relative to its base sizes)
  const scale = textScale / 100;

  return (
    <AnimatePresence>
      {status !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className={`fixed bottom-8 right-8 z-[9999] w-80 overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl transition-colors ${activeFont?.variable || ''} ${activeFont?.class || ''}`}
          style={{
            backgroundColor: isDark ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            borderColor: isDark ? 'rgba(55, 65, 81, 1)' : 'rgba(229, 231, 235, 1)',
            fontFamily: 'inherit',
            lineHeight: lineHeight.toString(),
            letterSpacing: `${letterSpacing}px`
          }}
        >
          <div className="p-6">
            {/* Header Area with Optional Cancel Button */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${
                  status === 'printing' ? 'bg-cyan-500/20 text-cyan-500' :
                  status === 'success' ? 'bg-green-500/20 text-green-500' :
                  'bg-red-500/20 text-red-500'
                }`}>
                  {status === 'printing' && <Loader2 className="w-5 h-5 animate-spin" />}
                  {status === 'success' && <FileCheck className="w-5 h-5" />}
                  {status === 'error' && <AlertCircle className="w-5 h-5" />}
                </div>
                <div>
                  <h3 
                    className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                    style={{ fontSize: `${1.125 * scale}rem` }}
                  >
                    {status === 'printing' && l.Creating}
                    {status === 'success' && l.Ready}
                    {status === 'error' && l.Failed}
                  </h3>
                  <p 
                    className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                    style={{ fontSize: `${0.75 * scale}rem` }}
                  >
                    {status === 'printing' && l.Description}
                    {status === 'success' && l.Download}
                    {status === 'error' && errorMessage}
                  </p>
                </div>
              </div>

              {status === 'printing' && (
                <button 
                  onClick={handleCancel}
                  className="p-1 rounded-md hover:bg-gray-500/10 transition-colors text-gray-400 hover:text-red-500"
                  title={l.Cancel}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {status === 'printing' && (
              <div className="space-y-2">
                <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-cyan-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", damping: 15, stiffness: 100 }}
                  />
                </div>
                <div 
                  className="flex justify-between text-gray-400"
                  style={{ fontSize: `${0.625 * scale}rem` }}
                >
                  <span>{l.Estimating}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
              </div>
            )}

            {status === 'error' && (
              <button 
                onClick={() => setStatus('idle')}
                className="w-full py-2 font-bold rounded-lg bg-gray-200 dark:bg-gray-700 hover:opacity-80 transition-opacity"
                style={{ fontSize: `${0.75 * scale}rem` }}
              >
                {l.Dismiss}
              </button>
            )}
            
            {status === 'printing' && (
              <button 
                onClick={handleCancel}
                className="w-full mt-4 py-1.5 border border-red-500/20 text-red-500/80 hover:bg-red-500 hover:text-white transition-all text-xs font-bold rounded-lg"
                style={{ fontSize: `${0.75 * scale}rem` }}
              >
                {l.Cancel}
              </button>
            )}
          </div>
          
          {/* Progress shine effect */}
          {status === 'printing' && (
            <motion.div 
              className="absolute inset-0 pointer-events-none"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.05), transparent)'
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
