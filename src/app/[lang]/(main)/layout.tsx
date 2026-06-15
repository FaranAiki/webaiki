import Header from "@/components/layout/Header";
import "../../globals.css";
// Replace React's per-request cache with Next.js's global cross-request cache

import { getDictionary } from '@/components/layout/Translator';
import { createClient } from '@/utils/supabase/server';

import {
  Home,
  User,
  Share2,
  FileCheck,
  Briefcase,
  Users,
  Trophy,
  Palette,
  Music,
  BookOpen,
  GraduationCap,
  Compass,
  Code,
  Star,
  LayoutGrid,
  Fingerprint,
  Globe,
  Heart,
  MessageSquare,
  Newspaper
} from 'lucide-react';

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  // Use the url parameter directly and load dictionary asynchronously
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const registrationReason = user?.user_metadata?.registration_reason;

  // Navigation Links with Icons
  const navLinks = [
    {
      name: dict.Home,
      href: '#',
      icon: <Home size={18} />,
      subLinks: [
        { name: dict.Home, href: '/', icon: <Home size={16} /> },
        { name: dict.Identity || 'Identity', href: '/identity', icon: <Fingerprint size={16} /> },
        { name: dict.Website || 'Website', href: '/website', icon: <Globe size={16} /> },
        { name: dict.Feedback || 'Feedback', href: '/feedback', icon: <MessageSquare size={16} /> },
      ]
    },

    {
      name: dict.Profile,
      href: '#',
      icon: <User size={18} />,
      subLinks: [
        { name: dict.Portfolio || 'Portfolio', href: '/portfolio', icon: <Star size={16} /> },
        { name: dict.All || 'All', href: '/all', icon: <LayoutGrid size={16} /> },
        { name: dict.Social, href: '/social', icon: <Share2 size={16} /> },
        { name: dict.Certificate, href:'/certificate', icon: <FileCheck size={16} /> },
        { name: dict.News || 'News', href: '/news', icon: <Newspaper size={16} /> },
      ]
    },

    {
      name: dict.Experience,
      href: '#',
      icon: <Compass size={18} />,
      subLinks: [
        { name: dict.Work, href: '/work', icon: <Briefcase size={16} /> },
        { name: dict.Project, href: '/project', icon: <Code size={16} /> },
        { name: dict.Organization, href: '/organization', icon: <Users size={16} /> },
        { name: dict.Award, href: '/award', icon: <Trophy size={16} /> },
        { name: dict.Hire_Me, href: '/hire-me', icon: <Heart size={16} /> },
      ]
    },

    {
      name: dict.Artwork,
      href: '#',
      icon: <Palette size={18} />,
      subLinks: [
        { name: dict.Music, href: '/music', icon: <Music size={16} /> },
        { name: dict.Literature, href:'/literature', icon: <BookOpen size={16} /> },
      ]
    },

    {
      name: dict.College,
      href: '/college',
      icon: <GraduationCap size={18} />
    },
  ];

  // Nest Hire Me link for HR
  if (registrationReason === 'HR') {
    const homeLink = navLinks[0];
    if (homeLink.subLinks) {
      homeLink.subLinks.push({
        name: dict.Hire_Me,
        href: '/hire-me',
        icon: <Heart size={16} />
      });
    }
  }

  // Nest Business Requests link for the owner
  if (user?.email === 'faran.aiki.business@gmail.com') {
    const homeLink = navLinks[0];
    if (homeLink.subLinks) {
      homeLink.subLinks.push({
        name: dict.Business_Requests || 'Business Requests',
        href: '/business-requests',
        icon: <Briefcase size={16} />
      });
    }
  }

  return (
    <>
      <Header
        navLinks={navLinks}
        current_lang={lang}
        portfolio_label={dict.Portfolio}
        all_label={dict.All}
        en_lang={dict.English}
        zh_lang={dict.Mandarin}
        id_lang={dict.Indonesian}
        jp_lang={dict.Japanese}
        ru_lang={dict.Russian}
        fr_lang={dict.French}
        ar_lang={dict.Arabic}
        es_lang={dict.Spanish}
        ko_lang={dict.Korean}
        de_lang={dict.German}
        nl_lang={dict.Dutch}
        ha_lang={dict.Hausa}
        he_lang={dict.Hebrew}
        el_lang={dict.Greek}
        select_lang={dict.Select_Language}
        presentation_mode={dict.Presentation_Mode}
        navigation_label={dict.Navigation}
        logo_alt={dict.Logo_Alt}
        share_copied={dict.Copied_To_Clipboard}
        share_description={dict.Share_Description}
        user={user}
        auth_labels={{
          Login: dict.Login,
          Logout: dict.Logout,
          Edit_Profile: dict.Edit_Profile,
          View_Profile: dict.View_Profile
        }}
        settings_labels={{
          Settings: dict.Settings,
          Typography: dict.Typography,
          Alignment: dict.Alignment,
          Text_Scaling: dict.Text_Scaling,
          Letter_Spacing: dict.Letter_Spacing,
          Line_Height: dict.Line_Height,
          Font_Default: dict.Font_Default,
          Reset_Settings: dict.Reset_Settings,
          Color_Variant: dict.Color_Variant,
          Color_Blue: dict.Color_Blue,
          Color_Pink: dict.Color_Pink,
          Color_Green: dict.Color_Green,
          Color_Purple: dict.Color_Purple,
          Color_Orange: dict.Color_Orange,
          Color_Mono: dict.Color_Mono,
          Advanced_Section: dict.Advanced_Section,
          ATS_Friendly: dict.ATS_Friendly,
          Expand_All: dict.Expand_All,
          Portfolio_Filter: dict.Portfolio_Filter,
          Filter_All: dict.All,
          Filter_Top: dict.Top,
          Education: dict.Education,

          Data: dict.Data,
          Human: dict.Human,
          Technology: dict.Technology,
          Math: dict.Math,
          Management: dict.Management,
          Arts: dict.Arts,
          Achievement: dict.Achievement,
          Language: dict.Language,
          User: dict.User,
          Select_Language: dict.Select_Language
        }}
      />
      <div id="main-content">
        {children}
      </div>
    </>
  );
}
