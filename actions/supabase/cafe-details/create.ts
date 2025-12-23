'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { ISearchCafeDetail } from '@/types/kakao-map';
import { CafeDetailInsert } from '@/actions/supabase/cafe-details';

/**
 * 카페 상세 정보 추가
 * @param cafeId 카페 ID
 * @param scrapedDetail 스크래핑된 카페 상세 정보
 * @returns 성공 여부
 */
export async function createCafeDetail(
  cafeId: string,
  scrapedDetail: ISearchCafeDetail,
): Promise<boolean> {
  if (!cafeId || typeof cafeId !== 'string' || cafeId.trim() === '') throw new Error('유효한 카페 ID가 필요합니다.');
  if (!scrapedDetail || typeof scrapedDetail !== 'object') throw new Error('유효한 스크래핑 데이터가 필요합니다.');

  const cafeIdNum = parseInt(cafeId.trim(), 10);
  if (isNaN(cafeIdNum)) throw new Error('카페 ID는 숫자여야 합니다.');

  const supabase = await createServerSupabaseClient();

  const insertData: CafeDetailInsert = {
    id: cafeIdNum,
    image: scrapedDetail.image || null,
    extra_images: JSON.stringify(scrapedDetail.extra_images || []),
    opening_time: scrapedDetail.opening_time || null,
    created_at: new Date().toISOString(),
  };

  const { data: existingData } = await supabase
    .from('cafe_details')
    .select('id')
    .eq('id', cafeIdNum)
    .maybeSingle();

  if (existingData) return false;

  const { error } = await supabase
    .from('cafe_details')
    .insert(insertData)
    .select()
    .single();

  if (error) throw new Error(`카페 상세정보 저장에 실패했습니다: ${error.message}`);

  return true;
}