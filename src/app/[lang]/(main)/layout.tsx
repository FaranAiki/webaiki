import Header from "@/components/layout/Header";
import "../../globals.css";
// Replace React's per-request cache with Next.js's global cross-request cache

import { getDictionary } from '@/components/layout/Translator';
import dynamic from 'next/dynamic';
const TerminalOverlay = dynamic(() => import("@/components/interactive/TerminalOverlay"));


export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','navbar']);

  // Navigation Links with Icons
  const navLinks = [
    {
      name: dict.Home,
      href: '#',
      iconName: 'home',
      subLinks: [
        { name: dict.Home, href: '/', iconName: 'home' },
        { name: dict.Identity || 'Identity', href: '/identity', iconName: 'fingerprint' },
        { name: dict.Website || 'Website', href: '/website', iconName: 'globe' },
        { name: dict.Feedback || 'Feedback', href: '/feedback', iconName: 'message' },
      ]
    },

    {
      name: dict.Profile,
      href: '#',
      iconName: 'user',
      subLinks: [
        { name: dict.Portfolio || 'Portfolio', href: '/portfolio', iconName: 'star' },
        { name: dict.All || 'All', href: '/all', iconName: 'grid' },
        { name: dict.Social, href: '/social', iconName: 'share' },
        { name: dict.Certificate, href:'/certificate', iconName: 'check' },
        { name: dict.News || 'News', href: '/news', iconName: 'news' },
      ]
    },

    {
      name: dict.Experience,
      href: '#',
      iconName: 'compass',
      subLinks: [
        { name: dict.Work, href: '/work', iconName: 'briefcase' },
        { name: dict.Project, href: '/project', iconName: 'code' },
        { name: dict.Organization, href: '/organization', iconName: 'users' },
        { name: dict.Award, href: '/award', iconName: 'trophy' },
        { name: dict.Hire_Me, href: '/hire-me', iconName: 'handshake' },
      ]
    },

    {
      name: dict.Artwork,
      href: '#',
      iconName: 'palette',
      subLinks: [
        { name: dict.Music, href: '/music', iconName: 'music' },
        { name: dict.Literature, href:'/literature', iconName: 'book' },
      ]
    },

    {
      name: dict.Nav_Other || 'Other',
      href: '#',
      iconName: 'more',
      subLinks: [
        { name: dict.College, href: '/college', iconName: 'cap' },
        { name: dict.Academic_Transcript || 'Academic Transcript', href: '/academic-transcript', iconName: 'file' },
        { name: dict.Timeline || 'Timeline', href: '/timeline', iconName: 'history' },
        { name: dict.Sitemap_Graph || 'Sitemap Graph', href: '/sitemap-graph', iconName: 'network' }
      ]
    },
  ];



  // Derive page routes for the terminal from navLinks (single source of truth)
  // Each navLink or subLink with a real href becomes a terminal page route.
  const terminalPageRoutes: { slug: string; label: string }[] = [
    { slug: '', label: dict.Home || 'Home' } // root/home always first
  ];

  navLinks.forEach(link => {
    if (link.subLinks) {
      link.subLinks.forEach(sub => {
        // href is '/' for home (already added) or '/slug' for other pages
        const slug = sub.href === '/' ? '' : sub.href.replace(/^\//, '');
        if (slug && !terminalPageRoutes.some(r => r.slug === slug)) {
          terminalPageRoutes.push({ slug, label: sub.name });
        }
      });
    } else if (link.href && link.href !== '#') {
      const slug = link.href.replace(/^\//, '');
      if (slug && !terminalPageRoutes.some(r => r.slug === slug)) {
        terminalPageRoutes.push({ slug, label: link.name });
      }
    }
  });

  // Add auth/utility pages that exist as real app directories but are not in navLinks
  const utilityPages: { slug: string; label: string }[] = [
    { slug: 'login',        label: dict.Login        || 'Login'        },
    { slug: 'register',     label: dict.Register      || 'Register'     },
    { slug: 'edit-profile', label: dict.Edit_Profile  || 'Edit Profile' },
    { slug: 'latest',       label: dict.Latest        || 'Latest'       },
  ];

  utilityPages.forEach(p => {
    if (!terminalPageRoutes.some(r => r.slug === p.slug)) {
      terminalPageRoutes.push(p);
    }
  });

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
        hi_lang={dict.Hindi || 'Hindi'}
        pt_lang={dict.Portuguese || 'Portuguese'}
        bn_lang={dict.Bengali || 'Bengali'}
        vi_lang={dict.Vietnamese || 'Vietnamese'}
        commandPaletteLabels={{
          placeholder: dict.Command_Palette_Search_Placeholder || "Type a command or search portfolio...",
          navigation: dict.Navigation || "Navigation",
          home: dict.Home || "Home",
          portfolio: dict.Portfolio || "Portfolio",
          projects: dict.Project || "Projects",
          awards: dict.Award || "Awards",
          college: dict.College || "College Documents",
          news: dict.News_And_Activity || "News & Articles",
          hireMe: dict.Hire_Me || "Hire Me",
          theme: dict.Theme || "Theme",
          lightTheme: dict.Light_Theme || "Light Theme",
          darkTheme: dict.Dark_Theme || "Dark Theme",
          systemTheme: dict.System_Theme || "System Theme",
          language: dict.Language || "Language",
          searchResults: dict.Search_Results || "Search Results",
          noResults: dict.No_Results_Found || "No results found.",
          searching: dict.Searching || "Searching...",
          suggestions: dict.Suggestions || "Suggestions",
        }}
        select_lang={dict.Select_Language}
        presentation_mode={dict.Presentation_Mode}
        navigation_label={dict.Navigation}
        logo_alt={dict.Logo_Alt}
        share_copied={dict.Copied_To_Clipboard}
        share_description={dict.Share_Description}
        login_label={dict.Login}
        logout_label={dict.Logout}
        register_label={dict.Register}
        edit_profile_label={dict.Edit_Profile}
        hire_me_label={dict.Hire_Me}
        business_requests_label={dict.Business_Requests || 'Business Requests'}
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
          Full_Description_Portfolio: dict.Full_Description_Portfolio || 'Full Description (Portfolio)',
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
          Select_Language: dict.Select_Language,
          My_Bookmarks: dict.My_Bookmarks,
          My_Requests: dict.My_Requests,
          My_Feedbacks: dict.My_Feedbacks
        }}
      />
      <div id="main-content">
        {children}
      </div>
      <TerminalOverlay
        lang={lang}
        dict={dict}
        username={null}
        pageRoutes={terminalPageRoutes}
      />
    </>
  );
}
