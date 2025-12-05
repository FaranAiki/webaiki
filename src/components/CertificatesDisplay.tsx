'use client';

import { useState, useMemo, useEffect } from 'react';
import PdfPreview from '@/components/PdfPreview';
import Image from 'next/image';
import { useTheme } from 'next-themes';

export type CertificateData = {
  [category: string]: {
    [year: string]: {
      [fileName: string]: string;
    };
  };
};

export type CertificatesDisplayProps = {
  certificates: CertificateData;
  allTranslation: string;
};

export default function CertificatesDisplay({ certificates, allTranslation }: CertificatesDisplayProps) {
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<{ [key: string]: string }>({});
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) return null;

  const isDark = resolvedTheme === 'dark';
  
  // Dynamic Classes
  const titleColor = isDark ? 'text-white' : 'text-black';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-300';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const cardBorder = isDark ? 'border-transparent' : 'border-gray-200';
  const buttonInactiveBg = isDark ? 'bg-gray-800' : 'bg-gray-200';
  const buttonInactiveText = isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-300';

  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-6">
      {Object.entries(certificates).map(([category, yearsData]) => {
        const isOpen = openCategories.includes(category);
        const activeYear = selectedYears[category] || (categoryYears[category][0] || 'All');

        const filteredFiles = (() => {
          if (activeYear === 'All') {
            return Object.values(yearsData).reduce(
              (acc, files) => ({ ...acc, ...files }),
              {}
            );
          }
          return yearsData[activeYear] || {};
        })();

        return (
          <div key={category} className={`border-b ${borderColor} pb-4`}>
            <button
              onClick={() => handleCategoryClick(category)}
              className={`w-full text-left text-2xl font-bold ${titleColor} hover:text-cyan-500 hover:scale-102 transition-all`}
            >
              {category}
            </button>

            <div
              className={`transition-all duration-250 animate-fade-in ease-in-out overflow-hidden ${
                isOpen ? 'max-h-[10000px] mt-4' : 'max-h-0'
              }`}
            >
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => handleYearClick(category, 'All')}
                  className={`px-3 py-1 text-sm rounded-full ${
                    activeYear === 'All'
                      ? 'bg-cyan-500 text-white transition-all hover:scale-105'
                      : `${buttonInactiveBg} ${buttonInactiveText}`
                  }`}
                >
                  {allTranslation}
                </button>
                {categoryYears[category].map((year) => (
                  <button
                    key={year}
                    onClick={() => handleYearClick(category, year)}
                    className={`px-3 py-1 text-sm rounded-full ${
                      activeYear === year
                        ? 'bg-cyan-500 text-white'
                        : `${buttonInactiveBg} ${buttonInactiveText} transition-all hover:scale-105`
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
                    className={`${cardBg} rounded-lg overflow-visible shadow-lg transition-all hover:scale-105 hover:opacity-100 opacity-90 border ${cardBorder}`}
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
                        <Image
                          src={filePath as string}
                          alt={fileName}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                      )}
                    </a>
                    <div className="p-4">
                      <h3 className={`font-semibold ${titleColor} truncate`}>
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
