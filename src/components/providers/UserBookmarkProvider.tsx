"use client";

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { getMyBookmarks } from '@/app/bookmark-actions';

export default function UserBookmarkProvider() {
  const setIsLoggedIn = useAppStore((state) => state.setIsLoggedIn);
  const setBookmarks = useAppStore((state) => state.setBookmarks);

  useEffect(() => {
    const initData = async () => {
      try {
        const res = await fetch('/api/auth/user', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setIsLoggedIn(true);
            const bookmarks = await getMyBookmarks();
            setBookmarks(bookmarks.map(b => ({ itemType: b.itemType, itemId: b.itemId })));
          } else {
            setIsLoggedIn(false);
            setBookmarks([]);
          }
        }
      } catch (e) {
        console.error("Failed to fetch bookmarks auth", e);
      }
    };
    initData();
  }, [setIsLoggedIn, setBookmarks]);

  return null;
}
