"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { 
  Search, Briefcase, Code, Award, 
  Layout, Users, FileCheck, HelpCircle, Info, Loader2, X
} from "lucide-react";
import { getFullSearchPool, getSuggestions, SearchResult } from '@/app/search-actions';
import Image from 'next/image';
import { useAppStore } from '@/lib/store';
import { m as motion } from 'framer-motion';

interface CommandPaletteLabels {
  placeholder: string;
  navigation: string;
  home: string;
  portfolio: string;
  projects: string;
  awards: string;
  college: string;
  news: string;
  hireMe: string;
  theme: string;
  lightTheme: string;
  darkTheme: string;
  systemTheme: string;
  language: string;
  searchResults: string;
  noResults: string;
  searching: string;
  suggestions: string;
}

export function CommandPalette({ lang, labels, isOpen, onOpenChange }: { lang: string; labels: CommandPaletteLabels, isOpen: boolean, onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [redirecting, setRedirecting] = React.useState<string | null>(null);
  const [pool, setPool] = React.useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = React.useState<SearchResult[]>([]);
  const router = useRouter();
  const setGlobalLoading = useAppStore((state) => state.setGlobalLoading);

  React.useEffect(() => {
    if (isOpen && pool.length === 0) {
      getFullSearchPool(lang).then(setPool);
      getSuggestions(lang, 5).then((suggs) => {
        setSuggestions(suggs);
        if (query.trim().length < 2) {
          setResults(suggs);
        }
      });
    }
  }, [isOpen, lang, pool.length, query]);



  React.useEffect(() => {
    if (query.trim().length >= 2) {
      setLoading(true);
      
      const searchTimeout = setTimeout(() => {
        const lowercaseQuery = query.toLowerCase().trim();
        const queryTerms = lowercaseQuery.split(/\s+/).filter(term => term.length > 1);
        
        const calculateScore = (item: Partial<SearchResult>, terms: string[]) => {
          let score = 0;
          const fieldsToSearch = [
            { text: item.title || "", weight: 10 },
            { text: item.description || "", weight: 3 },
            { text: item.company || "", weight: 5 },
            { text: item.date || "", weight: 2 },
            { text: (item.tags || []).join(" "), weight: 4 },
            { text: (item.keywords || []).join(" "), weight: 8 }
          ];

          terms.forEach(term => {
            fieldsToSearch.forEach(field => {
              const lowerText = (Array.isArray(field.text) ? field.text.join(' ') : field.text).toLowerCase();
              if (lowerText.includes(term)) {
                score += field.weight;
                if (lowerText.startsWith(term)) score += field.weight * 0.5;
                if (lowerText === term) score += field.weight * 2;
              }
            });
          });
          return score;
        };

        const matched: SearchResult[] = [];
        pool.forEach(item => {
          const baseScoreMultiplier = item.score || 1.0;
          const matchScore = calculateScore(item, queryTerms);
          if (matchScore > 0) {
            matched.push({
              ...item,
              score: matchScore * baseScoreMultiplier
            });
          }
        });
        
        setResults(matched.sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 20));
        setLoading(false);
      }, 50); // slight delay to show loading state as requested

      return () => clearTimeout(searchTimeout);
    } else {
      setResults(suggestions);
      setLoading(false);
      return undefined;
    }
  }, [query, pool, suggestions]);



  const navigateToResult = React.useCallback((result: SearchResult) => {
    const url = result.url;
    setRedirecting(url);
    setGlobalLoading(true);
    onOpenChange(false);
    if (url.startsWith('http')) {
      window.open(url, '_blank');
      setGlobalLoading(false);
      setRedirecting(null);
    } else {
      router.push(url);
      setTimeout(() => setRedirecting(null), 1000);
    }
  }, [router, setGlobalLoading, onOpenChange]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'page': return <Layout size={16} />;
      case 'work': return <Briefcase size={16} />;
      case 'project': return <Code size={16} />;
      case 'organization': return <Users size={16} />;
      case 'award': return <Award size={16} />;
      case 'certificate': return <FileCheck size={16} />;
      case 'faq': return <HelpCircle size={16} />;
      case 'other': return <Info size={16} />;
      default: return <Search size={16} />;
    }
  };

  return (
    <>
      <Command.Dialog
        open={isOpen}
        onOpenChange={onOpenChange}
        shouldFilter={false}
        label={labels.placeholder}
        className={`fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/40 backdrop-blur-sm sm:pt-[20vh] transition-opacity duration-300 ${redirecting || loading ? 'cursor-wait' : ''}`}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            duration: 0.2, 
            ease: "easeOut",
            scale: { type: "spring", damping: 20, stiffness: 300, mass: 0.8 } 
          }}
          className="w-[90vw] max-w-[600px] overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--background)] shadow-2xl cmdk-dialog"
        >
          <div className="flex items-center border-b border-[var(--card-border)] px-3">
            <Search className="mr-2 text-[var(--text-muted)]" size={18} />
            <Command.Input 
              value={query}
              onValueChange={setQuery}
              placeholder={labels.placeholder} 
              className={`flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-[var(--text-muted)] text-[var(--text-main)] ${loading || redirecting ? 'cursor-wait' : ''}`}
            />
            {loading && <Loader2 className="animate-spin text-theme-500 mr-2" size={18} />}
            <button 
              onClick={() => onOpenChange(false)} 
              className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--hover-bg)] transition-colors"
              aria-label="Close command palette"
            >
              <X size={18} />
            </button>
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto p-2" data-lenis-prevent>
            <Command.Empty className="py-6 text-center text-sm text-[var(--text-muted)]">
              {loading ? labels.searching : (query ? labels.noResults : labels.placeholder)}
            </Command.Empty>
            
            {results.length > 0 && (
              <Command.Group heading={query.trim().length < 2 ? labels.suggestions : labels.searchResults} className="px-2 py-1.5 text-xs font-medium text-[var(--text-muted)]">
                {results.map((result, idx) => (
                  <Command.Item 
                    key={`search-${idx}`} 
                    value={result.title + result.description}
                    onSelect={() => navigateToResult(result)} 
                    className={`flex ${redirecting ? 'cursor-wait' : 'cursor-pointer'} items-start gap-3 rounded-md px-2 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--hover-bg)] aria-selected:bg-[var(--hover-bg)]`}
                  >
                    <div className="mt-0.5 text-theme-500 shrink-0">
                      {redirecting === result.url ? <Loader2 size={16} className="animate-spin" /> : getTypeIcon(result.type)}
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="font-bold">{result.title}</span>
                      <span className="text-xs text-[var(--text-muted)] line-clamp-1">{result.description}</span>
                    </div>
                    {result.image && (
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-[var(--card-border)] ml-2">
                        <Image src={result.image} alt={result.title} fill className="object-cover" sizes="40px" />
                      </div>
                    )}
                  </Command.Item>
                ))}
              </Command.Group>
            )}

          </Command.List>
        </motion.div>
      </Command.Dialog>
    </>
  );
}
