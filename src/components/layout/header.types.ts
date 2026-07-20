import type { SettingsLabels } from "@/components/providers/settings.types";

export interface NavLink {
  name: string;
  href: string;
  subLinks?: NavLink[];
  iconName?: string;
}

export interface HeaderAuthUser {
  email?: string | null;
  user_metadata?: {
    avatar_url?: string | null;
    full_name?: string | null;
    username?: string | null;
    registration_reason?: string | null;
  } | null;
}

export type HeaderSettingsLabels = SettingsLabels;
