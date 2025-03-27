'use server';

import { Database } from 'types_db';
import { createServerSupabaseClient } from 'utils/supabase/server';
import { CollectedCafeFromSupabase } from 'types/common';
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

/** 모든 수집한 카페 */
export async function getAllCollectedCafes(
  userId: string,
  offset: number = 0,
  limit: number = 4,
): Promise<{ data: CollectedCafeFromSupabase[]; nextCursor: number | null }> {
  if (!userId || userId === 'no-user') throw new Error('유효하지 않은 유저 ID');

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('collected')
    .select('*')
    .eq('userId', userId)
    .order('created_at', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) handleError(error);

  const safeData = (data ?? []).map(item => ({
    ...item,
    openingHours: item.openingHours ?? undefined,
    phoneNum: item.phoneNum ?? undefined,
    photoUrl: item.photoUrl ?? undefined,
    concept: item.concept ?? undefined,
    cons: item.cons ?? undefined,
    pros: item.pros ?? undefined,
  }));

  const nextCursor =
    safeData && safeData.length === limit ? offset + limit : null;

  return { data: safeData, nextCursor };
}

/** 수집한 카페의 수 */
export async function countCollectedCafes(userId: string): Promise<number> {
  if (!userId || userId === 'no-user') throw new Error('유효하지 않은 유저 ID');

  const supabase = await createServerSupabaseClient();

  const { count, error } = await supabase
    .from('collected')
    .select('*', { count: 'exact' })
    .eq('userId', userId);

  if (error) handleError(error);
  return count ?? 0;
}

/** 새로운 수집 추가 */
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

/** 수집한 카페의 내용을 수정  */
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
