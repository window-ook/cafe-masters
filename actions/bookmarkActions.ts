'use server';

import { Database } from 'types_db';
import { PostgrestError } from '@supabase/supabase-js';
import { BookmarkedCafeFromSupabase } from 'types/common';
import { createServerSupabaseClient } from 'utils/supabase/server';

export type BookmarkedRow = Database['public']['Tables']['bookmarked']['Row'];
export type BookmarkedRowInsert =
  Database['public']['Tables']['bookmarked']['Insert'];

function handleError(error: PostgrestError): void {
  console.error(error);
  throw new Error(error.message);
}

export async function getAllBookmarkedCafes(
  userId: string,
  offset: number = 0,
  limit: number = 3,
): Promise<{ data: BookmarkedCafeFromSupabase[]; nextCursor: number | null }> {
  if (!userId || userId === 'no-user') throw new Error('유효하지 않은 유저 ID');

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('bookmarked')
    .select('*')
    .eq('userId', userId)
    .order('created_at', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) handleError(error);

  const safeData = (data ?? []).map(item => ({
    ...item,
    photoList: item.photoList ? JSON.parse(item.photoList) : undefined,
    openingHours: item.openingHours ?? undefined,
    phoneNum: item.phoneNum ?? undefined,
    photoUrl: item.photoUrl ?? undefined,
    menu: item.menu ?? undefined,
  }));
  const nextCursor =
    safeData.length && safeData.length === limit ? offset + limit : null;

  return { data: safeData, nextCursor };
}

export async function getBookmarkedCafe(
  id: number,
  userId: string,
): Promise<{ id: number; userId: string }[]> {
  if (!id || id === 0) throw new Error('유효하지 않은 카페 ID');
  if (!userId || userId === 'no-user') throw new Error('유효하지 않은 유저 ID');

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('bookmarked')
    .select('id, userId')
    .eq('id', id)
    .eq('userId', userId);

  if (error) handleError(error);
  return data ?? [];
}

export async function countBookmarkedCafes(userId: string): Promise<number> {
  if (!userId || userId === 'no-user') throw new Error('유효하지 않은 유저 ID');

  const supabase = await createServerSupabaseClient();

  const { count, error } = await supabase
    .from('bookmarked')
    .select('*', { count: 'exact' })
    .eq('userId', userId);

  if (error) handleError(error);
  return count ?? 0;
}

export async function createBookmarkedCafe(
  bookmarked: BookmarkedRowInsert,
): Promise<void> {
  if (!bookmarked) throw new Error('유효하지 않은 카페 데이터 전송');

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from('bookmarked').insert({
    ...bookmarked,
    created_at: new Date().toISOString(),
  });

  if (error) handleError(error);
}

export async function deleteBookmarkedCafe(
  id: number | undefined,
  userId: string,
): Promise<void> {
  if (!id) throw new Error('유효하지 않은 카페 ID');
  if (!userId || userId === 'no-user') throw new Error('유효하지 않은 유저 ID');

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from('bookmarked')
    .delete()
    .eq('id', id)
    .eq('userId', userId);

  if (error) handleError(error);
}
