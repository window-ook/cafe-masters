'use server';

/**
 * GET cafeDetail by KAKAO MAP searching
 */
export async function cafeDetail(id: string): Promise<unknown> {
  if (!id)
    throw new Error('해당 카페의 id (basicinfo.cid)가 유효하지 않습니다');

  const response = await fetch(`https://place.map.kakao.com/main/v/${id}`, {
    method: 'GET',
  });

  if (!response.ok) console.error(`${response.status}, ${response.text}`);

  const data = await response.json();
  return data;
}
