"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { setCookies } from '@/app/actions'; 

interface NavLink {
  name: string;
  href: string;
}

interface HeaderProps {
  navLinks: NavLink[];
}

// Simple Globe Icon Component
function GlobeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 group-hover:text-cyan-400 transition-colors duration-300">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  );
}

export default function Header({ navLinks }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLangMenuVisible, setLangMenuVisible] = useState(false);

  // Example languages
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'id', name: 'Indonesia' },
  ];

  const handleLanguageChange = async (langCode: string) => {
    // Call the server action to set the cookie
    await setCookies("language", langCode);
    // Refresh the page to apply the new language from the server
    router.refresh();
  };
  
  return (
    <header 
      className="w-screen fixed top-0 left-0 right-0 z-10 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700"
      onMouseLeave={() => setLangMenuVisible(false)} // Hide menu when mouse leaves the header
    >
      <div className="container flex items-center justify-between mx-auto px-8 py-4">
        <nav className="flex-grow overflow-x-auto no-scrollbar">
          <ul className="flex flex-nowrap md:justify-center space-x-6 md:space-x-8 animate-fade-in">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li className="flex-shrink-0" key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm md:text-base hover:text-lg transition-all duration-300 ${
                      isActive
                        ? 'text-cyan-400 font-bold opacity-100'
                        : 'text-gray-300 font-semibold hover:text-cyan-400 opacity-75'
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div 
          className="relative ml-4 flex-shrink-0"
          onMouseEnter={() => setLangMenuVisible(true)} // Show menu on hover
        >
          <button className="group">
            <GlobeIcon />
          </button>
          
          {isLangMenuVisible && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 animate-fade-in">
              <ul>
                {languages.map((lang) => (
                  <li key={lang.code}>
                    <button
                      onClick={() => handleLanguageChange(lang.code)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-cyan-400 transition-colors duration-200 text-md"
                    >
                      {lang.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}


