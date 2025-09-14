"use client"; // Menandakan ini adalah Client Component

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, File, Link as LinkIcon } from 'lucide-react';
import collectionsData from '@/../public/json/college.json';

// Definisikan tipe data untuk TypeScript agar lebih aman
type CollectionsData = Record<string, Record<string, Record<string, string>>>;
const data: CollectionsData = collectionsData;

// This is where the fun begins
// TODO implement for docs, pdf, image, link, web, .etc
export default function InteractiveCollections() {
  const [activeSemester, setActiveSemester] = useState<string | null>(null);

  return (
    <main className="min-h-screen text-white p-4 sm:p-8">
      <div className="container mx-auto max-w-4xl animate-fade-in">
        <div className="flex flex-col items-center gap-4 animate-fade-in">

          {/* Gunakan Object.entries() untuk melakukan iterasi pada objek */}
          {Object.entries(data).map(([semesterName, courses]) => (
            <div
              key={semesterName}
              className="w-full max-w-2xl animate-up-to-down-in"
              onMouseEnter={() => setActiveSemester(semesterName)}
              onMouseLeave={() => setActiveSemester(null)}
            >
              <button
                className="w-full flex justify-between items-center text-left p-4 rounded-lg transition-colors duration-300 bg-gray-800 hover:bg-gray-700"
              >
                <span className="text-xl font-semibold">{semesterName}</span>
                <ChevronRight />
              </button>

              {/* Tampilkan detail mata kuliah jika semester ini aktif */}
              {activeSemester === semesterName && (
                <div className="mt-2 p-4 bg-gray-800 rounded-lg animate-fade-in">
                  {Object.entries(courses).map(([courseName, documents]) => (
                    <div key={courseName} className="mb-2">
                      <h3 className="font-medium">{courseName}</h3>
                      <ul className="list-disc list-inside ml-4 text-sm text-gray-400">
                        {Object.keys(documents).length > 0 ? (
                            Object.entries(documents).map(([docName, url]) => (
                                <li key={docName}>
                                    {url ? <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-2"><LinkIcon size={14}/>{docName}</a> : <span className="flex items-center gap-2 text-gray-600"><File size={14}/>{docName}</span>}
                                </li>
                            ))
                        ) : ( <li>No documents</li> )}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          
        </div>
      </div>
    </main>
  );
}

