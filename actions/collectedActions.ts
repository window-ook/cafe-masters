'use server';

import { Database } from 'types_db';
import { createServerSupabaseClient } from 'utils/supabase/server';
import { CollectedCafe, CollectedCount } from 'types/types';
import { PostgrestError } from '@supabase/supabase-js';

export type CollectedRow = Database['public']['Tables']['collected']['Row'];
export type CollectedRowInsert =
  Database['public']['Tables']['collected']['Insert'];
export type CollectedRowUpdate =
  Database['public']['Tables']['collected']['Update'];

function handleError(error: PostgrestError) {
  console.error(error);
  throw new Error(error.message);
}

/**
 * GET all collectedCafe
 */
export async function getAllCollected(
  userId: string
): Promise<CollectedCafe[]> {
  if (!userId) throw new Error('유효하지 않은 userId');

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('collected')
    .select('*')
    .eq('userId', userId)
    .order('created_at', { ascending: true });

  if (error) handleError(error);
  return data ?? [];
}

/**
 * GET 1 collectedCafe (서브)
 */
export async function getCollected(
  id: string,
  userId: string
): Promise<CollectedCafe[]> {
  if (!id) throw new Error('유효하지 않은 북마크 카페 id');
  if (!userId) throw new Error('유효하지 않은 userId');

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('collected')
    .select('*')
    .eq('userId', userId)
    .eq('id', id);

  if (error) handleError(error);
  return data ?? [];
}

/**
 * GET collected count
 */
export async function countCollected(userId: string): Promise<CollectedCount> {
  if (!userId) throw new Error('유효하지 않은 userId');

  const supabase = await createServerSupabaseClient();
  const { data, count, error } = await supabase
    .from('collected')
    .select('*', { count: 'exact' })
    .eq('userId', userId);

  if (error) handleError(error);
  return { data, count };
}

/**
 * CREATE
 */
export async function createCollected(
  collected: CollectedRowInsert
): Promise<void> {
  if (!collected)
    throw new Error('수집한 카드 테이블에 전달하는 데이터가 유효하지 않습니다');

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('collected').insert({
    ...collected,
    created_at: new Date().toISOString(),
  });

  if (error) handleError(error);
}

/**
 * UPDATE
 */
export async function updateCollected(
  collected: CollectedRowUpdate,
  id: string,
  userId: string
): Promise<void> {
  if (!collected)
    throw new Error('수집한 카드 테이블에 전달하는 데이터가 유효하지 않습니다');
  if (!id) throw new Error('유효하지 않은 북마크 카페 id');
  if (!userId) throw new Error('유효하지 않은 userId');

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('collected')
    .update({
      ...collected,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('userId', userId);

  if (error) handleError(error);
}
