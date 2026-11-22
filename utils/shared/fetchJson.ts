/**
 * 내부 API를 GET으로 조회해 JSON으로 돌려줍니다
 * @param path `INTERNAL_PATHS`에 등록된 API 경로
 */
export async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path, { cache: 'no-store' });

  if (!response.ok) throw new Error(`조회에 실패했습니다 (${response.status})`);

  return response.json();
}
