'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { IServerActionResponse } from '@/types/shared/serverAction';

/**
 * 로그아웃
 * @returns 성공 여부와 메시지를 포함한 응답
 */
export async function signOut(): Promise<IServerActionResponse> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signOut();

  if (error) return { success: false, message: '로그아웃에 실패했습니다' };
  return { success: true, message: '로그아웃되었습니다' };
}
