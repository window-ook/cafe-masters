'use server';

import { Database } from 'types_db';
import { createServerSupabaseClient } from 'utils/supabase/server';

export type BookmarkedRow = Database['public']['Tables']['bookmarked']['Row'];
export type BookmarkedRowInsert =
  Database['public']['Tables']['bookmarked']['Insert'];

function handleError(error) {
  console.error(error);
  throw new Error(error.message);
}

/**
 * GET ALL BOOKMARKED By userId (메인)
 */
export async function getAllBookmarked(userId) {
  if (!userId) throw new Error('유효하지 않은 userId');

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('bookmarked')
    .select('*')
    .eq('userId', userId)
    .order('created_at', { ascending: true });

  if (error) handleError(error);
  return data;
}

/**
 * GET BOOKMARKED By id, userId (서브)
 */
export async function getBookmarked(id, userId) {
  if (!userId) throw new Error('유효하지 않은 userId');

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('bookmarked')
    .select('*')
    .eq('userId', userId)
    .eq('id', id);

  if (error) handleError(error);
  return data;
}

/**
 * CREATE BOOKMARKED
 */
export async function createBookmarked(bookmarked: BookmarkedRowInsert) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('bookmarked').insert({
    ...bookmarked,
    created_at: new Date().toISOString(),
  });

  if (error) handleError(error);
  return data;
}

/**
 * DELETE BOOKMARKED
 */
export async function deleteBookmarked(id, userId) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('bookmarked')
    .delete()
    .eq('id', id)
    .eq('userId', userId);

  if (error) handleError(error);
  return data;
}
