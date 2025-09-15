"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Social', href: '/social' },
  { name: 'Certificate', href:'/certificate' },
  { name: 'Music', href: '/music' },
  { name: 'Project', href: '/project' },
  { name: 'College', href: '/college' },
  { name: 'Literature', href: '/literature' },
];

// Header is used throughout the website
export default function Header() {
  const pathname = usePathname();

  // Tailwind is overpowered as hell bro
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 overflow-x-scroll no-scrollbar">
      <nav className="container flex justify-center mx-auto px-8 py-4">
        <ul className="flex items-center justify-center space-x-6 md:space-x-8 animate-fade-in">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li className="flex-shrink-0" key={link.name}>
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
    </header>
  );
}


