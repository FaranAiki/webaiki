"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Command } from 'lucide-react';

export type SearchScope = 'all' | 'current' | 'some' | string;

interface SearchBarProps {
  scope?: SearchScope;
  placeholder?: string;
  className?: string;
  dict: Record<string, string>;
  onSearch?: (query: string, scope: SearchScope) => void;
}

export default function SearchBar({ 
  scope = 'all', 
  placeholder, 
  className = "", 
  dict,
  onSearch 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query, scope);
    } else {
      // Default behavior: maybe redirect to a search page or console log
      console.log(`Searching for "${query}" in scope: ${scope}`);
    }
  };

  const clearSearch = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  // Keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`relative w-full max-w-2xl mx-auto ${className}`}>
      <form 
        onSubmit={handleSearch}
        className={`
          relative flex items-center transition-all duration-300 ease-in-out
          bg-theme-surface-strong border rounded-2xl overflow-hidden
          ${isFocused ? 'border-theme-500 shadow-theme-shadow ring-1 ring-theme-500/20' : 'border-theme-border'}
        `}
      >
        <div className="pl-4 text-theme-muted group-hover:text-theme-500 transition-colors">
          <Search size={20} />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder || dict.Word_Search || "Search..."}
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
          
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-theme-surface border border-theme-border text-[10px] font-bold text-theme-muted">
            <Command size={10} />
            <span>K</span>
          </div>
        </div>
      </form>

      {/* Scope Indicator (Subtle) */}
      <div className="mt-2 flex justify-center gap-4 text-[10px] font-bold tracking-widest text-theme-muted">
        <span className={scope === 'all' ? 'text-theme-500' : ''}>{dict.All || 'All'}</span>
        {scope === 'some' && (
          <span className="text-theme-500">{dict.Some || 'Some'}</span>
        )}
        {scope !== 'all' && scope !== 'current' && scope !== 'some' && (
          <span className="text-theme-500">{typeof scope === 'string' ? scope : 'Specific'}</span>
        )}
        <span className={scope === 'current' ? 'text-theme-500' : ''}>{dict.Current_Page || 'Current Page'}</span>
      </div>
    </div>
  );
}
