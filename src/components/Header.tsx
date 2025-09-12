"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { name: 'About Me', href: '/' },
  { name: 'Music', href: '/music' },
  { name: 'Technology', href: '/technology' },
  { name: 'College Collections', href: '/collections' },
  { name: 'Publishing and Literature', href: '/literature' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700">
      <nav className="container mx-auto px-8 py-4">
        <ul className="flex items-center justify-center space-x-6 md:space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.name}>
                <Link 
                  href={link.href} 
                  className={`text-sm md:text-base transition-colors duration-300 ${
                    isActive 
                      ? 'text-cyan-400 font-semibold' 
                      : 'text-gray-300 hover:text-cyan-400'
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


