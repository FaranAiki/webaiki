"use client"; 

import { useState } from 'react';
import Link from 'next/link';
import collectionsData from '@/../public/json/college.json';
import { ChevronRight, Link as LinkIcon, FileText, XCircle } from 'lucide-react';

// Definisikan tipe data untuk TypeScript agar lebih aman
type CollectionsData = Record<string, Record<string, Record<string, string>>>;
const data: CollectionsData = collectionsData;

// This is where the fun begins
export default function InteractiveCollections() {
  const [activeSemester, setActiveSemester] = useState<string | null>(null);
  const [activeCourse, setActiveCourse] = useState<string | null>(null);
  const [leaveMouse, setLeaveMouse] = useState<bool>(false);

  return (
    <main className="min-h-screen text-white p-4 sm:p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col items-center gap-4">
          {Object.entries(data).map(([semesterName, courses]) => (
            (Object.entries(courses).length > 0) &&
            <div 
              key={semesterName}
              className="w-full max-w-2xl"
              onMouseEnter={() => !leaveMouse && setActiveSemester(semesterName)}
              onMouseLeave={() => activeCourse === null && setActiveSemester(null) && setLeaveMouse(false)}
            >
              <button
                onClick={() => setActiveSemester(null) && setLeaveMouse(true)}
                className={`w-full flex justify-between items-center text-left p-4 rounded-lg transition-all duration-300 ${
                  activeSemester === semesterName
                  ? 'bg-cyan-600/75 shadow-lg' 
                  : 'bg-gray-800/75 hover:bg-gray-700'
                }`}
              >
                <span className="font-semibold text-lg">{semesterName}</span>
                <ChevronRight className={`transition-transform duration-300 ${
                  activeSemester === semesterName ? 'transform rotate-90' : ''
                }`} />
              </button>

              {activeSemester === semesterName && (
                <div className="mt-2 bg-gray-800/50 p-6 rounded-lg shadow-xl border border-gray-700 animate-fade-in">
                  <ul className="space-y-4">
                    {Object.entries(courses).map(([courseName, documents]) => (
                      <li 
                        key={courseName}
                        onClick={() => activeCourse == courseName? setActiveCourse(null) : setActiveCourse(courseName)}
                      >
                        
                        {Object.entries(documents).length > 0 && (<h3 className="font-bold text-white-400 cursor-pointer hover:text-cyan-500">{courseName}</h3>)}
                        
                        {activeCourse === courseName && (
                           Object.keys(documents).length > 0 ? (
                            <ul className="pl-6 mt-2 space-y-2 list-inside text-gray-300 animate-fade-in">
                              {Object.entries(documents).map(([docName, url]) => (
                                <li key={docName}>
                                  {url ? (
                                    <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-cyan-300 transition-colors">
                                      <LinkIcon size={16} className="mr-2 flex-shrink-0" />
                                      <span>{docName}</span>
                                    </a>
                                  ) : (
                                    <span className="flex items-center text-gray-500 cursor-not-allowed">
                                      <XCircle size={16} className="mr-2 flex-shrink-0" />
                                      <span>{docName} (Not available)</span>
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="pl-6 mt-1 text-sm text-gray-500 italic animate-fade-in">No documents available.</p>
                          )
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );}

