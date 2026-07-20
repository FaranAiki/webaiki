"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { LogIn, User } from "lucide-react";
import ThemeToggle from "@/components/shared/ThemeToggle";
import SettingsPopup from "@/components/providers/SettingsPopup";
import { formatCJK } from "@/lib/utils";
import type { SettingsLabels } from "@/components/providers/settings.types";
import type { NavLink, HeaderAuthUser } from "./header.types";
import UserMenuList from "./UserMenuList";

export interface LangOption {
  code: string;
  name: string;
  flag: string;
}

interface HeaderMobileMenuProps {
  navLinks: NavLink[];
  current_lang: string;
  normalizedPathname: string;
  textColor: string;
  activeText: string;
  mobileMenuBg: string;
  navigation_label: string;
  login_label: string;
  register_label: string;
  logout_label: string;
  edit_profile_label: string;
  settings_labels: SettingsLabels;
  languages: LangOption[];
  onLanguageChange: (lang: string) => void;
  user?: HeaderAuthUser | null;
  renderIcon: (name?: string, size?: number) => React.ReactNode;
  getLocalizedHref: (href: string) => string;
  onClose: () => void;
  navigateWithLoading: (href: string) => void;
  navigateSub: (href: string) => void;
  signOut: () => void;
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// Code-split from Header: the full mobile sidebar navigation.
// Loaded as a separate chunk (ssr: false) so it doesn't bloat the initial Header bundle.
export default function HeaderMobileMenu({
  navLinks,
  current_lang,
  normalizedPathname,
  textColor,
  activeText,
  mobileMenuBg,
  navigation_label,
  login_label,
  register_label,
  logout_label,
  edit_profile_label,
  settings_labels,
  languages,
  onLanguageChange,
  user,
  renderIcon,
  getLocalizedHref,
  onClose,
  navigateWithLoading,
  navigateSub,
  signOut,
}: HeaderMobileMenuProps) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
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
            onClick={onClose}
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
                        navigateSub(link.subLinks![0].href);
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
                              onClick={onClose}
                              className={`flex items-center text-[16px] transition-[colors,transform] duration-300 ${isActive
                                ? `${activeText} font-bold`
                                : `${textColor} font-medium hover:text-theme-600 hover:translate-x-1`
                              }`}
                            >
                              {subLink.iconName && <span className="mr-3 scale-90 inline-block flex-shrink-0 opacity-70">{renderIcon(subLink.iconName)}</span>}
                              {formatCJK(subLink.name, current_lang)}
                            </Link>
                          </li>
                        );
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
                    onClick={onClose}
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
              onLanguageChange={onLanguageChange}
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
                  <UserMenuList
                    user={user}
                    settings_labels={settings_labels}
                    edit_profile_label={edit_profile_label}
                    logout_label={logout_label}
                    textColor={textColor}
                    variant="mobile"
                    onNavigate={navigateWithLoading}
                    onSignOut={() => {
                      signOut();
                      onClose();
                    }}
                  />
                </div>
              ) : (
                <div className="flex flex-col space-y-4 px-2">
                  <Link
                    href={getLocalizedHref('/login')}
                    prefetch={false}
                    onClick={onClose}
                    className={`flex items-center w-full text-lg font-bold ${textColor} transition-colors duration-300 hover:text-theme-600`}
                  >
                    <LogIn size={20} className="mr-3 text-theme-500" />
                    {login_label}
                  </Link>
                  <Link
                    href={getLocalizedHref('/register')}
                    prefetch={false}
                    onClick={onClose}
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
  );
}
