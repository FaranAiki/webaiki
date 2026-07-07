'use server';

import { db } from '@/lib/db';
import { bookmarks } from '@/lib/schema';
import { createClient } from '@/utils/supabase/server';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function toggleBookmark(itemType: string, itemId: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'Require_Login' };
    }

    const existingBookmark = await db.query.bookmarks.findFirst({
      where: and(
        eq(bookmarks.userId, user.id),
        eq(bookmarks.itemType, itemType),
        eq(bookmarks.itemId, itemId)
      ),
    });

    if (existingBookmark) {
      await db.delete(bookmarks).where(eq(bookmarks.id, existingBookmark.id));
      revalidatePath('/', 'layout');
      return { success: true, action: 'removed' };
    } else {
      await db.insert(bookmarks).values({
        id: crypto.randomUUID(),
        userId: user.id,
        itemType,
        itemId,
      });
      revalidatePath('/', 'layout');
      return { success: true, action: 'added' };
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    return { error: 'Something went wrong' };
  }
}

export async function getBookmarks(userId: string) {
  try {
    return await db.query.bookmarks.findMany({
      where: eq(bookmarks.userId, userId),
      orderBy: (bookmarks, { desc }) => [desc(bookmarks.createdAt)],
    });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return [];
  }
}

export async function getMyBookmarks() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return [];
    }

    return await getBookmarks(user.id);
  } catch (error) {
    console.error('Error in getMyBookmarks:', error);
    return [];
  }
}
