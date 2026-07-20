"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { setCookies } from '@/app/actions';
import { useState, useEffect, useRef, useCallback, startTransition, useMemo } from 'react';
import ThemeToggle from '@/components/shared/ThemeToggle';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { m as motion, AnimatePresence } from 'framer-motion';

const SettingsPopup = dynamic(() => import('@/components/providers/SettingsPopup'), { ssr: false });
const CommandPalette = dynamic(() => import('@/components/interactive/CommandPalette').then(mod => mod.CommandPalette), { 
  ssr: false,
  loading: () => <div className="fixed inset-0 z-50 cursor-wait bg-black/20 backdrop-blur-sm transition-all flex items-start justify-center pt-[15vh] sm:pt-[20vh]" />
});
const HeaderDropdown = dynamic(() => import("@/components/layout/HeaderDropdown"));
const HeaderMobileMenu = dynamic(() => import("@/components/layout/HeaderMobileMenu"), { ssr: false });
const HeaderUserMenu = dynamic(() => import("@/components/layout/HeaderUserMenu"), { ssr: false });
import {
  Share2, Check, User, ChevronDown, Handshake, Briefcase,
  Home, FileCheck, Users, Trophy, Palette, Music, BookOpen, GraduationCap, Compass, Code,
  Star, LayoutGrid, Fingerprint, Globe, MessageSquare, Newspaper, MoreHorizontal, Network,
  History, FileText
} from 'lucide-react';

import { formatCJK } from '@/lib/utils';
import LogoIcon from '@/components/ui/LogoIcon';
import { useAppStore } from '@/lib/store';
import { useAuthActions } from '@/app/auth-hooks';
import type { NavLink, HeaderAuthUser, HeaderSettingsLabels } from './header.types';

export function renderIcon(name?: string, size: number = 18) {
  if (!name) return null;
  switch (name) {
    case 'home': return <Home size={size} />;
    case 'user': return <User size={size} />;
    case 'compass': return <Compass size={size} />;
    case 'palette': return <Palette size={size} />;
    case 'more': return <MoreHorizontal size={size} />;
    case 'fingerprint': return <Fingerprint size={size} />;
    case 'globe': return <Globe size={size} />;
    case 'message': return <MessageSquare size={size} />;
    case 'star': return <Star size={size} />;
    case 'grid': return <LayoutGrid size={size} />;
    case 'share': return <Share2 size={size} />;
    case 'check': return <FileCheck size={size} />;
    case 'news': return <Newspaper size={size} />;
    case 'briefcase': return <Briefcase size={size} />;
    case 'code': return <Code size={size} />;
    case 'users': return <Users size={size} />;
    case 'trophy': return <Trophy size={size} />;
    case 'handshake': return <Handshake size={size} />;
    case 'music': return <Music size={size} />;
    case 'book': return <BookOpen size={size} />;
    case 'cap': return <GraduationCap size={size} />;
    case 'file': return <FileText size={size} />;
    case 'history': return <History size={size} />;
    case 'network': return <Network size={size} />;
    default: return null;
  }
}

interface HeaderProps {
    navLinks: NavLink[];
    current_lang: string;
    portfolio_label: string;
    all_label: string;
    login_label: string;
    register_label: string;
    logout_label: string;
    edit_profile_label: string;
    en_lang: string;
    zh_lang: string;
    id_lang: string;
    jp_lang: string;
    ru_lang: string;
    fr_lang: string;
    ar_lang: string;
    es_lang: string;
    ko_lang: string;
    de_lang: string;
    nl_lang: string;
    ha_lang: string;
    he_lang: string;
    el_lang: string;
    hi_lang: string;
    pt_lang: string;
    bn_lang: string;
    vi_lang: string;
    commandPaletteLabels: {
      placeholder: string;
      navigation: string;
      home: string;
      portfolio: string;
      projects: string;
      awards: string;
      college: string;
      news: string;
      hireMe: string;
      theme: string;
      lightTheme: string;
      darkTheme: string;
      systemTheme: string;
      language: string;
      searchResults: string;
      noResults: string;
      searching: string;
      suggestions: string;
    };
    select_lang: string;
    presentation_mode: string;
    navigation_label: string;
    logo_alt: string;
    share_copied: string;
    share_description: string;
    user?: HeaderAuthUser | null;
    settings_labels: HeaderSettingsLabels;
    hire_me_label: string;
    business_requests_label: string;
}

function MenuIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-colors">
            <line x1="9" y1="12" x2="21" y2="12"></line>
            <line x1="9" y1="6" x2="21" y2="6"></line>
            <line x1="9" y1="18" x2="21" y2="18"></line>
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-colors">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    );
}



export default function Header(props: HeaderProps) {
    const {
        navLinks,
        current_lang,
        portfolio_label,
        all_label,
        login_label,
        register_label,
        logout_label,
        edit_profile_label,
        en_lang,
        zh_lang,
        id_lang,
        jp_lang,
        ru_lang,
        fr_lang,
        ar_lang,
        es_lang,
        ko_lang,
        de_lang,
        nl_lang,
        ha_lang,
        he_lang,
        el_lang,
        commandPaletteLabels,
        navigation_label,
        logo_alt,
        share_copied,
        share_description,
        settings_labels,
        hire_me_label,
        business_requests_label
        } = props;
        const pathname = usePathname();

        useEffect(() => {
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
        }, [pathname]);
        const router = useRouter();
        const [isSettingsOpen, setIsSettingsOpen] = useState(false);
        const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
        const [user, setUser] = useState<HeaderProps['user']>(null);

        useEffect(() => {
            const handleOpenCommandPalette = () => setIsCommandPaletteOpen(true);
            window.addEventListener('open-command-palette', handleOpenCommandPalette);
            return () => window.removeEventListener('open-command-palette', handleOpenCommandPalette);
        }, []);

        useEffect(() => {
            let mounted = true;
            const fetchUser = async () => {
                try {
                    const res = await fetch('/api/auth/user');
                    if (res.ok) {
                        const { user } = await res.json();
                        if (mounted) setUser(user);
                    }
                } catch (_error) {
                    console.error("Failed to fetch user auth state", _error);
                }
            };
            fetchUser();
            return () => { mounted = false; };
        }, []);

        // Sync navLinks when props change, and apply user-specific links if logged in
        const dynamicNavLinks = useMemo(() => {
            const newNavLinks = navLinks.map(link => ({
                ...link,
                subLinks: link.subLinks ? [...link.subLinks] : undefined
            }));
            const homeLink = newNavLinks[0];

            if (user) {
                const reason = user.user_metadata?.registration_reason;
                const email = user.email;

                if (reason === 'HR' && homeLink.subLinks) {
                    homeLink.subLinks.push({
                        name: hire_me_label,
                        href: '/hire-me',
                        iconName: 'handshake'
                    });
                }
                if (email === 'faran.aiki.business@gmail.com' && homeLink.subLinks) {
                    homeLink.subLinks.push({
                        name: business_requests_label,
                        href: '/business-requests',
                        iconName: 'briefcase'
                    });
                }
            }
            return newNavLinks;
        }, [navLinks, hire_me_label, business_requests_label, user]);

        useEffect(() => {
            const down = (e: KeyboardEvent) => {
                if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    setIsCommandPaletteOpen((open) => !open);
                }
            };
            document.addEventListener("keydown", down);
            return () => document.removeEventListener("keydown", down);
        }, []);

        const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
        const [shouldShowHeader, setShouldShowHeader] = useState(true);
        const [showShareSuccess, setShowShareSuccess] = useState(false);
        const isHeaderHoveredRef = useRef(false);
        const lastYPosRef = useRef(0);
        const prevYPosRef = useRef(0);
        const tickingRef = useRef(false);

        const { resolvedTheme } = useTheme();
        const isPresentationMode = useAppStore((state) => state.isPresentationMode);
        const setScrollLocked = useAppStore((state) => state.setScrollLocked);
        const setGlobalLoading = useAppStore((state) => state.setGlobalLoading);

        const handleShare = () => {
            const settingsParams = [
                'theme',
                'color',
                'presentation_mode',
                'presentation_slide_format',
                'settings-font',
                'settings-align',
                'settings-scale',
                'settings-spacing',
                'settings-lineheight'
            ];

            const url = new URL(window.location.origin + pathname);
            settingsParams.forEach(param => {
                let value: string | null = null;

                // Priority: active state -> localStorage
                if (param === 'theme') {
                    // Use resolvedTheme to ensure the recipient sees what the sender sees (light or dark)
                    // even if the sender's setting was 'system'.
                    value = resolvedTheme || null;
                } else if (param === 'presentation_mode') {
                    value = String(isPresentationMode);
                } else {
                    value = localStorage.getItem(param);
                }

                if (value !== null && value !== undefined && value !== 'null') {
                    url.searchParams.set(param, value);
                }
            });

        const shareData = {
            title: 'Faran Aiki',
            text: share_description || 'Check out Faran Aiki\'s personal website!',
            url: url.toString()
        };
        if (navigator.share) {
            navigator.share(shareData).catch(err => {
                console.error('Error sharing:', err);
                copyToClipboard(url.toString());
            });
        } else {
            copyToClipboard(url.toString());
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setShowShareSuccess(true);
            setTimeout(() => setShowShareSuccess(false), 2000);
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    };

    // Handle body overflow and scroll locking when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
            setScrollLocked(true);
        } else {
            document.body.style.overflow = '';
            setScrollLocked(false);
        }
        return () => {
            document.body.style.overflow = '';
            setScrollLocked(false);
        };
    }, [isMobileMenuOpen, setScrollLocked]);

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

    const updateHeaderVisibility = useCallback(() => {
        const currentYPos = window.scrollY;

        // Accurately determine scroll direction every frame
        const isScrollingUp = currentYPos < prevYPosRef.current;
        prevYPosRef.current = currentYPos;

        // Logic: Show if scrolling up, or if near top, OR if the header is currently being hovered
        const nextShouldShow = isScrollingUp || currentYPos < 50 || isHeaderHoveredRef.current;

        if (nextShouldShow !== shouldShowHeader) {
            // Apply a small threshold (20px) before actually toggling the header
            if (Math.abs(currentYPos - lastYPosRef.current) > 20 || currentYPos < 50) {
                setShouldShowHeader(nextShouldShow);
                lastYPosRef.current = currentYPos;
            }
        } else {
            // Reset threshold when continuing to scroll in the same direction
            lastYPosRef.current = currentYPos;
        }

        tickingRef.current = false;
    }, [shouldShowHeader]);

    useEffect(() => {
        const onScroll = () => {
            if (!tickingRef.current) {
                window.requestAnimationFrame(updateHeaderVisibility);
                tickingRef.current = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [updateHeaderVisibility]);

    // Dynamic Classes
    const headerBg = 'bg-theme-surface/80 dark:bg-theme-bg-dark/80 border-theme-border';
    const mobileMenuBg = 'bg-theme-surface-strong/95 dark:bg-theme-bg-dark/95';
    const textColor = "text-[var(--text-muted)]";
    const activeText = 'text-theme-600 dark:text-theme-400';
    const dropdownBg = 'bg-theme-surface dark:bg-theme-bg-dark border-theme-border';

    const languages = [
        { code: 'id', name: id_lang, flag: '/images/flags/id.webp' },
        { code: 'en', name: en_lang, flag: '/images/flags/en.webp' },
        { code: 'zh', name: zh_lang, flag: '/images/flags/zh.webp' },
        { code: 'jp', name: jp_lang, flag: '/images/flags/jp.webp' },
        { code: 'ru', name: ru_lang, flag: '/images/flags/ru.webp' },
        { code: 'fr', name: fr_lang, flag: '/images/flags/fr.webp' },
        { code: 'es', name: es_lang, flag: '/images/flags/es.webp' },
        { code: 'ko', name: ko_lang, flag: '/images/flags/ko.webp' },
        { code: 'de', name: de_lang, flag: '/images/flags/de.webp' },
        { code: 'nl', name: nl_lang, flag: '/images/flags/nl.webp' },
        { code: 'ar', name: ar_lang, flag: '/images/flags/ar.webp' },
        { code: 'ha', name: ha_lang, flag: '/images/flags/ha.webp' },
        { code: 'he', name: he_lang, flag: '/images/flags/he.webp' },
        { code: 'el', name: el_lang, flag: '/images/flags/el.webp' },
    ];

    const handleLanguageChange = async (langCode: string) => {
        setGlobalLoading(true);
        await setCookies("language", langCode);

        let newPathname = pathname;
        if (pathname === '/') {
            newPathname = `/${langCode}`;
        } else if (pathname.startsWith(`/${current_lang}/`)) {
            newPathname = pathname.replace(`/${current_lang}/`, `/${langCode}/`);
        } else if (pathname === `/${current_lang}`) {
            newPathname = `/${langCode}`;
        }

        setMobileMenuOpen(false);
        startTransition(() => {
            router.push(newPathname);
        });
    };

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

    const activeLink = findActiveLink(dynamicNavLinks);
    const { signOut } = useAuthActions(current_lang);

    const getMobileTitle = () => {
        if (normalizedPathname === '/portfolio') return portfolio_label;
        if (normalizedPathname === '/all') return all_label;
        if (normalizedPathname === '/login') return login_label;
        if (normalizedPathname === '/register') return register_label;
        return null;
    };

    const mobileTitle = getMobileTitle();

    return (
        <>
            <header
                onMouseEnter={() => { isHeaderHoveredRef.current = true; }}
                onMouseLeave={() => { isHeaderHoveredRef.current = false; }}
                style={{
                    transform: shouldShowHeader ? 'translateY(0)' : 'translateY(-100px)',
                    transition: 'transform 0.3s ease-in-out'
                }}
                className={`
                    w-full fixed top-0 left-0 right-0 z-40
                    ${headerBg} md:backdrop-blur-md
                    border-b shadow-theme-shadow
                `}
            >
                <div
                    className="absolute inset-0 z-[-1] pointer-events-none opacity-[0.02] dark:opacity-[0.01]"
                    style={{
                        backgroundImage: "url('/images/background/pattern_02.avif')",
                        backgroundRepeat: 'repeat',
                        backgroundSize: '626px 626px'
                    }}
                />
                <div className="w-full flex items-center justify-between mx-auto px-4 sm:px-8 py-4">

                    {/* Left section (Logo + Presentation Toggle) */}
                    <div
                        className="flex-1 flex items-center gap-4"
                    >
                    <button
                        onClick={() => router.push(getLocalizedHref('/all'))}
                        aria-label={logo_alt}
                        className={`transition-[colors,transform,opacity] shadow-md border border-theme-border opacity-100 hover:opacity-80 scale-100 hover:scale-110 cursor-pointer rounded-full overflow-hidden transform-gpu flex`}>
                        <LogoIcon
                            size={32}
                            className="scale-[1.01]"
                        />
                    </button>

                        {/* Share Button (Mobile) */}
                        <div className="md:hidden flex items-center justify-center self-center">
                            <button
                                onClick={handleShare}
                                title="Share this page with current settings"
                                aria-label="Share this page with current settings"
                                className={`
                                    flex items-center justify-center transition-all duration-300 p-2 rounded-full
                                    ${showShareSuccess
                                        ? 'text-green-500 bg-green-500/10 scale-110'
                                        : 'text-theme-muted hover:text-theme-600 dark:hover:text-theme-400'
                                    }
                                `}
                            >
                                {showShareSuccess ? <Check size={20} strokeWidth={2} /> : <Share2 size={20} strokeWidth={2} />}
                            </button>
                        </div>

                        {/* Share Button (Desktop) */}
                        <div className="hidden md:flex items-center justify-center ml-2 self-center">
                            <button
                                onClick={handleShare}
                                title="Share this page with current settings"
                                aria-label="Share this page with current settings"
                                className={`
                                    flex items-center justify-center transition-all duration-300 p-2 rounded-full
                                    ${showShareSuccess
                                        ? 'text-green-500 bg-green-500/10 scale-110'
                                        : 'text-theme-muted hover:text-theme-600 dark:hover:text-theme-400 hover:bg-theme-surface-strong'
                                    }
                                `}
                            >
                                {showShareSuccess ? <Check size={24} strokeWidth={2} /> : <Share2 size={24} strokeWidth={2} />}
                            </button>
                        </div>
                    </div>

                    {/* --- Mobile Title (Center) --- */}
                    <div className="md:hidden font-sans" >
                        {mobileTitle ? (
                            <span className={`flex items-center justify-center transition-[colors,transform] duration-200 text-lg font-black nav-active-gacor whitespace-nowrap cursor-pointer opacity-95`}>
                                {formatCJK(mobileTitle, current_lang)}
                            </span>
                        ) : activeLink && (
                            <span className={`flex items-center justify-center transition-[colors,transform] duration-200 text-lg font-black nav-active-gacor whitespace-nowrap cursor-pointer opacity-95`}>
                                {activeLink.iconName && <span className="mr-2 flex items-center scale-90">{renderIcon(activeLink.iconName)}</span>}
                                {formatCJK(activeLink.name, current_lang)}
                            </span>
                        )}
                    </div>

                    {/* --- Desktop Navigation (Center) --- */}
                    <nav
                        className="hidden md:flex flex-shrink-0"
                    >
                        <ul className="flex items-center space-x-8">
                            {dynamicNavLinks.map((link) => {
                                const hasSubLinks = link.subLinks && link.subLinks.length > 0;

                                if (hasSubLinks) {
                                    const isChildActive = link.subLinks?.some(sub => normalizedPathname === sub.href);

                                    return (
                                        <li key={link.name} className="relative group">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                }}
                                                className={`flex items-center transition-[colors,transform] duration-200
                                                    text-[15px] tracking-wide
                                                    ${isChildActive
                                                        ? `nav-active-gacor font-bold`
                                                        : `${textColor} font-medium hover-gacor group-hover:text-theme-600`
                                                    }`}
                                            >
                                                {link.iconName && <span className="mr-2 hidden lg:inline-block opacity-80 group-hover:opacity-100">{renderIcon(link.iconName)}</span>}
                                                {formatCJK(link.name, current_lang)}
                                                <ChevronDown />
                                            </button>

                                            <HeaderDropdown
                                                subLinks={link.subLinks!}
                                                current_lang={current_lang}
                                                textColor={textColor}
                                                dropdownBg={dropdownBg}
                                                normalizedPathname={normalizedPathname}
                                                renderIcon={renderIcon}
                                            />
                                        </li>
                                    );
                                }

                                // Render Standard Link
                                const isActive = normalizedPathname === link.href;
                                return (
                                    <li key={link.href}>
                                        <Link
                                            href={getLocalizedHref(link.href)}
                                            prefetch={false}
                                            className={`flex items-center transition-colors duration-200
                                                text-[15px] tracking-wide
                                                ${isActive
                                                    ? `nav-active-gacor font-bold`
                                                    : `${textColor} font-medium hover-gacor`
                                                }`}
                                        >
                                            {link.iconName && <span className="mr-2 hidden lg:inline-block opacity-80 group-hover:opacity-100">{renderIcon(link.iconName)}</span>}
                                            {formatCJK(link.name, current_lang)}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Right section */}
                    <div className="flex-1 flex justify-end items-center space-x-2 md:space-x-4">

                        <div className="hidden md:block">
                            {isCommandPaletteOpen && (
                                <CommandPalette
                                    lang={current_lang}
                                    labels={commandPaletteLabels}
                                    isOpen={isCommandPaletteOpen}
                                    onOpenChange={setIsCommandPaletteOpen}
                                />
                            )}
                        </div>

                        <div
                            className="hidden md:block"
                        >
                            <ThemeToggle />
                        </div>

                        <div
                            className="hidden md:block"
                        >
                            <SettingsPopup
                                labels={settings_labels}
                                isOpen={isSettingsOpen}
                                onOpenChange={(open) => {
                                    setIsSettingsOpen(open);
                                }}
                                current_lang={current_lang}
                                languages={languages}
                                onLanguageChange={handleLanguageChange}
                            />
                        </div>

                        {/* --- Mobile Menu Button --- */}
                        <div className="md:hidden flex items-center cursor-pointer">
                            <button
                                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                                className={`transition-all duration-300 z-50 p-2 rounded-lg hover:bg-theme-surface-strong hover-gacor
                                    ${isMobileMenuOpen ? 'nav-active-gacor' : textColor}
                                `}
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                            </button>
                        </div>
                    {/* Desktop Auth Section */}
                        <div className="flex items-center">
                            <HeaderUserMenu
                                user={user}
                                current_lang={current_lang}
                                settings_labels={settings_labels}
                                edit_profile_label={edit_profile_label}
                                login_label={login_label}
                                logout_label={logout_label}
                                textColor={textColor}
                                dropdownBg={dropdownBg}
                                getLocalizedHref={getLocalizedHref}
                            />
                        </div>

                        </div>
                </div>
            </header>

                        {/* --- Mobile Sidebar Navigation --- */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <HeaderMobileMenu
                        key="mobile-menu"
                        navLinks={navLinks}
                        current_lang={current_lang}
                        normalizedPathname={normalizedPathname}
                        textColor={textColor}
                        activeText={activeText}
                        mobileMenuBg={mobileMenuBg}
                        navigation_label={navigation_label}
                        login_label={login_label}
                        register_label={register_label}
                        logout_label={logout_label}
                        edit_profile_label={edit_profile_label}
                        settings_labels={settings_labels}
                        languages={languages}
                        onLanguageChange={handleLanguageChange}
                        user={user}
                        renderIcon={renderIcon}
                        getLocalizedHref={getLocalizedHref}
                        onClose={() => setMobileMenuOpen(false)}
                        navigateWithLoading={(href) => {
                            setMobileMenuOpen(false);
                            setGlobalLoading(true);
                            startTransition(() => {
                                router.push(getLocalizedHref(href));
                            });
                        }}
                        navigateSub={(href) => {
                            router.push(getLocalizedHref(href));
                            setMobileMenuOpen(false);
                        }}
                        signOut={signOut}
                    />
                )}
            </AnimatePresence>

            {/* Toast Notification */}
            <AnimatePresence>
                {showShareSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
                        exit={{ opacity: 0, y: 20, scale: 0.9, x: '-50%' }}
                        className="fixed bottom-8 left-1/2 z-[100] px-6 py-3 rounded-2xl bg-theme-surface shadow-theme-shadow border border-transparent"
                        style={{
                            boxShadow: '0 10px 40px -10px var(--accent-shadow)',
                        }}
                    >
                        {/* Gradient Border Effect */}
                        <div className="absolute inset-0 p-[1.5px] rounded-2xl bg-gradient-to-r from-[var(--gacor-1)] via-[var(--gacor-2)] to-[var(--gacor-3)] -z-10" />
                        <div className="absolute inset-[1.5px] rounded-[15px] bg-theme-surface -z-10" />

                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-theme-500 text-white">
                                <Check size={14} strokeWidth={4} />
                            </div>
                            <span className="font-bold text-sm md:text-base whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-[var(--gacor-1)] via-[var(--gacor-2)] to-[var(--gacor-3)]">
                                {share_copied}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
