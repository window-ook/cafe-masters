'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { ISearchCafeDetail } from '@/types/kakao-map';
import { CafeDetailInsert } from '@/actions/supabase/cafe-details';


/** 카페 상세 정보를 Supabase에 저장하는 서버 액션 */
export async function createCafeDetail(
  cafeId: string,
  crawledDetail: ISearchCafeDetail,
): Promise<boolean> {
  const supabase = await createServerSupabaseClient();

  if (!cafeId || typeof cafeId !== 'string' || cafeId.trim() === '') throw new Error('유효한 카페 ID가 필요합니다.');
  if (!crawledDetail || typeof crawledDetail !== 'object') throw new Error('유효한 크롤링 데이터가 필요합니다.');
  const cafeIdNum = parseInt(cafeId.trim(), 10);
  if (isNaN(cafeIdNum)) throw new Error('카페 ID는 숫자여야 합니다.');

  try {
    // 데이터 변환: ISearchCafeDetail -> Supabase 형식으로
    const insertData: CafeDetailInsert = {
      id: cafeIdNum,
      image: crawledDetail.image || null,
      extra_images: JSON.stringify(crawledDetail.extra_images || []),
      opening_time: JSON.stringify(crawledDetail.opening_time || []),
      created_at: new Date().toISOString(),
    };

    // 기존 데이터 확인 및 업데이트/삽입
    const { data: existingData } = await supabase
      .from('cafe_details')
      .select('id')
      .eq('id', cafeIdNum)
      .maybeSingle();

    let result = false;

    if (existingData) {
      result = false;
    } else {
      const { error } = await supabase
        .from('cafe_details')
        .insert(insertData)
        .select()
        .single();

      if (error) throw new Error(`카페 상세정보 저장에 실패했습니다: ${error.message}`);

      result = true;
    }

    return result;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('카페 상세정보 저장 중 예상치 못한 오류가 발생했습니다.');
  }
}