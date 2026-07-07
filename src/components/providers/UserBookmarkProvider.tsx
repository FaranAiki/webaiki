"use client";

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { getMyBookmarks } from '@/app/bookmark-actions';
import { createClient } from '@/utils/supabase/client';

export default function UserBookmarkProvider() {
  const setIsLoggedIn = useAppStore((state) => state.setIsLoggedIn);
  const setBookmarks = useAppStore((state) => state.setBookmarks);

  useEffect(() => {
    const initData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsLoggedIn(true);
        const bookmarks = await getMyBookmarks();
        setBookmarks(bookmarks.map(b => ({ itemType: b.itemType, itemId: b.itemId })));
      } else {
        setIsLoggedIn(false);
        setBookmarks([]);
      }
    };
    initData();
  }, [setIsLoggedIn, setBookmarks]);

  return null;
}
