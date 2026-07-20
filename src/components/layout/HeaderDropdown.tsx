"use client";

import Link from "next/link";
import { formatCJK } from "@/lib/utils";

interface NavSubLink {
  name: string;
  href: string;
  iconName?: string;
}

interface HeaderDropdownProps {
  subLinks: NavSubLink[];
  current_lang: string;
  textColor: string;
  dropdownBg: string;
  normalizedPathname: string;
  renderIcon: (name?: string, size?: number) => React.ReactNode;
}

// Code-split from Header: the heavy desktop mega-menu submenu.
// Loaded as a separate chunk so it doesn't bloat the initial Header bundle.
export default function HeaderDropdown({
  subLinks,
  current_lang,
  textColor,
  dropdownBg,
  normalizedPathname,
  renderIcon,
}: HeaderDropdownProps) {
  const getLocalizedHref = (href: string) => {
    if (href === "#" || href.startsWith("http")) return href;
    if (href === "/") return `/${current_lang}`;
    return `/${current_lang}${href}`;
  };

  return (
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 pt-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-[colors,transform,opacity] duration-200 ease-in-out">
      <ul className={`${dropdownBg} rounded-xl shadow-xl py-3 min-w-[200px] ring-1 ring-black/5`}>
        {subLinks.map((subLink) => {
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
  );
}
