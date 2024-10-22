'use server';

import { Database } from 'types_db';
import { createServerSupabaseClient } from 'utils/supabase/server';

export type BookmarkedRow = Database['public']['Tables']['bookmarked']['Row'];
export type BookmarkedRowInsert =
  Database['public']['Tables']['bookmarked']['Insert'];

function handleError(error): void {
  console.error(error);
  throw new Error(error.message);
}

/**
 * GET all bookmarkedCafe
 */
export async function getAllBookmarked(
  userId: string
): Promise<any[] | undefined> {
  if (!userId) {
    console.error('유효하지 않은 userId');
    return;
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('bookmarked')
    .select('*')
    .eq('userId', userId)
    .order('created_at', { ascending: true });

  if (error) handleError(error);
  return data ?? [];
}

/**
 * GET 1 bookmarkedCafe
 */
export async function getBookmarked(
  id: string,
  userId: string
): Promise<any[] | undefined> {
  if (!userId) {
    console.error('유효하지 않은 userId');
    return;
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('bookmarked')
    .select('*')
    .eq('userId', userId)
    .eq('id', id);

  if (error) handleError(error);
  return data ?? [];
}

/**
 * CREATE BOOKMARKED
 */
export async function createBookmarked(
  bookmarked: BookmarkedRowInsert
): Promise<void> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('bookmarked').insert({
    ...bookmarked,
    created_at: new Date().toISOString(),
  });

  if (error) handleError(error);
}

/**
 * DELETE BOOKMARKED
 */
export async function deleteBookmarked(
  id: string,
  userId: string
): Promise<void> {
  if (!userId) {
    console.error('유효하지 않은 userId');
    return;
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('bookmarked')
    .delete()
    .eq('id', id)
    .eq('userId', userId);

  if (error) handleError(error);
}
