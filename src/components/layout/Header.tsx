"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { setCookies } from '@/app/actions';
import { useState, useEffect, useRef, useCallback, startTransition } from 'react';
import ThemeToggle from '@/components/shared/ThemeToggle';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { useSettings } from '@/components/providers/SettingsContext';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { m as motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';

const SettingsPopup = dynamic(() => import('@/components/providers/SettingsPopup'), { ssr: false });
const CommandPalette = dynamic(() => import('@/components/interactive/CommandPalette').then(mod => mod.CommandPalette), { ssr: false });

import {
  Monitor, MonitorPlay, Share2, Check, LogIn, LogOut, User, ChevronDown, Handshake, Briefcase,
  Home, FileCheck, Users, Trophy, Palette, Music, BookOpen, GraduationCap, Compass, Code,
  Star, LayoutGrid, Fingerprint, Globe, MessageSquare, Newspaper, MoreHorizontal, Network,
  History, FileText
} from 'lucide-react';

import { usePresentation } from '@/components/providers/PresentationContext';
import { formatCJK } from '@/lib/utils';
import LogoIcon from '@/components/ui/LogoIcon';
import { useAppStore } from '@/lib/store';
import { useAuthActions } from '@/app/auth-hooks';

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

export interface NavLink {
    name: string;
    href: string;
    subLinks?: NavLink[];
    iconName?: string;
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
    user?: {
        email?: string;
        user_metadata?: {
            avatar_url?: string;
            full_name?: string;
            username?: string;
        };
    } | null;
    settings_labels: {
        Settings: string;
        Typography: string;
        Alignment: string;
        Text_Scaling: string;
        Letter_Spacing: string;
        Line_Height: string;
        Font_Default: string;
        Reset_Settings: string;
        Color_Variant: string;
        Color_Blue: string;
        Color_Pink: string;
        Color_Green: string;
        Color_Purple: string;
        Color_Orange: string;
        Color_Grey: string;
        Color_Mono: string;
        Color_Red: string;
        Color_Teal: string;
        Color_Gold: string;
        Advanced_Section: string;
        ATS_Friendly: string;
        Expand_All: string;
        Full_Description_Portfolio: string;
        Portfolio_Filter: string;
        Filter_All: string;
        Filter_Top: string;
        Education: string;
        Data: string;
        Human: string;
        Technology: string;
        Math: string;
        Management: string;
        Arts: string;
        Achievement: string;
        Language: string;
        User: string;
        Select_Language: string;
        My_Bookmarks?: string;
        My_Requests?: string;
        My_Feedbacks?: string;
        My_Preferences?: string;
    };
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
        presentation_mode,
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
        const [user, setUser] = useState<SupabaseUser | null>(null);
        const [dynamicNavLinks, setDynamicNavLinks] = useState<NavLink[]>(navLinks);

        useEffect(() => {
            const handleOpenCommandPalette = () => setIsCommandPaletteOpen(true);
            window.addEventListener('open-command-palette', handleOpenCommandPalette);
            return () => window.removeEventListener('open-command-palette', handleOpenCommandPalette);
        }, []);

        useEffect(() => {
            let mounted = true;
            const fetchUser = async () => {
                try {
                    const supabase = createClient();
                    const { data: { user }, error } = await supabase.auth.getUser();
                    if (mounted) {
                        setUser(user || null);
                    }
                } catch (e) {
                    console.error("Failed to fetch user auth state", e);
                }
            };
            fetchUser();
            return () => { mounted = false; };
        }, []);

        // Sync navLinks when props change, and apply user-specific links if logged in
        useEffect(() => {
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
            setDynamicNavLinks(newNavLinks);
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
        const [mounted, setMounted] = useState(false);
        const { isPresentationMode, togglePresentationMode } = usePresentation();
        const settings = useSettings();
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

    useEffect(() => {
        setMounted(true);
    }, []);

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

    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isDark = mounted && resolvedTheme === 'dark';

    // Dynamic Classes - Reduce backdrop-blur on mobile for performance
    const headerBg = isDark
        ? 'bg-theme-bg-dark/80 border-theme-border'
        : 'bg-theme-surface/80 border-theme-border';

    const mobileMenuBg = isDark ? 'bg-theme-bg-dark/95' : 'bg-theme-surface-strong/95';
    const textColor = "text-[var(--text-muted)]";
    const activeText = isDark ? 'text-theme-400' : 'text-theme-600';
    const dropdownBg = isDark ? 'bg-theme-bg-dark border-theme-border' : 'bg-theme-surface border-theme-border';

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
            <motion.header
                initial={{ y: 0 }}
                animate={{ y: shouldShowHeader ? 0 : -100 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                onMouseEnter={() => { isHeaderHoveredRef.current = true; }}
                onMouseLeave={() => { isHeaderHoveredRef.current = false; }}
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
                                        : isDark
                                            ? 'text-theme-muted hover:text-theme-400'
                                            : 'text-theme-muted hover:text-theme-600'
                                    }
                                `}
                            >
                                {showShareSuccess ? <Check size={20} strokeWidth={2} /> : <Share2 size={20} strokeWidth={2} />}
                            </button>
                        </div>

                        {/* Presentation Mode Toggle */}
                        {(normalizedPathname !== '/' && normalizedPathname !== '/portfolio' && normalizedPathname !== '/all' && normalizedPathname !== '/login' && normalizedPathname !== '/register' && normalizedPathname !== '/hire-me') && (
                            <div className="hidden md:flex items-center justify-center ml-4 self-center">
                                <button
                                    onClick={togglePresentationMode}
                                    title={presentation_mode}
                                    aria-label={presentation_mode}
                                    className={`
                                        flex items-center justify-center transition-all duration-300 p-2 rounded-full
                                        ${(mounted && isPresentationMode)
                                            ? 'text-theme-500 bg-theme-500/10 scale-110 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                                            : isDark
                                                ? 'text-theme-muted hover:text-theme-400 hover:bg-theme-surface-strong'
                                                : 'text-theme-muted hover:text-theme-600 hover:bg-theme-surface-strong'
                                        }
                                    `}
                                >
                                    {(mounted && isPresentationMode) ? <MonitorPlay size={24} strokeWidth={2} /> : <Monitor size={24} strokeWidth={2} />}
                                </button>
                            </div>
                        )}

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
                                        : isDark
                                            ? 'text-theme-muted hover:text-theme-400 hover:bg-theme-surface-strong'
                                            : 'text-theme-muted hover:text-theme-600 hover:bg-theme-surface-strong'
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

                                            {/* Dropdown Menu */}
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 pt-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-[colors,transform,opacity] duration-200 ease-in-out">
                                                <ul className={`${dropdownBg} rounded-xl shadow-xl py-3 min-w-[200px] ring-1 ring-black/5`}>
                                                    {link.subLinks!.map((subLink) => {
                                                        const isSubActive = normalizedPathname === subLink.href;
                                                        return (
                                                            <li key={subLink.href}>
                                                                <Link
                                                                    href={getLocalizedHref(subLink.href)}
                                                                    prefetch={false}
                                                                    onClick={(e) => e.currentTarget.blur()}
                                                                    className={`flex items-center px-5 py-3 text-[14px] hover:bg-theme-surface-strong/50 transition-[colors,transform] ${isSubActive
                                                                            ? `nav-active-gacor font-bold`
                                                                            : `${textColor} hover-gacor font-medium`
                                                                        }`}
                                                                >
                                                                    {subLink.iconName && <span className="mr-3 opacity-70 group-hover:opacity-100 hidden lg:inline-block scale-90">{renderIcon(subLink.iconName)}</span>}
                                                                    {formatCJK(subLink.name, current_lang)}
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
                            {user ? (
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        aria-label="Toggle user menu"
                                        aria-expanded={isUserMenuOpen}
                                        className="flex items-center space-x-2 p-1 rounded-full hover:bg-theme-surface-strong transition-colors border border-transparent hover:border-theme-border"
                                    >
                                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-theme-border shadow-sm">
                                            <Image
                                                src={user.user_metadata?.avatar_url || '/images/no_photo_profile.webp'}
                                                alt={`${user.user_metadata?.full_name || user.email || 'User'} - Faran Aiki Portfolio Profile`}
                                                fill
                                                sizes="32px"
                                                className="object-cover"
                                            />
                                        </div>
                                        <ChevronDown />
                                    </button>

                                    <AnimatePresence>
                                        {isUserMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl border border-theme-border ${dropdownBg} py-2 z-50`}
                                            >
                                                <div className="px-4 py-2 border-b border-theme-border mb-1">
                                                    <p className="text-sm font-bold truncate">
                                                        {user.user_metadata?.full_name || user.user_metadata?.username || 'User'}
                                                    </p>
                                                    <p className="text-xs text-theme-muted truncate">
                                                        {user.email}
                                                    </p>
                                                </div>

                                                                                                <button
                                                    onClick={() => {
                                                        setIsUserMenuOpen(false);
                                                        setGlobalLoading(true);
                                                        startTransition(() => {
                                                            router.push(getLocalizedHref('/edit-profile'));
                                                        });
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-sm ${textColor} hover:bg-theme-surface-strong transition-colors flex items-center`}
                                                >
                                                    <User size={16} className="mr-2" />
                                                    {edit_profile_label}
                                                </button>

                                                <div className="h-px bg-theme-border/50 my-1 mx-2" />

                                                <button
                                                    onClick={() => {
                                                        setIsUserMenuOpen(false);
                                                        setGlobalLoading(true);
                                                        startTransition(() => {
                                                            router.push(getLocalizedHref('/bookmarks'));
                                                        });
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-sm ${textColor} hover:bg-theme-surface-strong transition-colors flex items-center`}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                                    {settings_labels.My_Bookmarks || 'My Bookmarks'}
                                                </button>

                                                {user?.email === 'faran.aiki.business@gmail.com' && (
                                                <button
                                                    onClick={() => {
                                                        setIsUserMenuOpen(false);
                                                        setGlobalLoading(true);
                                                        startTransition(() => {
                                                            router.push(getLocalizedHref('/business-requests'));
                                                        });
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-sm ${textColor} hover:bg-theme-surface-strong transition-colors flex items-center`}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                                                    {settings_labels.My_Requests || 'My Requests'}
                                                </button>
                                                )}

                                                <button
                                                    onClick={() => {
                                                        setIsUserMenuOpen(false);
                                                        setGlobalLoading(true);
                                                        startTransition(() => {
                                                            router.push(getLocalizedHref('/feedback?filter=mine'));
                                                        });
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-sm ${textColor} hover:bg-theme-surface-strong transition-colors flex items-center`}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                                    {settings_labels.My_Feedbacks || 'My Feedbacks'}
                                                </button>



                                                <button
                                                    onClick={() => {
                                                        setIsUserMenuOpen(false);
                                                        signOut();
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors flex items-center"
                                                >
                                                    <LogOut size={16} className="mr-2" />
                                                    {logout_label}
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Link
                                    href={getLocalizedHref('/login')}
                                    prefetch={false}
                                    title={login_label}
                                    aria-label={login_label}
                                    className={`
                                        flex items-center justify-center transition-all duration-300 p-2 rounded-full
                                        ${isDark
                                            ? 'text-theme-muted hover:text-theme-400 hover:bg-theme-surface-strong'
                                            : 'text-theme-muted hover:text-theme-600 hover:bg-theme-surface-strong'
                                        }
                                    `}
                                >
                                    <LogIn size={24} strokeWidth={2} />
                                </Link>
                            )}
                        </div>

                        </div>
                </div>
            </motion.header>

            {/* --- Mobile Sidebar Navigation --- */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="md:hidden fixed inset-0 bg-black/40 z-[50] backdrop-blur-sm"
                        />

                        {/* Sidebar */}
                        <motion.div
                            data-lenis-prevent
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className={`no-scrollbar fixed top-0 right-0 h-full w-[85%] max-w-sm ${mobileMenuBg} md:backdrop-blur-xl shadow-2xl z-[60] md:hidden overflow-y-auto`}
                        >
                            <div
                                className="absolute inset-0 z-[-1] pointer-events-none opacity-[0.02] dark:opacity-[0.02]"
                                style={{
                                    backgroundImage: "url('/images/background/pattern_02.avif')",
                                    backgroundRepeat: 'repeat',
                                    backgroundSize: '626px 626px'
                                }}
                            />
                            <div className="absolute top-4 right-4 z-[70]">
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`p-2 rounded-lg hover:bg-theme-surface-strong transition-colors hover-gacor ${textColor}`}
                                    aria-label="Close menu"
                                >
                                    <CloseIcon />
                                </button>
                            </div>
                            <nav className="mt-20 px-8 pb-12">
                                <div className="mb-8 border-b border-theme-border pb-4">
                                    <span className={`text-xl font-black tracking-tight nav-active-gacor`}>
                                        {formatCJK(navigation_label, current_lang)}
                                    </span>
                                </div>

                                <ul className="flex flex-col space-y-6 mb-10">
                                    {navLinks.map((link) => {
                                        if (link.subLinks && link.subLinks.length > 0) {
                                            return (
                                                <li key={link.name}>
                                                    <button
                                                        onClick={(e) => {
                                                            e.currentTarget.blur();
                                                            router.push(getLocalizedHref(link.subLinks![0].href));
                                                            setMobileMenuOpen(false);
                                                        }}
                                                        className={`flex items-center text-sm font-bold text-theme-muted mb-4 text-left w-full`}
                                                    >
                                                        {link.iconName && <span className="mr-2 inline-block flex-shrink-0 opacity-70">{renderIcon(link.iconName)}</span>}
                                                        {formatCJK(link.name, current_lang)}
                                                    </button>
                                                    <ul className="flex flex-col space-y-4 pl-4 border-l-2 border-theme-border">
                                                        {link.subLinks.map(subLink => {
                                                            const isActive = normalizedPathname === subLink.href;
                                                            return (
                                                                <li key={subLink.href}>
                                                                    <Link
                                                                        href={getLocalizedHref(subLink.href)}
                                                                        prefetch={false}
                                                                        onClick={() => setMobileMenuOpen(false)}
                                                                        className={`flex items-center text-[16px] transition-[colors,transform] duration-300 ${isActive
                                                                                ? `${activeText} font-bold`
                                                                                : `${textColor} font-medium hover:text-theme-600 hover:translate-x-1`
                                                                            }`}
                                                                    >
                                                                        {subLink.iconName && <span className="mr-3 scale-90 inline-block flex-shrink-0 opacity-70">{renderIcon(subLink.iconName)}</span>}
                                                                        {formatCJK(subLink.name, current_lang)}
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
                                                    prefetch={false}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className={`flex items-center text-lg transition-[colors,transform] duration-300 ${isActive
                                                            ? `${activeText} font-bold`
                                                            : `${textColor} font-semibold hover:text-theme-600`
                                                        }`}
                                                >
                                                    {link.iconName && <span className="mr-3 inline-block flex-shrink-0 opacity-80">{renderIcon(link.iconName)}</span>}
                                                    {formatCJK(link.name, current_lang)}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>

                                <div className={`mt-10 mb-8 border-t border-theme-border pt-8`}>
                                    <div className="flex justify-between items-center mb-6">
                                        <ThemeToggle />
                                    </div>
                                    <SettingsPopup
                                        labels={settings_labels}
                                        inline={true}
                                        current_lang={current_lang}
                                        languages={languages}
                                        onLanguageChange={handleLanguageChange}
                                    />

                                    {/* Mobile Auth */}
                                    <div className="mt-6">
                                        {user ? (
                                            <div className="flex flex-col space-y-4">
                                                <div className="flex items-center space-x-3 p-3 rounded-xl bg-theme-surface-strong/30 border border-theme-border">
                                                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-theme-border shadow-md flex-shrink-0">
                                                        <Image
                                                            src={user.user_metadata?.avatar_url || '/images/no_photo_profile.webp'}
                                                            alt={`${user.user_metadata?.full_name || user.email || 'User'} - Faran Aiki Portfolio Profile`}
                                                            fill
                                                            sizes="48px"
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col overflow-hidden">
                                                        <span className="font-bold text-sm truncate">
                                                            {user.user_metadata?.full_name || user.user_metadata?.username || 'User'}
                                                        </span>
                                                        <span className="text-xs text-theme-muted truncate">
                                                           {user.email}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col space-y-2">
                                                    <button
                                                        onClick={() => {
                                                            setMobileMenuOpen(false);
                                                            setGlobalLoading(true);
                                                            startTransition(() => {
                                                                router.push(getLocalizedHref('/edit-profile'));
                                                            });
                                                        }}
                                                        className={`flex items-center w-full text-lg font-semibold ${textColor} transition-colors duration-300 hover:text-theme-600 px-2`}
                                                    >
                                                        <User size={20} className="mr-3" />
                                                        {edit_profile_label}
                                                    </button>
                                                    <div className="h-px bg-theme-border/50 my-2 mx-2" />
                                                    <button
                                                        onClick={() => {
                                                            setMobileMenuOpen(false);
                                                            setGlobalLoading(true);
                                                            startTransition(() => {
                                                                router.push(getLocalizedHref('/bookmarks'));
                                                            });
                                                        }}
                                                        className={`flex items-center w-full text-lg font-semibold ${textColor} transition-colors duration-300 hover:text-theme-600 px-2`}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                                        {settings_labels.My_Bookmarks || 'My Bookmarks'}
                                                    </button>
                                                    {user?.email === 'faran.aiki.business@gmail.com' && (
                                                    <button
                                                        onClick={() => {
                                                            setMobileMenuOpen(false);
                                                            setGlobalLoading(true);
                                                            startTransition(() => {
                                                                router.push(getLocalizedHref('/business-requests'));
                                                            });
                                                        }}
                                                        className={`flex items-center w-full text-lg font-semibold ${textColor} transition-colors duration-300 hover:text-theme-600 px-2`}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                                                        {settings_labels.My_Requests || 'My Requests'}
                                                    </button>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            setMobileMenuOpen(false);
                                                            setGlobalLoading(true);
                                                            startTransition(() => {
                                                                router.push(getLocalizedHref('/feedback?filter=mine'));
                                                            });
                                                        }}
                                                        className={`flex items-center w-full text-lg font-semibold ${textColor} transition-colors duration-300 hover:text-theme-600 px-2`}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                                        {settings_labels.My_Feedbacks || 'My Feedbacks'}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            signOut();
                                                            setMobileMenuOpen(false);
                                                        }}
                                                        className={`flex items-center w-full text-lg font-semibold text-red-500 transition-colors duration-300 hover:text-red-600 px-2`}
                                                    >
                                                        <LogOut size={20} className="mr-3" />
                                                        {logout_label}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col space-y-4 px-2">
                                                <Link
                                                    href={getLocalizedHref('/login')}
                                                    prefetch={false}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className={`flex items-center w-full text-lg font-bold ${textColor} transition-colors duration-300 hover:text-theme-600`}
                                                >
                                                    <LogIn size={20} className="mr-3 text-theme-500" />
                                                    {login_label}
                                                </Link>
                                                <Link
                                                    href={getLocalizedHref('/register')}
                                                    prefetch={false}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className={`flex items-center w-full text-lg font-bold ${textColor} transition-colors duration-300 hover:text-theme-600`}
                                                >
                                                    <User size={20} className="mr-3 text-theme-500" />
                                                    {register_label}
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </nav>
                        </motion.div>
                    </>
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
