"use client";

import { useState } from 'react';
import { Star } from 'lucide-react';
import { toggleBookmark } from '@/app/bookmark-actions';
import { motion } from 'framer-motion';

export default function BookmarkButton({ 
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
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggle}
      className={`${className || ''} ${defaultPosition} p-2 rounded-full backdrop-blur-md transition-all shadow-md z-20 flex items-center justify-center ${
        isBookmarked 
          ? 'bg-yellow-400/20 text-yellow-500 border border-yellow-400/50' 
          : 'bg-black/30 text-white hover:bg-black/50 border border-white/20'
      }`}
    >
      <Star size={18} className={isBookmarked ? 'fill-yellow-500' : ''} />
    </motion.button>
  );
}
