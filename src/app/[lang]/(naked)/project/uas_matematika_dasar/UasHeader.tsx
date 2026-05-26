"use client";

import { useState } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';

export default function UasHeader() {
  const [showDonation, setShowDonation] = useState(false);

  return (
    <>
      <div className="w-full h-12 bg-gray-900 text-white flex items-center justify-center gap-8 px-4 z-50 relative shadow-md shrink-0">
        <a 
          href="https://docs.google.com/forms/d/e/1FAIpQLSfTP1CXKHXdwSC-NtCjx3Lb1xt5NNGNYMzZo9_WA8GiKcEsuw/viewform?usp=dialog" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-cyan-400 font-semibold transition-colors duration-200 flex items-center gap-2"
        >
          Isi Survey
        </a>
        <div className="w-px h-6 bg-gray-700" /> {/* Divider */}
        <button 
          onClick={() => setShowDonation(true)}
          className="hover:text-cyan-400 font-semibold transition-colors duration-200 flex items-center gap-2"
        >
          Donasi
        </button>
      </div>

      {showDonation && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-6 rounded-xl shadow-2xl relative max-w-sm w-full animate-float">
            <button 
              onClick={() => setShowDonation(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition-colors bg-gray-100 rounded-full p-1"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">Dukungan / Donasi</h3>
            
            <div className="relative w-full aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
              {/* Replace the src below with your actual QRIS or donation image path */}
              <div className="text-center p-4">
                <Image 
                  src="/images/donation.webp" 
                  alt="Donasi QRIS" 
                  fill 
                  className="object-contain" 
                /> 
              </div>
            </div>
            
            <p className="text-center text-gray-600 mt-4 text-sm">
              Terima kasih atas dukungan Anda!
            </p>
          </div>
        </div>
      )}
    </>
  );
}
