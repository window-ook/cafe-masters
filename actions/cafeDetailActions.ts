'use server';

// GET DE
export async function cafeDetail(id) {
  const response = await fetch(`https://place.map.kakao.com/main/v/${id}`, {
    method: 'GET',
  });

  if (!response.ok) console.error(`${response.status}, ${response.text}`);

  const data: any = await response.json();
  return data;
}
