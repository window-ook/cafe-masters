'use server';

import { Database } from 'types_db';
import { createServerSupabaseClient } from 'utils/supabase/server';
import { ISupabaseRecommendedCafe } from '@/types/supabase/recommendation';

export type RecommendationRow = Database['public']['Tables']['recommendation']['Row'];
export type RecommendationRowInsert =
  Database['public']['Tables']['recommendation']['Insert'];

/** 추천 카페 목록 조회
 * @returns 추천 카페 목록
 */
export async function getRecommendedCafes(): Promise<{ data: ISupabaseRecommendedCafe[] }> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('recommendation')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw new Error(`추천 카페 목록 조회에 실패했습니다: ${error.message}`);

  const safeData = (data ?? []).map(item => {

    return {
      ...item,
      extra_images: item.extra_images ? JSON.parse(item.extra_images) : undefined,
      categories: item.categories ? JSON.parse(item.categories) : undefined,
      opening_time: item.opening_time ?? undefined,
      phone_number: item.phone_number ?? undefined,
      menus: item.menus ?? undefined,
    };
  });

  return { data: safeData };
}

/** 추천 카페 수 조회
 * @param user_id 유저 ID
 * @returns 추천 카페 수
 */
export async function getRecommendedCafesCounts(): Promise<number> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('recommendation')
    .select('*', { count: 'exact' });

  if (error) throw new Error(error.message);

  return data?.length ?? 0;
}

/** 추천 카페 추가
 * @param cafe 카페 데이터
 */
export async function createRecommendedCafe(cafe: RecommendationRowInsert): Promise<boolean> {
  if (!cafe) throw new Error('추천 카페 추가를 위한 카페 데이터가 유효하지 않습니다.');

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from('recommendation').insert({
    ...cafe,
    created_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);
  return true;
}

/** 추천 카페 삭제
 * @param id 카페 ID
 */
export async function deleteRecommendedCafe(id: number): Promise<boolean> {
  if (!id) throw new Error('추천 카페 삭제를 위한 카페 ID가 유효하지 않습니다.');

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from('recommendation')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);

  return true;
}