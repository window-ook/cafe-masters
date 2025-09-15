import { ISearchCafeDetail } from '@/types/kakao-map';
import { INTERNAL_PATHS } from '../paths';

/**
 * 라우트 핸들러로 카페 상세 정보를 가져오는 함수
 * @param cafeId 카페 ID
 * @returns 카페 상세정보 또는 null
 */
export async function fetchSearchCafeDetail(cafeId: string): Promise<ISearchCafeDetail | null> {
  if (!cafeId || typeof cafeId !== 'string' || cafeId.trim() === '') throw new Error('유효한 카페 ID가 필요합니다.');

  const cleanCafeId = cafeId.trim();

  try {
    const fetchUrl = process.env.NEXT_PUBLIC_BASE_URL === 'http://localhost:3000' ? INTERNAL_PATHS.CAFE_DETAIL_LOCAL : INTERNAL_PATHS.CAFE_DETAIL;
    const response = await fetch(`${fetchUrl}/${cleanCafeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      throw new Error(errorData.error || errorData.details || `API 요청 실패: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || typeof data !== 'object') throw new Error('API에서 유효하지 않은 응답을 받았습니다.');

    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') throw new Error('API 요청 시간 초과');
      throw error;
    }

    throw new Error('API 요청 중 알 수 없는 에러가 발생했습니다');
  }
}