"use client"; 

// TODO create another component 

import { useState } from 'react';
import { ChevronRight, Link as LinkIcon, XCircle } from 'lucide-react';

// Define typescript data
export type CollectionsData = Record<string, Record<string, Record<string, string>>>;

export type InteractiveCollectionsProps = {
  data: CollectionsData;
  force_click: boolean; // Use 'boolean', not 'bool'
};

// This is where the fun begins
// Imma span this lol
export default function InteractiveCollections( { data, force_click }: InteractiveCollectionsProps ) {
  const [activeHeadingOne, setActiveHeadingOne] = useState<string | null>(null);
  const [activeHeadingTwo, setActiveHeadingTwo] = useState<string | null>(null);
  const [leaveMouse, setLeaveMouse] = useState<boolean>(false);

  return (
    <main className="min-h-screen text-white p-4 sm:p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col items-center gap-4">
          {Object.entries(data).map(([headingOne, courses]) => (
            (Object.entries(courses).length > 0) &&
            <div 
              key={headingOne}
              className="w-full max-w-2xl"
              onMouseEnter={() => !force_click && !leaveMouse && setActiveHeadingOne(headingOne)}
              onMouseLeave={() => !force_click && (activeHeadingTwo === null) && setActiveHeadingOne(null) || setLeaveMouse(false)}
            >
              <button
                onClick={() => {
                  if (force_click) {
                    setActiveHeadingOne(headingOne);
                  } else if (activeHeadingTwo !== null) {
                    setActiveHeadingOne(null);
                    setActiveHeadingTwo(null);
                    setLeaveMouse(true);
                } else {
                    setActiveHeadingOne(headingOne);
                }}}
                className={`w-full flex justify-between items-center text-left p-4 rounded-lg transition-all duration-300 ${
                  activeHeadingOne === headingOne
                  ? 'bg-cyan-600/70 shadow-lg' 
                  : 'bg-gray-800/70 hover:bg-gray-700'
                }`}
              >
                <span className="font-semibold text-lg">{headingOne}</span>
                <ChevronRight className={`transition-transform duration-300 ${
                  activeHeadingOne === headingOne ? 'transform rotate-90' : ''
                }`} />
              </button>

              {activeHeadingOne === headingOne && (
                <div className="mt-2 bg-gray-800/45 p-6 rounded-lg shadow-xl border border-gray-700 animate-fade-in">
                  <ul className="space-y-4">
                    {Object.entries(courses).map(([headingTwo, documents]) => (
                      <li 
                        key={headingTwo}
                        onClick={() => activeHeadingTwo == headingTwo? setActiveHeadingTwo(null) : setActiveHeadingTwo(headingTwo)}
                      >
                        
                        {Object.entries(documents).length > 0 && (<h3 className="font-bold text-white-400 cursor-pointer hover:text-cyan-500">{headingTwo}</h3>)}
                        
                        {activeHeadingTwo === headingTwo && (
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

