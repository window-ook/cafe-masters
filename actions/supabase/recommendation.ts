'use server';

import { Database } from 'types_db';
import { createServerSupabaseClient } from 'utils/supabase/server';
import { ISupabaseRecommendedCafe } from '@/types/supabase/recommendation';

export type RecommendationRow = Database['public']['Tables']['recommendation']['Row'];
export type RecommendationRowInsert =
  Database['public']['Tables']['recommendation']['Insert'];

/** 추천 카페 조회
 * @param offset 오프셋
 * @param limit 한 번에 가져올 카페 수
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
    // JSON.parse 안전성 처리
    let extraImages;
    try {
      extraImages = item.extra_images ? JSON.parse(item.extra_images) : undefined;
    } catch (parseError) {
      console.warn('extra_images JSON 파싱 실패:', item.extra_images, parseError);
      extraImages = undefined;
    }

    return {
      ...item,
      image: item.image ?? undefined,
      extra_images: extraImages,
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

/**
 * 추천 카페 상세 조회
 * @param id 카페 ID
 * @returns 추천 카페 상세 데이터
 */
export async function getRecommendedCafeDetail(id: number): Promise<ISupabaseRecommendedCafe> {
  if (!id) throw new Error('추천 카페 상세 조회를 위한 카페 ID가 유효하지 않습니다.');

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('recommendation')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(`추천 카페 조회에 실패했습니다: ${error.message}`);
  if (!data) throw new Error('해당 추천 카페를 찾을 수 없습니다.');

  return {
    ...data,
    image: data.image ?? undefined,
    extra_images: data.extra_images ? JSON.parse(data.extra_images) : undefined,
    opening_time: data.opening_time ?? undefined,
    phone_number: data.phone_number ?? undefined,
    menus: data.menus ?? undefined,
  };
}