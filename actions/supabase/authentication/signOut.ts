'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';

/**
 * 로그아웃
 * @returns 성공 여부
*/
export async function signOut(): Promise<boolean> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signOut();

  if (error) throw new Error('로그아웃에 실패했습니다');

  return true;
}
