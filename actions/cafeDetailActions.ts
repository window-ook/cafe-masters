'use server';

import { FetchedCafeDetail } from 'types/common';

/**
 * GET cafeDetail by KAKAO MAP searching
 * @param id
 * @description 카카오맵 검색으로 리턴되는 카페 데이터의 id는 string
 */
export async function getCafeDetail(id: string): Promise<FetchedCafeDetail> {
  if (!id)
    throw new Error('해당 카페의 id (basicinfo.cid)가 유효하지 않습니다');

  const response = await fetch(`https://place.map.kakao.com/main/v/${id}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`${response.status}, ${errorText}`);
    throw new Error(`Failed to fetch cafe detail: ${response.status}`);
  }

  return await response.json();
}
