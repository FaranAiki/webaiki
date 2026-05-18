"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { setCookies } from '@/app/actions';
import { useState, useEffect } from 'react';
import { Inter } from "next/font/google";
import ThemeToggle from '@/components/ThemeToggle'; 
import { useTheme } from 'next-themes';

const inter = Inter({ subsets: ["latin"] });

export interface NavLink {
    name: string;
    href: string;
    subLinks?: NavLink[];
    icon?: React.ReactNode;
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
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${isDark ? 'text-gray-300' : 'text-slate-700'} group-hover:text-cyan-600 transition-colors duration-300`}>
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
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 opacity-75">
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

    // Handle body overflow when mobile menu is open
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

    // Close mobile menu on window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
    const headerBg = isDark ? 'bg-gray-900/90 border-gray-700' : 'bg-white/90 border-gray-200';
    const mobileMenuBg = isDark ? 'bg-gray-900/95' : 'bg-slate-50/95';
    const textColor = isDark ? 'text-gray-300' : 'text-gray-700';
    const activeText = isDark ? 'text-cyan-400' : 'text-cyan-600';
    const dropdownBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';

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
        
        let newPathname = pathname;
        if (pathname.startsWith(`/${current_lang}/`)) {
            newPathname = pathname.replace(`/${current_lang}/`, `/${langCode}/`);
        } else if (pathname === `/${current_lang}`) {
            newPathname = `/${langCode}`;
        }

        setLangMenuVisible(false);
        setMobileMenuOpen(false);
        router.push(newPathname);
        router.refresh(); 
    };

    const LanguageMenu = () => (
        <div className={`w-full md:w-48 ${dropdownBg} backdrop-blur-md md:border rounded-xl shadow-xl py-2 animate-fade-in ring-1 ring-black/5`}>
            <ul>
                {languages.map((lang) => {
                    const isCurrent = lang.code === current_lang;
                    return (
                        <li key={lang.code}>
                            <button
                                onClick={() => handleLanguageChange(lang.code)}
                                aria-label={`Change language to ${lang.name}`}
                                className={`w-full text-left px-5 py-2.5 text-sm hover:${isDark? 'bg-gray-700' : 'bg-gray-100'} hover:${isDark? 'text-cyan-400' : 'text-cyan-600'} transition-[colors,transform] duration-200 ${isCurrent ? `${activeText} font-bold bg-gray-50/5` : textColor}`}
                            >
                                {lang.name}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );

    // Normalize Pathname by removing language prefix for internal matching
    let normalizedPathname = pathname;
    if (pathname === `/${current_lang}`) {
        normalizedPathname = '/';
    } else if (pathname.startsWith(`/${current_lang}/`)) {
        normalizedPathname = pathname.slice(current_lang.length + 1);
    }

    // Safely append the correct language prefix to avoid server redirects
    const getLocalizedHref = (href: string) => {
        if (href === '#' || href.startsWith('http')) return href;
        if (href === '/') return `/${current_lang}`;
        return `/${current_lang}${href}`;
    };

    const findActiveLink = (links: NavLink[]): NavLink | undefined => {
        for (const link of links) {
            // Match using normalized pathname
            if (link.href === normalizedPathname) return link;
            if (link.subLinks) {
                const found = findActiveLink(link.subLinks);
                if (found) return found;
            }
        }
        return undefined;
    };

    const activeLink = findActiveLink(navLinks);

    if (!mounted) return <div className="h-16 w-full fixed top-0 z-30 bg-white/90" />;

    return (
        <>
            <header
                className={`
                    w-full fixed top-0 left-0 right-0 z-40 
                    ${headerBg} backdrop-blur-md 
                    border-b shadow-sm
                    transition-transform duration-300 ease-in-out
                    ${shouldShowHeader ? 'translate-y-0' : '-translate-y-full'}
                `}
                onMouseLeave={() => setLangMenuVisible(false)}
            >
                <div className="container flex items-center justify-between mx-auto px-4 sm:px-8 py-4">

                    {/* Left section (Logo) */}
                    <div className="block md:hidden lg:block flex-1 flex items-center gap-4">
                        <Image
                            onClick={() => router.push(getLocalizedHref('/'))}
                            src='/icon.ico'
                            alt={"logo"}
                            width={32}
                            height={32}
                            className={`transition-[colors,transform,opacity] shadow-md border ${isDark ? "border-cyan-800" : "border-gray-200"} opacity-100 hover:opacity-80 scale-100 hover:scale-110 cursor-pointer rounded-full`}
                            priority
                        />
                    </div>

                    {/* --- Mobile Title (Center) --- */}
                    <div className={`md:hidden ${inter.className}`} >
                        {activeLink && (
                            <h1 className={`flex items-center justify-center transition-[colors,transform] duration-200 text-lg font-bold hover:text-cyan-600 ${isDark ? 'text-white' : 'text-slate-800'} whitespace-nowrap cursor-pointer opacity-95`}>
                                {activeLink.icon && <span className="mr-2 flex items-center scale-90">{activeLink.icon}</span>}
                                {activeLink.name}
                            </h1>
                        )}
                    </div>

                    {/* --- Desktop Navigation (Center) --- */}
                    <nav className="hidden md:flex flex-shrink-0">
                        <ul className="flex items-center space-x-8">
                            {navLinks.map((link) => {
                                const hasSubLinks = link.subLinks && link.subLinks.length > 0;

                                if (hasSubLinks) {
                                    const isChildActive = link.subLinks?.some(sub => normalizedPathname === sub.href);

                                    return (
                                        <li key={link.name} className="relative group">
                                            <button
                                                className={`flex items-center transition-[colors,transform] duration-200 
                                                    text-[15px] tracking-wide
                                                    ${isChildActive
                                                        ? `${activeText} font-bold`
                                                        : `${textColor} font-medium group-hover:text-cyan-600`
                                                    }`}
                                            >
                                                {link.icon && <span className="mr-2 hidden lg:inline-block opacity-80 group-hover:opacity-100">{link.icon}</span>}
                                                {link.name}
                                                <ChevronDown />
                                            </button>

                                            {/* Dropdown Menu */}
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 pt-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-[colors,transform,opacity] duration-200 ease-in-out">
                                                <ul className={`${dropdownBg} rounded-xl shadow-xl py-3 min-w-[200px] ring-1 ring-black/5`}>
                                                    {link.subLinks!.map((subLink) => {
                                                        const isSubActive = normalizedPathname === subLink.href;
                                                        return (
                                                            <li key={subLink.href}>
                                                                <Link
                                                                    href={getLocalizedHref(subLink.href)}
                                                                    className={`flex items-center px-5 py-3 text-[14px] hover:${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} transition-[colors,transform] ${isSubActive
                                                                            ? `${activeText} font-bold`
                                                                            : `${textColor} hover:text-cyan-600 font-medium`
                                                                        }`}
                                                                >
                                                                    {subLink.icon && <span className="mr-3 opacity-70 group-hover:opacity-100 hidden lg:inline-block scale-90">{subLink.icon}</span>}
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
                                const isActive = normalizedPathname === link.href;
                                return (
                                    <li key={link.href}>
                                        <Link
                                            href={getLocalizedHref(link.href)}
                                            className={`flex items-center transition-colors duration-200 
                                                text-[15px] tracking-wide
                                                ${isActive
                                                    ? `${activeText} font-bold`
                                                    : `${textColor} font-medium hover:text-cyan-600`
                                                }`}
                                        >
                                            {link.icon && <span className="mr-2 hidden lg:inline-block opacity-80 group-hover:opacity-100">{link.icon}</span>}
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
                            <button 
                                className={`group p-2.5 rounded-full hover:${isDark ? 'bg-white/10' : 'bg-gray-100'} transition-colors`}
                                aria-label="Select language"
                                aria-haspopup="true"
                                aria-expanded={isLangMenuVisible}
                            >
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
                                className={`${textColor} hover:text-cyan-600 transition-colors z-50 p-2 rounded-lg hover:bg-gray-100/10`}
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? <CloseIcon isDark={isDark} /> : <MenuIcon isDark={isDark} />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- Mobile Sidebar Navigation --- */}
            <div className={`no-scrollbar fixed top-0 right-0 h-full w-[80%] max-w-sm ${mobileMenuBg} backdrop-blur-xl shadow-2xl z-30 transform transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden overflow-y-auto`}>
                <nav className="mt-24 px-8 pb-12">
                    <div className={`flex justify-between items-center mb-8 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} pb-6`}>
                        <ThemeToggle />
                    </div>

                    <ul className="flex flex-col space-y-6">
                        {navLinks.map((link) => {
                            if (link.subLinks && link.subLinks.length > 0) {
                                return (
                                    <li key={link.name}>
                                        <span className={`flex items-center text-xs font-bold uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'} mb-4`}>
                                            {link.icon && <span className="mr-2 inline-block flex-shrink-0 opacity-70">{link.icon}</span>}
                                            {link.name}
                                        </span>
                                        <ul className="flex flex-col space-y-4 pl-4 border-l-2 border-gray-200/50 dark:border-gray-700/50">
                                            {link.subLinks.map(subLink => {
                                                const isActive = normalizedPathname === subLink.href;
                                                return (
                                                    <li key={subLink.href}>
                                                        <Link
                                                            href={getLocalizedHref(subLink.href)}
                                                            onClick={() => setMobileMenuOpen(false)}
                                                            className={`flex items-center text-[16px] transition-[colors,transform] duration-300 ${isActive
                                                                    ? `${activeText} font-bold`
                                                                    : `${textColor} font-medium hover:text-cyan-600 hover:translate-x-1`
                                                                }`}
                                                        >
                                                            {subLink.icon && <span className="mr-3 scale-90 inline-block flex-shrink-0 opacity-70">{subLink.icon}</span>}
                                                            {subLink.name}
                                                        </Link>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </li>
                                );
                            }

                            const isActive = normalizedPathname === link.href;
                            return (
                                <li key={link.href}>
                                    <Link
                                        href={getLocalizedHref(link.href)}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center text-lg transition-[colors,transform] duration-300 ${isActive
                                                ? `${activeText} font-bold`
                                                : `${textColor} font-semibold hover:text-cyan-600`
                                            }`}
                                    >
                                        {link.icon && <span className="mr-3 inline-block flex-shrink-0 opacity-80">{link.icon}</span>}
                                        {link.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                    <div className={`mt-10 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} pt-8`}>
                        <p className={`px-0 text-xs font-bold uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'} mb-4`}>{select_lang}</p>
                        <LanguageMenu />
                    </div>
                </nav>
            </div>

            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/40 z-20 backdrop-blur-sm transition-opacity duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                ></div>
            )}
        </>
    );
}
