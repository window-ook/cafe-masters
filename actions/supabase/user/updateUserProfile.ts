'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { IServerActionResponse } from '@/types/shared/serverAction';

export interface IUpdateUserProfileParams {
  user_id: string;
  nickname?: string;
  gender?: 'male' | 'female';
}

/**
 * 유저 프로필 업데이트
 */
export async function updateUserProfile(
  params: IUpdateUserProfileParams
): Promise<IServerActionResponse> {
  if (!params.user_id)
    return { success: false, message: '유저 ID가 유효하지 않습니다.' };

  if (!params.nickname && !params.gender)
    return { success: false, message: '업데이트할 정보가 없습니다.' };

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.id !== params.user_id)
    return { success: false, message: '인증이 필요합니다.' };

  if (params.nickname) {
    const { data: existing } = await supabase
      .from('user')
      .select('user_id')
      .eq('nickname', params.nickname)
      .neq('user_id', params.user_id)
      .maybeSingle();

    if (existing)
      return { success: false, message: '이미 사용 중인 닉네임입니다.' };
  }

  const updateData: { nickname?: string; gender?: 'male' | 'female' } = {};
  if (params.nickname) updateData.nickname = params.nickname;
  if (params.gender) updateData.gender = params.gender;

  const { error } = await supabase
    .from('user')
    .update(updateData)
    .eq('user_id', params.user_id);

  if (error)
    return { success: false, message: `프로필 업데이트 실패: ${error.message}` };

  return { success: true, message: '프로필이 업데이트되었습니다.' };
}
