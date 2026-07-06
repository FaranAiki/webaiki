"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, ArrowRight, Layout, FileCheck, Award, Briefcase, Code, Users, HelpCircle, Info } from 'lucide-react';
import { searchContent, getSuggestions, SearchResult } from '@/app/search-actions';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppStore } from '@/lib/store';

export type SearchScope = 'all' | 'current' | 'some' | string;

interface SearchBarProps {
  scope?: SearchScope;
  placeholder?: string;
  className?: string;
  dict: import('@/components/layout/Translator').TranslationDict;
  onSearch?: (query: string, scope: SearchScope) => void;
}

const HighlightText = ({ text, query }: { text: string; query: string }) => {
  if (!query.trim()) return <>{text}</>;

  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);
  if (terms.length === 0) return <>{text}</>;

  const regex = new RegExp(`(${terms.join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => (
        regex.test(part) ? (
          <span key={i} className="text-theme-500 font-black underline decoration-theme-500/30 underline-offset-2">{part}</span>
        ) : (
          part
        )
      ))}
    </>
  );
};

export default function SearchBar({
  scope = 'all',
  placeholder,
  className = "",
  dict,
  onSearch
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const navSourceRef = useRef<'keyboard' | 'mouse' | null>(null);
  const isMovingMouseRef = useRef(false);
  const lastInteractionRef = useRef<number>(0);
  const params = useParams();
  const router = useRouter();
  const lang = params?.lang as string || 'id';
  const setScrollLocked = useAppStore((state) => state.setScrollLocked);

  const isFocusedRef = useRef(isFocused);
  const resultsRef = useRef(results);
  const selectedIndexRef = useRef(selectedIndex);
  const suggestionsRef = useRef(suggestions);

  useEffect(() => {
    isFocusedRef.current = isFocused;
    resultsRef.current = results;
    selectedIndexRef.current = selectedIndex;
    suggestionsRef.current = suggestions;

    // Scroll into view logic - ONLY for keyboard navigation
    if (isFocused && selectedIndex >= 0 && itemRefs.current[selectedIndex] && navSourceRef.current === 'keyboard') {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [isFocused, results, selectedIndex, suggestions]);

  useEffect(() => {
    const handleGlobalMouseMove = () => {
      isMovingMouseRef.current = true;
      lastInteractionRef.current = Date.now();

      // Reset after a short delay of no movement
      const timeout = setTimeout(() => {
        if (Date.now() - lastInteractionRef.current >= 100) {
          isMovingMouseRef.current = false;
        }
      }, 150);

      return () => clearTimeout(timeout);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  const navigateToResult = useCallback((result: SearchResult) => {
    const url = result.url;
    if (url.startsWith('http')) {
      window.open(url, '_blank');
    } else {
      router.push(url);
    }
    setIsFocused(false);
  }, [router]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const activeItems = query.trim().length >= 2 ? results : suggestions;
    if (selectedIndex >= 0 && activeItems[selectedIndex]) {
      navigateToResult(activeItems[selectedIndex]);
    } else if (activeItems.length > 0) {
      navigateToResult(activeItems[0]);
    } else if (onSearch) {
      onSearch(query, scope);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const fetchSuggestions = async () => {
      try {
        const suggs = await getSuggestions(lang, 5);
        setSuggestions(suggs);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      }
    };
    fetchSuggestions();
  }, [lang, mounted]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        try {
          const searchResults = await searchContent(query, lang);
          setResults(searchResults);
          setSelectedIndex(searchResults.length > 0 ? 0 : -1);
        } catch (error) {
          console.error("Search failed:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        // Set to 0 if there are suggestions, otherwise -1
        setSelectedIndex(suggestions.length > 0 ? 0 : -1);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, lang, suggestions]);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        return;
      }

      if (!isFocusedRef.current) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        navSourceRef.current = 'keyboard';
        const activeItems = query.trim().length >= 2 ? resultsRef.current : suggestionsRef.current;
        setSelectedIndex(prev => (prev < activeItems.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        navSourceRef.current = 'keyboard';
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === 'Enter') {
        const activeItems = query.trim().length >= 2 ? resultsRef.current : suggestionsRef.current;
        if (selectedIndexRef.current >= 0 && activeItems[selectedIndexRef.current]) {
          e.preventDefault();
          navigateToResult(activeItems[selectedIndexRef.current]);
        } else if (activeItems.length > 0) {
          e.preventDefault();
          navigateToResult(activeItems[0]);
        }
      } else if (e.key === 'Escape') {
        setIsFocused(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateToResult, query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock scroll when results are open and there are results
  useEffect(() => {
    const shouldLock = isFocused && (query.trim().length >= 2);
    setScrollLocked(shouldLock);
    return () => setScrollLocked(false);
  }, [isFocused, query, setScrollLocked]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'page': return <Layout size={12} />;
      case 'work': return <Briefcase size={12} />;
      case 'project': return <Code size={12} />;
      case 'organization': return <Users size={12} />;
      case 'award': return <Award size={12} />;
      case 'certificate': return <FileCheck size={12} />;
      case 'faq': return <HelpCircle size={12} />;
      case 'other': return <Info size={12} />;
      default: return <Search size={12} />;
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full max-w-2xl mx-auto z-1 ${className}`}>
      <form
        onSubmit={handleSearch}
        className={`
          relative flex items-center transition-all duration-300 ease-in-out
          bg-theme-surface-strong border rounded-2xl overflow-hidden
          ${isFocused ? 'border-theme-500 shadow-theme-shadow ring-1 ring-theme-500/20' : 'border-theme-border'}
        `}
      >
        <div className="pl-4 text-theme-muted group-hover:text-theme-500 transition-colors">
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
        </div>

        <input
          id="search-input"
          name="search-input"
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder || dict.Search_Placeholder || "Search ...."}
          className="w-full py-4 px-4 bg-transparent outline-none text-theme-text placeholder:text-theme-muted font-medium"
        />

        <div className="pr-4 flex items-center gap-2">
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="button"
                onClick={clearSearch}
                className="p-1 hover:bg-theme-surface rounded-full text-theme-muted hover:text-theme-text transition-colors"
              >
                <X size={16} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </form>

      {/* Results Dropdown */}
      <AnimatePresence>
        {mounted && isFocused && (query.trim().length >= 2 || (query.trim().length < 2 && suggestions.length > 0)) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            data-lenis-prevent
            style={{ overscrollBehavior: 'contain' }}
            className="absolute top-full left-0 right-0 mt-2 bg-theme-surface-strong border border-theme-border rounded-2xl shadow-theme-shadow overflow-hidden max-h-[45vh] overflow-y-auto"
          >
            {(() => {
              const activeItems = query.trim().length >= 2 ? results : suggestions;
              const isDisplayingSuggestions = query.trim().length < 2 && activeItems.length > 0;

              if (activeItems.length > 0) {
                return (
                  <div className="py-2">
                    {isDisplayingSuggestions && (
                      <div className="px-4 py-2 text-sm font-black tracking-[0.2em] text-theme-muted/50 border-b border-theme-border/50 mb-1">
                        {dict.Suggestions || "Suggestions"}
                      </div>
                    )}
                    {activeItems.map((result, index) => {
                      const typeLabel = dict[result.type.charAt(0).toUpperCase() + result.type.slice(1)] || result.type;
                      return (
                        <button
                          key={`${result.type}-${result.url}-${result.title}-${index}`}
                          ref={el => { itemRefs.current[index] = el; }}
                          onClick={() => navigateToResult(result)}
                          onMouseEnter={() => {
                            if (isMovingMouseRef.current) {
                              navSourceRef.current = 'mouse';
                              setSelectedIndex(index);
                            }
                          }}
                          className={`w-full text-left px-4 py-3 transition-colors group border-b border-theme-border last:border-0 flex items-center justify-between gap-4
                            ${selectedIndex === index ? 'bg-theme-surface' : 'hover:bg-theme-surface'}
                          `}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {/* Thumbnail */}
                            {(result.image || result.type === 'certificate') && (
                              <div className="w-12 h-8 relative rounded-md overflow-hidden bg-theme-surface border border-theme-border flex-shrink-0">
                                {result.image ? (
                                  <Image
                                    src={result.image}
                                    alt={result.title}
                                    fill
                                    className="object-cover"
                                    sizes="48px"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-theme-muted">
                                    <FileCheck size={16} />
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                <div className="flex items-center gap-1">
                                  <span className="text-theme-500 scale-75">{getTypeIcon(result.type)}</span>
                                  <span className="text-xs font-bold text-theme-500 tracking-widest capitalize">{typeLabel}</span>
                                </div>
                                {result.date && (
                                  <span className="text-xs font-medium text-theme-muted">• {result.date}</span>
                                )}
                                {result.company && (
                                  <span className="text-xs text-theme-muted truncate max-w-[150px]">• {result.company}</span>
                                )}
                              </div>
                              <h4 className={`text-sm font-black transition-colors truncate
                                ${selectedIndex === index ? 'text-theme-500' : 'text-theme-text group-hover:text-theme-500'}
                              `}>
                                <HighlightText text={result.title} query={query} />
                              </h4>
                              <p className="text-xs text-theme-muted line-clamp-1 mb-1">
                                <HighlightText text={Array.isArray(result.description) ? result.description.join(' ') : result.description} query={query} />
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <ArrowRight size={14} className={`transition-all ${selectedIndex === index ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              } else {
                return (
                  <div className="p-8 text-center text-theme-muted text-sm">
                    {isLoading ? dict.Search_Placeholder || "Searching ...." : dict.Not_Found || "No results found."}
                  </div>
                );
              }
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scope Indicator (Subtle) */}
      {/*
      <div className="mt-2 flex justify-center gap-4 text-sm font-bold tracking-widest text-theme-muted">
        <span className={scope === 'all' ? 'text-theme-500' : ''}>{dict.All || 'All'}</span>
        {scope === 'some' && (
          <span className="text-theme-500">{dict.Some || 'Some'}</span>
        )}
        {scope !== 'all' && scope !== 'current' && scope !== 'some' && (
          <span className="text-theme-500">{typeof scope === 'string' ? scope : 'Specific'}</span>
        )}
        <span className={scope === 'current' ? 'text-theme-500' : ''}>{dict.Current_Page || 'Current Page'}</span>
      </div>
      */}
    </div>
  );
}
