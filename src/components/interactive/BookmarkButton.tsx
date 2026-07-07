"use client";

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { toggleBookmark } from '@/app/bookmark-actions';


import { useAppStore } from '@/lib/store';

const BookmarkButton = React.memo(function BookmarkButton({ 
  itemType, 
  itemId, 
  className
}: { 
  itemType: string, 
  itemId: string, 
  initialBookmarked?: boolean,
  isLoggedIn?: boolean,
  className?: string
}) {
  const isLoggedInState = useAppStore(state => state.isLoggedIn);
  const globalBookmarks = useAppStore(state => state.bookmarks);
  const setBookmarks = useAppStore(state => state.setBookmarks);
  
  const isBookmarked = globalBookmarks.some(b => b.itemType === itemType && b.itemId === itemId);
  const [loading, setLoading] = useState(false);

  if (!isLoggedInState) return null;

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    
    // Optimistic update
    const newBookmarks = isBookmarked 
      ? globalBookmarks.filter(b => !(b.itemType === itemType && b.itemId === itemId))
      : [...globalBookmarks, { itemType, itemId }];
    setBookmarks(newBookmarks);
    
    const result = await toggleBookmark(itemType, itemId);
    if (result?.error) {
      // Revert on error
      setBookmarks(globalBookmarks);
    }
    setLoading(false);
  };

  const defaultPosition = className ? '' : 'absolute top-3 right-3';

  return (
    <button
      onClick={handleToggle}
      className={`${className || ''} ${defaultPosition} p-1 transition-all duration-200 hover:scale-110 active:scale-95 z-20 flex items-center justify-center print:hidden ${
        isBookmarked 
          ? 'nav-active-gacor' 
          : 'text-foreground/40 hover:text-foreground/80'
      }`}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      <Star size={18} className={isBookmarked ? 'fill-current' : ''} />
    </button>
  );
});

export default BookmarkButton;
