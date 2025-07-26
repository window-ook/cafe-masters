'use server';

import { Database } from 'types_db';
import { createServerSupabaseClient } from 'utils/supabase/server';
import { ISupabaseBookmarkedCafe } from '@/types/supabase/bookmark';

export type BookmarkedRow = Database['public']['Tables']['bookmark']['Row'];
export type BookmarkedRowInsert = Database['public']['Tables']['bookmark']['Insert'];

/** 북마크한 카페 조회
 * @param user_id 유저 ID
 * @param offset 오프셋
 * @param limit 한 번에 가져올 카페 수
 * @returns 북마크 카페 목록과 다음 커서
 */
export async function getBookmarkedCafes(user_id: string): Promise<{ data: ISupabaseBookmarkedCafe[] }> {
  if (!user_id) throw new Error('유저 ID가 유효하지 않습니다.');

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('bookmark')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);

  const safeData = (data ?? []).map(item => ({
    ...item,
    extra_images: item.extra_images ? JSON.parse(item.extra_images) : undefined,
    opening_time: item.opening_time ?? undefined,
    phone_number: item.phone_number ?? undefined,
    menus: item.menus ?? undefined,
  }));

  return { data: safeData };
}

/** 북마크한 카페 수 조회
 * @param user_id 유저 ID
 * @returns 북마크 카페 수
 */
export async function getBookmarkedCafesCounts(user_id: string): Promise<number> {
  if (!user_id) throw new Error('유저 ID가 유효하지 않습니다.');

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('bookmark')
    .select('*', { count: 'exact' })
    .eq('user_id', user_id);

  if (error) throw new Error(error.message);

  return data?.length ?? 0;
}

/** 북마크한 카페 추가
 * @param cafe 카페 데이터
 */
export async function createBookmarkedCafe(cafe: BookmarkedRowInsert): Promise<boolean> {
  if (!cafe) throw new Error('북마크 추가를 위한 카페 데이터가 유효하지 않습니다.');

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from('bookmark').insert({
    ...cafe,
    created_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);

  return true;
}

/** 북마크한 카페 삭제 */
export async function deleteBookmarkedCafe(id: number, user_id: string,): Promise<boolean> {
  if (!id) throw new Error('북마크 삭제를 위한 카페 ID가 유효하지 않습니다.');
  if (!user_id) throw new Error('유저 ID가 유효하지 않습니다.');

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from('bookmark')
    .delete()
    .eq('id', id)
    .eq('user_id', user_id);

  if (error) throw new Error(error.message);

  return true;
}
