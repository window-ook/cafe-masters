'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { CafeDetailRow } from '@/actions/supabase/cafe-details';

/** 카페 상세 정보를 조회하는 서버 액션 */
export async function getCafeDetail(cafeId: string): Promise<CafeDetailRow | null> {
  const supabase = await createServerSupabaseClient();

  if (!cafeId || typeof cafeId !== 'string' || cafeId.trim() === '') throw new Error('유효한 카페 ID가 필요합니다.');
  const cafeIdNum = parseInt(cafeId.trim(), 10);
  if (isNaN(cafeIdNum)) throw new Error('카페 ID는 숫자여야 합니다.');

  try {
    const { data, error } = await supabase
      .from('cafe_details')
      .select('*')
      .eq('id', cafeIdNum)
      .maybeSingle();

    if (error) throw new Error(`카페 상세정보 조회에 실패했습니다: ${error.message}`);

    return data;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('카페 상세정보 조회 중 예상치 못한 오류가 발생했습니다.');
  }
}