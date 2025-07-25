'use server';

import { Database } from 'types_db';
import { createServerSupabaseClient } from 'utils/supabase/server';
import { ISupabaseRecommendedCafe } from '@/types/supabase/recommendation';

export type RecommendationRow = Database['public']['Tables']['recommendation']['Row'];
export type RecommendationRowInsert =
  Database['public']['Tables']['recommendation']['Insert'];

/** 모든 추천 카페
 * @param offset 오프셋
 * @param limit 한 번에 가져올 카페 수
 * @returns 추천 카페 목록
 */
export async function getRecommendationCafes(offset: number = 0, limit: number = 4)
  : Promise<{ data: ISupabaseRecommendedCafe[]; nextCursor: number | null }> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('recommendation')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);

  const safeData = (data ?? []).map(item => ({
    ...item,
    image: item.image ?? undefined,
    extra_images: item.extra_images ? JSON.parse(item.extra_images) : undefined,
    opening_time: item.opening_time ?? undefined,
    phone_number: item.phone_number ?? undefined,
    menus: item.menus ?? undefined,
  }));

  const nextCursor = data && data.length === limit ? offset + limit : null;

  return { data: safeData, nextCursor };
}

/** 새로운 추천 카페 추가
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

/** 선택한 추천 카페 삭제
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
