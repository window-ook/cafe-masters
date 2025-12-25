'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { IServerActionResponse } from '@/types/shared/serverAction';

/**
 * 닉네임 중복 체크
 * @param nickname 확인할 닉네임
 */
export async function checkNicknameAvailability(
  nickname: string
): Promise<IServerActionResponse<{ available: boolean }>> {
  if (!nickname)
    return { success: false, message: '닉네임을 입력해주세요.' };

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('user')
    .select('nickname')
    .eq('nickname', nickname)
    .maybeSingle();

  if (error)
    return { success: false, message: `닉네임 확인 실패: ${error.message}` };

  const available = !data;

  return {
    success: true,
    data: { available },
    message: available ? '사용 가능한 닉네임입니다.' : '이미 사용 중인 닉네임입니다.',
  };
}
