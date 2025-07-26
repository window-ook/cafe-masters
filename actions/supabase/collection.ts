'use server';

import { Database } from 'types_db';
import { createServerSupabaseClient } from 'utils/supabase/server';
import { ISupabaseCollectedCafe } from '@/types/supabase/collection';

export type CollectedRow = Database['public']['Tables']['collection']['Row'];
export type CollectedRowInsert = Database['public']['Tables']['collection']['Insert'];
export type CollectedRowUpdate = Database['public']['Tables']['collection']['Update'];

/** 수집한 카페 목록 조회
 * @param user_id 유저 ID
 * @param offset 오프셋
 * @param limit 한 번에 가져올 카페 수
 * @returns 수집한 카페 목록과 다음 커서
 */
export async function getCollectedCafes(user_id: string, offset: number = 0, limit: number = 4)
  : Promise<{ data: ISupabaseCollectedCafe[]; nextCursor: number | null }> {
  if (!user_id) throw new Error('유저 ID가 유효하지 않습니다.');

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('collection')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) throw new Error(error.message);

  const safeData = (data ?? []).map(item => ({
    ...item,
    extra_images: item.extra_images ? JSON.parse(item.extra_images) : undefined,
    opening_time: item.opening_time ?? undefined,
    phone_number: item.phone_number ?? undefined,
    eaten_menus: item.eaten_menus ?? undefined,
    categories: item.categories ? JSON.parse(item.categories) : undefined,
  }));

  const nextCursor = data && data.length === limit ? offset + limit : null;

  return { data: safeData, nextCursor };
}

/** 수집한 카페 수 조회
 * @param user_id 유저 ID
 * @returns 수집 카페 수
 */
export async function getCollectedCafesCounts(user_id: string): Promise<number> {
  if (!user_id) throw new Error('유저 ID가 유효하지 않습니다.');

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('collection')
    .select('*', { count: 'exact' })
    .eq('user_id', user_id);

  if (error) throw new Error(error.message);

  return data?.length ?? 0;
}

/** 수집한 카페 추가
 * @param cafe 카페 데이터
 */
export async function createCollectedCafe(cafe: CollectedRowInsert): Promise<boolean> {
  if (!cafe) throw new Error('수집 카페 추가를 위한 카페 데이터가 유효하지 않습니다.');

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from('collection').insert({
    ...cafe,
    created_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);

  return true;
}

/** 수집한 카페 내용 수정
 * @param cafe 수정된 카페 데이터
 * @param id 카페 ID
 * @param user_id 유저 ID
 */
export async function updateCollectedCafe(cafe: CollectedRowUpdate, id: number, user_id: string): Promise<boolean> {
  if (!cafe) throw new Error('수집 카페 수정을 위한 카페 데이터가 유효하지 않습니다.');
  if (!id || id === 0) throw new Error('수집 카페 수정을 위한 카페 ID가 유효하지 않습니다.');
  if (!user_id) throw new Error('유저 ID가 유효하지 않습니다.');

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from('collection')
    .update({
      ...cafe,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user_id);

  if (error) throw new Error(error.message);

  return true;
}
