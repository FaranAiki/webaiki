"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Command } from "cmdk";
import { useTheme } from "next-themes";
import { 
  Search, Moon, Sun, Monitor, Home, Briefcase, Code, Award, 
  GraduationCap, Mail, Newspaper, Globe
} from "lucide-react";

export function CommandPalette({ lang }: { lang: string }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const _pathname = usePathname();
  const { setTheme } = useTheme();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Global Command Menu"
        className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm sm:pt-[20vh]"
      >
        <div className="w-[90vw] max-w-[600px] overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--background)] shadow-2xl cmdk-dialog">
          <div className="flex items-center border-b border-[var(--card-border)] px-3">
            <Search className="mr-2 text-[var(--text-muted)]" size={18} />
            <Command.Input 
              placeholder="Type a command or search..." 
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-[var(--text-muted)] text-[var(--text-main)]"
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto p-2" data-lenis-prevent>
            <Command.Empty className="py-6 text-center text-sm text-[var(--text-muted)]">
              No results found.
            </Command.Empty>
            
            <Command.Group heading="Navigation" className="px-2 py-1.5 text-xs font-medium text-[var(--text-muted)]">
              <Command.Item onSelect={() => runCommand(() => router.push(`/${lang}`))} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--hover-bg)] aria-selected:bg-[var(--hover-bg)]">
                <Home size={16} /> Home
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => router.push(`/${lang}/portfolio`))} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--hover-bg)] aria-selected:bg-[var(--hover-bg)]">
                <Briefcase size={16} /> Portfolio
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => router.push(`/${lang}/project`))} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--hover-bg)] aria-selected:bg-[var(--hover-bg)]">
                <Code size={16} /> Projects
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => router.push(`/${lang}/award`))} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--hover-bg)] aria-selected:bg-[var(--hover-bg)]">
                <Award size={16} /> Awards
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => router.push(`/${lang}/college`))} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--hover-bg)] aria-selected:bg-[var(--hover-bg)]">
                <GraduationCap size={16} /> College Documents
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => router.push(`/${lang}/news`))} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--hover-bg)] aria-selected:bg-[var(--hover-bg)]">
                <Newspaper size={16} /> News & Articles
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => router.push(`/${lang}/hire-me`))} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--hover-bg)] aria-selected:bg-[var(--hover-bg)]">
                <Mail size={16} /> Hire Me
              </Command.Item>
            </Command.Group>

            <Command.Separator className="h-px bg-[var(--card-border)] my-1" />

            <Command.Group heading="Theme" className="px-2 py-1.5 text-xs font-medium text-[var(--text-muted)]">
              <Command.Item onSelect={() => runCommand(() => setTheme("light"))} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--hover-bg)] aria-selected:bg-[var(--hover-bg)]">
                <Sun size={16} /> Light Theme
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => setTheme("dark"))} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--hover-bg)] aria-selected:bg-[var(--hover-bg)]">
                <Moon size={16} /> Dark Theme
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => setTheme("system"))} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--hover-bg)] aria-selected:bg-[var(--hover-bg)]">
                <Monitor size={16} /> System Theme
              </Command.Item>
            </Command.Group>
            
            <Command.Separator className="h-px bg-[var(--card-border)] my-1" />
            
            <Command.Group heading="Language" className="px-2 py-1.5 text-xs font-medium text-[var(--text-muted)]">
               <Command.Item onSelect={() => runCommand(() => router.push(`/en`))} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--hover-bg)] aria-selected:bg-[var(--hover-bg)]">
                <Globe size={16} /> English
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => router.push(`/id`))} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--hover-bg)] aria-selected:bg-[var(--hover-bg)]">
                <Globe size={16} /> Bahasa Indonesia
              </Command.Item>
            </Command.Group>

          </Command.List>
        </div>
      </Command.Dialog>
    </>
  );
}
