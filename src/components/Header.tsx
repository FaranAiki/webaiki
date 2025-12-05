"use client";

import Link from 'next/link';
import { usePathname, useRouter, redirect } from 'next/navigation';
import Image from 'next/image';
import { setCookies } from '@/app/actions';
import { useState, useEffect } from 'react';
import { Inter } from "next/font/google";
import ThemeToggle from '@/components/ThemeToggle'; 
import { useTheme } from 'next-themes';

const inter = Inter({ subsets: ["latin"] });

interface NavLink {
    name: string;
    href: string;
    subLinks?: NavLink[];
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

function GlobeIcon({ isDark }: { isDark: boolean }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${isDark ? 'text-gray-300' : 'text-slate-700'} group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300`}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
    );
}

function MenuIcon({ isDark }: { isDark: boolean }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isDark ? 'text-gray-300' : 'text-slate-700'}>
            <line x1="9" y1="12" x2="21" y2="12"></line>
            <line x1="9" y1="6" x2="21" y2="6"></line>
            <line x1="9" y1="18" x2="21" y2="18"></line>
        </svg>
    );
}

function CloseIcon({ isDark }: { isDark: boolean }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isDark ? 'text-gray-300' : 'text-slate-700'}>
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    );
}

function ChevronDown() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
            <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
    );
}

export default function Header({ navLinks, current_lang, en_lang, zh_lang, id_lang, jp_lang, ru_lang, fr_lang, ar_lang, select_lang }: HeaderProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isLangMenuVisible, setLangMenuVisible] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [shouldShowHeader, setShouldShowHeader] = useState(true);
    const [lastYPos, setLastYPos] = useState(0);

    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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

    useEffect(() => {
        function handleScroll() {
            const currentYPos = window.scrollY;
            const isScrollingUp = currentYPos < lastYPos;

            setShouldShowHeader(isScrollingUp || currentYPos < 10);
            setLastYPos(currentYPos);
        }

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastYPos]);

    const isDark = mounted && resolvedTheme === 'dark';

    // Dynamic Classes
    const headerBg = isDark ? 'bg-gray-900/80 border-gray-700' : 'bg-slate-200/95 border-gray-300';
    const mobileMenuBg = isDark ? 'bg-gray-900/95' : 'bg-slate-100/95';
    const textColor = isDark ? 'text-gray-300' : 'text-slate-700';
    const activeText = isDark ? 'text-cyan-400' : 'text-cyan-600';
    const dropdownBg = isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200';

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
        <div className={`w-full md:w-48 ${dropdownBg} backdrop-blur-md md:border rounded-md shadow-lg py-1 animate-fade-in`}>
            <ul>
                {languages.map((lang) => {
                    const isCurrent = lang.code === current_lang;
                    return (
                        <li key={lang.code}>
                            <button
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`w-full text-left px-4 py-2 text-sm hover:${isDark? 'bg-gray-100' : 'bg-gray-700'} dark:hover:bg-gray-700 hover:${isDark? 'text-cyan-600' : 'text-cyan-400'} dark:hover:text-cyan-400 transition-colors duration-200 text-md ${isCurrent ? `${activeText} font-bold` : textColor}`}
                            >
                                {lang.name}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );

    const findPageTitle = (links: NavLink[]): string | undefined => {
        for (const link of links) {
            if (link.href === pathname) return link.name;
            if (link.subLinks) {
                const found = findPageTitle(link.subLinks);
                if (found) return found;
            }
        }
        return undefined;
    };

    const currentPageTitle = findPageTitle(navLinks);

    if (!mounted) return <div className="h-16 w-full fixed top-0 z-30 bg-slate-200/90 dark:bg-gray-900/80" />;

    return (
        <>
            <header
                className={`
                    w-full fixed top-0 left-0 right-0 z-30 
                    ${headerBg} backdrop-blur-sm 
                    border-b
                    transition-all duration-300 ease-in-out
                    ${shouldShowHeader ? 'translate-y-0' : '-translate-y-full'}
                `}
                onMouseLeave={() => setLangMenuVisible(false)}
            >
                <div className="container flex items-center justify-between mx-auto px-4 sm:px-8 py-4">

                    {/* Left section (Logo) */}
                    <div className="flex-1 flex items-center gap-4">
                        <Image
                            onClick={() => redirect('/')}
                            src='/icon.ico'
                            alt={"logo"}
                            width={30}
                            height={30}
                            className="transition-all shadow-lg border-2 border-white dark:border-transparent opacity-100 hover:opacity-75 scale-95 hover:scale-100 cursor-pointer rounded-full"
                            priority
                        />
                    </div>

                    {/* --- Mobile Title (Center) --- */}
                    <div className={`md:hidden ${inter.className}`} >
                        {currentPageTitle && (
                            <h1 className={`transition-all duration-200 text-xl font-bold hover:text-cyan-600 dark:hover:text-cyan-200 ${isDark ? 'text-white' : 'text-slate-800'} whitespace-nowrap cursor-pointer hover:scale-105 opacity-90`}>
                                {currentPageTitle}
                            </h1>
                        )}
                    </div>

                    {/* --- Desktop Navigation (Center) --- */}
                    <nav className="hidden md:flex flex-shrink-0">
                        <ul className="flex items-center space-x-8">
                            {navLinks.map((link) => {
                                const hasSubLinks = link.subLinks && link.subLinks.length > 0;

                                if (hasSubLinks) {
                                    const isChildActive = link.subLinks?.some(sub => pathname === sub.href);

                                    return (
                                        <li key={link.name} className="relative group">
                                            <button
                                                className={`flex items-center text-base transition-all duration-300 ${isChildActive
                                                        ? `${activeText} font-bold`
                                                        : `${textColor} font-semibold group-hover:text-cyan-600 dark:group-hover:text-cyan-400`
                                                    }`}
                                            >
                                                {link.name}
                                                <ChevronDown />
                                            </button>

                                            {/* Dropdown Menu */}
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
                                                <ul className={`${dropdownBg} rounded-md shadow-xl py-2 min-w-[180px]`}>
                                                    {link.subLinks!.map((subLink) => {
                                                        const isSubActive = pathname === subLink.href;
                                                        return (
                                                            <li key={subLink.href}>
                                                                <Link
                                                                    href={subLink.href}
                                                                    className={`block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${isSubActive
                                                                            ? `${activeText} font-bold bg-gray-50 dark:bg-gray-800/50`
                                                                            : `${textColor} hover:text-cyan-600 dark:hover:text-cyan-400`
                                                                        }`}
                                                                >
                                                                    {subLink.name}
                                                                </Link>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        </li>
                                    );
                                }

                                // Render Standard Link
                                const isActive = pathname === link.href;
                                return (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className={`text-base transition-all duration-300 ${isActive
                                                    ? `${activeText} font-bold`
                                                    : `${textColor} font-semibold hover:text-cyan-600 dark:hover:text-cyan-400`
                                                }`}
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Right section */}
                    <div className="flex-1 flex justify-end items-center space-x-4">
                        
                        <div className="hidden md:block">
                            <ThemeToggle />
                        </div>

                        {/* --- Desktop Language Selector --- */}
                        <div
                            className="hidden md:flex relative cursor-pointer"
                            onMouseEnter={() => setLangMenuVisible(true)}
                        >
                            <button className="group p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-800 transition-colors">
                                <GlobeIcon isDark={isDark} />
                            </button>
                            {isLangMenuVisible && (
                                <div className="absolute top-full right-0 mt-2">
                                    <LanguageMenu />
                                </div>
                            )}
                        </div>

                        {/* --- Mobile Menu Button --- */}
                        <div className="md:hidden flex items-center cursor-pointer">
                            <button
                                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                                className={`${textColor} hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors z-50 p-2`}
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? <CloseIcon isDark={isDark} /> : <MenuIcon isDark={isDark} />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- Mobile Sidebar Navigation --- */}
            <div className={`no-scrollbar fixed top-0 right-0 h-full w-72 ${mobileMenuBg} backdrop-blur-md shadow-2xl z-20 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden overflow-y-auto`}>
                <nav className="mt-20 px-6 pb-8">
                    <div className={`flex justify-between items-center mb-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} pb-4`}>
                        <ThemeToggle />
                    </div>

                    <ul className="flex flex-col space-y-4">
                        {navLinks.map((link) => {
                            if (link.subLinks && link.subLinks.length > 0) {
                                return (
                                    <li key={link.name} className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-200'} pb-2`}>
                                        <span className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 mt-2">
                                            {link.name}
                                        </span>
                                        <ul className="flex flex-col space-y-3 pl-2">
                                            {link.subLinks.map(subLink => {
                                                const isActive = pathname === subLink.href;
                                                return (
                                                    <li key={subLink.href}>
                                                        <Link
                                                            href={subLink.href}
                                                            onClick={() => setMobileMenuOpen(false)}
                                                            className={`block text-lg transition-all duration-300 ${isActive
                                                                    ? `${activeText} font-bold`
                                                                    : `${textColor} font-semibold hover:text-cyan-600 dark:hover:text-cyan-400`
                                                                }`}
                                                        >
                                                            {subLink.name}
                                                        </Link>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </li>
                                );
                            }

                            const isActive = pathname === link.href;
                            return (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`block text-lg transition-all duration-300 ${isActive
                                                ? `${activeText} font-bold`
                                                : `${textColor} font-semibold hover:text-cyan-600 dark:hover:text-cyan-400`
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                    <div className={`mt-8 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} pt-6`}>
                        <p className="px-0 text-sm font-semibold text-gray-500 mb-2">{select_lang}</p>
                        <LanguageMenu />
                    </div>
                </nav>
            </div>

            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/20 dark:bg-black/50 z-10 backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                ></div>
            )}
        </>
    );
}
