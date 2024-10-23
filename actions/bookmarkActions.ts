'use server';

import { PostgrestError } from '@supabase/supabase-js';
import { BookmarkedCafe } from 'types/types';
import { Database } from 'types_db';
import { createServerSupabaseClient } from 'utils/supabase/server';

export type BookmarkedRow = Database['public']['Tables']['bookmarked']['Row'];
export type BookmarkedRowInsert =
  Database['public']['Tables']['bookmarked']['Insert'];

function handleError(error: PostgrestError): void {
  console.error(error);
  throw new Error(error.message);
}

/**
 * GET all bookmarkedCafe
 */
export async function getAllBookmarked(
  userId: string
): Promise<BookmarkedCafe[]> {
  if (!userId) throw new Error('유효하지 않은 userId');

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
): Promise<BookmarkedCafe[]> {
  if (!id) throw new Error('유효하지 않은 북마크 카페 id');
  if (!userId) throw new Error('유효하지 않은 userId');

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
 * CREATE
 */
export async function createBookmarked(
  bookmarked: BookmarkedRowInsert
): Promise<void> {
  if (!bookmarked)
    throw new Error('북마크 테이블에 전달하는 데이터가 유효하지 않습니다');

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('bookmarked').insert({
    ...bookmarked,
    created_at: new Date().toISOString(),
  });

  if (error) handleError(error);
}

/**
 * DELETE
 */
export async function deleteBookmarked(
  id: string,
  userId: string
): Promise<void> {
  if (!id) throw new Error('유효하지 않은 북마크 카페 id');
  if (!userId) throw new Error('유효하지 않은 userId');

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('bookmarked')
    .delete()
    .eq('id', id)
    .eq('userId', userId);

  if (error) handleError(error);
}
