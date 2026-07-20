"use client";

import Link from "next/link";
import { useState, useRef, useEffect, startTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { m as motion, AnimatePresence } from "framer-motion";
import { LogIn, ChevronDown } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useAuthActions } from "@/app/auth-hooks";
import UserMenuList from "./UserMenuList";
import type { HeaderAuthUser, HeaderSettingsLabels } from "./header.types";

interface HeaderUserMenuProps {
  user?: HeaderAuthUser | null;
  current_lang: string;
  settings_labels: HeaderSettingsLabels;
  edit_profile_label: string;
  login_label: string;
  logout_label: string;
  textColor: string;
  dropdownBg: string;
  getLocalizedHref: (href: string) => string;
}

// Code-split from Header: the desktop account menu (avatar dropdown when
// signed in, or the login button when signed out). Self-contained so the
// open/close state, click-outside handling and navigation live here instead
// of bloating the main Header component.
export default function HeaderUserMenu({
  user,
  current_lang,
  settings_labels,
  edit_profile_label,
  login_label,
  logout_label,
  textColor,
  dropdownBg,
  getLocalizedHref,
}: HeaderUserMenuProps) {
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const setGlobalLoading = useAppStore((state) => state.setGlobalLoading);
  const { signOut } = useAuthActions(current_lang);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigateWithLoading = (href: string) => {
    setIsUserMenuOpen(false);
    setGlobalLoading(true);
    startTransition(() => {
      router.push(getLocalizedHref(href));
    });
  };

  if (!user) {
    return (
      <Link
        href={getLocalizedHref("/login")}
        prefetch={false}
        title={login_label}
        aria-label={login_label}
        className="flex items-center justify-center transition-all duration-300 p-2 rounded-full text-theme-muted hover:text-theme-600 dark:hover:text-theme-400 hover:bg-theme-surface-strong"
      >
        <LogIn size={24} strokeWidth={2} />
      </Link>
    );
  }

  return (
    <div className="relative" ref={userMenuRef}>
      <button
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        aria-label="Toggle user menu"
        aria-expanded={isUserMenuOpen}
        className="flex items-center space-x-2 p-1 rounded-full hover:bg-theme-surface-strong transition-colors border border-transparent hover:border-theme-border"
      >
        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-theme-border shadow-sm">
          <Image
            src={user.user_metadata?.avatar_url || "/images/no_photo_profile.webp"}
            alt={`${user.user_metadata?.full_name || user.email || "User"} - Faran Aiki Portfolio Profile`}
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
                {user.user_metadata?.full_name || user.user_metadata?.username || "User"}
              </p>
              <p className="text-xs text-theme-muted truncate">
                {user.email}
              </p>
            </div>

            <UserMenuList
              user={user}
              settings_labels={settings_labels}
              edit_profile_label={edit_profile_label}
              logout_label={logout_label}
              textColor={textColor}
              variant="desktop"
              onNavigate={navigateWithLoading}
              onSignOut={() => {
                setIsUserMenuOpen(false);
                signOut();
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
