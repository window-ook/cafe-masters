'use server';

import { createServerSupabaseClient } from 'utils/supabase/server';

/** 현재 유저 ID 조회
 * @description Authentication에 있는 유저 ID를 조회 = 각 테이블 user_id와 동일
 * @returns 유저 ID
 */
export async function getCurrentUserId(): Promise<string> {
  const supabase = await createServerSupabaseClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) throw new Error('유저 ID가 존재하지 않습니다.');

  return user.id;
}

/** 관리자 여부 조회
 * @param user_id 유저 ID
 * @returns 관리자 여부
 */
export async function getAdminUser(user_id: string): Promise<boolean> {
  if (!user_id) throw new Error('유저 ID가 유효하지 않습니다.');

  const trimmedUserId = user_id.trim();

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('user')
    .select('user_id, admin')
    .eq('user_id', trimmedUserId)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data?.admin === true;
}