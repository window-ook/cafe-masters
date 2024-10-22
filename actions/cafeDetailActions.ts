'use server';

/**
 * GET cafeDetail by KAKAO MAP searching
 */
export async function cafeDetail(id: string): Promise<unknown> {
  const response = await fetch(`https://place.map.kakao.com/main/v/${id}`, {
    method: 'GET',
  });

  if (!response.ok) console.error(`${response.status}, ${response.text}`);

  const data = await response.json();
  return data;
}
