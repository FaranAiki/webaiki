'use client';

// I don't know how to code and program so I just vibe-code and vibe-program
import { useState, useMemo } from 'react';
import PdfPreview from '@/components/PdfPreview';

export type CertificateData = {
  [category: string]: {
    [year: string]: {
      [fileName: string]: string;
    };
  };
};

export type CertificatesDisplayProps = {
  certificates: CertificateData;
};

export default function CertificatesDisplay({ certificates }: CertificatesDisplayProps) {
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<{ [key: string]: string }>({});

  const handleCategoryClick = (category: string) => {
    setOpenCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleYearClick = (category: string, year: string) => {
    setSelectedYears((prev) => ({ ...prev, [category]: year }));
  };

  const categoryYears = useMemo(() => {
    const years: { [key: string]: string[] } = {};
    for (const category in certificates) {
      years[category] = Object.keys(certificates[category]).sort((a, b) =>
        b.localeCompare(a)
      );
    }
    return years;
  }, [certificates]);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-6">
      {/* 'yearsData' now correctly represents the object containing year keys */}
      {Object.entries(certificates).map(([category, yearsData]) => {
        const isOpen = openCategories.includes(category);
        // Set the default active year to the first available year or 'All'
        const activeYear = selectedYears[category] || (categoryYears[category][0] || 'All');

        // 2. FIX: Handle the new nested structure when filtering files.
        const filteredFiles = (() => {
          if (activeYear === 'All') {
            // If 'All' is selected, merge all files from all years into one object
            return Object.values(yearsData).reduce(
              (acc, files) => ({ ...acc, ...files }),
              {}
            );
          }
          // Otherwise, just get the files for the selected year
          return yearsData[activeYear] || {};
        })();

        return (
          <div key={category} className="border-b border-gray-700 pb-4">
            {/* Category Button */}
            <button
              onClick={() => handleCategoryClick(category)}
              className="w-full text-left text-2xl font-bold hover:text-cyan-300 hover:scale-102 transition-all"
            >
              {category}
            </button>

            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                isOpen ? 'max-h-[10000px] mt-4' : 'max-h-0' // Use a large max-h value
              }`}
            >
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => handleYearClick(category, 'All')}
                  className={`px-3 py-1 text-sm rounded-full ${
                    activeYear === 'All'
                      ? 'bg-cyan-500 text-white transition-all hover:scale-105'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  All
                </button>
                {categoryYears[category].map((year) => (
                  <button
                    key={year}
                    onClick={() => handleYearClick(category, year)}
                    className={`px-3 py-1 text-sm rounded-full ${
                      activeYear === year
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-800 hover:bg-gray-700 transition-all hover:scale-105'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {Object.entries(filteredFiles).map(([fileName, filePath]) => (
                  <div
                    key={fileName}
                    className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all hover:scale-105 hover:opacity-100 opacity-90"
                  >
                    <a
                      href={filePath as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-48"
                    >
                      {(filePath as string).endsWith('.pdf') ? (
                        <PdfPreview fileUrl={filePath as string} />
                      ) : (
                        <img
                          src={filePath as string}
                          alt={fileName}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </a>
                    <div className="p-4">
                      <h3 className="font-semibold text-white truncate">
                        {fileName}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
