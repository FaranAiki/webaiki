"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { setCookies } from '@/app/actions';
import { useState, useEffect } from 'react';
// import NowPlaying from '@/components/NowPlayingSpotify';

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

interface NavLink {
    name: string;
    href: string;
}

interface HeaderProps {
    navLinks: NavLink[];
    current_lang: string;
    en_lang: string;
    zh_lang: string;
    id_lang: string;
    jp_lang: string;
    ru_lang: string;
    fr_lang: string;
    ar_lang: string;
    select_lang: string;
}

function GlobeIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 group-hover:text-cyan-400 transition-colors duration-300">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
    );
}

function MenuIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="9" y1="12" x2="21" y2="12"></line>
            <line x1="9" y1="6" x2="21" y2="6"></line>
            <line x1="9" y1="18" x2="21" y2="18"></line>
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    );
}

// --- Main Header Component ---

export default function Header({ navLinks, current_lang, en_lang, zh_lang, id_lang, jp_lang, ru_lang, fr_lang, ar_lang, select_lang }: HeaderProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isLangMenuVisible, setLangMenuVisible] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    // --- 1. NEW STATE TO TRACK SCROLL POSITION & VISIBILITY ---
    const [shouldShowHeader, setShouldShowHeader] = useState(true);
    const [lastYPos, setLastYPos] = useState(0);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMobileMenuOpen]);

    // --- 2. NEW EFFECT TO HANDLE SCROLL EVENTS ---
    useEffect(() => {
        function handleScroll() {
            const currentYPos = window.scrollY;
            const isScrollingUp = currentYPos < lastYPos;

            // Show header if scrolling up or at the very top of the page
            setShouldShowHeader(isScrollingUp || currentYPos < 10);
            setLastYPos(currentYPos);
        }

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Cleanup function to remove the event listener
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastYPos]);


    const languages = [
        { code: 'id', name: id_lang },
        { code: 'en', name: en_lang },
        { code: 'zh', name: zh_lang },
        { code: 'jp', name: jp_lang },
        { code: 'ru', name: ru_lang },
        { code: 'fr', name: fr_lang },
        { code: 'ar', name: ar_lang },
    ];

    const handleLanguageChange = async (langCode: string) => {
        await setCookies("language", langCode);
        router.refresh();
    };

    const LanguageMenu = () => (
        <div className="w-full md:w-48 bg-gray-800/80 md:border md:border-gray-700 rounded-md shadow-lg py-1 animate-fade-in">
            <ul>
                {languages.map((lang) => {
                    const isCurrent = lang.code === current_lang;
                    return (
                        <li key={lang.code}>
                            <button
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 hover:text-cyan-400 transition-colors duration-200 text-md ${isCurrent ? 'text-cyan-400 font-bold' : 'text-gray-300'
                                    }`}
                            >
                                {lang.name}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );

    const currentPageTitle = navLinks.find(link => pathname === link.href)?.name;

    return (
        <>
            {/* --- 3. UPDATED HEADER WITH DYNAMIC CLASSES --- */}
            <header
                className={`
          w-full fixed top-0 left-0 right-0 z-30 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700
          transition-transform duration-300 ease-in-out
          ${shouldShowHeader ? 'translate-y-0' : '-translate-y-full'}
        `}
                onMouseLeave={() => setLangMenuVisible(false)}
            >
                <div className="container flex items-center justify-between mx-auto px-4 sm:px-8 py-4">

                    {/* Left section (spacer) */}
                    <div className="flex-1">
                        <Image
                            src='/icon.ico'
                            alt={"logo"}
                            width={30}
                            height={30}
                            className="transition-all shadow-lg border-4 opacity-100 hover:opacity-75 scale-95 hover:scale-100 "
                            priority
                        />
                    </div>

                    {/* --- Mobile Title (Center) --- */}
                    <div className={`md:hidden ${inter.className}`} >
                        {currentPageTitle && (
                            <h1 className="transition-all duration-200 text-xl font-bold hover:text-cyan-200 text-white whitespace-nowrap cursor-pointer hover:scale-105 opacity-90">
                                {currentPageTitle}
                            </h1>
                        )}
                    </div>

                    {/* --- Desktop Navigation (Center) --- */}
                    <nav className="hidden md:flex flex-shrink-0">
                        <ul className="flex items-center space-x-8">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className={`text-base transition-all duration-300 ${isActive
                                                ? 'text-cyan-400 font-bold'
                                                : 'text-gray-300 font-semibold hover:text-cyan-400'
                                                }`}
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Right section (Language selector and Mobile menu) */}
                    <div className="flex-1 flex justify-end">
                        {/* --- Desktop Language Selector --- */}
                        <div
                            className="hidden md:flex relative"
                            onMouseEnter={() => setLangMenuVisible(true)}
                        >
                            <button className="group">
                                <GlobeIcon />
                            </button>
                            {isLangMenuVisible && (
                                <div className="absolute top-full right-0 mt-2">
                                    <LanguageMenu />
                                </div>
                            )}
                        </div>

                        {/* --- Mobile Menu Button --- */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-gray-300 hover:text-cyan-400 transition-colors z-50"
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- Mobile Sidebar Navigation --- */}
            <div className={`no-scrollbar fixed top-0 right-0 h-full w-64 bg-gray-900/95 backdrop-blur-md shadow-2xl z-20 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden overflow-y-auto`}>
                <nav className="mt-20 px-4 pb-8">
                    <ul className="flex flex-col space-y-6">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`block text-lg transition-all duration-300 ${isActive
                                            ? 'text-cyan-400 font-bold'
                                            : 'text-gray-300 font-semibold hover:text-cyan-400'
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                    <div className="mt-8 border-t border-gray-700 pt-6">
                        <p className="px-4 text-sm font-semibold text-gray-400 mb-2">{select_lang}</p>
                        <LanguageMenu />
                    </div>
                </nav>
            </div>

            {/* --- Overlay for Mobile Menu --- */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-10"
                    onClick={() => setMobileMenuOpen(false)}
                ></div>
            )}
        </>
    );
}
