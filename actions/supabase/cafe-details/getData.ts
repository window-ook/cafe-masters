'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { CafeDetailRow } from '@/actions/supabase/cafe-details';

/**
 * 카페 상세 정보를 조회하는 서버 액션
 * @param cafeId 카페 ID
 * @returns 카페 상세 정보 또는 null
 */
export async function getCafeDetail(cafeId: string): Promise<CafeDetailRow | null> {
  if (!cafeId || typeof cafeId !== 'string' || cafeId.trim() === '') throw new Error('유효한 카페 ID가 필요합니다.');

  const cafeIdNum = parseInt(cafeId.trim(), 10);
  if (isNaN(cafeIdNum)) throw new Error('카페 ID는 숫자여야 합니다.');

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('cafe_details')
    .select('*')
    .eq('id', cafeIdNum)
    .maybeSingle();

  if (error) throw new Error(`카페 상세정보 조회에 실패했습니다: ${error.message}`);

  return data;
}