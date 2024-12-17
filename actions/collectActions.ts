'use server';

import { PostgrestError } from '@supabase/supabase-js';
import { Database } from 'types_db';
import { createServerSupabaseClient } from 'utils/supabase/server';
import {
  CollectedCafeFromSupabase,
  CollectedCountFromSupabase,
} from 'types/common';

export type CollectedRow = Database['public']['Tables']['collected']['Row'];
export type CollectedRowInsert =
  Database['public']['Tables']['collected']['Insert'];
export type CollectedRowUpdate =
  Database['public']['Tables']['collected']['Update'];

function handleError(error: PostgrestError) {
  console.error(error);
  throw new Error(error.message);
}

export async function getAllCollectedCafes(
  userId: string,
  offset: number = 0,
  limit: number = 3,
): Promise<{ data: CollectedCafeFromSupabase[]; nextCursor: number | null }> {
  if (!userId || userId === 'no-user') throw new Error('유효하지 않은 유저 ID');

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('collected')
    .select('*')
    .eq('userId', userId)
    .order('created_at', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) throw new Error(error.message);

  const nextCursor = data.length === limit ? offset + limit : null;

  return { data: data ?? [], nextCursor };
}

export async function getCollectedCafe(
  id: number,
  userId: string,
): Promise<{ id: number; userId: string }[]> {
  if (!id || id === 0) throw new Error('유효하지 않은 카페 ID');
  if (!userId || userId === 'no-user') throw new Error('유효하지 않은 유저 ID');

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('collected')
    .select('id, userId')
    .eq('id', id)
    .eq('userId', userId);

  if (error) handleError(error);
  return data ?? [];
}

export async function countCollectedCafes(
  userId: string,
): Promise<CollectedCountFromSupabase> {
  if (!userId || userId === 'no-user') throw new Error('유효하지 않은 유저 ID');

  const supabase = await createServerSupabaseClient();
  const { data, count, error } = await supabase
    .from('collected')
    .select('*', { count: 'exact' })
    .eq('userId', userId);

  if (error) handleError(error);
  return { data, count };
}

export async function createCollectedCafe(
  collected: CollectedRowInsert,
): Promise<void> {
  if (!collected) throw new Error('유효하지 않은 카페 데이터 전송');

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('collected').insert({
    ...collected,
    created_at: new Date().toISOString(),
  });

  if (error) handleError(error);
}

export async function updateCollectedCafe(
  collected: CollectedRowUpdate,
  id: number | undefined,
  userId: string,
): Promise<void> {
  if (!collected) throw new Error('유효하지 않은 카페 데이터 전송');
  if (!id || id === 0) throw new Error('유효하지 않은 카페 ID');
  if (!userId || userId === 'no-user') throw new Error('유효하지 않은 유저 ID');

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from('collected')
    .update({
      ...collected,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('userId', userId);

  if (error) handleError(error);
}
