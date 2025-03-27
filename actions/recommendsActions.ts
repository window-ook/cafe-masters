'use server';

import { Database } from 'types_db';
import { createServerSupabaseClient } from 'utils/supabase/server';
import { PostgrestError } from '@supabase/supabase-js';

export type RecommendedRow = Database['public']['Tables']['recommended']['Row'];
export type RecommendedRowInsert =
  Database['public']['Tables']['recommended']['Insert'];

function handleError(error: PostgrestError): void {
  console.error(error);
  throw new Error(error.message);
}

/** 모든 추천 카페 */
export async function getAllRecommendedCafes() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('recommended')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) handleError(error);

  const safeData = (data ?? []).map(item => ({
    ...item,
    photoUrl: item.photoUrl ?? undefined,
    photoList: item.photoList ? JSON.parse(item.photoList) : undefined,
    openingHours: item.openingHours ?? undefined,
    phoneNum: item.phoneNum ?? undefined,
    menu: item.menu ?? undefined,
  }));

  return safeData;
}

/** 추천 카페의 수 */
export async function countRecommendedCafes(): Promise<number> {
  const supabase = await createServerSupabaseClient();

  const { count, error } = await supabase
    .from('recommended')
    .select('*', { count: 'exact' });

  if (error) handleError(error);
  return count ?? 0;
}

/** 새로운 추천 카페 추가 */
export async function createRecommenedCafe(
  recommended: RecommendedRowInsert,
): Promise<void> {
  if (!recommended) throw new Error('유효하지 않은 카페 데이터 전송');

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from('recommended').insert({
    ...recommended,
    created_at: new Date().toISOString(),
  });

  if (error) handleError(error);
}

/** 선택한 추천 카페 삭제 */
export async function deleteRecommendedCafe(id: number) {
  if (!id) throw new Error('유효하지 않은 카페 ID');

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from('recommended').delete().eq('id', id);

  if (error) handleError(error);
}
