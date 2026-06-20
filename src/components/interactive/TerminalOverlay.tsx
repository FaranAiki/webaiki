"use client";

import React, { useState, useEffect, useRef, KeyboardEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { defaultSocialLinks } from '../portfolio/SocialDisplay';

interface JobItem {
  title: string;
  company: string;
  date: string;
  description: string;
  point?: number;
  url?: string;
  tag?: string[];
}

interface TerminalPageRoute {
  slug: string;
  label: string;
}

interface TerminalOverlayProps {
  lang: string;
  dict: Record<string, string>;
  username: string | null;
  workExperiences: JobItem[];
  projectExperiences: JobItem[];
  organizationExperiences: JobItem[];
  awardExperiences: JobItem[];
  pageRoutes: TerminalPageRoute[];
}

interface HistoryItem {
  input?: string;
  output: React.ReactNode;
}

// File System Definition
interface FSEntry {
  type: 'dir' | 'file';
  content?: string;
  children?: string[];
}

export default function TerminalOverlay({ 
  lang, 
  dict, 
  username,
  workExperiences,
  projectExperiences,
  organizationExperiences,
  awardExperiences,
  pageRoutes
}: TerminalOverlayProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [cwd, setCwd] = useState<string>('/');
  const [input, setInput] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const pathname = usePathname();
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [terminalTheme, setTerminalTheme] = useState<'default' | 'hacker' | 'light' | 'dark'>('default');
  const [sessionStartTime] = useState<number>(Date.now());
  const [hasChatbot, setHasChatbot] = useState<boolean>(false);

  useEffect(() => {
    const checkChatbot = () => {
      const btn = document.getElementById('gemini-chatbot-button');
      if (btn) {
        const isHidden = btn.classList.contains('hidden') || 
                        window.getComputedStyle(btn).display === 'none' ||
                        btn.closest('.hidden') !== null;
        setHasChatbot(!isHidden);
      } else {
        setHasChatbot(false);
      }
    };

    checkChatbot();

    const observer = new MutationObserver(checkChatbot);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true, 
      attributes: true, 
      attributeFilter: ['class', 'style'] 
    });

    window.addEventListener('resize', checkChatbot);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkChatbot);
    };
  }, []);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const consoleBottomRef = useRef<HTMLDivElement | null>(null);

  const shellUser = username || 'guest';

  // Dynamic File System populated from layout data
  const fileSystem = React.useMemo(() => {
    const rootSlugs = pageRoutes
      .map(route => route.slug)
      .filter(slug => slug !== ''); // exclude home
    const rootChildren = [...rootSlugs, 'bio.txt', 'resume.txt'];

    const fs: Record<string, FSEntry> = {
      '/': {
        type: 'dir',
        children: rootChildren
      },
      '/bio.txt': {
        type: 'file',
        content: `Muhammad Faran Aiki
--------------------
Role: ${dict.STI || 'Information Systems and Technology'}, ${dict.ITB || 'Bandung Institute of Technology'}
Bio: ${(dict.Faran_About_1 || '').replace(/<[^>]*>/g, '')}
${(dict.Faran_About_2 || '').replace(/<[^>]*>/g, '')}`
      },
      '/resume.txt': {
        type: 'file',
        content: `=========================================
      MUHAMMAD FARAN AIKI - RESUME
=========================================

[ EDUCATION ]
- ${dict.ITB || 'Bandung Institute of Technology'}
  ${dict.STI || 'Information Systems and Technology'}
  ${dict.Paragon_Scholarship_Title || 'Paragon Scholarship Program Excellence 2025 Recipient'}

[ EXPERIENCE ]
${workExperiences.map(w => `- ${w.title} @ ${w.company} (${w.date})\n  ${w.description}`).join('\n\n')}

[ AWARDS ]
${awardExperiences.map(a => `- ${a.title} @ ${a.company} (${a.date})\n  ${a.description}`).join('\n\n')}
`
      }
    };

    // Populate each page slug dynamically
    pageRoutes.forEach(route => {
      if (route.slug === '') return;

      if (route.slug === 'work') {
        const fileNames = workExperiences.map(w => `${w.company.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${w.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.txt`);
        fs['/work'] = {
          type: 'dir',
          children: Array.from(new Set(fileNames))
        };
        workExperiences.forEach(w => {
          const fileName = `${w.company.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${w.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.txt`;
          fs[`/work/${fileName}`] = {
            type: 'file',
            content: `${w.title} (${w.date})
Company/Institution: ${w.company}
---------------------------------------------
Description: ${w.description}
Tags: ${w.tag?.join(', ') || ''}`
          };
        });
      } else if (route.slug === 'project') {
        const fileNames = projectExperiences.map(p => `${p.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.txt`);
        fs['/project'] = {
          type: 'dir',
          children: Array.from(new Set(fileNames))
        };
        projectExperiences.forEach(p => {
          const fileName = `${p.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.txt`;
          fs[`/project/${fileName}`] = {
            type: 'file',
            content: `${p.title} (${p.date})
Stack/Technologies: ${p.company}
--------------------------------------
Description: ${p.description}
Link: ${p.url || 'N/A'}
Tags: ${p.tag?.join(', ') || ''}`
          };
        });
      } else if (route.slug === 'organization') {
        const fileNames = organizationExperiences.map(o => `${o.company.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${o.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.txt`);
        fs['/organization'] = {
          type: 'dir',
          children: Array.from(new Set(fileNames))
        };
        organizationExperiences.forEach(o => {
          const fileName = `${o.company.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${o.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.txt`;
          fs[`/organization/${fileName}`] = {
            type: 'file',
            content: `${o.title} (${o.date})
Organization: ${o.company}
---------------------------------------
Description: ${o.description}
Tags: ${o.tag?.join(', ') || ''}`
          };
        });
      } else if (route.slug === 'award') {
        const fileNames = awardExperiences.map(a => `${a.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.txt`);
        fs['/award'] = {
          type: 'dir',
          children: Array.from(new Set(fileNames))
        };
        awardExperiences.forEach(a => {
          const fileName = `${a.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.txt`;
          fs[`/award/${fileName}`] = {
            type: 'file',
            content: `${a.title} (${a.date})
Issuer/Organizer: ${a.company}
------------------------------
Description: ${a.description}
Tags: ${a.tag?.join(', ') || ''}`
          };
        });
      } else {
        // All other dynamically derived page routes get a descriptive info file
        fs[`/${route.slug}`] = {
          type: 'dir',
          children: ['info.txt']
        };
        fs[`/${route.slug}/info.txt`] = {
          type: 'file',
          content: `${route.label} Page
---------------------------------------------
This folder represents the ${route.label} page of the portfolio website.
To navigate to this page in your browser, type:
  goto ${route.slug} or open ${route.slug}`
        };
      }
    });

    return fs;
  }, [dict, workExperiences, projectExperiences, organizationExperiences, awardExperiences, pageRoutes]);

  // Focus input helper
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Toggle modal open/close
  const toggleTerminal = () => {
    setIsOpen(prev => !prev);
  };

  // Keyboard shortcut listener to toggle terminal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent | globalThis.KeyboardEvent) => {
      // Toggle on backtick key (`) or Ctrl + \
      if (e.key === '`' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        toggleTerminal();
      } else if (e.ctrlKey && e.key === '\\') {
        e.preventDefault();
        toggleTerminal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialize welcome logs
  useEffect(() => {
    if (history.length === 0) {
      setHistory([
        {
          output: (
            <div className="space-y-1">
              <p className="text-theme-500 font-bold">Muhammad Faran Aiki - Terminal Shell [v3.0.0]</p>
              <p className="text-theme-muted text-xs">
                {lang === 'id' 
                  ? "Ketik 'help' untuk melihat daftar perintah. Tekan '`' (backtick) atau 'Ctrl + \\' untuk menutup." 
                  : "Type 'help' to see commands. Press '`' (backtick) or 'Ctrl + \\' to close."}
              </p>
              <p className="text-theme-muted text-xs">
                {lang === 'id'
                  ? "Tip: Gunakan 'goto <halaman>' untuk navigasi cepat. Ketik 'pages' untuk melihat daftar halaman."
                  : "Tip: Use 'goto <page>' for quick navigation. Type 'pages' to see all available pages."}
              </p>
            </div>
          )
        }
      ]);
    }
  }, [history.length, lang]);

  // Scroll to bottom on updates
  useEffect(() => {
    if (isOpen) {
      setTimeout(focusInput, 50);
      if (consoleBottomRef.current) {
        consoleBottomRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [isOpen, history]);

  // Command Execution Handler (Strict parsing - secure, no eval)
  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    // Save to typed commands history
    const updatedHistory = [...commandHistory, trimmed];
    setCommandHistory(updatedHistory);
    setHistoryIdx(-1);

    const tokens = trimmed.split(/\s+/);
    const command = tokens[0].toLowerCase();
    const args = tokens.slice(1);

    let outputNode: React.ReactNode = null;
    let newCwd = cwd;

    switch (command) {
      case 'help': {
        outputNode = (
          <div className="space-y-3 text-xs">
            <p className="text-theme-500 font-bold">[ Navigation ]</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
              <div><span className="text-theme-500 font-bold">goto &lt;page&gt;</span> - {lang === 'id' ? 'Pergi ke halaman situs' : 'Navigate to a site page'}</div>
              <div><span className="text-theme-500 font-bold">pages</span> - {lang === 'id' ? 'Tampilkan daftar halaman' : 'List all navigable pages'}</div>
              <div><span className="text-theme-500 font-bold">open &lt;page&gt;</span> - {lang === 'id' ? 'Alias untuk goto' : 'Alias for goto'}</div>
              <div><span className="text-theme-500 font-bold">pwd</span> - {lang === 'id' ? 'Tampilkan URL halaman saat ini' : 'Show current page URL'}</div>
              <div><span className="text-theme-500 font-bold">lang &lt;code&gt;</span> - {lang === 'id' ? 'Ganti bahasa (en/id/zh/jp...)' : 'Switch language (en/id/zh/jp...)'}</div>
            </div>
            <p className="text-theme-500 font-bold">[ Filesystem ]</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
              <div><span className="text-theme-500 font-bold">ls [folder]</span> - {lang === 'id' ? 'List file atau folder' : 'List files or folders'}</div>
              <div><span className="text-theme-500 font-bold">cd [folder]</span> - {lang === 'id' ? 'Pindah folder' : 'Change directory'}</div>
              <div><span className="text-theme-500 font-bold">cat [file]</span> - {lang === 'id' ? 'Tampilkan isi file' : 'Display file content'}</div>
            </div>
            <p className="text-theme-500 font-bold">[ Info & Profile ]</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
              <div><span className="text-theme-500 font-bold">whoami</span> - {lang === 'id' ? 'Tampilkan status login user' : 'Display user login details'}</div>
              <div><span className="text-theme-500 font-bold">neofetch</span> - {lang === 'id' ? 'Tampilkan informasi sistem web' : 'Display web system info'}</div>
              <div><span className="text-theme-500 font-bold">projects</span> - {lang === 'id' ? 'Daftar projek penting' : 'List highlight projects'}</div>
              <div><span className="text-theme-500 font-bold">social</span> - {lang === 'id' ? 'Tampilkan tautan sosial' : 'Display social links'}</div>
              <div><span className="text-theme-500 font-bold">uptime</span> - {lang === 'id' ? 'Durasi sesi saat ini' : 'Current session duration'}</div>
              <div><span className="text-theme-500 font-bold">history</span> - {lang === 'id' ? 'Tampilkan riwayat perintah' : 'Show command history'}</div>
            </div>
            <p className="text-theme-500 font-bold">[ Shell ]</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
              <div><span className="text-theme-500 font-bold">login</span> - {lang === 'id' ? 'Mengarahkan ke halaman login' : 'Redirect to login page'}</div>
              <div><span className="text-theme-500 font-bold">theme [hacker|light|dark|default]</span> - {lang === 'id' ? 'Ubah tema konsol' : 'Change console theme'}</div>
              <div><span className="text-theme-500 font-bold">echo &lt;text&gt;</span> - {lang === 'id' ? 'Tampilkan teks' : 'Print text'}</div>
              <div><span className="text-theme-500 font-bold">clear</span> - {lang === 'id' ? 'Bersihkan layar' : 'Clear terminal screen'}</div>
              <div><span className="text-theme-500 font-bold">exit</span> - {lang === 'id' ? 'Keluar dari shell' : 'Exit the terminal overlay'}</div>
            </div>
          </div>
        );
        break;
      }

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'exit':
        setIsOpen(false);
        setInput('');
        return;

      case 'whoami':
        if (username) {
          outputNode = (
            <div className="space-y-1 text-xs">
              <p><span className="text-theme-500 font-bold">{lang === 'id' ? 'Pengguna' : 'User'}:</span> {username}</p>
              <p><span className="text-theme-500 font-bold">Status:</span> Authenticated</p>
              <p><span className="text-theme-500 font-bold">Role:</span> Portfolio Explorer</p>
            </div>
          );
        } else {
          outputNode = (
            <div className="space-y-1 text-xs">
              <p><span className="text-theme-500 font-bold">{lang === 'id' ? 'Pengguna' : 'User'}:</span> guest</p>
              <p><span className="text-theme-500 font-bold">Status:</span> Anonymous</p>
              <p className="text-theme-muted mt-1 leading-relaxed">
                {lang === 'id' 
                  ? "Anda sedang menjelajah sebagai tamu. Silakan ketik 'login' atau masuk melalui menu navigasi untuk autentikasi."
                  : "You are currently exploring as a guest. Please type 'login' or sign in via the menu navigation to authenticate."}
              </p>
            </div>
          );
        }
        break;

      case 'login':
        outputNode = (
          <p className="text-xs text-theme-500 animate-pulse">
            {lang === 'id' ? "Mengarahkan Anda ke halaman login..." : "Redirecting you to the login page..."}
          </p>
        );
        setTimeout(() => {
          window.location.href = `/${lang}/login`;
        }, 600);
        break;

      case 'sudo':
        outputNode = (
          <p className="text-xs text-red-500 font-mono">
            {lang === 'id'
              ? `${shellUser} tidak terdaftar di berkas sudoers. Insiden ini akan dilaporkan.`
              : `${shellUser} is not in the sudoers file. This incident will be reported.`}
          </p>
        );
        break;

      case 'neofetch':
        // Calculate session uptime
        const uptimeSec = Math.floor((Date.now() - sessionStartTime) / 1000);
        const uptimeStr = uptimeSec < 60 
          ? `${uptimeSec}s` 
          : `${Math.floor(uptimeSec / 60)}m ${uptimeSec % 60}s`;

        outputNode = (
          <div className="flex flex-col md:flex-row gap-6 text-xs font-mono select-none leading-relaxed">
            <div className="text-theme-500 font-bold text-center md:text-left shrink-0">
{`    /\\ 
   /  \\ 
  /\\  /\\ 
 /  \\/  \\ 
/________\\ 
\\ \\    / / 
 \\ \\  / / 
  \\_\\/_/`}
            </div>
            <div className="space-y-0.5">
              <p className="text-theme-500 font-black">{shellUser}@faranaiki.id</p>
              <p className="text-theme-muted">----------------------</p>
              <p><span className="text-theme-500 font-bold">OS:</span> webaiki-OS v1.2</p>
              <p><span className="text-theme-500 font-bold">Host:</span> https://faranaiki.id</p>
              <p><span className="text-theme-500 font-bold">Kernel:</span> Next.js 15 / React 19</p>
              <p><span className="text-theme-500 font-bold">Uptime:</span> {uptimeStr}</p>
              <p><span className="text-theme-500 font-bold">Shell:</span> webaiki-sh v3.0</p>
              <p><span className="text-theme-500 font-bold">Theme:</span> {terminalTheme}</p>
              <p><span className="text-theme-500 font-bold">Platform:</span> Web Browser Canvas</p>
            </div>
          </div>
        );
        break;



      case 'work':
        outputNode = (
          <div className="space-y-2 text-xs">
            {workExperiences.map((w, index) => (
              <div key={index}>
                <p className="text-theme-500 font-bold">{w.title} @ {w.company} ({w.date})</p>
                <p className="text-theme-muted">{w.description}</p>
              </div>
            ))}
          </div>
        );
        break;

      case 'project':
      case 'projects':
        outputNode = (
          <div className="space-y-2 text-xs">
            {projectExperiences.map((p, index) => (
              <div key={index}>
                <p className="text-theme-500 font-bold">{p.title} ({p.date})</p>
                <p className="text-theme-muted">{p.description}</p>
              </div>
            ))}
          </div>
        );
        break;

      case 'organization':
      case 'organizations':
        outputNode = (
          <div className="space-y-2 text-xs">
            {organizationExperiences.map((o, index) => (
              <div key={index}>
                <p className="text-theme-500 font-bold">{o.title} @ {o.company} ({o.date})</p>
                <p className="text-theme-muted">{o.description}</p>
              </div>
            ))}
          </div>
        );
        break;

      case 'award':
      case 'awards':
        outputNode = (
          <div className="space-y-2 text-xs">
            {awardExperiences.map((a, index) => (
              <div key={index}>
                <p className="text-theme-500 font-bold">{a.title} @ {a.company} ({a.date})</p>
                <p className="text-theme-muted">{a.description}</p>
              </div>
            ))}
          </div>
        );
        break;

      case 'social':
        outputNode = (
          <div className="flex flex-col gap-1.5 text-xs">
            {defaultSocialLinks.map((link, idx) => {
              const displayUrl = link.url.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/^mailto:/, '');
              return (
                <p key={idx}>
                  <span className="text-theme-500 font-bold">{link.name} ({link.username}):</span>{' '}
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-theme-400">
                    {displayUrl}
                  </a>
                </p>
              );
            })}
          </div>
        );
        break;

      case 'theme':
        const targetTheme = args[0]?.toLowerCase();
        if (['hacker', 'light', 'dark', 'default'].includes(targetTheme)) {
          setTerminalTheme(targetTheme as 'hacker' | 'light' | 'dark' | 'default');
          outputNode = <p className="text-xs">{lang === 'id' ? `Tema berhasil diubah menjadi: ${targetTheme}` : `Theme changed to: ${targetTheme}`}</p>;
        } else {
          outputNode = <p className="text-xs text-red-500">{lang === 'id' ? "Sintaks salah. Gunakan: theme [hacker|light|dark|default]" : "Invalid syntax. Use: theme [hacker|light|dark|default]"}</p>;
        }
        break;

      case 'ls':
        const targetPath = args[0] || '.';
        let resolvedLsPath = cwd;

        if (targetPath === '..') {
          resolvedLsPath = cwd === '/' ? '/' : cwd.split('/').slice(0, -1).join('/') || '/';
        } else if (targetPath.startsWith('/')) {
          resolvedLsPath = targetPath;
        } else if (targetPath !== '.') {
          resolvedLsPath = cwd === '/' ? `/${targetPath}` : `${cwd}/${targetPath}`;
        }

        const lsEntry = fileSystem[resolvedLsPath];
        if (!lsEntry) {
          outputNode = <p className="text-xs text-red-500">{lang === 'id' ? `ls: folder tidak ditemukan: ${targetPath}` : `ls: no such folder: ${targetPath}`}</p>;
        } else if (lsEntry.type === 'file') {
          outputNode = <p className="text-xs text-foreground font-mono">{targetPath.split('/').pop()}</p>;
        } else {
          outputNode = (
            <div className="flex flex-wrap gap-4 text-xs font-mono">
              {lsEntry.children?.map(child => {
                const childFullPath = resolvedLsPath === '/' ? `/${child}` : `${resolvedLsPath}/${child}`;
                const childEntry = fileSystem[childFullPath];
                const isDir = childEntry?.type === 'dir';
                
                return (
                  <span key={child} className={isDir ? "text-blue-500 font-bold" : "text-foreground"}>
                    {child}{isDir ? '/' : ''}
                  </span>
                );
              })}
            </div>
          );
        }
        break;

      case 'cd':
        const dirArg = args[0] || '/';
        let resolvedCdPath = cwd;

        if (dirArg === '/') {
          resolvedCdPath = '/';
        } else if (dirArg === '..') {
          resolvedCdPath = cwd === '/' ? '/' : cwd.split('/').slice(0, -1).join('/') || '/';
        } else if (dirArg.startsWith('/')) {
          resolvedCdPath = dirArg;
        } else {
          resolvedCdPath = cwd === '/' ? `/${dirArg}` : `${cwd}/${dirArg}`;
        }

        const cdEntry = fileSystem[resolvedCdPath];
        if (!cdEntry) {
          outputNode = <p className="text-xs text-red-500">{lang === 'id' ? `cd: folder tidak ditemukan: ${dirArg}` : `cd: no such file or directory: ${dirArg}`}</p>;
        } else if (cdEntry.type === 'file') {
          outputNode = <p className="text-xs text-red-500">{lang === 'id' ? `cd: bukan folder: ${dirArg}` : `cd: not a directory: ${dirArg}`}</p>;
        } else {
          newCwd = resolvedCdPath;
        }
        break;

      case 'cat':
        const fileArg = args[0];
        if (!fileArg) {
          outputNode = <p className="text-xs text-red-500">{lang === 'id' ? "cat: nama file diperlukan" : "cat: filename required"}</p>;
          break;
        }

        let resolvedCatPath = cwd;
        if (fileArg.startsWith('/')) {
          resolvedCatPath = fileArg;
        } else {
          resolvedCatPath = cwd === '/' ? `/${fileArg}` : `${cwd}/${fileArg}`;
        }

        const catEntry = fileSystem[resolvedCatPath];
        if (!catEntry) {
          outputNode = <p className="text-xs text-red-500">{lang === 'id' ? `cat: file tidak ditemukan: ${fileArg}` : `cat: no such file: ${fileArg}`}</p>;
        } else if (catEntry.type === 'dir') {
          outputNode = <p className="text-xs text-red-500">{lang === 'id' ? `cat: adalah folder: ${fileArg}/` : `cat: is a directory: ${fileArg}/`}</p>;
        } else {
          outputNode = <p className="text-xs whitespace-pre-wrap leading-relaxed font-mono text-foreground">{catEntry.content}</p>;
        }
        break;

      case 'pwd': {
        const currentUrl = typeof window !== 'undefined' ? window.location.pathname : `/${lang}`;
        outputNode = <p className="text-xs font-mono text-foreground">{currentUrl}</p>;
        break;
      }

      case 'pages': {
        outputNode = (
          <div className="space-y-1 text-xs">
            <p className="text-theme-500 font-bold mb-2">{lang === 'id' ? 'Halaman tersedia (gunakan: goto <slug>)' : 'Available pages (use: goto <slug>)'}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0.5 font-mono">
              {pageRoutes.map(p => (
                <div key={p.slug}>
                  <span className="text-theme-500">{p.slug || '(home)'}</span>
                  <span className="text-theme-muted"> → /{lang}{p.slug ? `/${p.slug}` : ''}</span>
                </div>
              ))}
            </div>
          </div>
        );
        break;
      }

      case 'goto':
      case 'open':
      case 'navigate': {
        const pageSlug = args[0]?.toLowerCase();
        const validSlugs = pageRoutes.map(p => p.slug);

        if (pageSlug === undefined) {
          outputNode = <p className="text-xs text-red-500">{lang === 'id' ? `Sintaks: goto <halaman>. Ketik 'pages' untuk daftar halaman.` : `Usage: goto <page>. Type 'pages' to list all pages.`}</p>;
        } else if (!validSlugs.includes(pageSlug)) {
          outputNode = <p className="text-xs text-red-500">{lang === 'id' ? `Halaman tidak ditemukan: '${pageSlug}'. Ketik 'pages' untuk daftar halaman.` : `Page not found: '${pageSlug}'. Type 'pages' to list all pages.`}</p>;
        } else {
          const targetHref = pageSlug ? `/${lang}/${pageSlug}` : `/${lang}`;
          outputNode = (
            <p className="text-xs text-theme-500 animate-pulse">
              {lang === 'id' ? `Navigasi ke ${targetHref}...` : `Navigating to ${targetHref}...`}
            </p>
          );
          setTimeout(() => {
            window.location.href = targetHref;
          }, 600);
        }
        break;
      }

      case 'lang': {
        const langArg = args[0]?.toLowerCase();
        const supportedLangs = ['en', 'id', 'zh', 'jp', 'ru', 'fr', 'ar', 'es', 'ko', 'de', 'nl', 'ha', 'he', 'el', 'hi', 'pt', 'bn', 'vi'];
        if (!langArg) {
          outputNode = (
            <div className="text-xs space-y-1">
              <p>{lang === 'id' ? `Bahasa saat ini: ${lang}` : `Current language: ${lang}`}</p>
              <p className="text-theme-muted">{lang === 'id' ? `Tersedia: ${supportedLangs.join(', ')}` : `Available: ${supportedLangs.join(', ')}`}</p>
              <p className="text-theme-muted">{lang === 'id' ? `Gunakan: lang <kode>` : `Usage: lang <code>`}</p>
            </div>
          );
        } else if (!supportedLangs.includes(langArg)) {
          outputNode = <p className="text-xs text-red-500">{lang === 'id' ? `Bahasa tidak didukung: ${langArg}` : `Unsupported language: ${langArg}`}</p>;
        } else {
          const currentPath = typeof window !== 'undefined' ? window.location.pathname : `/${lang}`;
          const newPath = currentPath.replace(/^\/[a-z]{2}/, `/${langArg}`);
          outputNode = (
            <p className="text-xs text-theme-500 animate-pulse">
              {lang === 'id' ? `Beralih ke bahasa ${langArg}...` : `Switching to language ${langArg}...`}
            </p>
          );
          setTimeout(() => {
            window.location.href = newPath;
          }, 600);
        }
        break;
      }

      case 'uptime': {
        const uptimeSec2 = Math.floor((Date.now() - sessionStartTime) / 1000);
        const uptimeMins = Math.floor(uptimeSec2 / 60);
        const uptimeSecs = uptimeSec2 % 60;
        const uptimeStr2 = uptimeSec2 < 60 ? `${uptimeSec2}s` : `${uptimeMins}m ${uptimeSecs}s`;
        outputNode = (
          <p className="text-xs">
            <span className="text-theme-500 font-bold">{lang === 'id' ? 'Durasi sesi' : 'Session uptime'}:</span> {uptimeStr2}
          </p>
        );
        break;
      }

      case 'history': {
        if (commandHistory.length === 0) {
          outputNode = <p className="text-xs text-theme-muted">{lang === 'id' ? 'Belum ada riwayat perintah.' : 'No command history yet.'}</p>;
        } else {
          outputNode = (
            <div className="text-xs font-mono space-y-0.5">
              {commandHistory.map((cmd, i) => (
                <div key={i}>
                  <span className="text-theme-muted select-none">{String(i + 1).padStart(3, ' ')}  </span>
                  <span className="text-foreground">{cmd}</span>
                </div>
              ))}
            </div>
          );
        }
        break;
      }

      case 'echo': {
        const echoText = args.join(' ');
        outputNode = <p className="text-xs font-mono text-foreground">{echoText || ''}</p>;
        break;
      }

      default:
        outputNode = (
          <p className="text-xs text-red-500">
            {lang === 'id' 
              ? `bash: perintah tidak ditemukan: ${command}. Ketik 'help' untuk daftar perintah.`
              : `bash: command not found: ${command}. Type 'help' to see available commands.`}
          </p>
        );
    }

    setHistory(prev => [...prev, { input: cmdStr, output: outputNode }]);
    setCwd(newCwd);
    setInput('');
  };

  // Keyboard events listener inside Input
  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx = historyIdx === -1 ? commandHistory.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setInput(commandHistory[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandHistory.length === 0 || historyIdx === -1) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= commandHistory.length) {
        setHistoryIdx(-1);
        setInput('');
      } else {
        setHistoryIdx(nextIdx);
        setInput(commandHistory[nextIdx]);
      }
    } else if (e.key === 'Tab') {
      // Tab Autocomplete
      e.preventDefault();
      const tokens = input.trim().split(/\s+/);
      const cmd = tokens[0]?.toLowerCase();

      // All available top-level commands for autocomplete
      const allCommands = [
        'help', 'ls', 'cd', 'cat', 'whoami', 'login', 'sudo', 'neofetch',
        'projects', 'project', 'work', 'organization', 'organizations',
        'award', 'awards', 'social', 'theme', 'clear', 'exit', 'goto', 'open',
        'navigate', 'pages', 'pwd', 'lang', 'uptime', 'history', 'echo'
      ];
      const allPageSlugs = pageRoutes.map(p => p.slug);
      const supportedLangCodes = ['en', 'id', 'zh', 'jp', 'ru', 'fr', 'ar', 'es', 'ko', 'de', 'nl', 'ha', 'he', 'el', 'hi', 'pt', 'bn', 'vi'];

      if (tokens.length === 1) {
        // Autocomplete command name
        const partial = cmd || '';
        const matches = allCommands.filter(c => c.startsWith(partial));
        if (matches.length === 1) {
          setInput(matches[0]);
        } else if (matches.length > 1) {
          const listOutput = (
            <div className="flex flex-wrap gap-4 text-xxs font-mono text-theme-muted">
              {matches.map(m => <span key={m}>{m}</span>)}
            </div>
          );
          setHistory(prev => [...prev, { input: input, output: listOutput }]);
        }
      } else if (['ls', 'cd', 'cat'].includes(cmd) && tokens.length <= 2) {
        // Auto-completes ls, cd, or cat arguments
        const partialName = tokens[1] || '';
        const parentEntry = fileSystem[cwd];
        if (parentEntry && parentEntry.children) {
          const matches = parentEntry.children.filter(child => child.toLowerCase().startsWith(partialName.toLowerCase()));
          
          if (matches.length === 1) {
            setInput(`${cmd} ${matches[0]}`);
          } else if (matches.length > 1) {
            const listOutput = (
              <div className="flex gap-4 text-xxs font-mono text-theme-muted">
                {matches.map(m => <span key={m}>{m}</span>)}
              </div>
            );
            setHistory(prev => [...prev, { input: input, output: listOutput }]);
          }
        }
      } else if (['goto', 'open', 'navigate'].includes(cmd) && tokens.length <= 2) {
        // Autocomplete page slug for navigation commands
        const partial = tokens[1] || '';
        const matches = allPageSlugs.filter(s => s.startsWith(partial) && s !== '');
        if (matches.length === 1) {
          setInput(`${cmd} ${matches[0]}`);
        } else if (matches.length > 1) {
          const listOutput = (
            <div className="flex flex-wrap gap-4 text-xxs font-mono text-theme-muted">
              {matches.map(m => <span key={m}>{m}</span>)}
            </div>
          );
          setHistory(prev => [...prev, { input: input, output: listOutput }]);
        }
      } else if (cmd === 'lang' && tokens.length <= 2) {
        // Autocomplete language code
        const partial = tokens[1] || '';
        const matches = supportedLangCodes.filter(l => l.startsWith(partial));
        if (matches.length === 1) {
          setInput(`lang ${matches[0]}`);
        } else if (matches.length > 1) {
          const listOutput = (
            <div className="flex flex-wrap gap-4 text-xxs font-mono text-theme-muted">
              {matches.map(m => <span key={m}>{m}</span>)}
            </div>
          );
          setHistory(prev => [...prev, { input: input, output: listOutput }]);
        }
      } else if (cmd === 'theme' && tokens.length <= 2) {
        const partial = tokens[1] || '';
        const themeOpts = ['hacker', 'light', 'dark', 'default'];
        const matches = themeOpts.filter(t => t.startsWith(partial));
        if (matches.length === 1) {
          setInput(`theme ${matches[0]}`);
        } else if (matches.length > 1) {
          const listOutput = (
            <div className="flex gap-4 text-xxs font-mono text-theme-muted">
              {matches.map(m => <span key={m}>{m}</span>)}
            </div>
          );
          setHistory(prev => [...prev, { input: input, output: listOutput }]);
        }
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Dynamic style matching theme input
  const getThemeClasses = () => {
    if (terminalTheme === 'hacker') return 'bg-[#050505] text-[#39ff14] border-[#00ff00]/20 font-mono shadow-green-500/5 [&_*]:!text-[#39ff14] [&_a]:underline';
    if (terminalTheme === 'light') return 'bg-white/80 dark:bg-white/95 text-[#111] border-black/10 shadow-lg backdrop-blur-md [&_span]:!text-[#111] [&_p]:!text-[#111] [&_input]:!text-[#111] [&_.text-theme-500]:!text-blue-600 [&_.text-theme-muted]:!text-gray-500';
    if (terminalTheme === 'dark') return 'bg-[#121212] text-[#f3f4f6] border-neutral-800 shadow-2xl [&_span]:!text-gray-100 [&_p]:!text-gray-100 [&_input]:!text-gray-100 [&_.text-theme-500]:!text-indigo-400';
    
    // Default theme (inherits theme vars - glassmorphic matching dark/white modes)
    return 'bg-theme-surface-strong/95 dark:bg-theme-surface/95 border-theme-border shadow-xl backdrop-blur-md';
  };

  const isHiddenPage = ['/login', '/register', '/hire-me'].some(p => pathname?.includes(p));
  if (isHiddenPage) return null;

  return (
    <>
      {/* Floating terminal trigger button */}
      <button
        onClick={toggleTerminal}
        className={`fixed ${hasChatbot ? 'bottom-24' : 'bottom-6'} left-6 p-4 rounded-full bg-theme-surface-strong border border-theme-border text-theme-500 hover:border-theme-500 hover:text-theme-400 hover:scale-105 active:scale-95 shadow-xl transition-all duration-300 z-50 flex items-center justify-center cursor-pointer group no-print`}
        title={lang === 'id' ? "Buka Terminal Portofolio (`)" : "Open Portfolio Terminal (`)"}
        aria-label="Toggle terminal mode"
      >
        <TerminalIcon size={20} className="group-hover:rotate-6 transition-transform" />
      </button>

      {/* Terminal Overlay Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
              className={`w-full max-w-3xl flex flex-col rounded-3xl border overflow-hidden transition-all duration-300 ${
                isMaximized ? 'h-[95vh] max-w-[95vw]' : 'h-[65vh] max-w-3xl'
              } ${getThemeClasses()}`}
              onClick={focusInput}
            >
              {/* Window Header */}
              <div className="flex items-center justify-between p-3.5 border-b border-theme-border/50 shrink-0 select-none bg-black/5 dark:bg-white/5">
                {/* Empty div for spacing where the buttons used to be */}
                <div className="w-6" />
                
                <span className="text-xs font-bold font-mono flex items-center gap-1.5 opacity-80 text-foreground">
                  <TerminalIcon size={13} />
                  <span>{dict.Terminal_Title || "Terminal Shell"}</span>
                </span>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMaximized(prev => !prev);
                    }}
                    className="p-1 rounded-md text-theme-muted hover:text-theme-500 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Toggle full screen"
                  >
                    {isMaximized ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTerminal();
                    }}
                    className="p-1 rounded-md text-theme-muted hover:text-red-500 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Close terminal"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>

              {/* Console logs output viewport */}
              <div 
                data-lenis-prevent
                className="flex-1 p-5 overflow-y-auto scroll-smooth font-mono text-xs flex flex-col gap-3 scrollbar-thin scrollbar-thumb-theme-border/50"
              >
                {history.map((item, idx) => (
                  <div key={idx} className="space-y-1.5 font-mono">
                    {item.input && (
                      <p className="text-xs font-black tracking-tight select-none opacity-80 font-mono text-theme-500">
                        <span>{shellUser}@faranaiki.id:</span>
                        <span className="text-theme-muted">~{cwd === '/' ? '' : cwd}</span>
                        <span>$ {item.input}</span>
                      </p>
                    )}
                    <div className="pl-3 border-l border-theme-border/40 font-mono">
                      {item.output}
                    </div>
                  </div>
                ))}

                {/* Input line prompt */}
                <div className="space-y-1 font-mono">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-black tracking-tight select-none opacity-80 font-mono text-theme-500 shrink-0">
                      {shellUser}@faranaiki.id:
                      <span className="text-theme-muted">~{cwd === '/' ? '' : cwd}</span>
                      $
                    </span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={handleInputKeyDown}
                      className="bg-transparent border-none outline-none text-foreground font-mono text-xs flex-grow p-0 m-0 focus:ring-0 select-text"
                      autoComplete="off"
                      autoFocus
                      aria-label="Terminal command prompt"
                    />
                  </div>
                </div>

                <div ref={consoleBottomRef} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
