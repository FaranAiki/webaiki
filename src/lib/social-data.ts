export interface SocialLink {
  name: string;
  username: string;
  url: string;
  iconName: 'Github' | 'Linkedin' | 'Instagram' | 'Twitter' | 'Mail' | 'Youtube' | 'LinkTree' | 'TikTok' | 'MyAnimeList' | 'Lichess' | 'Quora' | 'Reddit' | 'SlideShare' | 'Scribd' | 'Line' | 'Telegram';
  color: string;
  keywords: string[];
}

export const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    username: "FaranAiki",
    url: "https://github.com/FaranAiki",
    iconName: 'Github',
    color: "hover:border-theme-border",
    keywords: ["github", "code", "repo", "git"]
  },
  {
    name: "LinkedIn",
    username: "Muhammad Faran Aiki",
    url: "https://www.linkedin.com/in/faranaiki/",
    iconName: 'Linkedin',
    color: "hover:border-theme-500",
    keywords: ["linkedin", "professional", "work", "job", "career"]
  },
  {
    name: "Instagram",
    username: "@mfaranaiki",
    url: "https://www.instagram.com/mfaranaiki/",
    iconName: 'Instagram',
    color: "hover:border-pink-500",
    keywords: ["instagram", "ig", "social", "photo"]
  },
  {
    name: "Twitter / X",
    username: "@FaranAiki",
    url: "https://x.com/FaranAiki",
    iconName: 'Twitter',
    color: "hover:border-sky-500",
    keywords: ["twitter", "x", "social", "tweet"]
  },
  {
    name: "Link Tree",
    username: "Faran Aiki",
    url: "https://linktr.ee/FaranAiki",
    iconName: 'LinkTree',
    color: "hover:border-green-200",
    keywords: ["linktree", "links", "bio"]
  },
  {
    name: "YouTube",
    username: "Muhammad Faran Aiki",
    url: "https://www.youtube.com/@FaranAiki",
    iconName: 'Youtube',
    color: "hover:border-red-600",
    keywords: ["youtube", "video", "channel", "yt"]
  },
  {
    name: "TikTok",
    username: "@faranaiki07",
    url: "https://www.tiktok.com/@faranaiki07",
    iconName: 'TikTok',
    color: "hover:border-black",
    keywords: ["tiktok", "video", "social"]
  },
  {
    name: "Email",
    username: "faran.aiki.business@gmail.com",
    url: "mailto:faran.aiki.business@gmail.com",
    iconName: 'Mail',
    color: "hover:border-teal-400",
    keywords: ["email", "mail", "contact", "business"]
  },
  {
    name: "My Anime List",
    username: "FaranAiki",
    url: "https://myanimelist.net/profile/FaranAiki",
    iconName: 'MyAnimeList',
    color: "hover:border-blue-600",
    keywords: ["mal", "anime", "manga", "list"]
  },
  {
    name: "Lichess",
    username: "FaranAiki",
    url: "https://lichess.org/@/FaranAiki",
    iconName: 'Lichess',
    color: "hover:border-white",
    keywords: ["chess", "lichess", "game"]
  },
  {
    name: "Quora",
    username: "Muhammad Faran Aiki",
    url: "https://id.quora.com/profile/Muhammad-Faran-Aiki-4",
    iconName: 'Quora',
    color: "hover:border-red-600",
    keywords: ["quora", "qa", "knowledge"]
  },
  {
    name: "Reddit",
    username: "FaranAiki",
    url: "https://www.reddit.com/user/FaranAiki/",
    iconName: 'Reddit',
    color: "hover:border-red-300",
    keywords: ["reddit", "social", "forum"]
  },
  {
    name: "SlideShare",
    username: "Faran Aiki",
    url: "https://www.slideshare.net/MuhammadFaranAiki",
    iconName: 'SlideShare',
    color: "hover:border-orange-300",
    keywords: ["slideshare", "presentation", "slides"]
  },
  {
    name: "Scribd",
    username: "Muhammad Faran Aiki",
    url: "https://id.scribd.com/user/530310522/Muhammad-Faran-Aiki",
    iconName: 'Scribd',
    color: "hover:border-green-300",
    keywords: ["scribd", "documents", "books"]
  },
  {
    name: "Line",
    username: "@faranaiki_",
    url: "https://line.me/ti/p/8ZF2kENUEj",
    iconName: 'Line',
    color: "hover:border-green-400",
    keywords: ["line", "messenger", "chat"]
  },
  {
    name: "Telegram",
    username: "@FaranAiki",
    url: "https://t.me/FaranAiki",
    iconName: 'Telegram',
    color: "hover:border-blue-300",
    keywords: ["telegram", "message", "chat", "contact"]
  },
];
