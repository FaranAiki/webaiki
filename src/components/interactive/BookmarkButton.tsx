"use client";

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { toggleBookmark } from '@/app/bookmark-actions';


const BookmarkButton = React.memo(function BookmarkButton({ 
  itemType, 
  itemId, 
  initialBookmarked,
  isLoggedIn,
  className
}: { 
  itemType: string, 
  itemId: string, 
  initialBookmarked: boolean,
  isLoggedIn: boolean,
  className?: string
}) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  if (!isLoggedIn) return null;

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    
    setIsBookmarked(!isBookmarked);
    
    const result = await toggleBookmark(itemType, itemId);
    if (result?.error) {
      setIsBookmarked(isBookmarked);
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
