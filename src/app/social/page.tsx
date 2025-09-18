import type { Metadata } from "next";
import "../globals.css";
import { Inter } from "next/font/google";
import { Github, Linkedin, Instagram, Twitter, Mail, Youtube } from 'lucide-react';
import Image from 'next/image';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Faran Aiki's Social Media",
  description: "Faran Aiki's personal files, portfolio, and others",
};

// Cannot use /public/json/ lol because of optimization for icon
const socialLinks = [
  {
    name: "GitHub",
    username: "FaranAiki",
    url: "https://github.com/FaranAiki",
    icon: <Github size={48} className="text-white" />,
    color: "hover:border-gray-500"
  },
  {
    name: "LinkedIn",
    username: "Muhammad Faran Aiki",
    url: "https://www.linkedin.com/in/muhammad-faran-aiki-8a6305343/",
    icon: <Linkedin size={48} className="text-blue-500" />,
    color: "hover:border-blue-500"
  },
  {
    name: "Instagram",
    username: "@mfaranaiki",
    url: "https://www.instagram.com/mfaranaiki/",
    icon: <Instagram size={48} className="text-pink-500" />,
    color: "hover:border-pink-500"
  },
  {
    name: "Twitter / X",
    username: "@FaranAiki",
    url: "https://x.com/FaranAiki",
    icon: <Twitter size={48} className="text-sky-500" />,
    color: "hover:border-sky-500"
  },
  {
    name: "Link Tree",
    username: "Faran Aiki",
    url: "linktr.ee/FaranAiki",
    icon: <Image alt="LinkTree icon" width="48" height="48" src="https://upload.wikimedia.org/wikipedia/en/thumb/b/bf/Linktree_logo.svg/768px-Linktree_logo.svg.png?20230519151448" unoptimized />,
    color: "hover:border-green-200"
  },
  {
    name: "YouTube",
    username: "Muhammad Faran Aiki",
    url: "https://www.youtube.com/@FaranAiki",
    icon: <Youtube size={48} className="text-red-600" />,
    color: "hover:border-red-600"
  },
  {
    name: "TikTok",
    username: "@faranaiki07",
    url: "https://www.tiktok.com/@faranaiki07",
    icon: <Image alt="Tiktok icon" width="48" height="48" src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Tiktok_icon.svg" />,
    color: "hover:border-black"
  },
  {
    name: "Email",
    username: "faran.aiki.business@gmail.com",
    url: "mailto:faran.aiki.business@gmail.com",
    icon: <Mail size={48} className="text-teal-400" />,
    color: "hover:border-teal-400"
  },
  {
    name: "My Anime List",
    username: "FaranAiki",
    url: "https://myanimelist.net/profile/FaranAiki",
    icon: <Image alt='My Anime List icon' width="48" height="48" src="https://upload.wikimedia.org/wikipedia/commons/7/7a/MyAnimeList_Logo.png" />,
    color: "hover:border-blue-600"
  },
  {
    name: "Lichess",
    username: "FaranAiki",
    url: "https://lichess.org/@/FaranAiki",
    icon: <Image alt='Lichess icon' width="48" height="48" src="https://upload.wikimedia.org/wikipedia/commons/d/da/Lichess_Logo_2019.svg" />,
    color: "hover:border-white"
  },
  {
    name: "Quora",
    username: "Muhammad Faran Aiki",
    url: "https://id.quora.com/profile/Muhammad-Faran-Aiki-4",
    icon: <Image alt='Quora icon' width="48" height="48" src="https://upload.wikimedia.org/wikipedia/commons/0/09/Quora_icon.svg" />,
    color: "hover:border-red-600"
  },
  {
    name: "Reddit",
    username: "FaranAiki",
    url: "https://www.reddit.com/user/FaranAiki/",
    icon: <Image alt='Reddit icon' width="48" height="48" src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Snoo.svg" />,
    color: "hover:border-red-300"
  },
  {
    name: "SlideShare",
    username: "Faran Aiki",
    url: "https://www.slideshare.net/MuhammadFaranAiki",
    icon: <Image alt='Slideshare icon' width="48" height="48" src="https://upload.wikimedia.org/wikipedia/commons/e/e1/SlideShare_logo.svg" />,
    color: "hover:border-orange-300"
  },
  {
    name: "Scribd",
    username: "Muhammad Faran Aiki",
    url: "https://id.scribd.com/user/530310522/Muhammad-Faran-Aiki",
    icon: <Image alt='Slideshare icon' width="48" height="48" src="https://upload.wikimedia.org/wikipedia/commons/5/52/Scribd_logo_%282%29.svg" />,
    color: "hover:border-green-300"
  },
  {
    name: "Line",
    username: "@faranaiki_",
    url: "https://line.me/ti/p/8ZF2kENUEj",
    icon: <Image alt='Line icon' width="48" height="48" src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg" />,
    color: "hover:border-green-400"
  },
  {
    name: "Telegram",
    username: "@FaranAiki",
    url: "https://t.me/FaranAiki",
    icon: <Image alt='Telegram icon' width="48" height="48" src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" />,
    color: "hover:border-blue-300"
  },
];

export default function SocialPage() {
  return (
    <main className={`${inter.className} relative min-h-screen text-gray-100`}>
      <div className="container mx-auto max-w-5xl pt-24">
        <h1 className="text-4xl font-bold text-center mb-10 hover:scale-105 opacity-80 hover:opacity-90 transition-all">Connect With Me</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
          
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all duration-300 transform hover:-translate-y-2 ${link.color}`}
            >
              <div className="text-sm text-gray-400 mb-4 group-hover:text-white transition-colors">
                {link.username}
              </div>

              <div className="mb-4">
                {link.icon}
              </div>

              <div className="text-lg font-semibold">
                {link.name}
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}


