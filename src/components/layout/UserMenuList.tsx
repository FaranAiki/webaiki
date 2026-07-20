"use client";

import { User, LogOut } from "lucide-react";
import { BookmarkIcon, RequestIcon, FeedbackIcon } from "./user-menu-icons";
import type { HeaderAuthUser, HeaderSettingsLabels } from "./header.types";

const BUSINESS_EMAIL = "faran.aiki.business@gmail.com";

interface UserMenuListProps {
  user: HeaderAuthUser;
  settings_labels: HeaderSettingsLabels;
  edit_profile_label: string;
  logout_label: string;
  textColor: string;
  variant: "desktop" | "mobile";
  onNavigate: (href: string) => void;
  onSignOut: () => void;
}

// Shared authenticated-user menu items, rendered by both the desktop
// HeaderUserMenu dropdown and the mobile HeaderMobileMenu sidebar.
// Keeping the items in one place avoids duplicating the inline SVG icons
// and their click behaviour across the two navigation surfaces.
export default function UserMenuList({
  user,
  settings_labels,
  edit_profile_label,
  logout_label,
  textColor,
  variant,
  onNavigate,
  onSignOut,
}: UserMenuListProps) {
  const isDesktop = variant === "desktop";
  const iconSize = isDesktop ? 16 : 20;

  const itemClass = isDesktop
    ? `w-full text-left px-4 py-2 text-sm ${textColor} hover:bg-theme-surface-strong transition-all flex items-center group`
    : `flex items-center w-full text-lg font-semibold ${textColor} transition-all duration-300 px-2 group`;

  const dividerClass = isDesktop
    ? "h-px bg-theme-border/50 my-1 mx-2"
    : "h-px bg-theme-border/50 my-2 mx-2";

  const logoutClass = isDesktop
    ? "w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors flex items-center"
    : "flex items-center w-full text-lg font-semibold text-red-500 transition-colors duration-300 hover:text-red-600 px-2";

  const iconClass = "mr-2 group-hover-gacor-svg transition-all";
  const labelClass = "group-hover-gacor-text transition-all duration-300";

  return (
    <>
      <button onClick={() => onNavigate("/edit-profile")} className={itemClass}>
        <User size={iconSize} className={iconClass} />
        <span className={labelClass}>{edit_profile_label}</span>
      </button>

      <div className={dividerClass} />

      <button onClick={() => onNavigate("/bookmarks")} className={itemClass}>
        <BookmarkIcon size={iconSize} className={iconClass} />
        <span className={labelClass}>{settings_labels.My_Bookmarks || "My Bookmarks"}</span>
      </button>

      {user.email === BUSINESS_EMAIL && (
        <button onClick={() => onNavigate("/business-requests")} className={itemClass}>
          <RequestIcon size={iconSize} className={iconClass} />
          <span className={labelClass}>{settings_labels.My_Requests || "My Requests"}</span>
        </button>
      )}

      <button onClick={() => onNavigate("/feedback?filter=mine")} className={itemClass}>
        <FeedbackIcon size={iconSize} className={iconClass} />
        <span className={labelClass}>{settings_labels.My_Feedbacks || "My Feedbacks"}</span>
      </button>

      <button onClick={onSignOut} className={logoutClass}>
        <LogOut size={iconSize} className="mr-2" />
        {logout_label}
      </button>
    </>
  );
}
